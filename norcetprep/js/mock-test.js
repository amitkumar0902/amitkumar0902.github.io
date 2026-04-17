// Mock runner — 160 Q / 180 min / 1/3 negative marking
// Loads data/mains/mocks/mock-N.json via URL ?id=N
(function () {
  'use strict';
  if (!window.NM) { console.error('core.js missing'); return; }
  const NM = window.NM;

  const params = new URLSearchParams(location.search);
  const MOCK_ID = parseInt(params.get('id') || '1', 10);
  const ROOT = NM.rootPath();
  const MOCK_KEY = 'mock.' + MOCK_ID;

  const state = {
    loaded: false,
    started: false,
    submitted: false,
    questions: [],
    answers: [],
    flags: new Set(),
    cur: 0,
    secs: 180 * 60,
    timer: null,
    title: 'Full Mock Test ' + MOCK_ID,
    startedAt: null
  };

  const $ = (s) => document.querySelector(s);

  function fmt(secs) {
    const h = Math.floor(secs/3600), m = Math.floor((secs%3600)/60), s = secs%60;
    return [h,m,s].map(n => String(n).padStart(2,'0')).join(':');
  }

  function init() {
    fetch(ROOT + 'data/mains/mocks/mock-' + MOCK_ID + '.json')
      .then(r => { if (!r.ok) throw new Error('Mock ' + MOCK_ID + ' not found'); return r.json(); })
      .then(d => {
        state.questions = d.questions;
        state.answers = new Array(d.questions.length).fill(null);
        state.secs = (d.minutes || 180) * 60;
        state.title = d.title || state.title;
        state.loaded = true;
        const saved = NM.get(MOCK_KEY);
        if (saved && !saved.submitted) {
          renderResume(saved);
        } else {
          renderLanding();
        }
      })
      .catch(e => {
        document.body.innerHTML = '<main class="page"><h1>Couldn\'t load mock</h1><p>' + NM.escape(e.message) + '</p></main>';
      });
  }

  function renderLanding() {
    document.title = state.title + ' · NORCET Mains';
    const root = $('#mock-root');
    const mix = {};
    state.questions.forEach(q => mix[q.subject] = (mix[q.subject] || 0) + 1);
    const rows = Object.entries(mix).sort((a,b)=>b[1]-a[1]).map(([s,n]) => '<tr><td>'+NM.escape(s)+'</td><td>'+n+'</td></tr>').join('');
    root.innerHTML =
      '<a class="back" href="index.html">← Back to Mocks</a>' +
      '<h1>' + NM.escape(state.title) + '</h1>' +
      '<p class="muted">160 questions · 180 minutes · +1 for correct · −1/3 for wrong · 0 for unattempted.</p>' +
      '<h2>Subject mix</h2>' +
      '<table><thead><tr><th>Subject</th><th>Qs</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<h2>Before you start</h2>' +
      '<ul>' +
        '<li>Timer auto-submits at 0:00. Final-10-minute warning at 10:00.</li>' +
        '<li>Keyboard: <kbd>1–4</kbd> pick, <kbd>Enter</kbd> next, <kbd>F</kbd> flag, <kbd>R</kbd> review, <kbd>←/→</kbd> navigate, <kbd>Esc</kbd> pause.</li>' +
        '<li>Progress auto-saves — you can refresh without losing answers.</li>' +
      '</ul>' +
      '<div class="btn-row">' +
        '<button class="btn btn--accent btn--big" id="mock-start">Start Mock · 180:00</button>' +
        '<a class="btn btn--ghost" href="index.html">Cancel</a>' +
      '</div>';
    $('#mock-start').addEventListener('click', start);
  }

  function renderResume(saved) {
    document.title = 'Resume · ' + state.title;
    const root = $('#mock-root');
    const answered = saved.answers.filter(a => a !== null).length;
    root.innerHTML =
      '<a class="back" href="index.html">← Back to Mocks</a>' +
      '<h1>' + NM.escape(state.title) + ' — in progress</h1>' +
      '<p>You left off at Q' + (saved.cur + 1) + ' with ' + answered + '/' + saved.answers.length + ' answered. Time remaining: <strong>' + fmt(saved.secs) + '</strong>.</p>' +
      '<div class="btn-row">' +
        '<button class="btn btn--accent btn--big" id="mock-resume">Resume</button>' +
        '<button class="btn btn--ghost" id="mock-restart">Start fresh</button>' +
        '<a class="btn btn--ghost" href="index.html">Cancel</a>' +
      '</div>';
    $('#mock-resume').addEventListener('click', () => {
      state.answers = saved.answers;
      state.flags = new Set(saved.flags || []);
      state.cur = saved.cur;
      state.secs = saved.secs;
      state.startedAt = saved.startedAt || Date.now();
      start(true);
    });
    $('#mock-restart').addEventListener('click', () => {
      NM.del(MOCK_KEY);
      renderLanding();
    });
  }

  function start(resuming) {
    state.started = true;
    if (!resuming) state.startedAt = Date.now();
    document.body.classList.add('focus-mode');
    renderRunner();
    renderQ();
    startTimer();
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(()=>{});
    }
    window.addEventListener('beforeunload', beforeUnload);
    installFocusExit();
  }

  function installFocusExit() {
    if (document.getElementById('focus-exit-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'focus-exit-btn';
    btn.className = 'btn btn--ghost focus-exit';
    btn.textContent = 'Exit focus';
    btn.addEventListener('click', function () {
      if (!confirm('Exit focus mode?\n\nThe mock stays in progress and auto-saves. You can resume from the mocks page.')) return;
      try { if (document.exitFullscreen) document.exitFullscreen().catch(()=>{}); } catch (e) {}
      document.body.classList.remove('focus-mode');
      btn.remove();
    });
    document.body.appendChild(btn);
  }

  function showTenMinToast() {
    if (document.getElementById('focus-10-toast')) return;
    const t = document.createElement('div');
    t.id = 'focus-10-toast';
    t.className = 'focus-warn-toast';
    t.innerHTML = '10 minutes remaining — review your flagged questions.<br><button class="btn btn--ghost btn--sm" style="margin-top:6px" id="dismiss-10">Dismiss</button>';
    document.body.appendChild(t);
    document.getElementById('dismiss-10').addEventListener('click', function () { t.remove(); });
  }

  function beforeUnload(e) {
    if (state.started && !state.submitted) {
      e.preventDefault(); e.returnValue = '';
      return '';
    }
  }

  function persist() {
    NM.set(MOCK_KEY, {
      answers: state.answers,
      flags: [...state.flags],
      cur: state.cur,
      secs: state.secs,
      startedAt: state.startedAt,
      submitted: false
    });
  }

  function startTimer() {
    if (state.timer) clearInterval(state.timer);
    state.timer = setInterval(() => {
      state.secs -= 1;
      persist();
      renderTimer();
      if (state.secs === 600) showTenMinToast();
      if (state.secs <= 0) { clearInterval(state.timer); submit(true); }
    }, 1000);
  }

  function renderTimer() {
    const el = $('#mock-timer'); if (!el) return;
    el.textContent = fmt(state.secs);
    el.classList.toggle('warn', state.secs <= 600 && state.secs > 300);
    el.classList.toggle('critical', state.secs <= 300);
  }

  function renderRunner() {
    document.title = state.title + ' · in progress';
    const root = $('#mock-root');
    root.innerHTML =
      '<div class="mock-header">' +
        '<div><strong>' + NM.escape(state.title) + '</strong> <span class="muted small">· Q <span id="mock-qno">1</span>/' + state.questions.length + '</span></div>' +
        '<div class="mock-timer" id="mock-timer">' + fmt(state.secs) + '</div>' +
        '<div><button class="iconbtn" id="mock-submit">Submit</button></div>' +
      '</div>' +
      '<div class="mock-body">' +
        '<section id="q-host"></section>' +
        '<aside class="mock-palette">' +
          '<h3>Question Palette</h3>' +
          '<div id="palette-grid" class="palette-grid"></div>' +
          '<p class="palette-legend">' +
            '<span><span class="sw sw-ans"></span>Answered</span>' +
            '<span><span class="sw sw-flag"></span>Flagged</span>' +
          '</p>' +
          '<p class="small muted">Shortcuts: <kbd>?</kbd> for help</p>' +
        '</aside>' +
      '</div>' +
      '<div class="mobile-bottom-bar">' +
        '<button class="btn btn--ghost" id="m-prev">Prev</button>' +
        '<button class="btn btn--ghost" id="m-flag">Flag</button>' +
        '<button class="btn btn--accent" id="m-next">Next</button>' +
      '</div>';
    renderPalette();
    $('#mock-submit').addEventListener('click', () => confirmSubmit());
    $('#m-prev').addEventListener('click', () => nav(-1));
    $('#m-next').addEventListener('click', () => nav(1));
    $('#m-flag').addEventListener('click', () => toggleFlag());
  }

  function renderPalette() {
    const grid = $('#palette-grid');
    grid.innerHTML = state.questions.map((_, i) => {
      const a = state.answers[i] !== null;
      const f = state.flags.has(i);
      const cur = i === state.cur;
      const cls = ['palette-cell'];
      if (a) cls.push('answered');
      if (f) cls.push('flagged');
      if (cur) cls.push('current');
      return '<button class="'+cls.join(' ')+'" data-i="'+i+'" aria-label="Q'+(i+1)+'">'+(i+1)+'</button>';
    }).join('');
    grid.querySelectorAll('button').forEach(btn => {
      btn.addEventListener('click', () => { state.cur = +btn.dataset.i; renderQ(); });
    });
  }

  function renderQ() {
    const q = state.questions[state.cur];
    const host = $('#q-host');
    const letters = ['A','B','C','D'];
    const sel = state.answers[state.cur];
    const img = q.image ? '<img class="q-image" src="'+ROOT+'data/mains/images/'+NM.escape(q.image)+'" alt="">' : '';
    host.innerHTML =
      '<div class="q-wrap">' +
        '<div class="q-num">Q ' + (state.cur + 1) + ' / ' + state.questions.length + ' · <span class="badge'+(q.source && q.source.includes('NORCET')?' badge--pyq':'')+'">'+NM.escape(q.source||'Practice')+'</span> · <span class="badge">'+NM.escape(q.subject)+'</span></div>' +
        img +
        '<div class="q-stem">' + NM.escape(q.question) + '</div>' +
        '<ul class="options" id="opts">' +
          q.options.map((o, i) => '<li class="option'+(sel===i?' selected':'')+'" data-i="'+i+'"><span class="letter">'+letters[i]+'</span><span class="text">'+NM.escape(o)+'</span></li>').join('') +
        '</ul>' +
        '<div class="q-footer">' +
          '<button class="btn btn--ghost" id="q-prev">← Previous</button>' +
          '<button class="btn btn--ghost" id="q-clear">Clear</button>' +
          '<button class="btn btn--ghost" id="q-flag">'+(state.flags.has(state.cur)?'Unflag':'Flag')+'</button>' +
          '<span class="spacer"></span>' +
          '<button class="btn btn--accent" id="q-next">Next →</button>' +
        '</div>' +
      '</div>';
    $('#mock-qno').textContent = state.cur + 1;
    host.querySelectorAll('.option').forEach(el => {
      el.addEventListener('click', () => pick(+el.dataset.i));
    });
    $('#q-prev').addEventListener('click', () => nav(-1));
    $('#q-next').addEventListener('click', () => nav(1));
    $('#q-clear').addEventListener('click', () => { state.answers[state.cur] = null; persist(); renderQ(); renderPalette(); });
    $('#q-flag').addEventListener('click', toggleFlag);
    renderPalette();
  }

  function pick(i) {
    state.answers[state.cur] = i;
    persist();
    NM.haptic(20);
    renderQ();
  }

  function toggleFlag() {
    if (state.flags.has(state.cur)) state.flags.delete(state.cur);
    else state.flags.add(state.cur);
    persist(); renderQ();
  }

  function nav(d) {
    state.cur = Math.max(0, Math.min(state.questions.length - 1, state.cur + d));
    renderQ();
  }

  function confirmSubmit() {
    const unanswered = state.answers.filter(a => a === null).length;
    const flagged = state.flags.size;
    if (!confirm('Submit now?\n\nAnswered: ' + (state.answers.length - unanswered) + '\nUnanswered: ' + unanswered + '\nFlagged: ' + flagged + '\n\nOnce submitted, you\'ll see the analysis.')) return;
    submit(false);
  }

  function submit(autoTime) {
    if (state.submitted) return;
    state.submitted = true;
    clearInterval(state.timer);
    window.removeEventListener('beforeunload', beforeUnload);
    try { if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(()=>{}); } catch (e) {}
    document.body.classList.remove('focus-mode');
    const x = document.getElementById('focus-exit-btn'); if (x) x.remove();
    const tt = document.getElementById('focus-10-toast'); if (tt) tt.remove();

    // Score
    const total = state.questions.length;
    let right = 0, wrong = 0, skipped = 0;
    const wrongIds = [], flaggedIds = [];
    const bySubj = {};
    state.questions.forEach((q, i) => {
      bySubj[q.subject] = bySubj[q.subject] || { t:0, r:0, w:0, s:0 };
      bySubj[q.subject].t++;
      const a = state.answers[i];
      if (a === null) { skipped++; bySubj[q.subject].s++; }
      else if (a === q.correct) { right++; bySubj[q.subject].r++; }
      else { wrong++; bySubj[q.subject].w++; wrongIds.push(i); NM.srsAdd(q.id, false); }
      if (state.flags.has(i)) flaggedIds.push(i);
    });
    const raw = right;
    const neg = wrong / 3;
    const finalScore = Math.max(0, raw - neg);
    const pct = (finalScore / total) * 100;
    const durationSecs = 180*60 - state.secs;
    const avgTime = durationSecs / Math.max(1, total - skipped);

    // Persist result
    const results = NM.get('mockResults', []);
    results.push({
      id: MOCK_ID,
      date: new Date().toISOString(),
      total, right, wrong, skipped,
      finalScore: +finalScore.toFixed(2),
      pct: +pct.toFixed(1),
      bySubj,
      durationSecs,
      avgTime: +avgTime.toFixed(1),
      autoSubmitted: !!autoTime
    });
    NM.set('mockResults', results);
    NM.recordActivity(Math.round(durationSecs / 60), right + wrong);
    NM.set(MOCK_KEY, { submitted: true });

    if (pct >= 80) NM.confettiBurst();
    renderReport({ right, wrong, skipped, finalScore, pct, bySubj, avgTime, wrongIds, flaggedIds, total, autoTime });
  }

  function renderReport(r) {
    document.title = 'Results · ' + state.title;
    const root = $('#mock-root');
    const badges = r.pct >= 85 ? '<span class="badge badge--ok">Top-rank contender</span>' :
                   r.pct >= 70 ? '<span class="badge badge--ok">Selection-level</span>' :
                   r.pct >= 55 ? '<span class="badge badge--warn">Needs push</span>' :
                   '<span class="badge badge--warn">Fundamentals gap</span>';
    const subjectRows = Object.entries(r.bySubj).sort((a,b)=>b[1].t-a[1].t).map(([s,v]) =>
      '<tr><td>'+NM.escape(s)+'</td><td>'+v.t+'</td><td>'+v.r+'</td><td>'+v.w+'</td><td>'+v.s+'</td><td>'+((v.r/v.t)*100).toFixed(0)+'%</td></tr>'
    ).join('');
    root.innerHTML =
      '<a class="back" href="index.html">← Back to Mocks</a>' +
      '<h1>Results — ' + NM.escape(state.title) + '</h1>' +
      (r.autoTime ? '<p class="muted">Auto-submitted at time 0:00.</p>' : '') +
      '<p>' + badges + '</p>' +
      '<table><tbody>' +
        '<tr><th>Score (post-negative)</th><td><strong>' + r.finalScore.toFixed(2) + ' / ' + r.total + '</strong> (' + r.pct.toFixed(1) + '%)</td></tr>' +
        '<tr><th>Correct</th><td>' + r.right + '</td></tr>' +
        '<tr><th>Wrong</th><td>' + r.wrong + ' (−' + (r.wrong/3).toFixed(2) + ')</td></tr>' +
        '<tr><th>Skipped</th><td>' + r.skipped + '</td></tr>' +
        '<tr><th>Avg time / Q attempted</th><td>' + r.avgTime.toFixed(1) + 's (target ≤67.5s)</td></tr>' +
      '</tbody></table>' +
      '<h2>Subject-wise accuracy</h2>' +
      '<table><thead><tr><th>Subject</th><th>Total</th><th>Right</th><th>Wrong</th><th>Skipped</th><th>Accuracy</th></tr></thead><tbody>' + subjectRows + '</tbody></table>' +
      '<h2>Review wrong answers (' + r.wrongIds.length + ')</h2>' +
      '<div id="review-wrong"></div>' +
      '<h2>Review flagged (' + r.flaggedIds.length + ')</h2>' +
      '<div id="review-flag"></div>' +
      '<div class="btn-row" style="margin-top:28px">' +
        '<button class="btn btn--accent" id="share-score">Share score (PNG)</button>' +
        '<a class="btn btn--ghost" href="index.html">All mocks</a>' +
        '<a class="btn btn--ghost" href="'+ROOT+'mains-plan/dashboard.html">Performance dashboard</a>' +
      '</div>';
    renderReviewList('#review-wrong', r.wrongIds);
    renderReviewList('#review-flag', r.flaggedIds);
    $('#share-score').addEventListener('click', () => shareScoreCard(r));
  }

  function renderReviewList(sel, ids) {
    const host = document.querySelector(sel);
    if (ids.length === 0) { host.innerHTML = '<p class="muted">None.</p>'; return; }
    host.innerHTML = ids.map(i => {
      const q = state.questions[i];
      const a = state.answers[i];
      const letters = ['A','B','C','D'];
      const opts = q.options.map((o, j) => {
        const cls = j === q.correct ? 'option correct' : (j === a ? 'option wrong' : 'option');
        return '<li class="'+cls+'"><span class="letter">'+letters[j]+'</span><span class="text">'+NM.escape(o)+'</span></li>';
      }).join('');
      const expl = q.explanations ? '<ul>' + letters.map(L => '<li class="'+(L===letters[q.correct]?'ok':'bad')+'"><strong>'+L+':</strong> '+NM.escape(q.explanations[L]||'')+'</li>').join('') + '</ul>' : '<p>'+NM.escape(q.explanation||'')+'</p>';
      return '<details style="margin:14px 0;border:1px solid var(--rule);padding:10px" data-qid="'+q.id+'"><summary><strong>Q'+(i+1)+'.</strong> '+NM.escape(q.question.slice(0,120))+(q.question.length>120?'…':'')+' <span class="badge">'+NM.escape(q.subject)+'</span></summary>' +
        '<div class="q-stem">'+NM.escape(q.question)+'</div>' +
        '<ul class="options">'+opts+'</ul>' +
        '<div class="explanations"><h4>Explanations</h4>'+expl+'</div>' +
        '<div class="btn-row" style="justify-content:flex-end"><button class="btn btn--ghost btn--sm" data-act="report" data-qid="'+q.id+'">Report</button></div>' +
      '</details>';
    }).join('');
    host.querySelectorAll('[data-act="report"]').forEach(function (b) {
      b.addEventListener('click', function () {
        const qid = +b.dataset.qid;
        const q = state.questions.find(function (x) { return x.id === qid; });
        if (q && window.NMReport) window.NMReport.open(q);
      });
    });
  }

  function shareScoreCard(r) {
    const W = 1080, H = 1350;
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0,0,W,H);
    ctx.fillStyle = '#a83232'; ctx.fillRect(0,0,W,6);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 42px Georgia';
    ctx.fillText('NORCET Mains 2026', 60, 100);
    ctx.font = '28px Georgia';
    ctx.fillText(state.title, 60, 150);
    ctx.font = 'bold 180px Georgia';
    ctx.fillStyle = r.pct >= 70 ? '#1d7a3c' : '#a83232';
    ctx.fillText(r.pct.toFixed(1) + '%', 60, 360);
    ctx.fillStyle = '#1a1a1a';
    ctx.font = '32px Georgia';
    ctx.fillText('Score: ' + r.finalScore.toFixed(2) + ' / ' + r.total, 60, 420);
    ctx.font = '22px -apple-system, Helvetica';
    ctx.fillText('✓ ' + r.right + '   ✕ ' + r.wrong + '   ○ ' + r.skipped, 60, 470);
    ctx.fillText('Avg time: ' + r.avgTime.toFixed(1) + 's / Q', 60, 505);
    ctx.font = 'bold 28px Georgia'; ctx.fillText('Subject-wise accuracy', 60, 580);
    ctx.font = '22px -apple-system, Helvetica';
    const subs = Object.entries(r.bySubj).sort((a,b)=>b[1].t-a[1].t).slice(0,8);
    subs.forEach(([s, v], i) => {
      const acc = ((v.r/v.t)*100).toFixed(0) + '%';
      ctx.fillText(s.padEnd(20) + '  ' + acc + '  (' + v.r + '/' + v.t + ')', 60, 630 + i * 36);
    });
    ctx.font = '18px -apple-system'; ctx.fillStyle = '#6a6a6a';
    ctx.fillText(new Date().toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }), 60, H - 80);
    ctx.fillText('NORCET Mains Intensive · Day ' + NM.todayDay() + ' of 13', 60, H - 50);
    const link = document.createElement('a');
    link.download = 'norcet-mains-mock-' + MOCK_ID + '.png';
    link.href = c.toDataURL('image/png');
    link.click();
  }

  // ==== Keyboard ====
  document.addEventListener('keydown', (e) => {
    if (!state.started || state.submitted) return;
    if (document.getElementById('nm-palette') || document.getElementById('nm-shortcuts')) return;
    const k = e.key;
    if (k >= '1' && k <= '4') { e.preventDefault(); pick(parseInt(k,10) - 1); return; }
    if (k === 'Enter') { e.preventDefault(); nav(1); return; }
    if (k === 'f' || k === 'F') { e.preventDefault(); toggleFlag(); return; }
    if (k === 'ArrowRight') { e.preventDefault(); nav(1); return; }
    if (k === 'ArrowLeft') { e.preventDefault(); nav(-1); return; }
  });

  // Swipe on mobile
  let tx = 0, ty = 0;
  document.addEventListener('touchstart', (e) => {
    if (!state.started || state.submitted) return;
    tx = e.touches[0].clientX; ty = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchend', (e) => {
    if (!state.started || state.submitted) return;
    const dx = (e.changedTouches[0].clientX - tx);
    const dy = (e.changedTouches[0].clientY - ty);
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)*2) {
      nav(dx < 0 ? 1 : -1);
    }
  });

  NM.boot('mocks');
  document.addEventListener('DOMContentLoaded', init);
})();
