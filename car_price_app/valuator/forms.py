import os
import joblib
from django import forms

SAVED_MODELS_DIR = os.path.join(os.path.dirname(__file__), "ml", "saved_models")

def load_encoder_classes(filename, fallback):
    filepath = os.path.join(SAVED_MODELS_DIR, filename)
    if os.path.exists(filepath):
        try:
            le = joblib.load(filepath)
            return [(c, c) for c in le.classes_]
        except Exception:
            pass
    return [(c, c) for c in fallback]

BRAND_CHOICES = load_encoder_classes("le_brand.pkl", [
    'Audi', 'BMW', 'Bentley', 'Datsun', 'Ferrari', 'Force', 'Ford', 'Honda', 'Hyundai',
    'Isuzu', 'Jaguar', 'Jeep', 'Kia', 'Land Rover', 'Lexus', 'MG', 'Mahindra', 'Maruti',
    'Maserati', 'Mercedes-AMG', 'Mercedes-Benz', 'Mini', 'Nissan', 'Porsche', 'Premier',
    'Renault', 'Rolls-Royce', 'Skoda', 'Tata', 'Toyota', 'Volkswagen', 'Volvo'
])

SELLER_CHOICES = load_encoder_classes("le_seller.pkl", ['Dealer', 'Individual', 'Trustmark Dealer'])
FUEL_CHOICES = load_encoder_classes("le_fuel.pkl", ['CNG', 'Diesel', 'Electric', 'LPG', 'Petrol'])
TRANS_CHOICES = load_encoder_classes("le_trans.pkl", ['Automatic', 'Manual'])

class CarValuationForm(forms.Form):
    # Section 1: Vehicle Identity
    brand = forms.ChoiceField(
        choices=BRAND_CHOICES,
        label="Vehicle Brand",
        widget=forms.Select(attrs={"class": "form-control", "id": "id_brand"})
    )
    vehicle_age = forms.IntegerField(
        min_value=0,
        max_value=29,
        initial=5,
        label="Vehicle Age (Years)",
        help_text="Years elapsed since manufacture (0–29)",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_vehicle_age"})
    )
    transmission_type = forms.ChoiceField(
        choices=TRANS_CHOICES,
        initial='Manual',
        label="Transmission Type",
        widget=forms.Select(attrs={"class": "form-control", "id": "id_transmission_type"})
    )
    fuel_type = forms.ChoiceField(
        choices=FUEL_CHOICES,
        initial='Petrol',
        label="Fuel Type",
        widget=forms.Select(attrs={"class": "form-control", "id": "id_fuel_type"})
    )

    # Section 2: Usage & Condition
    km_driven = forms.IntegerField(
        min_value=100,
        max_value=3800000,
        initial=20000,
        label="Distance Driven (km)",
        help_text="Total odometer reading in kilometers",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_km_driven"})
    )
    mileage = forms.FloatField(
        min_value=4.0,
        max_value=45.0,
        initial=18.9,
        label="Fuel Economy (km/l or km/kg)",
        help_text="Certified fuel efficiency (e.g. 18.9 km/l)",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_mileage", "step": "0.01"})
    )
    seller_type = forms.ChoiceField(
        choices=SELLER_CHOICES,
        initial='Individual',
        label="Seller Channel",
        widget=forms.Select(attrs={"class": "form-control", "id": "id_seller_type"})
    )

    # Section 3: Engine Specification
    engine = forms.IntegerField(
        min_value=600,
        max_value=6600,
        initial=1197,
        label="Engine Displacement (cc)",
        help_text="Displacement in cubic centimeters (cc)",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_engine"})
    )
    max_power = forms.FloatField(
        min_value=30.0,
        max_value=650.0,
        initial=82.0,
        label="Maximum Power (bhp)",
        help_text="Brake horsepower (primary valuation driver - 63.5% importance)",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_max_power", "step": "0.1"})
    )
    seats = forms.IntegerField(
        min_value=2,
        max_value=9,
        initial=5,
        label="Seating Capacity",
        help_text="Passenger capacity (2–9 seats)",
        widget=forms.NumberInput(attrs={"class": "form-control", "id": "id_seats"})
    )
