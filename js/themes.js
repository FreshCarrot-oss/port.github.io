/* ============================================
   FC STUDIO — THEMES JS
   Random theme on load + manual switch
   ============================================ */

(function () {
  const THEMES = ['theme-1', 'theme-2', 'theme-3', 'theme-4'];

  const THEME_NAMES = {
    'theme-1': 'Noir Electric',
    'theme-2': 'Bone & Burgundy',
    'theme-3': 'Arctic Void',
    'theme-4': 'Obsidian Amber'
  };

  // Pick random theme (avoid same theme twice in a row)
  function pickRandomTheme() {
    const last = sessionStorage.getItem('fc_last_theme');
    const available = THEMES.filter(t => t !== last);
    const chosen = available[Math.floor(Math.random() * available.length)];
    sessionStorage.setItem('fc_last_theme', chosen);
    return chosen;
  }

  function applyTheme(theme, animate) {
    if (animate) {
      const flash = document.createElement('div');
      flash.className = 'theme-flash';
      document.body.appendChild(flash);
      setTimeout(() => flash.remove(), 500);
    }
    document.documentElement.setAttribute('data-theme', theme);
    sessionStorage.setItem('fc_current_theme', theme);
  }

  function nextTheme() {
    const current = document.documentElement.getAttribute('data-theme') || 'theme-1';
    const idx = THEMES.indexOf(current);
    const next = THEMES[(idx + 1) % THEMES.length];
    applyTheme(next, true);

    // Show theme name toast
    showToast(THEME_NAMES[next]);
  }

  function showToast(name) {
    const existing = document.querySelector('.theme-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'theme-toast';
    toast.textContent = name;
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      left: 50%;
      transform: translateX(-50%) translateY(10px);
      background: var(--card-bg);
      border: 1px solid var(--border-accent);
      color: var(--text);
      font-family: var(--font-body);
      font-size: 0.78rem;
      padding: 0.5rem 1.2rem;
      border-radius: 100px;
      z-index: 9000;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  // Init: apply random theme on page load
  function init() {
    const saved = sessionStorage.getItem('fc_current_theme');
    const theme = saved || pickRandomTheme();
    applyTheme(theme, false);

    // Theme button
    const btn = document.getElementById('themeBtn');
    if (btn) {
      btn.addEventListener('click', nextTheme);
      btn.title = 'Сменить тему / Change theme';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
