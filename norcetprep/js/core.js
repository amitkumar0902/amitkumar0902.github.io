// Core utilities for NORCET Mains site
// Exposes window.NM with helpers, SRS, storage, palette, shortcuts, theme.
(function () {
  'use strict';

  // ==== Legacy auth gate (static client-side; obfuscation only, not real security) ====
  // Redirects to /norcetprep/login.html unless sessionStorage has nm.auth set.
  // Deliberately keyed to the '/norcetprep/' path marker: on the product domain
  // (nursedrill.com serves this directory at the origin root) the marker is absent,
  // so this legacy gate disarms there — Phase 2 runs the new origin open while
  // real entitlement gating arrives in Phase 3. The old origin keeps the gate
  // during the migration grace period.
  var _p = location.pathname;
  var _idx = _p.lastIndexOf('/norcetprep/');
  if (_idx !== -1) {
    var _rest = _p.slice(_idx + '/norcetprep/'.length);
    var _onAuthPage = /(^|\/)(login|signup|account)\.html$/.test(_rest);
    var _authed = false;
    try { _authed = !!sessionStorage.getItem('nm.auth'); } catch (e) { _authed = true; }
    if (!_onAuthPage && !_authed) {
      var _slashes = (_rest.match(/\//g) || []).length;
      var _up = _slashes === 0 ? '' : new Array(_slashes + 1).join('../');
      if (document.documentElement) document.documentElement.style.visibility = 'hidden';
      location.replace(_up + 'login.html?next=' + encodeURIComponent(location.pathname + location.search));
      return;
    }
  }

  var NM = {};
  window.NM = NM;

  // ==== Config ====
  NM.EXAM_DATE = new Date('2026-04-30T09:00:00+05:30');
  NM.PLAN_START = new Date('2026-04-17T00:00:00+05:30');
  NM.TOTAL_DAYS = 13;

  // ==== Paths ====
  // All pages call NM.rootPath() to resolve relative path to norcetprep/.
  NM.rootPath = function () {
    // Site root is the '/norcetprep/' marker on GitHub Pages, or the origin
    // root on the product domain (nursedrill.com) — depth works either way.
    var p = location.pathname;
    var idx = p.lastIndexOf('/norcetprep/');
    var rest = idx !== -1 ? p.slice(idx + '/norcetprep/'.length) : p.replace(/^\//, '');
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
    if (!NM.motionAllowed()) return;
    if (window.confetti) { window.confetti({ spread: 80, particleCount: 120, origin: { y: 0.6 } }); return; }
    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
    s.onload = function () { window.confetti({ spread: 80, particleCount: 120, origin: { y: 0.6 } }); };
    document.head.appendChild(s);
  };
  NM.shake = function (el) {
    if (!NM.motionAllowed()) return;
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
      '<a class="topnav__brand" href="' + root + 'index.html">NurseDrill</a>' +
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

  // ==== Motion allowance (master override) ====
  NM.motionAllowed = function () {
    var s = NM.get('settings', {}) || {};
    if (s.animMaster === 'off') return false;
    if (s.animMaster === 'on') return true;
    var mqReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (s.animOff === true) return false;
    return !mqReduced;
  };

  // ==== Day progress strip + countdown banner (Track 5b/5c) ====
  NM.dayProgressStrip = function (currentDay) {
    if (document.querySelector('.day-progress')) return;
    var done = NM.get('daysCompleted', {}) || {};
    var doneCount = 0;
    for (var i = 1; i <= NM.TOTAL_DAYS; i++) if (done[i]) doneCount++;
    var pct = Math.round((doneCount / NM.TOTAL_DAYS) * 100);
    var strip = document.createElement('div');
    strip.className = 'day-progress';
    strip.innerHTML =
      (currentDay ? '<span><strong>Day ' + currentDay + '</strong> of ' + NM.TOTAL_DAYS + '</span>' : '<span>' + NM.TOTAL_DAYS + '-day intensive</span>') +
      '<span class="day-progress__bar"><span class="day-progress__fill" style="width:' + pct + '%"></span></span>' +
      '<span>' + pct + '% complete (' + doneCount + '/' + NM.TOTAL_DAYS + ')</span>' +
      '<span class="day-progress__countdown" id="nm-day-countdown">' + NM.countdownText() + '</span>';
    var nav = document.querySelector('.topnav');
    if (nav && nav.parentNode) nav.parentNode.insertBefore(strip, nav.nextSibling);
    else document.body.insertBefore(strip, document.body.firstChild);
    setInterval(function () {
      var el = document.getElementById('nm-day-countdown');
      if (el) el.textContent = NM.countdownText();
    }, 30000);
  };

  // Mark a day as opened (auto-called on day notes / practice pages).
  NM.markDayOpened = function (day) {
    if (!day) return;
    var opened = NM.get('daysOpened', {}) || {};
    opened[day] = true;
    NM.set('daysOpened', opened);
    // Back-compat: the landing checklist reads `notesDone[d]`.
    if (/\/day-\d+\.html/.test(location.pathname)) {
      var notes = NM.get('notesDone', {}) || {};
      notes[day] = true;
      NM.set('notesDone', notes);
    }
  };
  // Mark a day as completed (auto-called on practice submit).
  NM.markDayCompleted = function (day) {
    if (!day) return;
    var done = NM.get('daysCompleted', {}) || {};
    done[day] = true;
    NM.set('daysCompleted', done);
  };

  // ==== Resume hint (Track 5f) ====
  NM.installResumeHint = function (opts) {
    var host = opts.mountTarget || document.getElementById('main') || document.body;
    var existing = document.querySelector('.resume-hint[data-key="' + opts.key + '"]');
    if (existing) existing.remove();
    var saved = NM.get(opts.key);
    if (!saved) return;
    if (typeof opts.shouldShow === 'function' && !opts.shouldShow(saved)) return;
    var div = document.createElement('div');
    div.className = 'resume-hint'; div.setAttribute('data-key', opts.key);
    div.innerHTML = '<a href="#" data-act="resume">' + (opts.resumeLabel || 'Continue where you left off') + '</a>' +
      (opts.freshLabel ? '<a href="#" data-act="fresh">' + opts.freshLabel + '</a>' : '');
    host.insertBefore(div, host.firstChild);
    div.addEventListener('click', function (e) {
      var a = e.target.closest('a'); if (!a) return;
      e.preventDefault();
      if (a.dataset.act === 'resume' && typeof opts.onResume === 'function') opts.onResume(saved);
      if (a.dataset.act === 'fresh' && typeof opts.onFresh === 'function') opts.onFresh();
    });
  };

  // ==== Boot ====
  // currentKey can be a string (nav key) or an options object:
  //   NM.boot('today', { day: 3 })  →  also installs day-progress strip + marks day opened
  NM.boot = function (currentKey, opts) {
    NM.initTheme();
    NM.installGlobalKeys();
    opts = opts || {};
    function mount() {
      NM.installTopnav(currentKey);
      registerSW();
      loadAddOns();
      var day = opts.day || detectDayFromPath();
      if (day) {
        NM.markDayOpened(day);
        NM.dayProgressStrip(day);
        installDayNotesScrollResume(day);
      } else if (opts.showProgress !== false && shouldShowProgress()) {
        NM.dayProgressStrip(null);
      }
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount);
  };

  // Lightweight scroll-resume for day notes pages.
  function installDayNotesScrollResume(day) {
    if (!/\/mains-plan\/day-\d+\.html/.test(location.pathname)) return;
    var key = 'notes.scroll.day-' + day;
    var savedY = NM.get(key, 0) | 0;
    if (savedY > 400) {
      var host = document.querySelector('.container') || document.getElementById('main') || document.body;
      var hint = document.createElement('div');
      hint.className = 'resume-hint';
      hint.innerHTML = '<a href="#" data-act="resume">Continue where you left off</a><a href="#" data-act="fresh">Start from top</a>';
      host.insertBefore(hint, host.firstChild);
      hint.addEventListener('click', function (e) {
        var a = e.target.closest('a'); if (!a) return;
        e.preventDefault();
        if (a.dataset.act === 'resume') window.scrollTo({ top: savedY, behavior: NM.motionAllowed() ? 'smooth' : 'auto' });
        else { NM.del(key); hint.remove(); window.scrollTo({ top: 0 }); }
      });
    }
    var last = 0;
    window.addEventListener('scroll', function () {
      var now = Date.now();
      if (now - last < 800) return;
      last = now;
      NM.set(key, Math.round(window.scrollY));
    }, { passive: true });
  }

  function detectDayFromPath() {
    var p = location.pathname;
    var m = p.match(/\/day-(\d{1,2})\.html?$/);
    if (m) return parseInt(m[1], 10);
    return null;
  }
  function shouldShowProgress() {
    var p = location.pathname;
    return /\/mains-plan\//.test(p) && !/\/mocks\//.test(p) && !/\/flashcards\//.test(p) && !/\/settings\.html/.test(p) && !/\/index\.html?$/.test(p);
  }

  function registerSW() {
    if ('serviceWorker' in navigator) {
      var root = NM.rootPath();
      navigator.serviceWorker.register(root + 'sw.js').catch(function () {});
    }
  }

  function loadScript(src) {
    return new Promise(function (resolve) {
      var existing = document.querySelector('script[data-nm-src="' + src + '"]');
      if (existing) { resolve(); return; }
      var s = document.createElement('script');
      s.src = src; s.async = false; s.setAttribute('data-nm-src', src);
      s.onload = resolve; s.onerror = function () { resolve(); };
      document.head.appendChild(s);
    });
  }
  function loadAddOns() {
    var root = NM.rootPath();
    // Firebase compat SDKs + config → anonymous auth for sync + reports.
    if (!window.firebase) {
      loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js').then(function () {
        return loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-auth-compat.js');
      }).then(function () {
        return loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore-compat.js');
      }).then(function () {
        return loadScript('https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics-compat.js');
      }).then(function () {
        loadScript(root + 'js/firebase-config.js');
      });
    }
    // Paywall + content routing + funnel events (Phase 3).
    if (!window.ND || !window.ND.paywall) loadScript(root + 'js/paywall.js');
    if (!window.ND || !window.ND.content) loadScript(root + 'js/content.js');
    if (!window.NDTrack) loadScript(root + 'js/analytics.js');
    // Trust footer + incident banner on every page the app renders.
    if (!window.ND || !window.ND.chrome) loadScript(root + 'js/site-chrome.js');
    if (!window.NMReport) loadScript(root + 'js/report.js');
    if (!NM.sync) loadScript(root + 'js/sync.js');
    // Hella (cute puppy coach mascot). Gated by the per-user setting; hella.js handles disabled state itself.
    if (!document.querySelector('link[data-nm-hella]')) {
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = root + 'css/hella.css?v=11';
      link.setAttribute('data-nm-hella', 'css');
      document.head.appendChild(link);
    }
    if (!window.NM.Hella) loadScript(root + 'js/hella.js?v=11');
  }

  // ==== Data loader (Phase 3) ====
  // Drop-in for fetch(url).then(r => r.json()). Waits briefly for js/content.js
  // (injected by loadAddOns) so premium files route through Firestore once the
  // paywall is live; free files always come from static hosting.
  NM.data = function (url) {
    return new Promise(function (resolve) {
      var tries = 0;
      (function wait() {
        if (window.ND && window.ND.content) return resolve(window.ND.content.json(url));
        if (++tries > 100) {
          return resolve(fetch(url).then(function (r) {
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.json();
          }));
        }
        setTimeout(wait, 50);
      })();
    });
  };

  // Entitlement state for merchandising pages (mock library, notes index)
  // that render their own locked tiles. Resolves {status:'open'|'anon'|'free'|'premium'}
  // — 'open' when the paywall is off or paywall.js never arrives.
  NM.paywallState = function () {
    return new Promise(function (resolve) {
      var tries = 0;
      (function wait() {
        if (window.ND && window.ND.paywall) {
          return resolve(window.ND.paywall.enabled() ? window.ND.paywall.check() : { status: 'open', until: null });
        }
        if (++tries > 100) return resolve({ status: 'open', until: null });
        setTimeout(wait, 50);
      })();
    });
  };

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
