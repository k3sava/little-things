// _chrome/theme.js — brutalist edition
// T key: no-op (skin engine deferred)
// D key: toggle dark mode
// data-dark attribute on <html> drives chrome.css dark block

(function () {
  'use strict';

  var DARK_KEY = 'kami.dark';

  function isDark() {
    return document.documentElement.hasAttribute('data-dark');
  }

  function setDark(on) {
    if (on) {
      document.documentElement.setAttribute('data-dark', '');
      localStorage.setItem(DARK_KEY, '1');
    } else {
      document.documentElement.removeAttribute('data-dark');
      localStorage.removeItem(DARK_KEY);
    }
  }

  // Restore dark preference on load
  if (localStorage.getItem(DARK_KEY) === '1') {
    setDark(true);
  }

  // D key toggles dark mode
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    if (e.key === 'd' || e.key === 'D') {
      setDark(!isDark());
    }
    // T key: no-op placeholder until skin engine ships
  });

  // Wire dark-mode toggle button (if present in HTML)
  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.querySelector('[data-kami-dark-toggle]');
    if (btn) {
      btn.addEventListener('click', function () { setDark(!isDark()); });
    }
    // Theme pill: no-op
    var pill = document.querySelector('.kami-theme-pill');
    if (pill) {
      pill.style.cursor = 'default';
      pill.addEventListener('click', function (e) { e.preventDefault(); });
    }
  });

  // Export for other scripts
  window.kamiTheme = { isDark: isDark, setDark: setDark };
})();
