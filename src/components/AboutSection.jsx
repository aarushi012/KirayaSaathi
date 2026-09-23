import React from 'react';
import { Scale } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

export default function AboutSection() {
  const { ref: sectionRef, isVisible } = useScrollReveal('about', { threshold: 0.15 });

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="py-16 bg-[#17243B]/80 backdrop-blur-md border-t border-[rgba(130,150,190,0.18)] relative overflow-hidden"
    >
      <div 
        className={`max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 transition-all duration-500 ease-out will-change-transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.98]'
        }`}
      >
        <div className="inline-flex p-3 rounded-2xl bg-indigo-600/15 text-indigo-300 border border-indigo-500/25 mb-2">
          <Scale className="w-6 h-6" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
          Empowering Renters with Clear Legal Information
        </h2>
        <p className="text-[#B8C4D6] text-sm sm:text-base leading-relaxed">
          Rental agreements are often dense, multi-page legal documents containing confusing jargon and restrictive terms. 
          KirayaSaathi uses artificial intelligence to demystify every clause, surface terms that may require attention, 
          and equip you with respectful negotiation questions before you sign.
        </p>
      </div>
    </section>
  );
}
