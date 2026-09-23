/**
 * Lightweight, GPU-accelerated interactive 3D perspective tilt utility.
 * Applies smooth rotateX, rotateY, and translateZ based on cursor position.
 */
export function apply3DTilt(e, element, maxAngle = 4.5, translateZ = 8) {
  if (!element || (typeof window !== 'undefined' && window.innerWidth < 768)) return;
  
  // Respect reduced motion
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const rect = element.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5

  const rotX = (-y * maxAngle).toFixed(2);
  const rotY = (x * maxAngle).toFixed(2);

  element.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(${translateZ}px)`;
  
  // Optional glare reflection calculation
  const glareEl = element.querySelector('.card-glare-overlay');
  if (glareEl) {
    const glareX = ((x + 0.5) * 100).toFixed(1);
    const glareY = ((y + 0.5) * 100).toFixed(1);
    glareEl.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.07) 0%, transparent 60%)`;
    glareEl.style.opacity = '1';
  }
}

export function reset3DTilt(element) {
  if (!element) return;
  element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
  const glareEl = element.querySelector('.card-glare-overlay');
  if (glareEl) {
    glareEl.style.opacity = '0';
  }
}
