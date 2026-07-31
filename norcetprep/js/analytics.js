// NurseDrill analytics (Phase 3) — GA4 via the Firebase SDK, T12's minimal
// six-event funnel and nothing more:
//   signup · paywall_view · checkout_click · purchase ·
//   quiz_start / quiz_complete (daily quiz — wired when it ships) ·
//   share_report (report cards — wired when they ship)
//
// NDTrack(name, params) is a global no-op until Firebase Analytics is live
// (real config incl. measurementId). Events fired before the SDK settles are
// queued for a few seconds, then dropped — never block the page on analytics.
(function () {
  'use strict';
  var queue = [];
  var started = Date.now();

  function ga() {
    try {
      if (window.firebase && window.firebase.analytics && window.NM_FIREBASE_CONFIGURED &&
          window.NM_FIREBASE_CONFIG && !/^YOUR_/.test(window.NM_FIREBASE_CONFIG.measurementId || 'YOUR_')) {
        return window.firebase.analytics();
      }
    } catch (e) {}
    return null;
  }

  function drain() {
    var a = ga();
    if (a) {
      while (queue.length) {
        var ev = queue.shift();
        try { a.logEvent(ev.name, ev.params); } catch (e) {}
      }
      return;
    }
    if (Date.now() - started < 8000 && queue.length) setTimeout(drain, 500);
    else queue.length = 0;
  }

  window.NDTrack = function (name, params) {
    var a = ga();
    if (a) { try { a.logEvent(name, params || {}); } catch (e) {} return; }
    queue.push({ name: name, params: params || {} });
    setTimeout(drain, 500);
  };
  if (window.NM) window.NM.track = window.NDTrack;
})();
