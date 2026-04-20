// Hella — a cute puppy coach mascot for question surfaces.
// Pure motivational UI, no network, no search, no AI.
// Public API: window.NM.Hella.mount(opts?), .react(kind), .reset(), .setEnabled(bool).

(function () {
  'use strict';
  if (!window.NM) window.NM = {};
  if (window.NM.Hella) return;

  var ROOT_IMG = function () { return (window.NM.rootPath ? window.NM.rootPath() : './') + 'img/'; };

  var MESSAGES = {
    waiting: [
      'Hella is sitting patiently. Take your time.',
      'Paws ready. Read the stem twice before you pick.',
      'Hella believes in you. Trust your first instinct.',
      'Slow is smooth. Smooth is correct.',
      'Eliminate the two clearly wrong options first.'
    ],
    correct: [
      'Woof woof! That was spot on.',
      'Good human! Hella is doing happy zoomies.',
      'Nailed it. Keep that streak alive.',
      'Perfect pick. Hella is proud.',
      "That's the one. Chef's kiss, paws down."
    ],
    wrong: [
      "Close one. Don't worry, you'll get it. Read the explanation and move on.",
      "Aww... don't worry, you'll get it next time. Hella still loves you.",
      "Not this one, but don't worry, you'll get it. One more rep.",
      "Tricky question. Don't worry, you'll get it. Note why the right answer is right.",
      "Missed. Don't worry, you'll get it. Hella is cheering for round two."
    ]
  };

  var STATE_LABEL = { waiting: 'waiting', correct: 'cheering', wrong: 'supporting' };

  var lastPick = { waiting: -1, correct: -1, wrong: -1 };

  function pick(kind) {
    var pool = MESSAGES[kind] || MESSAGES.waiting;
    if (pool.length <= 1) return pool[0] || '';
    var i;
    do { i = Math.floor(Math.random() * pool.length); } while (i === lastPick[kind]);
    lastPick[kind] = i;
    return pool[i];
  }

  function isEnabled() {
    var s = (window.NM.get && window.NM.get('hella.settings', {})) || {};
    return s.enabled !== false;
  }

  function isCollapsedSaved() {
    var s = (window.NM.get && window.NM.get('hella.settings', {})) || {};
    return !!s.collapsed;
  }

  function saveCollapsed(v) {
    if (!window.NM.get || !window.NM.set) return;
    var s = window.NM.get('hella.settings', {}) || {};
    s.collapsed = !!v;
    window.NM.set('hella.settings', s);
  }

  var refs = { root: null, mascot: null, message: null, collapseBtn: null, expandBtn: null };
  var currentState = 'waiting';

  function buildWidget() {
    var root = document.createElement('div');
    root.className = 'hella' + (isCollapsedSaved() ? ' hella--collapsed' : '');
    root.setAttribute('data-state', 'waiting');
    root.innerHTML =
      '<button type="button" class="hella__pill" aria-label="Show Hella the coach">' +
        '<span class="hella__pill-dog" aria-hidden="true">' + pillDogSvg() + '</span>' +
      '</button>' +
      '<div class="hella__card" role="complementary" aria-label="Hella coach">' +
        '<button type="button" class="hella__collapse" aria-label="Hide Hella">&times;</button>' +
        '<div class="hella__mascot-wrap">' +
          '<img class="hella__mascot" alt="" src="' + ROOT_IMG() + 'hella-waiting.svg" decoding="async">' +
        '</div>' +
        '<p class="hella__message" aria-live="polite">' + pick('waiting') + '</p>' +
        '<p class="hella__hint">Hella is your study buddy.</p>' +
      '</div>';

    document.body.appendChild(root);

    refs.root = root;
    refs.mascot = root.querySelector('.hella__mascot');
    refs.message = root.querySelector('.hella__message');
    refs.collapseBtn = root.querySelector('.hella__collapse');
    refs.expandBtn = root.querySelector('.hella__pill');

    refs.collapseBtn.addEventListener('click', function () {
      root.classList.add('hella--collapsed');
      saveCollapsed(true);
    });
    refs.expandBtn.addEventListener('click', function () {
      root.classList.remove('hella--collapsed');
      saveCollapsed(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'h' && e.key !== 'H') return;
      var tag = (e.target && e.target.tagName) || '';
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target && e.target.isContentEditable)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      e.preventDefault();
      var collapsed = root.classList.toggle('hella--collapsed');
      saveCollapsed(collapsed);
    });
  }

  function pillDogSvg() {
    return '<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
      '<circle cx="20" cy="22" r="12" fill="var(--hella-body,#f4d7b0)" stroke="var(--hella-stroke,#8a5a33)" stroke-width="1.5"/>' +
      '<path d="M 10 16 Q 4 22 6 30 Q 11 28 12 22 Z" fill="var(--hella-accent,#c08b56)" stroke="var(--hella-stroke,#8a5a33)" stroke-width="1.2"/>' +
      '<path d="M 30 16 Q 36 22 34 30 Q 29 28 28 22 Z" fill="var(--hella-accent,#c08b56)" stroke="var(--hella-stroke,#8a5a33)" stroke-width="1.2"/>' +
      '<circle cx="16" cy="22" r="1.6" fill="#2a1a0a"/>' +
      '<circle cx="24" cy="22" r="1.6" fill="#2a1a0a"/>' +
      '<ellipse cx="20" cy="27" rx="1.5" ry="1" fill="#2a1a0a"/>' +
      '</svg>';
  }

  function ensureWidget() {
    if (refs.root) return true;
    if (!document.body) return false;
    buildWidget();
    return true;
  }

  function applyState(kind) {
    if (!refs.root) return;
    currentState = kind;
    refs.root.setAttribute('data-state', kind);
    refs.mascot.setAttribute('src', ROOT_IMG() + 'hella-' + kind + '.svg');
    refs.mascot.setAttribute('alt', 'Hella the puppy ' + (STATE_LABEL[kind] || ''));
    refs.message.textContent = pick(kind);
    if (kind === 'correct' && window.NM && window.NM.confettiBurst) {
      try { window.NM.confettiBurst(); } catch (e) {}
    }
  }

  function removeWidget() {
    if (!refs.root) return;
    if (refs.root.parentNode) refs.root.parentNode.removeChild(refs.root);
    refs.root = null;
    refs.mascot = null;
    refs.message = null;
    refs.collapseBtn = null;
    refs.expandBtn = null;
  }

  function inFocusMode() {
    return !!(document.body && document.body.classList && document.body.classList.contains('focus-mode'));
  }

  var api = {
    mount: function () {
      if (!isEnabled()) { removeWidget(); return; }
      if (inFocusMode()) { removeWidget(); return; }
      if (!ensureWidget()) {
        document.addEventListener('DOMContentLoaded', function () {
          if (!isEnabled() || inFocusMode()) return;
          ensureWidget();
          applyState(currentState || 'waiting');
        });
        return;
      }
      applyState(currentState || 'waiting');
    },
    react: function (kind) {
      if (!isEnabled()) return;
      if (kind !== 'correct' && kind !== 'wrong' && kind !== 'waiting') kind = 'waiting';
      if (!ensureWidget()) return;
      applyState(kind);
    },
    reset: function () {
      if (!refs.root) return;
      applyState('waiting');
    },
    setEnabled: function (v) {
      if (!window.NM.get || !window.NM.set) return;
      var s = window.NM.get('hella.settings', {}) || {};
      s.enabled = !!v;
      window.NM.set('hella.settings', s);
      if (!v) removeWidget();
      else api.mount();
    },
    // Temporarily hide widget without touching persisted settings (used by mocks during timed run).
    hide: function () {
      if (refs.root) refs.root.classList.add('hella--hidden');
    },
    show: function () {
      if (refs.root) refs.root.classList.remove('hella--hidden');
    },
    destroy: function () {
      removeWidget();
    },
    isEnabled: isEnabled
  };

  window.NM.Hella = api;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      if (isEnabled()) api.mount();
    });
  } else if (isEnabled()) {
    api.mount();
  }
})();
