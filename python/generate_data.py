import pandas as pd
import random

ROLE_JOB_TITLE_DATA = {
    'manager': {
        'titles': [
            'Project Manager', 'Product Manager', 'Sales Manager',
            'Engineering Manager', 'Director of Operations'
        ],
        'salary_base': 115000
    },
    'hr': {
        'titles': [
            'HR Generalist', 'Technical Recruiter',
            'HR Business Partner', 'Compensation Analyst'
        ],
        'salary_base': 72000
    },
    'employee': {
        'titles': [
            'Software Engineer', 'Senior Software Engineer', 'Data Scientist',
            'QA Tester', 'DevOps Engineer', 'Cloud Architect', 'UI/UX Designer',
            'Graphic Designer', 'Sales Development Rep', 'Account Executive',
            'Marketing Coordinator', 'SEO Specialist'
        ],
        'salary_base': 65000
    }
}

LOCATIONS = {
    'New York': 1.20,
    'San Francisco': 1.25,
    'Boston': 1.15,
    'Los Angeles': 1.10,
    'Chicago': 1.05,
    'Austin': 1.02,
    'Seattle': 1.12,
    'Denver': 1.00,
    'Atlanta': 0.95,
    'Miami': 1.03
}

employees_data = []

for _ in range(10000):
    role = random.choices(
        list(ROLE_JOB_TITLE_DATA.keys()),
        weights=[0.15, 0.10, 0.75],
        k=1
    )[0]

    job_title = random.choice(ROLE_JOB_TITLE_DATA[role]['titles'])
    location = random.choice(list(LOCATIONS.keys()))
    base_salary = ROLE_JOB_TITLE_DATA[role]['salary_base']
    location_multiplier = LOCATIONS[location]
    title_list = ROLE_JOB_TITLE_DATA[role]['titles']
    title_variation = title_list.index(job_title) * 5000
    random_factor = random.uniform(0.95, 1.05)
    salary = int((base_salary + title_variation) * location_multiplier * random_factor)

    employees_data.append({
        'role': role,
        'jobTitle': job_title,
        'location': location,
        'salary': salary
    })

df = pd.DataFrame(employees_data)
df.to_csv('employees_with_titles.csv', index=False)

print("Successfully generated 10,000 employee records and saved to employees_with_titles.csv")
print("\nFirst 5 rows:")
print(df.head())
print("\nRole distribution:")
print(df['role'].value_counts())
