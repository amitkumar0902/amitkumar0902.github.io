// Practice runner — loads a question set from a URL and offers Practice / Test modes.
(function () {
  'use strict';
  const NM = window.NM;
  const ROOT = NM.rootPath();

  const state = {
    day: 1,
    mode: 'practice', // 'practice' = instant explanation; 'test' = delay until end
    questions: [],
    answers: [],
    submitted: [],
    cur: 0,
    startedAt: Date.now()
  };

  window.NMPractice = {
    start(opts) {
      state.day = opts.day || null;
      state.dataUrl = opts.dataUrl;
      state.title = opts.title || 'Practice';
      state.stateKey = opts.stateKey || ('practice.' + (opts.day || 'default'));
      load();
    }
  };

  function load() {
    fetch(state.dataUrl).then(r => r.json()).then(d => {
      state.questions = Array.isArray(d) ? d : (d.questions || []);
      state.answers = new Array(state.questions.length).fill(null);
      state.submitted = new Array(state.questions.length).fill(false);
      const saved = NM.get(state.stateKey);
      if (saved && saved.answers && saved.answers.length === state.questions.length && !saved.finished) {
        renderResume(saved);
      } else {
        render();
      }
    }).catch(e => {
      document.getElementById('practice-root').innerHTML = '<p>Couldn\'t load questions: ' + NM.escape(e.message) + '</p>';
    });
  }

  function persist(finished) {
    NM.set(state.stateKey, {
      answers: state.answers,
      submitted: state.submitted,
      cur: state.cur,
      mode: state.mode,
      finished: !!finished
    });
  }

  function renderResume(saved) {
    const answered = saved.answers.filter(a => a !== null).length;
    const host = document.getElementById('practice-root');
    host.innerHTML =
      '<h1>' + NM.escape(state.title) + '</h1>' +
      '<p>You left off at Q' + (saved.cur + 1) + '. Answered ' + answered + '/' + saved.answers.length + '.</p>' +
      '<div class="btn-row">' +
        '<button class="btn btn--accent" id="p-resume">Continue</button>' +
        '<button class="btn btn--ghost" id="p-restart">Start fresh</button>' +
      '</div>';
    document.getElementById('p-resume').addEventListener('click', () => {
      state.answers = saved.answers; state.submitted = saved.submitted; state.cur = saved.cur; state.mode = saved.mode || 'practice';
      render();
    });
    document.getElementById('p-restart').addEventListener('click', () => {
      NM.del(state.stateKey);
      state.answers = new Array(state.questions.length).fill(null);
      state.submitted = new Array(state.questions.length).fill(false);
      state.cur = 0;
      render();
    });
  }

  function render() {
    const host = document.getElementById('practice-root');
    const q = state.questions[state.cur];
    const letters = ['A','B','C','D'];
    const sel = state.answers[state.cur];
    const done = state.submitted[state.cur];
    const opts = q.options.map((o, i) => {
      let cls = 'option';
      if (done) {
        if (i === q.correct) cls += ' correct';
        else if (i === sel) cls += ' wrong';
      } else if (sel === i) cls += ' selected';
      return '<li class="'+cls+'" data-i="'+i+'"><span class="letter">'+letters[i]+'</span><span class="text">'+NM.escape(o)+'</span></li>';
    }).join('');
    const expl = done && state.mode === 'practice' ? renderExplanations(q) : '';
    const img = q.image ? '<img class="q-image" src="'+ROOT+'data/mains/images/'+NM.escape(q.image)+'" alt="">' : '';
    const progress = '<div class="progress-bar"><div class="progress-bar__fill" style="width:'+(((state.cur+1)/state.questions.length)*100)+'%"></div></div>';
    host.innerHTML =
      '<div class="q-wrap">' +
        '<div class="small muted">' + NM.escape(state.title) + ' · ' + (state.mode === 'practice' ? 'Practice mode (instant explanation)' : 'Test mode (score at end)') + ' · <a href="#" id="mode-toggle">switch</a></div>' +
        progress +
        '<div class="q-num">Q ' + (state.cur + 1) + ' / ' + state.questions.length + ' · <span class="badge'+(q.source && q.source.includes('NORCET')?' badge--pyq':'')+'">'+NM.escape(q.source || 'Practice')+'</span> · <span class="badge">'+NM.escape(q.subject)+'</span>'+(q.year?' · <span class="badge">'+q.year+'</span>':'')+'</div>' +
        img +
        '<div class="q-stem">' + NM.escape(q.question) + '</div>' +
        '<ul class="options" id="opts">' + opts + '</ul>' +
        expl +
        '<div class="q-footer">' +
          '<button class="btn btn--ghost" id="p-prev">← Previous</button>' +
          '<button class="btn btn--ghost btn--sm" id="p-report" title="Report this question">Report</button>' +
          (done ? '<button class="btn btn--accent" id="p-next">' + (state.cur === state.questions.length - 1 ? 'Finish' : 'Next →') + '</button>' :
                  '<button class="btn btn--accent" id="p-submit" '+(sel===null?'disabled':'')+'>Submit</button>') +
        '</div>' +
      '</div>';
    document.querySelectorAll('.option').forEach(el => {
      el.addEventListener('click', () => {
        if (state.submitted[state.cur]) return;
        state.answers[state.cur] = +el.dataset.i;
        persist();
        render();
      });
    });
    document.getElementById('p-prev').addEventListener('click', () => { state.cur = Math.max(0, state.cur - 1); render(); });
    const repBtn = document.getElementById('p-report');
    if (repBtn) repBtn.addEventListener('click', () => { if (window.NMReport) window.NMReport.open(q); });
    const subBtn = document.getElementById('p-submit');
    if (subBtn) subBtn.addEventListener('click', submitQ);
    const nxtBtn = document.getElementById('p-next');
    if (nxtBtn) nxtBtn.addEventListener('click', next);
    document.getElementById('mode-toggle').addEventListener('click', (e) => {
      e.preventDefault();
      state.mode = state.mode === 'practice' ? 'test' : 'practice';
      persist(); render();
    });
  }

  function renderExplanations(q) {
    const letters = ['A','B','C','D'];
    const ex = q.explanations;
    if (!ex) return '<div class="explanations"><h4>Explanation</h4><p>' + NM.escape(q.explanation || '') + '</p></div>';
    return '<div class="explanations"><h4>Why each option</h4><ul>' +
      letters.map(L => '<li class="'+(L===letters[q.correct]?'ok':'bad')+'"><strong>'+L+':</strong> '+NM.escape(ex[L]||'')+'</li>').join('') +
      '</ul></div>';
  }

  function submitQ() {
    if (state.answers[state.cur] === null) return;
    state.submitted[state.cur] = true;
    const q = state.questions[state.cur];
    const correct = state.answers[state.cur] === q.correct;
    NM.srsAdd(q.id, correct);
    NM.haptic(correct ? 15 : 60);
    if (!correct) {
      const opts = document.getElementById('opts');
      if (opts) NM.shake(opts);
    }
    persist();
    render();
  }

  function next() {
    if (state.cur < state.questions.length - 1) {
      state.cur += 1; render();
    } else {
      finish();
    }
  }

  function finish() {
    const r = score();
    NM.recordActivity(Math.max(1, Math.round((Date.now() - state.startedAt) / 60000)), state.questions.length);
    persist(true);
    markCompleted();
    if (r.pct >= 80) NM.confettiBurst();
    renderReport(r);
  }

  function markCompleted() {
    if (state.day) {
      const done = NM.get('practiceDone', {});
      done[state.day] = true;
      NM.set('practiceDone', done);
      if (NM.markDayCompleted) NM.markDayCompleted(state.day);
    }
  }

  function score() {
    let right = 0, wrong = 0, skipped = 0;
    const wrongIds = [];
    const bySubj = {};
    state.questions.forEach((q, i) => {
      bySubj[q.subject] = bySubj[q.subject] || { t:0, r:0 };
      bySubj[q.subject].t++;
      const a = state.answers[i];
      if (a === null) skipped++;
      else if (a === q.correct) { right++; bySubj[q.subject].r++; }
      else { wrong++; wrongIds.push(i); }
    });
    return { right, wrong, skipped, total: state.questions.length, pct: (right/state.questions.length)*100, bySubj, wrongIds };
  }

  function renderReport(r) {
    const host = document.getElementById('practice-root');
    host.innerHTML =
      '<h1>Session complete — ' + NM.escape(state.title) + '</h1>' +
      '<p><strong>' + r.right + ' / ' + r.total + '</strong> correct (' + r.pct.toFixed(0) + '%) · ' + r.wrong + ' wrong · ' + r.skipped + ' skipped.</p>' +
      '<h2>Review wrong answers (' + r.wrongIds.length + ')</h2>' +
      (r.wrongIds.length ? '<div id="wrong-list"></div>' : '<p class="muted">None — clean sweep.</p>') +
      '<div class="btn-row" style="margin-top:24px">' +
        '<button class="btn btn--accent" id="p-again">Retake</button>' +
        (state.day ? '<a class="btn btn--ghost" href="../day-'+state.day+'.html">Back to Day '+state.day+' notes</a>' : '') +
        (state.day && state.day < 13 ? '<a class="btn btn--ghost" href="day-'+(state.day+1)+'.html">Next: Day '+(state.day+1)+' practice →</a>' : '') +
      '</div>';
    if (r.wrongIds.length) {
      document.getElementById('wrong-list').innerHTML = r.wrongIds.map(i => {
        const q = state.questions[i];
        const a = state.answers[i];
        const letters = ['A','B','C','D'];
        const opts = q.options.map((o, j) => {
          const cls = j === q.correct ? 'option correct' : (j === a ? 'option wrong' : 'option');
          return '<li class="'+cls+'"><span class="letter">'+letters[j]+'</span><span class="text">'+NM.escape(o)+'</span></li>';
        }).join('');
        return '<details style="margin:10px 0;border:1px solid var(--rule);padding:10px" data-qid="'+q.id+'"><summary><strong>Q'+(i+1)+'.</strong> '+NM.escape(q.question.slice(0,120))+(q.question.length>120?'…':'')+'</summary>' +
          '<div class="q-stem">'+NM.escape(q.question)+'</div>' +
          '<ul class="options">'+opts+'</ul>' +
          renderExplanations(q) +
          '<div class="btn-row" style="justify-content:flex-end"><button class="btn btn--ghost btn--sm" data-act="report" data-qid="'+q.id+'">Report</button></div>' +
        '</details>';
      }).join('');
      document.querySelectorAll('#wrong-list [data-act="report"]').forEach(function (b) {
        b.addEventListener('click', function () {
          const qid = +b.dataset.qid;
          const q = state.questions.find(function (x) { return x.id === qid; });
          if (q && window.NMReport) window.NMReport.open(q);
        });
      });
    }
    document.getElementById('p-again').addEventListener('click', () => {
      NM.del(state.stateKey);
      state.answers = new Array(state.questions.length).fill(null);
      state.submitted = new Array(state.questions.length).fill(false);
      state.cur = 0; render();
    });
  }

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (document.getElementById('nm-palette') || document.getElementById('nm-shortcuts')) return;
    const inField = /^(input|textarea)$/i.test(e.target.tagName);
    if (inField) return;
    const k = e.key;
    if (state.questions.length === 0) return;
    const done = state.submitted[state.cur];
    if (!done && k >= '1' && k <= '4') { e.preventDefault(); state.answers[state.cur] = parseInt(k,10) - 1; persist(); render(); return; }
    if (!done && k === 'Enter') { e.preventDefault(); submitQ(); return; }
    if (done && (k === 'Enter' || k === 'ArrowRight')) { e.preventDefault(); next(); return; }
    if (k === 'ArrowLeft') { e.preventDefault(); state.cur = Math.max(0, state.cur - 1); render(); }
  });
})();
