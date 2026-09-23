import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Scale, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  HeartHandshake, 
  Users, 
  FileCheck, 
  ArrowRight,
  Zap,
  Globe2,
  Code
} from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

export default function AboutPage({ onTryDemo }) {
  const values = [
    {
      title: 'Tenant-First Advocacy',
      description: 'We believe renters deserve transparent, understandable terms before committing their money and peace of mind.',
      icon: HeartHandshake,
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      title: '100% Privacy & Security',
      description: 'Your legal contracts never leave your browser for storage. Text is parsed in memory and never logged, sold, or shared.',
      icon: Lock,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Neutral & Fair AI',
      description: 'Our AI provides objective, balanced insights aligned with Indian tenancy standards and the Model Tenancy Act.',
      icon: Scale,
      color: 'from-teal-500 to-emerald-500'
    },
    {
      title: 'Constructive Negotiation',
      description: 'We don’t encourage legal friction; we provide polite, respectful phrasing to build healthy landlord-tenant relations.',
      icon: Users,
      color: 'from-amber-500 to-orange-500'
    }
  ];

  const stats = [
    { number: '10M+', label: 'Urban renters in top Indian metros' },
    { number: '72%', label: 'Tenants reporting deposit disputes' },
    { number: '30s', label: 'Average agreement AI review time' },
    { number: '100%', label: 'In-browser PDF parsing privacy' }
  ];

  return (
    <div className="py-12 md:py-20 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-xs font-semibold text-indigo-300 shadow-sm mb-5">
            <Scale className="w-3.5 h-3.5 text-indigo-400" />
            <span>Tenant Empowerment Project</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            About <span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">KirayaSaathi</span>
          </h1>

          <p className="mt-4 text-[#B8C4D6] text-base sm:text-lg leading-relaxed">
            Democratizing legal clarity and leveling the playing field for tenants navigating residential rental agreements across India.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-20">
          {stats.map((st, i) => (
            <div key={i} className="p-6 rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.2)] text-center shadow-lg">
              <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-1 font-mono">
                {st.number}
              </div>
              <div className="text-xs text-[#8FA0B8] font-medium leading-snug">
                {st.label}
              </div>
            </div>
          ))}
        </div>

        {/* The Story & Mission */}
        <div className="mb-24 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 text-cyan-300 text-xs font-semibold">
              <Globe2 className="w-3.5 h-3.5" /> The Problem We Are Solving
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Rental Agreements Shouldn't Require a Law Degree
            </h2>

            <p className="text-sm text-[#B8C4D6] leading-relaxed">
              In cities like Delhi, Bangalore, Pune, Mumbai, and Gurgaon, tenants often sign dense 11-month lease agreements under time pressure. These contracts frequently contain heavily one-sided clauses: non-refundable painting charges, arbitrary forfeiture of security deposits, 0-hour notice for landlord visits, and severe delay penalties.
            </p>

            <p className="text-sm text-[#B8C4D6] leading-relaxed">
              <strong>KirayaSaathi</strong> was created to give every tenant instant, automated contract intelligence. We parse the legal jargon, highlight clauses that need attention, and equip tenants with courteous negotiation scripts to request fair adjustments before signing.
            </p>

            <div className="pt-2 flex items-center gap-4">
              <Link
                to="/analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
              >
                <span>Try It Now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#142039] hover:bg-[#202F49] border border-[rgba(130,150,190,0.2)] text-[#E2E8F0] text-xs sm:text-sm font-bold transition-all"
              >
                <span>Read How It Works</span>
              </Link>
            </div>
          </div>

          {/* Core Values / Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 [perspective:1200px]">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 4, 6)}
                  onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
                  className="p-5 rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] flex flex-col justify-between group shadow-lg transition-all"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 mb-3 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-sm text-[#F8FAFC] mb-1.5">{val.title}</h3>
                    <p className="text-xs text-[#B8C4D6] leading-relaxed">{val.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technology & Privacy Architecture */}
        <div className="mb-20 p-8 sm:p-10 rounded-3xl bg-[#1B2942]/80 border border-[rgba(130,150,190,0.22)] shadow-2xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" /> Privacy & Tech Stack
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC]">
              Built with Modern, Safe Web Tech
            </h2>
            <p className="text-xs sm:text-sm text-[#B8C4D6] mt-1">
              Engineered for fast, reliable, client-first analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm text-[#B8C4D6]">
            <div className="p-5 rounded-2xl bg-[#142039]/90 border border-[rgba(130,150,190,0.18)]">
              <h4 className="font-bold text-sm text-[#F8FAFC] mb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" /> React 19 & Vite
              </h4>
              <p>Lightning-fast single page application with modern component architecture, smooth 3D tilt effects, and responsive design.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#142039]/90 border border-[rgba(130,150,190,0.18)]">
              <h4 className="font-bold text-sm text-[#F8FAFC] mb-2 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-cyan-400" /> Client-Side PDF.js
              </h4>
              <p>Extracts contract text directly in your browser without transmitting raw PDF files to cloud servers.</p>
            </div>
            <div className="p-5 rounded-2xl bg-[#142039]/90 border border-[rgba(130,150,190,0.18)]">
              <h4 className="font-bold text-sm text-[#F8FAFC] mb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Gemini 1.5 Flash AI
              </h4>
              <p>State-of-the-art legal comprehension model trained to identify ambiguous, non-standard, or unfair tenancy clauses.</p>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-[#1B2942] to-cyan-900/60 border border-indigo-500/30 text-center shadow-2xl">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] mb-3">
            Start protecting your tenancy rights today.
          </h3>
          <p className="text-sm text-[#B8C4D6] max-w-xl mx-auto mb-6">
            Review your rental agreement before you sign, or test with our sample agreements.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/analyze"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-0.5"
            >
              <Scale className="w-4 h-4" />
              <span>Go to Agreement Analyzer</span>
            </Link>
            <button
              type="button"
              onClick={onTryDemo}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all hover:-translate-y-0.5"
            >
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Try Demo Lease</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
