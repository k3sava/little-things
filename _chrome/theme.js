// _chrome/theme.js — 8-skin engine for aggregated toys
// T key / pill click: cycle skins. D key: toggle dark mode.
// data-theme + data-dark on <html> drive the shared kami.css.

(function () {
  'use strict';

  var THEMES = ['default', 'brutalist', 'editorial', 'terminal', 'zen', 'glass', 'material', 'metro'];
  var ICONS = { default: '○', brutalist: '■', editorial: '¶', terminal: '>', zen: '◯', glass: '◎', material: '◆', metro: '▣' };
  var THEME_KEY = 'kami.theme';
  var DARK_KEY = 'kami.dark';
  var DEFAULT = 'brutalist';

  function readCookie(name) {
    var m = ('; ' + document.cookie).split('; ' + name + '=')[1];
    return m ? decodeURIComponent(m.split(';')[0]) : null;
  }
  function writeCookie(id) {
    try { document.cookie = THEME_KEY + '=' + id + '; path=/; domain=.iamkesava.com; max-age=31536000; SameSite=Lax'; } catch (e) {}
  }

  function currentTheme() {
    return document.documentElement.getAttribute('data-theme') || 'default';
  }
  function applyTheme(id) {
    if (id && id !== 'default') document.documentElement.setAttribute('data-theme', id);
    else document.documentElement.removeAttribute('data-theme');
    try { localStorage.setItem(THEME_KEY, id); } catch (e) {}
    writeCookie(id);
    updatePill(id);
  }
  function updatePill(id) {
    var icons = document.querySelectorAll('.theme-switcher-pill-icon, .kami-theme-pill-icon');
    for (var i = 0; i < icons.length; i++) icons[i].textContent = ICONS[id] || ICONS.brutalist;
  }
  function cycleTheme() {
    var idx = THEMES.indexOf(currentTheme());
    applyTheme(THEMES[(idx + 1) % THEMES.length]);
  }

  // Dark mode
  function isDark() { return document.documentElement.hasAttribute('data-dark'); }
  function setDark(on) {
    if (on) { document.documentElement.setAttribute('data-dark', ''); try { localStorage.setItem(DARK_KEY, '1'); } catch (e) {} }
    else { document.documentElement.removeAttribute('data-dark'); try { localStorage.removeItem(DARK_KEY); } catch (e) {} }
  }

  // ── Bootstrap (runs as early as this deferred script executes) ──
  var saved = readCookie(THEME_KEY) || (function () { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } })() || DEFAULT;
  applyTheme(saved);
  try { if (localStorage.getItem(DARK_KEY) === '1') setDark(true); } catch (e) {}

  // Keys
  document.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === 't' || e.key === 'T') cycleTheme();
    if (e.key === 'd' || e.key === 'D') setDark(!isDark());
  });

  // Pill click cycles
  document.addEventListener('DOMContentLoaded', function () {
    updatePill(currentTheme());
    var pills = document.querySelectorAll('.theme-switcher-pill, .kami-theme-pill');
    for (var i = 0; i < pills.length; i++) {
      pills[i].style.cursor = 'pointer';
      pills[i].addEventListener('click', function (e) { e.preventDefault(); cycleTheme(); });
    }
    var dbtn = document.querySelector('[data-kami-dark-toggle]');
    if (dbtn) dbtn.addEventListener('click', function () { setDark(!isDark()); });
  });

  window.kamiTheme = { isDark: isDark, setDark: setDark, cycle: cycleTheme, apply: applyTheme };
})();
