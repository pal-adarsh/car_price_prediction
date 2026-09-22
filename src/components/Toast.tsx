import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning';
  title: string;
  description?: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-start gap-3 p-3.5 rounded-lg border border-[rgba(244,243,240,0.16)] bg-[#1F2126] text-[#F4F3F0] shadow-2xl backdrop-blur-md"
          >
            {t.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-[#1E6E4F] shrink-0 mt-0.5" />
            )}
            {t.type === 'info' && (
              <Info className="w-5 h-5 text-[#B8924A] shrink-0 mt-0.5" />
            )}
            {t.type === 'warning' && (
              <AlertCircle className="w-5 h-5 text-[#C55348] shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold text-[#F4F3F0]">{t.title}</div>
              {t.description && (
                <div className="text-[11px] text-[#8C8F94] mt-0.5 leading-snug">
                  {t.description}
                </div>
              )}
            </div>

            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#8C8F94] hover:text-[#F4F3F0] p-1 -mr-1 -mt-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
