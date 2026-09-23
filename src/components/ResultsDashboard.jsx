import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Search, 
  ChevronDown, ChevronUp, ArrowLeft, CheckSquare, 
  Bot, Zap, FileText, Sparkles, MessageSquare, 
  Tag, Layers, RefreshCw, X, Filter, Info,
  Copy, Check, MessagesSquare, MapPin, Scale
} from 'lucide-react';
import AgreementGlance from './AgreementGlance';
import { getJurisdictionById, SUPPORTED_STATES } from '../data/jurisdictions';

function AnimatedClauseCard({ children }) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -4% 0px' }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={cardRef}
      className={`transition-all duration-500 ease-out will-change-transform ${
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
      }`}
    >
      {children}
    </div>
  );
}

export default function ResultsDashboard({ 
  analysisData, 
  onBackToUpload, 
  onOpenNegotiationModal, 
  onOpenKeyModal,
  selectedStateId = 'delhi',
  onSelectState
}) {
  const [filterLevel, setFilterLevel] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeJurisdictionId, setActiveJurisdictionId] = useState(() => 
    analysisData.selectedJurisdiction?.id || selectedStateId || 'delhi'
  );
  
  const currentJurisdiction = getJurisdictionById(activeJurisdictionId);

  const handleSwitchJurisdiction = (newId) => {
    setActiveJurisdictionId(newId);
    if (onSelectState) {
      onSelectState(newId);
    }
  };

  const [expandedClauses, setExpandedClauses] = useState({});
  const [copiedMap, setCopiedMap] = useState({});

  const toggleExpand = (id) => {
    setExpandedClauses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const expandAll = () => {
    const allExpanded = {};
    analysisData.clauses.forEach(c => {
      allExpanded[c.id] = true;
    });
    setExpandedClauses(allExpanded);
  };

  const collapseAll = () => {
    setExpandedClauses({});
  };

  const handleCopySuggestion = (id, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedMap(prev => ({ ...prev, [id]: true }));
    setTimeout(() => {
      setCopiedMap(prev => ({ ...prev, [id]: false }));
    }, 2000);
  };

  const availableCategories = useMemo(() => {
    const cats = new Set(analysisData.clauses.map(c => c.category || 'Other'));
    return ['ALL', ...Array.from(cats)];
  }, [analysisData.clauses]);

  const filteredClauses = useMemo(() => {
    return analysisData.clauses.filter(clause => {
      const lvl = (clause.attention_level || clause.attentionLevel || '').toUpperCase();
      if (filterLevel === 'HIGH' && lvl !== 'HIGH' && lvl !== 'MAY REQUIRE ATTENTION') return false;
      if (filterLevel === 'MEDIUM' && lvl !== 'MEDIUM' && lvl !== 'CONSIDER DISCUSSING') return false;
      if (filterLevel === 'LOW' && lvl !== 'LOW' && lvl !== 'STANDARD') return false;

      if (selectedCategory !== 'ALL' && clause.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (clause.clause_title || clause.title || '').toLowerCase().includes(q);
        const matchOriginal = (clause.original_text || clause.originalText || '').toLowerCase().includes(q);
        const matchSimplified = (clause.simple_explanation || clause.simplifiedText || '').toLowerCase().includes(q);
        const matchCategory = (clause.category || '').toLowerCase().includes(q);
        const matchReason = (clause.reason || '').toLowerCase().includes(q);
        const matchSuggest = (clause.negotiation_suggestion || clause.negotiationTip || '').toLowerCase().includes(q);

        return matchTitle || matchOriginal || matchSimplified || matchCategory || matchReason || matchSuggest;
      }

      return true;
    });
  }, [analysisData.clauses, filterLevel, selectedCategory, searchQuery]);

  const flaggedNegotiationClauses = useMemo(() => {
    return analysisData.clauses.filter(c => {
      const lvl = (c.attention_level || c.attentionLevel || '').toUpperCase();
      return lvl === 'HIGH' || lvl === 'MEDIUM' || lvl === 'MAY REQUIRE ATTENTION' || lvl === 'CONSIDER DISCUSSING';
    });
  }, [analysisData.clauses]);

  const getBadgeDetails = (level) => {
    const lvl = (level || '').toUpperCase();
    if (lvl === 'HIGH' || lvl === 'MAY REQUIRE ATTENTION') {
      return {
        label: 'HIGH ATTENTION',
        style: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
        icon: <ShieldAlert className="w-4 h-4 text-rose-400" />
      };
    }
    if (lvl === 'MEDIUM' || lvl === 'CONSIDER DISCUSSING') {
      return {
        label: 'MEDIUM ATTENTION',
        style: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
        icon: <AlertTriangle className="w-4 h-4 text-amber-400" />
      };
    }
    return {
      label: 'LOW ATTENTION',
      style: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    };
  };

  const totalCount = analysisData.total_clauses_analyzed || analysisData.totalClauses || analysisData.clauses.length;
  const lowCount = analysisData.low_attention ?? analysisData.standardCount ?? 0;
  const mediumCount = analysisData.medium_attention ?? analysisData.moderateCount ?? 0;
  const highCount = analysisData.high_attention ?? analysisData.highAttentionCount ?? 0;

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToUpload}
          className="inline-flex items-center text-sm font-semibold text-slate-400 hover:text-white transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Analyze Another Agreement
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Jurisdiction Pill with Quick Switcher */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#1B2942] text-indigo-300 border border-[#2A3B5C]/70 shadow-sm">
            <span role="img" aria-label={currentJurisdiction.name}>{currentJurisdiction.iconEmoji}</span>
            <span>State: <strong className="text-[#F8FAFC]">{currentJurisdiction.name}</strong></span>
          </div>

          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            analysisData.isLiveAI 
              ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
          }`}>
            {analysisData.isLiveAI ? <Bot className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span>{analysisData.aiProvider || (analysisData.isLiveAI ? 'Live Gemini AI' : 'Demo Engine')}</span>
          </span>

          <button
            onClick={onOpenNegotiationModal}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <CheckSquare className="w-4 h-4 mr-2 text-indigo-400" />
            View Negotiation Checklist ({highCount + mediumCount})
          </button>
        </div>
      </div>

      {/* Prominent Demo Mode Active Banner */}
      {!analysisData.isLiveAI && (
        <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/35 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0 mt-0.5 sm:mt-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">⚡ Demo Mode Active</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-[#142039] text-[#E2E8F0] border border-[rgba(130,150,190,0.25)] font-semibold">
                  Pre-analyzed Sample
                </span>
              </div>
              <p className="text-xs text-[#B8C4D6] mt-0.5">
                {analysisData.isDemoMode 
                  ? 'Viewing pre-analyzed sample results for the bundled 8-clause rental lease. Real Gemini AI analysis is available by connecting an API key.'
                  : 'Using rule-based demo engine. Configure a Gemini API key anytime for live multi-modal AI processing.'}
              </p>
            </div>
          </div>
          {onOpenKeyModal && (
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="shrink-0 px-3.5 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-semibold transition-all"
            >
              Configure Gemini API Key
            </button>
          )}
        </div>
      )}

      {/* TOP SECTION: Title & 4 Summary Cards */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
              AI Clause Review
            </span>
            <span className="text-xs text-[#8FA0B8]">• {analysisData.title || 'Residential Rental Agreement'}</span>
            {analysisData.isDemoMode && (
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Demo Lease
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Agreement Analysis
          </h1>
          <p className="mt-2 text-sm sm:text-base text-[#B8C4D6] max-w-3xl leading-relaxed">
            {analysisData.summary || 'Comprehensive breakdown of all clauses identified in the agreement, categorized by attention level.'}
          </p>
        </div>

        {/* 4 Summary Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-[#1B2942]/90 rounded-2xl p-5 border border-[rgba(130,150,190,0.22)] shadow-lg relative overflow-hidden group hover:border-[rgba(130,150,190,0.35)] transition-all">
            <div className="flex items-center justify-between text-[#8FA0B8] mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Clauses</span>
              <Layers className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#F8FAFC]">{totalCount}</div>
            <div className="text-[11px] text-[#8FA0B8] mt-1">Extracted from document</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
          </div>

          <div className="bg-[#1B2942]/90 rounded-2xl p-5 border border-[rgba(130,150,190,0.22)] shadow-lg relative overflow-hidden group hover:border-teal-500/40 transition-all">
            <div className="flex items-center justify-between text-teal-400/90 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Low Attention</span>
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-teal-400">{lowCount}</div>
            <div className="text-[11px] text-[#8FA0B8] mt-1">Standard & balanced terms</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-teal-400" />
          </div>

          <div className="bg-[#1B2942]/90 rounded-2xl p-5 border border-[rgba(130,150,190,0.22)] shadow-lg relative overflow-hidden group hover:border-amber-500/40 transition-all">
            <div className="flex items-center justify-between text-amber-400/90 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Medium Attention</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-400">{mediumCount}</div>
            <div className="text-[11px] text-[#8FA0B8] mt-1">Consider clarifying with landlord</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />
          </div>

          <div className="bg-[#1B2942]/90 rounded-2xl p-5 border border-[rgba(130,150,190,0.22)] shadow-lg relative overflow-hidden group hover:border-rose-500/40 transition-all">
            <div className="flex items-center justify-between text-rose-400/90 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">High Attention</span>
              <ShieldAlert className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-black text-rose-400">{highCount}</div>
            <div className="text-[11px] text-[#8FA0B8] mt-1">Potential concerns to review</div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-rose-500" />
          </div>

        </div>

        {/* State Tenancy Benchmark & Regional Context Card */}
        <div className="bg-[#1B2942]/90 rounded-2xl p-5 sm:p-6 border border-[rgba(130,150,190,0.22)] shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#2A3B5C]/60">
            <div className="flex items-center gap-3">
              <span className="text-2xl select-none" role="img" aria-label={currentJurisdiction.name}>
                {currentJurisdiction.iconEmoji}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                    {currentJurisdiction.name} Legal Framework & Tenancy Norms
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                    {currentJurisdiction.badge}
                  </span>
                </div>
                <p className="text-xs text-[#8FA0B8] mt-0.5">
                  Governed by: <span className="text-[#B8C4D6] font-medium">{currentJurisdiction.act}</span>
                </p>
              </div>
            </div>

            {/* Quick State Switcher Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              <span className="text-[11px] text-[#8FA0B8] uppercase font-bold tracking-wider mr-1 shrink-0">
                Compare State:
              </span>
              {SUPPORTED_STATES.map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => handleSwitchJurisdiction(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                    activeJurisdictionId.toLowerCase() === st.id.toLowerCase()
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-[#142039] border border-[#2A3B5C]/60 text-[#8FA0B8] hover:text-[#F8FAFC] hover:bg-[#202F49]'
                  }`}
                >
                  <span className="mr-1">{st.iconEmoji}</span>
                  <span>{st.stateName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/50 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8FA0B8] block">Deposit Benchmark</span>
              <span className="text-emerald-300 font-bold text-sm block">{currentJurisdiction.depositNorm}</span>
              <span className="text-[11px] text-[#8FA0B8]">Model Tenancy guideline cap</span>
            </div>

            <div className="p-3 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/50 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8FA0B8] block">Notice Period Standard</span>
              <span className="text-cyan-300 font-bold text-sm block">{currentJurisdiction.noticeNorm}</span>
              <span className="text-[11px] text-[#8FA0B8]">Prior written notice required</span>
            </div>

            <div className="p-3 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/50 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8FA0B8] block">Annual Rent Escalation</span>
              <span className="text-amber-300 font-bold text-sm block">{currentJurisdiction.escalationNorm}</span>
              <span className="text-[11px] text-[#8FA0B8]">Standard annual revision rate</span>
            </div>

            <div className="p-3 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/50 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8FA0B8] block">Agreement Type</span>
              <span className="text-indigo-300 font-bold text-xs block truncate">{currentJurisdiction.agreementType}</span>
              <span className="text-[11px] text-[#8FA0B8]">{currentJurisdiction.policeVerification}</span>
            </div>
          </div>
        </div>
      </div>

      {/* AGREEMENT AT A GLANCE */}
      <AgreementGlance 
        glanceData={analysisData.agreement_at_a_glance} 
        fallbackSummary={analysisData.summary}
      />

      {/* DEDICATED NEGOTIATION ASSISTANT SECTION */}
      {flaggedNegotiationClauses.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-950/40 via-[#1B2942] to-[#142039] rounded-2xl border border-indigo-500/30 p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-xs font-bold">
                <MessagesSquare className="w-3.5 h-3.5 text-cyan-400" /> Negotiation Assistant
              </div>
              <h2 className="text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
                Polite Discussion Scripts for Landlord
              </h2>
              <p className="text-xs sm:text-sm text-[#B8C4D6]">
                Tailored, respectful phrases under 50 words based on your uploaded agreement terms to help you negotiate confidently.
              </p>
            </div>

            <div className="text-xs font-medium text-[#B8C4D6] self-start sm:self-center bg-[#142039]/80 px-3 py-1.5 rounded-lg border border-[rgba(130,150,190,0.2)]">
              {flaggedNegotiationClauses.length} discussion point{flaggedNegotiationClauses.length > 1 ? 's' : ''} available
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {flaggedNegotiationClauses.map((clause) => {
              const badge = getBadgeDetails(clause.attention_level || clause.attentionLevel);
              const suggestionText = clause.negotiation_suggestion || clause.negotiationTip || 'Could we please clarify this clause in writing before signing?';
              const isCopied = Boolean(copiedMap[`neg-assistant-${clause.id}`]);
              const categoryUpper = (clause.category || 'OTHER').toUpperCase();

              return (
                <div 
                  key={`neg-${clause.id}`}
                  className="p-5 rounded-xl bg-[#142039]/90 border border-[rgba(130,150,190,0.22)] hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4 shadow-md"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold text-indigo-400">#{clause.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#1B2942] text-indigo-300 uppercase border border-[rgba(130,150,190,0.2)]">
                          {categoryUpper}
                        </span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${badge.style}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#F8FAFC] line-clamp-1">
                      {clause.clause_title || clause.title}
                    </h4>

                    <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200 font-medium leading-relaxed flex items-start gap-2">
                      <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>"{suggestionText}"</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[rgba(130,150,190,0.15)] flex items-center justify-between">
                    <span className="text-[11px] text-[#8FA0B8] italic">
                      Polite & practical inquiry
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopySuggestion(`neg-assistant-${clause.id}`, suggestionText)}
                      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        isCopied
                          ? 'bg-emerald-600 text-white shadow-md'
                          : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm hover:shadow-indigo-600/30'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 mr-1 text-white" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 mr-1" />
                          <span>Copy Negotiation Suggestion</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FILTER & SEARCH CONTROLS BAR */}
      <div className="bg-[#1B2942]/90 rounded-2xl border border-[rgba(130,150,190,0.22)] p-4 sm:p-5 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#8FA0B8] mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filters:
            </span>
            
            <button
              onClick={() => setFilterLevel('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filterLevel === 'ALL'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-[#142039] border border-[rgba(130,150,190,0.2)] text-[#B8C4D6] hover:text-white'
              }`}
            >
              All ({totalCount})
            </button>

            <button
              onClick={() => setFilterLevel('LOW')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterLevel === 'LOW'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'bg-[#142039] border border-[rgba(130,150,190,0.2)] text-teal-300 hover:bg-[#202F49]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Low ({lowCount})
            </button>

            <button
              onClick={() => setFilterLevel('MEDIUM')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterLevel === 'MEDIUM'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-[#142039] border border-[rgba(130,150,190,0.2)] text-amber-300 hover:bg-[#202F49]'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              Medium ({mediumCount})
            </button>

            <button
              onClick={() => setFilterLevel('HIGH')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterLevel === 'HIGH'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-[#142039] border border-[rgba(130,150,190,0.2)] text-rose-300 hover:bg-[#202F49]'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              High ({highCount})
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#8FA0B8] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clauses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#142039] border border-[rgba(130,150,190,0.25)] rounded-xl pl-9 pr-8 py-2 text-xs text-[#F8FAFC] placeholder-[#8FA0B8] focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8FA0B8] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[rgba(130,150,190,0.15)] text-xs">
          <div className="flex items-center gap-2">
            <Tag className="w-3.5 h-3.5 text-[#8FA0B8]" />
            <span className="text-[#8FA0B8] font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#142039] border border-[rgba(130,150,190,0.25)] rounded-lg px-2.5 py-1 text-xs text-[#E2E8F0] focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              {availableCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'ALL' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={expandAll}
              className="text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Expand All Original Clauses
            </button>
            <span className="text-[#8FA0B8]">•</span>
            <button
              onClick={collapseAll}
              className="text-[#8FA0B8] hover:text-[#E2E8F0] font-medium"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* CLAUSE LIST */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-lg font-bold text-[#F8FAFC] flex items-center gap-2">
            <span>Analyzed Clauses</span>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-[#142039] text-[#B8C4D6] border border-[rgba(130,150,190,0.2)]">
              Showing {filteredClauses.length} of {totalCount}
            </span>
          </h2>
        </div>

        {filteredClauses.length === 0 ? (
          <div className="p-12 text-center bg-[#1B2942]/60 rounded-2xl border border-[rgba(130,150,190,0.2)] text-[#8FA0B8] space-y-3">
            <FileText className="w-10 h-10 mx-auto text-slate-400" />
            <p className="text-base font-medium text-[#E2E8F0]">No clauses match the current filter or search criteria.</p>
            <button
              onClick={() => { setFilterLevel('ALL'); setSelectedCategory('ALL'); setSearchQuery(''); }}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#142039] hover:bg-[#202F49] text-xs font-semibold text-[#E2E8F0] border border-[rgba(130,150,190,0.2)] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredClauses.map((clause) => {
            const badge = getBadgeDetails(clause.attention_level || clause.attentionLevel);
            const isExpanded = Boolean(expandedClauses[clause.id]);
            const originalText = clause.original_text || clause.originalText || '';
            const simpleExplanation = clause.simple_explanation || clause.simplifiedText || '';
            const reason = clause.reason || '';
            const negotiation = clause.negotiation_suggestion || clause.negotiationTip || '';
            const categoryUpper = (clause.category || 'OTHER').toUpperCase();
            const clauseTitle = clause.clause_title || clause.title || `Clause ${clause.id}`;
            const isCardCopied = Boolean(copiedMap[`clause-card-${clause.id}`]);

            return (
              <AnimatedClauseCard key={clause.id}>
                <div className="bg-[#1B2942]/90 rounded-2xl border border-[rgba(130,150,190,0.22)] shadow-xl overflow-hidden transition-all duration-200 hover:border-[rgba(130,150,190,0.35)] space-y-4 p-6 sm:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[rgba(130,150,190,0.15)]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-indigo-400">#{clause.id}</span>
                        <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-[#142039] text-indigo-300 border border-[rgba(130,150,190,0.2)]">
                          {categoryUpper}
                        </span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] tracking-tight">
                        {clauseTitle}
                      </h3>
                    </div>

                    <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 self-start sm:self-center font-bold text-xs ${badge.style}`}>
                      {badge.icon}
                      <span>{badge.label}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Simple explanation:</span>
                    </div>
                    <p className="text-sm text-[#E2E8F0] leading-relaxed pl-0.5">
                      "{simpleExplanation}"
                    </p>
                  </div>

                  {reason && (
                    <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/30 space-y-1">
                      <div className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                        <span>Why it may require attention:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed pl-0.5">
                        "{reason}"
                      </p>
                    </div>
                  )}

                  {negotiation && (
                    <div className="p-4 rounded-xl bg-cyan-950/25 border border-cyan-900/40 space-y-3">
                      <div className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Consider discussing:</span>
                      </div>
                      <p className="text-xs sm:text-sm text-cyan-200 font-medium leading-relaxed pl-0.5">
                        "{negotiation}"
                      </p>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleCopySuggestion(`clause-card-${clause.id}`, negotiation)}
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                            isCardCopied
                              ? 'bg-emerald-600 text-white shadow-md'
                              : 'bg-cyan-900/40 hover:bg-cyan-800/60 text-cyan-200 border border-cyan-700/40'
                          }`}
                        >
                          {isCardCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 mr-1 text-white" />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 mr-1" />
                              <span>Copy Negotiation Suggestion</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[rgba(130,150,190,0.15)]">
                    <button
                      type="button"
                      onClick={() => toggleExpand(clause.id)}
                      className="w-full flex items-center justify-between text-xs font-semibold text-[#8FA0B8] hover:text-[#F8FAFC] py-1.5 px-1 rounded-lg hover:bg-[#142039] transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#8FA0B8]" />
                        <span>{isExpanded ? 'Hide Original Clause' : 'View Original Clause'}</span>
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-[#8FA0B8]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8FA0B8]" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 p-4 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)] text-xs sm:text-sm text-[#B8C4D6] leading-relaxed animate-fadeIn space-y-1">
                        <div className="text-[10px] font-mono font-bold text-[#8FA0B8] uppercase tracking-wider">
                          Original clause:
                        </div>
                        <p className="font-serif italic text-[#E2E8F0]">
                          "{originalText}"
                        </p>
                      </div>
                    )}
                  </div>

                </div>
              </AnimatedClauseCard>
            );
          })
        )}
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="pt-6 pb-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800">
        <button
          onClick={onBackToUpload}
          className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/35 transition-all duration-200 active:scale-[0.98] group"
        >
          <RefreshCw className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
          <span>Analyze Another Agreement</span>
        </button>

        <button
          onClick={onOpenNegotiationModal}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold text-sm border border-slate-700 transition-colors"
        >
          <CheckSquare className="w-4 h-4 mr-2 text-indigo-400" />
          <span>View Negotiation Checklist ({highCount + mediumCount})</span>
        </button>
      </div>

      {/* LEGAL DISCLAIMER AT BOTTOM */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800/80 p-4 text-center text-xs text-slate-400 space-y-1">
        <div className="flex items-center justify-center gap-1.5 font-semibold text-slate-300">
          <Info className="w-4 h-4 text-indigo-400" />
          <span>Legal Disclaimer</span>
        </div>
        <p className="text-slate-400 max-w-2xl mx-auto">
          This tool provides informational assistance and is not a substitute for professional legal advice.
        </p>
      </div>

    </div>
  );
}