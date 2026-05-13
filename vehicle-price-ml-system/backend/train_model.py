import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score, mean_absolute_error
import pickle
import os
from datetime import datetime

# Load data
data_path = "Data/uae_cars.csv"
if not os.path.exists(data_path):
    data_path = "backend/Data/uae_cars.csv"

df = pd.read_csv(data_path)
df.dropna(inplace=True)

# Feature Engineering
current_year = datetime.now().year
df['car_age'] = current_year - df['year']
df['brand'] = df['name'].apply(lambda x: x.split()[0])
# New Feature: usage intensity
df['km_per_year'] = df['km_driven'] / (df['car_age'] + 1) # +1 to avoid div by zero

# Columns to encode
categorical_cols = ['fuel', 'transmission', 'brand', 'owner']
encoders = {}

for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le

# Select features
features = ['car_age', 'km_driven', 'fuel', 'transmission', 'brand', 'owner', 'present_price', 'km_per_year']
X = df[features]
y = df['price']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Hyperparameter Tuning
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [None, 10, 20],
    'min_samples_split': [2, 5]
}

rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(estimator=rf, param_grid=param_grid, cv=3, n_jobs=-1, scoring='r2')
grid_search.fit(X_train, y_train)

best_model = grid_search.best_estimator_

# Evaluation
y_pred = best_model.predict(X_test)
r2 = r2_score(y_test, y_pred)
mae = mean_absolute_error(y_test, y_pred)

print(f"Model trained successfully!")
print(f"Best Params: {grid_search.best_params_}")
print(f"R2 Score: {r2:.4f}")
print(f"Mean Absolute Error: AED {mae:.2f}")

# Save model and encoders
models_dir = "models"
if "backend" not in os.getcwd():
    models_dir = "backend/models"

if not os.path.exists(models_dir):
    os.makedirs(models_dir)

model_data = {
    "model": best_model,
    "encoders": encoders,
    "features": features
}

model_path = os.path.join(models_dir, "vehicle_price_model.pkl")
with open(model_path, "wb") as f:
    pickle.dump(model_data, f)

print(f"Improved model saved to {model_path}")
