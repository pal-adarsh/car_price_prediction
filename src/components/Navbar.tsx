import React, { useState } from 'react';
import { Calculator, BarChart3, LineChart, Code2, Gauge, Menu, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export type ActiveTab = 'appraisal' | 'comparison' | 'insights' | 'django';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onTabChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: ActiveTab; label: string; shortLabel: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'appraisal',
      label: 'Appraisal Desk',
      shortLabel: 'Appraise',
      icon: <Calculator className="w-4 h-4" />,
      badge: 'Live RF'
    },
    {
      id: 'comparison',
      label: '5-Model Benchmark',
      shortLabel: 'Benchmark',
      icon: <BarChart3 className="w-4 h-4" />
    },
    {
      id: 'insights',
      label: 'Feature Insights',
      shortLabel: 'Insights',
      icon: <LineChart className="w-4 h-4" />
    },
    {
      id: 'django',
      label: 'Django & Viva Guide',
      shortLabel: 'Django',
      icon: <Code2 className="w-4 h-4" />
    }
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    onTabChange(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-[rgba(244,243,240,0.12)] bg-[#17181C]/95 sticky top-0 z-40 backdrop-blur-md transition-all">
      {/* Top micro-bar */}
      <div className="bg-[#121316] border-b border-[rgba(244,243,240,0.06)] px-4 sm:px-6 lg:px-8 py-1 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px] font-mono-tabular text-[#8C8F94]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#1E6E4F] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1E6E4F] animate-pulse"></span>
              ML Inference Pipeline Online
            </span>
            <span>•</span>
            <span>Trained on 15,242 Cardekho records</span>
            <span>•</span>
            <span>Best Regressor: Random Forest (100 Trees)</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[#B8924A] font-medium">BE ML Lab Mini-Project</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#B8924A]/10 text-[#B8924A] border border-[#B8924A]/30">v2.4 Production</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          
          {/* Brand & Desk Identity */}
          <div 
            onClick={() => handleSelectTab('appraisal')}
            className="flex items-center gap-3.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg border border-[#B8924A]/50 bg-gradient-to-br from-[#B8924A]/20 to-[#17181C] flex items-center justify-center text-[#B8924A] shadow-lg group-hover:border-[#B8924A] transition-colors">
              <Gauge className="w-5 h-5 stroke-[1.8] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-heading text-xl sm:text-2xl font-semibold tracking-tight text-[#F4F3F0]">
                  Valuator
                </span>
                <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded border border-[#B8924A]/30 bg-[#B8924A]/10 text-[#B8924A] uppercase tracking-wider font-semibold">
                  R² 0.879
                </span>
              </div>
              <p className="text-[11px] text-[#8C8F94] font-sans-body hidden sm:block">
                Automotive Appraisal Desk &amp; Regression Suite
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center p-1 rounded-lg bg-[#121316] border border-[rgba(244,243,240,0.08)]">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`relative flex items-center gap-2 px-3.5 py-2 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'text-[#17181C] font-semibold'
                      : 'text-[#8C8F94] hover:text-[#F4F3F0] hover:bg-[#1F2126]/50'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute inset-0 bg-[#F4F3F0] rounded-md shadow-md"
                      transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge && !isActive && (
                      <span className="text-[9px] font-mono-tabular px-1.5 py-0.5 rounded bg-[#B8924A]/15 text-[#B8924A] font-semibold">
                        {item.badge}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg border border-[rgba(244,243,240,0.12)] bg-[#1F2126] text-[#F4F3F0] hover:border-[#B8924A] transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[rgba(244,243,240,0.1)] bg-[#17181C] px-4 py-4 space-y-2"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#F4F3F0] text-[#17181C] font-semibold shadow-sm'
                      : 'bg-[#1F2126] text-[#8C8F94] hover:text-[#F4F3F0]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-[#B8924A]/20 text-[#B8924A]">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
