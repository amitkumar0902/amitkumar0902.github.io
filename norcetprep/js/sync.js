// Cross-device progress sync via a short-lived Firestore sync code.
// No accounts. Anonymous auth. Sender creates syncCodes/{code} with payload;
// receiver reads, merges into localStorage, marks consumed:true, reloads.
//
// Falls back to JSON export / import when Firebase isn't configured or offline.
(function () {
  'use strict';
  if (!window.NM) return;
  const NM = window.NM;
  const STORAGE_PREFIX = 'nm.v1.';
  const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no I/O/0/1

  function snapshot() {
    const out = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.indexOf(STORAGE_PREFIX) === 0) {
        try { out[k.slice(STORAGE_PREFIX.length)] = JSON.parse(localStorage.getItem(k)); }
        catch (e) { out[k.slice(STORAGE_PREFIX.length)] = localStorage.getItem(k); }
      }
    }
    return {
      schema: 1,
      exportedAt: Date.now(),
      ua: (navigator.userAgent || '').slice(0, 120),
      keys: out
    };
  }

  function randomCode(len) {
    let s = '';
    const buf = new Uint8Array(len);
    (window.crypto || window.msCrypto).getRandomValues(buf);
    for (let i = 0; i < len; i++) s += CODE_CHARS[buf[i] % CODE_CHARS.length];
    return s;
  }

  function waitForAuth(timeoutMs) {
    timeoutMs = timeoutMs || 4000;
    return new Promise(function (resolve, reject) {
      const start = Date.now();
      (function poll() {
        if (window.NM_FIREBASE_READY && window.NM_DB && window.NM_UID) return resolve();
        if (!window.NM_FIREBASE_CONFIGURED) return reject(new Error('firebase-not-configured'));
        if (Date.now() - start > timeoutMs) return reject(new Error('auth-timeout'));
        setTimeout(poll, 150);
      })();
    });
  }

  function push() {
    const payload = snapshot();
    if (!navigator.onLine) return Promise.reject(new Error('offline'));
    return waitForAuth().then(function () {
      const code = randomCode(6);
      return window.NM_DB.collection('syncCodes').doc(code).set({
        payload: payload,
        consumed: false,
        createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
      }).then(function () { return { code: code, expiresInMin: 15 }; });
    });
  }

  function pull(code) {
    if (!code) return Promise.reject(new Error('no-code'));
    code = code.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) return Promise.reject(new Error('invalid-code'));
    return waitForAuth().then(function () {
      const ref = window.NM_DB.collection('syncCodes').doc(code);
      return ref.get().then(function (snap) {
        if (!snap.exists) throw new Error('code-not-found');
        const data = snap.data();
        if (data.consumed) throw new Error('already-consumed');
        merge(data.payload);
        ref.update({ consumed: true }).catch(function () {});
        return { ok: true, exportedAt: data.payload && data.payload.exportedAt };
      });
    });
  }

  function merge(payload) {
    if (!payload || !payload.keys) throw new Error('bad-payload');
    const incoming = payload.keys;
    for (const k in incoming) {
      if (!incoming.hasOwnProperty(k)) continue;
      const incomingVal = incoming[k];
      const existing = NM.get(k);
      NM.set(k, mergeKey(k, existing, incomingVal));
    }
  }

  // Per-key merge policy.
  function mergeKey(key, local, incoming) {
    if (local === undefined || local === null) return incoming;
    if (incoming === undefined || incoming === null) return local;

    if (key === 'streak') {
      return {
        current: Math.max(local.current || 0, incoming.current || 0),
        longest: Math.max(local.longest || 0, incoming.longest || 0),
        last: (local.last && incoming.last) ? (local.last > incoming.last ? local.last : incoming.last) : (local.last || incoming.last)
      };
    }
    if (key === 'activity') {
      const out = Object.assign({}, local);
      for (const d in incoming) {
        if (!incoming.hasOwnProperty(d)) continue;
        const a = out[d] || { min: 0, q: 0 };
        const b = incoming[d] || { min: 0, q: 0 };
        out[d] = { min: Math.max(a.min || 0, b.min || 0), q: Math.max(a.q || 0, b.q || 0) };
      }
      return out;
    }
    if (key === 'srs') {
      const out = Object.assign({}, local);
      for (const qid in incoming) {
        if (!incoming.hasOwnProperty(qid)) continue;
        const a = out[qid]; const b = incoming[qid];
        if (!a) { out[qid] = b; continue; }
        out[qid] = {
          streak: Math.max(a.streak || 0, b.streak || 0),
          due: Math.max(a.due || 0, b.due || 0),
          graduated: !!(a.graduated || b.graduated)
        };
      }
      return out;
    }
    if (key === 'mockResults') {
      const seen = new Set();
      const all = [].concat(local || [], incoming || []);
      const out = [];
      all.sort(function (a, b) { return (b.date || '').localeCompare(a.date || ''); });
      for (const r of all) {
        const key2 = r.id + '|' + r.date;
        if (seen.has(key2)) continue;
        seen.add(key2); out.push(r);
      }
      return out;
    }
    if (key === 'practiceDone') {
      return Object.assign({}, local || {}, incoming || {}, mergeTrue(local, incoming));
    }
    if (key === 'daysCompleted' || key === 'daysOpened') {
      return Object.assign({}, local || {}, incoming || {}, mergeTrue(local, incoming));
    }
    if (key === 'reports') {
      return (local || []).concat(incoming || []).slice(-100);
    }
    if (/^mock\./.test(key) || /^practice\./.test(key)) {
      // Prefer the more-progressed session
      const progress = function (x) {
        if (!x || !x.answers) return -1;
        return x.answers.filter(function (a) { return a !== null; }).length;
      };
      return progress(incoming) > progress(local) ? incoming : local;
    }
    // Scalar preferences like theme, fontsize, bankMode → prefer incoming (last-write-wins)
    return incoming;
  }
  function mergeTrue(a, b) {
    const out = {};
    for (const k in a || {}) if (a[k] === true) out[k] = true;
    for (const k in b || {}) if (b[k] === true) out[k] = true;
    return out;
  }

  function downloadExport() {
    const data = snapshot();
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'norcet-mains-progress-' + new Date().toISOString().slice(0,10) + '.json';
    a.click();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    return data;
  }
  function importFromFile(file) {
    return new Promise(function (resolve, reject) {
      const r = new FileReader();
      r.onerror = function () { reject(new Error('read-failed')); };
      r.onload = function () {
        try {
          const data = JSON.parse(r.result);
          merge(data);
          resolve({ ok: true, exportedAt: data.exportedAt });
        } catch (e) { reject(e); }
      };
      r.readAsText(file);
    });
  }

  NM.sync = {
    snapshot: snapshot,
    push: push,
    pull: pull,
    merge: merge,
    downloadExport: downloadExport,
    importFromFile: importFromFile
  };
})();
