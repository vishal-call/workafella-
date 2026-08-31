'use client';

import React from 'react';
import { useApp } from '../context/AppContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto bg-[#ffffff] border-2 shadow-2xl p-4 rounded-2xl flex items-start gap-3 transition-all duration-300 animate-slide-in-right ${
              isSuccess
                ? 'border-[#1e8a5f] text-[#161616]'
                : isWarning
                ? 'border-[#f5b400] text-[#161616]'
                : isError
                ? 'border-[#ba1a1a] text-[#161616]'
                : 'border-[#161616] text-[#161616]'
            }`}
          >
            {/* Icon */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 font-bold ${
                isSuccess
                  ? 'bg-[#e7f5ed] text-[#1e8a5f]'
                  : isWarning
                  ? 'bg-[#fffbf2] text-[#7b5900]'
                  : isError
                  ? 'bg-[#ffdad6] text-[#ba1a1a]'
                  : 'bg-[#f4f3f1] text-[#161616]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">
                {isSuccess ? 'check_circle' : isWarning ? 'warning' : isError ? 'error' : 'info'}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 pr-2">
              {toast.title && (
                <h4 className="font-['Space_Grotesk'] text-xs font-bold text-[#161616]">
                  {toast.title}
                </h4>
              )}
              <p className="text-xs text-[#444748] leading-relaxed mt-0.5">
                {toast.message}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#858383] hover:text-[#161616] p-1 rounded-full hover:bg-[#f4f3f1] transition-colors"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};
