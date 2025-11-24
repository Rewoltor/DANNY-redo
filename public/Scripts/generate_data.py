import json
import random
import time
import string
import uuid

# This Python script generates a synthetic dataset in JSON format to simulate the 
# results of a two-group randomized controlled trial (Control vs. Treatment) for 
# medical image annotation research. It creates an equal number of participants for 
# each group, enforces specific structural differences (AI-related fields only for Treatment), 
# and injects a statistical bias to ensure the Treatment group shows higher performance and 
# confidence scores, allowing for pre-analysis testing.

# ==========================================
# CONFIGURATION
# ==========================================
CASES_PER_GROUP = 50  # 50 Control + 50 Treatment = 100 Total
OUTPUT_FILENAME = "public/synthetic_database_full.json"

# --- Statistical Bias Settings ---
# The Treatment group will have higher accuracy and confidence
# to ensure your analysis software finds a significant difference.

# Probability of Correct Answer
ACC_CONTROL = 0.60
ACC_TREATMENT = 0.85  # Treatment is significantly better

# Probability of High Confidence (5-7)
CONF_HIGH_PROB_CONTROL = 0.4
CONF_HIGH_PROB_TREATMENT = 0.8

# Cognitive/Personality Bias (Treatment gets slightly higher scores)
TRAIT_BOOST_TREATMENT = 15  # Points added to Big5/Cognitive for treatment group

# ==========================================
# CONSTANTS
# ==========================================
EDUCATION_LEVELS = ["masters", "bachelor", "elementary", "phd", "high-school"]
RESIDENCES = ["budapest", "city", "village", "county-seat"]
GENDERS = ["male", "female"]
DROPDOWN_OPTIONS = {0: "nincsen tünet", 1: "tünet"}

# Ground Truth for the 15 images (0=No Symptom, 1=Symptom)
# We use this to calculate if the user was "correct"
GROUND_TRUTH = {
    "baseline":   [0, 0, 0, 1, 1],
    "experiment": [0, 0, 1, 1, 1],
    "posttest":   [0, 0, 1, 1, 0]
}

# ==========================================
# HELPER FUNCTIONS
# ==========================================

def get_timestamp(start_time, offset_seconds):
    """Generates a Firestore-style timestamp."""
    t = start_time + offset_seconds
    seconds = int(t)
    nanos = int((t - seconds) * 1e9)
    return {"_seconds": seconds, "_nanoseconds": nanos}

def generate_id(is_treatment):
    """ID starts with '1' for Treatment, '0' for Control."""
    prefix = "1" if is_treatment else "0"
    # Generate 9 random chars
    suffix = ''.join(random.choices(string.ascii_lowercase + string.digits, k=9))
    return prefix + suffix

def get_biased_confidence(is_treatment, phase):
    """
    Generates confidence (1-7).
    Treatment group has higher confidence during 'experiment' and 'posttest'.
    """
    is_boosted = is_treatment and phase in ['experiment', 'posttest']
    prob_high = CONF_HIGH_PROB_TREATMENT if is_boosted else CONF_HIGH_PROB_CONTROL
    
    if random.random() < prob_high:
        return random.randint(5, 7)
    else:
        return random.randint(1, 4)

def generate_trials(is_treatment, group_name, start_time):
    trials = {}
    phases = ["baseline", "experiment", "posttest"]
    current_offset = 30 # Start recording trials 30s after session start
    
    for phase in phases:
        for i in range(1, 6): # 5 trials per phase
            trial_idx = i
            trial_key = f"{phase}_{i}"
            truth = GROUND_TRUTH[phase][i-1]
            
            # Simulate time taken (Treatment usually faster in experiment due to AI help)
            time_taken = random.uniform(1.0, 5.0)
            if phase == "experiment" and is_treatment:
                time_taken = random.uniform(5.0, 15.0) # Reading AI takes time
            
            current_offset += time_taken + 1.0 # Add delay between trials
            
            # Determine User Accuracy
            acc = ACC_TREATMENT if (is_treatment and phase == "experiment") else ACC_CONTROL
            user_is_correct = random.random() < acc
            user_response = truth if user_is_correct else (1 - truth)
            
            # Base Trial Object (Common fields)
            trial_obj = {
                "phase": phase,
                "trialIndex": i,
                "trialNum": i,
                "trialType": phase,
                "treatmentGroup": group_name,
                "imageID": f"/annotation/{phase if phase != 'posttest' else 'post_experiment'}/{i}.png",
                "time_sec": round(time_taken, 3),
                "timestamp": get_timestamp(start_time, current_offset)
            }

            # --- LOGIC BRANCHING ---
            
            # 1. Baseline & Posttest (Same structure for BOTH groups)
            if phase in ["baseline", "posttest"]:
                trial_obj["response"] = user_response
                trial_obj["confidence"] = get_biased_confidence(is_treatment, phase)
            
            # 2. Experiment - CONTROL Group (Simple structure)
            elif phase == "experiment" and not is_treatment:
                trial_obj["response"] = user_response
                trial_obj["confidence"] = get_biased_confidence(is_treatment, phase)
                
            # 3. Experiment - TREATMENT Group (Complex AI structure)
            elif phase == "experiment" and is_treatment:
                # AI Simulation: AI is usually correct (90%)
                ai_correct = random.random() < 0.90
                ai_pred = truth if ai_correct else (1 - truth)
                ai_conf = random.uniform(0.85, 0.99) if ai_correct else random.uniform(0.1, 0.4)
                
                initial_dec = user_response # User's gut feeling
                initial_conf = get_biased_confidence(False, phase) # Pre-AI confidence
                
                # Revision Logic: If AI disagrees, does user switch?
                final_dec = initial_dec
                revised = False
                
                if initial_dec != ai_pred:
                    # 60% chance to switch to AI if they disagree
                    if random.random() < 0.60:
                        final_dec = ai_pred
                        revised = True
                
                # Confidence usually increases after seeing AI
                post_conf = min(7, initial_conf + random.randint(0, 2))
                
                # Bounding Box Logic
                # AI has a box if it predicts 1 (Symptom)
                ai_box = None
                if ai_pred == 1:
                    ai_box = {"x": random.randint(0,100), "y": random.randint(0,100), "width": 100, "height": 100}
                
                # User has a box if final decision is 1
                user_box = None
                iou = None
                if final_dec == 1:
                    user_box = {"x": random.randint(0,100), "y": random.randint(0,100), "width": 100, "height": 100}
                    iou = random.uniform(0.0, 0.9)

                trial_obj.update({
                    "dropdown_choice": DROPDOWN_OPTIONS[initial_dec], # Matches initial gut feeling
                    "initial_confidence": initial_conf,
                    "post_ai_confidence": post_conf,
                    "ai_prediction": ai_pred,
                    "ai_confidence": ai_conf,
                    "initial_decision": initial_dec,
                    "final_decision": final_dec,
                    "decision_revised_after_ai": revised,
                    "ai_box": ai_box,
                    "user_box": user_box,
                    "bbox_iou": iou
                })

            trials[trial_key] = trial_obj

    return trials

