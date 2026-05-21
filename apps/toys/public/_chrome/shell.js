// _chrome/shell.js — brutalist edition
// Reads window.kamiMeta declared in each toy's index.html
// Injects: share button wiring, shortcuts overlay, FAQ section, JSON-LD upgrade
// Header is already in HTML markup; this script wires interactive parts.

(function () {
  'use strict';

  var meta = window.kamiMeta || {};
  var title = meta.title || document.title;
  var tagline = meta.tagline || '';
  var shortcuts = meta.shortcuts || [];
  var faq = meta.faq || [];
  var related = meta.related || [];
  var nativeNote = meta.nativeNote || false;
  var BASE_URL = 'https://toys.iamkesava.com';

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function wireShare() {
    var btn = document.getElementById('kami-share-btn');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var url = location.href;
      var shareData = { title: title, text: tagline, url: url };
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        navigator.share(shareData).catch(function () {});
      } else {
        navigator.clipboard.writeText(url).then(function () {
          btn.textContent = '✓ Copied';
          setTimeout(function () { btn.textContent = '↑ Share'; }, 2000);
        }).catch(function () {
          btn.textContent = '✓ Copied';
          setTimeout(function () { btn.textContent = '↑ Share'; }, 2000);
        });
      }
    });
  }

  function buildShortcutsOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'kami-shortcuts-overlay';
    overlay.id = 'kami-shortcuts-overlay';
    overlay.style.display = 'none';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Keyboard shortcuts');

    var allShortcuts = [
      { key: 'D', label: 'Toggle dark mode' },
      { key: '?', label: 'Show shortcuts' },
      { key: 'Esc', label: 'Close overlay' }
    ].concat(shortcuts);

    var rows = allShortcuts.map(function (s) {
      return '<div class="kami-shortcuts-overlay__row">' +
        '<span>' + escHtml(s.label) + '</span>' +
        '<kbd>' + escHtml(s.key) + '</kbd>' +
        '</div>';
    }).join('');

    overlay.innerHTML =
      '<div class="kami-shortcuts-overlay__panel">' +
        '<div class="kami-shortcuts-overlay__title">Keyboard shortcuts</div>' +
        rows +
        '<div style="margin-top:1rem;text-align:right">' +
          '<button class="kami-btn" id="kami-shortcuts-close">Close (Esc)</button>' +
        '</div>' +
      '</div>';

    document.body.appendChild(overlay);

    function open() { overlay.style.display = 'flex'; }
    function close() { overlay.style.display = 'none'; }

    document.getElementById('kami-shortcuts-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) { if (e.target === overlay) close(); });

    document.addEventListener('keydown', function (e) {
      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        if (overlay.style.display === 'none') open(); else close();
      }
      if (e.key === 'Escape' && overlay.style.display !== 'none') {
        e.stopPropagation();
        close();
      }
    });

    var shortcutsBtn = document.getElementById('kami-shortcuts-btn');
    if (shortcutsBtn) shortcutsBtn.addEventListener('click', open);
  }

  function buildFaqSection() {
    if (!faq.length) return;
    var section = document.createElement('section');
    section.className = 'kami-faq';
    section.setAttribute('aria-label', 'Frequently asked questions');
    var entries = faq.map(function (f) {
      return '<div class="kami-faq__entry">' +
        '<h3 class="kami-faq__q">' + escHtml(f.q) + '</h3>' +
        '<p class="kami-faq__a">' + escHtml(f.a) + '</p>' +
        '</div>';
    }).join('');
    section.innerHTML = '<h2 class="kami-faq__heading">Frequently asked questions</h2>' + entries;
    document.body.appendChild(section);

    if (nativeNote) {
      var note = document.createElement('p');
      note.className = 'kami-native-note';
      note.textContent = 'Native iOS + iPad app coming soon.';
      document.body.appendChild(note);
    }
  }

  function buildRelatedStrip() {
    if (!related.length) return;
    var strip = document.createElement('nav');
    strip.className = 'kami-related';
    strip.setAttribute('aria-label', 'Related toys');
    var links = related.map(function (r) {
      return '<a href="' + BASE_URL + '/' + escHtml(r.slug) + '/" class="kami-related__item">' + escHtml(r.title) + '</a>';
    }).join('');
    strip.innerHTML = '<div class="kami-related__heading">Related</div>' +
      '<div class="kami-related__list">' + links + '</div>';
    document.body.appendChild(strip);
  }

  function upgradeJsonLd() {
    var existing = document.querySelector('script[type="application/ld+json"]');
    if (!existing) return;
    try {
      var data = JSON.parse(existing.textContent);
      var graph = data['@graph'] || [data];
      var upgraded = graph.map(function (node) {
        if (node['@type'] === 'CreativeWork' || node['@type'] === 'WebApplication') {
          return Object.assign({}, node, {
            '@type': 'SoftwareApplication',
            applicationCategory: 'UtilitiesApplication',
            operatingSystem: 'Web',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }
          });
        }
        return node;
      });
      var hasFaq = upgraded.some(function (n) { return n['@type'] === 'FAQPage'; });
      if (faq.length && !hasFaq) {
        upgraded.push({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map(function (f) {
            return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
          })
        });
      }
      if (data['@graph']) {
        data['@graph'] = upgraded;
        existing.textContent = JSON.stringify(data);
      } else {
        existing.textContent = JSON.stringify(upgraded[0]);
        if (faq.length && !hasFaq) {
          var faqScript = document.createElement('script');
          faqScript.type = 'application/ld+json';
          faqScript.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faq.map(function (f) {
              return { '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } };
            })
          });
          document.head.appendChild(faqScript);
        }
      }
    } catch (e) { /* leave intact */ }
  }

  function boot() {
    wireShare();
    buildShortcutsOverlay();
    upgradeJsonLd();
    buildFaqSection();
    buildRelatedStrip();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
