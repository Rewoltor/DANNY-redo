#!/usr/bin/env python3
"""Flatten a Firestore JSON export to CSV.

This script is self-contained and intended to be run from the
`public/Scripts` folder (or by calling the file directly). It will:
- change working directory to the script folder so relative paths work
- accept `--input` and `--output` CLI args
- try to locate another Python with `pandas` and re-run with it if
  the current interpreter doesn't have `pandas` installed.
"""

import json
import sys
import os
import argparse
import importlib
import subprocess


def _find_alternative_python_with_pandas():
    """Search common Conda/Miniconda/Anaconda envs and PATH for a Python that can import pandas."""
    candidates = []
    home = os.path.expanduser("~")
    for base in ("miniconda3", "miniforge3", "anaconda3", "miniconda"):
        envdir = os.path.join(home, base, "envs")
        if os.path.isdir(envdir):
            for name in os.listdir(envdir):
                py = os.path.join(envdir, name, "bin", "python")
                if os.path.exists(py):
                    candidates.append(py)
    # Also include system PATH pythons
    try:
        import shutil
        for pyname in ("python", "python3"):
            p = shutil.which(pyname)
            if p:
                candidates.append(p)
    except Exception:
        pass

    # Deduplicate while preserving order
    seen = set()
    candidates = [x for x in candidates if not (x in seen or seen.add(x))]

    for py in candidates:
        try:
            res = subprocess.run([py, "-c", "import pandas; print(pandas.__version__)"], capture_output=True, text=True, timeout=6)
            if res.returncode == 0:
                return py
        except Exception:
            continue
    return None


def _ensure_pandas_or_rerun():
    try:
        importlib.import_module("pandas")
        return None
    except Exception:
        # Try to find an alternative python that already has pandas and re-run
        alt = _find_alternative_python_with_pandas()
        if alt and os.path.abspath(sys.executable) != os.path.abspath(alt):
            print(f"`pandas` not found in this Python. Re-running with: {alt}")
            try:
                ret = subprocess.call([alt, __file__] + sys.argv[1:])
                sys.exit(ret)
            except Exception as e:
                print("Failed to re-run with alternative Python:", e)
                print(f"Please run with a Python that has pandas, e.g.: {alt} {__file__}")
                sys.exit(1)
        # No alternative found — show clear instructions
        print("Error: `pandas` is not installed in this Python environment.")
        print(f"Install it with: {sys.executable} -m pip install pandas")
        sys.exit(1)


