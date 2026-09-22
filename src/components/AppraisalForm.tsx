import React, { useState, useMemo } from 'react';
import { CarInput } from '../types';
import { BRANDS, SELLER_TYPES, FUEL_TYPES, TRANSMISSION_TYPES, SAMPLE_PRESETS, formatIndianCurrency } from '../data/modelsData';
import { predictCarPrice } from '../ml/predictor';
import { SpecDivider } from './SpecDivider';
import { ArrowRight, RotateCcw, Sparkles, Zap, Sliders, Shield, Fuel, Gauge, HelpCircle, Check, Search, Car } from 'lucide-react';
import { motion } from 'motion/react';

interface AppraisalFormProps {
  initialValues?: CarInput;
  onSubmit: (data: CarInput) => void;
  isSubmitting?: boolean;
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

const DEFAULT_VALUES: CarInput = {
  brand: 'Hyundai',
  vehicle_age: 5,
  km_driven: 20000,
  seller_type: 'Individual',
  fuel_type: 'Petrol',
  transmission_type: 'Manual',
  mileage: 18.9,
  engine: 1197,
  max_power: 82,
  seats: 5
};

// Brand tier groupings for user friendly searching/filtering
const BRAND_CATEGORIES = {
  All: BRANDS,
  'Volume & Popular': ['Maruti', 'Hyundai', 'Tata', 'Mahindra', 'Honda', 'Toyota', 'Kia', 'Renault', 'Nissan', 'Ford', 'Volkswagen', 'Skoda', 'MG'],
  'Luxury & Executive': ['Audi', 'BMW', 'Mercedes-Benz', 'Mercedes-AMG', 'Jaguar', 'Land Rover', 'Volvo', 'Lexus', 'Porsche', 'Mini', 'Jeep'],
  'Ultra Luxury & Supercar': ['Ferrari', 'Bentley', 'Rolls-Royce', 'Maserati'],
  'Specialty & Utility': ['Isuzu', 'Force', 'Datsun', 'Premier']
};

export const AppraisalForm: React.FC<AppraisalFormProps> = ({
  initialValues = DEFAULT_VALUES,
  onSubmit,
  isSubmitting = false,
  onToast
}) => {
  const [formData, setFormData] = useState<CarInput>(initialValues);
  const [brandCategory, setBrandCategory] = useState<keyof typeof BRAND_CATEGORIES>('All');
  const [brandSearch, setBrandSearch] = useState('');

  // Live quick estimation computed on every keystroke/slider move
  const liveEstimate = useMemo(() => {
    try {
      return predictCarPrice(formData, 'rf');
    } catch {
      return null;
    }
  }, [formData]);

  const handleChange = (field: keyof CarInput, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePresetSelect = (preset: typeof SAMPLE_PRESETS[0]) => {
    setFormData(preset.data);
    if (onToast) {
      onToast(`Preset Loaded: ${preset.label}`, `Configured ${preset.data.brand} specifications.`, 'info');
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_VALUES);
    if (onToast) {
      onToast('Form Reset', 'Restored default vehicle parameters.', 'info');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const filteredBrands = useMemo(() => {
    const list = BRAND_CATEGORIES[brandCategory] || BRANDS;
    if (!brandSearch.trim()) return list;
    return list.filter((b) => b.toLowerCase().includes(brandSearch.toLowerCase().trim()));
  }, [brandCategory, brandSearch]);

  return (
    <div className="w-full space-y-8" id="appraisal-desk-form-container">
      
      {/* PRESETS HEADER BAR */}
      <div className="p-4 sm:p-5 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#B8924A]/15 text-[#B8924A] flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-mono-tabular uppercase tracking-wider text-[#F4F3F0] font-semibold">
              Verified Marketplace Benchmark Presets
            </span>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1.5 text-xs text-[#8C8F94] hover:text-[#F4F3F0] hover:bg-[#1F2126] px-2.5 py-1 rounded transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Specifications</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {SAMPLE_PRESETS.map((preset, idx) => {
            const isSelected =
              formData.brand === preset.data.brand &&
              formData.max_power === preset.data.max_power &&
              formData.vehicle_age === preset.data.vehicle_age;

            return (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => handlePresetSelect(preset)}
                className={`text-xs p-3 rounded-lg transition-all border text-left flex flex-col justify-between relative overflow-hidden group ${
                  isSelected
                    ? 'border-[#B8924A] bg-[#B8924A]/15 text-[#F4F3F0] ring-1 ring-[#B8924A]'
                    : 'border-[rgba(244,243,240,0.1)] bg-[#1F2126]/70 text-[#8C8F94] hover:text-[#F4F3F0] hover:border-[rgba(244,243,240,0.25)] hover:bg-[#1F2126]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-semibold text-[#F4F3F0] text-xs truncate">
                      {preset.label}
                    </span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#B8924A] shrink-0" />}
                  </div>
                  <div className="text-[10px] text-[#8C8F94] line-clamp-1">
                    {preset.data.fuel_type} • {preset.data.transmission_type} • {preset.data.max_power} bhp
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-[rgba(244,243,240,0.06)] flex items-center justify-between">
                  <span className="text-[10px] text-[#8C8F94] font-mono-tabular">Sale Price:</span>
                  <span className="text-xs font-mono-tabular font-bold text-[#B8924A]">
                    ₹{(preset.actualPrice / 100000).toFixed(2)} Lakh
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN FORM GRID WITH LIVE SUMMARY SIDEBAR */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Inputs (8 Cols on Desktop) */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6">
          
          {/* SECTION 1: Vehicle Identity & Brand */}
          <section id="section-vehicle-identity" className="p-5 sm:p-6 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
                  Section I
                </span>
                <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
                  Vehicle Identity &amp; Propulsion
                </h3>
              </div>
              <span className="text-xs text-[#8C8F94] font-mono-tabular">Brand &amp; Transmission</span>
            </div>

            <SpecDivider className="my-1" />

            {/* Brand Selection with Quick Filter Pills */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label htmlFor="id_brand" className="text-xs font-semibold text-[#E8E6E1]">
                  Automobile Brand <span className="text-[#B8924A]">*</span>
                </label>
                
                {/* Category Pills */}
                <div className="flex flex-wrap gap-1">
                  {(Object.keys(BRAND_CATEGORIES) as (keyof typeof BRAND_CATEGORIES)[]).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setBrandCategory(cat)}
                      className={`text-[10px] px-2 py-0.5 rounded transition-all font-mono-tabular ${
                        brandCategory === cat
                          ? 'bg-[#B8924A] text-[#17181C] font-bold'
                          : 'bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <select
                    id="id_brand"
                    name="brand"
                    value={formData.brand}
                    onChange={(e) => handleChange('brand', e.target.value)}
                    className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded-lg px-3.5 py-2.5 text-sm text-[#F4F3F0] focus:outline-none focus:border-[#B8924A] focus:ring-1 focus:ring-[#B8924A] transition-all font-medium"
                    required
                  >
                    {filteredBrands.map((b) => (
                      <option key={b} value={b} className="bg-[#17181C] text-[#F4F3F0]">
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#8C8F94]" />
                  <input
                    type="text"
                    placeholder="Search brand..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded-lg pl-8 pr-3 py-2.5 text-xs text-[#F4F3F0] focus:outline-none focus:border-[#B8924A]"
                  />
                </div>
              </div>
              <p className="text-[11px] text-[#8C8F94]">31 discrete automotive brand categories encoded into numerical tiers.</p>
            </div>

            {/* Drivetrain, Fuel, Age */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              
              {/* Transmission Type */}
              <div>
                <label className="block text-xs font-medium text-[#E8E6E1] mb-1.5">
                  Transmission <span className="text-[#B8924A]">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRANSMISSION_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleChange('transmission_type', t)}
                      className={`py-2 px-2 text-xs rounded-lg font-medium border text-center transition-all ${
                        formData.transmission_type === t
                          ? 'border-[#B8924A] bg-[#B8924A]/15 text-[#F4F3F0] font-semibold'
                          : 'border-[rgba(244,243,240,0.12)] bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-[10px] text-[#8C8F94]">Automatic commands ~15% market premium</p>
              </div>

              {/* Fuel Type */}
              <div>
                <label htmlFor="id_fuel_type" className="block text-xs font-medium text-[#E8E6E1] mb-1.5">
                  Fuel Propulsion <span className="text-[#B8924A]">*</span>
                </label>
                <select
                  id="id_fuel_type"
                  name="fuel_type"
                  value={formData.fuel_type}
                  onChange={(e) => handleChange('fuel_type', e.target.value as any)}
                  className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded-lg px-3 py-2 text-sm text-[#F4F3F0] focus:outline-none focus:border-[#B8924A] focus:ring-1 focus:ring-[#B8924A] transition-all"
                  required
                >
                  {FUEL_TYPES.map((f) => (
                    <option key={f} value={f} className="bg-[#17181C] text-[#F4F3F0]">
                      {f}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-[#8C8F94]">Diesel &amp; Petrol comprise 97% of dataset</p>
              </div>

              {/* Seller Channel */}
              <div>
                <label htmlFor="id_seller_type" className="block text-xs font-medium text-[#E8E6E1] mb-1.5">
                  Seller Channel <span className="text-[#B8924A]">*</span>
                </label>
                <select
                  id="id_seller_type"
                  name="seller_type"
                  value={formData.seller_type}
                  onChange={(e) => handleChange('seller_type', e.target.value as any)}
                  className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded-lg px-3 py-2 text-sm text-[#F4F3F0] focus:outline-none focus:border-[#B8924A] focus:ring-1 focus:ring-[#B8924A] transition-all"
                  required
                >
                  {SELLER_TYPES.map((s) => (
                    <option key={s} value={s} className="bg-[#17181C] text-[#F4F3F0]">
                      {s}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-[10px] text-[#8C8F94]">Individual vs Dealer certified</p>
              </div>

            </div>
          </section>

          {/* SECTION 2: Usage, Odometer & Age (with Dual Sliders) */}
          <section id="section-usage-condition" className="p-5 sm:p-6 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] shadow-md space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
                  Section II
                </span>
                <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
                  Usage, Age &amp; Fuel Efficiency
                </h3>
              </div>
              <span className="text-xs text-[#8C8F94] font-mono-tabular">Odometer &amp; Economy</span>
            </div>

            <SpecDivider className="my-1" />

            <div className="space-y-5">
              
              {/* Vehicle Age Slider & Input */}
              <div className="p-4 rounded-lg bg-[#1F2126]/60 border border-[rgba(244,243,240,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor="id_vehicle_age" className="text-xs font-semibold text-[#E8E6E1]">
                      Vehicle Age (Years since Registration)
                    </label>
                    <span className="text-[10px] font-mono-tabular text-[#9A9E9F]">
                      (Weight: 12.7%)
                    </span>
                  </div>
                  <span className="text-sm font-mono-tabular font-bold text-[#B8924A] bg-[#B8924A]/10 px-2 py-0.5 rounded border border-[#B8924A]/30">
                    {formData.vehicle_age} {formData.vehicle_age === 1 ? 'Year' : 'Years'} Old
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="1"
                    value={formData.vehicle_age}
                    onChange={(e) => handleChange('vehicle_age', parseInt(e.target.value) || 0)}
                    className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded-lg cursor-pointer"
                  />
                  <div className="w-24 shrink-0">
                    <input
                      type="number"
                      id="id_vehicle_age"
                      name="vehicle_age"
                      min="0"
                      max="29"
                      value={formData.vehicle_age}
                      onChange={(e) => handleChange('vehicle_age', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#17181C] border border-[rgba(244,243,240,0.16)] rounded px-2.5 py-1.5 text-xs text-center text-[#F4F3F0] font-mono-tabular focus:border-[#B8924A]"
                    />
                  </div>
                </div>

                <div className="flex justify-between text-[10px] text-[#8C8F94] font-mono-tabular">
                  <span>0 (Brand New)</span>
                  <span>5 Yrs (Average)</span>
                  <span>10 Yrs</span>
                  <span>15+ Yrs (High Decay)</span>
                </div>
              </div>

              {/* Odometer (Km Driven) Slider & Input */}
              <div className="p-4 rounded-lg bg-[#1F2126]/60 border border-[rgba(244,243,240,0.06)] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label htmlFor="id_km_driven" className="text-xs font-semibold text-[#E8E6E1]">
                      Total Distance Driven (Odometer)
                    </label>
                    <span className="text-[10px] font-mono-tabular text-[#9A9E9F]">
                      (Weight: 6.6%)
                    </span>
                  </div>
                  <span className="text-sm font-mono-tabular font-bold text-[#F4F3F0]">
                    {formData.km_driven.toLocaleString('en-IN')} km
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1000"
                    max="250000"
                    step="1000"
                    value={Math.min(formData.km_driven, 250000)}
                    onChange={(e) => handleChange('km_driven', parseInt(e.target.value) || 0)}
                    className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded-lg cursor-pointer"
                  />
                  <div className="w-28 shrink-0">
                    <input
                      type="number"
                      id="id_km_driven"
                      name="km_driven"
                      min="100"
                      max="3800000"
                      step="500"
                      value={formData.km_driven}
                      onChange={(e) => handleChange('km_driven', parseInt(e.target.value) || 0)}
                      className="w-full bg-[#17181C] border border-[rgba(244,243,240,0.16)] rounded px-2 py-1.5 text-xs text-center text-[#F4F3F0] font-mono-tabular focus:border-[#B8924A]"
                    />
                  </div>
                </div>

                {/* Quick Mileage Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#8C8F94]">Quick Select:</span>
                  {[10000, 25000, 50000, 80000, 120000, 180000].map((km) => (
                    <button
                      key={km}
                      type="button"
                      onClick={() => handleChange('km_driven', km)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono-tabular ${
                        formData.km_driven === km
                          ? 'bg-[#B8924A]/20 text-[#B8924A] border border-[#B8924A]/40'
                          : 'bg-[#17181C] text-[#8C8F94] hover:text-[#F4F3F0]'
                      }`}
                    >
                      {(km / 1000)}k km
                    </button>
                  ))}
                </div>
              </div>

              {/* Certified Mileage & Seats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Fuel Economy (Mileage) */}
                <div>
                  <label htmlFor="id_mileage" className="block text-xs font-medium text-[#E8E6E1] mb-1.5">
                    Certified Fuel Economy (Mileage) <span className="text-[#B8924A]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      id="id_mileage"
                      name="mileage"
                      min="4"
                      max="45"
                      step="0.1"
                      value={formData.mileage}
                      onChange={(e) => handleChange('mileage', parseFloat(e.target.value) || 0)}
                      className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded-lg px-3 py-2 text-sm text-[#F4F3F0] focus:border-[#B8924A] font-mono-tabular pr-16"
                      required
                    />
                    <span className="absolute right-3 top-2.5 text-xs text-[#8C8F94] pointer-events-none font-mono-tabular">
                      km/l
                    </span>
                  </div>
                  <p className="mt-1 text-[10px] text-[#8C8F94]">Standard ARAI certified figure (Weight: 12.7%)</p>
                </div>

                {/* Seating Capacity */}
                <div>
                  <label htmlFor="id_seats" className="block text-xs font-medium text-[#E8E6E1] mb-1.5">
                    Seating Capacity <span className="text-[#B8924A]">*</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[2, 4, 5, 6, 7, 8, 9].map((seat) => (
                      <button
                        key={seat}
                        type="button"
                        onClick={() => handleChange('seats', seat)}
                        className={`flex-1 py-2 text-xs rounded-lg font-mono-tabular transition-all font-semibold ${
                          formData.seats === seat
                            ? 'bg-[#B8924A] text-[#17181C]'
                            : 'bg-[#1F2126] text-[#8C8F94] border border-[rgba(244,243,240,0.1)] hover:text-[#F4F3F0]'
                        }`}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                  <p className="mt-1 text-[10px] text-[#8C8F94]">2 to 9 passenger capacity</p>
                </div>

              </div>

            </div>
          </section>

          {/* SECTION 3: Engine Specifications (Dominant Max Power Feature) */}
          <section id="section-engine-specification" className="p-5 sm:p-6 rounded-xl border border-[#B8924A]/40 bg-gradient-to-b from-[#1F2126] to-[#17181C] shadow-lg space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-bold">
                    Section III • KEY FEATURE
                  </span>
                  <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#B8924A] text-[#17181C] font-bold">
                    63.5% MODEL WEIGHT
                  </span>
                </div>
                <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0] mt-0.5">
                  Engine Power &amp; Displacement
                </h3>
              </div>
              <Zap className="w-5 h-5 text-[#B8924A]" />
            </div>

            <SpecDivider className="my-1" />

            <div className="space-y-4">
              
              {/* Max Power (BHP) Slider + Direct Input */}
              <div className="p-4 rounded-lg bg-[#17181C] border border-[#B8924A]/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="id_max_power" className="text-xs font-bold text-[#F4F3F0]">
                      Maximum Engine Power Output (bhp)
                    </label>
                    <div className="text-[11px] text-[#8C8F94]">
                      The single most dominant price determinant in the Random Forest model
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-mono-tabular font-extrabold text-[#B8924A]">
                      {formData.max_power} bhp
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="35"
                    max="450"
                    step="1"
                    value={Math.min(formData.max_power, 450)}
                    onChange={(e) => handleChange('max_power', parseFloat(e.target.value) || 35)}
                    className="w-full accent-[#B8924A] h-2.5 bg-[#1F2126] rounded-lg cursor-pointer"
                  />
                  <div className="w-28 shrink-0">
                    <input
                      type="number"
                      id="id_max_power"
                      name="max_power"
                      min="30"
                      max="650"
                      step="0.5"
                      value={formData.max_power}
                      onChange={(e) => handleChange('max_power', parseFloat(e.target.value) || 30)}
                      className="w-full bg-[#1F2126] border border-[#B8924A]/60 rounded-lg px-2.5 py-1.5 text-xs text-center text-[#F4F3F0] font-mono-tabular font-bold focus:border-[#B8924A]"
                    />
                  </div>
                </div>

                {/* Power tier presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] text-[#8C8F94]">Typical Classes:</span>
                  {[
                    { label: 'Hatch (68 bhp)', val: 68 },
                    { label: 'Sedan (88 bhp)', val: 88 },
                    { label: 'Turbo (118 bhp)', val: 118 },
                    { label: 'SUV (168 bhp)', val: 168 },
                    { label: 'Luxury (245 bhp)', val: 245 },
                    { label: 'Supercar (550 bhp)', val: 550 }
                  ].map((p) => (
                    <button
                      key={p.val}
                      type="button"
                      onClick={() => handleChange('max_power', p.val)}
                      className={`text-[10px] px-2 py-0.5 rounded font-mono-tabular ${
                        formData.max_power === p.val
                          ? 'bg-[#B8924A] text-[#17181C] font-bold'
                          : 'bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engine Displacement (cc) */}
              <div className="p-4 rounded-lg bg-[#17181C] border border-[rgba(244,243,240,0.08)] space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="id_engine" className="text-xs font-semibold text-[#E8E6E1]">
                      Engine Displacement Capacity (cc)
                    </label>
                    <span className="text-[10px] font-mono-tabular text-[#8C8F94] block">
                      Cubic capacity (e.g., 1197 cc for 1.2L engine)
                    </span>
                  </div>
                  <span className="text-sm font-mono-tabular font-bold text-[#F4F3F0]">
                    {formData.engine} cc
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="800"
                    max="4000"
                    step="50"
                    value={Math.min(formData.engine, 4000)}
                    onChange={(e) => handleChange('engine', parseInt(e.target.value) || 800)}
                    className="w-full accent-[#B8924A] h-2 bg-[#1F2126] rounded-lg cursor-pointer"
                  />
                  <div className="w-28 shrink-0">
                    <input
                      type="number"
                      id="id_engine"
                      name="engine"
                      min="600"
                      max="6600"
                      step="10"
                      value={formData.engine}
                      onChange={(e) => handleChange('engine', parseInt(e.target.value) || 600)}
                      className="w-full bg-[#1F2126] border border-[rgba(244,243,240,0.16)] rounded px-2 py-1.5 text-xs text-center text-[#F4F3F0] font-mono-tabular focus:border-[#B8924A]"
                    />
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="text-xs text-[#8C8F94] font-sans-body">
              Target Engine: <span className="text-[#F4F3F0] font-mono-tabular font-semibold">Random Forest (R² = 0.8790, MAE = ±₹1,05,480)</span>
            </div>

            <button
              type="submit"
              id="estimate-price-btn"
              disabled={isSubmitting}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 bg-gradient-to-r from-[#B8924A] to-[#c9a155] hover:brightness-110 text-[#17181C] font-bold text-sm rounded-lg shadow-xl shadow-[#B8924A]/20 transition-all cursor-pointer disabled:opacity-50 group"
            >
              <span>Generate Official Appraisal Certificate</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>

        {/* LIVE VALUATION SIDEBAR (4 Cols on Desktop) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            {/* Live Valuation Gauge Card */}
            <div className="p-6 rounded-xl border border-[#B8924A]/40 bg-gradient-to-b from-[#1F2126] to-[#17181C] shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#1E6E4F] animate-pulse"></span>
                  <span className="text-[10px] font-mono-tabular uppercase tracking-[0.2em] text-[#1E6E4F] font-bold">
                    LIVE ESTIMATE PREVIEW
                  </span>
                </div>
                <span className="text-[10px] font-mono-tabular text-[#8C8F94]">
                  Instant RF Calc
                </span>
              </div>

              {liveEstimate ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-[#8C8F94] font-sans-body">
                      Estimated Valuation for <span className="text-[#F4F3F0] font-semibold">{formData.brand}</span>:
                    </div>
                    <div className="text-3xl sm:text-4xl font-mono-tabular font-bold text-[#F4F3F0] mt-1 tracking-tight">
                      {liveEstimate.formattedPrice}
                    </div>
                    <div className="text-xs font-mono-tabular text-[#B8924A] font-semibold mt-0.5">
                      {liveEstimate.priceInWords}
                    </div>
                  </div>

                  <SpecDivider className="my-2" />

                  {/* Confidence Band Mini */}
                  <div className="space-y-1.5 text-xs font-mono-tabular">
                    <div className="flex justify-between text-[#8C8F94]">
                      <span>Confidence Range (±1 MAE):</span>
                    </div>
                    <div className="flex justify-between p-2 rounded bg-[#17181C] border border-[rgba(244,243,240,0.08)] text-[11px]">
                      <span className="text-[#9A9E9F]">{liveEstimate.confidenceRange.formattedLow}</span>
                      <span className="text-[#8C8F94]">to</span>
                      <span className="text-[#9A9E9F]">{liveEstimate.confidenceRange.formattedHigh}</span>
                    </div>
                  </div>

                  {/* Vehicle Spec Summary Badge */}
                  <div className="p-3 rounded-lg bg-[#17181C]/80 border border-[rgba(244,243,240,0.06)] space-y-1 text-xs">
                    <div className="flex justify-between text-[#8C8F94]">
                      <span>Power Output:</span>
                      <span className="text-[#F4F3F0] font-mono-tabular font-medium">{formData.max_power} bhp</span>
                    </div>
                    <div className="flex justify-between text-[#8C8F94]">
                      <span>Vehicle Age:</span>
                      <span className="text-[#F4F3F0] font-mono-tabular font-medium">{formData.vehicle_age} Years</span>
                    </div>
                    <div className="flex justify-between text-[#8C8F94]">
                      <span>Odometer:</span>
                      <span className="text-[#F4F3F0] font-mono-tabular font-medium">{formData.km_driven.toLocaleString('en-IN')} km</span>
                    </div>
                    <div className="flex justify-between text-[#8C8F94]">
                      <span>Transmission:</span>
                      <span className="text-[#F4F3F0] font-medium">{formData.transmission_type}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#B8924A]/20 border border-[#B8924A]/50 text-[#B8924A] hover:bg-[#B8924A] hover:text-[#17181C] text-xs font-bold transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>View Full Certificate &amp; Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}
            </div>

            {/* Feature Weighting Breakdown Card */}
            <div className="p-5 rounded-xl border border-[rgba(244,243,240,0.1)] bg-[#17181C] space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#F4F3F0]">
                <Shield className="w-4 h-4 text-[#B8924A]" />
                <span>How This Price is Calculated</span>
              </div>
              <p className="text-xs text-[#8C8F94] leading-relaxed font-sans-body">
                The Random Forest regressor builds an ensemble of 100 decision trees. The dominant features impacting your valuation are:
              </p>
              
              <div className="space-y-2 pt-1 font-mono-tabular text-xs">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#F4F3F0]">1. Max Power (bhp)</span>
                  <span className="text-[#B8924A] font-bold">63.5%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1F2126] rounded-full overflow-hidden">
                  <div className="h-full bg-[#B8924A] w-[63.5%]"></div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span className="text-[#9A9E9F]">2. Mileage (km/l)</span>
                  <span className="text-[#9A9E9F]">12.7%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9A9E9F]">3. Vehicle Age</span>
                  <span className="text-[#9A9E9F]">12.7%</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#9A9E9F]">4. Km Driven</span>
                  <span className="text-[#9A9E9F]">6.6%</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
