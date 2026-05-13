from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Load dataset
DATASET_PATH = "Data/uae_cars.csv"

def clean_dataset(df):
    if df.empty:
        return df
    
    # Map CSV columns to app columns
    column_mapping = {
        'Make': 'brand',
        'Model': 'model',
        'Year': 'year',
        'Price': 'price',
        'Mileage': 'km_driven',
        'Fuel Type': 'fuel',
        'Transmission': 'transmission'
    }
    
    # Rename only if columns exist
    df = df.rename(columns={k: v for k, v in column_mapping.items() if k in df.columns})
    
    # Clean string columns
    string_cols = ['brand', 'model', 'fuel', 'transmission']
    for col in string_cols:
        if col in df.columns:
            df[col] = df[col].astype(str).str.strip()
            
    return df

try:
    df_dataset = pd.read_csv(DATASET_PATH)
    df_dataset = clean_dataset(df_dataset)
except Exception as e:
    print(f"Error loading dataset: {e}")
    df_dataset = pd.DataFrame()


# 🔍 DATA LOOKUP FUNCTION
def get_real_vehicle_data(df, brand, year, km_driven, fuel, transmission):
    if df.empty:
        return None

    try:
        # Case-insensitive comparison
        mask = (
            (df['brand'].str.lower() == brand.lower()) &
            (abs(df['year'] - int(year)) <= 1) &
            (abs(df['km_driven'] - int(km_driven)) <= 20000)
        )

        # Optional filters
        if fuel:
            mask &= (df['fuel'].str.lower() == fuel.lower())
            
        if transmission:
            mask &= (df['transmission'].str.lower() == transmission.lower())

        matches = df[mask]

        if not matches.empty:
            return matches.iloc[0]

    except Exception as e:
        print("Matching error:", e)

    return None


# 🌐 HOME
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "message": "UAE Vehicle Valuator API is running"
    })


# 🚗 GET ALL BRANDS
@app.route("/get-brands", methods=["GET"])
def get_brands():
    if df_dataset.empty:
        return jsonify([])
    
    brands = df_dataset['brand'].dropna().unique().tolist()
    # Filter out empty strings and 'nan'
    brands = [b for b in brands if b and b.lower() != 'nan']
    return jsonify(sorted(brands))


# 🚘 GET MODELS BY BRAND
@app.route("/get-models/<brand>", methods=["GET"])
def get_models(brand):
    if df_dataset.empty:
        return jsonify([])
    
    # Case-insensitive filter
    models = df_dataset[df_dataset['brand'].str.lower() == brand.lower()]['model'].dropna().unique().tolist()
    # Filter out empty strings and 'nan'
    models = [m for m in models if m and m.lower() != 'nan']
    return jsonify(sorted(models))


# 📦 OPTIONS (Legacy support or composite)
@app.route("/get_options", methods=["GET"])
def get_options():
    if df_dataset.empty:
        return jsonify({"error": "Dataset not loaded"}), 500

    return jsonify({
        "brands": sorted([b for b in df_dataset['brand'].dropna().unique().tolist() if b and b.lower() != 'nan']),
        "fuel_types": sorted([f for f in df_dataset['fuel'].dropna().unique().tolist() if f and f.lower() != 'nan']),
        "transmissions": sorted([t for t in df_dataset['transmission'].dropna().unique().tolist() if t and t.lower() != 'nan']),
        "owners": ["First Owner", "Second Owner", "Third Owner"]
    })


# 🔥 MAIN PREDICT API
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # ✅ FIXED FIELD MAPPING (Match frontend api.js)
        name_val = data.get('name', '')
        brand = name_val.split()[0].strip().lower() if name_val else ''
        year = data.get('year')
        km_driven = data.get('km_driven')
        
        fuel = data.get('fuel', '')
        # Map 'Petrol' from frontend to 'Gasoline' in dataset
        if fuel and fuel.lower() == 'petrol':
            fuel = 'Gasoline'
            
        transmission = data.get('transmission', '')
        # Map 'Automatic' to 'Automatic Transmission'
        if transmission and transmission.lower() == 'automatic':
            transmission = 'Automatic Transmission'
        elif transmission and transmission.lower() == 'manual':
            transmission = 'Manual Transmission'
            
        present_price_input = data.get('present_price')

        # ❗ VALIDATION
        if not brand or year is None or km_driven is None or not fuel or not transmission:
            return jsonify({"error": "Missing required fields"}), 400

        # 🔥 PRESENT PRICE VALIDATION (Just check if it's a number)
        if present_price_input:
            try:
                present_price_input = float(present_price_input)
                if present_price_input <= 0:
                    return jsonify({"error": "Present price must be greater than 0"}), 400
            except:
                return jsonify({"error": "Invalid present price format"}), 400

        # 🔍 DATA MATCH
        result = get_real_vehicle_data(
            df_dataset, brand, year, km_driven, fuel, transmission
        )

        if result is None:
            return jsonify({
                "error": "No matching data found. Please enter correct vehicle details."
            }), 404

        # ✅ FETCH DATASET VALUES
        price = float(result['price'])
        
        # Determine if we should show a fake present price or not
        present_price = present_price_input if present_price_input else None

        # 🛑 POST-PROCESSING LOGIC CONSTRAINT
        if present_price is not None:
            current_year = datetime.now().year
            age_of_car = max(0, current_year - int(year))
            
            # If predicted price >= present price, adjust it using depreciation logic
            if price >= present_price:
                price = present_price * (0.85 ** age_of_car)

        # 📊 RANGE
        min_price = round(price * 0.9)
        max_price = round(price * 1.1)

        # 🛑 CAP MAX PRICE AT PRESENT PRICE
        if present_price is not None:
            if max_price > present_price:
                max_price = int(present_price)
            if min_price >= max_price:
                min_price = int(max_price * 0.9)

        # 🏷 CATEGORY
        if price < 50000:
            category = "Economy"
        elif price < 150000:
            category = "Mid-range"
        else:
            category = "Luxury"

        return jsonify({
            "min_price": min_price,
            "max_price": max_price,
            "category": category,
            "predicted_price": int(price),
            "present_price": int(present_price) if present_price else None
        })

    except Exception as e:
        print("Error:", e)
        return jsonify({"error": "Internal server error"}), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)