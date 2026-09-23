import React from 'react';
import { Eye, Sparkles, DollarSign, ShieldAlert, Lock, Clock, Calendar, AlertTriangle } from 'lucide-react';

export default function AgreementGlance({ glanceData, fallbackSummary }) {
  const glance = glanceData || {};
  const financialTerms = glance.financial_terms || {
    rent: 'Not specified in the agreement.',
    security_deposit: 'Not specified in the agreement.',
    lock_in_period: 'Not specified in the agreement.',
    notice_period: 'Not specified in the agreement.'
  };
  const importantDates = glance.important_dates || ['Not specified in the agreement.'];
  const topAttentionClauses = glance.top_attention_clauses || [];

  return (
    <div className="bg-[#1B2942]/90 rounded-2xl border border-[#2A3B5C]/60 p-6 sm:p-8 shadow-xl space-y-6 relative overflow-hidden backdrop-blur-md">
      
      {/* Section Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#2A3B5C]/60">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/15 rounded-xl text-indigo-400 border border-indigo-500/25">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC] tracking-tight">
              Agreement at a Glance
            </h2>
            <p className="text-xs text-[#8FA0B8]">
              Key financial terms, dates, and essential highlights extracted from your agreement
            </p>
          </div>
        </div>
      </div>

      {/* 1. One-Paragraph Simple Summary */}
      <div className="p-4 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/60 space-y-1.5">
        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" /> Simple Overview Summary
        </div>
        <p className="text-sm text-[#E2E8F0] leading-relaxed">
          {glance.summary || fallbackSummary || 'This agreement establishes the tenancy terms, rights, and obligations between tenant and property owner.'}
        </p>
      </div>

      {/* 2. Key Financial Terms Grid */}
      <div className="space-y-2">
        <div className="text-xs font-bold uppercase tracking-wider text-[#8FA0B8] flex items-center gap-1.5">
          <DollarSign className="w-3.5 h-3.5 text-indigo-400" /> Key Financial & Tenure Terms
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          
          {/* Rent */}
          <div className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8FA0B8] font-semibold">
              <span>Monthly Rent</span>
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className={`text-sm sm:text-base font-bold ${financialTerms.rent === 'Not specified in the agreement.' ? 'text-[#8FA0B8] font-normal italic text-xs' : 'text-[#F8FAFC]'}`}>
              {financialTerms.rent}
            </div>
          </div>

          {/* Security Deposit */}
          <div className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8FA0B8] font-semibold">
              <span>Security Deposit</span>
              <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className={`text-sm sm:text-base font-bold ${financialTerms.security_deposit === 'Not specified in the agreement.' ? 'text-[#8FA0B8] font-normal italic text-xs' : 'text-[#F8FAFC]'}`}>
              {financialTerms.security_deposit}
            </div>
          </div>

          {/* Lock-in Period */}
          <div className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8FA0B8] font-semibold">
              <span>Lock-in Period</span>
              <Lock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className={`text-sm sm:text-base font-bold ${financialTerms.lock_in_period === 'Not specified in the agreement.' ? 'text-[#8FA0B8] font-normal italic text-xs' : 'text-[#F8FAFC]'}`}>
              {financialTerms.lock_in_period}
            </div>
          </div>

          {/* Notice Period */}
          <div className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 space-y-1">
            <div className="flex items-center justify-between text-xs text-[#8FA0B8] font-semibold">
              <span>Notice Period</span>
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <div className={`text-sm sm:text-base font-bold ${financialTerms.notice_period === 'Not specified in the agreement.' ? 'text-[#8FA0B8] font-normal italic text-xs' : 'text-[#F8FAFC]'}`}>
              {financialTerms.notice_period}
            </div>
          </div>

        </div>
      </div>

      {/* 3 & 4. Important Dates and Top Attention Clauses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
        
        {/* Important Dates / Durations */}
        <div className="p-4 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/60 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#B8C4D6] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-indigo-400" />
            <span>Important Dates & Durations</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#B8C4D6]">
            {importantDates.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span className={d === 'Not specified in the agreement.' ? 'text-[#8FA0B8] italic' : 'text-[#E2E8F0] font-medium'}>
                  {d}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Top Clauses Deserving Attention */}
        <div className="p-4 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/60 space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Top Clauses Deserving Attention</span>
          </div>
          <ul className="space-y-1.5 text-xs text-[#B8C4D6]">
            {topAttentionClauses.length > 0 ? (
              topAttentionClauses.map((cTitle, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-400 mt-0.5">⚠</span>
                  <span className="text-[#E2E8F0] font-medium">{cTitle}</span>
                </li>
              ))
            ) : (
              <li className="text-[#8FA0B8] italic">No high-risk terms identified.</li>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
}