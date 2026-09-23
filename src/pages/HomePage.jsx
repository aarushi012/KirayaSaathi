import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import UploadSection from '../components/UploadSection';
import HowItWorks from '../components/HowItWorks';
import FeaturesSection from '../components/FeaturesSection';
import AboutSection from '../components/AboutSection';
import { ArrowRight, BookOpen, Sparkles, Zap, ShieldCheck } from 'lucide-react';

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

  return (
    <div className="animate-fadeIn">
      {/* Hero Section */}
      <HeroSection
        onAnalyzeClick={() => {
          const el = document.getElementById('analyze');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
          else navigate('/analyze');
        }}
        onHowItWorksClick={() => navigate('/how-it-works')}
        onTryDemo={() => setIsDemoModalOpen(true)}
      />

      {/* Upload / Analyzer Section */}
      <UploadSection
        onFileSelected={onFileSelected}
        onSampleSelected={onSampleSelected}
        onTextSubmit={onTextSubmit}
        onTryDemo={() => setIsDemoModalOpen(true)}
        isProcessing={isProcessing}
        externalError={uploadError}
        onClearError={onClearError}
        selectedStateId={selectedStateId}
        onSelectState={onSelectState}
      />

      {/* Quick Interactive Preview of How It Works */}
      <div className="relative">
        <HowItWorks />
        <div className="text-center py-6 bg-[#17243B]/70 border-b border-[rgba(130,150,190,0.18)]">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/35 border border-indigo-500/40 text-indigo-200 text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <span>Read Complete How It Works & Legal FAQ Guide</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>
      </div>

      {/* Quick Interactive Preview of Features */}
      <div className="relative">
        <FeaturesSection />
        <div className="text-center py-6 border-b border-[rgba(130,150,190,0.15)]">
          <Link
            to="/features"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/35 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <span>Explore All AI Features & State Law Comparer</span>
            <ArrowRight className="w-4 h-4 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* About Summary Section */}
      <div className="relative">
        <AboutSection />
        <div className="text-center py-6 bg-[#17243B]/80 border-b border-[rgba(130,150,190,0.18)]">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#1B2942] hover:bg-[#202F49] border border-[rgba(130,150,190,0.25)] text-[#E2E8F0] text-xs sm:text-sm font-bold transition-all hover:-translate-y-0.5"
          >
            <span>Learn More About Our Mission & Architecture</span>
            <ArrowRight className="w-4 h-4 text-indigo-400" />
          </Link>
        </div>
      </div>
    </div>
  );
}
