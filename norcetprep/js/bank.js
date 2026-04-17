// Bank browser — filter + search the unified Mains Question Bank.
// Default "Try" mode hides the answer until the user picks; "Browse" mode
// reveals answers immediately (for exam-eve revision).
(function () {
  'use strict';
  const NM = window.NM;
  const ROOT = NM.rootPath();

  const state = {
    all: [],
    view: [],
    page: 0,
    pageSize: 20,
    filters: { subject: '', day: '', source: '', difficulty: '', qtype: '', q: '' },
    mode: NM.get('bankMode', 'try'),
    picks: {},
    syllabusById: {}
  };

  document.addEventListener('DOMContentLoaded', () => {
    NM.boot('bank');
    const qs = new URLSearchParams(location.search);
    if (qs.get('qtype')) state.filters.qtype = qs.get('qtype');
    if (qs.get('day')) state.filters.day = qs.get('day');
    if (qs.get('subject')) state.filters.subject = qs.get('subject');
    if (qs.get('ids')) state.filters._ids = qs.get('ids').split(',').map(function (s) { return +s; });
    if (qs.get('syllabusId')) state.filters._syllabusId = qs.get('syllabusId');
    if (qs.get('tag')) state.filters._tag = qs.get('tag');
    Promise.all([
      fetch(ROOT + 'data/mains/question-bank.json').then(r => r.json()),
      fetch(ROOT + 'data/mains/syllabus.json').then(r => r.json()).catch(() => [])
    ])
      .then(([bank, syllabus]) => {
        state.all = bank;
        state.view = bank.slice();
        (syllabus || []).forEach(s => { if (s && s.id) state.syllabusById[s.id] = s; });
        renderFilters();
        apply();
      })
      .catch(() => { document.getElementById('bank-list').innerHTML = '<p>Failed to load bank.</p>'; });
  });

  function uniq(arr, key) {
    const s = new Set(); arr.forEach(x => s.add(x[key])); return [...s].filter(Boolean).sort();
  }

  function renderFilters() {
    const f = state.filters;
    const subjects = uniq(state.all, 'subject');
    const days = [...Array(13)].map((_, i) => i + 1);
    const sources = uniq(state.all, 'source');
    const difficulties = ['Easy', 'Medium', 'High'];
    const qtypes = uniq(state.all, 'qtype');
    const host = document.getElementById('bank-filters');
    host.innerHTML =
      '<div class="btn-row" style="align-items:center;gap:12px;flex-wrap:wrap">' +
        sel('subject', 'Subject', subjects, f.subject) +
        sel('day', 'Day', days, f.day) +
        sel('source', 'Source', sources, f.source) +
        sel('difficulty', 'Difficulty', difficulties, f.difficulty) +
        sel('qtype', 'Type', qtypes, f.qtype) +
        '<input type="search" id="f-q" placeholder="Search text..." value="' + NM.escape(f.q) + '" style="padding:8px 10px;border:1px solid var(--rule);min-width:220px;background:var(--bg);color:var(--ink)">' +
        '<button class="btn btn--ghost" id="f-reset">Reset</button>' +
        '<div class="mode-toggle" role="tablist" aria-label="Mode">' +
          '<button class="btn ' + (state.mode === 'try' ? 'btn--accent' : 'btn--ghost') + '" id="mode-try" role="tab" aria-selected="' + (state.mode === 'try') + '" title="Try first, then reveal">Try</button>' +
          '<button class="btn ' + (state.mode === 'browse' ? 'btn--accent' : 'btn--ghost') + '" id="mode-browse" role="tab" aria-selected="' + (state.mode === 'browse') + '" title="Show answers immediately">Browse</button>' +
        '</div>' +
      '</div>';
    host.querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
      state.filters[s.dataset.k] = s.value; state.page = 0; apply();
    }));
    document.getElementById('f-q').addEventListener('input', (e) => {
      state.filters.q = e.target.value; state.page = 0; apply();
    });
    document.getElementById('f-reset').addEventListener('click', () => {
      state.filters = { subject: '', day: '', source: '', difficulty: '', qtype: '', q: '' };
      state.page = 0; renderFilters(); apply();
    });
    document.getElementById('mode-try').addEventListener('click', () => setMode('try'));
    document.getElementById('mode-browse').addEventListener('click', () => setMode('browse'));
  }
  function setMode(m) {
    state.mode = m;
    NM.set('bankMode', m);
    state.picks = {};
    renderFilters();
    renderList();
  }
  function sel(k, label, opts, cur) {
    return '<label class="small">' + label + ' <select data-k="' + k + '" style="padding:6px 8px;border:1px solid var(--rule);background:var(--bg);color:var(--ink)"><option value="">All</option>' +
      opts.map(o => '<option value="' + o + '"' + (String(cur) === String(o) ? ' selected' : '') + '>' + o + '</option>').join('') +
    '</select></label>';
  }

  function apply() {
    const f = state.filters;
    const q = (f.q || '').toLowerCase().trim();
    state.view = state.all.filter(r =>
      (!f._ids || f._ids.indexOf(r.id) !== -1) &&
      (!f._syllabusId || r.syllabusId === f._syllabusId) &&
      (!f._tag || (Array.isArray(r.tags) && r.tags.indexOf(f._tag) !== -1)) &&
      (!f.subject || r.subject === f.subject) &&
      (!f.day || r.day === +f.day) &&
      (!f.source || r.source === f.source) &&
      (!f.difficulty || r.difficulty === f.difficulty) &&
      (!f.qtype || r.qtype === f.qtype) &&
      (!q || (r.question + ' ' + r.options.join(' ') + ' ' + (r.topic || '') + ' ' + (r.explanation || '')).toLowerCase().includes(q))
    );
    renderList();
  }

  function syllabusBanner() {
    if (!state.filters._syllabusId) return '';
    const sid = state.filters._syllabusId;
    const meta = state.syllabusById[sid];
    const topic = meta ? (meta.topic + (meta.sectionLabel ? ' · ' + meta.sectionLabel : '')) : sid;
    return '<div class="info-box" style="display:flex;align-items:center;gap:12px;justify-content:space-between;flex-wrap:wrap;margin-bottom:12px;padding:10px 14px;border:1px solid var(--rule);background:var(--bg-alt);">' +
      '<span><strong>Topic filter:</strong> ' + NM.escape(topic) + '</span>' +
      '<button class="btn btn--ghost btn--sm" id="clear-syllabus-filter">Clear topic filter</button>' +
      '</div>';
  }

  function wireSyllabusBanner() {
    const btn = document.getElementById('clear-syllabus-filter');
    if (!btn) return;
    btn.addEventListener('click', () => {
      delete state.filters._syllabusId;
      const url = new URL(location.href);
      url.searchParams.delete('syllabusId');
      history.replaceState(null, '', url.toString());
      state.page = 0;
      apply();
    });
  }

  function renderList() {
    const v = state.view;
    const page = state.page, size = state.pageSize;
    const start = page * size;
    const slice = v.slice(start, start + size);
    const host = document.getElementById('bank-list');
    const banner = syllabusBanner();
    if (v.length === 0) {
      if (state.filters._syllabusId) {
        const sid = state.filters._syllabusId;
        const meta = state.syllabusById[sid];
        const topic = meta ? meta.topic : sid;
        host.innerHTML = banner +
          '<div class="empty-state" style="padding:24px;border:1px dashed var(--rule);text-align:center;background:var(--bg-alt);">' +
            '<p><strong>No MCQs are tagged to “' + NM.escape(topic) + '” yet.</strong></p>' +
            '<p class="small muted">About 47% of the bank is currently tagged to syllabus topics. Clear this filter to browse everything, or jump to the notes/syllabus for this topic.</p>' +
            '<div class="btn-row" style="justify-content:center;gap:10px;margin-top:10px;">' +
              '<button class="btn btn--accent" id="clear-syllabus-filter-empty">Clear topic filter</button>' +
              (meta ? '<a class="btn btn--ghost" href="notes/index.html?section=' + encodeURIComponent(meta.section || '') + '#' + encodeURIComponent(sid) + '">Open topic notes</a>' : '') +
              (meta ? '<a class="btn btn--ghost" href="syllabus.html#' + encodeURIComponent(sid) + '">View in syllabus</a>' : '') +
            '</div>' +
          '</div>';
        const clear = document.getElementById('clear-syllabus-filter-empty');
        if (clear) clear.addEventListener('click', () => {
          delete state.filters._syllabusId;
          const url = new URL(location.href);
          url.searchParams.delete('syllabusId');
          history.replaceState(null, '', url.toString());
          state.page = 0;
          apply();
        });
        wireSyllabusBanner();
      } else {
        host.innerHTML = '<p class="muted">No questions match. Try clearing filters.</p>';
      }
      document.getElementById('bank-pager').innerHTML = '';
      return;
    }
    host.innerHTML = banner + slice.map(renderCard).join('');
    wireSyllabusBanner();
    slice.forEach(wireCard);
    const total = v.length;
    const pages = Math.ceil(total / size);
    document.getElementById('bank-pager').innerHTML =
      '<div class="btn-row" style="justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--rule)">' +
        '<span class="small muted">' + (start + 1) + '–' + Math.min(start + size, total) + ' of ' + total + '</span>' +
        '<span>' +
          '<button class="btn btn--ghost" id="p-prev" ' + (page === 0 ? 'disabled' : '') + '>Prev</button> ' +
          '<span class="small mono">Page ' + (page + 1) + ' / ' + pages + '</span> ' +
          '<button class="btn btn--ghost" id="p-next" ' + (page >= pages - 1 ? 'disabled' : '') + '>Next</button>' +
        '</span>' +
      '</div>';
    const prev = document.getElementById('p-prev'); if (prev) prev.addEventListener('click', () => { if (state.page > 0) { state.page--; renderList(); window.scrollTo(0, 0); } });
    const next = document.getElementById('p-next'); if (next) next.addEventListener('click', () => { if (state.page < pages - 1) { state.page++; renderList(); window.scrollTo(0, 0); } });
  }

  function renderCard(q) {
    const letters = ['A', 'B', 'C', 'D'];
    const picked = state.picks[q.id];
    const revealed = state.mode === 'browse' || picked !== undefined;
    const opts = q.options.map((o, i) => {
      let cls = 'option';
      if (revealed) {
        if (i === q.correct) cls += ' correct';
        else if (picked === i) cls += ' wrong';
        else cls += ' muted';
      }
      cls += ' option--btn';
      return '<li class="' + cls + '" data-qid="' + q.id + '" data-opt="' + i + '" role="button" tabindex="0">' +
        '<span class="letter">' + letters[i] + '</span><span class="text">' + NM.escape(o) + '</span>' +
      '</li>';
    }).join('');
    const img = q.image ? '<img class="q-image" src="' + ROOT + 'data/mains/images/' + NM.escape(q.image) + '" alt="">' : '';
    const meta =
      '<div class="q-num">' +
        '<span class="badge' + (q.source && q.source.indexOf('NORCET') !== -1 ? ' badge--pyq' : '') + '">' + NM.escape(q.source || '') + '</span> · ' +
        '<span class="badge">' + NM.escape(q.subject || '') + '</span> · ' +
        '<span class="badge">Day ' + NM.escape(q.day) + '</span> · ' +
        '<span class="badge">' + NM.escape(q.difficulty || '') + '</span> · ' +
        '<span class="badge">' + NM.escape(q.qtype || '') + '</span>' +
      '</div>';
    const explBody = revealed ? renderExplanations(q) : '';
    const explBlock = revealed
      ? '<details open><summary>Explanation</summary><div class="explanations">' + explBody + '</div></details>'
      : '<p class="small muted">' + (state.mode === 'try' ? 'Pick an option to reveal the answer.' : '') + '</p>';
    const actions =
      '<div class="btn-row" style="justify-content:flex-end;margin-top:8px;gap:8px">' +
        (state.mode === 'try' && picked === undefined ? '' :
          '<button class="btn btn--ghost btn--sm" data-act="reset" data-qid="' + q.id + '">Retry</button>') +
        '<button class="btn btn--ghost btn--sm" data-act="report" data-qid="' + q.id + '">Report</button>' +
      '</div>';
    return '<article class="bank-card" data-qid="' + q.id + '" style="border:1px solid var(--rule);padding:16px;margin:14px 0">' +
      meta + img +
      '<div class="q-stem">' + NM.escape(q.question) + '</div>' +
      '<ul class="options">' + opts + '</ul>' +
      explBlock + actions +
    '</article>';
  }

  function renderExplanations(q) {
    const letters = ['A', 'B', 'C', 'D'];
    if (q.explanations) {
      return '<ul>' + letters.map(function (L, i) {
        const cls = i === q.correct ? 'ok' : 'bad';
        return '<li class="' + cls + '"><strong>' + L + ':</strong> ' + NM.escape(q.explanations[L] || '') + '</li>';
      }).join('') + '</ul>';
    }
    return '<p>' + NM.escape(q.explanation || 'Correct answer: ' + letters[q.correct] + '.') + '</p>';
  }

  function wireCard(q) {
    const card = document.querySelector('.bank-card[data-qid="' + q.id + '"]');
    if (!card) return;
    card.querySelectorAll('.option--btn').forEach(function (el) {
      el.addEventListener('click', function () { pick(q, +el.dataset.opt); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(q, +el.dataset.opt); }
      });
    });
    const resetBtn = card.querySelector('[data-act="reset"]');
    if (resetBtn) resetBtn.addEventListener('click', function () {
      delete state.picks[q.id];
      const next = renderCard(q);
      card.outerHTML = next;
      wireCard(q);
    });
    const reportBtn = card.querySelector('[data-act="report"]');
    if (reportBtn) reportBtn.addEventListener('click', function () {
      if (window.NMReport) window.NMReport.open(q);
      else alert('Report module not loaded.');
    });
  }

  function pick(q, i) {
    if (state.mode !== 'try') return;
    if (state.picks[q.id] !== undefined) return;
    state.picks[q.id] = i;
    NM.srsAdd(String(q.id), i === q.correct);
    const card = document.querySelector('.bank-card[data-qid="' + q.id + '"]');
    if (!card) return;
    const next = renderCard(q);
    card.outerHTML = next;
    wireCard(q);
    if (i === q.correct) {
      NM.haptic(20);
    } else {
      NM.haptic(80);
      const newCard = document.querySelector('.bank-card[data-qid="' + q.id + '"]');
      if (newCard) NM.shake(newCard);
    }
  }
})();
