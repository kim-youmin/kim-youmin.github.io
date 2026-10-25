(() => {
  'use strict';
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.site-nav');
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    toggle.querySelector('span').textContent = open ? 'Close' : 'Menu';
  };
  toggle?.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || link.target === '_blank') return;
    const url = new URL(link.href, location.href);
    const normalize = path => path.replace(/index\.html$/, '');
    if (url.origin !== location.origin || normalize(url.pathname) !== normalize(location.pathname) || !url.hash) return;
    const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
    if (!target) return;
    event.preventDefault();
    setMenu(false);
    history.pushState(null, '', url.hash);
    target.scrollIntoView({block: 'start', behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      setMenu(false); toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (toggle?.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
  document.querySelectorAll('[data-filter]').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.filter;
      document.querySelectorAll('[data-filter]').forEach(other => {
        const active = other === button;
        other.classList.toggle('active', active);
        other.setAttribute('aria-pressed', String(active));
      });
      let count = 0;
      document.querySelectorAll('.note-row').forEach(row => {
        row.hidden = value !== 'all' && row.dataset.category !== value;
        if (!row.hidden) count++;
      });
      const status = document.querySelector('.notes-count');
      if (status) status.textContent = `${count} ${count === 1 ? 'note' : 'notes'}`;
    });
  });
  document.querySelectorAll('[data-print]').forEach(button => button.addEventListener('click', () => window.print()));
  // All content and equations are pre-rendered; JavaScript only enhances navigation.
})();
