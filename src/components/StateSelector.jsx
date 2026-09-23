import React from 'react';
import { MapPin, ShieldCheck, Scale, Info, Check } from 'lucide-react';
import { SUPPORTED_STATES, getJurisdictionById } from '../data/jurisdictions';

export default function StateSelector({ selectedStateId, onSelectState, compact = false }) {
  const currentJurisdiction = getJurisdictionById(selectedStateId);

  return (
    <div className="space-y-3.5">
      {/* Label and Guidance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 px-1">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/25">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <label className="text-xs sm:text-sm font-bold text-[#F8FAFC] tracking-tight block">
              Select Rental Jurisdiction / State
            </label>
            <span className="text-[11px] text-[#8FA0B8]">
              Applies state-specific tenancy acts, standard deposit limits & eviction protections
            </span>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#142039] border border-[#2A3B5C]/70 text-indigo-300 self-start sm:self-center">
          <Scale className="w-3 h-3 text-indigo-400" />
          <span>Active: <strong className="text-white">{currentJurisdiction.name}</strong></span>
        </span>
      </div>

      {/* 6-State Grid / Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {SUPPORTED_STATES.map((state) => {
          const isSelected = (selectedStateId || 'delhi').toLowerCase() === state.id.toLowerCase();
          return (
            <button
              key={state.id}
              type="button"
              onClick={() => onSelectState(state.id)}
              className={`p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/70 to-[#1B2942] border-indigo-500 ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/60'
                  : 'bg-[#142039]/90 border-[#2A3B5C]/70 hover:border-slate-500/80 hover:bg-[#1B2942]/90'
              }`}
            >
              <div className="flex items-start justify-between gap-1 mb-1.5">
                <span className="text-lg select-none" role="img" aria-label={state.name}>
                  {state.iconEmoji}
                </span>
                {isSelected ? (
                  <span className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                ) : (
                  <span className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-slate-400 shrink-0" />
                )}
              </div>

              <div className="font-bold text-xs text-[#F8FAFC] truncate">
                {state.name}
              </div>
              <div className="text-[10px] text-[#8FA0B8] truncate mt-0.5 font-mono">
                {state.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* State Tenancy Insight Well (only when not in ultra-compact mode) */}
      {!compact && currentJurisdiction && (
        <div className="p-3.5 rounded-xl bg-[#142039]/80 border border-[#2A3B5C]/60 text-xs space-y-2 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#2A3B5C]/50 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#F8FAFC] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                {currentJurisdiction.act}
              </span>
            </div>
            <span className="text-[11px] text-[#8FA0B8]">
              {currentJurisdiction.policeVerification}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-[#B8C4D6] pt-0.5">
            <div>
              <span className="text-[#8FA0B8] block text-[10px] uppercase font-bold tracking-wider">Deposit Benchmark</span>
              <span className="text-emerald-300 font-semibold">{currentJurisdiction.depositNorm}</span>
            </div>
            <div>
              <span className="text-[#8FA0B8] block text-[10px] uppercase font-bold tracking-wider">Notice Period Norm</span>
              <span className="text-cyan-300 font-semibold">{currentJurisdiction.noticeNorm}</span>
            </div>
            <div>
              <span className="text-[#8FA0B8] block text-[10px] uppercase font-bold tracking-wider">Rent Escalation</span>
              <span className="text-amber-300 font-semibold">{currentJurisdiction.escalationNorm}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
