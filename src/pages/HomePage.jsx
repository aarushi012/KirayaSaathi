import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import UploadSection from '../components/UploadSection';
import { 
  ArrowRight, 
  BookOpen, 
  Sparkles, 
  Zap, 
  ShieldCheck, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  MessagesSquare, 
  Scale,
  MapPin
} from 'lucide-react';
import { apply3DTilt, reset3DTilt } from '../utils/tilt3d';

export default function HomePage({
  onFileSelected,
  onSampleSelected,
  onTextSubmit,
  onTryDemo,
  isProcessing,
  uploadError,
  onClearError,
  selectedStateId,
  onSelectState,
  setIsDemoModalOpen
}) {
  const navigate = useNavigate();

  const highlightCards = [
    {
      title: 'Analyze Your Agreement',
      desc: 'Upload lease PDF or paste clauses for instant AI analysis, risk scoring, and state law compliance.',
      icon: UploadCloud,
      badge: 'Interactive Workspace',
      badgeColor: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/25',
      link: '/analyze',
      buttonText: 'Open Dedicated Analyzer',
      topBar: 'from-indigo-500 to-indigo-600'
    },
    {
      title: 'How It Works Guide',
      desc: 'Understand the 4-step AI legal decomposition pipeline and read Indian Tenancy Law FAQs.',
      icon: BookOpen,
      badge: 'Step-by-Step Flow',
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
      link: '/how-it-works',
      buttonText: 'Explore Process',
      topBar: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'AI Protection Features',
      desc: 'Clause translation, unfair red flag detection, WhatsApp negotiation scripts, and safety scorecard.',
      icon: Sparkles,
      badge: 'Tenant Intelligence',
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
      link: '/features',
      buttonText: 'View All Features',
      topBar: 'from-amber-500 to-orange-500'
    }
  ];

  const quickSteps = [
    { num: '01', title: 'Upload Agreement', desc: 'Secure in-browser PDF extraction.' },
    { num: '02', title: 'AI Clause Parsing', desc: 'Decomposes 8+ standard lease categories.' },
    { num: '03', title: 'Red Flag Detection', desc: 'Surfaces unfair deductions and 0-notice terms.' },
    { num: '04', title: 'Negotiation Scripts', desc: 'Polite, copy-paste ready counter-offers.' }
  ];

  const handleScrollToAnalyzer = () => {
    const el = document.getElementById('analyze');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/analyze');
    }
  };

  return (
    <div className="animate-fadeIn">
      {/* 1. Hero Section */}
      <HeroSection
        onAnalyzeClick={handleScrollToAnalyzer}
        onHowItWorksClick={() => navigate('/how-it-works')}
        onTryDemo={onTryDemo}
      />

      {/* 2. Upload / Analyzer Section Right on Home */}
      <UploadSection
        onFileSelected={onFileSelected}
        onSampleSelected={onSampleSelected}
        onTextSubmit={onTextSubmit}
        onTryDemo={onTryDemo}
        isProcessing={isProcessing}
        externalError={uploadError}
        onClearError={onClearError}
        selectedStateId={selectedStateId}
        onSelectState={onSelectState}
      />

      {/* 3. Main Navigation Hub / 3 Page Cards */}
      <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Explore All Capabilities
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC]">
            Everything You Need Before Signing
          </h2>
          <p className="text-xs sm:text-sm text-[#B8C4D6] mt-2">
            Click into any page below to explore dedicated tools, guides, and features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 [perspective:1200px]">
          {highlightCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onMouseMove={(e) => apply3DTilt(e, e.currentTarget, 4, 6)}
                onMouseLeave={(e) => reset3DTilt(e.currentTarget)}
                className="p-6 sm:p-7 rounded-2xl bg-[#1B2942]/90 border border-[rgba(130,150,190,0.22)] hover:border-indigo-500/40 flex flex-col justify-between group shadow-xl transition-all relative overflow-hidden"
              >
                <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${card.topBar}`} />
                
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-[#142039] border border-[rgba(130,150,190,0.2)] flex items-center justify-center text-indigo-400 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${card.badgeColor}`}>
                      {card.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#F8FAFC] mb-2 group-hover:text-indigo-200 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B8C4D6] leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                <Link
                  to={card.link}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#142039] hover:bg-indigo-600 border border-[rgba(130,150,190,0.2)] hover:border-indigo-500 text-xs font-bold text-[#E2E8F0] hover:text-white flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <span>{card.buttonText}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. 4-Step Process Strip */}
      <section className="py-12 bg-[#17243B]/60 border-y border-[rgba(130,150,190,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Fast & Transparent</span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-[#F8FAFC]">How KirayaSaathi Works in 4 Steps</h3>
            </div>
            <Link
              to="/how-it-works"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/30 text-indigo-200 text-xs font-bold transition-all"
            >
              <span>View In-Depth How It Works Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickSteps.map((s, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#142039]/80 border border-[rgba(130,150,190,0.18)]">
                <div className="text-xs font-mono font-bold text-cyan-400 mb-1">STEP {s.num}</div>
                <div className="text-sm font-bold text-[#F8FAFC] mb-1">{s.title}</div>
                <div className="text-xs text-[#8FA0B8]">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. State Jurisdiction Banner */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1B2942] via-[#17243B] to-[#142039] border border-[rgba(130,150,190,0.22)] flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#F8FAFC]">Multi-Jurisdiction Indian Tenancy Intelligence</h4>
              <p className="text-xs sm:text-sm text-[#B8C4D6] mt-1 max-w-xl">
                Trained on rental regulations across Delhi NCR, Karnataka (Bangalore), Maharashtra (Pune/Mumbai), Haryana, and Punjab.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
            <Link
              to="/features"
              className="w-full md:w-auto text-center px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-all"
            >
              Compare State Laws
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
