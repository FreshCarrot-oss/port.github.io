/* ============================================
   FC STUDIO — ANIMATIONS JS (cursor removed)
   ============================================ */

(function () {
  'use strict';

  // ---- PARALLAX ----
  const Parallax = {
    elements: [],
    init() {
      this.elements = [
        { el: document.querySelector('.decor-1'), speed: 0.04 },
        { el: document.querySelector('.decor-2'), speed: -0.03 },
        { el: document.querySelector('.decor-3'), speed: 0.06 },
        { el: document.querySelector('.hero-badge'), speed: 0.015 },
      ].filter(item => item.el);
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      window.addEventListener('scroll', () => this.update(), { passive: true });
    },
    update() {
      const y = window.scrollY;
      this.elements.forEach(({ el, speed }) => {
        el.style.transform = `translateY(${y * speed}px)`;
      });
    }
  };

  // ---- MAGNETIC BUTTONS ----
  const MagneticButtons = {
    init() {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      document.querySelectorAll('.btn-primary, .nav-cta').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
          const r = btn.getBoundingClientRect();
          const x = e.clientX - r.left - r.width / 2;
          const y = e.clientY - r.top - r.height / 2;
          btn.style.transform = `translate(${x * 0.12}px, ${y * 0.12}px)`;
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = '';
          btn.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)';
          setTimeout(() => btn.style.transition = '', 400);
        });
      });
    }
  };

  // ---- TEXT SCRAMBLE on logo ----
  const TextScramble = {
    chars: '!<>-_\\/[]{}—=+*^?#',
    init() {
      const el = document.querySelector('.logo-fc');
      if (!el) return;
      el.addEventListener('mouseenter', () => this.scramble(el, 'FC'));
    },
    scramble(el, final) {
      let i = 0;
      const id = setInterval(() => {
        el.textContent = final.split('').map((c, idx) =>
          idx < i ? c : this.chars[Math.floor(Math.random() * this.chars.length)]
        ).join('');
        if (i >= final.length) clearInterval(id);
        i += 0.4;
      }, 30);
    }
  };

  // ---- HERO PARTICLES ----
  const Particles = {
    canvas: null, ctx: null, particles: [],
    init() {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      if (window.innerWidth < 768) return;
      const hero = document.querySelector('.hero');
      if (!hero) return;

      this.canvas = document.createElement('canvas');
      this.canvas.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;opacity:0.3;';
      hero.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.createParticles();
      this.animate();
      window.addEventListener('resize', () => this.resize(), { passive: true });
    },
    resize() {
      const hero = document.querySelector('.hero');
      if (!hero || !this.canvas) return;
      this.canvas.width = hero.offsetWidth;
      this.canvas.height = hero.offsetHeight;
    },
    getColor() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#c6ff00';
    },
    createParticles() {
      this.particles = Array.from({ length: 28 }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 1.8 + 0.5,
        sx: (Math.random() - 0.5) * 0.35,
        sy: (Math.random() - 0.5) * 0.35,
        op: Math.random() * 0.4 + 0.1,
        pulse: Math.random() * Math.PI * 2
      }));
    },
    animate() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      const color = this.getColor();
      this.particles.forEach(p => {
        p.x = (p.x + p.sx + this.canvas.width) % this.canvas.width;
        p.y = (p.y + p.sy + this.canvas.height) % this.canvas.height;
        p.pulse += 0.018;
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.globalAlpha = p.op * (0.7 + 0.3 * Math.sin(p.pulse));
        this.ctx.fill();
      });
      this.ctx.globalAlpha = 1;
      requestAnimationFrame(() => this.animate());
    }
  };

  // ---- SCROLL PROGRESS BAR ----
  const ProgressBar = {
    init() {
      const bar = document.createElement('div');
      bar.className = 'scroll-progress-bar';
      document.body.appendChild(bar);
      window.addEventListener('scroll', () => {
        const d = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = d > 0 ? (window.scrollY / d * 100) + '%' : '0%';
      }, { passive: true });
    }
  };

  // ---- BOT CHAT ANIMATION ----
  const BotAnimation = {
    init() {
      const section = document.querySelector('.bots');
      if (!section) return;
      let done = false;
      new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !done) {
          done = true;
          const msgs = section.querySelectorAll('.bot-msg');
          const btns = section.querySelector('.bot-buttons');
          msgs.forEach((m, i) => {
            m.style.opacity = '0';
            m.style.transform = 'translateY(8px)';
            setTimeout(() => {
              m.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              m.style.opacity = '1';
              m.style.transform = 'none';
            }, i * 560 + 150);
          });
          if (btns) {
            btns.style.opacity = '0';
            setTimeout(() => {
              btns.style.transition = 'opacity 0.4s ease';
              btns.style.opacity = '1';
            }, 560 + 150);
          }
        }
      }, { threshold: 0.3 }).observe(section);
    }
  };

  // ---- CARD TILT ----
  const Tilt = {
    init() {
      if (window.matchMedia('(pointer: coarse)').matches) return;
      document.querySelectorAll('.service-card, .price-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
          const r = card.getBoundingClientRect();
          const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
          const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
          card.style.transform = `translateY(-5px) rotateX(${-dy * 2.5}deg) rotateY(${dx * 2.5}deg)`;
        });
        card.addEventListener('mouseleave', () => {
          card.style.transform = '';
          card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.2,0.64,1)';
          setTimeout(() => card.style.transition = '', 500);
        });
      });
    }
  };

  // ---- LOGO GLITCH ----
  const LogoGlitch = {
    init() {
      const logo = document.querySelector('.nav-logo');
      if (!logo) return;
      logo.addEventListener('mouseenter', () => {
        logo.style.filter = 'blur(0.5px)';
        setTimeout(() => { logo.style.filter = ''; }, 80);
        setTimeout(() => {
          logo.style.filter = 'blur(0.8px)';
          setTimeout(() => { logo.style.filter = ''; }, 60);
        }, 130);
      });
    }
  };

  function init() {
    Parallax.init();
    MagneticButtons.init();
    TextScramble.init();
    Particles.init();
    ProgressBar.init();
    BotAnimation.init();
    Tilt.init();
    LogoGlitch.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
