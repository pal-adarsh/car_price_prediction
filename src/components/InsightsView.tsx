import React, { useState, useMemo } from 'react';
import { FEATURE_IMPORTANCES, formatIndianCurrency } from '../data/modelsData';
import { SpecDivider } from './SpecDivider';
import { Zap, Database, Filter, Layers, CheckCircle2, TrendingUp, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

export const InsightsView: React.FC = () => {
  const [depreciationTier, setDepreciationTier] = useState<'budget' | 'mid' | 'luxury'>('mid');
  const [selectedFeatureIdx, setSelectedFeatureIdx] = useState<number | null>(0);

  // Generate depreciation timeline based on tier
  const depreciationCurve = useMemo(() => {
    const basePrices = { budget: 600000, mid: 1200000, luxury: 4500000 };
    const rates = { budget: 0.12, mid: 0.135, luxury: 0.16 };
    const base = basePrices[depreciationTier];
    const rate = rates[depreciationTier];

    return [0, 1, 2, 3, 4, 5, 7, 10, 12].map((year) => {
      const remainingValue = Math.max(35000, Math.round((base * Math.pow(1 - rate, year)) / 1000) * 1000);
      const retentionPct = Math.round((remainingValue / base) * 100);
      return {
        year,
        value: remainingValue,
        formattedValue: formatIndianCurrency(remainingValue),
        retentionPct
      };
    });
  }, [depreciationTier]);

  return (
    <div className="w-full space-y-10" id="feature-insights-page">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
            FEATURE IMPORTANCE &amp; PIPELINE METHODOLOGY
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#B8924A]/20 text-[#B8924A] font-mono-tabular font-bold border border-[#B8924A]/30">
            MDI Gini Reduction
          </span>
        </div>
        <h2 className="font-serif-heading text-2xl sm:text-4xl font-semibold text-[#F4F3F0] mt-1">
          Random Forest Feature Insights &amp; Market Dynamics
        </h2>
        <p className="text-sm text-[#8C8F94] font-sans-body mt-2 max-w-3xl leading-relaxed">
          Mean Decrease in Impurity (MDI) computed across 100 decision trees reveals the mathematical drivers of automobile valuations across the Indian secondary car market.
        </p>
      </div>

      <SpecDivider />

      {/* DOMINANT FEATURE HIGHLIGHT BANNER */}
      <div className="p-6 sm:p-8 rounded-2xl border border-[#B8924A]/50 bg-gradient-to-r from-[#B8924A]/15 via-[#1F2126] to-[#17181C] shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#B8924A]" />
              <span className="text-xs font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-bold">
                PRIMARY PREDICTOR FINDING
              </span>
            </div>
            <h3 className="font-serif-heading text-xl sm:text-3xl font-bold text-[#F4F3F0]">
              Max Power Dominates Valuation (63.5% Model Signal)
            </h3>
            <p className="text-xs sm:text-sm text-[#E8E6E1] leading-relaxed font-sans-body">
              Peak engine power output (<code className="text-[#B8924A] font-mono-tabular font-bold">max_power</code> in bhp) is by far the single most influential regression feature (0.635). In the automotive market, power output directly determines vehicle segment hierarchy, luxury trim tier, and baseline manufacturing cost.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-[#17181C] border border-[#B8924A]/40 text-center shrink-0 min-w-[200px] shadow-lg">
            <span className="text-[11px] font-mono-tabular uppercase tracking-wider text-[#8C8F94] block">
              Max Power Weight
            </span>
            <span className="font-mono-tabular text-4xl sm:text-5xl font-extrabold text-[#B8924A] my-1.5 block">
              63.5%
            </span>
            <span className="text-[10px] text-[#9A9E9F] font-mono-tabular">
              5x higher than 2nd feature
            </span>
          </div>
        </div>
      </div>

      {/* FEATURE IMPORTANCE RANKING LIST WITH ACCENT FOCUS */}
      <div className="p-6 sm:p-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] shadow-lg space-y-6">
        <div>
          <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-[#F4F3F0]">
            Feature Importance Ranking (All 10 Features)
          </h3>
          <p className="text-xs text-[#8C8F94] mt-1">
            Calculated using Mean Decrease in Impurity (MDI) across all 100 Random Forest estimators.
          </p>
        </div>

        <div className="space-y-3">
          {FEATURE_IMPORTANCES.map((item, idx) => {
            const isTop = idx === 0;
            const isSelected = selectedFeatureIdx === idx;

            return (
              <div
                key={item.feature}
                onClick={() => setSelectedFeatureIdx(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  isTop
                    ? 'border-[#B8924A]/60 bg-[#B8924A]/10 ring-1 ring-[#B8924A]/30'
                    : isSelected
                    ? 'border-[rgba(244,243,240,0.25)] bg-[#1F2126]'
                    : 'border-[rgba(244,243,240,0.06)] bg-[#1F2126]/60 hover:bg-[#1F2126]'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-md font-mono-tabular text-xs flex items-center justify-center font-bold ${
                      isTop ? 'bg-[#B8924A] text-[#17181C]' : 'bg-[rgba(244,243,240,0.08)] text-[#8C8F94]'
                    }`}>
                      {idx + 1}
                    </span>
                    <span className="font-mono-tabular font-bold text-sm text-[#F4F3F0]">
                      {item.feature}
                    </span>
                    {isTop && (
                      <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#B8924A] text-[#17181C] font-bold">
                        Dominant Driver
                      </span>
                    )}
                  </div>
                  <span className={`font-mono-tabular text-sm font-bold ${isTop ? 'text-[#B8924A]' : 'text-[#F4F3F0]'}`}>
                    {item.percentage} <span className="text-xs font-normal text-[#8C8F94]">({item.importance.toFixed(3)})</span>
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2.5 bg-[#17181C] rounded-full overflow-hidden p-[2px] mb-2">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      isTop ? 'bg-[#B8924A]' : idx < 3 ? 'bg-[#9A9E9F]' : 'bg-[#8C8F94]/50'
                    }`}
                    style={{ width: `${Math.max(2, item.importance * 100)}%` }}
                  />
                </div>

                <p className="text-xs text-[#8C8F94] leading-relaxed font-sans-body">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* INTERACTIVE MULTI-YEAR DEPRECIATION CURVE CALCULATOR */}
      <div className="p-6 sm:p-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#B8924A]" />
              <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-[#F4F3F0]">
                Market Depreciation Decay Model
              </h3>
            </div>
            <p className="text-xs text-[#8C8F94] mt-0.5">
              Empirical value retention curve over a 12-year lifespan across different vehicle tiers.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-[#1F2126] p-1 rounded-lg border border-[rgba(244,243,240,0.08)]">
            {[
              { id: 'budget', label: 'Economy Hatch (₹6L)' },
              { id: 'mid', label: 'Mid Sedan (₹12L)' },
              { id: 'luxury', label: 'Luxury (₹45L)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setDepreciationTier(t.id as any)}
                className={`text-xs px-3 py-1.5 rounded font-medium transition-all ${
                  depreciationTier === t.id
                    ? 'bg-[#B8924A] text-[#17181C] font-bold'
                    : 'text-[#8C8F94] hover:text-[#F4F3F0]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <SpecDivider className="my-1" />

        {/* Depreciation Table & Visual Decay Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2">
          {depreciationCurve.map((point) => (
            <div
              key={point.year}
              className="p-3 rounded-lg bg-[#1F2126] border border-[rgba(244,243,240,0.06)] text-center space-y-1"
            >
              <span className="text-[10px] font-mono-tabular text-[#8C8F94] block">
                {point.year === 0 ? 'Brand New' : `Year ${point.year}`}
              </span>
              <div className="text-xs font-mono-tabular font-bold text-[#F4F3F0]">
                {point.formattedValue}
              </div>
              <div className={`text-[10px] font-mono-tabular font-semibold ${
                point.retentionPct > 60 ? 'text-[#1E6E4F]' : point.retentionPct > 30 ? 'text-[#B8924A]' : 'text-[#C55348]'
              }`}>
                {point.retentionPct}% Left
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DATASET QUALITY & CLEANING METHODOLOGY SPEC */}
      <div className="p-6 sm:p-8 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] space-y-6 shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-[#B8924A]" />
            <h3 className="font-serif-heading text-lg sm:text-xl font-semibold text-[#F4F3F0]">
              Dataset Quality &amp; Cleaning Pipeline Flow
            </h3>
          </div>
          <p className="text-xs text-[#8C8F94] mt-1">
            Data preprocessing and cleansing pipeline executing scikit-learn standardizations.
          </p>
        </div>

        <SpecDivider className="my-1" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-5 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
            <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#B8924A] font-semibold block">
              Step 1: Raw Records
            </span>
            <div className="font-mono-tabular text-3xl font-bold text-[#F4F3F0]">15,411</div>
            <p className="text-xs text-[#8C8F94]">Raw entries in cardekho_dataset.csv across 14 original columns.</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
            <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#C55348] font-semibold block">
              Step 2: Deduplication
            </span>
            <div className="font-mono-tabular text-3xl font-bold text-[#C55348]">-167 Rows</div>
            <p className="text-xs text-[#8C8F94]">Exact duplicate records dropped using df.drop_duplicates().</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1F2126] border border-[rgba(244,243,240,0.06)] space-y-2">
            <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#B8924A] font-semibold block">
              Step 3: Invalid Geometry
            </span>
            <div className="font-mono-tabular text-3xl font-bold text-[#F4F3F0]">31 Brands</div>
            <p className="text-xs text-[#8C8F94]">seats == 0 removed; brand strings normalized (ISUZU → Isuzu).</p>
          </div>

          <div className="p-5 rounded-xl bg-[#1E6E4F]/10 border border-[#1E6E4F]/40 space-y-2">
            <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#1E6E4F] font-bold block">
              Step 4: Clean Training Matrix
            </span>
            <div className="font-mono-tabular text-3xl font-extrabold text-[#1E6E4F]">15,242</div>
            <p className="text-xs text-[#E8E6E1]">Clean rows converted into 10 numeric &amp; encoded regression features.</p>
          </div>

        </div>
      </div>

    </div>
  );
};
