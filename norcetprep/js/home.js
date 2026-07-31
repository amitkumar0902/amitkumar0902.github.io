// The product home: exam strip, daily quiz runner, streak, PYQ of the day,
// free-bank grid, locked premium tiles. Works fully signed-out; app-mode
// (TWA) strips every purchase surface before anything renders.
(function () {
  'use strict';

  var DQ = null;                       // ND.dailyQuiz, resolved on boot
  var root = './';

  // Real, published dates — no invented urgency, no countdown widget.
  var EXAM = [
    { label: 'NORCET 11 registration closes', date: '2026-08-13' },
    { label: 'NORCET 11 Prelims', date: '2026-09-12' },
    { label: 'NORCET 11 Mains', date: '2026-09-30' }
  ];

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function $(id) { return document.getElementById(id); }

  // ---- theme ------------------------------------------------------------------
  function initTheme() {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem('nm.v1.theme')); } catch (e) {}
    if (saved === 'dark' || saved === 'light') document.documentElement.setAttribute('data-theme', saved);
    var btn = $('theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      if (!cur) {
        cur = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('nm.v1.theme', JSON.stringify(next)); } catch (e) {}
    });
  }

  // ---- exam strip -------------------------------------------------------------
  function daysUntil(dateStr) {
    var target = new Date(dateStr + 'T00:00:00+05:30');
    return Math.ceil((target - new Date()) / 86400000);
  }
  function renderStrip() {
    var host = $('exam-strip');
    if (!host) return;
    var upcoming = EXAM.filter(function (e) { return daysUntil(e.date) >= 0; });
    if (!upcoming.length) {
      host.innerHTML = '<span class="strip__label">Exam dates</span>' +
        '<span class="strip__item">NORCET 11 is done. NORCET 12 dates land around February 2027 — ' +
        'we will print them here when AIIMS publishes them.</span>';
      return;
    }
    var parts = upcoming.map(function (e) {
      var d = daysUntil(e.date);
      var when = new Date(e.date + 'T00:00:00+05:30')
        .toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
      return '<span class="strip__item">' + esc(e.label) + ' · <b>' + when + '</b>' +
        (d <= 60 ? ' (' + d + ' day' + (d === 1 ? '' : 's') + ')' : '') + '</span>';
    });
    host.innerHTML = '<span class="strip__label">AIIMS NORCET 11</span>' + parts.join('');
  }

  // ---- streak -----------------------------------------------------------------
  function renderStreak() {
    var host = $('streak');
    if (!host || !DQ) return;
    var s = DQ.streak();
    var n = s.current || 0;
    host.innerHTML = n > 0
      ? '<span class="streak"><span class="streak__flame">🔥</span>' + n + '-day streak' +
        (s.longest > n ? ' · best ' + s.longest : '') + '</span>'
      : '<span class="streak">Start a streak today</span>';
  }

  // ---- daily quiz -------------------------------------------------------------
  var quiz = null;   // { date, questions, pyq }
  var st = null;     // persisted state

  function track(name, params) {
    if (typeof window.NDTrack === 'function') window.NDTrack(name, params || {});
  }

  function startQuiz() {
    var host = $('quiz-host');
    host.innerHTML = '<p class="small mute">Loading today\'s ten…</p>';
    DQ.forDate(root, DQ.istDate()).then(function (q) {
      quiz = q;
      st = DQ.state(q.date);
      track('quiz_start', { date: q.date, count: q.questions.length });
      renderQuestion();
    }).catch(function () {
      host.innerHTML = '<p class="small mute">Could not load today\'s quiz. Check your connection ' +
        'and retry — or go straight to a <a href="topics/foundations.html">free topic bank</a>.</p>';
    });
  }

  function currentIndex() {
    return Math.min(st.answers.length, quiz.questions.length - 1);
  }

  function renderQuestion() {
    if (st.done || st.answers.length >= quiz.questions.length) return renderResult();
    var i = currentIndex();
    var q = quiz.questions[i];
    var host = $('quiz-host');
    host.innerHTML =
      '<div class="q">' +
        '<div class="q__meter"><span>' + (i + 1) + ' / ' + quiz.questions.length + '</span>' +
          '<span class="q__bar"><span class="q__fill" style="width:' + (i / quiz.questions.length * 100) + '%"></span></span>' +
          '<span>' + esc(q.subject || '') + '</span></div>' +
        '<p class="q__stem">' + esc(q.question) + '</p>' +
        '<div class="q__opts" id="q-opts">' +
          q.options.map(function (o, k) {
            return '<button class="q__opt" data-k="' + k + '">' +
              '<span class="k">' + 'ABCD'[k] + '</span><span>' + esc(String(o).replace(/^[A-D]\.\s*/, '')) + '</span></button>';
          }).join('') +
        '</div>' +
        '<div id="q-after"></div>' +
      '</div>';
    $('q-opts').addEventListener('click', function (e) {
      var b = e.target.closest('.q__opt');
      if (b) answer(parseInt(b.getAttribute('data-k'), 10));
    });
  }

  function answer(chosen) {
    var i = currentIndex();
    var q = quiz.questions[i];
    var correct = chosen === q.correct;
    st.answers.push({ qkey: q.qkey, chosen: chosen, correct: correct });
    if (correct) st.score++;
    DQ.save(st);

    var opts = document.querySelectorAll('#q-opts .q__opt');
    for (var k = 0; k < opts.length; k++) {
      opts[k].disabled = true;
      if (k === q.correct) opts[k].classList.add('is-right');
      else if (k === chosen) opts[k].classList.add('is-wrong');
    }
    // Wrong answers feed the same spaced-repetition store the study app uses.
    if (!correct && window.NM && NM.srsAdd) NM.srsAdd(q.qkey, false);

    var last = st.answers.length >= quiz.questions.length;
    $('q-after').innerHTML =
      '<p class="q__expl">' + esc(q.explanation) +
        '<span class="q__cite">Source: ' + esc(q.citation) + '</span></p>' +
      '<div class="q__foot">' +
        '<button class="q__report" id="q-report">Report this question</button>' +
        '<button class="btn btn--sm" id="q-next">' + (last ? 'See your score' : 'Next question') + '</button>' +
      '</div>';
    $('q-next').addEventListener('click', function () {
      if (last) finish(); else renderQuestion();
    });
    $('q-report').addEventListener('click', function () { report(q); });
  }

  function report(q) {
    if (window.NMReport && window.NM) return window.NMReport.open(q);
    location.href = 'fix-log.html';
  }

  function finish() {
    st.done = true;
    DQ.save(st);
    DQ.bumpStreak(quiz.date);
    track('quiz_complete', { date: quiz.date, score: st.score, total: quiz.questions.length });
    renderStreak();
    renderResult();
  }

  function renderResult() {
    var host = $('quiz-host');
    var total = quiz.questions.length;
    var pct = Math.round((st.score / total) * 100);
    var wrong = st.answers.filter(function (a) { return !a.correct; }).length;
    host.innerHTML =
      '<div class="q">' +
        '<span class="micro">Today\'s quiz · done</span>' +
        '<div class="q__score">' + st.score + '<span class="mute" style="font-size:18px">/' + total + '</span></div>' +
        '<p class="small mute" style="margin:4px 0 14px">' + pct + '% today.' +
          (wrong ? ' ' + wrong + ' to revisit — they are queued in your review deck.' : ' Clean sweep.') +
          ' A new ten unlocks at midnight IST.</p>' +
        '<div class="q__foot" style="justify-content:flex-start">' +
          '<a class="btn btn--sm" href="mains-plan/review.html">Review what you missed</a>' +
          '<a class="btn btn--sm btn--quiet" href="topics/foundations.html">Practise a full bank</a>' +
        '</div>' +
      '</div>';
  }

  function renderQuizCard() {
    var host = $('quiz-host');
    if (!host || !DQ) return;
    var today = DQ.istDate();
    var s = DQ.state(today);
    if (s.done) {
      DQ.forDate(root, today).then(function (q) { quiz = q; st = s; renderResult(); });
      return;
    }
    var resuming = s.answers.length > 0;
    host.innerHTML =
      '<p class="sub" style="margin-bottom:14px">Ten questions from the verified free bank — the same ten ' +
      'for everyone today, with explanations and sources the moment you answer. No account needed.</p>' +
      '<button class="btn" id="quiz-start">' + (resuming ? 'Resume today\'s quiz' : 'Start today\'s quiz') + '</button>';
    $('quiz-start').addEventListener('click', startQuiz);
  }

  // ---- PYQ of the day ---------------------------------------------------------
  function renderPyq() {
    var host = $('pyq-host');
    if (!host || !DQ) return;
    DQ.forDate(root, DQ.istDate()).then(function (q) {
      if (!q.pyq) { host.parentNode.style.display = 'none'; return; }
      var p = q.pyq;
      host.innerHTML =
        '<p class="q__stem" style="font-size:16px">' + esc(p.question) + '</p>' +
        '<div class="q__opts">' + p.options.map(function (o, k) {
          return '<div class="q__opt" style="cursor:default"><span class="k">' + 'ABCD'[k] + '</span><span>' +
            esc(String(o).replace(/^[A-D]\.\s*/, '')) + '</span></div>';
        }).join('') + '</div>' +
        '<details><summary class="small" style="cursor:pointer;font-weight:700">Show the answer</summary>' +
        '<p class="q__expl">' + 'ABCD'[p.correct] + ' — ' + esc(p.explanation) +
        '<span class="q__cite">Source: ' + esc(p.citation) + '</span></p></details>';
    }).catch(function () { host.parentNode.style.display = 'none'; });
  }

  // ---- free bank grid ---------------------------------------------------------
  var BANKS = [
    ['pharmacology', 'Pharmacology'], ['medical-surgical', 'Medical-Surgical'],
    ['foundations', 'Foundations'], ['previous-years', 'Previous Years'],
    ['anatomy-physiology', 'Anatomy & Physiology'], ['obstetric-gynecology', 'Obstetrics & Gynae'],
    ['community-health', 'Community Health'], ['pediatric', 'Paediatrics'],
    ['psychiatric', 'Psychiatry'], ['microbiology', 'Microbiology'],
    ['administration-management', 'Administration'], ['nutrition-biochemistry', 'Nutrition & Biochem'],
    ['first-aid', 'First Aid']
  ];

  function renderBanks() {
    var host = $('banks');
    if (!host) return;
    Promise.all(BANKS.map(function (b) {
      return fetch(root + 'data/questions/' + b[0] + '.json')
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (l) { return l.length; })
        .catch(function () { return 0; });
    })).then(function (counts) {
      var total = counts.reduce(function (a, b) { return a + b; }, 0);
      host.innerHTML = BANKS.map(function (b, i) {
        return '<a class="tile" href="topics/' + b[0] + '.html">' +
          '<div class="tile__name">' + esc(b[1]) + '</div>' +
          '<div class="tile__meta">' + counts[i] + ' questions · free</div></a>';
      }).join('');
      var t = $('banks-total');
      if (t) t.textContent = total + ' free questions with explanations and sources — no account, no limit.';
    });
  }

  // ---- premium tiles ----------------------------------------------------------
  var PREMIUM = [
    ['Mock library', '10 full NORCET-mix mocks + per-paper recall sets, 160 Q / 180 min, exam scoring.', 'mains-plan/mocks/'],
    ['Mains toolkit', 'Scenario-first notes, flashcards, labelled diagrams, drug-calculation drills.', 'mains-plan/notes/index.html'],
    ['Question bank', '1,569 questions with filters by subject, topic and tag.', 'mains-plan/bank.html'],
    ['Performance analytics', 'Cutoff-anchored reports, subject mastery, weak-topic maps.', 'mains-plan/dashboard.html']
  ];

  function renderPremium() {
    var host = $('premium');
    if (!host) return;
    var appMode = window.ND && ND.paywall && ND.paywall.appMode();
    var walled = window.ND && ND.paywall && ND.paywall.enabled();
    host.innerHTML = PREMIUM.map(function (p) {
      var cta = !walled
        ? '<span class="tile__cta">Open — free during launch prep</span>'
        : appMode
          ? '<span class="tile__cta">Sign in to unlock</span>'
          : '<span class="tile__cta nd-buy-only">Unlock from ₹249</span>';
      return '<a class="tile tile--locked" href="' + p[2] + '">' +
        '<div class="tile__name">' + esc(p[0]) + '</div>' +
        '<div class="tile__meta">' + esc(p[1]) + '</div>' + cta + '</a>';
    }).join('');
    if (appMode) {
      var note = $('premium-note');
      if (note) note.textContent = 'Locked sections open when you sign in with an account that has access.';
      document.querySelectorAll('.nd-buy-only').forEach(function (el) { el.remove(); });
    }
  }

  // ---- boot -------------------------------------------------------------------
  function waitFor(get, cb, tries) {
    tries = tries || 0;
    var v = get();
    if (v) return cb(v);
    if (tries > 100) return cb(null);
    setTimeout(function () { waitFor(get, cb, tries + 1); }, 50);
  }

  function boot() {
    initTheme();
    renderStrip();
    renderBanks();
    waitFor(function () { return window.ND && window.ND.dailyQuiz; }, function (dq) {
      DQ = dq;
      if (!DQ) {
        $('quiz-host').innerHTML = '<p class="small mute">The daily quiz needs JavaScript. ' +
          'The <a href="topics/foundations.html">free topic banks</a> work without it.</p>';
        return;
      }
      renderStreak();
      renderQuizCard();
      renderPyq();
    });
    waitFor(function () { return window.ND && window.ND.paywall; }, renderPremium);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
