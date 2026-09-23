import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, FileText, CheckCircle2, ShieldCheck, Scale } from 'lucide-react';

export default function HeroBackgroundAtmosphere() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Handle subtle mouse movement for 2-5px parallax
  useEffect(() => {
    let animationFrameId;

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2; // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2; // -1 to 1

      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(() => {
        setMousePos({ x: x * 6, y: y * 6 });
      });
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Lightweight AI Data Flow Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Subtle Particle Stream (Document -> AI -> Insights)
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 14 : 26;
    
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: Math.random() * 0.4 + 0.15, // Slow downward flow
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.4 + 0.1,
      color: Math.random() > 0.4 ? 'rgba(99, 102, 241,' : 'rgba(34, 211, 238,'
    }));

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(canvas);

    let animationId;
    const render = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint connective lines between proximate particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around boundaries
        if (p.y > height) {
          p.y = -5;
          p.x = Math.random() * width;
        }
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(99, 102, 241, 0.5)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10"
    >
      {/* 1. LAYER: Ambient Glowing Color Orbs */}
      <div 
        className="absolute top-[-10%] left-[20%] w-[500px] sm:w-[700px] h-[400px] sm:h-[500px] bg-indigo-600/12 rounded-full blur-[140px] transition-transform duration-700 ease-out animate-pulseSlow"
        style={{
          transform: `translate3d(${mousePos.x * -1.5}px, ${mousePos.y * -1.5}px, 0)`
        }}
      />
      <div 
        className="absolute top-[25%] right-[-5%] w-[350px] sm:w-[550px] h-[350px] sm:h-[500px] bg-cyan-500/10 rounded-full blur-[120px] transition-transform duration-700 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 2}px, ${mousePos.y * 2}px, 0)`
        }}
      />
      <div 
        className="absolute bottom-[-10%] left-[5%] w-[400px] h-[300px] bg-purple-600/10 rounded-full blur-[110px]" 
      />

      {/* 2. LAYER: Subtle Background Tech Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.2) 1px, transparent 1px)`,
          backgroundSize: '48px 48px'
        }}
      />

      {/* 3. LAYER: AI Data Flow Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-70"
      />

      {/* 4. LAYER: AI Horizontal / Diagonal Scanning Beam */}
      <div className="absolute inset-0 opacity-40 overflow-hidden">
        <div className="absolute -left-[50%] -right-[50%] h-[1px] bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent shadow-[0_0_20px_2px_rgba(34,211,238,0.4)] animate-heroScan" />
      </div>

      {/* 5. LAYER: Abstract Apartment & Property Building Silhouettes (Far Horizon) */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-44 sm:h-56 opacity-[0.06] flex items-end justify-between px-2 sm:px-12 pointer-events-none transition-transform duration-1000 ease-out"
        style={{
          transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.4}px, 0)`
        }}
      >
        <svg
          viewBox="0 0 1440 220"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full preserve-3d"
        >
          {/* Minimalist modern architectural geometric silhouettes */}
          {/* Building 1 (Left High-rise) */}
          <rect x="40" y="40" width="90" height="180" rx="2" fill="#818CF8" />
          <line x1="55" y1="60" x2="115" y2="60" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="55" y1="85" x2="115" y2="85" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="55" y1="110" x2="115" y2="110" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="55" y1="135" x2="115" y2="135" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="55" y1="160" x2="115" y2="160" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />

          {/* Building 2 (Mid-rise complex) */}
          <rect x="145" y="90" width="130" height="130" rx="2" fill="#6366F1" />
          <line x1="160" y1="115" x2="260" y2="115" stroke="#94A3B8" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="160" y1="140" x2="260" y2="140" stroke="#94A3B8" strokeWidth="2" strokeDasharray="8 6" />
          <line x1="160" y1="165" x2="260" y2="165" stroke="#94A3B8" strokeWidth="2" strokeDasharray="8 6" />

          {/* Building 3 (Center residential tower) */}
          <rect x="620" y="30" width="110" height="190" rx="2" fill="#4F46E5" />
          <circle cx="675" cy="50" r="4" fill="#38BDF8" opacity="0.8" />
          <line x1="635" y1="75" x2="715" y2="75" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="7 7" />
          <line x1="635" y1="105" x2="715" y2="105" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="7 7" />
          <line x1="635" y1="135" x2="715" y2="135" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="7 7" />
          <line x1="635" y1="165" x2="715" y2="165" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="7 7" />

          {/* Building 4 (Right skyline) */}
          <rect x="1180" y="60" width="100" height="160" rx="2" fill="#818CF8" />
          <rect x="1295" y="110" width="110" height="110" rx="2" fill="#6366F1" />
          <line x1="1195" y1="85" x2="1265" y2="85" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1195" y1="115" x2="1265" y2="115" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
          <line x1="1195" y1="145" x2="1265" y2="145" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
        </svg>
      </div>

      {/* 6. LAYER: Floating Glassmorphic Rental Agreement Document Cards */}
      {/* Document 1: Top-Left Floating Lease Summary (Desktop Only, Low Opacity) */}
      <div
        className="hidden xl:block absolute top-[12%] left-[4%] w-60 p-4 rounded-2xl bg-slate-900/40 border border-slate-700/40 backdrop-blur-md shadow-2xl transition-transform duration-700 ease-out animate-floatSlow opacity-35 hover:opacity-75"
        style={{
          transform: `translate3d(${mousePos.x * -1.8}px, ${mousePos.y * -1.8}px, 0) rotate(-4deg)`
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-slate-700/50">
          <div className="flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">RENTAL AGREEMENT</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">
            VALIDATED
          </span>
        </div>
        <div className="mt-2.5 space-y-1.5 text-[10px]">
          <div className="flex justify-between text-slate-400">
            <span>Monthly Rent</span>
            <span className="font-semibold text-slate-200">₹15,000</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Security Deposit</span>
            <span className="font-semibold text-slate-200">₹50,000</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Lock-in Period</span>
            <span className="font-semibold text-slate-200">11 Months</span>
          </div>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-indigo-300">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-cyan-400" />
            AI Parser
          </span>
          <span className="text-emerald-400 font-semibold">✓ 8 Clauses</span>
        </div>
      </div>

      {/* Document 2: Bottom-Right Abstract Tenancy Covenants Card */}
      <div
        className="hidden xl:block absolute bottom-[8%] right-[3%] w-64 p-4 rounded-2xl bg-slate-900/35 border border-indigo-500/20 backdrop-blur-md shadow-2xl transition-transform duration-700 ease-out animate-floatReverse opacity-30 hover:opacity-75"
        style={{
          transform: `translate3d(${mousePos.x * 2.2}px, ${mousePos.y * 2.2}px, 0) rotate(3deg)`
        }}
      >
        <div className="flex items-center justify-between pb-2 border-b border-indigo-500/20">
          <div className="flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">TENANCY COVENANTS</span>
          </div>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 font-bold">
            CHECKED
          </span>
        </div>
        <div className="mt-2.5 space-y-1 text-[10px] text-slate-400">
          <p className="truncate">✓ Notice Period: 2 Months standard</p>
          <p className="truncate">✓ Fair Maintenance Allocation</p>
          <p className="text-amber-300/90 font-medium truncate">⚠ Landlord Entry: 24h Notice required</p>
        </div>
        <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[9px] text-slate-400">
          <span>Tenant Rights Benchmarked</span>
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>

      {/* 7. LAYER: Subtle Ambient Floating AI Node / Badge (Center-Upper Background) */}
      <div 
        className="hidden md:flex absolute top-[6%] left-1/2 -translate-x-1/2 items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/30 border border-indigo-500/20 text-[10px] font-mono text-indigo-300/70 backdrop-blur-sm opacity-50 transition-transform duration-1000"
        style={{
          transform: `translate3d(calc(-50% + ${mousePos.x * 0.8}px), ${mousePos.y * 0.8}px, 0)`
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span>NEURAL CLAUSE ENGINE ACTIVE • 2026 BENCHMARK</span>
      </div>

      {/* 8. LAYER: Dark Readability Radial Gradient Mask for Crisp Hero Content */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 via-slate-900/65 to-slate-900" />
      <div className="absolute inset-0 bg-radial-vignette opacity-70" />
    </div>
  );
}
