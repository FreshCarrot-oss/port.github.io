/* ============================================
   FC STUDIO — MAIN JS (cursor removed)
   Lang toggle, scroll reveal, nav, counters
   ============================================ */

(function () {
  'use strict';

  // ---- LANGUAGE ----
  const Lang = {
    current: localStorage.getItem('fc_lang') || 'ru',

    init() {
      this.apply(this.current, false);
      const btn = document.getElementById('langToggle');
      if (btn) btn.addEventListener('click', () => {
        this.current = this.current === 'ru' ? 'en' : 'ru';
        localStorage.setItem('fc_lang', this.current);
        this.apply(this.current, true);
      });
    },

    apply(lang, animate) {
      const btn = document.getElementById('langToggle');
      if (btn) {
        btn.querySelector('.lang-ru').classList.toggle('active', lang === 'ru');
        btn.querySelector('.lang-en').classList.toggle('active', lang === 'en');
      }
      document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';

      document.querySelectorAll('[data-ru],[data-en]').forEach(el => {
        const text = el.getAttribute('data-' + lang);
        if (!text) return;
        if (animate) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(4px)';
          el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          setTimeout(() => {
            el.textContent = text;
            el.style.opacity = '1';
            el.style.transform = 'none';
          }, 120);
        } else {
          el.textContent = text;
        }
      });
    }
  };

  // ---- SCROLL REVEAL ----
  const ScrollReveal = {
    init() {
      const els = document.querySelectorAll('.reveal-up');
      if (!els.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
      els.forEach(el => obs.observe(el));
    }
  };

  // ---- NAV SCROLL ----
  const Nav = {
    init() {
      const nav = document.getElementById('nav');
      if (!nav) return;
      window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
      }, { passive: true });
    }
  };

  // ---- COUNTER ANIMATION ----
  const Counters = {
    init() {
      const els = document.querySelectorAll('[data-count]');
      if (!els.length) return;
      const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            this.run(e.target);
            obs.unobserve(e.target);
          }
        });
      }, { threshold: 0.5 });
      els.forEach(el => obs.observe(el));
    },
    run(el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const start = performance.now();
      const dur = 1400;
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }
  };

  // ---- SMOOTH ANCHOR SCROLL ----
  const SmoothScroll = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', (e) => {
          const id = a.getAttribute('href').slice(1);
          const target = document.getElementById(id);
          if (!target) return;
          e.preventDefault();
          const navH = 68;
          window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH - 16, behavior: 'smooth' });
        });
      });
    }
  };

  // ---- RIPPLE ON PRICE BUTTONS ----
  const Ripple = {
    init() {
      document.querySelectorAll('.price-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const r = btn.getBoundingClientRect();
          const size = Math.max(r.width, r.height) * 2;
          const ripple = document.createElement('span');
          ripple.style.cssText = `
            position:absolute;border-radius:50%;background:rgba(255,255,255,0.15);
            width:${size}px;height:${size}px;
            left:${e.clientX - r.left - size/2}px;
            top:${e.clientY - r.top - size/2}px;
            transform:scale(0);animation:ripple 0.5s ease;pointer-events:none;
          `;
          btn.style.overflow = 'hidden';
          btn.appendChild(ripple);
          setTimeout(() => ripple.remove(), 500);
        });
      });
      const s = document.createElement('style');
      s.textContent = '@keyframes ripple{to{transform:scale(1);opacity:0}}';
      document.head.appendChild(s);
    }
  };

  function init() {
    Lang.init();
    ScrollReveal.init();
    Nav.init();
    Counters.init();
    SmoothScroll.init();
    Ripple.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
