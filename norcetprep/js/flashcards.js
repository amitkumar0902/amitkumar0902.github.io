(function () {
  'use strict';
  const NM = window.NM;
  const ROOT = NM.rootPath();

  window.NMFlash = {
    start(deck) {
      fetch(ROOT + 'data/mains/flashcards/' + deck + '.json').then(r => r.json()).then(cards => run(deck, cards));
    },
    statusFor(deck) {
      const s = NM.get('fc.' + deck) || {};
      return { mastered: s.mastered || 0, total: s.total || 0 };
    }
  };

  function run(deck, cards) {
    const host = document.getElementById('fc-root');
    const storageKey = 'fc.' + deck;
    const saved = NM.get(storageKey) || {};
    const mastered = new Set(saved.masteredIds || []);
    const state = {
      deck: deck,
      total: cards.length,
      cards: cards,
      queue: [],
      cur: null, side: 'front',
      sessionDone: 0
    };

    function buildQueue(resumeOnly) {
      const list = cards.map((c, i) => Object.assign({ _id: i }, c));
      state.queue = resumeOnly
        ? list.filter(function (c) { return !mastered.has(c._id); })
        : list;
      NM.shuffle(state.queue);
    }

    function maybePromptResume() {
      const unseen = cards.length - mastered.size;
      if (mastered.size > 0 && mastered.size < cards.length) {
        host.innerHTML =
          '<h2>Deck: ' + NM.escape(deck) + '</h2>' +
          '<div class="resume-hint">' +
            '<strong>You\'re partway through.</strong> ' + mastered.size + ' of ' + cards.length + ' mastered · ' + unseen + ' remaining.<br>' +
            '<a href="#" data-act="resume">Continue where you left off</a>' +
            '<a href="#" data-act="fresh">Start deck over</a>' +
          '</div>';
        host.querySelectorAll('[data-act]').forEach(function (a) {
          a.addEventListener('click', function (e) {
            e.preventDefault();
            if (a.dataset.act === 'resume') { buildQueue(true); draw(); }
            else { mastered.clear(); buildQueue(false); draw(); }
          });
        });
        return true;
      }
      return false;
    }

    function save() {
      NM.set(storageKey, {
        total: state.total,
        masteredIds: Array.from(mastered),
        mastered: mastered.size,
        updatedAt: Date.now()
      });
    }

    function draw() {
      if (state.queue.length === 0) return finish();
      state.cur = state.queue.shift();
      state.side = 'front';
      render();
    }

    function render() {
      const c = state.cur;
      const img = c.image
        ? '<img class="fc-image" src="' + ROOT + 'data/mains/' + NM.escape(c.image) + '" alt="">'
        : '';
      const src = c.source
        ? '<p class="small muted" style="margin-top:8px">Source: <a href="' + NM.escape(c.source) + '" target="_blank" rel="noopener">reference</a></p>'
        : '';
      const headProgress = (mastered.size + state.sessionDone) + ' / ' + state.total;
      host.innerHTML =
        '<p class="small muted">Deck: <strong>' + NM.escape(deck) + '</strong> · progress ' + headProgress + ' mastered · remaining ' + state.queue.length + '</p>' +
        '<div class="progress-bar"><div class="progress-bar__fill" style="width:' + (((mastered.size + state.sessionDone) / state.total) * 100) + '%"></div></div>' +
        '<div class="fc-stage" id="stage" tabindex="0" role="button" aria-label="Flashcard, press to flip">' +
          (state.side === 'front'
            ? img + NM.escape(c.front)
            : img + '<span class="back">' + NM.escape(c.back) + '</span>' + (state.side === 'back' ? src : '')) +
        '</div>' +
        '<div class="btn-row">' +
          (state.side === 'front' ? '<button class="btn btn--accent" id="flip">Reveal answer</button>' :
            '<button class="btn btn--ghost" id="wrong">✕ Wrong</button><button class="btn btn--accent" id="right">✓ Right</button>') +
          '<a class="btn btn--ghost" href="index.html">Back to decks</a>' +
        '</div>' +
        '<p class="small muted">Shortcuts: <kbd>Space</kbd> flip · <kbd>J</kbd> wrong · <kbd>K</kbd> right</p>';
      document.getElementById('stage').addEventListener('click', flip);
      if (state.side === 'front') document.getElementById('flip').addEventListener('click', flip);
      else {
        document.getElementById('right').addEventListener('click', function () { mark(true); });
        document.getElementById('wrong').addEventListener('click', function () { mark(false); });
      }
      if (NM.Hella) {
        NM.Hella.mount();
        NM.Hella.react('waiting');
      }
    }

    function flip() {
      if (state.side === 'front') { state.side = 'back'; render(); }
    }

    function mark(ok) {
      if (ok) {
        state.sessionDone++;
        mastered.add(state.cur._id);
        NM.haptic(15);
      } else {
        state.queue.push(state.cur);
        mastered.delete(state.cur._id);
        NM.haptic(60);
      }
      if (NM.Hella) NM.Hella.react(ok ? 'correct' : 'wrong');
      save();
      draw();
    }

    function finish() {
      host.innerHTML =
        '<h2>Deck complete</h2>' +
        '<p>All ' + state.total + ' cards mastered.</p>' +
        '<div class="btn-row"><button class="btn btn--accent" id="again">Shuffle again</button><a class="btn btn--ghost" href="index.html">Back to decks</a></div>';
      document.getElementById('again').addEventListener('click', function () {
        mastered.clear(); state.sessionDone = 0; save(); buildQueue(false); draw();
      });
      NM.confettiBurst();
      NM.recordActivity(Math.max(1, Math.round(state.total * 10 / 60)), state.total);
    }

    document.addEventListener('keydown', function (e) {
      if (document.getElementById('nm-palette')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (state.side === 'back' && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); mark(true); }
      else if (state.side === 'back' && (e.key === 'j' || e.key === 'J')) { e.preventDefault(); mark(false); }
    });

    if (!maybePromptResume()) { buildQueue(false); draw(); }
  }
})();
