/**
 * Animations.js — Animações leves e performance-first
 * Usa Intersection Observer para reveal, e CSS transitions para interações.
 */

class SiteLucasAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupReveal();
    this.setupSmoothScroll();
    this.setupPriceAnimation();
  }

  setupReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseFloat(el.dataset.revealDelay) || 0;
          setTimeout(() => {
            el.classList.add('revealed');
            observer.unobserve(el);
          }, delay * 1000);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href) return;
        if (href === '#' || href.length <= 1) {
          e.preventDefault();
          return;
        }

        try {
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            const offsetTop = target.offsetTop - 70;
            window.scrollTo({
              top: offsetTop,
              behavior: 'smooth'
            });
          }
        } catch (err) {
          // Ignora seletores inválidos e mantém navegação padrão segura
        }
      });
    });
  }

  setupPriceAnimation() {
    // Animação do preço quando o valor muda
    const display = document.getElementById('price-display');
    if (!display) return;

    let lastValue = null;

    const observer = new MutationObserver(() => {
      const currentValue = display.textContent;
      if (currentValue !== lastValue) {
        display.classList.add('price-changed');
        setTimeout(() => {
          display.classList.remove('price-changed');
        }, 500);
        lastValue = currentValue;
      }
    });

    observer.observe(display, { childList: true, subtree: true });
  }

  // Anima contador de forma fluida
  animateCount(element, start, end, duration = 1000) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (startTimestamp === null) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const value = Math.floor(progress * (end - start) + start);
      element.textContent = value.toLocaleString('pt-BR');
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }
}

// Parallax suave no hero (desktop only, com throttle via requestAnimationFrame)
class Parallax {
  constructor() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isDesktop = !prefersReducedMotion && window.matchMedia('(hover: hover)').matches && !window.matchMedia('(max-width: 768px)').matches;
    if (!this.isDesktop) return;
    this.init();
  }

  init() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const bg = hero.querySelector('.hero-bg-img');
    if (!bg) return;

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          if (scrolled <= hero.offsetHeight) {
            const rate = scrolled * 0.25;
            bg.style.transform = `translate3d(0, ${rate}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

// Lazy loading de imagens
class LazyLoad {
  constructor() {
    if ('IntersectionObserver' in window) {
      this.init();
    }
  }

  init() {
    const images = document.querySelectorAll('img[data-src]');
    if (!images.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
          }
          imageObserver.unobserve(img);
        }
      });
    }, { rootMargin: '50px' });

    images.forEach(img => imageObserver.observe(img));
  }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
  new SiteLucasAnimations();
  new Parallax();
  new LazyLoad();
});
