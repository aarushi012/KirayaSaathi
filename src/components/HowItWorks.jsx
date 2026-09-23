import React from 'react';
import { UploadCloud, Binary, AlertTriangle, MessageSquareQuote, Check, ArrowRight } from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HowItWorks() {
  const { ref: sectionRef, isVisible, animKey } = useScrollReveal('how-it-works', { threshold: 0.15 });

  const steps = [
    {
      number: '01',
      title: 'Upload Agreement',
      description: 'Upload your rental agreement PDF or paste the contract text directly into the secure analyzer.',
      icon: UploadCloud,
      badgeBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      topBar: 'from-indigo-500 via-indigo-400 to-indigo-600'
    },
    {
      number: '02',
      title: 'AI Reads Clauses',
      description: 'Our AI model parses the document, breaking it down into distinct, categorized legal clauses.',
      icon: Binary,
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      topBar: 'from-cyan-500 via-cyan-400 to-blue-500'
    },
    {
      number: '03',
      title: 'Identify Potential Concerns',
      description: 'Terms that may require attention—such as unannounced entry or uncapped deductions—are highlighted with clear reasons.',
      icon: AlertTriangle,
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      topBar: 'from-amber-500 via-amber-400 to-orange-500'
    },
    {
      number: '04',
      title: 'Get Actionable Insights',
      description: 'Receive simplified plain-English explanations and polite questions to discuss with your landlord before signing.',
      icon: MessageSquareQuote,
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      topBar: 'from-emerald-500 via-emerald-400 to-teal-500'
    }
  ];

  return (
    <section 
      id="how-it-works" 
      ref={sectionRef}
      className="py-20 md:py-28 bg-[#17243B]/70 border-y border-[rgba(130,150,190,0.18)] relative overflow-hidden"
    >
      {/* Background Subtle Ambient Lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-600/5 blur-[120px] rounded-full pointer-events-none -z-0" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-cyan-600/5 blur-[120px] rounded-full pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Reversible Fade & Slide */}
        <div 
          className={`text-center max-w-2xl mx-auto mb-16 sm:mb-20 transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] text-xs font-semibold text-indigo-300 shadow-sm mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
            Simple 4-Step Process
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
            How It Works
          </h2>
          
          <p className="mt-4 text-[#B8C4D6] text-sm sm:text-base leading-relaxed">
            From complex legal paperwork to clear tenant confidence in under 30 seconds.
          </p>
        </div>

        {/* 4 Cards Grid with Reversible Staggered Fade & 3D Interactive Perspective */}
        <div key={animKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-6 relative [perspective:1200px]">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const delayMs = idx * 120; // 0ms, 120ms, 240ms, 360ms

            return (
              <div 
                key={idx}
                onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 6, 8)}
                onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
                className={`relative bg-gradient-to-b from-[#1B2942] via-[#1B2942]/90 to-[#142039] rounded-2xl p-6 sm:p-7 border border-[rgba(130,150,190,0.22)] hover:border-[rgba(130,150,190,0.4)] flex flex-col justify-between group shadow-lg shadow-black/20 overflow-hidden cursor-default will-change-transform transition-all ${
                  isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-7 scale-[0.98]'
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

                {/* Top Subtle Accent Line on Card */}
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${step.topBar} opacity-60 group-hover:opacity-100 transition-opacity duration-200 z-10`} />

                <div className="relative z-10">
                  {/* Top Row: Static Icon & Step Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-12 h-12 p-3 rounded-xl border flex items-center justify-center ${step.badgeBg} shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#142039] border border-[rgba(130,150,190,0.2)] text-[#B8C4D6] group-hover:text-white transition-colors">
                      <span className="text-[#8FA0B8] font-sans text-[10px]">STEP</span>
                      <span>{step.number}</span>
                    </div>
                  </div>

                  {/* Heading & Plain-English Description */}
                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-2.5 group-hover:text-indigo-200 transition-colors duration-200 leading-snug">
                    {step.title}
                  </h3>
                  
                  <p className="text-[#B8C4D6] text-xs sm:text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Bottom Row: Static "Step Verified" Indicator */}
                <div className="mt-8 pt-4 border-t border-[rgba(130,150,190,0.15)] flex items-center justify-between text-xs font-medium text-[#8FA0B8] relative z-10">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-teal-500/10 border border-teal-500/30 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-teal-400" />
                    </div>
                    <span className="text-[11px] text-[#8FA0B8] group-hover:text-[#E2E8F0] transition-colors">
                      Step {step.number} Verified
                    </span>
                  </div>

                  {idx < 3 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 transition-colors hidden lg:block" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}