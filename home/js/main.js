
/* Smooth scroll for internal anchor links + subtle petal parallax */
document.addEventListener('DOMContentLoaded', () => {
  // --- Smooth scroll for #anchors ---
  const links = document.querySelectorAll('a[href^="#"]');
  links.forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href').slice(1);
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL hash without jumping
        history.replaceState(null, '', `#${targetId}`);
      }
    });
  });

  // If user loads a direct hash (e.g., /index.html#works), nudge to section
  const initialHash = window.location.hash;
  if (initialHash) {
    const targetEl = document.querySelector(initialHash);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // --- Subtle parallax on petals ---
  // Select all decorative petal wrappers (SVG or PNG supported)
  const petals = document.querySelectorAll('.petal');

  // Base rotations should match your CSS (.p1/.p2/.p3)
  // Update these if you change angles in CSS
  const baseRotations = ['-12deg', '24deg', '-8deg'];

  // Throttle scroll handler for performance
  let ticking = false;
  const handleScroll = () => {
    const y = window.scrollY || window.pageYOffset;

    petals.forEach((p, i) => {
      // Different speeds per petal for depth effect
      const speedY = 0.02 + i * 0.01;   // 0.02, 0.03, 0.04
      const speedX = 0.01 + i * 0.005;  // 0.01, 0.015, 0.02

      // Combine translate with base rotation to preserve initial angle
      p.style.transform = `translate3d(${y * speedX}px, ${y * speedY}px, 0) rotate(${baseRotations[i] || '0deg'})`;
    });
    ticking = false;
  };

  const onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  };

  // Kick off once and then listen
  handleScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // --- Respect users who prefer reduced motion ---
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const disableParallax = () => {
    if (prefersReduced.matches) {
      window.removeEventListener('scroll', onScroll);
      petals.forEach(p => { p.style.transform = ''; }); // revert to CSS-only positioning
    }
  };
  disableParallax();
  // Some browsers support 'change' event on media queries
  prefersReduced.addEventListener?.('change', disableParallax);

  // --- Optional: slight mouse sway (comment out if not desired) ---
  // Moves petals a tiny bit based on pointer position
  // document.addEventListener('pointermove', (e) => {
  //   const { innerWidth: w, innerHeight: h } = window;
  //   const nx = (e.clientX / w - 0.5);
  //   const ny = (e.clientY / h - 0.5);
  //   petals.forEach((p, i) => {
  //     const sway = 2 + i; // different amplitude
  //     p.style.transition = 'transform 0.08s ease-out';
  //     p.style.transform += ` translate(${nx * sway}px, ${ny * sway}px)`;
  //   });
  // });
});