def create_participant(is_treatment):
    group_name = "treatment" if is_treatment else "control"
    p_id = generate_id(is_treatment)
    start_time = time.time() - random.randint(0, 100000) # Random start in past
    
    # Personality / Cognitive Scores
    # Apply bias: Treatment group gets higher scores on average
    bias = TRAIT_BOOST_TREATMENT if is_treatment else 0
    
    # Generate Cognitive (q1-q10, values 1-6)
    cog_responses = {f"q{k}": random.randint(3, 6) if is_treatment else random.randint(1, 5) for k in range(1, 11)}
    cog_score = random.randint(6, 10) if is_treatment else random.randint(2, 8) # 0-10 score
    
    # Generate Personality (q1-q100, values "1"-"5")
    pers_responses = {f"q{k}": str(random.randint(1, 5)) for k in range(1, 101)}
    
    # Big 5 (0-100)
    big5 = {
        "conscientiousness": min(100, random.randint(40, 80) + bias),
        "openness": min(100, random.randint(40, 80) + bias),
        "neuroticism": max(0, random.randint(30, 70) - bias), # Lower neuroticism for treatment?
        "extroversion": random.randint(20, 90),
        "agreeableness": random.randint(30, 90)
    }

    return {
        "id": p_id,
        "userID": p_id,
        "treatmentGroup": group_name,
        "randomizationSeed": random.randint(100000, 999999),
        "sessionActive": True,
        "browserInfo": "Synthetic Generator 2.0",
        "screenResolution": "1920x1080",
        "age": random.choice(["18-25", "26-35", "36-45"]),
        "gender": random.choice(GENDERS),
        "education": random.choice(EDUCATION_LEVELS),
        "residence": random.choice(RESIDENCES),
        "healthcareQualification": "none",
        "completionStatus": "completed",
        "createdAt": get_timestamp(start_time, 0),
        "sessionStartTime": get_timestamp(start_time, 0),
        "personality": {
            "responses": pers_responses,
            "savedAt": get_timestamp(start_time, 120),
            "big5": big5
        },
        "cognitive": {
            "score": cog_score,
            "responses": cog_responses,
            "savedAt": get_timestamp(start_time, 240)
        },
        "currentPhase": "posttest", # Completed
        "trials": generate_trials(is_treatment, group_name, start_time),
        "lastTrialAt": get_timestamp(start_time, 600)
    }

def main():
    participants = []
    
    # Generate Control
    print(f"Generating {CASES_PER_GROUP} Control participants...")
    for _ in range(CASES_PER_GROUP):
        participants.append(create_participant(is_treatment=False))
        
    # Generate Treatment
    print(f"Generating {CASES_PER_GROUP} Treatment participants...")
    for _ in range(CASES_PER_GROUP):
        participants.append(create_participant(is_treatment=True))
        
    # Shuffle to mix them in the database (optional, but looks more realistic)
    random.shuffle(participants)
    
    final_db = {"participants": participants}
    
    with open(OUTPUT_FILENAME, 'w', encoding='utf-8') as f:
        json.dump(final_db, f, indent=2, ensure_ascii=False)
        
    print(f"Done! Saved to {OUTPUT_FILENAME}")

if __name__ == "__main__":
    main()