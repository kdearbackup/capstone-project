import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error,mean_squared_error, r2_score
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder

df = pd.read_csv('dummy_employee_data.csv')

encoder = OneHotEncoder()
encoded_features = encoder.fit_transform(df[['job_role','work_location']]).toarray()

X = encoded_features
y = df['salary']

X_train, X_test, y_train, y_test = train_test_split(X,y, test_size=0.2, random_state=42)

model = LinearRegression()

model.fit(X_train,y_train)

y_pred = model.predict(X_test)
# Use regression metrics

mae = mean_absolute_error(y_test, y_pred)
mse = mean_squared_error(y_test, y_pred)
r2 = r2_score(y_test, y_pred)

print(f'Mean Absolute Error: {mae}')
print(f'Mean Squared Error: {mse}')
print(f'R² Score: {r2}')

def predict_salary(job_role, work_location):
    # Create a DataFrame for the input features with the same column names
    input_df = pd.DataFrame([[job_role, work_location]], columns=['job_role', 'work_location'])
    input_features = encoder.transform(input_df).toarray()
    
    # Predict the salary
    predicted_salary = model.predict(input_features)
    
    return predicted_salary[0]

job_role_input = 'President'
work_location_input = 'Hartford'
predicted_salary = predict_salary(job_role_input, work_location_input)
print(f'Predicted Salary for {job_role_input} in {work_location_input}: ${predicted_salary:.2f}')