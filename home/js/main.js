
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

  // ----------------------------------------------------------------
  // --- Works Slider (Other Works) ---
  // ----------------------------------------------------------------
  (function(){
    const slider = document.getElementById('works-slider');
    if (!slider) return; // exit if slider HTML isn't present

    const viewport = slider.querySelector('.works-slider__viewport');
    const track = slider.querySelector('.works-slider__track');
    const slides = Array.from(slider.querySelectorAll('.works-slide'));
    const btnPrev = slider.querySelector('.slider-btn.prev');
    const btnNext = slider.querySelector('.slider-btn.next');
    const dotsWrap = slider.querySelector('.works-slider__dots');

    let index = 0;
    const last = slides.length - 1;

    // Create dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Перейти к слайду ${i+1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    function update(){
      track.style.transition = 'transform .35s ease';
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
      // Optional disabled states:
      btnPrev.disabled = (index === 0);
      btnNext.disabled = (index === last);
    }

    function goTo(i){
      index = Math.max(0, Math.min(last, i));
      update();
    }
    function next(){ goTo(index + 1); }
    function prev(){ goTo(index - 1); }

    // Init
    update();

    // Clicks
    btnPrev.addEventListener('click', prev);
    btnNext.addEventListener('click', next);

    // Keyboard (left/right)
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
    });

    // Make viewport focusable for keyboard navigation
    viewport.setAttribute('tabindex', '0');

    // Swipe / drag (pointer + touch)
    let startX = 0, dx = 0, dragging = false;

    const onDown = (e) => {
      dragging = true;
      startX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      track.style.transition = 'none';
    };
    const onMove = (e) => {
      if (!dragging) return;
      const x = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
      dx = x - startX;
      const width = viewport.clientWidth;
      const percent = (dx / width) * 100;
      track.style.transform = `translateX(calc(-${index * 100}% + ${percent}%))`;
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      track.style.transition = 'transform .35s ease';
      const width = viewport.clientWidth;
      if (Math.abs(dx) > width * 0.2) {
        if (dx < 0) next(); else prev();
      } else {
        update();
      }
      dx = 0;
    };

    viewport.addEventListener('pointerdown', onDown);
    viewport.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    viewport.addEventListener('touchstart', onDown, { passive: true });
    viewport.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);

    // --- Optional: Auto-play with pause on hover ---
    // let auto = setInterval(next, 4000);
    // slider.addEventListener('mouseenter', () => { clearInterval(auto); });
    // slider.addEventListener('mouseleave', () => { auto = setInterval(next, 4000); });
  })();

});
