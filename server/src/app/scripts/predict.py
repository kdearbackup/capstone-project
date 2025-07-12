import sys
import pandas as pd
import pickle
import json
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(SCRIPT_DIR, 'salary_predictor.pkl')

def predict_salary(role, job_title, location):
    try:
        # model_path = 'salary_predictor.pkl'
        with open(MODEL_PATH, 'rb') as file:
            loaded_model = pickle.load(file)

        input_data = pd.DataFrame([{
            'role': role,
            'jobTitle': job_title,
            'location': location
        }])

        prediction = loaded_model.predict(input_data)
        return json.dumps({'predicted_salary': round(prediction[0], 2)})

    except Exception as e:
        return json.dumps({'error': str(e)})

if __name__ == "__main__":
    if len(sys.argv) != 4:
        print(json.dumps({'error': 'Invalid number of arguments. Expected role, job_title, and location.'}))
    else:
        role_arg = sys.argv[1]
        job_title_arg = sys.argv[2]
        location_arg = sys.argv[3]
        result = predict_salary(role_arg, job_title_arg, location_arg)
        print(result)
