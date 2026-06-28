import React from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

interface AlertModalProps {
  isOpen: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  onClose: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({ isOpen, type, title, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 duration-200 bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 rounded-4xl shadow-2xl overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200 p-8 relative">
        
        {/* Close Button Icon */}
        <button 
          onClick={onClose}
          className="absolute transition-colors top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center mt-2 text-center">
          {/* Status Icon Indicator */}
          <div className="mb-4">
            {type === 'success' ? (
              <CheckCircle size={56} className="text-emerald-500 dark:text-emerald-400" />
            ) : (
              <AlertCircle size={56} className="text-rose-500 dark:text-rose-400" />
            )}
          </div>

          {/* Context Layer */}
          <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
          <p className="mb-6 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            {message}
          </p>

          {/* Accept Execution Button */}
          <button
            type="button"
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-bold transition-all active:scale-95 shadow-md uppercase tracking-wider text-sm ${
              type === 'success'
                ? "bg-[#0c4b97] text-white hover:bg-[#60A5FA]/90"
                : "bg-rose-600/40 text-white hover:bg-rose-600 "
            }`}
          >
            Okay
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;