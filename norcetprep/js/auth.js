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
    renderRefund(ent, live);
  }

  // ---- Self-serve refund request (T14 / PRD user story 13) ----
  // 7 days, no questions, one per account. The user files the request here; the
  // owner refunds in the gateway dashboard and the webhook revokes access. A
  // client can never mark its own refund approved — rules forbid the update.
  var REFUND_DAYS = 7;

  function grantedAt(ent) {
    var t = ent && (ent.grantedAt || ent.paid_until);
    try { return t && t.toDate ? t.toDate() : null; } catch (e) { return null; }
  }

  function renderRefund(ent, live) {
    var row = $('refund-row');
    if (!row) return;
    if (!live) { row.style.display = 'none'; return; }
    row.style.display = '';

    var already = state.doc && state.doc.refund && state.doc.refund.used;
    var since = grantedAt(ent);
    var daysIn = since ? Math.floor((Date.now() - since.getTime()) / 86400000) : null;
    var inWindow = daysIn !== null && daysIn <= REFUND_DAYS;

    if (already) {
      $('refund-window').textContent = 'The one refund this account is entitled to has been used.';
      $('btn-refund').style.display = 'none';
      return;
    }
    if (!inWindow) {
      $('refund-window').textContent = 'The 7-day refund window for this purchase has passed. ' +
        'If something is wrong with your access, write to support@nursedrill.com — access problems are fixed the same day.';
      $('btn-refund').style.display = 'none';
      return;
    }
    var left = REFUND_DAYS - daysIn;
    $('refund-window').textContent = left + ' day' + (left === 1 ? '' : 's') +
      ' left in your 7-day no-questions refund window. One refund per account.';
  }

  function openRefund() {
    $('refund-form').style.display = '';
    $('btn-refund').style.display = 'none';
  }

  function sendRefund() {
    var status = $('refund-status');
    var orderRef = ($('refund-order').value || '').trim();
    if (!orderRef) { status.textContent = 'Add the order or payment reference from your receipt so we can find the payment.'; return; }
    var ent = state.doc && state.doc.entitlements && state.doc.entitlements.norcet;
    $('btn-refund-send').disabled = true;
    status.textContent = 'Filing your request…';

    window.firebase.firestore().collection('refundRequests').add({
      uid: state.user.uid,
      email: state.user.email || '',
      orderRef: orderRef.slice(0, 120),
      reason: (($('refund-reason').value || '').trim()).slice(0, 500),
      status: 'requested',
      paidUntil: (ent && ent.paid_until) || null,
      createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
    }).then(function () {
      $('refund-form').style.display = 'none';
      status.textContent = 'Request filed. We process refunds within 48 hours; your bank shows the money ' +
        'in 5–7 business days. Access stays on until the refund goes through.';
    }).catch(function (e) {
      $('btn-refund-send').disabled = false;
      status.textContent = 'Could not file that. Email support@nursedrill.com with your order reference — ' +
        'payment issues are handled the same day. (' + human(e) + ')';
    });
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
    if ($('btn-refund')) $('btn-refund').onclick = openRefund;
    if ($('btn-refund-send')) $('btn-refund-send').onclick = sendRefund;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }
})();
