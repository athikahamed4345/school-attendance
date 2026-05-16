const theme = (() => {
  const KEY = 'att_theme';

  const moonSVG = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  const sunSVG  = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;

  function getMode() { return localStorage.getItem(KEY) || 'light'; }

  function apply(mode) {
    document.documentElement.setAttribute('data-theme', mode);
    localStorage.setItem(KEY, mode);
    document.querySelectorAll('.btn-theme').forEach(btn => {
      btn.innerHTML = mode === 'dark' ? sunSVG : moonSVG;
      btn.title = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });
  }

  function toggle() { apply(getMode() === 'dark' ? 'light' : 'dark'); }

  function makeBtn() {
    const btn = document.createElement('button');
    btn.className = 'btn-theme';
    const mode = getMode();
    btn.innerHTML = mode === 'dark' ? sunSVG : moonSVG;
    btn.title = mode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    btn.onclick = toggle;
    return btn;
  }

  function inject() {
    const header = document.querySelector('.page-header');
    if (header) {
      let right = header.querySelector('.header-right');
      if (!right) {
        right = document.createElement('div');
        right.className = 'header-right';
        header.appendChild(right);
      }
      right.prepend(makeBtn());
      return;
    }
    // Auth pages (login / signup) — fixed top-right corner
    const btn = makeBtn();
    btn.style.cssText = 'position:fixed;top:16px;right:16px;z-index:999';
    document.body.appendChild(btn);
  }

  // Apply saved theme immediately (prevents flash of wrong theme)
  apply(getMode());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }

  return { toggle, apply, getMode };
})();
