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
        history.replaceState(null, '', `#${targetId}`);
      }
    });
  });

  // --- Subtle parallax on petals ---
  const petals = document.querySelectorAll('.petal');
  const baseRotations = ['-12deg', '24deg', '-8deg'];

  let ticking = false;
  const handleScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    petals.forEach((p, i) => {
      const speedY = 0.02 + i * 0.01;
      const speedX = 0.01 + i * 0.005;
      p.style.transform = `translate3d(${y * speedX}px, ${y * speedY}px, 0) rotate(${baseRotations[i] || '0deg'})`;
    });
    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  // --- Works Slider Logic ---
  (function(){
    const slider = document.getElementById('works-slider');
    if (!slider) return;

    const viewport = slider.querySelector('.works-slider__viewport');
    const track = slider.querySelector('.works-slider__track');
    const slides = Array.from(slider.querySelectorAll('.works-slide'));
    const btnPrev = slider.querySelector('.slider-btn.prev');
    const btnNext = slider.querySelector('.slider-btn.next');
    const dotsWrap = slider.querySelector('.works-slider__dots');

    let index = 0;
    const last = slides.length - 1;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    });

    const dots = Array.from(dotsWrap.querySelectorAll('button'));

    function update(){
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach((d, i) => d.setAttribute('aria-selected', i === index ? 'true' : 'false'));
      btnPrev.disabled = (index === 0);
      btnNext.disabled = (index === last);
    }

    function goTo(i){ index = Math.max(0, Math.min(last, i)); update(); }
    btnPrev.addEventListener('click', () => goTo(index - 1));
    btnNext.addEventListener('click', () => goTo(index + 1));
    update();
  })();
});