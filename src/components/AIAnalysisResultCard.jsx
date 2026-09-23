import React, { useState, useEffect, useRef } from 'react';
import { FileText, Lock, Sparkles, HelpCircle, Check, Loader2 } from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

export default function AIAnalysisResultCard({
  fileName = "Residential_Lease_Agreement.pdf",
  clauseInfo = "Clause 3 of 12 • Instant AI breakdown",
  attentionBadge = "⚠ May Require Attention",
  originalClause = "Landlord reserves right to enter premises at any hour without notice for inspection...",
  translationHeading = "Plain English Translation",
  translationCategory = "Tenant Protection",
  translationText = "The landlord states they can enter your home at any time without advance warning for inspections.",
  askSuggestion = 'Ask: "Could we require at least 24 hours written notice before non-emergency visits?"',
  totalClauses = 12,
  safeClauses = 9,
  flaggedClauses = 3,
  triggerKey = 0,
  isVisible = true
}) {
  // Animation stage states
  const [stage, setStage] = useState(0);
  // Number counters
  const [countTotal, setCountTotal] = useState(0);
  const [countSafe, setCountSafe] = useState(0);
  const [countFlagged, setCountFlagged] = useState(0);
  const [scanActive, setScanActive] = useState(false);

  const timersRef = useRef([]);
  const animFrameRef = useRef(null);

  const clearAllTimers = () => {
    timersRef.current.forEach(t => clearTimeout(t));
    timersRef.current = [];
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  useEffect(() => {
    clearAllTimers();

    if (!isVisible) {
      setStage(0);
      setCountTotal(0);
      setCountSafe(0);
      setCountFlagged(0);
      setScanActive(false);
      return;
    }

    // Check for reduced motion preference
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setStage(10);
      setCountTotal(totalClauses);
      setCountSafe(safeClauses);
      setCountFlagged(flaggedClauses);
      setScanActive(false);
      return;
    }

    // Reset initial state
    setStage(0);
    setCountTotal(0);
    setCountSafe(0);
    setCountFlagged(0);
    setScanActive(true);

    // Sequence timing
    // 0ms: Card entry begins
    const t0 = setTimeout(() => {
      setStage(1); // Card in view
    }, 40);

    // 250ms: Header / File info appears
    const t1 = setTimeout(() => {
      setStage(2); // Header shown
    }, 280);

    // 450ms: Attention badge appears
    const t2 = setTimeout(() => {
      setStage(3); // Badge shown
    }, 480);

    // 700ms: Original Agreement Clause box appears
    const t3 = setTimeout(() => {
      setStage(4); // Original clause shown
    }, 720);

    // 1050ms: Plain English Translation appears
    const t4 = setTimeout(() => {
      setStage(5); // Translation heading
    }, 1050);

    // 1300ms: Explanation text appears
    const t5 = setTimeout(() => {
      setStage(6); // Translation body
    }, 1300);

    // 1550ms: Ask / Negotiation suggestion appears with highlight
    const t6 = setTimeout(() => {
      setStage(7); // Suggestion shown
    }, 1550);

    // 1850ms: Bottom statistics appear & number counters start
    const t7 = setTimeout(() => {
      setStage(8); // Stats cards shown
      
      // Animate number counters over ~600ms
      const startTime = performance.now();
      const duration = 650;

      const animateCounters = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easeOutQuad easing
        const easeOut = 1 - (1 - progress) * (1 - progress);

        setCountTotal(Math.round(easeOut * totalClauses));
        setCountSafe(Math.round(easeOut * safeClauses));
        setCountFlagged(Math.round(easeOut * flaggedClauses));

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateCounters);
        } else {
          setCountTotal(totalClauses);
          setCountSafe(safeClauses);
          setCountFlagged(flaggedClauses);
          setStage(9); // Complete state
        }
      };

      animFrameRef.current = requestAnimationFrame(animateCounters);
    }, 1850);

    // 950ms: Scan light completes
    const tScan = setTimeout(() => {
      setScanActive(false);
    }, 950);

    timersRef.current = [t0, t1, t2, t3, t4, t5, t6, t7, tScan];

    return () => {
      clearAllTimers();
    };
  }, [triggerKey, isVisible, totalClauses, safeClauses, flaggedClauses]);

  return (
    <div className="relative mx-auto max-w-md lg:max-w-none [perspective:1200px]">
      {/* Subtle background glow */}
      <div 
        className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-2xl blur opacity-25 transition-opacity duration-700 pointer-events-none"
        style={{ opacity: stage >= 1 ? 0.25 : 0 }}
      />

      {/* Main Result Card Container */}
      <div 
        onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 4.5, 6)}
        onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
        className="relative rounded-2xl bg-[#1B2942]/95 border border-[rgba(130,150,190,0.25)] shadow-2xl p-5 sm:p-6 overflow-hidden space-y-4 transition-all duration-300 ease-out will-change-transform"
        style={{
          opacity: stage >= 1 ? 1 : 0,
          transform: stage >= 1 ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.98)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* 3D Specular Glare Reflection Overlay */}
        <div className="card-glare-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-20" />
        {/* Subtle AI Horizontal Scanning Highlight (Once on entrance) */}
        {scanActive && (
          <div 
            className="absolute inset-0 pointer-events-none z-30 overflow-hidden"
            aria-hidden="true"
          >
            <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-indigo-400/15 to-cyan-400/20 blur-md animate-resultCardScan" />
          </div>
        )}

        {/* 1. Header: Filename, Clause Info & Attention Badge */}
        <div className="flex items-center justify-between pb-3 border-b border-[rgba(130,150,190,0.15)]">
          
          <div className="flex items-center gap-2">
            <div 
              className="p-1.5 bg-indigo-500/15 rounded-lg border border-indigo-500/25 transition-all duration-300"
              style={{
                opacity: stage >= 2 ? 1 : 0,
                transform: stage >= 2 ? 'translateY(0)' : 'translateY(8px)'
              }}
            >
              <FileText className="w-4 h-4 text-indigo-400" />
            </div>
            
            <div>
              <div 
                className="text-xs font-semibold text-[#F8FAFC] transition-all duration-300"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? 'translateY(0)' : 'translateY(6px)'
                }}
              >
                {fileName}
              </div>
              
              <div 
                className="text-[10px] text-[#8FA0B8] transition-all duration-300 delay-75"
                style={{
                  opacity: stage >= 2 ? 1 : 0,
                  transform: stage >= 2 ? 'translateY(0)' : 'translateY(4px)'
                }}
              >
                {clauseInfo}
              </div>
            </div>
          </div>

          {/* Attention Badge */}
          <span 
            className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-500/15 text-amber-300 border border-amber-500/35 transition-all duration-300"
            style={{
              opacity: stage >= 3 ? 1 : 0,
              transform: stage >= 3 ? 'scale(1)' : 'scale(0.95)',
              boxShadow: stage === 3 ? '0 0 10px 1px rgba(245, 158, 11, 0.25)' : 'none'
            }}
          >
            {attentionBadge}
          </span>
        </div>

        {/* 2. Original Agreement Clause Card */}
        <div 
          className="p-3 bg-[#142039]/80 rounded-xl border border-[rgba(130,150,190,0.18)] space-y-1 transition-all duration-400 hover:-translate-y-0.5 hover:border-[rgba(130,150,190,0.3)] cursor-default"
          style={{
            opacity: stage >= 4 ? 1 : 0,
            transform: stage >= 4 ? 'translateY(0)' : 'translateY(10px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div className="text-[11px] font-mono font-medium text-[#8FA0B8] flex items-center gap-1">
            <Lock className="w-3 h-3 text-[#8FA0B8]" /> Original Agreement Clause
          </div>
          <p 
            className="text-xs text-[#B8C4D6] font-serif italic line-clamp-2 transition-opacity duration-300"
            style={{ opacity: stage >= 4 ? 1 : 0 }}
          >
            "{originalClause}"
          </p>
        </div>

        {/* 3. Plain English Translation Card */}
        <div 
          className="p-3.5 bg-indigo-950/40 rounded-xl border border-indigo-500/30 space-y-2 transition-all duration-400 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-indigo-950/40 hover:border-indigo-400/50 cursor-default"
          style={{
            opacity: stage >= 5 ? 1 : 0,
            transform: stage >= 5 ? 'translateY(0)' : 'translateY(12px)',
            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          {/* Header */}
          <div 
            className="flex items-center justify-between text-xs font-semibold text-indigo-300 transition-opacity duration-300"
            style={{ opacity: stage >= 5 ? 1 : 0 }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> {translationHeading}
            </span>
            <span className="text-[10px] text-indigo-300/80 font-normal">{translationCategory}</span>
          </div>

          {/* Explanation */}
          <p 
            className="text-xs text-[#E2E8F0] leading-relaxed transition-all duration-300"
            style={{
              opacity: stage >= 6 ? 1 : 0,
              transform: stage >= 6 ? 'translateY(0)' : 'translateY(4px)'
            }}
          >
            {translationText}
          </p>
          
          {/* Ask / Negotiation Suggestion */}
          <div 
            className="pt-1 border-t border-indigo-500/20 flex items-start gap-2 rounded-lg transition-all duration-350"
            style={{
              opacity: stage >= 7 ? 1 : 0,
              transform: stage >= 7 ? 'translateY(0)' : 'translateY(4px)',
              backgroundColor: stage === 7 ? 'rgba(6, 182, 212, 0.12)' : 'transparent',
              padding: stage === 7 ? '4px 6px' : '0px'
            }}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-cyan-200 font-medium leading-normal">
              {askSuggestion}
            </p>
          </div>
        </div>

        {/* 4. Bottom Statistics Cards */}
        <div className="grid grid-cols-3 gap-2 pt-1 text-center">
          
          {/* Total Clauses */}
          <div 
            className="bg-[#142039]/80 rounded-lg p-2 border border-[rgba(130,150,190,0.18)] transition-all duration-300"
            style={{
              opacity: stage >= 8 ? 1 : 0,
              transform: stage >= 8 ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(6px)'
            }}
          >
            <div className="text-[10px] text-[#8FA0B8]">Total Clauses</div>
            <div className="text-sm font-bold text-[#F8FAFC] font-mono">
              {stage >= 8 ? countTotal : 0}
            </div>
          </div>

          {/* Standard Safe */}
          <div 
            className="bg-[#142039]/80 rounded-lg p-2 border border-[rgba(130,150,190,0.18)] transition-all duration-300 delay-75"
            style={{
              opacity: stage >= 8 ? 1 : 0,
              transform: stage >= 8 ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(6px)'
            }}
          >
            <div className="text-[10px] text-[#8FA0B8]">Standard</div>
            <div className="text-sm font-bold text-teal-400 font-mono">
              {stage >= 8 ? countSafe : 0} Safe
            </div>
          </div>

          {/* Flagged Discuss */}
          <div 
            className="bg-[#142039]/80 rounded-lg p-2 border border-[rgba(130,150,190,0.18)] transition-all duration-300 delay-150"
            style={{
              opacity: stage >= 8 ? 1 : 0,
              transform: stage >= 8 ? 'scale(1) translateY(0)' : 'scale(0.97) translateY(6px)'
            }}
          >
            <div className="text-[10px] text-[#8FA0B8]">Flagged</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              {stage >= 8 ? countFlagged : 0} Discuss
            </div>
          </div>

        </div>

        {/* AI Processing Status Mini Indicator */}
        <div className="flex items-center justify-between text-[10px] text-[#8FA0B8] pt-1 border-t border-[rgba(130,150,190,0.15)]">
          <div className="flex items-center gap-1.5">
            {stage < 9 ? (
              <>
                <Loader2 className="w-3 h-3 text-indigo-400 animate-spin" />
                <span className="text-indigo-300">AI analyzing clause...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3 text-teal-400" />
                <span className="text-teal-300 font-medium">Analysis complete</span>
              </>
            )}
          </div>
          <span className="text-[#8FA0B8] font-mono">AI Legal-Tech Engine</span>
        </div>

      </div>
    </div>
  );
}
