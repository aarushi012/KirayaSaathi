import React, { useState } from 'react';
import { Sparkles, FileSpreadsheet, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import FileDropzone from './FileDropzone';
import StateSelector from './StateSelector';
import { sampleAgreements } from '../data/sampleAgreements';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function UploadSection({ 
  onFileSelected, 
  onSampleSelected, 
  onTextSubmit, 
  onTryDemo, 
  isProcessing, 
  externalError, 
  onClearError,
  selectedStateId = 'delhi',
  onSelectState
}) {
  const [activeTab, setActiveTab] = useState('upload');
  const [pastedText, setPastedText] = useState('');
  const [pasteError, setPasteError] = useState('');
  const { ref: sectionRef, isVisible, animKey } = useScrollReveal('analyze', { threshold: 0.15 });
  const [isSectionHighlighted, setIsSectionHighlighted] = useState(false);

  React.useEffect(() => {
    const handleReplay = (e) => {
      if (e.detail?.sectionId === 'analyze') {
        setIsSectionHighlighted(true);
        setTimeout(() => setIsSectionHighlighted(false), 1400);
      }
    };
    window.addEventListener('replay-section-animation', handleReplay);
    return () => window.removeEventListener('replay-section-animation', handleReplay);
  }, []);

  const handlePastedSubmit = (e) => {
    e.preventDefault();
    if (!pastedText.trim() || pastedText.trim().length < 30) {
      setPasteError('Please enter at least one or two complete lease clauses to analyze.');
      return;
    }
    setPasteError('');
    onTextSubmit(pastedText);
  };

  return (
    <section 
      id="analyze" 
      ref={sectionRef}
      className={`py-12 md:py-16 relative transition-all duration-500 ease-out ${
        isSectionHighlighted ? 'section-highlight-active' : ''
      }`}
    >
      <div key={animKey} className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Subtitle */}
        <div className="text-center max-w-2xl mx-auto mb-6">
          
          {/* 1. Badge */}
          <div 
            className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-xs font-semibold text-indigo-300 mb-3 transition-all ${
              isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
            }`}
            style={{
              transitionDuration: isVisible ? '500ms' : '200ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isVisible ? '0ms' : '0ms'
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Instant AI Clause Parser</span>
          </div>

          {/* 2. Heading */}
          <h2 
            className={`text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight transition-all ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
            style={{
              transitionDuration: isVisible ? '550ms' : '200ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isVisible ? '80ms' : '0ms'
            }}
          >
            Analyze Your Rental Agreement
          </h2>

          {/* 3. Subtitle */}
          <p 
            className={`mt-2 text-[#B8C4D6] text-sm sm:text-base transition-all ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{
              transitionDuration: isVisible ? '500ms' : '200ms',
              transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              transitionDelay: isVisible ? '160ms' : '0ms'
            }}
          >
            Upload your lease agreement PDF or try our bundled sample agreement in Demo Mode.
          </p>
        </div>

        {/* 4. Highlighted Hackathon 1-Click Demo Card with 3D depth */}
        <div 
          onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 3, 4)}
          onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
          className={`mb-8 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/15 via-[#1B2942] to-[#142039] border border-amber-500/35 hover:border-amber-400/60 shadow-xl hover:shadow-amber-500/15 flex flex-col sm:flex-row items-center justify-between gap-4 group cursor-default relative overflow-hidden will-change-transform transition-all ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
          }`}
          style={{
            transitionProperty: 'opacity, transform, border-color, box-shadow',
            transitionDuration: isVisible ? '550ms' : '200ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: isVisible ? '240ms' : '0ms'
          }}
        >
          <div className="card-glare-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-20" />
          
          <div className="flex items-center gap-3.5 text-center sm:text-left relative z-10">
            <div className="p-3 bg-amber-500/20 rounded-xl text-amber-300 border border-amber-500/40 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Zap className="w-6 h-6 fill-amber-300/20" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="text-sm font-bold text-[#F8FAFC]">⚡ Hackathon Demo Mode</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Zero Setup Required
                </span>
              </div>
              <p className="text-xs text-[#B8C4D6] mt-0.5 max-w-xl">
                Load a bundled 8-clause residential lease with pre-analyzed insights (Rent, Deposit, Lock-in, Repairs, Entry, Penalties) in under 60 seconds.
              </p>
            </div>
          </div>

          {/* Try Demo Agreement Button */}
          <button
            type="button"
            onClick={onTryDemo}
            disabled={isProcessing}
            className="relative z-10 overflow-hidden w-full sm:w-auto shrink-0 inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition-all shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:-translate-y-[2px] active:scale-[0.97] disabled:opacity-50 group cursor-pointer"
          >
            {/* Subtle Light Sweep */}
            <div 
              className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" 
              aria-hidden="true"
            />
            
            <Zap className="relative z-10 w-4 h-4 mr-1.5 fill-slate-950" />
            <span className="relative z-10">Try Demo Agreement</span>
            <ArrowRight className="relative z-10 w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform duration-200" />
          </button>
        </div>

        {/* 5. State / Rental Jurisdiction Selector */}
        <div 
          className={`mb-8 p-5 sm:p-6 rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] shadow-xl backdrop-blur-xl transition-all ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-[0.98]'
          }`}
          style={{
            transitionDuration: isVisible ? '500ms' : '200ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: isVisible ? '280ms' : '0ms'
          }}
        >
          <StateSelector 
            selectedStateId={selectedStateId} 
            onSelectState={onSelectState} 
          />
        </div>

        {/* 6. Tabs: Upload PDF Agreement / Paste Text */}
        <div 
          className={`flex justify-center mb-6 transition-all ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            transitionDuration: isVisible ? '500ms' : '200ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: isVisible ? '320ms' : '0ms'
          }}
        >
          <div className="bg-[#142039] p-1 rounded-xl border border-[rgba(130,150,190,0.2)] flex gap-1 shadow-inner relative">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-[#8FA0B8] hover:text-[#F8FAFC]'
              }`}
            >
              Upload PDF Agreement
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('paste')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'paste'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-[#8FA0B8] hover:text-[#F8FAFC]'
              }`}
            >
              Paste Agreement Text
            </button>
          </div>
        </div>

        {/* 6. Upload Area / Card */}
        <div 
          className={`bg-[#1B2942]/90 rounded-2xl border border-[rgba(130,150,190,0.22)] hover:border-[rgba(130,150,190,0.35)] shadow-2xl p-6 sm:p-10 backdrop-blur-xl relative overflow-hidden will-change-transform transition-all ${
            isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
          }`}
          style={{
            transitionProperty: 'opacity, transform, border-color, box-shadow',
            transitionDuration: isVisible ? '600ms' : '200ms',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
            transitionDelay: isVisible ? '400ms' : '0ms'
          }}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500" />

          {activeTab === 'upload' ? (
            <div className="animate-fadeIn">
              <FileDropzone
                onAnalyzeFile={onFileSelected}
                isProcessing={isProcessing}
                externalError={externalError}
                onClearError={onClearError}
              />
            </div>
          ) : (
            <form onSubmit={handlePastedSubmit} className="space-y-4 animate-fadeIn">
              {pasteError && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs animate-fadeIn">
                  {pasteError}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-[#F8FAFC] mb-2">
                  Paste Rental Agreement Text
                </label>
                <textarea
                  rows={9}
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder="Paste clauses or full contract text here (e.g. 1. Security Deposit: Tenant pays $2,000 upon move-in...)"
                  className="w-full bg-[#142039] border border-[rgba(130,150,190,0.25)] rounded-xl p-4 text-sm text-[#F8FAFC] placeholder-[#8FA0B8] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono transition-colors"
                  disabled={isProcessing}
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-[#8FA0B8]">
                  Supports standard tenancy agreements
                </span>
                <button
                  type="submit"
                  disabled={isProcessing || !pastedText.trim()}
                  className="inline-flex items-center px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all shadow-md shadow-indigo-600/20 hover:-translate-y-0.5 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isProcessing ? 'Analyzing...' : 'Analyze Pasted Text'}
                </button>
              </div>
            </form>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 mt-6 border-t border-[rgba(130,150,190,0.15)] text-[#B8C4D6] text-sm">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-medium text-[#E2E8F0]">Secure document processing</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-medium text-[#E2E8F0]">Clause-by-clause analysis</span>
            </div>
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-teal-400 shrink-0" />
              <span className="font-medium text-[#E2E8F0]">Simple explanations</span>
            </div>
          </div>

          {/* Sample Lease Selector Row */}
          <div className="mt-8 pt-6 border-t border-[rgba(130,150,190,0.15)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8FA0B8] uppercase tracking-wider">
                <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
                <span>Or select a sample lease:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {sampleAgreements.map((sample) => (
                  <button
                    key={sample.id}
                    type="button"
                    disabled={isProcessing}
                    onClick={() => onSampleSelected(sample)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#142039] hover:bg-[#202F49] border border-[rgba(130,150,190,0.22)] text-xs font-medium text-[#E2E8F0] hover:text-white transition-all duration-150 flex items-center gap-1.5 shadow-sm hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    <span className={`w-2 h-2 rounded-full ${sample.badgeColor === 'amber' ? 'bg-amber-400' : (sample.badgeColor === 'indigo' ? 'bg-indigo-400' : 'bg-emerald-400')}`} />
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}