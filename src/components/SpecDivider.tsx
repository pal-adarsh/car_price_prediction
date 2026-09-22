import React from 'react';

interface SpecDividerProps {
  label?: string;
  className?: string;
}

export const SpecDivider: React.FC<SpecDividerProps> = ({ label, className = '' }) => {
  return (
    <div className={`w-full my-6 ${className}`} id="spec-sheet-divider">
      <div className="flex items-center gap-3">
        {label && (
          <span className="text-[11px] font-mono-tabular uppercase tracking-[0.2em] text-[#B8924A] whitespace-nowrap select-none font-semibold">
            {label}
          </span>
        )}
        <div className="flex-1 flex items-center relative h-[10px]">
          {/* Main gauge horizontal line */}
          <div className="w-full h-[1px] bg-[rgba(244,243,240,0.14)] relative">
            {/* Odometer / gauge tick marks */}
            <div className="absolute left-0 top-[-4px] flex gap-2">
              <span className="w-[1px] h-[9px] bg-[#B8924A]/80"></span>
              <span className="w-[1px] h-[5px] bg-[#9A9E9F]/60"></span>
              <span className="w-[1px] h-[7px] bg-[#9A9E9F]/60"></span>
              <span className="w-[1px] h-[9px] bg-[#B8924A]/80"></span>
            </div>
            <div className="absolute right-0 top-[-4px] flex gap-2">
              <span className="w-[1px] h-[9px] bg-[#B8924A]/80"></span>
              <span className="w-[1px] h-[5px] bg-[#9A9E9F]/60"></span>
              <span className="w-[1px] h-[7px] bg-[#9A9E9F]/60"></span>
              <span className="w-[1px] h-[9px] bg-[#B8924A]/80"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
