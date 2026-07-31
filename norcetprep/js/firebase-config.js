/*
 * Firebase configuration for NORCET Mains 2026 Intensive.
 *
 * Paste the real project's web config here to enable cross-device progress sync
 * and server-side question reports. Until that's done, the app will run in
 * local-only mode (sync-code UI falls back to JSON export / import).
 *
 * The same Firebase project is reused across /rrbprep/ and /norcetprep/.
 * In the Firebase console enable:
 *   - Anonymous Authentication (Auth → Sign-in method)
 *   - Cloud Firestore
 *
 * Firestore rules live in firebase/firestore.rules at repo root.
 */

(function () {
  'use strict';
  const FIREBASE_CONFIG = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"   // G-… — enables the GA4 funnel (js/analytics.js)
  };

  window.NM_FIREBASE_CONFIG = FIREBASE_CONFIG;
  window.NM_FIREBASE_READY = false;

  function isPlaceholder(v) { return !v || /^YOUR_/.test(v); }
  const configured = !isPlaceholder(FIREBASE_CONFIG.apiKey) && !isPlaceholder(FIREBASE_CONFIG.projectId);
  window.NM_FIREBASE_CONFIGURED = configured;

  if (!configured) {
    console.info('[NM] Firebase config is placeholder — running in local-only mode.');
    return;
  }

  function waitForSdk(cb, attempts) {
    attempts = attempts || 0;
    if (window.firebase && window.firebase.firestore && window.firebase.auth) return cb();
    if (attempts > 50) { console.warn('[NM] Firebase SDK failed to load.'); return; }
    setTimeout(function () { waitForSdk(cb, attempts + 1); }, 100);
  }

  waitForSdk(function () {
    try {
      if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
      const auth = firebase.auth();
      const db = firebase.firestore();
      // Offline persistence: entitled users keep cached premium banks/mocks
      // readable offline (Phase 3, airplane-mode mock-taking). Multi-tab
      // conflicts are non-fatal — persistence just stays off in extra tabs.
      try { db.enablePersistence({ synchronizeTabs: true }).catch(function () {}); } catch (e) {}
      window.NM_AUTH = auth;
      window.NM_DB = db;
      auth.onAuthStateChanged(function (user) {
        if (user) {
          window.NM_UID = user.uid;
          window.NM_FIREBASE_READY = true;
          document.dispatchEvent(new CustomEvent('nm-firebase-ready'));
        }
      });
      if (!auth.currentUser) auth.signInAnonymously().catch(function (e) { console.warn('[NM] anon auth failed', e); });
    } catch (e) {
      console.warn('[NM] Firebase init failed', e);
    }
  });
})();
