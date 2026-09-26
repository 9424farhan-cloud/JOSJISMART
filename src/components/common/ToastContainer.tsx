import React from 'react';
import { useToast } from '../../context/ToastContext';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => {
        let borderClass = 'border-slate-200 dark:border-slate-700';
        let bgClass = 'bg-white dark:bg-slate-800';
        let icon = <Info className="w-5 h-5 text-ocean-600 dark:text-ocean-400 shrink-0" />;

        if (toast.type === 'success') {
          borderClass = 'border-emerald-300 dark:border-emerald-700/60';
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />;
        } else if (toast.type === 'error') {
          borderClass = 'border-rose-300 dark:border-rose-700/60';
          icon = <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />;
        } else if (toast.type === 'warning') {
          borderClass = 'border-amber-300 dark:border-amber-700/60';
          icon = <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${bgClass} ${borderClass} transition-all duration-300 transform translate-y-0`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="mt-0.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {toast.message}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
