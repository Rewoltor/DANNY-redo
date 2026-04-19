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


def flatten_json_to_csv(input_file='./synthetic_database_full.json', output_file='experiment_data_flat1.csv'):
    """
    Reads a nested JSON export from Firestore and converts it into a flat CSV 
    suitable for regression analysis.
    
    Structure:
    - One row per TRIAL (Long Format).
    - Participant data (demographics, personality scores) is repeated for each trial row.
    - Flattens nested box coordinates (ai_box, user_box).
    - Includes new CSV metadata fields (ground_truth, ai_probability, etc.).
    - Calculates derived variables: treatment_group_numeric, is_correct.
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
        # 1. Extract Participant-Level Data
        # --- NEW LOGIC: Recode treatmentGroup to numeric ---
        tg_str = p.get('treatmentGroup')
        # Default to 0 (control) if missing or 'control', 1 if 'treatment'
        treatment_numeric = 1 if tg_str == 'treatment' else 0
        
        participant_base = {
            'participant_id': p.get('id'),
            'userID': p.get('userID'),
            'treatmentGroup': tg_str,
            'treatment_group_numeric': treatment_numeric, # New Variable
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
        
        # 3. Extract Personality/Big5 Data (if available)
        personality = p.get('personality', {})
        big5 = personality.get('big5', {})
        participant_base['big5_conscientiousness'] = big5.get('conscientiousness')
        participant_base['big5_openness'] = big5.get('openness')
        participant_base['big5_neuroticism'] = big5.get('neuroticism')
        participant_base['big5_extroversion'] = big5.get('extroversion')
        participant_base['big5_agreeableness'] = big5.get('agreeableness')

        # 4. Process Trials
        trials_data = p.get('trials', {})
        
        if not trials_data:
            continue

        for trial_key, trial in trials_data.items():
            row = participant_base.copy()
            
            # --- Recoding Logic for Unified Response ---
            phase = trial.get('phase')
            user_response = None
            
            if phase == 'experiment':
                # Try 'final_decision' first (Treatment group).
                # If it's missing (Control group), fallback to 'response'.
                user_response = trial.get('final_decision')
                if user_response is None:
                    user_response = trial.get('response')
            else:
                # Baseline and Posttest always use 'response'
                user_response = trial.get('response')
                
            row['user_response'] = user_response
            # -------------------------------------------

            # --- NEW LOGIC: Calculate is_correct ---
            ground_truth = trial.get('csv_ground_truth_binary')
            is_correct = None
            
            # Ensure both values exist before comparison to avoid errors
            if user_response is not None and ground_truth is not None:
                try:
                    # Convert both to int to ensure safe comparison (e.g. "1" vs 1)
                    if int(user_response) == int(ground_truth):
                        is_correct = 1
                    else:
                        is_correct = 0
                except (ValueError, TypeError):
                    # If conversion fails (e.g. non-numeric response), leave as None
                    is_correct = None
            
            row['is_correct'] = is_correct
            # ---------------------------------------

            # Extract Basic Trial Data
            row.update({
                'trial_id_key': trial_key,
                'phase': phase,
                'trialNum': trial.get('trialNum'),
                'trialType': trial.get('trialType'),
                'imageID': trial.get('imageID'),
                'confidence': trial.get('confidence'),
                'time_sec': trial.get('time_sec'),
                'initial_decision': trial.get('initial_decision'),
                'decision_revised': trial.get('decision_revised_after_ai'),
                
                # Original variables for audit
                'original_response': trial.get('response'),
                'original_final_decision': trial.get('final_decision'),
                
                # Interaction metrics
                'dropdown_choice': trial.get('dropdown_choice'),
                'bbox_iou': trial.get('bbox_iou'),
                'initial_confidence': trial.get('initial_confidence'),
                'post_ai_confidence': trial.get('post_ai_confidence'),
            })

            # --- New Metadata Fields (CSV/Ground Truth) ---
            row.update({
                'csv_ground_truth_binary': trial.get('csv_ground_truth_binary'),
                'csv_ground_truth_raw': trial.get('csv_ground_truth_raw'),
                'csv_ai_prediction': trial.get('csv_ai_prediction'),
                'csv_ai_probability': trial.get('csv_ai_probability'),
                'csv_bbox_area_pct': trial.get('csv_bbox_area_pct'),
                'csv_original_image_name': trial.get('csv_original_image_name'),
                'csv_overlay_path': trial.get('csv_overlay_path'),
                # Native AI confidence (from the app logic, might differ slightly from CSV probability)
                'ai_confidence': trial.get('ai_confidence'),
                'ai_prediction': trial.get('ai_prediction'),
            })

            # --- Flatten AI Box ---
            ai_box = trial.get('ai_box')
            if isinstance(ai_box, dict):
                row['ai_box_x'] = ai_box.get('x')
                row['ai_box_y'] = ai_box.get('y')
                row['ai_box_width'] = ai_box.get('width')
                row['ai_box_height'] = ai_box.get('height')
            else:
                row['ai_box_x'] = None
                row['ai_box_y'] = None
                row['ai_box_width'] = None
                row['ai_box_height'] = None

            # --- Flatten User Box ---
            user_box = trial.get('user_box')
            if isinstance(user_box, dict):
                row['user_box_x'] = user_box.get('x')
                row['user_box_y'] = user_box.get('y')
                row['user_box_width'] = user_box.get('width')
                row['user_box_height'] = user_box.get('height')
            else:
                row['user_box_x'] = None
                row['user_box_y'] = None
                row['user_box_width'] = None
                row['user_box_height'] = None

            # Handle Timestamps
            if 'timestamp' in trial and trial['timestamp']:
                ts = trial['timestamp']
                row['timestamp_unix'] = ts.get('_seconds')
            
            all_rows.append(row)

    # 5. Convert to DataFrame and Save
    import pandas as pd

    df = pd.DataFrame(all_rows)
    
    # Define Column Order (Key variables first)
    cols = list(df.columns)
    
    priority_cols = [
        'participant_id', 'treatmentGroup', 'treatment_group_numeric', # Added numeric
        'phase', 'trialNum', 
        'user_response', 'is_correct', # Added is_correct
        'csv_ground_truth_binary', 'csv_ai_probability',
        'confidence', 'time_sec'
    ]
    
    # Filter to ensure columns exist
    priority_cols = [c for c in priority_cols if c in cols]
    
    # Move original debug columns to end
    end_cols = ['original_response', 'original_final_decision']
    end_cols = [c for c in end_cols if c in cols]
    
    remaining_cols = [c for c in cols if c not in priority_cols and c not in end_cols]

    # Reorder
    df = df[priority_cols + remaining_cols + end_cols]

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
    parser.add_argument("--input", "-i", default="./synthetic_database_full.json", help="Input JSON file (default: ./firestore_export.json)")
    parser.add_argument("--output", "-o", default="experiment_data_flat1.csv", help="Output CSV file (default: experiment_data_flat1.csv)")
    args = parser.parse_args()

    flatten_json_to_csv(input_file=args.input, output_file=args.output)