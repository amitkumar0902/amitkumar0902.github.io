// NurseDrill paywall (Phase 3) — entitlement gate, app-mode blackout, plan CTAs.
// Standalone: safe on pages without core.js (pricing/checkout). When core.js is
// present, NM.paywall aliases ND.paywall.
//
// States:
//   'open'    — paywall disabled (pre-go-live) or Firebase unconfigured: no gating.
//   'anon'    — paywall on, nobody signed in (anonymous sync sessions count as anon).
//   'free'    — signed in, no live entitlement.
//   'premium' — entitlements.norcet.paid_until is in the future.
//
// App-mode (TWA): the Android app launches with ?src=twa and intent navigations
// carry an android-app:// referrer. Persisted in sessionStorage — NOT
// localStorage, because the TWA shares the browser profile's localStorage and a
// permanent flag would black out the user's regular Chrome visits too.
(function () {
  'use strict';

  // Flip to true in the paid go-live commit — see DEPLOY.md "Go-live flip".
  // Applies to BOTH origins: nursedrill.com gets entitlement gating, and the
  // same commit retires the legacy allowlist on the old origin.
  var PAYWALL_ENABLED = false;

  var ND = window.ND = window.ND || {};

  // ---- Path helpers (standalone copy of core.js root logic) ----
  function siteRel() {
    var p = location.pathname;
    var idx = p.lastIndexOf('/norcetprep/');
    var rest = idx !== -1 ? p.slice(idx + '/norcetprep/'.length) : p.replace(/^\//, '');
    if (rest === '' || /\/$/.test(rest)) rest += 'index.html';
    return rest;
  }
  function rootPath() {
    var rest = siteRel();
    var slashes = (rest.match(/\//g) || []).length;
    return slashes === 0 ? './' : new Array(slashes + 1).join('../');
  }

  // ---- App-mode ----
  function detectAppMode() {
    try {
      if (/[?&]src=twa(&|$)/.test(location.search)) {
        sessionStorage.setItem('nd.appMode', '1');
      } else if ((document.referrer || '').indexOf('android-app://') === 0) {
        sessionStorage.setItem('nd.appMode', '1');
      }
      return sessionStorage.getItem('nd.appMode') === '1';
    } catch (e) { return false; }
  }
  var APP_MODE = detectAppMode();
  if (APP_MODE && document.documentElement) {
    document.documentElement.setAttribute('data-appmode', '1');
  }

  // ---- Styles (injected so every page gets them without a CSS edit) ----
  function injectStyles() {
    if (document.getElementById('nd-paywall-css')) return;
    var s = document.createElement('style');
    s.id = 'nd-paywall-css';
    s.textContent =
      'html[data-appmode="1"] .nd-buy-only{display:none !important}' +
      '.nd-wall{position:fixed;inset:0;z-index:9999;background:var(--bg,#f6f9f8);color:var(--text,#182830);' +
        'display:flex;align-items:center;justify-content:center;padding:20px;overflow:auto}' +
      '.nd-wall__card{max-width:420px;width:100%;background:var(--surface,#fff);border:1.5px solid var(--line,#d9e4e1);' +
        'border-radius:16px;padding:28px 24px;text-align:center;font:16px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}' +
      '.nd-wall__lock{font-size:34px}' +
      '.nd-wall__title{font-weight:800;font-size:20px;margin:8px 0 6px}' +
      '.nd-wall__sub{font-size:14.5px;color:var(--muted,#4e6570);margin:0 0 16px}' +
      '.nd-wall__btn{display:block;width:100%;box-sizing:border-box;padding:12px 16px;border-radius:12px;margin:8px 0 0;' +
        'font-weight:700;text-decoration:none;border:1.5px solid transparent;cursor:pointer;font-size:15.5px}' +
      '.nd-wall__btn--primary{background:#0E7C7B;color:#fff}' +
      '.nd-wall__btn--quiet{background:transparent;color:inherit;border-color:var(--line,#d9e4e1)}' +
      '.nd-wall__foot{font-size:12.5px;color:var(--muted,#4e6570);margin-top:14px}';
    (document.head || document.documentElement).appendChild(s);
  }

  // ---- Entitlement check ----
  var checkPromise = null;

  function firebaseReady(cb) {
    // Wait first for firebase-config.js to have run (it defines
    // NM_FIREBASE_CONFIGURED) — core.js loads it after the SDK chain, which
    // can be after this file. Then wait for the SDK objects themselves.
    var tries = 0;
    (function wait() {
      if (typeof window.NM_FIREBASE_CONFIGURED !== 'undefined') {
        if (!window.NM_FIREBASE_CONFIGURED) return cb(false);
        if (window.firebase && window.firebase.auth && window.firebase.firestore) return cb(true);
      }
      if (++tries > 120) return cb(false);
      setTimeout(wait, 100);
    })();
  }

  function cacheGet(uid) {
    try {
      var raw = sessionStorage.getItem('nd.ent.' + uid);
      if (!raw) return null;
      var c = JSON.parse(raw);
      if (Date.now() - c.at > 10 * 60 * 1000) return null;
      return c;
    } catch (e) { return null; }
  }
  function cacheSet(uid, until) {
    try { sessionStorage.setItem('nd.ent.' + uid, JSON.stringify({ until: until, at: Date.now() })); } catch (e) {}
  }

  function check() {
    if (checkPromise) return checkPromise;
    checkPromise = new Promise(function (resolve) {
      if (!PAYWALL_ENABLED) return resolve({ status: 'open', until: null });
      firebaseReady(function (ok) {
        if (!ok) return resolve({ status: 'anon', until: null });
        var off = window.firebase.auth().onAuthStateChanged(function (user) {
          off();
          if (!user || user.isAnonymous) return resolve({ status: 'anon', until: null });
          var cached = cacheGet(user.uid);
          if (cached && cached.until && cached.until > Date.now()) {
            return resolve({ status: 'premium', until: new Date(cached.until) });
          }
          window.firebase.firestore().collection('users').doc(user.uid).get()
            .then(function (snap) {
              var ent = snap.exists && snap.data().entitlements && snap.data().entitlements.norcet;
              var until = ent && ent.paid_until && ent.paid_until.toDate ? ent.paid_until.toDate() : null;
              cacheSet(user.uid, until ? until.getTime() : 0);
              if (until && until > new Date()) resolve({ status: 'premium', until: until });
              else resolve({ status: 'free', until: null });
            })
            .catch(function () {
              // Offline with Firestore persistence: a cached premium doc would
              // have resolved above via get(); on hard failure stay locked.
              resolve({ status: cached && cached.until ? 'premium' : 'free', until: null });
            });
        });
      });
    });
    return checkPromise;
  }

  // ---- Interstitial ----
  function track(name, params) {
    // analytics.js loads in parallel — retry briefly rather than drop.
    var tries = 0;
    (function go() {
      if (typeof window.NDTrack === 'function') return window.NDTrack(name, params);
      if (++tries < 20) setTimeout(go, 250);
    })();
  }

  function showWall(state) {
    if (document.getElementById('nd-wall')) return;
    injectStyles();
    var root = rootPath();
    var here = encodeURIComponent(location.pathname + location.search);
    var wall = document.createElement('div');
    wall.className = 'nd-wall';
    wall.id = 'nd-wall';
    var inner;
    if (APP_MODE) {
      // Play billing policy: zero purchase UI, zero price, zero link-out.
      inner =
        '<div class="nd-wall__lock">🔒</div>' +
        '<div class="nd-wall__title">This content is locked</div>' +
        '<p class="nd-wall__sub">Already purchased? Sign in and it unlocks on this device.</p>' +
        '<a class="nd-wall__btn nd-wall__btn--primary" href="' + root + 'account.html?next=' + here + '">Sign in</a>';
    } else if (state === 'free') {
      inner =
        '<div class="nd-wall__lock">🔒</div>' +
        '<div class="nd-wall__title">This is premium content</div>' +
        '<p class="nd-wall__sub">Your account is on the free tier. One payment unlocks the full mock library and the complete Mains toolkit — no auto-renewal, ever.</p>' +
        '<a class="nd-wall__btn nd-wall__btn--primary nd-buy-only" href="' + root + 'pricing.html">See plans — from ₹249</a>' +
        '<div class="nd-wall__foot">Paid with a different email? Write to support@nursedrill.com and we\'ll move it.</div>';
    } else {
      inner =
        '<div class="nd-wall__lock">🔒</div>' +
        '<div class="nd-wall__title">This is premium content</div>' +
        '<p class="nd-wall__sub">One payment unlocks the full mock library and the complete Mains toolkit — no auto-renewal, ever. 7-day no-questions refund.</p>' +
        '<a class="nd-wall__btn nd-wall__btn--primary nd-buy-only" href="' + root + 'pricing.html">See plans — from ₹249</a>' +
        '<a class="nd-wall__btn nd-wall__btn--quiet" href="' + root + 'account.html?next=' + here + '">Already purchased? Sign in</a>';
    }
    wall.innerHTML = '<div class="nd-wall__card">' + inner +
      '<div class="nd-wall__foot"><a href="' + root + 'index.html" style="color:inherit">← Back to the free site</a></div></div>';
    function mount() {
      document.body.appendChild(wall);
      document.body.style.overflow = 'hidden';
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount);
    if (!APP_MODE) track('paywall_view', { page: siteRel() });
  }

  function guard() {
    return check().then(function (r) {
      if (r.status === 'anon' || r.status === 'free') showWall(r.status);
      return r;
    });
  }

  // ---- App-mode blackout for purchase routes (pricing/checkout) ----
  function blackoutPurchasePage() {
    injectStyles();
    var root = rootPath();
    function mount() {
      document.body.innerHTML = '';
      var wall = document.createElement('div');
      wall.className = 'nd-wall';
      wall.innerHTML =
        '<div class="nd-wall__card">' +
        '<div class="nd-wall__lock">🔒</div>' +
        '<div class="nd-wall__title">Not available in the app</div>' +
        '<p class="nd-wall__sub">Already purchased? Sign in and your access unlocks here.</p>' +
        '<a class="nd-wall__btn nd-wall__btn--primary" href="' + root + 'account.html">Sign in</a>' +
        '<a class="nd-wall__btn nd-wall__btn--quiet" href="' + root + 'index.html">Back to home</a>' +
        '</div>';
      document.body.appendChild(wall);
    }
    if (document.body) mount();
    else document.addEventListener('DOMContentLoaded', mount);
  }

  // ---- Auto-behavior by path ----
  // Premium pages guard themselves here — no per-page edits. Free shells
  // (merchandising pages that render their own lock states) are listed out.
  var FREE_MAINS = {
    'mains-plan/index.html': 1,      // Today hub — nav shell
    'mains-plan/mocks/index.html': 1, // mock library — renders locked tiles
    'mains-plan/mocks/mock.html': 1,  // gates itself via data (free sample mocks run)
    'mains-plan/notes/index.html': 1, // notes — foundation section is the free sample
    'mains-plan/syllabus.html': 1,    // syllabus structure is public knowledge
    'mains-plan/watch.html': 1,       // free YouTube links
    'mains-plan/settings.html': 1
  };
  var PURCHASE_PAGES = { 'pricing.html': 1, 'checkout.html': 1, 'checkout-success.html': 1 };

  function auto() {
    var rel = siteRel();
    if (APP_MODE && PURCHASE_PAGES[rel]) { blackoutPurchasePage(); return; }
    if (!PAYWALL_ENABLED) return;
    if (rel.indexOf('mains-plan/') === 0 && !FREE_MAINS[rel]) guard();
  }

  ND.paywall = {
    enabled: function () { return PAYWALL_ENABLED; },
    appMode: function () { return APP_MODE; },
    check: check,
    guard: guard,
    rootPath: rootPath
  };
  if (window.NM) window.NM.paywall = ND.paywall;

  auto();
})();
