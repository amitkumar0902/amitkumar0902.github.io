// NurseDrill content loader (Phase 3).
// ND.content.json(url) — drop-in for fetch(url).then(r => r.json()).
//
// Free files load from static hosting exactly as before. Premium files, once
// the paywall is enabled, load from Firestore `content/norcet/files/{slug}`
// (rules-gated by entitlements.norcet.paid_until) — the static copies leave
// the product domain at go-live (firebase.json ignore, see DEPLOY.md).
// Files over ~900KB are stored as string parts under `content/norcet/chunks/`
// and reassembled here — one Firestore read per chunk.
//
// The premium list below is mirrored in scripts/upload-content.mjs — change
// both together.
(function () {
  'use strict';
  var ND = window.ND = window.ND || {};

  var PREMIUM_PREFIXES = [
    'data/mains/question-bank.json',
    'data/mains/mocks/',
    'data/mains/pyqs/',
    'data/mains/notes/',
    'data/mains/flashcards/',
    'data/mains/day-slices/',
    'data/mains/topics/',
    'data/mains/frequency-analysis.json',
    'data/mains/_audit/',
    'data/mains/drill-drug-calc.json',
    'data/mains/mock-blueprint.json'
  ];
  // Free exceptions inside premium prefixes: merchandising metadata + the
  // open quality sample (T06: "open samples of Mains notes").
  var FREE_EXCEPTIONS = {
    'data/mains/mocks/index.json': 1,
    'data/mains/notes/foundation.json': 1
  };

  function sitePath(url) {
    // '../../data/mains/x.json' | '/norcetprep/data/…' | 'data/…' → 'data/…'
    var m = String(url).match(/(?:^|\/)(data\/.+)$/);
    return m ? m[1] : null;
  }
  function isPremium(url) {
    var p = sitePath(url);
    if (!p || FREE_EXCEPTIONS[p]) return false;
    for (var i = 0; i < PREMIUM_PREFIXES.length; i++) {
      var pre = PREMIUM_PREFIXES[i];
      if (pre.slice(-1) === '/' ? p.indexOf(pre) === 0 : p === pre) return true;
    }
    return false;
  }

  function staticJson(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) { var e = new Error('HTTP ' + r.status); e.code = 'http'; throw e; }
      return r.json();
    });
  }

  function slugOf(path) { return path.replace(/\//g, '~'); }

  var memo = {};

  function firestoreJson(path) {
    var db = window.firebase.firestore();
    var slug = slugOf(path);
    var fileRef = db.collection('content').doc('norcet').collection('files').doc(slug);
    return fileRef.get().then(function (snap) {
      if (!snap.exists) { var e = new Error('Missing content doc: ' + slug); e.code = 'missing'; throw e; }
      var d = snap.data();
      if (!d.parts) return JSON.parse(d.json);
      var reads = [];
      for (var i = 0; i < d.parts; i++) {
        reads.push(db.collection('content').doc('norcet').collection('chunks').doc(slug + '.p' + i).get());
      }
      return Promise.all(reads).then(function (snaps) {
        var joined = snaps.map(function (s) {
          if (!s.exists) { var e = new Error('Missing chunk of ' + slug); e.code = 'missing'; throw e; }
          return s.data().json;
        }).join('');
        return JSON.parse(joined);
      });
    }).catch(function (e) {
      if (e && e.code === 'permission-denied') { var pe = new Error('Premium content is locked'); pe.code = 'locked'; throw pe; }
      throw e;
    });
  }

  ND.content = {
    isPremium: isPremium,
    json: function (url) {
      if (!window.ND.paywall || !ND.paywall.enabled() || !isPremium(url)) return staticJson(url);
      var p = sitePath(url);
      if (memo[p]) return memo[p];
      memo[p] = ND.paywall.check().then(function (r) {
        if (r.status !== 'premium') { var e = new Error('Premium content is locked'); e.code = 'locked'; throw e; }
        return firestoreJson(p);
      });
      memo[p].catch(function () { delete memo[p]; });
      return memo[p];
    },
    // For catch blocks: a short user-facing line for load failures.
    errorText: function (e) {
      if (e && e.code === 'locked') return 'This is premium content — see pricing to unlock.';
      return 'Could not load. Check your connection and retry.';
    }
  };
  if (window.NM) window.NM.content = ND.content;
})();
