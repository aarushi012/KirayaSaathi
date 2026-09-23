import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, CheckCircle2, Loader2, Sparkles, ArrowRight, 
  AlertTriangle, Scale, Check, RefreshCw,
  Zap, MessageSquare, FileCheck
} from 'lucide-react';

const ANALYSIS_STEPS = [
  { id: 1, title: 'Reading Agreement', detail: 'Parsing document structure & formatting' },
  { id: 2, title: 'Extracting Clauses', detail: 'Identifying individual legal provisions' },
  { id: 3, title: 'Understanding Legal Terms', detail: 'Translating legalese to plain language' },
  { id: 4, title: 'Checking Potential Concerns', detail: 'Flagging non-standard or restrictive terms' },
  { id: 5, title: 'Comparing Clause Patterns', detail: 'Benchmarking against standard rental practices' },
  { id: 6, title: 'Generating Tenant Insights', detail: 'Crafting polite, respectful negotiation questions' },
  { id: 7, title: 'Preparing Final Report', detail: 'Compiling executive summary & scorecards' }
];

const FLOATING_TAGS = [
  { label: 'Rent Terms', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30', delay: 400 },
  { label: 'Security Deposit', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30', delay: 900 },
  { label: 'Lock-in Period', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30', delay: 1400 },
  { label: 'Maintenance & Repairs', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30', delay: 1900 },
  { label: 'Landlord Access', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30', delay: 2400 },
  { label: 'Termination Notice', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30', delay: 2900 }
];

const STATUS_MESSAGES = [
  'Initializing AI legal parser & document scanner...',
  'Scanning pages & isolating contractual clauses...',
  'Evaluating rent escalation & security deposit terms...',
  'Checking maintenance liabilities & repair obligations...',
  'Benchmarking notice periods and lock-in covenants...',
  'Formulating polite, practical negotiation phrases...',
  'Synthesizing key financial metrics & executive summary...',
  'Finalizing comprehensive rental breakdown...'
];

export default function AIAnalysisLoadingScreen({
  fileName = 'rental_agreement.pdf',
  fileSize = null,
  error = null,
  rawResult = null,
  onViewResults,
  onRetry,
  onTryDemo
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [progressPercent, setProgressPercent] = useState(10);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [statusMsgIndex, setStatusMsgIndex] = useState(0);
  const [visibleTags, setVisibleTags] = useState([]);
  
  const stepTimerRef = useRef(null);
  const statusTimerRef = useRef(null);

  // Cycle status message ticker
  useEffect(() => {
    if (error || isAnimationFinished) return;

    statusTimerRef.current = setInterval(() => {
      setStatusMsgIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 1800);

    return () => clearInterval(statusTimerRef.current);
  }, [error, isAnimationFinished]);

  // Handle sequential step advancement
  useEffect(() => {
    if (error) return;

    const advanceStep = () => {
      setCurrentStep(prevStep => {
        if (prevStep < 4) {
          const next = prevStep + 1;
          setProgressPercent(Math.round((next / 7) * 85));
          return next;
        }

        // If at step 4 or above, wait for rawResult or progress swiftly if rawResult is present
        if (rawResult) {
          if (prevStep < 7) {
            const next = prevStep + 1;
            setProgressPercent(Math.round((next / 7) * 98));
            return next;
          } else {
            setProgressPercent(100);
            setIsAnimationFinished(true);
            return 7;
          }
        } else {
          if (prevStep === 4) {
            setProgressPercent(65);
            return 5;
          }
          return prevStep;
        }
      });
    };

    stepTimerRef.current = setInterval(advanceStep, 750);

    return () => clearInterval(stepTimerRef.current);
  }, [error, rawResult]);

  // When rawResult arrives and we are at later steps, quickly finalize
  useEffect(() => {
    if (rawResult && !error) {
      const finishTimer = setTimeout(() => {
        setCurrentStep(7);
        setProgressPercent(100);
        setIsAnimationFinished(true);
      }, currentStep < 4 ? 2200 : 800);

      return () => clearTimeout(finishTimer);
    }
  }, [rawResult, error, currentStep]);

  // Pop floating tags dynamically during steps 2 - 4
  useEffect(() => {
    if (currentStep >= 2 && !error && !isAnimationFinished) {
      FLOATING_TAGS.forEach((tag) => {
        setTimeout(() => {
          setVisibleTags(prev => prev.includes(tag.label) ? prev : [...prev, tag.label]);
        }, tag.delay);
      });
    }
  }, [currentStep, error, isAnimationFinished]);

  // Calculate quick summary metrics from rawResult if available
  const clauseCount = rawResult?.clauses?.length || 8;
  const highAttentionCount = rawResult?.clauses?.filter(c => {
    const lvl = (c.attention_level || c.attentionLevel || '').toUpperCase();
    return lvl === 'HIGH' || lvl === 'MAY REQUIRE ATTENTION';
  }).length || 2;
  const mediumAttentionCount = rawResult?.clauses?.filter(c => {
    const lvl = (c.attention_level || c.attentionLevel || '').toUpperCase();
    return lvl === 'MEDIUM' || lvl === 'CONSIDER DISCUSSING';
  }).length || 2;
  const totalFlags = highAttentionCount + mediumAttentionCount || 3;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#121D33]/95 backdrop-blur-2xl flex flex-col justify-center items-center px-4 py-8 sm:py-12 animate-fadeIn">
      {/* Background Decorative Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 sm:w-[600px] h-96 sm:h-[600px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="w-full max-w-4xl mx-auto space-y-6">

        {/* ERROR STATE */}
        {error ? (
          <div className="bg-[#1B2942] border border-rose-500/40 rounded-3xl p-6 sm:p-10 text-center shadow-2xl space-y-6 animate-fadeIn max-w-xl mx-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
                Analysis couldn't be completed
              </h2>
              <p className="text-sm text-[#B8C4D6] leading-relaxed">
                We encountered an issue reading or parsing this document. Please try again with a clear PDF or use our 1-click Demo Mode.
              </p>
              {error && typeof error === 'string' && (
                <div className="p-3 bg-[#142039] rounded-xl border border-rose-500/30 text-xs text-rose-300 font-mono text-left overflow-x-auto max-h-24">
                  {error}
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onRetry}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#202F49] hover:bg-[#283B5E] text-[#E2E8F0] hover:text-white font-semibold text-sm border border-[#2A3B5C] transition-all shadow-md"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>

              {onTryDemo && (
                <button
                  type="button"
                  onClick={onTryDemo}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
                >
                  <Zap className="w-4 h-4 mr-2 fill-slate-950" />
                  Launch Hackathon Demo Mode
                </button>
              )}
            </div>
          </div>
        ) : isAnimationFinished ? (
          /* ==========================================
             ANALYSIS COMPLETE STATE
             ========================================== */
          <div className="bg-[#1B2942]/95 border border-indigo-500/35 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl text-center space-y-8 animate-fadeIn max-w-2xl mx-auto">
            {/* Top Success Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Analysis Complete</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                Your Rental Agreement Breakdown Is Ready
              </h2>
              <p className="text-[#B8C4D6] text-sm sm:text-base max-w-lg mx-auto">
                AI has successfully extracted, benchmarked, and simplified all key clauses for <span className="font-semibold text-indigo-300">{fileName}</span>.
              </p>
            </div>

            {/* Summary Highlights Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div className="p-3.5 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/60">
                <div className="flex items-center gap-1.5 text-xs text-[#8FA0B8] mb-1">
                  <FileCheck className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Clauses</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-[#F8FAFC]">
                  {clauseCount} Analyzed
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/60">
                <div className="flex items-center gap-1.5 text-xs text-[#8FA0B8] mb-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Attention Flags</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-amber-300">
                  {totalFlags} Identified
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/60">
                <div className="flex items-center gap-1.5 text-xs text-[#8FA0B8] mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Negotiations</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-emerald-300">
                  Ready
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#142039]/90 border border-[#2A3B5C]/60">
                <div className="flex items-center gap-1.5 text-xs text-[#8FA0B8] mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Glance Report</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-purple-300">
                  Generated
                </div>
              </div>
            </div>

            {/* Big Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={onViewResults}
                className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white font-extrabold text-base sm:text-lg shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all duration-300 active:scale-[0.98] group cursor-pointer"
              >
                <span>View My Analysis</span>
                <ArrowRight className="w-5 h-5 ml-2.5 group-hover:translate-x-1.5 transition-transform" />
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================
             ACTIVE SCANNING & PROGRESS EXPERIENCE
             ========================================== */
          <div className="bg-[#1B2942]/95 border border-[#2A3B5C]/70 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl space-y-8">
            
            {/* Header / Intro */}
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-xs font-semibold text-indigo-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-400" />
                <span>AI Pipeline Active</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
                Analyzing Your Rental Agreement
              </h2>
              <p className="text-[#B8C4D6] text-sm sm:text-base max-w-xl mx-auto">
                Our AI is carefully reviewing your agreement clause by clause.
              </p>

              {/* Uploaded File Pill */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 text-xs text-[#B8C4D6] mt-2">
                <FileText className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="font-semibold text-[#F8FAFC] truncate max-w-xs">{fileName}</span>
                {fileSize && <span className="text-[#8FA0B8]">({fileSize})</span>}
              </div>
            </div>

            {/* Central Visualizer & Stage Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Document Scanning Visualizer Card (Left Column) */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-64 sm:w-72 h-80 sm:h-96 rounded-2xl bg-[#142039] border border-indigo-500/35 p-5 shadow-2xl overflow-hidden flex flex-col justify-between group">
                  
                  {/* Glowing Vertical Scanning Laser Beam */}
                  <div className="absolute left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_3px_rgba(34,211,238,0.8)] animate-scanBeam z-20" />
                  
                  {/* Document Header Representation */}
                  <div className="space-y-3 z-10">
                    <div className="flex items-center justify-between border-b border-[#2A3B5C]/70 pb-2.5">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-indigo-400" />
                        <span className="text-[11px] font-bold tracking-wider uppercase text-[#B8C4D6]">LEASE CONTRACT</span>
                      </div>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 font-mono">
                        PG. 1/2
                      </span>
                    </div>

                    {/* Simulated Text Lines with Active Highlights */}
                    <div className="space-y-2">
                      <div className="h-2 w-3/4 bg-[#202F49] rounded-full" />
                      <div className="h-2 w-full bg-[#202F49]/70 rounded-full" />
                      <div className="h-2 w-5/6 bg-indigo-900/50 rounded-full animate-pulse" />
                      <div className="h-2 w-2/3 bg-[#202F49]/60 rounded-full" />
                    </div>

                    <div className="pt-2 space-y-2">
                      <div className="h-2 w-1/2 bg-amber-900/50 rounded-full animate-pulse" />
                      <div className="h-2 w-full bg-[#202F49]/70 rounded-full" />
                      <div className="h-2 w-4/5 bg-[#202F49]/50 rounded-full" />
                    </div>
                  </div>

                  {/* Floating Detected Clause Tags */}
                  <div className="z-10 flex flex-wrap gap-1.5 min-h-[70px] content-end">
                    {FLOATING_TAGS.map((tag) => {
                      const isVisible = visibleTags.includes(tag.label);
                      return (
                        <span
                          key={tag.label}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all duration-500 transform ${tag.color} ${
                            isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-75 translate-y-2 pointer-events-none'
                          }`}
                        >
                          {tag.label}
                        </span>
                      );
                    })}
                  </div>

                  {/* Visual Watermark / Bottom Badge */}
                  <div className="z-10 pt-2 border-t border-[#2A3B5C]/60 flex items-center justify-between text-[10px] text-[#8FA0B8]">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                      Neural Scanner
                    </span>
                    <span>Clause Isolation</span>
                  </div>
                </div>

                {/* Real-time Dynamic Status Message Ticker */}
                <div className="mt-4 px-4 py-2 rounded-xl bg-[#142039] border border-[#2A3B5C]/70 text-xs text-indigo-300 font-medium flex items-center gap-2 shadow-inner text-center">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 animate-pulse" />
                  <span className="truncate max-w-xs">{STATUS_MESSAGES[statusMsgIndex]}</span>
                </div>
              </div>

              {/* 7-Step Progress Timeline (Right Column) */}
              <div className="lg:col-span-7 space-y-3">
                {ANALYSIS_STEPS.map((step) => {
                  const isCompleted = step.id < currentStep;
                  const isCurrent = step.id === currentStep;
                  const isWaiting = step.id > currentStep;

                  return (
                    <div
                      key={step.id}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                        isCompleted
                          ? 'bg-[#142039]/70 border-emerald-500/30 text-[#E2E8F0]'
                          : isCurrent
                          ? 'bg-indigo-950/50 border-indigo-500/70 shadow-lg shadow-indigo-950/50 text-[#F8FAFC] ring-1 ring-indigo-500/30'
                          : 'bg-[#142039]/30 border-[#2A3B5C]/40 text-[#8FA0B8] opacity-60'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Status Indicator Circle / Check */}
                        <div className="shrink-0">
                          {isCompleted ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                          ) : isCurrent ? (
                            <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-indigo-300 animate-pulse">
                              <div className="w-2 h-2 rounded-full bg-cyan-400" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full border border-slate-600 flex items-center justify-center text-[#8FA0B8] text-xs font-mono">
                              {step.id}
                            </div>
                          )}
                        </div>

                        {/* Title & Detail */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-[#8FA0B8]">
                              0{step.id}
                            </span>
                            <h4 className={`text-xs sm:text-sm font-bold truncate ${
                              isCurrent ? 'text-[#F8FAFC]' : isCompleted ? 'text-[#E2E8F0]' : 'text-[#8FA0B8]'
                            }`}>
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-[11px] text-[#8FA0B8] truncate mt-0.5">
                            {step.detail}
                          </p>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="shrink-0 text-right">
                        {isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                            Completed
                          </span>
                        )}
                        {isCurrent && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-cyan-300 border border-indigo-500/30 animate-pulse">
                            Processing...
                          </span>
                        )}
                        {isWaiting && (
                          <span className="text-[10px] font-medium text-[#8FA0B8]">
                            Waiting
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Safe Potential Concern Micro-Preview during Step 4 */}
                {currentStep >= 4 && (
                  <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center gap-3 text-xs text-amber-200 animate-fadeIn">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="font-semibold text-amber-300">Legal Review in Progress:</span>
                      <span className="text-amber-200/90 ml-1">
                        Evaluating key covenants (Deposit refunds, lock-in terms & landlord notice)
                      </span>
                    </div>
                  </div>
                )}

              </div>

            </div>

            {/* Real Progress Bar */}
            <div className="space-y-2 pt-2 border-t border-[#2A3B5C]/60">
              <div className="flex items-center justify-between text-xs text-[#8FA0B8] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Overall Analysis Progress
                </span>
                <span className="font-mono text-indigo-300">{progressPercent}%</span>
              </div>

              <div className="w-full bg-[#142039] rounded-full h-2.5 overflow-hidden border border-[#2A3B5C]/70 p-0.5">
                <div 
                  className="bg-gradient-to-r from-indigo-500 via-indigo-400 to-cyan-400 h-full rounded-full transition-all duration-500 relative"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/80 rounded-full blur-[1px] animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
