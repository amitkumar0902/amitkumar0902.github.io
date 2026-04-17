// Core utilities for NORCET Mains site
// Exposes window.NM with helpers, SRS, storage, palette, shortcuts, theme.
(function () {
  'use strict';

  var NM = {};
  window.NM = NM;

  // ==== Config ====
  NM.EXAM_DATE = new Date('2026-04-30T09:00:00+05:30');
  NM.PLAN_START = new Date('2026-04-17T00:00:00+05:30');
  NM.TOTAL_DAYS = 13;

  // ==== Paths ====
  // All pages call NM.rootPath() to resolve relative path to norcetprep/.
  NM.rootPath = function () {
    var p = location.pathname;
    var idx = p.lastIndexOf('/norcetprep/');
    if (idx === -1) return './';
    var rest = p.slice(idx + '/norcetprep/'.length);
    var slashes = (rest.match(/\//g) || []).length;
    return slashes === 0 ? './' : new Array(slashes + 1).join('../');
  };

  // ==== Storage helpers (namespaced, quota-safe) ====
  var KEY = 'nm.v1.';
  NM.get = function (k, def) {
    try {
      var v = localStorage.getItem(KEY + k);
      return v === null ? def : JSON.parse(v);
    } catch (e) { return def; }
  };
  NM.set = function (k, v) {
    try { localStorage.setItem(KEY + k, JSON.stringify(v)); } catch (e) {}
  };
  NM.del = function (k) { try { localStorage.removeItem(KEY + k); } catch (e) {} };

  // ==== Day computation ====
  NM.todayDay = function () {
    var now = new Date();
    var ms = now - NM.PLAN_START;
    var d = Math.floor(ms / 86400000) + 1;
    if (d < 1) return 1;
    if (d > NM.TOTAL_DAYS) return NM.TOTAL_DAYS;
    return d;
  };
  NM.daysToExam = function () {
    var ms = NM.EXAM_DATE - new Date();
    if (ms < 0) return { d: 0, h: 0, m: 0, s: 0, past: true };
    return {
      d: Math.floor(ms / 86400000),
      h: Math.floor((ms % 86400000) / 3600000),
      m: Math.floor((ms % 3600000) / 60000),
      s: Math.floor((ms % 60000) / 1000),
      past: false
    };
  };
  NM.countdownText = function () {
    var c = NM.daysToExam();
    if (c.past) return 'Exam day.';
    return 'NORCET Mains in ' + c.d + 'd ' + pad(c.h) + 'h ' + pad(c.m) + 'm';
  };
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  // ==== Theme ====
  NM.initTheme = function () {
    var saved = NM.get('theme');
    if (!saved) {
      saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    NM.applyTheme(saved);
    var fs = NM.get('fontsize', 'md');
    document.documentElement.setAttribute('data-fs', fs);
  };
  NM.applyTheme = function (t) {
    document.documentElement.setAttribute('data-theme', t);
    NM.set('theme', t);
  };
  NM.toggleTheme = function () {
    var cur = document.documentElement.getAttribute('data-theme') || 'light';
    NM.applyTheme(cur === 'light' ? 'dark' : 'light');
  };

  // ==== Streak + activity ====
  NM.recordActivity = function (minutes, qs) {
    var today = new Date().toISOString().slice(0, 10);
    var log = NM.get('activity', {});
    var entry = log[today] || { min: 0, q: 0 };
    entry.min += minutes || 0;
    entry.q += qs || 0;
    log[today] = entry;
    NM.set('activity', log);
    NM.bumpStreak();
  };
  NM.bumpStreak = function () {
    var s = NM.get('streak', { current: 0, longest: 0, last: null });
    var today = new Date().toISOString().slice(0, 10);
    if (s.last === today) return;
    var y = new Date(); y.setDate(y.getDate() - 1);
    var yStr = y.toISOString().slice(0, 10);
    if (s.last === yStr) s.current += 1;
    else s.current = 1;
    if (s.current > s.longest) s.longest = s.current;
    s.last = today;
    NM.set('streak', s);
  };

  // ==== SRS ====
  NM.srsAdd = function (qid, wasCorrect) {
    var s = NM.get('srs', {});
    var now = Date.now();
    var card = s[qid] || { streak: 0, due: now, graduated: false };
    if (wasCorrect) {
      card.streak += 1;
      if (card.streak >= 2) card.graduated = true;
      card.due = now + card.streak * 3 * 86400000;
    } else {
      card.streak = 0;
      card.graduated = false;
      card.due = now + 86400000;
    }
    s[qid] = card;
    NM.set('srs', s);
  };
  NM.srsDueCount = function () {
    var s = NM.get('srs', {});
    var now = Date.now();
    var n = 0;
    for (var k in s) if (s.hasOwnProperty(k) && !s[k].graduated && s[k].due <= now) n++;
    return n;
  };
  NM.srsDueIds = function () {
    var s = NM.get('srs', {});
    var now = Date.now();
    var ids = [];
    for (var k in s) if (s.hasOwnProperty(k) && !s[k].graduated && s[k].due <= now) ids.push(k);
    return ids;
  };

  // ==== Celebrations ====
  NM.confettiBurst = function () {
    if (NM.get('settings', {}).animOff) return;
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // lazy-load canvas-confetti
    if (window.confetti) { window.confetti({ spread: 80, particleCount: 120, origin: { y: 0.6 } }); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    s.onload = function () { window.confetti({ spread: 80, particleCount: 120, origin: { y: 0.6 } }); };
    document.head.appendChild(s);
  };
  NM.shake = function (el) {
    if (NM.get('settings', {}).animOff) return;
    if (!el) return;
    el.classList.remove('shake');
    void el.offsetWidth;
    el.classList.add('shake');
    if (navigator.vibrate && !NM.get('settings', {}).hapticOff) navigator.vibrate(80);
  };
  NM.haptic = function (ms) {
    if (navigator.vibrate && !NM.get('settings', {}).hapticOff) navigator.vibrate(ms || 30);
  };

  // ==== Top nav builder ====
  NM.installTopnav = function (currentKey) {
    var root = NM.rootPath();
    var nav = document.createElement('nav');
    nav.className = 'topnav';
    nav.setAttribute('aria-label', 'Primary');
    var links = [
      { key: 'home', href: root + 'index.html', label: 'Home' },
      { key: 'today', href: root + 'mains-plan/index.html', label: 'Today' },
      { key: 'practice', href: root + 'mains-plan/practice/', label: 'Practice' },
      { key: 'mocks', href: root + 'mains-plan/mocks/', label: 'Mocks' },
      { key: 'bank', href: root + 'mains-plan/bank.html', label: 'Extra Qs' },
      { key: 'flashcards', href: root + 'mains-plan/flashcards/', label: 'Flashcards' },
      { key: 'dashboard', href: root + 'mains-plan/dashboard.html', label: 'Progress' },
      { key: 'pyqs', href: root + 'mains-plan/pyqs.html', label: 'PYQs' }
    ];
    var linksHtml = links.map(function (l) {
      var cur = (l.key === currentKey) ? ' aria-current="page"' : '';
      return '<a href="' + l.href + '"' + cur + '>' + l.label + '</a>';
    }).join('');
    var dueCount = NM.srsDueCount();
    var dueBadge = dueCount > 0 ? ' <span class="badge badge--warn" title="Review due">' + dueCount + ' due</span>' : '';
    nav.innerHTML =
      '<a class="topnav__brand" href="' + root + 'index.html">NORCET Mains 2026</a>' +
      '<div class="topnav__links">' + linksHtml + dueBadge + '</div>' +
      '<div class="topnav__tools">' +
        '<button class="iconbtn" id="nm-cmd-open" title="Search (Ctrl/Cmd+K)">⌘K</button>' +
        '<button class="iconbtn" id="nm-theme-toggle" title="Toggle theme">◐</button>' +
        '<a class="iconbtn" href="' + root + 'mains-plan/settings.html" title="Settings">⚙</a>' +
      '</div>';
    document.body.insertBefore(nav, document.body.firstChild);
    var skip = document.createElement('a');
    skip.className = 'skip-link'; skip.href = '#main'; skip.textContent = 'Skip to content';
    document.body.insertBefore(skip, nav);
    document.getElementById('nm-theme-toggle').addEventListener('click', NM.toggleTheme);
    document.getElementById('nm-cmd-open').addEventListener('click', NM.openPalette);
  };

  // ==== Command palette ====
  NM.paletteItems = function () {
    var root = NM.rootPath();
    var items = [
      { label: 'Home', hint: 'landing', href: root + 'index.html' },
      { label: 'Today', hint: 'current day', href: root + 'mains-plan/index.html' },
      { label: 'Extra Questions (bank)', hint: 'browse', href: root + 'mains-plan/bank.html' },
      { label: 'Progress dashboard', hint: 'charts', href: root + 'mains-plan/dashboard.html' },
      { label: 'Review due cards', hint: 'SRS', href: root + 'mains-plan/review.html' },
      { label: 'Drug Calc Drill', hint: '30s/Q', href: root + 'mains-plan/drill/drug-calc.html' },
      { label: 'Scenario Drill', hint: 'clinical reasoning', href: root + 'mains-plan/drill/scenarios.html' },
      { label: 'PYQs', hint: 'NORCET 6-9', href: root + 'mains-plan/pyqs.html' },
      { label: 'Flashcards', hint: '7 decks', href: root + 'mains-plan/flashcards/' },
      { label: 'Settings', hint: 'theme, font, a11y', href: root + 'mains-plan/settings.html' }
    ];
    for (var i = 1; i <= 13; i++) {
      items.push({ label: 'Day ' + i + ' notes', hint: 'study', href: root + 'mains-plan/day-' + i + '.html' });
      items.push({ label: 'Day ' + i + ' practice', hint: '25 Qs', href: root + 'mains-plan/practice/day-' + i + '.html' });
    }
    for (var m = 1; m <= 10; m++) {
      items.push({ label: 'Mock ' + m, hint: '160 Q / 180 min', href: root + 'mains-plan/mocks/mock.html?id=' + m });
    }
    var sheets = ['abg','formulas','logos','bmw','vaccines','milestones','drugs'];
    sheets.forEach(function (s) { items.push({ label: 'Cheatsheet: ' + s.toUpperCase(), hint: 'printable', href: root + 'mains-plan/cheatsheets/' + s + '.html' }); });
    return items;
  };
  NM.openPalette = function () {
    if (document.getElementById('nm-palette')) return;
    var items = NM.paletteItems();
    var o = document.createElement('div');
    o.className = 'overlay'; o.id = 'nm-palette';
    o.innerHTML =
      '<div class="overlay-panel" role="dialog" aria-label="Command palette">' +
        '<input class="overlay-input" id="nm-palette-input" placeholder="Jump to day, mock, cheatsheet..." autocomplete="off">' +
        '<ul class="overlay-list" id="nm-palette-list"></ul>' +
      '</div>';
    document.body.appendChild(o);
    var inp = o.querySelector('#nm-palette-input');
    var list = o.querySelector('#nm-palette-list');
    var filtered = items.slice();
    var sel = 0;
    function render() {
      list.innerHTML = filtered.slice(0, 40).map(function (it, i) {
        return '<li role="option" aria-selected="' + (i === sel) + '" data-i="' + i + '"><span>' + it.label + '</span><span class="hint">' + it.hint + '</span></li>';
      }).join('');
    }
    function filter(q) {
      q = q.toLowerCase().trim();
      if (!q) { filtered = items.slice(); }
      else {
        filtered = items.filter(function (it) {
          var s = (it.label + ' ' + it.hint).toLowerCase();
          return q.split(/\s+/).every(function (tok) { return s.indexOf(tok) !== -1; });
        });
      }
      sel = 0; render();
    }
    function go() {
      var it = filtered[sel];
      if (it) location.href = it.href;
    }
    inp.addEventListener('input', function () { filter(inp.value); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, filtered.length - 1); render(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
      else if (e.key === 'Enter') { e.preventDefault(); go(); }
      else if (e.key === 'Escape') { NM.closePalette(); }
    });
    list.addEventListener('click', function (e) {
      var li = e.target.closest('li'); if (!li) return;
      sel = parseInt(li.getAttribute('data-i'), 10); go();
    });
    o.addEventListener('click', function (e) { if (e.target === o) NM.closePalette(); });
    render();
    setTimeout(function () { inp.focus(); }, 10);
  };
  NM.closePalette = function () {
    var o = document.getElementById('nm-palette');
    if (o) o.remove();
  };

  // ==== Shortcut help ====
  NM.shortcutHelpHtml =
    '<h3>Keyboard Shortcuts</h3>' +
    '<table>' +
    '<tr><td><kbd>1</kbd>–<kbd>4</kbd></td><td>Pick option</td></tr>' +
    '<tr><td><kbd>Enter</kbd></td><td>Submit / Next</td></tr>' +
    '<tr><td><kbd>F</kbd></td><td>Flag for review</td></tr>' +
    '<tr><td><kbd>R</kbd></td><td>Toggle review panel</td></tr>' +
    '<tr><td><kbd>←</kbd> <kbd>→</kbd></td><td>Previous / Next Q</td></tr>' +
    '<tr><td><kbd>Esc</kbd></td><td>Close / pause</td></tr>' +
    '<tr><td><kbd>Ctrl</kbd>+<kbd>K</kbd></td><td>Command palette</td></tr>' +
    '<tr><td><kbd>?</kbd></td><td>This help</td></tr>' +
    '</table>';
  NM.openShortcutHelp = function () {
    if (document.getElementById('nm-shortcuts')) return;
    var o = document.createElement('div');
    o.className = 'overlay'; o.id = 'nm-shortcuts';
    o.innerHTML = '<div class="overlay-panel" style="padding:24px;">' + NM.shortcutHelpHtml + '<p class="small muted">Press Esc to close.</p></div>';
    o.addEventListener('click', function (e) { if (e.target === o) o.remove(); });
    document.body.appendChild(o);
  };

  // ==== Global keydown listener ====
  NM.installGlobalKeys = function () {
    document.addEventListener('keydown', function (e) {
      var inField = /^(input|textarea|select)$/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault(); NM.openPalette(); return;
      }
      if (e.key === 'Escape') {
        NM.closePalette();
        var sh = document.getElementById('nm-shortcuts'); if (sh) sh.remove();
        return;
      }
      if (!inField && e.key === '?') {
        e.preventDefault(); NM.openShortcutHelp();
      }
    });
  };

  // ==== Boot ====
  NM.boot = function (currentKey) {
    NM.initTheme();
    NM.installGlobalKeys();
    if (document.body) {
      NM.installTopnav(currentKey);
      registerSW();
    } else {
      document.addEventListener('DOMContentLoaded', function () {
        NM.installTopnav(currentKey);
        registerSW();
      });
    }
  };

  function registerSW() {
    if ('serviceWorker' in navigator) {
      var root = NM.rootPath();
      navigator.serviceWorker.register(root + 'sw.js').catch(function () {});
    }
  }

  // Simple shuffle helper (seeded deterministic ok for UI, Math.random for mocks)
  NM.shuffle = function (arr, seed) {
    var a = arr.slice();
    var rng;
    if (seed !== undefined) {
      var s = seed;
      rng = function () { s = (s * 9301 + 49297) % 233280; return s / 233280; };
    } else rng = Math.random;
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  };

  NM.escape = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  };

  NM.formatTime = function (secs) {
    var h = Math.floor(secs / 3600), m = Math.floor((secs % 3600) / 60), s = secs % 60;
    return (h > 0 ? h + ':' : '') + (h > 0 ? pad(m) : m) + ':' + pad(s);
  };
})();