def flatten_json_to_csv(input_file='./firestore_export.json', output_file='experiment_data_flat1.csv'):
    """
    Reads a nested JSON export from Firestore and converts it into a flat CSV 
    suitable for regression analysis.
    
    Structure:
    - One row per TRIAL (Long Format).
    - Participant data (demographics, personality scores) is repeated for each trial row.
    
    CRITICAL CHANGE: A new variable 'user_response' is created, which is a recoding
    of 'final_decision' (for 'experiment' phase) and 'response' (for 'baseline'/'posttest').
    """
    
    # Check if file exists
    if not os.path.exists(input_file):
        print(f"Error: File '{input_file}' not found in the current directory.")
        return

    print(f"Reading {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Handle the root 'participants' key if it exists, otherwise assume list at root
    participants = data.get('participants', data) if isinstance(data, dict) else data
    
    all_rows = []

    for p in participants:
        # 1. Extract Participant-Level Data (Demographics, Context)
        # We use .get() to handle missing fields gracefully
        participant_base = {
            'participant_id': p.get('id'),
            'userID': p.get('userID'),
            'treatmentGroup': p.get('treatmentGroup'),
            'age': p.get('age'),
            'gender': p.get('gender'),
            'education': p.get('education'),
            'residence': p.get('residence'),
            'healthcareQualification': p.get('healthcareQualification'),
            'completionStatus': p.get('completionStatus'),
            'browserInfo': p.get('browserInfo'),
            'screenResolution': p.get('screenResolution'),
            'randomizationSeed': p.get('randomizationSeed'),
        }

        # 2. Extract Cognitive Scores (if available)
        cog = p.get('cognitive', {})
        participant_base['cognitive_score'] = cog.get('score')
        # Big5 scores are currently null in the provided data, but included for completeness
        personality = p.get('personality', {})
        big5 = personality.get('big5', {})
        participant_base['big5_conscientiousness'] = big5.get('conscientiousness')
        participant_base['big5_openness'] = big5.get('openness')
        participant_base['big5_neuroticism'] = big5.get('neuroticism')
        participant_base['big5_extroversion'] = big5.get('extroversion')
        participant_base['big5_agreeableness'] = big5.get('agreeableness')

        # 3. Process Trials (The "Nested" part)
        trials_data = p.get('trials', {})
        
        if not trials_data:
            continue

        for trial_key, trial in trials_data.items():
            # Create a copy of participant data for this row
            row = participant_base.copy()
            
            # --- START: Recoding Logic for Unified Response ---
            phase = trial.get('phase')
            
            # Initialize the unified response variable
            user_response = None
            
            if phase == 'experiment':
                # In the experiment phase, the final decision is in 'final_decision'
                user_response = trial.get('final_decision')
            else:
                # In baseline and posttest, the final decision is in 'response'
                user_response = trial.get('response')

            # Add the unified response variable to the row
            row['user_response'] = user_response
            # --- END: Recoding Logic ---

            # Add specific Trial data
            row.update({
                'trial_id_key': trial_key,  # e.g., 'experiment_1'
                'phase': phase,
                'trialNum': trial.get('trialNum'),
                'trialType': trial.get('trialType'),
                'imageID': trial.get('imageID'),
                
                # Original variables kept for source verification
                'original_response': trial.get('response'),
                'original_final_decision': trial.get('final_decision'),
                
                'confidence': trial.get('confidence'),
                'time_sec': trial.get('time_sec'),
                'initial_decision': trial.get('initial_decision'),
                'decision_revised': trial.get('decision_revised_after_ai'),
                
                # AI specific fields (might be null for baseline/control)
                'ai_confidence': trial.get('ai_confidence'),
                'ai_prediction': trial.get('ai_prediction'),
                'initial_confidence': trial.get('initial_confidence'),
                'post_ai_confidence': trial.get('post_ai_confidence'),
                
                # Interaction/UI specifics
                'dropdown_choice': trial.get('dropdown_choice'),
                'bbox_iou': trial.get('bbox_iou'),
            })

            # Handle Timestamps (convert Firestore format to standard string)
            if 'timestamp' in trial and trial['timestamp']:
                ts = trial['timestamp']
                # Convert seconds + nanoseconds to a float timestamp or readable string
                # Here using seconds for simplicity
                row['timestamp_unix'] = ts.get('_seconds')
            
            all_rows.append(row)

    # 4. Convert to DataFrame and Save
    import pandas as pd

    df = pd.DataFrame(all_rows)
    
    # Reorder columns to put key analysis variables upfront and originals at the end
    cols = list(df.columns)
    
    # Define primary analysis columns
    priority_cols = ['participant_id', 'treatmentGroup', 'phase', 'trialNum', 'trial_id_key', 'user_response', 'time_sec']
    priority_cols = [c for c in priority_cols if c in cols]
    
    # Define columns to move to the end for verification
    original_cols_for_end = ['original_response', 'original_final_decision']
    original_cols_for_end = [c for c in original_cols_for_end if c in cols]
    
    # Remaining columns are everything else
    remaining_cols = [c for c in cols if c not in priority_cols and c not in original_cols_for_end]

    df = df[priority_cols + remaining_cols + original_cols_for_end]

    print(f"Processed {len(participants)} participants.")
    print(f"Generated {len(df)} rows (trials).")
    
    df.to_csv(output_file, index=False)
    print(f"Successfully saved data to: {os.path.abspath(output_file)}")

if __name__ == "__main__":
    # Run from the script directory so relative paths (default input/output)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    try:
        os.chdir(script_dir)
    except Exception:
        pass

    # Ensure pandas is available or re-run with an alternative Python that has it
    _ensure_pandas_or_rerun()

    parser = argparse.ArgumentParser(description="Flatten Firestore JSON export to CSV")
    parser.add_argument("--input", "-i", default="./firestore_export.json", help="Input JSON file (default: ./firestore_export.json)")
    parser.add_argument("--output", "-o", default="experiment_data_flat.csv", help="Output CSV file (default: experiment_data_flat.csv)")
    args = parser.parse_args()

    flatten_json_to_csv(input_file=args.input, output_file=args.output)