import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# Load the Dataset
try:
    df = pd.read_csv('employees_with_titles.csv')
    print("Dataset loaded successfully.")
except FileNotFoundError:
    print("Error: 'employees_with_titles.csv' not found. Please generate the data first.")
    exit()

# Define Features (X) and Target (y)
features = ['role', 'jobTitle', 'location']
target = 'salary'

X = df[features]
y = df[target]

# Split the data into training and testing sets (80/20)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)
print(f"Data split into {len(X_train)} training samples and {len(X_test)} testing samples.")

# Create a Preprocessing and Modeling Pipeline
# Linear Regression requires numerical input. We must convert our categorical
# features ('role', 'job_title', 'location') into a numerical format.
# OneHotEncoder is the perfect tool for this. It creates a new binary column
# for each unique category in our features.

categorical_transformer = OneHotEncoder(handle_unknown='ignore')

preprocessor = ColumnTransformer(
    transformers=[
        ('cat', categorical_transformer, features)
    ],
    remainder='passthrough'
)

model_pipeline = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('regressor', LinearRegression())
])

# Train the Model
print("\nTraining the Linear Regression model...")
model_pipeline.fit(X_train, y_train)
print("Model training complete.")

# Make Predictions on the Test Set
y_pred = model_pipeline.predict(X_test)

# Evaluate Model Performance
print("\n--- Model Performance Metrics ---")

# Mean Absolute Error (MAE): The average absolute difference between the predicted and actual salaries.
mae = mean_absolute_error(y_test, y_pred)
print(f"Mean Absolute Error (MAE): ${mae:,.2f}")
print("Interpretation: On average, the model's prediction is off by this amount.\n")

# Mean Squared Error (MSE): The average of the squared differences. Punishes larger errors more.
mse = mean_squared_error(y_test, y_pred)
print(f"Mean Squared Error (MSE): {mse:,.2f}\n")


# R-squared (R²): The proportion of the variance in the target variable (salary) that is predictable from the features.
# A value closer to 1.0 is better.
# R²=1 This means your model explains 100% of the variance. It has captured every single factor that causes salaries to differ in your dataset. The model'spredictions perfectly align with the actual data.
r2 = r2_score(y_test, y_pred)
print(f"R-squared (R²): {r2:.4f}")
print("Interpretation: This model explains {:.2%} of the variance in salary.".format(r2))

# Save the Trained Model
model_filename = 'salary_predictor.pkl'
with open(model_filename, 'wb') as file:
    pickle.dump(model_pipeline, file)

print(f"\nModel successfully saved to '{model_filename}'")

# Example of how to load and use the model for a prediction
print("\n--- Example Prediction ---")
loaded_model = pickle.load(open(model_filename, 'rb'))
example_data = pd.DataFrame([
    {'role': 'employee', 'jobTitle': 'Software Engineer', 'location': 'San Francisco'}
])
predicted_salary = loaded_model.predict(example_data)
print(f"Prediction for a Software Engineer in San Francisco: ${predicted_salary[0]:,.2f}")
