"""
Machine Learning Lab Mini Project: Used Car Price Prediction
Training Script: Cleans dataset, trains 5 regressors, scales SVR (X+y),
and exports saved models and metrics.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor, AdaBoostRegressor
from sklearn.svm import SVR
from sklearn.metrics import r2_score, mean_absolute_error, mean_squared_error

def main():
    print("=" * 60)
    print("CAR PRICE PREDICTION - MODEL TRAINING PIPELINE")
    print("=" * 60)

    # 1. Load dataset
    csv_path = os.path.join(os.path.dirname(__file__), "cardekho_dataset.csv")
    if not os.path.exists(csv_path):
        csv_path = "cardekho_dataset.csv"
    
    df = pd.read_csv(csv_path, index_col=0)
    raw_count = len(df)
    print(f"Raw dataset shape: {df.shape} ({raw_count} rows)")

    # 2. Exact data cleaning steps per project spec
    df = df.drop_duplicates()
    df = df[df["seats"] > 0]
    df["brand"] = df["brand"].str.strip().replace({"ISUZU": "Isuzu"})
    
    clean_count = len(df)
    print(f"After cleaning: {clean_count} rows remain (dropped {raw_count - clean_count} rows)")

    # Drop redundant columns
    df_model = df.drop(columns=["car_name", "model"])

    # 3. Categorical Label Encoding
    le_brand = LabelEncoder()
    le_seller = LabelEncoder()
    le_fuel = LabelEncoder()
    le_trans = LabelEncoder()

    df_model["brand_enc"] = le_brand.fit_transform(df_model["brand"])
    df_model["seller_enc"] = le_seller.fit_transform(df_model["seller_type"])
    df_model["fuel_enc"] = le_fuel.fit_transform(df_model["fuel_type"])
    df_model["trans_enc"] = le_trans.fit_transform(df_model["transmission_type"])

    feature_cols = [
        "brand_enc", "vehicle_age", "km_driven", "seller_enc",
        "fuel_enc", "trans_enc", "mileage", "engine", "max_power", "seats"
    ]
    
    X = df_model[feature_cols]
    y = df_model["selling_price"]

    # 4. Train/Test Split (80/20, random_state=42, no stratify for regression)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42
    )
    print(f"Training set: {X_train.shape[0]} samples | Testing set: {X_test.shape[0]} samples")

    # 5. Initialize & Train All 5 Models
    lr_model = LinearRegression()
    dt_model = DecisionTreeRegressor(max_depth=10, random_state=42)
    rf_model = RandomForestRegressor(n_estimators=100, random_state=42)
    ada_model = AdaBoostRegressor(n_estimators=100, random_state=42)

    print("Training Linear Regression...")
    lr_model.fit(X_train, y_train)

    print("Training Decision Tree (max_depth=10)...")
    dt_model.fit(X_train, y_train)

    print("Training Random Forest (n_estimators=100)...")
    rf_model.fit(X_train, y_train)

    print("Training AdaBoost (n_estimators=100)...")
    ada_model.fit(X_train, y_train)

    print("Training SVR (RBF Kernel, dual X + y scaled)...")
    scaler_X = StandardScaler()
    scaler_y = StandardScaler()

    X_train_scaled = scaler_X.fit_transform(X_train)
    X_test_scaled = scaler_X.transform(X_test)
    y_train_scaled = scaler_y.fit_transform(y_train.values.reshape(-1, 1)).ravel()

    svr_model = SVR(kernel="rbf")
    svr_model.fit(X_train_scaled, y_train_scaled)

    # 6. Evaluation on Test Set
    models = {
        "Linear Regression": (lr_model, X_test, False),
        "Decision Tree": (dt_model, X_test, False),
        "Random Forest": (rf_model, X_test, False),
        "AdaBoost": (ada_model, X_test, False),
        "SVR": (svr_model, X_test_scaled, True)
    }

    metrics = {}
    print("\\n" + "=" * 60)
    print(f"{'Model':<25} | {'R2 Score':<10} | {'MAE (INR)':<14} | {'RMSE (INR)':<14}")
    print("-" * 60)

    for name, (model, test_features, is_scaled_svr) in models.items():
        if is_scaled_svr:
            pred_scaled = model.predict(test_features)
            pred = scaler_y.inverse_transform(pred_scaled.reshape(-1, 1)).ravel()
        else:
            pred = model.predict(test_features)
        
        r2 = r2_score(y_test, pred)
        mae = mean_absolute_error(y_test, pred)
        rmse = np.sqrt(mean_squared_error(y_test, pred))

        metrics[name] = {
            "r2_score": round(float(r2), 4),
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2)
        }
        print(f"{name:<25} | {r2:<10.4f} | ₹{mae:<13,.0f} | ₹{rmse:<13,.0f}")

    print("=" * 60)

    # 7. Feature Importances for Random Forest
    rf_importances = dict(zip(feature_cols, [round(float(v), 4) for v in rf_model.feature_importances_]))
    sorted_importances = sorted(rf_importances.items(), key=lambda x: x[1], reverse=True)
    print("\\nRandom Forest Feature Importances:")
    for feat, val in sorted_importances:
        print(f"  {feat:<18}: {val:.3f} ({val*100:.1f}%)")

    # 8. Save Artifacts
    output_dir = os.path.join(os.path.dirname(__file__), "saved_models")
    os.makedirs(output_dir, exist_ok=True)

    joblib.dump(lr_model, os.path.join(output_dir, "linreg.pkl"))
    joblib.dump(dt_model, os.path.join(output_dir, "dt.pkl"))
    joblib.dump(rf_model, os.path.join(output_dir, "rf.pkl"))
    joblib.dump(ada_model, os.path.join(output_dir, "ada.pkl"))
    joblib.dump(svr_model, os.path.join(output_dir, "svr.pkl"))
    joblib.dump(scaler_X, os.path.join(output_dir, "scaler_X.pkl"))
    joblib.dump(scaler_y, os.path.join(output_dir, "scaler_y.pkl"))
    joblib.dump(le_brand, os.path.join(output_dir, "le_brand.pkl"))
    joblib.dump(le_seller, os.path.join(output_dir, "le_seller.pkl"))
    joblib.dump(le_fuel, os.path.join(output_dir, "le_fuel.pkl"))
    joblib.dump(le_trans, os.path.join(output_dir, "le_trans.pkl"))

    results_data = {
        "metrics": metrics,
        "feature_importances": rf_importances,
        "feature_order": feature_cols,
        "dataset_rows": clean_count
    }

    with open(os.path.join(output_dir, "metrics.json"), "w") as f:
        json.dump(results_data, f, indent=2)

    # 9. Generate Feature Importance Chart PNG
    img_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "static", "valuator", "img")
    os.makedirs(img_dir, exist_ok=True)

    plt.figure(figsize=(10, 6), facecolor="#17181C")
    ax = plt.gca()
    ax.set_facecolor("#17181C")

    feats = [x[0] for x in sorted_importances[::-1]]
    vals = [x[1] for x in sorted_importances[::-1]]
    colors = ["#B8924A" if f == "max_power" else "#9A9E9F" for f in feats]

    bars = plt.barh(feats, vals, color=colors, height=0.6)
    plt.title("Random Forest Feature Importance", color="#F4F3F0", fontsize=14, pad=15)
    plt.xlabel("Importance Score (Mean Decrease in Impurity)", color="#8C8F94", fontsize=11)
    ax.tick_params(colors="#F4F3F0", labelsize=10)
    for spine in ax.spines.values():
        spine.set_color("rgba(244,243,240,0.12)")

    plt.tight_layout()
    chart_path = os.path.join(img_dir, "feature_importance.png")
    plt.savefig(chart_path, dpi=200, facecolor="#17181C")
    plt.close()

    print(f"\\nAll 11 artifacts exported to '{output_dir}'.")

if __name__ == "__main__":
    main()
