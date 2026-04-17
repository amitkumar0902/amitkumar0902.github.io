(function () {
  'use strict';
  const NM = window.NM;
  const ROOT = NM.rootPath();

  window.NMFlash = {
    start(deck) {
      fetch(ROOT + 'data/mains/flashcards/' + deck + '.json').then(r => r.json()).then(cards => run(deck, cards));
    }
  };

  function run(deck, cards) {
    const host = document.getElementById('fc-root');
    const state = {
      queue: cards.map((c, i) => ({...c, i, seen: 0})),
      cur: null, side: 'front', done: 0, total: cards.length
    };
    NM.shuffle(state.queue);

    function draw() {
      if (state.queue.length === 0) return finish();
      state.cur = state.queue.shift();
      state.side = 'front';
      render();
    }
    function render() {
      const c = state.cur;
      host.innerHTML =
        '<p class="small muted">Deck: <strong>' + NM.escape(deck) + '</strong> · progress ' + state.done + ' / ' + state.total + ' · remaining ' + state.queue.length + '</p>' +
        '<div class="progress-bar"><div class="progress-bar__fill" style="width:'+(state.done/state.total*100)+'%"></div></div>' +
        '<div class="fc-stage" id="stage" tabindex="0" role="button" aria-label="Flashcard, press to flip">' +
          (state.side === 'front' ? NM.escape(c.front) : '<span class="back">'+NM.escape(c.back)+'</span>') +
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
        document.getElementById('right').addEventListener('click', () => mark(true));
        document.getElementById('wrong').addEventListener('click', () => mark(false));
      }
    }
    function flip() {
      if (state.side === 'front') { state.side = 'back'; render(); }
    }
    function mark(ok) {
      if (ok) { state.done++; NM.haptic(15); }
      else { state.queue.push(state.cur); NM.haptic(60); }
      draw();
    }
    function finish() {
      host.innerHTML =
        '<h2>Deck complete</h2>' +
        '<p>All ' + state.total + ' cards mastered in this session.</p>' +
        '<div class="btn-row"><button class="btn btn--accent" id="again">Shuffle again</button><a class="btn btn--ghost" href="index.html">Back to decks</a></div>';
      document.getElementById('again').addEventListener('click', () => { state.queue = cards.map(c=>({...c})); NM.shuffle(state.queue); state.done = 0; draw(); });
      NM.confettiBurst();
      NM.recordActivity(Math.max(1, Math.round(state.total * 10 / 60)), state.total);
    }

    document.addEventListener('keydown', (e) => {
      if (document.getElementById('nm-palette')) return;
      if (e.key === ' ') { e.preventDefault(); flip(); }
      else if (state.side === 'back' && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); mark(true); }
      else if (state.side === 'back' && (e.key === 'j' || e.key === 'J')) { e.preventDefault(); mark(false); }
    });

    draw();
  }
})();
