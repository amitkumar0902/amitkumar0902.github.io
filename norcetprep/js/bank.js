// Bank browser — filter + search the unified Mains Question Bank.
(function () {
  'use strict';
  const NM = window.NM;
  const ROOT = NM.rootPath();

  const state = { all: [], view: [], page: 0, pageSize: 20, filters: { subject: '', day: '', source: '', difficulty: '', qtype: '', q: '' } };

  document.addEventListener('DOMContentLoaded', () => {
    NM.boot('bank');
    const qs = new URLSearchParams(location.search);
    if (qs.get('qtype')) state.filters.qtype = qs.get('qtype');
    if (qs.get('day')) state.filters.day = qs.get('day');
    if (qs.get('subject')) state.filters.subject = qs.get('subject');
    fetch(ROOT + 'data/mains/question-bank.json')
      .then(r => r.json())
      .then(d => { state.all = d; state.view = d.slice(); renderFilters(); apply(); })
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
    const difficulties = ['Easy','Medium','High'];
    const qtypes = uniq(state.all, 'qtype');
    const host = document.getElementById('bank-filters');
    host.innerHTML =
      '<div class="btn-row" style="align-items:center;gap:12px;flex-wrap:wrap">' +
        sel('subject', 'Subject', subjects, f.subject) +
        sel('day', 'Day', days, f.day) +
        sel('source', 'Source', sources, f.source) +
        sel('difficulty', 'Difficulty', difficulties, f.difficulty) +
        sel('qtype', 'Type', qtypes, f.qtype) +
        '<input type="search" id="f-q" placeholder="Search text..." value="'+NM.escape(f.q)+'" style="padding:8px 10px;border:1px solid var(--rule);min-width:220px;background:var(--bg);color:var(--ink)">' +
        '<button class="btn btn--ghost" id="f-reset">Reset</button>' +
      '</div>';
    host.querySelectorAll('select').forEach(s => s.addEventListener('change', () => {
      state.filters[s.dataset.k] = s.value; state.page = 0; apply();
    }));
    document.getElementById('f-q').addEventListener('input', (e) => {
      state.filters.q = e.target.value; state.page = 0; apply();
    });
    document.getElementById('f-reset').addEventListener('click', () => {
      state.filters = { subject:'', day:'', source:'', difficulty:'', qtype:'', q:'' };
      state.page = 0; renderFilters(); apply();
    });
  }
  function sel(k, label, opts, cur) {
    return '<label class="small">'+label+' <select data-k="'+k+'" style="padding:6px 8px;border:1px solid var(--rule);background:var(--bg);color:var(--ink)"><option value="">All</option>' +
      opts.map(o => '<option value="'+o+'"'+(String(cur)===String(o)?' selected':'')+'>'+o+'</option>').join('') +
    '</select></label>';
  }

  function apply() {
    const f = state.filters;
    const q = (f.q || '').toLowerCase().trim();
    state.view = state.all.filter(r =>
      (!f.subject || r.subject === f.subject) &&
      (!f.day || r.day === +f.day) &&
      (!f.source || r.source === f.source) &&
      (!f.difficulty || r.difficulty === f.difficulty) &&
      (!f.qtype || r.qtype === f.qtype) &&
      (!q || (r.question + ' ' + r.options.join(' ') + ' ' + (r.topic||'') + ' ' + (r.explanation||'')).toLowerCase().includes(q))
    );
    renderList();
  }

  function renderList() {
    const v = state.view;
    const page = state.page, size = state.pageSize;
    const start = page * size;
    const slice = v.slice(start, start + size);
    const host = document.getElementById('bank-list');
    if (v.length === 0) { host.innerHTML = '<p class="muted">No questions match. Try clearing filters.</p>'; document.getElementById('bank-pager').innerHTML = ''; return; }
    const letters = ['A','B','C','D'];
    host.innerHTML = slice.map(q => {
      const opts = q.options.map((o, i) => '<li class="option'+(i===q.correct?' correct':'')+'"><span class="letter">'+letters[i]+'</span><span class="text">'+NM.escape(o)+'</span></li>').join('');
      const expl = q.explanations ? '<ul>' + letters.map(L => '<li class="'+(L===letters[q.correct]?'ok':'bad')+'"><strong>'+L+':</strong> '+NM.escape(q.explanations[L]||'')+'</li>').join('') + '</ul>' : '<p>'+NM.escape(q.explanation||'')+'</p>';
      return '<article style="border:1px solid var(--rule);padding:16px;margin:14px 0">' +
        '<div class="q-num"><span class="badge'+(q.source && q.source.includes('NORCET')?' badge--pyq':'')+'">'+NM.escape(q.source||'')+'</span> · <span class="badge">'+NM.escape(q.subject)+'</span> · <span class="badge">Day '+q.day+'</span> · <span class="badge">'+NM.escape(q.difficulty||'')+'</span> · <span class="badge">'+NM.escape(q.qtype||'')+'</span></div>' +
        '<div class="q-stem">' + NM.escape(q.question) + '</div>' +
        '<ul class="options">' + opts + '</ul>' +
        '<details><summary>Explanations</summary><div class="explanations">' + expl + '</div></details>' +
      '</article>';
    }).join('');
    const total = v.length;
    const pages = Math.ceil(total / size);
    document.getElementById('bank-pager').innerHTML =
      '<div class="btn-row" style="justify-content:space-between;align-items:center;margin-top:20px;padding-top:16px;border-top:1px solid var(--rule)">' +
        '<span class="small muted">'+(start+1)+'–'+Math.min(start+size, total)+' of '+total+'</span>' +
        '<span>' +
          '<button class="btn btn--ghost" id="p-prev" '+(page===0?'disabled':'')+'>Prev</button> ' +
          '<span class="small mono">Page '+(page+1)+' / '+pages+'</span> ' +
          '<button class="btn btn--ghost" id="p-next" '+(page>=pages-1?'disabled':'')+'>Next</button>' +
        '</span>' +
      '</div>';
    const prev = document.getElementById('p-prev'); if (prev) prev.addEventListener('click', () => { if (state.page>0) { state.page--; renderList(); window.scrollTo(0,0);} });
    const next = document.getElementById('p-next'); if (next) next.addEventListener('click', () => { if (state.page<pages-1) { state.page++; renderList(); window.scrollTo(0,0);} });
  }
})();
