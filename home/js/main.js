
/* Smooth scroll for internal anchor links */
document.addEventListener('DOMContentLoaded', () => {
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

  // Optional: simple parallax on petals (subtle)
  const petals = document.querySelectorAll('.petal');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    petals.forEach((p, i) => {
      const speed = (i + 1) * 0.02;
      p.style.transform = `translateY(${y * speed}px)`; // keeps existing rotate via CSS
    });
  });
});
