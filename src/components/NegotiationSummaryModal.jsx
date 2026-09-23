import React, { useState } from 'react';
import { X, CheckSquare, Copy, Check, MessageSquare } from 'lucide-react';

export default function NegotiationSummaryModal({ analysisData, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !analysisData) return null;

  const flaggedClauses = analysisData.clauses.filter(
    (c) => (c.attention_level || c.attentionLevel) !== 'LOW' && (c.attention_level || c.attentionLevel) !== 'Standard'
  );

  const handleCopy = () => {
    const text = flaggedClauses.map((c, idx) => 
      `${idx + 1}. [${c.attention_level || c.attentionLevel}] ${c.clause_title || c.title} (${c.category || 'Other'})\n` +
      `   Reason: ${c.reason}\n` +
      `   Negotiation Suggestion: "${c.negotiation_suggestion || c.negotiationTip}"\n`
    ).join('\n');

    navigator.clipboard.writeText(`Rental Agreement Negotiation Checklist - ${analysisData.title || 'Lease'}\n\n${text}\n\nDisclaimer: Informational assistance only; not legal advice.`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1B2942] border border-[#2A3B5C] rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        <div className="p-6 border-b border-[#2A3B5C]/60 flex items-center justify-between bg-[#142039]/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-500/15 rounded-lg text-indigo-400 border border-indigo-500/25">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#F8FAFC]">Tenant Negotiation Checklist</h3>
              <p className="text-xs text-[#8FA0B8]">Key talking points and questions to discuss before signing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8FA0B8] hover:text-[#F8FAFC] hover:bg-[#202F49] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {flaggedClauses.length === 0 ? (
            <div className="text-center py-10 text-[#8FA0B8] text-sm">
              No high attention clauses found. The agreement terms appear balanced.
            </div>
          ) : (
            flaggedClauses.map((clause, idx) => (
              <div
                key={clause.id}
                className="p-4 rounded-xl bg-[#142039]/90 border border-[#2A3B5C]/60 space-y-2.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">#{idx + 1}</span>
                    <h4 className="text-sm font-semibold text-[#F8FAFC]">{clause.clause_title || clause.title}</h4>
                    <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#202F49] text-indigo-300 border border-[#2A3B5C]/50">
                      {clause.category || 'Other'}
                    </span>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                    (clause.attention_level === 'HIGH' || clause.attentionLevel === 'May Require Attention')
                      ? 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  }`}>
                    {clause.attention_level || clause.attentionLevel}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-indigo-950/35 border border-indigo-500/30 text-xs sm:text-sm text-cyan-200 font-medium flex items-start gap-2">
                  <MessageSquare className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>"{clause.negotiation_suggestion || clause.negotiationTip || 'Consider discussing this term.'}"</span>
                </div>

                <p className="text-xs text-[#8FA0B8]">
                  <strong className="text-[#B8C4D6]">Why to clarify:</strong> {clause.reason}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-[#2A3B5C]/60 bg-[#142039]/90 flex items-center justify-between gap-3">
          <div className="text-[11px] text-[#8FA0B8] hidden sm:block">
            Informational assistance only. Not legal advice.
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-[#202F49] hover:bg-[#283B5E] text-[#E2E8F0] text-xs font-semibold transition-all border border-[#2A3B5C]"
            >
              {copied ? <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 mr-1.5" />}
              {copied ? 'Copied Checklist!' : 'Copy to Clipboard'}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md"
            >
              Done
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}