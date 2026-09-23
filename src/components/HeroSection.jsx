import React, { useState, useEffect, useRef } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import AIAnalysisResultCard from './AIAnalysisResultCard';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function HeroSection({ onAnalyzeClick, onHowItWorksClick, onTryDemo }) {
  const { ref: sectionRef, isVisible, animKey } = useScrollReveal('home', { threshold: 0.15 });
  const [scrollOffset, setScrollOffset] = useState({ opacity: 1, translateY: 0 });
  const animFrameRef = useRef(null);

  // Subtle Hero Scroll Fade & Parallax
  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && 
      window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return;

    const handleScroll = () => {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y <= 500) {
          const ratio = Math.min(y / 450, 1);
          setScrollOffset({
            opacity: 1 - ratio * 0.35,
            translateY: -ratio * 16
          });
        } else if (scrollOffset.opacity !== 0.65) {
          setScrollOffset({ opacity: 0.65, translateY: -16 });
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <section 
      id="home" 
      ref={sectionRef}
      className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden"
    >
      {/* Subtle Hero Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_70%)] pointer-events-none -z-0" />

      <div 
        key={`hero-content-${animKey}`} 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ease-out relative z-10"
        style={{
          opacity: scrollOffset.opacity,
          transform: `translate3d(0, ${scrollOffset.translateY}px, 0)`
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* 1. Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] text-xs font-semibold text-indigo-300 shadow-sm transition-all ${
                isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-[0.98]'
              }`}
              style={{
                transitionDuration: isVisible ? '500ms' : '200ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '0ms' : '0ms'
              }}
            >
              <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-dotSoftPulse" />
              <span>AI Legal-Tech Assistant for Tenants</span>
            </div>

            {/* 2. Main Heading */}
            <h1 
              className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-[1.15] transition-all ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{
                transitionDuration: isVisible ? '550ms' : '200ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '80ms' : '0ms'
              }}
            >
              Understand Your Rental Agreement{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
                Before You Sign
              </span>
            </h1>

            {/* 3. Subtitle */}
            <p 
              className={`text-lg sm:text-xl text-[#B8C4D6] max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal transition-all ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDuration: isVisible ? '500ms' : '200ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '160ms' : '0ms'
              }}
            >
              AI-powered clause analysis that turns complex rental language into simple, understandable insights.
            </p>

            {/* 4. CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2 transition-all ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                transitionDuration: isVisible ? '500ms' : '200ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '240ms' : '0ms'
              }}
            >
              
              {/* Primary CTA: Analyze Button with subtle AI light sweep on hover */}
              <button
                type="button"
                onClick={onAnalyzeClick}
                className="relative overflow-hidden w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 hover:-translate-y-[2px] transition-all duration-200 active:scale-[0.97] group cursor-pointer"
              >
                {/* Subtle AI sweep light beam on hover */}
                <div 
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" 
                  aria-hidden="true"
                />
                
                <span className="relative z-10">Analyze My Agreement</span>
                <ArrowRight className="relative z-10 w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
              </button>

              {/* Secondary CTA: Try Demo Agreement with lightning micro-interaction */}
              <button
                type="button"
                onClick={onTryDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 text-base font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400/60 rounded-xl transition-all duration-200 shadow-md shadow-amber-500/10 hover:shadow-amber-500/20 hover:-translate-y-[2px] active:scale-[0.97] group cursor-pointer"
              >
                <span className="mr-2 inline-block group-hover:scale-110 transition-transform duration-200">⚡</span>
                <span>Try Demo Agreement</span>
                <span className="ml-2 text-[11px] font-semibold text-amber-400/90 px-2 py-0.5 rounded bg-amber-400/15 hidden sm:inline">60s Demo</span>
              </button>

              {/* How It Works Button */}
              <button
                type="button"
                onClick={onHowItWorksClick}
                className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3.5 text-sm font-semibold text-[#E2E8F0] hover:text-white bg-[#1B2942] hover:bg-[#202F49] border border-[rgba(130,150,190,0.25)] hover:border-[rgba(130,150,190,0.4)] rounded-xl transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.97] cursor-pointer"
              >
                How It Works
              </button>
            </div>

            {/* 5. Trust Points with Staggered Entrance */}
            <div 
              className={`pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-[#8FA0B8] transition-all ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
              }`}
              style={{
                transitionDuration: isVisible ? '450ms' : '200ms',
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                transitionDelay: isVisible ? '320ms' : '0ms'
              }}
            >
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[#B8C4D6]">Zero Legal Jargon</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[#B8C4D6]">Side-by-Side Clause Review</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[#B8C4D6]">100% Private & In-Browser</span>
              </div>
            </div>

          </div>

          {/* AI Result Card Block */}
          <div className="lg:col-span-5 relative">
            <AIAnalysisResultCard 
              triggerKey={animKey} 
              isVisible={isVisible}
            />
          </div>

        </div>
      </div>
    </section>
  );
}