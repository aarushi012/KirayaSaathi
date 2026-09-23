import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Scale, Zap, Menu, X, ShieldCheck } from 'lucide-react';
import { getActiveApiKey } from '../services/aiService';

export default function Header({ 
  onReset, 
  onOpenKeyModal, 
  onTryDemo, 
  onOpenStatusModal, 
  onOpenDemoModal 
}) {
  const isLiveAI = Boolean(getActiveApiKey());
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  // Magnetic effect for Primary Analyze CTA
  const analyzeBtnRef = useRef(null);
  const [magneticOffset, setMagneticOffset] = useState({ x: 0, y: 0 });
  const [cursorGlow, setCursorGlow] = useState({ x: 50, y: 50, opacity: 0 });

  // Scroll detection for navbar elevation & opacity
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleAnalyzeMouseMove = (e) => {
    if (window.innerWidth < 768) return;
    const btn = analyzeBtnRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const moveX = ((x - rect.width / 2) / (rect.width / 2)) * 3.5;
    const moveY = ((y - rect.height / 2) / (rect.height / 2)) * 3.5;

    setMagneticOffset({ x: moveX, y: moveY });
    setCursorGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1
    });
  };

  const handleAnalyzeMouseLeave = () => {
    setMagneticOffset({ x: 0, y: 0 });
    setCursorGlow(prev => ({ ...prev, opacity: 0 }));
  };

  const navItems = [
    { id: 'home', label: 'Home', path: '/' },
    { id: 'analyze', label: 'Analyze', path: '/analyze' },
    { id: 'how-it-works', label: 'How It Works', path: '/how-it-works' },
    { id: 'features', label: 'Features', path: '/features' },
    { id: 'about', label: 'About', path: '/about' }
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#121D33]/95 backdrop-blur-xl border-b border-[rgba(130,150,190,0.18)] shadow-lg shadow-black/25 py-2 sm:py-2.5' 
          : 'bg-[#121D33]/80 backdrop-blur-md border-b border-[rgba(130,150,190,0.12)] py-3 sm:py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          
          {/* LOGO & BRAND SECTION */}
          <Link 
            to="/"
            onClick={() => {
              if (onReset) onReset();
            }}
            className="flex items-center gap-3 cursor-pointer group select-none transition-all duration-200 hover:-translate-y-[1px] active:scale-[0.98] shrink-0"
            aria-label="KirayaSaathi Home"
          >
            {/* Legal Scales Icon in Premium Rounded Square */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-b from-[#1B2942] to-[#142039] p-[1px] border border-indigo-500/30 group-hover:border-indigo-400/60 shadow-md shadow-black/30 group-hover:shadow-indigo-500/20 transition-all duration-200 shrink-0 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
              <Scale className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-200" />
            </div>

            {/* Brand Title & Supporting Info */}
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight leading-none text-[#F8FAFC] font-sans transition-colors duration-200">
                  Kiraya<span className="bg-gradient-to-r from-indigo-400 via-indigo-300 to-blue-400 bg-clip-text text-transparent group-hover:from-indigo-300 group-hover:to-cyan-300 transition-all duration-200">Saathi</span>
                </span>

                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 shadow-xs hidden xs:inline-flex">
                  AI Legal Assistant
                </span>
              </div>

              <p className="text-[11px] text-[#8FA0B8] font-medium tracking-normal mt-1 leading-none hidden sm:block">
                Tenant-First Contract Insights
              </p>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION ITEMS */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = item.path === '/' 
                ? location.pathname === '/' 
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.path === '/'}
                  className={`relative px-3.5 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors duration-200 group flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-[#F8FAFC]' 
                      : 'text-[#B8C4D6] hover:text-[#F8FAFC]'
                  }`}
                >
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" />
                  )}

                  <span>{item.label}</span>

                  <span 
                    className={`absolute bottom-0.5 left-3 right-3 h-[2px] rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 transition-transform duration-300 origin-center ${
                      isActive ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-75'
                    }`} 
                  />
                </NavLink>
              );
            })}
          </nav>

          {/* RIGHT ACTION CONTROLS */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* TRY DEMO BUTTON */}
            <button
              type="button"
              onClick={onOpenDemoModal || onTryDemo}
              title="Launch the 60-second hackathon demo with bundled sample agreement"
              className="relative inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-bold transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-amber-500/20 hover:-translate-y-0.5 active:scale-95 group cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 group-hover:scale-125 group-hover:rotate-6 transition-transform duration-200 fill-amber-400/20" />
              <span>Try Demo</span>
            </button>

            {/* DEMO ENGINE / LIVE AI STATUS PILL */}
            <div className="relative hidden sm:block">
              <button
                type="button"
                onClick={onOpenStatusModal || onOpenKeyModal}
                onMouseEnter={() => setShowStatusTooltip(true)}
                onMouseLeave={() => setShowStatusTooltip(false)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl border text-xs font-semibold transition-all duration-200 active:scale-95 cursor-pointer ${
                  isLiveAI 
                    ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-200 hover:bg-emerald-500/25 hover:border-emerald-500/50' 
                    : 'bg-[#1B2942]/90 border-[rgba(130,150,190,0.2)] text-[#E2E8F0] hover:bg-[#202F49] hover:border-[rgba(130,150,190,0.35)]'
                }`}
              >
                {isLiveAI ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-dotLiveBreathing" />
                    <span>Live Gemini AI</span>
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-dotBreathing" />
                    <span>Demo Engine</span>
                  </>
                )}
              </button>

              {showStatusTooltip && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 rounded-lg bg-[#1B2942] border border-[rgba(130,150,190,0.25)] text-[11px] text-[#E2E8F0] shadow-xl backdrop-blur-md whitespace-nowrap z-50 pointer-events-none animate-fadeIn">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3 h-3 text-cyan-400" />
                    <span>{isLiveAI ? 'Live Gemini 1.5 Flash AI active • Click to inspect' : 'Demo mode ready • Click to inspect status'}</span>
                  </div>
                </div>
              )}
            </div>

            {/* PRIMARY "ANALYZE" CTA */}
            <button
              ref={analyzeBtnRef}
              type="button"
              onClick={() => navigate('/analyze')}
              onMouseMove={handleAnalyzeMouseMove}
              onMouseLeave={handleAnalyzeMouseLeave}
              style={{
                transform: `translate3d(${magneticOffset.x}px, ${magneticOffset.y}px, 0)`
              }}
              className="relative inline-flex items-center justify-center px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 border border-indigo-400/30 shadow-md shadow-indigo-600/30 hover:shadow-xl hover:shadow-indigo-600/50 transition-all duration-200 active:scale-[0.97] overflow-hidden group cursor-pointer"
            >
              <div 
                className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                style={{
                  background: `radial-gradient(circle 40px at ${cursorGlow.x}% ${cursorGlow.y}%, rgba(255,255,255,0.25), transparent)`,
                  opacity: cursorGlow.opacity
                }}
              />
              <div className="absolute top-0 bottom-0 w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-sweep" />

              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 text-indigo-200 group-hover:text-cyan-100 group-hover:rotate-12 group-hover:scale-110 transition-transform duration-200" />
              <span className="relative z-10">Analyze</span>
            </button>

            {/* MOBILE MENU TOGGLE BUTTON */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-[#1B2942] border border-[rgba(130,150,190,0.2)] text-[#B8C4D6] hover:text-white transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>

          </div>

        </div>

        {/* MOBILE NAVIGATION DRAWER */}
        {isMobileMenuOpen && (
          <div className="md:hidden pt-3 pb-4 border-t border-[rgba(130,150,190,0.15)] animate-drawer space-y-3">
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const isActive = item.path === '/' 
                  ? location.pathname === '/' 
                  : location.pathname.startsWith(item.path);

                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-between ${
                      isActive 
                        ? 'bg-indigo-600/25 text-indigo-200 border border-indigo-500/35' 
                        : 'text-[#B8C4D6] hover:bg-[#1B2942]'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </Link>
                );
              })}
            </div>

            <div className="pt-2 border-t border-[rgba(130,150,190,0.12)] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenStatusModal) onOpenStatusModal();
                  else if (onOpenKeyModal) onOpenKeyModal();
                }}
                className="flex-1 py-2 rounded-lg bg-[#1B2942] border border-[rgba(130,150,190,0.2)] text-[#E2E8F0] text-xs font-semibold text-center"
              >
                {isLiveAI ? '🟢 Live Gemini AI' : '🟡 Demo Engine'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenDemoModal) onOpenDemoModal();
                  else if (onTryDemo) onTryDemo();
                }}
                className="flex-1 py-2 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold text-center flex items-center justify-center gap-1"
              >
                <Zap className="w-3.5 h-3.5 fill-amber-300" />
                <span>Try Demo</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}