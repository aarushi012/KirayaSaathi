import React, { useState } from 'react';
import { 
  ShieldAlert, AlertTriangle, CheckCircle2, Search, 
  HelpCircle, Sparkles, Scale, BookOpen, 
  ArrowLeft, ChevronRight, CheckSquare, Layers, Bot, Zap, Tag
} from 'lucide-react';

export default function ClauseSplitView({ analysisData, _rawExtractedText, onBackToUpload, onOpenNegotiationModal }) {
  const [selectedClauseId, setSelectedClauseId] = useState(analysisData.clauses[0]?.id || 1);
  const [filterLevel, setFilterLevel] = useState('ALL'); // 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'
  const [searchQuery, setSearchQuery] = useState('');

  const selectedClause = analysisData.clauses.find(c => c.id === selectedClauseId) || analysisData.clauses[0];

  const filteredClauses = analysisData.clauses.filter(clause => {
    if (filterLevel === 'HIGH' && clause.attention_level !== 'HIGH') return false;
    if (filterLevel === 'MEDIUM' && clause.attention_level !== 'MEDIUM') return false;
    if (filterLevel === 'LOW' && clause.attention_level !== 'LOW') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (clause.clause_title || clause.title)?.toLowerCase().includes(q);
      const matchOriginal = (clause.original_text || clause.originalText)?.toLowerCase().includes(q);
      const matchSimplified = (clause.simple_explanation || clause.simplifiedText)?.toLowerCase().includes(q);
      const matchCategory = clause.category?.toLowerCase().includes(q);
      return matchTitle || matchOriginal || matchSimplified || matchCategory;
    }
    return true;
  });

  const getBadgeStyle = (level) => {
    switch (level) {
      case 'HIGH':
      case 'May Require Attention':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'MEDIUM':
      case 'Consider Discussing':
        return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
      default:
        return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    }
  };

  const getIconForLevel = (level) => {
    switch (level) {
      case 'HIGH':
      case 'May Require Attention':
        return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'MEDIUM':
      case 'Consider Discussing':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getLabelForLevel = (level) => {
    switch (level) {
      case 'HIGH':
      case 'May Require Attention':
        return 'May Require Attention';
      case 'MEDIUM':
      case 'Consider Discussing':
        return 'Consider Discussing';
      default:
        return 'Standard (Low Attention)';
    }
  };

  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      
      {/* Top Bar Navigation & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#2A3B5C]/60">
        <button
          onClick={onBackToUpload}
          className="inline-flex items-center text-sm font-semibold text-[#B8C4D6] hover:text-[#F8FAFC] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Upload Another Agreement
        </button>

        <div className="flex items-center gap-3">
          {/* AI Engine source indicator */}
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            analysisData.isLiveAI 
              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
              : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
          }`}>
            {analysisData.isLiveAI ? <Bot className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
            <span>{analysisData.aiProvider || (analysisData.isLiveAI ? 'Live Gemini AI' : 'Demo Engine')}</span>
          </span>

          <button
            onClick={onOpenNegotiationModal}
            className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600/25 hover:bg-indigo-600/35 border border-indigo-500/35 text-indigo-200 text-xs sm:text-sm font-semibold transition-all shadow-sm"
          >
            <CheckSquare className="w-4 h-4 mr-2 text-indigo-400" />
            Negotiation Checklist ({analysisData.high_attention + analysisData.medium_attention})
          </button>
        </div>
      </div>

      {/* Summary Score Header Card */}
      <div className="bg-[#1B2942]/90 rounded-2xl border border-[#2A3B5C]/60 p-6 sm:p-8 shadow-xl backdrop-blur-md relative overflow-hidden space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          {/* Document Title & Rating */}
          <div className="lg:col-span-8 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25">
                {analysisData.total_clauses_analyzed || analysisData.totalClauses} Clauses Analyzed
              </span>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                analysisData.ratingColor === 'rose' 
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
                  : analysisData.ratingColor === 'amber'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {analysisData.overallRating}
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight">
              {analysisData.title || 'Residential Rental Agreement'}
            </h2>

            <p className="text-[#E2E8F0] text-sm leading-relaxed">
              {analysisData.summary}
            </p>

            {/* Key Summary Highlights */}
            {analysisData.key_points && analysisData.key_points.length > 0 && (
              <div className="pt-2">
                <div className="text-xs font-semibold text-[#8FA0B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Key Takeaways
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#B8C4D6]">
                  {analysisData.key_points.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-400 mt-0.5">•</span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="lg:col-span-4 grid grid-cols-3 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60">
              <div className="text-2xl font-black text-rose-400">{analysisData.high_attention || analysisData.highAttentionCount}</div>
              <div className="text-[11px] text-[#8FA0B8] mt-1 font-medium leading-tight">High Attention</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60">
              <div className="text-2xl font-black text-amber-400">{analysisData.medium_attention || analysisData.moderateCount}</div>
              <div className="text-[11px] text-[#8FA0B8] mt-1 font-medium leading-tight">Consider Discussing</div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60">
              <div className="text-2xl font-black text-emerald-400">{analysisData.low_attention || analysisData.standardCount}</div>
              <div className="text-[11px] text-[#8FA0B8] mt-1 font-medium leading-tight">Standard Low</div>
            </div>
          </div>

        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterLevel('ALL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filterLevel === 'ALL'
                ? 'bg-indigo-600 text-white'
                : 'bg-[#1B2942] border border-[#2A3B5C]/60 text-[#B8C4D6] hover:text-[#F8FAFC]'
            }`}
          >
            All Clauses ({analysisData.total_clauses_analyzed || analysisData.totalClauses})
          </button>
          <button
            onClick={() => setFilterLevel('HIGH')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterLevel === 'HIGH'
                ? 'bg-rose-600 text-white'
                : 'bg-[#1B2942] border border-[#2A3B5C]/60 text-rose-300 hover:bg-[#142039]'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5" />
            May Require Attention ({analysisData.high_attention || analysisData.highAttentionCount})
          </button>
          <button
            onClick={() => setFilterLevel('MEDIUM')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterLevel === 'MEDIUM'
                ? 'bg-amber-600 text-white'
                : 'bg-[#1B2942] border border-[#2A3B5C]/60 text-amber-300 hover:bg-[#142039]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Consider Discussing ({analysisData.medium_attention || analysisData.moderateCount})
          </button>
          <button
            onClick={() => setFilterLevel('LOW')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              filterLevel === 'LOW'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#1B2942] border border-[#2A3B5C]/60 text-emerald-300 hover:bg-[#142039]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Standard ({analysisData.low_attention || analysisData.standardCount})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-[#8FA0B8] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by clause or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#142039] border border-[#2A3B5C]/70 rounded-xl pl-9 pr-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#8FA0B8] focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

      </div>

      {/* Side-by-Side Split View Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT PANEL: Original Clauses List */}
        <div className="lg:col-span-5 space-y-3 max-h-[750px] overflow-y-auto pr-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#8FA0B8] flex items-center gap-1.5 mb-2 px-1">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Clauses in Agreement ({filteredClauses.length})</span>
          </div>

          {filteredClauses.length === 0 ? (
            <div className="p-8 text-center bg-[#1B2942] rounded-xl border border-[#2A3B5C]/60 text-[#8FA0B8] text-sm">
              No clauses match the selected filters.
            </div>
          ) : (
            filteredClauses.map((clause) => {
              const isSelected = selectedClause?.id === clause.id;
              return (
                <div
                  key={clause.id}
                  onClick={() => setSelectedClauseId(clause.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-950/50 border-indigo-500 ring-1 ring-indigo-500 shadow-lg'
                      : 'bg-[#1B2942]/85 border-[#2A3B5C]/60 hover:border-slate-500/60 hover:bg-[#1B2942]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#8FA0B8] font-bold">#{clause.id}</span>
                      <h4 className="text-sm font-semibold text-[#F8FAFC] line-clamp-1">
                        {clause.clause_title || clause.title}
                      </h4>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border shrink-0 ${getBadgeStyle(clause.attention_level)}`}>
                      {clause.attention_level || 'LOW'}
                    </span>
                  </div>

                  <p className="text-xs text-[#B8C4D6] line-clamp-2 font-serif italic">
                    "{clause.original_text || clause.originalText}"
                  </p>

                  <div className="mt-3 pt-2 border-t border-[#2A3B5C]/50 flex items-center justify-between text-[11px] text-[#8FA0B8]">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#142039] text-indigo-300 font-medium border border-[#2A3B5C]/40">
                      <Tag className="w-3 h-3 text-indigo-400" /> {clause.category || 'Other'}
                    </span>
                    <span className="flex items-center gap-1 text-[#8FA0B8]">
                      View breakdown <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT PANEL: Detailed AI Breakdown & Structured Output */}
        <div className="lg:col-span-7 bg-[#1B2942]/95 rounded-2xl border border-[#2A3B5C]/60 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {selectedClause ? (
            <>
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#2A3B5C]/60">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono font-bold text-indigo-400">Clause #{selectedClause.id}</span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                      {selectedClause.category || 'Other'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#F8FAFC]">
                    {selectedClause.clause_title || selectedClause.title}
                  </h3>
                </div>

                <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 self-start sm:self-center ${getBadgeStyle(selectedClause.attention_level)}`}>
                  {getIconForLevel(selectedClause.attention_level)}
                  <span className="text-xs font-bold">{getLabelForLevel(selectedClause.attention_level)}</span>
                </div>
              </div>

              {/* 1. What the agreement actually says (Original Text) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#8FA0B8] uppercase tracking-wider flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5 text-[#8FA0B8]" />
                  <span>What The Agreement Actually Says (Original Text)</span>
                </div>
                <div className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/70 text-sm sm:text-base text-[#E2E8F0] leading-relaxed font-serif italic">
                  "{selectedClause.original_text || selectedClause.originalText}"
                </div>
              </div>

              {/* 2. What the AI interprets it to mean (Simple Explanation) */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Simple Explanation (Plain English)</span>
                </div>
                <div className="p-4 rounded-xl bg-indigo-950/35 border border-indigo-500/30 text-sm sm:text-base text-[#F1F5F9] leading-relaxed">
                  {selectedClause.simple_explanation || selectedClause.simplifiedText}
                </div>
              </div>

              {/* 3. Reason for attention level */}
              {selectedClause.reason && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reason For Attention Level</span>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-950/25 border border-amber-500/30 text-sm sm:text-base text-amber-100 leading-relaxed">
                    {selectedClause.reason}
                  </div>
                </div>
              )}

              {/* 4. Negotiation suggestion & tenant clarification */}
              <div className="p-5 rounded-xl bg-[#142039]/95 border border-[#2A3B5C]/60 space-y-3">
                <div className="text-xs font-bold text-[#F8FAFC] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Negotiation Suggestion & Questions To Ask</span>
                </div>

                <div className="p-3.5 rounded-lg bg-cyan-950/35 border border-cyan-500/30 text-sm sm:text-base font-medium text-cyan-200 flex items-start gap-2.5 leading-relaxed">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>"{selectedClause.negotiation_suggestion || selectedClause.negotiationTip || 'Consider discussing this term with the landlord before signing.'}"</span>
                </div>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-[#8FA0B8]">
              Select a clause from the left to view its AI breakdown.
            </div>
          )}
        </div>
      </div>

    </section>
  );
}