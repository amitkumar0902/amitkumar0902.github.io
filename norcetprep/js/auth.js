// NurseDrill accounts (Phase 2) — Google + email/password sign-in, user doc,
// device telemetry, progress merge, account deletion. Loaded by account.html
// alongside the Firebase compat SDK, firebase-config.js, core.js, and sync.js.
//
// Progress model: local nm.v1.* localStorage is the working copy. On sign-in,
// the remote users/{uid}.progress map is merged INTO local via the per-key
// policies in js/sync.js, then the merged local snapshot is written back up.
(function () {
  'use strict';

  var $ = function (id) { return document.getElementById(id); };
  var state = { user: null, doc: null };

  function show(id) {
    ['auth-loading', 'auth-disabled', 'auth-out', 'auth-in'].forEach(function (v) {
      var el = $(v); if (el) el.style.display = v === id ? '' : 'none';
    });
  }
  function err(msg) {
    ['auth-err', 'auth-err-in'].forEach(function (id) {
      var el = $(id); if (el) el.textContent = msg || '';
    });
  }
  function human(e) {
    var c = (e && e.code) || '';
    if (c.indexOf('wrong-password') !== -1 || c.indexOf('invalid-credential') !== -1) return 'Wrong email or password.';
    if (c.indexOf('user-not-found') !== -1) return 'No account with that email — choose "Create account".';
    if (c.indexOf('email-already-in-use') !== -1) return 'That email already has an account — choose "Sign in".';
    if (c.indexOf('weak-password') !== -1) return 'Password needs at least 6 characters.';
    if (c.indexOf('popup-closed') !== -1) return 'Sign-in window was closed before finishing.';
    if (c.indexOf('network') !== -1) return 'Network problem — check your connection and retry.';
    return (e && e.message) || 'Something went wrong. Try again.';
  }

  function deviceId() {
    var k = 'nd.deviceId';
    var v = null;
    try { v = localStorage.getItem(k); } catch (e) {}
    if (!v) {
      v = 'd-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { localStorage.setItem(k, v); } catch (e) {}
    }
    return v;
  }

  function db() { return window.firebase.firestore(); }
  function userRef() { return db().collection('users').doc(state.user.uid); }
  function serverTs() { return window.firebase.firestore.FieldValue.serverTimestamp(); }

  // Merge remote progress into local (per-key policies from sync.js), then
  // push the merged snapshot back up. Also records this device.
  function syncAccount() {
    return userRef().get().then(function (snap) {
      var data = snap.exists ? snap.data() : null;
      state.doc = data;
      var remote = (data && data.progress) || {};
      if (window.NM && NM.sync) {
        try { NM.sync.merge({ schema: 1, keys: remote }); } catch (e) {}
      }
      var localKeys = (window.NM && NM.sync) ? NM.sync.snapshot().keys : {};
      var patch = {
        email: state.user.email || null,
        progress: localKeys,
        progressSyncedAt: serverTs(),
        devices: {}
      };
      if (!snap.exists) {
        patch.createdAt = serverTs();
        if (window.NDTrack) {
          var prov = (state.user.providerData && state.user.providerData[0]) || {};
          NDTrack('signup', { method: prov.providerId || 'password' });
        }
      }
      patch.devices[deviceId()] = {
        ua: (navigator.userAgent || '').slice(0, 120),
        lastSeen: serverTs()
      };
      return userRef().set(patch, { merge: true });
    }).then(function () {
      return userRef().get();
    }).then(function (snap) {
      state.doc = snap.exists ? snap.data() : null;
      renderAccount();
    });
  }

  function fmtDate(ts) {
    try {
      var d = ts && ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) { return String(ts); }
  }

  function renderAccount() {
    if (!state.user) return;
    $('acct-email').textContent = state.user.email || '(no email)';
    var ent = state.doc && state.doc.entitlements && state.doc.entitlements.norcet;
    var live = ent && ent.paid_until && ent.paid_until.toDate && ent.paid_until.toDate() > new Date();
    $('acct-plan').textContent = live ? ('Premium until ' + fmtDate(ent.paid_until)) : 'Free tier';
    $('acct-plan').className = live ? 'plan premium' : 'plan';
    var devs = (state.doc && state.doc.devices) || {};
    var list = Object.keys(devs).map(function (id) {
      var d = devs[id] || {};
      var me = id === deviceId() ? ' · this device' : '';
      var seen = d.lastSeen ? fmtDate(d.lastSeen) : '';
      return '<li>' + (d.ua || 'device').split(')')[0].slice(0, 60) + me +
             ' <span class="muted small">' + seen + '</span></li>';
    });
    $('acct-devices').innerHTML = list.join('') || '<li class="muted">Just this one, so far.</li>';
  }

  // ---- Auth actions ----
  function google() {
    err('');
    var p = new window.firebase.auth.GoogleAuthProvider();
    window.firebase.auth().signInWithPopup(p).catch(function (e) { err(human(e)); });
  }
  function emailSubmit(create) {
    err('');
    var em = ($('f-email').value || '').trim();
    var pw = $('f-pw').value || '';
    if (!em || !pw) { err('Email and password, please.'); return; }
    var auth = window.firebase.auth();
    (create ? auth.createUserWithEmailAndPassword(em, pw)
            : auth.signInWithEmailAndPassword(em, pw))
      .catch(function (e) { err(human(e)); });
  }
  function reset() {
    err('');
    var em = ($('f-email').value || '').trim();
    if (!em) { err('Type your email above first, then click reset.'); return; }
    window.firebase.auth().sendPasswordResetEmail(em)
      .then(function () { err('Reset email sent — check your inbox.'); })
      .catch(function (e) { err(human(e)); });
  }
  function signOut() {
    window.firebase.auth().signOut();
  }

  // Account deletion (Play requirement): remove the Firestore doc, the auth
  // user, and this device's local study data.
  function destroy() {
    if (!window.confirm('Delete your account and all synced data? This cannot be undone.')) return;
    err('');
    var user = state.user;
    userRef().delete().then(function () {
      return user.delete();
    }).then(wipeLocal).catch(function (e) {
      if (e && e.code === 'auth/requires-recent-login') {
        reauth(user).then(function () {
          return userRef().delete().catch(function () {})
            .then(function () { return user.delete(); })
            .then(wipeLocal);
        }).catch(function (e2) { err(human(e2)); });
      } else { err(human(e)); }
    });
  }
  function reauth(user) {
    var isGoogle = (user.providerData || []).some(function (p) { return p.providerId === 'google.com'; });
    if (isGoogle) {
      return user.reauthenticateWithPopup(new window.firebase.auth.GoogleAuthProvider());
    }
    var pw = window.prompt('For safety, re-enter your password to delete the account:');
    if (!pw) return Promise.reject({ message: 'Deletion cancelled.' });
    var cred = window.firebase.auth.EmailAuthProvider.credential(user.email, pw);
    return user.reauthenticateWithCredential(cred);
  }
  function wipeLocal() {
    try {
      var kill = [];
      for (var i = 0; i < localStorage.length; i++) {
        var k = localStorage.key(i);
        if (k && (k.indexOf('nm.v1.') === 0 || k === 'nd.deviceId')) kill.push(k);
      }
      kill.forEach(function (k) { localStorage.removeItem(k); });
    } catch (e) {}
    err('Account deleted.');
  }

  // ---- Boot ----
  function boot() {
    if (!window.NM_FIREBASE_CONFIGURED) { show('auth-disabled'); return; }
    var tries = 0;
    (function wait() {
      if (window.firebase && window.firebase.auth && window.firebase.firestore) return ready();
      if (++tries > 60) { show('auth-disabled'); return; }
      setTimeout(wait, 100);
    })();
  }
  // ?next= support (checkout/paywall funnels): after sign-in + sync, bounce
  // to the requested page. Same-site relative paths only.
  function nextTarget() {
    var m = location.search.match(/[?&]next=([^&]+)/);
    if (!m) return null;
    var n = decodeURIComponent(m[1]);
    if (/^[a-zA-Z0-9]/.test(n) && n.indexOf('//') === -1 && n.indexOf(':') === -1 && n.indexOf('..') === -1) return n;
    return null;
  }
  var redirected = false;

  function ready() {
    window.firebase.auth().onAuthStateChanged(function (u) {
      if (u && !u.isAnonymous) {
        state.user = u;
        show('auth-in');
        syncAccount().then(function () {
          var next = nextTarget();
          if (next && !redirected) { redirected = true; location.replace(next); }
        }).catch(function (e) { err(human(e)); });
      } else {
        state.user = null; state.doc = null;
        show('auth-out');
      }
    });
    $('btn-google').onclick = google;
    $('btn-signin').onclick = function () { emailSubmit(false); };
    $('btn-create').onclick = function () { emailSubmit(true); };
    $('btn-reset').onclick = function (e) { e.preventDefault(); reset(); };
    $('btn-signout').onclick = signOut;
    $('btn-delete').onclick = destroy;
    $('btn-resync').onclick = function () {
      err('');
      syncAccount().then(function () { err('Progress synced.'); })
        .catch(function (e) { err(human(e)); });
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
