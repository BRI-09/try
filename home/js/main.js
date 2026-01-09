
/* Smooth scroll for internal anchor links + subtle petal parallax */
document.addEventListener('DOMContentLoaded', () => {
  // --- Smooth scroll ---
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        history.replaceState(null, '', `#${targetId}`);
      }
    });
  });

  // --- Subtle parallax on petals (Option 3) ---
  const petals = document.querySelectorAll('.petal');

  // If you want to preserve the base rotations defined in CSS (.p1/.p2/.p3),
  // specify them here and combine with translate in the transform:
  const baseRotations = ['-12deg', '24deg', '-8deg']; // for .p1, .p2, .p3 respectively

  const handleScroll = () => {
    const y = window.scrollY || window.pageYOffset;

    petals.forEach((p, i) => {
      // Different speed per petal for depth effect
      const speedY = 0.02 + i * 0.01; // vertical drift: 0.02, 0.03, 0.04
      const speedX = 0.01 + i * 0.005; // slight horizontal drift: 0.01, 0.015, 0.02

      // Combine translate with the base rotation so initial angle is kept
      p.style.transform = `translate3d(${y * speedX}px, ${y * speedY}px, 0) rotate(${baseRotations[i] || '0deg'})`;
    });
  };

  // Run once and on scroll
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Respect users who prefer reduced motion
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disableParallax = () => {
    if (prefersReduced.matches) {
      window.removeEventListener('scroll', handleScroll);
      petals.forEach(p => { p.style.transform = ''; }); // revert to CSS-only positioning
    }
  };
  disableParallax();
  prefersReduced.addEventListener?.('change', disableParallax); // Safari may not support this; it's OK
});
