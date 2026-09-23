import React, { useEffect } from 'react';
import { Bot, Zap, CheckCircle2, X, Key, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { getActiveApiKey } from '../services/aiService';

export default function DemoEngineStatusModal({ isOpen, onClose, onOpenKeyModal, onRunDemo }) {
  const isLiveAI = Boolean(getActiveApiKey());

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

  const statusItems = [
    { name: 'AI Analysis Engine', detail: isLiveAI ? 'Google Gemini 1.5 Flash (Live)' : 'Rule-Based Pattern Classifier (Active)', ready: true },
    { name: 'PDF Processing', detail: 'Mozilla PDF.js in-browser text extraction', ready: true },
    { name: 'Clause Detection', detail: '8 Core Real Estate categories benchmarked', ready: true },
    { name: 'Insight Generation', detail: 'Plain-English translations & polite negotiations', ready: true }
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#1B2942] border border-[#2A3B5C] rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/40 overflow-hidden animate-modalIn text-left space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Gradient Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-cyan-400 to-amber-500" />

        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl border ${
              isLiveAI ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
            }`}>
              {isLiveAI ? <Bot className="w-6 h-6" /> : <Zap className="w-6 h-6 fill-amber-400/20" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#8FA0B8]">System Status</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 border ${
                  isLiveAI 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isLiveAI ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400 animate-pulse'}`} />
                  Ready
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#F8FAFC] mt-0.5">
                {isLiveAI ? 'Live Gemini AI Engine' : 'Demo Engine Pipeline'}
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

        {/* Engine Pipeline Checklist */}
        <div className="p-4 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/70 space-y-3">
          <div className="text-xs font-bold text-[#B8C4D6] uppercase tracking-wider flex items-center justify-between">
            <span>Pipeline Architecture</span>
            <span className="text-emerald-400 text-[10px] font-mono">100% OPERATIONAL</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {statusItems.map((item, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-[#1B2942]/70 border border-[#2A3B5C]/50 animate-fadeIn"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-[#F8FAFC] flex items-center justify-between">
                    <span>{item.name}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">✓</span>
                  </div>
                  <p className="text-[11px] text-[#8FA0B8] truncate">{item.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ready for demonstration text */}
        <div className="p-3 rounded-xl bg-indigo-950/35 border border-indigo-500/25 text-xs text-indigo-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Ready for demonstration in under 60 seconds with zero network prerequisites.</span>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenKeyModal) onOpenKeyModal();
            }}
            className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-[#202F49] hover:bg-[#283B5E] text-[#E2E8F0] hover:text-white font-semibold text-xs border border-[#2A3B5C] transition-all"
          >
            <Key className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            <span>{isLiveAI ? 'Change API Key' : 'Connect Gemini API Key'}</span>
          </button>

          {onRunDemo && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onRunDemo();
              }}
              className="w-full sm:flex-1 inline-flex items-center justify-center px-4 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md shadow-amber-500/20"
            >
              <Zap className="w-3.5 h-3.5 mr-1.5 fill-slate-950" />
              <span>Launch Demo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
