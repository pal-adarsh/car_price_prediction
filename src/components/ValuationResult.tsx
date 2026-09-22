import React, { useEffect, useState, useMemo } from 'react';
import { PredictionResult, CarInput } from '../types';
import { SpecDivider } from './SpecDivider';
import { formatIndianCurrency, formatPriceInWords } from '../data/modelsData';
import { predictCarPrice } from '../ml/predictor';
import {
  ShieldCheck,
  ArrowLeft,
  BarChart2,
  CheckCircle2,
  AlertCircle,
  Printer,
  Copy,
  Share2,
  Check,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Sliders,
  Layers,
  HelpCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ValuationResultProps {
  result: PredictionResult;
  onNewAppraisal: () => void;
  onViewComparison: () => void;
  onToast?: (title: string, desc?: string, type?: 'success' | 'info' | 'warning') => void;
}

export const ValuationResult: React.FC<ValuationResultProps> = ({
  result,
  onNewAppraisal,
  onViewComparison,
  onToast
}) => {
  const [displayPrice, setDisplayPrice] = useState(0);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'breakdown' | 'whatif' | 'models'>('breakdown');

  // Interactive What-If Sandbox Local State
  const [sandboxInput, setSandboxInput] = useState<CarInput>(result.input);

  // Smooth odometer count-up on mount / change
  useEffect(() => {
    let start = 0;
    const end = result.predictedPrice;
    const duration = 650;
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeOut);
      setDisplayPrice(current);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayPrice(end);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [result.predictedPrice]);

  // Compute sandbox recalculation
  const sandboxResult = useMemo(() => {
    return predictCarPrice(sandboxInput, 'rf');
  }, [sandboxInput]);

  const priceDelta = sandboxResult.predictedPrice - result.predictedPrice;

  const handleCopySummary = () => {
    const summary = `--- USED CAR VALUATION CERTIFICATE ---
Vehicle: ${result.input.brand} (${result.input.vehicle_age} Years Old)
Odometer: ${result.input.km_driven.toLocaleString('en-IN')} km | Transmission: ${result.input.transmission_type}
Engine: ${result.input.engine} cc | Power: ${result.input.max_power} bhp | Fuel: ${result.input.fuel_type}
ESTIMATED RESALE VALUE: ${result.formattedPrice} (${result.priceInWords})
Confidence Range (±1 MAE): ${result.confidenceRange.formattedLow} - ${result.confidenceRange.formattedHigh}
Model: Random Forest Regressor (R² = 0.8790, 100 Trees)
Generated on: ${result.timestamp}`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    if (onToast) {
      onToast('Valuation Copied', 'Appraisal summary copied to clipboard.', 'success');
    }
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
    if (onToast) {
      onToast('Print Dialog Triggered', 'Formatting official valuation document for print.', 'info');
    }
  };

  const { input } = result;

  return (
    <div className="w-full space-y-8" id="valuation-result-sheet">
      
      {/* Top Header & Certificate Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(244,243,240,0.1)]">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
              VALUATION CERTIFICATE #APP-{Math.floor(result.predictedPrice / 1000)}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E6E4F]/20 text-[#1E6E4F] font-mono-tabular font-bold border border-[#1E6E4F]/30">
              VERIFIED RF REGRESSION
            </span>
          </div>
          <h2 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#F4F3F0] mt-1">
            {input.brand} Appraisal Sheet
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopySummary}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-[rgba(244,243,240,0.16)] bg-[#17181C] text-[#E8E6E1] hover:text-[#F4F3F0] hover:border-[#B8924A] transition-all cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#1E6E4F]" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Summary'}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-[rgba(244,243,240,0.16)] bg-[#17181C] text-[#E8E6E1] hover:text-[#F4F3F0] hover:border-[#B8924A] transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Sheet</span>
          </button>

          <button
            type="button"
            onClick={onNewAppraisal}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-[rgba(244,243,240,0.16)] bg-[#17181C] text-[#E8E6E1] hover:text-[#F4F3F0] hover:border-[#B8924A] transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>New Valuation</span>
          </button>

          <button
            type="button"
            onClick={onViewComparison}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs rounded-lg border border-[#B8924A]/40 bg-[#B8924A]/10 text-[#B8924A] hover:bg-[#B8924A]/20 transition-all font-semibold cursor-pointer"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span>5-Model Comparison</span>
          </button>
        </div>
      </div>

      {/* HERO VALUATION CERTIFICATE BANNER */}
      <div className="p-6 sm:p-10 rounded-2xl border border-[#B8924A]/40 bg-gradient-to-br from-[#1F2126] via-[#1A1C20] to-[#17181C] shadow-2xl relative overflow-hidden">
        {/* Background watermark badge */}
        <div className="absolute right-6 top-6 opacity-5 pointer-events-none select-none font-serif-heading text-9xl">
          ₹
        </div>

        <div className="relative z-10 space-y-6">
          {/* Eyebrow and Status */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#1E6E4F] animate-pulse"></span>
              <span className="text-xs font-mono-tabular uppercase tracking-[0.25em] text-[#1E6E4F] font-bold">
                ESTIMATED RESALE VALUATION
              </span>
            </div>
            <span className="text-xs font-mono-tabular text-[#8C8F94]">
              Evaluation Date: {result.timestamp}
            </span>
          </div>

          {/* Main Price Numeral */}
          <div>
            <div className="flex flex-wrap items-baseline gap-4">
              <span className="font-mono-tabular text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#F4F3F0]">
                {formatIndianCurrency(displayPrice)}
              </span>
              <span className="text-base sm:text-xl font-mono-tabular text-[#B8924A] font-bold">
                ({result.priceInWords})
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#E8E6E1] mt-3 font-sans-body max-w-2xl leading-relaxed">
              Typical estimation variance is within <strong className="text-[#F4F3F0] font-mono-tabular">₹{result.mae.toLocaleString('en-IN')}</strong> of historical Cardekho transaction values (Random Forest MAE: ±{result.formattedMae}, R² = 0.8790).
            </p>
          </div>

          <SpecDivider className="my-2" />

          {/* Confidence interval band */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-[#17181C]/90 border border-[rgba(244,243,240,0.08)]">
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#8C8F94] block font-medium">
                Conservative Valuation (-1 MAE)
              </span>
              <span className="text-lg font-mono-tabular font-bold text-[#9A9E9F] mt-1 block">
                {result.confidenceRange.formattedLow}
              </span>
              <span className="text-[11px] text-[#8C8F94] mt-0.5 block">Lower expected bound</span>
            </div>

            <div className="p-4 rounded-xl bg-[#B8924A]/15 border border-[#B8924A]/50 ring-1 ring-[#B8924A]/30">
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#B8924A] block font-bold">
                Expected Appraisal Value (Median)
              </span>
              <span className="text-lg font-mono-tabular font-extrabold text-[#F4F3F0] mt-1 block">
                {result.formattedPrice}
              </span>
              <span className="text-[11px] text-[#B8924A] mt-0.5 block font-medium">100-tree ensemble average</span>
            </div>

            <div className="p-4 rounded-xl bg-[#17181C]/90 border border-[rgba(244,243,240,0.08)]">
              <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#8C8F94] block font-medium">
                Optimistic Valuation (+1 MAE)
              </span>
              <span className="text-lg font-mono-tabular font-bold text-[#9A9E9F] mt-1 block">
                {result.confidenceRange.formattedHigh}
              </span>
              <span className="text-[11px] text-[#8C8F94] mt-0.5 block">Upper expected bound</span>
            </div>
          </div>
        </div>
      </div>

      {/* INTERACTIVE EXPLORATION TABS */}
      <div className="rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C] overflow-hidden shadow-lg">
        
        {/* Tab Switcher */}
        <div className="flex border-b border-[rgba(244,243,240,0.1)] bg-[#1F2126] p-1.5 gap-1">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-[#17181C] text-[#B8924A] border border-[#B8924A]/40 shadow-sm'
                : 'text-[#8C8F94] hover:text-[#F4F3F0]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Valuation Factor Waterfall</span>
          </button>

          <button
            onClick={() => setActiveTab('whatif')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'whatif'
                ? 'bg-[#17181C] text-[#B8924A] border border-[#B8924A]/40 shadow-sm'
                : 'text-[#8C8F94] hover:text-[#F4F3F0]'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>"What-If" Sensitivity Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab('models')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'models'
                ? 'bg-[#17181C] text-[#B8924A] border border-[#B8924A]/40 shadow-sm'
                : 'text-[#8C8F94] hover:text-[#F4F3F0]'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            <span>5-Model Side-by-Side</span>
          </button>
        </div>

        {/* TAB 1: FACTOR WATERFALL BREAKDOWN */}
        {activeTab === 'breakdown' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
                Itemized Price Decomposition &amp; Feature Impact
              </h3>
              <p className="text-xs text-[#8C8F94] mt-1">
                How each vehicle feature contributed to the final valuation of <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{result.formattedPrice}</span>.
              </p>
            </div>

            <div className="space-y-3">
              {result.breakdown?.map((factor, idx) => {
                const isPositive = factor.effect === 'positive';
                const isNegative = factor.effect === 'negative';

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#1F2126]/70 border border-[rgba(244,243,240,0.06)] hover:border-[rgba(244,243,240,0.15)] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#F4F3F0]">{factor.name}</span>
                        <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[rgba(244,243,240,0.06)] text-[#9A9E9F]">
                          Weight: {factor.impactPercentage}%
                        </span>
                      </div>
                      <p className="text-xs text-[#8C8F94] leading-relaxed">{factor.detail}</p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <div className="text-xs font-mono-tabular text-[#9A9E9F]">
                        {factor.valueDescription}
                      </div>
                      <div className={`text-sm font-mono-tabular font-bold mt-0.5 flex items-center sm:justify-end gap-1 ${
                        isPositive ? 'text-[#1E6E4F]' : isNegative ? 'text-[#C55348]' : 'text-[#8C8F94]'
                      }`}>
                        {isPositive && <TrendingUp className="w-3.5 h-3.5" />}
                        {isNegative && <TrendingDown className="w-3.5 h-3.5" />}
                        <span>
                          {factor.amountDelta > 0 ? '+' : ''}
                          {formatIndianCurrency(factor.amountDelta)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: "WHAT-IF" SENSITIVITY SANDBOX */}
        {activeTab === 'whatif' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-[#B8924A]" />
                <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
                  Real-Time Sensitivity &amp; Depreciation Sandbox
                </h3>
              </div>
              <p className="text-xs text-[#8C8F94] mt-1">
                Tweak parameters to see how changing age, mileage, power, or transmission would alter this car's resale value in real time.
              </p>
            </div>

            {/* Sandbox Comparison Badge */}
            <div className="p-5 rounded-xl border border-[#B8924A]/30 bg-[#1F2126] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono-tabular uppercase tracking-wider text-[#8C8F94] block">
                  Simulated Valuation:
                </span>
                <div className="flex items-baseline gap-3">
                  <span className="text-2xl sm:text-3xl font-mono-tabular font-bold text-[#F4F3F0]">
                    {sandboxResult.formattedPrice}
                  </span>
                  <span className={`text-sm font-mono-tabular font-bold ${
                    priceDelta > 0 ? 'text-[#1E6E4F]' : priceDelta < 0 ? 'text-[#C55348]' : 'text-[#8C8F94]'
                  }`}>
                    ({priceDelta > 0 ? '+' : ''}{formatIndianCurrency(priceDelta)})
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSandboxInput(result.input)}
                className="text-xs px-3 py-1.5 rounded-lg border border-[rgba(244,243,240,0.12)] bg-[#17181C] text-[#8C8F94] hover:text-[#F4F3F0]"
              >
                Reset to Original Input
              </button>
            </div>

            {/* Quick Adjusters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* Age Modifier */}
              <div className="p-4 rounded-xl bg-[#1F2126]/60 border border-[rgba(244,243,240,0.06)] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E8E6E1] font-medium">Vehicle Age:</span>
                  <span className="font-mono-tabular font-bold text-[#B8924A]">{sandboxInput.vehicle_age} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="15"
                  value={sandboxInput.vehicle_age}
                  onChange={(e) => setSandboxInput({ ...sandboxInput, vehicle_age: parseInt(e.target.value) || 0 })}
                  className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded"
                />
                <div className="flex justify-between text-[10px] text-[#8C8F94]">
                  <span>New (0 yr)</span>
                  <span>15 yrs</span>
                </div>
              </div>

              {/* Odometer Modifier */}
              <div className="p-4 rounded-xl bg-[#1F2126]/60 border border-[rgba(244,243,240,0.06)] space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#E8E6E1] font-medium">Odometer:</span>
                  <span className="font-mono-tabular font-bold text-[#B8924A]">{sandboxInput.km_driven.toLocaleString('en-IN')} km</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="200000"
                  step="5000"
                  value={sandboxInput.km_driven}
                  onChange={(e) => setSandboxInput({ ...sandboxInput, km_driven: parseInt(e.target.value) || 0 })}
                  className="w-full accent-[#B8924A] h-2 bg-[#17181C] rounded"
                />
                <div className="flex justify-between text-[10px] text-[#8C8F94]">
                  <span>5,000 km</span>
                  <span>200,000 km</span>
                </div>
              </div>

              {/* Transmission Modifier */}
              <div className="p-4 rounded-xl bg-[#1F2126]/60 border border-[rgba(244,243,240,0.06)] space-y-2">
                <div className="text-xs text-[#E8E6E1] font-medium">Transmission Mechanism:</div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {(['Manual', 'Automatic'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSandboxInput({ ...sandboxInput, transmission_type: t })}
                      className={`py-1.5 text-xs rounded font-medium border text-center transition-all ${
                        sandboxInput.transmission_type === t
                          ? 'border-[#B8924A] bg-[#B8924A]/20 text-[#F4F3F0] font-bold'
                          : 'border-[rgba(244,243,240,0.1)] bg-[#17181C] text-[#8C8F94]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: 5-MODEL SIDE-BY-SIDE EVALUATION */}
        {activeTab === 'models' && (
          <div className="p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
                All 5 Models Evaluating This Vehicle
              </h3>
              <p className="text-xs text-[#8C8F94] mt-1">
                Compare how different machine learning regression architectures evaluate this exact car configuration.
              </p>
            </div>

            <div className="space-y-3">
              {result.allModels?.map((model) => (
                <div
                  key={model.slug}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    model.isBest
                      ? 'border-[#B8924A]/50 bg-[#B8924A]/10 ring-1 ring-[#B8924A]/30'
                      : 'border-[rgba(244,243,240,0.06)] bg-[#1F2126]/60'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-[#F4F3F0]">{model.modelName}</span>
                      {model.isBest && (
                        <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#1E6E4F] text-[#F4F3F0] font-bold">
                          ★ Live Primary Engine
                        </span>
                      )}
                      {model.statusBadge && !model.isBest && (
                        <span className="text-[10px] font-mono-tabular px-1.5 py-0.5 rounded bg-[rgba(244,243,240,0.06)] text-[#9A9E9F]">
                          {model.statusBadge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#8C8F94] max-w-xl">{model.note}</p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-base font-mono-tabular font-bold text-[#F4F3F0]">
                      {model.formattedPrice}
                    </div>
                    <div className="text-xs font-mono-tabular text-[#9A9E9F]">
                      R² = {model.r2Score.toFixed(4)} | MAE: {model.formattedMae}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* INPUT SPEC-SHEET RECAP TABLE */}
      <div className="p-6 rounded-xl border border-[rgba(244,243,240,0.12)] bg-[#17181C]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-heading text-lg font-semibold text-[#F4F3F0]">
            Appraised Vehicle Technical Specifications
          </h3>
          <span className="text-xs text-[#8C8F94] font-mono-tabular">10 Encoded Parameters</span>
        </div>

        <SpecDivider className="my-2" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-3 text-xs font-sans-body">
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Vehicle Make / Brand:</span>
            <span className="text-[#F4F3F0] font-semibold">{input.brand}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Vehicle Age:</span>
            <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{input.vehicle_age} Years</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Odometer (Km Driven):</span>
            <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{input.km_driven.toLocaleString('en-IN')} km</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Transmission:</span>
            <span className="text-[#F4F3F0] font-semibold">{input.transmission_type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Fuel Propulsion:</span>
            <span className="text-[#F4F3F0] font-semibold">{input.fuel_type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Seller Channel:</span>
            <span className="text-[#F4F3F0] font-semibold">{input.seller_type}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Engine Displacement:</span>
            <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{input.engine} cc</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Maximum Power Output:</span>
            <span className="text-[#B8924A] font-mono-tabular font-bold">{input.max_power} bhp</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Certified Mileage:</span>
            <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{input.mileage} km/l</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Seating Capacity:</span>
            <span className="text-[#F4F3F0] font-mono-tabular font-semibold">{input.seats} Passengers</span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Regression Architecture:</span>
            <span className="text-[#1E6E4F] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Random Forest (R² = 0.8790)
            </span>
          </div>
          <div className="flex justify-between py-2 border-b border-[rgba(244,243,240,0.06)]">
            <span className="text-[#8C8F94]">Appraisal Time:</span>
            <span className="text-[#8C8F94] font-mono-tabular">{result.timestamp}</span>
          </div>
        </div>
      </div>

      {/* ACADEMIC DISCLAIMER */}
      <div className="p-4 rounded-xl border border-[rgba(244,243,240,0.08)] bg-[#17181C]/40 text-xs text-[#8C8F94] flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-[#B8924A] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-[#E8E6E1]">
            <strong className="text-[#F4F3F0]">Academic Project Disclaimer:</strong> This valuation is an academic regression estimate computed by a Random Forest Regressor trained on 15,242 cleaned Cardekho marketplace records (BE Machine Learning Lab Project).
          </p>
          <p>
            It is provided for statistical demonstration purposes and does not represent a legally binding offer or commercial purchase agreement.
          </p>
        </div>
      </div>

    </div>
  );
};
