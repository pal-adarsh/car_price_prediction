# Used Car Price Prediction Web App (Django + Random Forest)

**BE Machine Learning Lab Mini Project**  
Topic: **Automotive Resale Valuation & Regression Modeling**

---

## 1. Quick Setup & Execution

```bash
# 1. Install dependencies
pip install -r requirements.txt

# 2. Train all 5 ML models and generate artifacts
python valuator/ml/train_models.py

# 3. Launch the Django development server
python manage.py runserver
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000) in your browser.

---

## 2. Dataset & Quality Cleaning Pipeline

- **Dataset**: `cardekho_dataset.csv` — **15,411 raw rows** across 14 columns.
- **Cleaning Applied**:
  1. **Duplicate Removal**: 167 duplicate records dropped.
  2. **Seat Validation**: Rows with `seats == 0` dropped (invalid vehicle geometry).
  3. **Brand Normalization**: Inconsistent casing (`ISUZU` → `Isuzu`) reconciled.
  4. **Feature Selection**: `car_name` and `model` dropped to avoid high-cardinality noise; `brand` retained across 31 clean classes.
  5. **Clean Result**: **15,242 rows** utilized for 80/20 train/test modeling.

---

## 3. Experimental Benchmark Results

| Model Architecture | R² Score | Mean Absolute Error (MAE) | Root Mean Squared Error (RMSE) | Notes |
|---|---|---|---|---|
| Linear Regression | 0.6360 | ₹2,59,358 | ₹5,43,442 | Parametric baseline |
| Decision Tree (depth=10) | 0.8587 | ₹1,19,489 | ₹3,38,604 | Non-linear tree model |
| **Random Forest (100 Trees)** | **0.8790** | **₹1,05,480** | **₹3,13,403** | **Best Model (Live Engine)** |
| AdaBoost Regressor | 0.4589 | ₹5,52,061 | ₹6,62,648 | Outlier-sensitive failure |
| SVR (RBF, X+y Scaled) | 0.6898 | ₹1,23,463 | ₹5,01,736 | Required dual X+y scaling |

---

## 4. Key Viva Talking Points

1. **Why Random Forest is the best model**:
   - Bagging 100 unscaled decision trees reduces individual variance while capturing non-linear pricing curves.
   - Achieves highest R² (**0.8790**) and lowest MAE (**₹1,05,480**).

2. **Why AdaBoost underperformed (R² = 0.4589)**:
   - AdaBoost iteratively increases sample weights on high-loss errors.
   - The dataset contains extreme right-skewed prices (exotic cars up to ₹3.95 Cr) and mileage outliers (>3.8M km).
   - AdaBoost over-focuses on fitting rare luxury outliers at the expense of ordinary cars.

3. **Why SVR required dual target scaling**:
   - Support Vector Regression uses RBF kernel distances.
   - Without target standard scaling on `y`, the wide spread (₹40,000 to ₹3.95 Cr) causes negative R².
   - Fitting `StandardScaler` on both `X` and `y` recovers SVR to R² = 0.6898.

4. **Dominance of Max Power**:
   - `max_power` contributes **63.5%** of feature importance, as horsepower directly defines vehicle class and base price.
