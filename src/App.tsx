import React, { useState } from 'react';
import { CarInput, PredictionResult } from './types';
import { predictCarPrice } from './ml/predictor';
import { Navbar, ActiveTab } from './components/Navbar';
import { AppraisalForm } from './components/AppraisalForm';
import { ValuationResult } from './components/ValuationResult';
import { ModelComparisonView } from './components/ModelComparisonView';
import { InsightsView } from './components/InsightsView';
import { DjangoCodeView } from './components/DjangoCodeView';
import { SpecDivider } from './components/SpecDivider';
import { ToastContainer, ToastMessage } from './components/Toast';
import { Gauge, ShieldCheck, Sparkles, BookOpen, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('appraisal');
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, description?: string, type: 'success' | 'info' | 'warning' = 'info') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleFormSubmit = (data: CarInput) => {
    const res = predictCarPrice(data, 'rf');
    setPredictionResult(res);
    addToast('Valuation Generated', `Appraised at ${res.formattedPrice} (${res.priceInWords})`, 'success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAppraisal = () => {
    setPredictionResult(null);
    setActiveTab('appraisal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#17181C] text-[#F4F3F0] flex flex-col font-sans-body selection:bg-[#B8924A]/30 selection:text-[#F4F3F0]">
      
      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area with Page Transitions */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <AnimatePresence mode="wait">
          {activeTab === 'appraisal' && (
            <motion.div
              key={predictionResult ? 'result' : 'form'}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              {!predictionResult ? (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] font-semibold">
                        AUTOMOTIVE MARKET APPRAISAL DESK
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#1E6E4F]/20 text-[#1E6E4F] font-mono-tabular font-bold border border-[#1E6E4F]/30">
                        15,242 Records Trained
                      </span>
                    </div>
                    <h1 className="font-serif-heading text-2xl sm:text-4xl font-semibold text-[#F4F3F0] mt-1">
                      Used Vehicle Resale Valuation
                    </h1>
                    <p className="text-sm text-[#8C8F94] font-sans-body mt-2 max-w-3xl leading-relaxed">
                      Enter technical specifications, odometer readings, and condition parameters below. The regression engine calculates the market valuation using an ensemble of 100 decision trees (Random Forest Regressor, R² = 0.8790, MAE = ±₹1,05,480).
                    </p>
                  </div>

                  <SpecDivider />

                  <AppraisalForm onSubmit={handleFormSubmit} onToast={addToast} />
                </div>
              ) : (
                <ValuationResult
                  result={predictionResult}
                  onNewAppraisal={handleNewAppraisal}
                  onViewComparison={() => {
                    setActiveTab('comparison');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  onToast={addToast}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              key="comparison"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <ModelComparisonView />
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <InsightsView />
            </motion.div>
          )}

          {activeTab === 'django' && (
            <motion.div
              key="django"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
            >
              <DjangoCodeView onToast={addToast} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-[rgba(244,243,240,0.12)] bg-[#121316] py-8 text-xs text-[#8C8F94]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-[#B8924A]/20 text-[#B8924A] flex items-center justify-center">
                  <Gauge className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif-heading font-semibold text-sm text-[#F4F3F0]">
                  Used Car Valuation Desk &amp; ML Regression Suite
                </span>
              </div>
              <p className="text-[11px] text-[#8C8F94]">
                BE Computer Science / AI &amp; ML Academic Mini-Project
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono-tabular text-[#9A9E9F]">
              <span className="px-2 py-0.5 rounded bg-[#17181C] border border-[rgba(244,243,240,0.08)]">
                Random Forest R² 0.8790
              </span>
              <span className="px-2 py-0.5 rounded bg-[#17181C] border border-[rgba(244,243,240,0.08)]">
                MAE ±₹1,05,480
              </span>
              <span className="px-2 py-0.5 rounded bg-[#17181C] border border-[rgba(244,243,240,0.08)]">
                15,242 Dataset Rows
              </span>
              <span className="px-2 py-0.5 rounded bg-[#17181C] border border-[rgba(244,243,240,0.08)]">
                Django 4.2 MTV
              </span>
            </div>
          </div>

          <div className="border-t border-[rgba(244,243,240,0.06)] pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] text-[#8C8F94]">
            <p>
              <strong className="text-[#E8E6E1]">Academic Disclaimer:</strong> Resale valuations are statistical regression approximations derived from historical Cardekho marketplace records and should not be used as certified legal or commercial appraisals.
            </p>
            <span className="shrink-0 text-[#8C8F94] font-mono-tabular">
              scikit-learn • Vite • React 19 • Tailwind
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
