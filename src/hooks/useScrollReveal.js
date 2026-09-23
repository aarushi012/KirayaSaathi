import { useState, useEffect, useRef } from 'react';

export function useScrollReveal(sectionId = null, options = {}) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px' } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [animKey, setAnimKey] = useState(0);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    // Check if element is already in viewport on mount (e.g. Hero section or mid-page refresh)
    const checkInitial = () => {
      const rect = el.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top < windowHeight * 0.85 && rect.bottom > 0) {
        setIsVisible(true);
      }
    };
    checkInitial();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(el);

    const handleReplay = (e) => {
      if (!sectionId || e.detail?.sectionId === sectionId) {
        setIsVisible(false);
        setTimeout(() => {
          setAnimKey((prev) => prev + 1);
          setIsVisible(true);
        }, 50);
      }
    };

    window.addEventListener('replay-section-animation', handleReplay);

    return () => {
      observer.disconnect();
      window.removeEventListener('replay-section-animation', handleReplay);
    };
  }, [sectionId, threshold, rootMargin]);

  return { ref: sectionRef, isVisible, animKey };
}
