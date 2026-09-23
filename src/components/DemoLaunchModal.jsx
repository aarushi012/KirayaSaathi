import React, { useEffect } from 'react';
import { Zap, FileText, CheckCircle2, X, ArrowRight, ShieldCheck, Sparkles, Scale } from 'lucide-react';

export default function DemoLaunchModal({ isOpen, onClose, onLaunchDemo }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleLaunch = () => {
    onClose();
    onLaunchDemo();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-lg bg-[#1B2942] border border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40 overflow-hidden animate-modalIn text-left space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-indigo-500 to-cyan-400" />

        {/* Header & Close Button */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-300 shadow-inner">
              <Zap className="w-6 h-6 fill-amber-400/20" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">⚡ Hackathon Demo Mode</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Zero Setup
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] mt-0.5">
                Try KirayaSaathi
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#8FA0B8] hover:text-[#F8FAFC] hover:bg-[#202F49] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sample Agreement Preview Box */}
        <div className="p-4 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FileText className="w-5 h-5 text-rose-400" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#F8FAFC]">sample_residential_lease.pdf</h4>
                <p className="text-[11px] text-[#8FA0B8]">8 Clauses • Deposit, Lock-in & Repairs</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              Ready to Parse
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-[#2A3B5C]/60 text-xs text-[#B8C4D6]">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Financial terms: Rent, Security Deposit, Notice & Lock-in</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Full clause categorization with attention flags</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Polite negotiation questions with 1-click copying</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleLaunch}
            className="w-full sm:flex-1 inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25 transition-all duration-200 active:scale-[0.98] group cursor-pointer"
          >
            <Zap className="w-4 h-4 mr-2 fill-slate-950" />
            <span>Launch Demo Agreement Pipeline</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#202F49] hover:bg-[#283B5E] text-[#B8C4D6] hover:text-[#F8FAFC] text-sm font-semibold transition-colors border border-[#2A3B5C]/40"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
