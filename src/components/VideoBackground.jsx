import React, { useEffect, useRef, useState } from 'react';

export default function VideoBackground() {
  const videoRef = useRef(null);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setIsReducedMotion(true);
    }

    const videoEl = videoRef.current;
    if (videoEl && !prefersReducedMotion) {
      videoEl.muted = true;
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Video autoplay prevented or not supported:', err);
        });
      }
    }
  }, []);

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden select-none z-0"
    >
      {/* 1. Underlying Base Background Layer */}
      <div className="absolute inset-0 bg-[#121D33]" />

      {/* 2. Global Full-Screen Video Background */}
      {!hasError && (
        <video
          ref={videoRef}
          src="/background-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          onError={() => setHasError(true)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            isReducedMotion ? 'opacity-25' : 'opacity-65'
          }`}
          style={{
            filter: 'contrast(1.04) brightness(0.92)',
            transform: 'scale(1.02)'
          }}
        />
      )}

      {/* 3. Soft Deep Navy Blue-Gray Semi-Transparent Overlay for Readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#121D33]/85 via-[#17243B]/75 to-[#121D33]/90" />
      
      {/* 4. Subtle Legal-Tech Blue/Indigo Ambient Lighting Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(99,102,241,0.14),rgba(18,29,51,0)_70%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_80%_90%,rgba(45,212,191,0.08),rgba(18,29,51,0)_60%)]" />
    </div>
  );
}
