import random
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder

data = {
'job_type' :  ['Engineer','Analyst','Designer','President'],
'locations' : ['New York','DC',"Boston",'Hartford']

}

base_salaries = {
    'Engineer': 80000,
    'Analyst': 70000,
    'Designer': 60000,
    'President': 500000
}

city_multiplier = {
    'New York': 1.5,
    'DC': 1.2,
    'Hartford': 1.0,
    'Boston': 1.1
}

def calculate_salary(job_role,work_location):
    base_salary = base_salaries.get(job_role,0)
    multiplier = city_multiplier.get(work_location, 1)
    return base_salary * multiplier


def generate_dummy_data(num_records=1000):
    data_list = []
    for _ in range(num_records):
        job_role = random.choice(data['job_type'])
        work_location = random.choice(data['locations'])
        salary = calculate_salary(job_role,work_location)
        data_list.append({
            'job_role':job_role,
            'work_location':work_location,
            'salary': salary
        })
    return pd.DataFrame(data_list)

df = generate_dummy_data()
print(df.head())

df.to_csv('dummy_employee_data.csv', index=False)