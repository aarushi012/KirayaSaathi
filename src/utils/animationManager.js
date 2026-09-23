/**
 * animationManager.js
 * Centralized Section Animation & Transition Controller
 * Allows any navbar item, button, or CTA to smoothly scroll and replay
 * entrance and staggered animations without "play-only-once" restrictions.
 */

export function playSectionAnimation(sectionId) {
  if (!sectionId) return;
  const cleanId = sectionId.replace('#', '');

  // 1. Dispatch event to reset and replay React internal state & keyframe stagger
  window.dispatchEvent(
    new CustomEvent('replay-section-animation', { 
      detail: { sectionId: cleanId, timestamp: Date.now() } 
    })
  );

  // 2. Smooth scroll to destination
  const element = document.getElementById(cleanId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });

    // 3. Highlight pulse animation on section container/wrapper (NOT hijacking single child cards)
    const targetCard = element.querySelector('[data-section-card]') || element;
    if (targetCard) {
      targetCard.classList.remove('section-highlight-active');
      void targetCard.offsetWidth; // Force browser reflow to restart CSS animation
      targetCard.classList.add('section-highlight-active');

      setTimeout(() => {
        targetCard.classList.remove('section-highlight-active');
      }, 1500);
    }
  }
}
