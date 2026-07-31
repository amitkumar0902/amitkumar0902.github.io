// Report-a-question module.
// Exposes window.NMReport.open(q) from anywhere a question is rendered.
// Writes to Firestore `reports/{autoId}` if Firebase is wired, otherwise
// appends to localStorage.reports for later manual review / next sync push.
(function () {
  'use strict';
  if (!window.NM) return;
  const NM = window.NM;

  const ISSUES = [
    { k: 'wrong-answer', l: 'Wrong answer' },
    { k: 'typo', l: 'Typo / unclear wording' },
    { k: 'outdated', l: 'Outdated (guideline changed)' },
    { k: 'bad-option', l: 'Option does not fit' },
    { k: 'other', l: 'Other' }
  ];

  function open(q) {
    if (document.getElementById('nm-report')) return;
    const o = document.createElement('div');
    o.className = 'overlay nm-report-modal';
    o.id = 'nm-report';
    o.innerHTML =
      '<div class="overlay-panel" role="dialog" aria-label="Report this question">' +
        '<h3 style="margin:0 0 8px">Report this question</h3>' +
        '<p class="small muted" style="margin:0 0 8px">Q #' + NM.escape(q.id) + ' &middot; ' + NM.escape(q.subject || '') + ' &middot; ' + NM.escape(q.topic || '') + '</p>' +
        '<p class="small" style="margin:0 0 10px"><em>' + NM.escape((q.question || '').slice(0, 180)) + (q.question && q.question.length > 180 ? '...' : '') + '</em></p>' +
        '<div class="issue-choices" id="nm-rep-choices">' +
          ISSUES.map(function (it, i) {
            return '<label><input type="radio" name="nm-rep-issue" value="' + it.k + '"' + (i === 0 ? ' checked' : '') + '><span>' + NM.escape(it.l) + '</span></label>';
          }).join('') +
        '</div>' +
        '<textarea id="nm-rep-note" placeholder="Optional: what\'s wrong?"></textarea>' +
        '<p class="small muted" style="margin:8px 0 0">Reports are triaged weekly. Fixes ship with ' +
        'the weekly publish and are listed, dated, in the ' +
        '<a href="' + NM.rootPath() + 'fix-log.html">public fix-log</a>. ' +
        'This isn\'t a doubt-solving channel — it\'s for errors in the question itself.</p>' +
        '<div class="btn-row" style="justify-content:flex-end;margin-top:12px">' +
          '<button class="btn btn--ghost" id="nm-rep-cancel">Cancel</button>' +
          '<button class="btn btn--accent" id="nm-rep-send">Send</button>' +
        '</div>' +
        '<p class="small muted" id="nm-rep-status" style="margin:8px 0 0;min-height:1.2em"></p>' +
      '</div>';
    document.body.appendChild(o);
    o.addEventListener('click', function (e) { if (e.target === o) close(); });
    document.getElementById('nm-rep-cancel').addEventListener('click', close);
    document.getElementById('nm-rep-send').addEventListener('click', function () { send(q); });
    setTimeout(function () { document.getElementById('nm-rep-note').focus(); }, 10);
  }
  function close() {
    const o = document.getElementById('nm-report');
    if (o) o.remove();
  }

  function send(q) {
    const issue = (document.querySelector('input[name="nm-rep-issue"]:checked') || {}).value || 'other';
    const note = document.getElementById('nm-rep-note').value.slice(0, 500);
    const status = document.getElementById('nm-rep-status');
    const sendBtn = document.getElementById('nm-rep-send');
    const payload = {
      qid: String(q.id),
      subject: q.subject || '',
      topic: q.topic || '',
      question: (q.question || '').slice(0, 200),
      issue: issue,
      note: note,
      ua: (navigator.userAgent || '').slice(0, 120),
      ts: Date.now()
    };
    sendBtn.disabled = true;
    status.textContent = 'Sending...';
    remoteSend(payload).then(function (ok) {
      appendLocal(payload, ok ? 'sent' : 'queued');
      status.textContent = ok ? 'Thanks — report sent.' : 'Saved locally; will sync next time you\'re online.';
      setTimeout(close, 900);
    }).catch(function () {
      appendLocal(payload, 'queued');
      status.textContent = 'Saved locally; will sync next time you\'re online.';
      setTimeout(close, 1200);
    });
  }

  function remoteSend(payload) {
    return new Promise(function (resolve) {
      if (!window.firebase || !window.NM_FIREBASE_READY || !window.NM_DB) {
        resolve(false);
        return;
      }
      try {
        window.NM_DB.collection('reports').add(Object.assign({}, payload, {
          createdAt: window.firebase.firestore.FieldValue.serverTimestamp()
        })).then(function () { resolve(true); }).catch(function () { resolve(false); });
      } catch (e) { resolve(false); }
    });
  }

  function appendLocal(payload, status) {
    const all = NM.get('reports', []);
    all.push(Object.assign({}, payload, { _status: status }));
    // keep only latest 100
    while (all.length > 100) all.shift();
    NM.set('reports', all);
  }

  window.NMReport = { open: open, close: close };
})();
