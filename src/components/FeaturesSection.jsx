import React from 'react';
import { BookOpen, ShieldAlert, MessagesSquare, FileCheck2, ArrowRight, Sparkles, Check, Copy } from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function FeaturesSection() {
  const { ref: sectionRef, isVisible, animKey } = useScrollReveal('features', { threshold: 0.15 });

  const features = [
    {
      title: 'Clause Explanation',
      description: 'Translates dense legal terminology, indemnity waivers, and complex conditions into plain everyday language anyone can understand.',
      icon: BookOpen,
      badge: 'Plain English Translation',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
      iconBox: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white',
      topBar: 'from-indigo-500 via-indigo-400 to-indigo-600',
      glow: 'group-hover:border-indigo-500/40 group-hover:shadow-indigo-500/15',
      renderPreview: () => (
        <div className="mt-5 p-3.5 rounded-xl bg-[#142039]/90 border border-[rgba(130,150,190,0.2)] space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] text-[#8FA0B8] font-sans font-medium">
            <span>BEFORE & AFTER</span>
            <span className="text-teal-400 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Simplified
            </span>
          </div>
          <div className="text-[#8FA0B8] text-[11px] line-through decoration-slate-500">
            "Lessee covenants to hold Lessor harmless against all sundry liabilities..."
          </div>
          <div className="text-teal-200 text-[11px] font-sans font-medium bg-teal-950/40 p-2 rounded-lg border border-teal-500/30">
            "You are not responsible for pre-existing building defects."
          </div>
        </div>
      )
    },
    {
      title: 'Potential Concern Detection',
      description: 'Identifies clauses that may require attention—such as unannounced inspections, extreme late fees, or uncapped repair liabilities—without bias.',
      icon: ShieldAlert,
      badge: 'Attention Categorization',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      iconBox: 'bg-amber-500/15 text-amber-400 border-amber-500/30 group-hover:bg-amber-600 group-hover:text-white',
      topBar: 'from-amber-500 via-amber-400 to-orange-500',
      glow: 'group-hover:border-amber-500/40 group-hover:shadow-amber-500/15',
      renderPreview: () => (
        <div className="mt-5 p-3.5 rounded-xl bg-[#142039]/90 border border-[rgba(130,150,190,0.2)] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#8FA0B8] font-medium">
            <span>AUTOMATED CLAUSE TAGGING</span>
            <span className="text-amber-400 font-semibold">AI Scan</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-300 border border-rose-500/30">
              🔴 Unannounced Entry (High)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              🟡 60-Day Notice (Medium)
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              🟢 Standard Rent (Low)
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Negotiation Suggestions',
      description: 'Provides polite, constructive questions and counter-proposals you can ask the landlord to protect your tenant rights before signing.',
      icon: MessagesSquare,
      badge: 'Tenant Empowerment',
      badgeColor: 'bg-teal-500/15 text-teal-300 border-teal-500/25',
      iconBox: 'bg-teal-500/15 text-teal-400 border-teal-500/30 group-hover:bg-teal-600 group-hover:text-white',
      topBar: 'from-teal-500 via-teal-400 to-indigo-500',
      glow: 'group-hover:border-teal-500/40 group-hover:shadow-teal-500/15',
      renderPreview: () => (
        <div className="mt-5 p-3.5 rounded-xl bg-[#142039]/90 border border-[rgba(130,150,190,0.2)] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#8FA0B8] font-medium">
            <span>READY-TO-SEND SCRIPT</span>
            <span className="text-cyan-400 font-mono text-[10px]">&lt;50 Words</span>
          </div>
          <div className="p-2.5 rounded-lg bg-cyan-950/30 border border-cyan-500/30 text-cyan-200 text-[11px] flex items-start justify-between gap-2">
            <span>"Could we please define a standard 24-hour advance notice period before property viewings?"</span>
            <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-[9px] font-bold text-cyan-300 shrink-0 flex items-center gap-0.5">
              <Copy className="w-2.5 h-2.5" /> Copy
            </span>
          </div>
        </div>
      )
    },
    {
      title: 'Agreement Summary',
      description: 'Generates a holistic tenant friendliness score, highlighting overall lease balance, high-concern terms, and standard fair terms.',
      icon: FileCheck2,
      badge: 'Comprehensive Score',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
      iconBox: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 group-hover:bg-cyan-600 group-hover:text-white',
      topBar: 'from-cyan-500 via-cyan-400 to-blue-500',
      glow: 'group-hover:border-cyan-500/40 group-hover:shadow-cyan-500/15',
      renderPreview: () => (
        <div className="mt-5 p-3.5 rounded-xl bg-[#142039]/90 border border-[rgba(130,150,190,0.2)] space-y-2 text-xs">
          <div className="flex items-center justify-between text-[11px] text-[#8FA0B8] font-medium">
            <span>SAFETY SCORE CARD</span>
            <span className="text-teal-400 font-bold">85 / 100 Safe</span>
          </div>
          <div className="w-full bg-[#142039] rounded-full h-2 overflow-hidden flex border border-[rgba(130,150,190,0.15)]">
            <div className="bg-teal-400 h-full w-[70%]" title="70% Standard" />
            <div className="bg-amber-400 h-full w-[20%]" title="20% Medium" />
            <div className="bg-rose-400 h-full w-[10%]" title="10% High" />
          </div>
          <div className="flex justify-between text-[10px] text-[#8FA0B8] pt-0.5">
            <span className="text-teal-400 font-semibold">9 Safe</span>
            <span className="text-amber-400 font-semibold">2 Discuss</span>
            <span className="text-rose-400 font-semibold">1 Flagged</span>
          </div>
        </div>
      )
    }
  ];

  return (
    <section 
      id="features" 
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 blur-[140px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Reversible Fade & Slide */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-16 sm:mb-20 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/25 text-xs font-semibold text-indigo-300 mb-4 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Tenant-Focused AI Engine
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
            Designed to Protect Tenants
          </h2>
          <p className="mt-4 text-[#B8C4D6] text-sm sm:text-base leading-relaxed">
            Equipping renters with clarity, safety, and confidence before signing any residential lease.
          </p>
        </div>

        {/* 4 Feature Cards Grid with Reversible Staggered Fade & 3D Interactive Perspective */}
        <div key={animKey} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 [perspective:1200px]">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            const delayMs = idx * 120; // 0ms, 120ms, 240ms, 360ms

            return (
              <div 
                key={idx}
                onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 5, 8)}
                onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
                className={`relative bg-gradient-to-b from-[#1B2942] via-[#1B2942]/90 to-[#142039] rounded-2xl p-6 sm:p-8 border border-[rgba(130,150,190,0.22)] hover:border-[rgba(130,150,190,0.4)] group shadow-xl shadow-black/20 flex flex-col justify-between overflow-hidden cursor-default will-change-transform transition-all ${feat.glow} ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-[0.98]'
                }`}
                style={{
                  transitionProperty: 'opacity, transform, border-color, box-shadow',
                  transitionDuration: isVisible ? '600ms' : '200ms',
                  transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                  transitionDelay: isVisible ? `${delayMs}ms` : '0ms'
                }}
              >
                {/* 3D Specular Glare Reflection Overlay */}
                <div className="card-glare-overlay pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 z-20" />

                {/* Top Border Accent */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${feat.topBar} opacity-60 group-hover:opacity-100 transition-opacity duration-300 z-10`} />

                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-5">
                    <div className={`w-13 h-13 p-3 rounded-2xl border flex items-center justify-center transition-all duration-300 ${feat.iconBox} shadow-md group-hover:scale-105 shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${feat.badgeColor} shadow-sm text-right`}>
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-[#F8FAFC] mb-2.5 group-hover:text-indigo-200 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-[#B8C4D6] text-xs sm:text-sm leading-relaxed font-normal">
                    {feat.description}
                  </p>

                  {/* Interactive Micro-Preview Component */}
                  {feat.renderPreview()}
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(130,150,190,0.15)] flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 relative z-10">
                  <span>Included in standard analysis</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}