import React, { useState, useMemo } from 'react';
import { MODEL_METRICS, formatIndianCurrency, formatPriceInWords } from '../data/modelsData';
import { predictCarPrice, predictAllModels } from '../ml/predictor';
import { CarInput } from '../types';
import { SpecDivider } from './SpecDivider';
import {
  Trophy,
  AlertTriangle,
  Scale,
  CheckCircle2,
  TrendingUp,
  Sliders,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Zap,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DEFAULT_SIM_INPUT: CarInput = {
  brand: 'Hyundai',
  vehicle_age: 5,
  km_driven: 35000,
  seller_type: 'Individual',
  fuel_type: 'Petrol',
  transmission_type: 'Manual',
  mileage: 18.9,
  engine: 1197,
  max_power: 82,
  seats: 5
};

export const ModelComparisonView: React.FC = () => {
  const [sortField, setSortField] = useState<'r2Score' | 'mae' | 'rmse'>('r2Score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModelSlug, setSelectedModelSlug] = useState<string>('rf');
  const [simInput, setSimInput] = useState<CarInput>(DEFAULT_SIM_INPUT);
  const [expandedViva, setExpandedViva] = useState<number | null>(0);

  const sortedModels = useMemo(() => {
    return [...MODEL_METRICS].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (sortField === 'mae' || sortField === 'rmse') {
        // Lower is better for errors
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [sortField, sortOrder]);

  const maxR2 = 1.0;
  const maxMae = Math.max(...MODEL_METRICS.map((m) => m.mae));

  // Multi-model simulation predictions
  const simPredictions = useMemo(() => {
    return predictAllModels(simInput);
  }, [simInput]);

  const vivaQuestions = [
    {
      q: 'Why does Random Forest achieve the highest performance (R² = 0.8790, MAE = ₹1,05,480)?',
      a: 'Random Forest operates as an ensemble of 100 decorrelated decision trees using bootstrap aggregation (bagging) and feature subsampling (sqrt(p)). While an individual decision tree (R² = 0.8587) is prone to high variance and step discretization error at terminal leaves, bagging 100 trees averages out individual estimation noise while preserving the non-linear relationship between age depreciation, power curves, and brand tiers.'
    },
    {
      q: 'Why did AdaBoost achieve the lowest score (R² = 0.4589), performing worse than Linear Regression?',
      a: 'AdaBoostRegressor iteratively increases sample weights on instances with the highest loss in prior boosting rounds. The used car dataset features a heavy right-skewed price distribution (luxury models up to ₹3.95 Crore) and extreme odometer readings (>3.8M km). AdaBoost over-indexes and exhausts its model capacity fitting these rare luxury outliers rather than learning the generalized pricing curve of everyday commuter vehicles.'
    },
    {
      q: 'Why did SVR (RBF Kernel) strictly require dual standard scaling on both X and y?',
      a: 'Support Vector Regression optimizes an ε-tube using Euclidean distance in kernel Hilbert space. When target prices span from ₹40,000 to ₹3.95 Crore, the unscaled target gradients overpower the regularizer and kernel hyperparameter γ, collapsing predictions to a flat line (yielding negative R²). Fitting StandardScaler on y_train and inverse-transforming predictions restores SVR to R² = 0.6898.'
    },
    {
      q: 'Why does Maximum Power (max_power) account for 63.5% of feature importance?',
      a: 'In automotive engineering and market segmentation, horsepower (bhp) is the primary determinant of base manufacturer MSRP, engine architecture, and luxury tier. While mileage and age determine secondary depreciation (12.7% each), peak power establishes the absolute baseline value bracket of the automobile.'
    }
  ];

  return (
    <div className="w-full space-y-10" id="model-comparison-page">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
            EXPERIMENTAL BENCHMARK &amp; LAB EVALUATION
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E6E4F]/15 text-[#1E6E4F] font-mono-tabular font-bold border border-[#1E6E4F]/30">
            80/20 Train-Test Split (15,242 Rows)
          </span>
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-4xl font-semibold text-[#F4F3F0] mt-1">
          5-Model Regression Benchmark
        </h2>
        <p className="text-sm text-[#8C8F94] font-sans-body mt-2 max-w-3xl leading-relaxed">
          Comprehensive empirical evaluation across 5 machine learning regression architectures trained on 15,242 cleaned Cardekho marketplace records with a standardized 80/20 train-test split (random_state=42).
        </p>
      </div>

      <SpecDivider />

      {/* BENCHMARK COMPARISON TABLE */}
      <div className="rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] overflow-hidden shadow-xl">
        <div className="p-5 border-b border-[rgba(244,243,240,0.08)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#1F2126]">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif-heading text-base font-semibold text-[#F4F3F0]">
              Evaluation Metrics Summary
            </h3>
          </div>

          {/* Quick Sort Options */}
          <div className="flex items-center gap-2 text-xs font-mono-tabular">
            <span className="text-[#8C8F94]">Sort By:</span>
            {(['r2Score', 'mae', 'rmse'] as const).map((field) => (
              <button
                key={field}
                onClick={() => {
                  if (sortField === field) {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortField(field);
                    setSortOrder(field === 'r2Score' ? 'desc' : 'asc');
                  }
                }}
                className={`px-2.5 py-1 rounded transition-all ${
                  sortField === field
                    ? 'bg-[#B8924A] text-[#17181C] font-bold'
                    : 'bg-[#17181C] text-[#8C8F94] hover:text-[#F4F3F0]'
                }`}
              >
                {field === 'r2Score' ? 'R² Score' : field.toUpperCase()}
                {sortField === field && (sortOrder === 'asc' ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans-body border-collapse" id="model-metrics-table">
            <thead>
              <tr className="border-b border-[rgba(244,243,240,0.1)] bg-[#17181C] font-mono-tabular text-[#9A9E9F] uppercase tracking-wider">
                <th className="py-3.5 px-5 font-semibold">Model Architecture</th>
                <th className="py-3.5 px-5 font-semibold text-right">R² Score (Accuracy)</th>
                <th className="py-3.5 px-5 font-semibold text-right">MAE (Mean Error)</th>
                <th className="py-3.5 px-5 font-semibold text-right">RMSE</th>
                <th className="py-3.5 px-5 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(244,243,240,0.06)]">
              {sortedModels.map((m) => {
                const isSelected = selectedModelSlug === m.slug;
                return (
                  <tr
                    key={m.slug}
                    onClick={() => setSelectedModelSlug(m.slug)}
                    className={`transition-colors cursor-pointer ${
                      m.isBest
                        ? 'bg-[#B8924A]/10 hover:bg-[#B8924A]/15 font-medium'
                        : isSelected
                        ? 'bg-[#1F2126]'
                        : 'hover:bg-[#1F2126]/60'
                    }`}
                  >
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2.5">
                        {m.isBest ? (
                          <span className="w-6 h-6 rounded-full bg-[#B8924A] text-[#17181C] flex items-center justify-center font-bold text-xs shrink-0">
                            ★
                          </span>
                        ) : (
                          <span className="w-6 h-6 rounded bg-[rgba(244,243,240,0.06)] text-[#8C8F94] font-mono-tabular flex items-center justify-center text-xs shrink-0">
                            #
                          </span>
                        )}
                        <div>
                          <div className="font-semibold text-[#F4F3F0] text-sm flex items-center gap-2">
                            <span>{m.name}</span>
                            {isSelected && (
                              <span className="text-[10px] text-[#B8924A] font-mono-tabular">● Selected</span>
                            )}
                          </div>
                          <div className="text-[11px] text-[#8C8F94] mt-0.5 line-clamp-1">{m.notes}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-5 text-right font-mono-tabular text-sm">
                      <span className={`px-2.5 py-1 rounded font-bold ${
                        m.isBest
                          ? 'text-[#1E6E4F] bg-[#1E6E4F]/20'
                          : m.r2Score < 0.5
                          ? 'text-[#C55348] bg-[#C55348]/20'
                          : 'text-[#F4F3F0]'
                      }`}>
                        {m.r2Score.toFixed(4)}
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right font-mono-tabular text-sm text-[#F4F3F0]">
                      {formatIndianCurrency(m.mae)}
                    </td>

                    <td className="py-4 px-5 text-right font-mono-tabular text-sm text-[#9A9E9F]">
                      {formatIndianCurrency(m.rmse)}
                    </td>

                    <td className="py-4 px-5 text-center">
                      {m.isBest ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-tabular uppercase tracking-wider font-bold text-[#1E6E4F] bg-[#1E6E4F]/20 px-2.5 py-1 rounded-full border border-[#1E6E4F]/40">
                          <CheckCircle2 className="w-3 h-3" /> Best Model
                        </span>
                      ) : m.slug === 'adaboost' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono-tabular uppercase tracking-wider font-bold text-[#C55348] bg-[#C55348]/15 px-2.5 py-1 rounded-full border border-[#C55348]/30">
                          Outlier Sensitive
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono-tabular text-[#8C8F94] px-2 py-0.5 rounded bg-[rgba(244,243,240,0.06)]">
                          Standard Baseline
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* LIVE SIMULTANEOUS 5-MODEL SIMULATOR */}
      <div className="p-6 sm:p-8 rounded-xl border border-[#B8924A]/30 bg-[#17181C] shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-[#F4F3F0]">
              Simultaneous 5-Model Live Evaluator
            </h3>
          </div>
          <span className="text-xs font-mono-tabular text-[#9A9E9F]">
            Adjust specs below to watch all 5 regressors predict in parallel
          </span>
        </div>

        <SpecDivider className="my-1" />

        {/* Quick Simulator Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-3.5 rounded-lg bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8C8F94]">Max Power:</span>
              <span className="font-mono-tabular font-bold text-[#B8924A]">{simInput.max_power} bhp</span>
            </div>
            <input
              type="range"
              min="40"
              max="350"
              value={simInput.max_power}
              onChange={(e) => setSimInput({ ...simInput, max_power: parseInt(e.target.value) || 40 })}
              className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded"
            />
          </div>

          <div className="p-3.5 rounded-lg bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8C8F94]">Vehicle Age:</span>
              <span className="font-mono-tabular font-bold text-[#B8924A]">{simInput.vehicle_age} Years</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={simInput.vehicle_age}
              onChange={(e) => setSimInput({ ...simInput, vehicle_age: parseInt(e.target.value) || 0 })}
              className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded"
            />
          </div>

          <div className="p-3.5 rounded-lg bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-[#8C8F94]">Distance Driven:</span>
              <span className="font-mono-tabular font-bold text-[#B8924A]">{simInput.km_driven.toLocaleString('en-IN')} km</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="5000"
              value={simInput.km_driven}
              onChange={(e) => setSimInput({ ...simInput, km_driven: parseInt(e.target.value) || 5000 })}
              className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded"
            />
          </div>

        </div>

        {/* Simulator Results Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {simPredictions.map((pred) => (
            <div
              key={pred.slug}
              className={`p-4 rounded-xl border text-center flex flex-col justify-between ${
                pred.isBest
                  ? 'border-[#B8924A] bg-[#B8924A]/15 ring-1 ring-[#B8924A]/40'
                  : 'border-[rgba(244,243,240,0.08)] bg-[#1F2126]/60'
              }`}
            >
              <div>
                <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#8C8F94] block line-clamp-1">
                  {pred.slug.toUpperCase()}
                </span>
                <div className="text-base font-mono-tabular font-bold text-[#F4F3F0] my-1">
                  {pred.formattedPrice}
                </div>
                <div className="text-[11px] font-mono-tabular text-[#B8924A]">
                  {pred.priceInWords}
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[rgba(244,243,240,0.06)] text-[10px] font-mono-tabular text-[#8C8F94]">
                R² = {pred.r2Score.toFixed(4)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* VISUAL CHARTS COMPARISON */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* R² Score Bar Chart */}
        <div className="p-6 rounded-xl border border-[rgba(244,243,240,0.1)] bg-[#17181C] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#B8924A]" />
              <h3 className="font-serif-heading text-base font-semibold text-[#F4F3F0]">
                R² Score Comparison (Higher is Better)
              </h3>
            </div>
            <span className="text-xs font-mono-tabular text-[#8C8F94]">Max: 1.0000</span>
          </div>

          <div className="space-y-4 pt-2">
            {MODEL_METRICS.map((m) => {
              const widthPct = (m.r2Score / maxR2) * 100;
              return (
                <div key={m.slug} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-sans-body">
                    <span className="text-[#E8E6E1] font-medium">{m.name}</span>
                    <span className="font-mono-tabular font-bold text-[#F4F3F0]">
                      R² = {m.r2Score.toFixed(4)}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-[#1F2126] rounded-md overflow-hidden p-[2px]">
                    <div
                      className={`h-full rounded transition-all duration-700 ${
                        m.isBest
                          ? 'bg-[#B8924A]'
                          : m.slug === 'adaboost'
                          ? 'bg-[#C55348]/70'
                          : 'bg-[#9A9E9F]'
                      }`}
                      style={{ width: `${Math.max(8, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MAE Comparison */}
        <div className="p-6 rounded-xl border border-[rgba(244,243,240,0.1)] bg-[#17181C] shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#B8924A]" />
              <h3 className="font-serif-heading text-base font-semibold text-[#F4F3F0]">
                Mean Absolute Error (Lower is Better)
              </h3>
            </div>
            <span className="text-xs font-mono-tabular text-[#8C8F94]">In ₹ Indian Rupees</span>
          </div>

          <div className="space-y-4 pt-2">
            {MODEL_METRICS.map((m) => {
              const widthPct = (m.mae / maxMae) * 100;
              return (
                <div key={m.slug} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-sans-body">
                    <span className="text-[#E8E6E1] font-medium">{m.name}</span>
                    <span className="font-mono-tabular font-bold text-[#F4F3F0]">
                      {formatIndianCurrency(m.mae)}
                    </span>
                  </div>
                  <div className="w-full h-4 bg-[#1F2126] rounded-md overflow-hidden p-[2px]">
                    <div
                      className={`h-full rounded transition-all duration-700 ${
                        m.isBest
                          ? 'bg-[#1E6E4F]'
                          : m.slug === 'adaboost'
                          ? 'bg-[#C55348]'
                          : 'bg-[#9A9E9F]/80'
                      }`}
                      style={{ width: `${Math.max(8, widthPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* VIVA PREPARATION & ACADEMIC DISCUSSION ACCORDION */}
      <div className="p-6 sm:p-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] space-y-6">
        <div className="flex items-center gap-2.5">
          <HelpCircle className="w-5 h-5 text-[#B8924A]" />
          <div>
            <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
              Viva Voice &amp; ML Theory Exam Cheatsheet
            </h3>
            <p className="text-xs text-[#8C8F94] mt-0.5">
              Comprehensive conceptual answers for lab examiners regarding the 5 regression models.
            </p>
          </div>
        </div>

        <SpecDivider className="my-1" />

        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => {
            const isOpen = expandedViva === idx;
            return (
              <div
                key={idx}
                className="rounded-xl border border-[rgba(244,243,240,0.08)] bg-[#1F2126] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedViva(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-[#25282E] transition-colors"
                >
                  <span className="text-xs sm:text-sm font-semibold text-[#F4F3F0] font-sans-body">
                    {idx + 1}. {item.q}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#B8924A] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#8C8F94] shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-[rgba(244,243,240,0.06)] p-4 bg-[#17181C] text-xs text-[#E8E6E1] leading-relaxed font-sans-body space-y-2"
                    >
                      <p>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
