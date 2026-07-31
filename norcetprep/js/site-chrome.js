// Shared site chrome: the trust footer and the incident banner.
//
// One file so a page needs one script tag, not three. Safe to load anywhere —
// it works with or without core.js, on both origins, and degrades to nothing
// when Firebase is unconfigured.
//
//  * Footer   — brand, the trust links (methodology + fix-log), legal links and
//               the AIIMS non-affiliation line. Skipped on pages that already
//               have one (they carry [data-nd-footer] or .ce-footer).
//  * Banner   — reads config/site.incident from Firestore. Flip
//               {active:true, message:"…"} in the console and every page family
//               shows the notice within a page load; clear it and the banner
//               goes. Readable by signed-out visitors by rule.
(function () {
  'use strict';
  var ND = window.ND = window.ND || {};

  function rootPath() {
    if (window.NM && typeof NM.rootPath === 'function') return NM.rootPath();
    var p = location.pathname;
    var idx = p.lastIndexOf('/norcetprep/');
    var rest = idx !== -1 ? p.slice(idx + '/norcetprep/'.length) : p.replace(/^\//, '');
    var slashes = (rest.match(/\//g) || []).length;
    return slashes === 0 ? './' : new Array(slashes + 1).join('../');
  }

  function injectStyles() {
    if (document.getElementById('nd-chrome-css')) return;
    var s = document.createElement('style');
    s.id = 'nd-chrome-css';
    s.textContent =
      '.nd-sitefooter{margin:40px auto 0;padding:18px 20px 26px;max-width:720px;' +
        'border-top:1px solid rgba(128,128,128,.28);font:500 13px/1.7 Manrope,-apple-system,"Segoe UI",Roboto,sans-serif;' +
        'text-align:center;opacity:.85}' +
      '.nd-sitefooter b{display:block;font-weight:800;letter-spacing:-.01em;font-size:15px;margin-bottom:6px}' +
      '.nd-sitefooter a{color:inherit;text-decoration:none;border-bottom:1px solid rgba(128,128,128,.35)}' +
      '.nd-sitefooter a:hover{border-bottom-color:currentColor}' +
      '.nd-sitefooter .nd-disc{display:block;margin-top:10px;font-size:12.5px;opacity:.75}' +
      '.nd-incident{position:sticky;top:0;z-index:9998;background:#7a2e12;color:#fff;' +
        'padding:10px 16px;font:600 13.5px/1.5 Manrope,-apple-system,"Segoe UI",Roboto,sans-serif;text-align:center}' +
      '.nd-incident a{color:#ffd9c7}' +
      '@media print{.nd-incident{display:none}}';
    (document.head || document.documentElement).appendChild(s);
  }

  // ---- footer ----------------------------------------------------------------

  function footerHtml() {
    var r = rootPath();
    return '<b>NurseDrill</b>' +
      '<a href="' + r + 'index.html">Home</a> · ' +
      '<a href="' + r + 'methodology.html">How questions are made</a> · ' +
      '<a href="' + r + 'fix-log.html">Fix-log</a> · ' +
      '<a class="nd-buy-only" href="' + r + 'pricing.html">Pricing</a> · ' +
      '<a href="' + r + 'account.html">Account</a> · ' +
      '<a href="' + r + 'legal/terms.html">Terms</a> · ' +
      '<a href="' + r + 'legal/privacy.html">Privacy</a> · ' +
      '<a href="' + r + 'legal/refund.html">Refunds</a> · ' +
      '<a href="' + r + 'legal/contact.html">Contact</a>' +
      '<span class="nd-disc">Not affiliated with or endorsed by AIIMS. Exam names are used ' +
      'descriptively. No promise of selection or rank.</span>';
  }

  function mountFooter() {
    if (document.querySelector('[data-nd-footer], .ce-footer')) return;
    var f = document.createElement('footer');
    f.className = 'nd-sitefooter';
    f.setAttribute('data-nd-footer', '1');
    f.innerHTML = footerHtml();
    document.body.appendChild(f);
    // App-mode (TWA) must show no purchase path at all.
    if (window.ND && ND.paywall && ND.paywall.appMode()) {
      var buy = f.querySelector('.nd-buy-only');
      if (buy && buy.previousSibling) buy.previousSibling.textContent = ' ';
      if (buy) buy.remove();
    }
  }

  // ---- incident banner --------------------------------------------------------

  function showIncident(msg) {
    if (document.querySelector('.nd-incident')) return;
    injectStyles();
    var b = document.createElement('div');
    b.className = 'nd-incident';
    b.setAttribute('role', 'status');
    b.textContent = msg;
    document.body.insertBefore(b, document.body.firstChild);
  }

  function firebaseReady(cb) {
    var tries = 0;
    (function wait() {
      if (typeof window.NM_FIREBASE_CONFIGURED !== 'undefined') {
        if (!window.NM_FIREBASE_CONFIGURED) return cb(false);
        if (window.firebase && window.firebase.firestore) return cb(true);
      }
      if (++tries > 100) return cb(false);
      setTimeout(wait, 100);
    })();
  }

  var INCIDENT_CACHE = 'nd.incident';

  function checkIncident() {
    // Show the last known incident immediately (one page load of staleness is
    // better than a blank page during an outage), then reconcile with the flag.
    try {
      var cached = JSON.parse(sessionStorage.getItem(INCIDENT_CACHE) || 'null');
      if (cached && cached.active && cached.message) showIncident(cached.message);
    } catch (e) {}

    firebaseReady(function (ok) {
      if (!ok) return;
      window.firebase.firestore().collection('config').doc('site').get()
        .then(function (snap) {
          var inc = (snap.exists && snap.data().incident) || null;
          var active = !!(inc && inc.active && inc.message);
          try { sessionStorage.setItem(INCIDENT_CACHE, JSON.stringify(active ? inc : { active: false })); } catch (e) {}
          var el = document.querySelector('.nd-incident');
          if (active) {
            if (el) el.textContent = inc.message;
            else showIncident(inc.message);
          } else if (el) {
            el.remove();
          }
        })
        .catch(function () { /* offline or rules not deployed yet — stay quiet */ });
    });
  }

  function boot() {
    injectStyles();
    mountFooter();
    checkIncident();
  }

  ND.chrome = { mountFooter: mountFooter, showIncident: showIncident };

  if (document.body) boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
