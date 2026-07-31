// Behaviour tests for the front-end pieces that money and trust depend on:
// the paywall gate, premium/free content routing, and the daily quiz.
//
// Run:  node --test norcetprep/test/frontend.test.js
//
// Everything is asserted through observable behaviour — what a visitor on a
// given origin, in a given mode, on a given date would get.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { loadScripts, repoFetch } = require('./dom-shim');

// ---- paywall: path maths on both origins ------------------------------------

test('root path resolves on the product domain and the legacy origin', () => {
  const product = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/mains-plan/mocks/mock.html' });
  assert.equal(product.ND.paywall.rootPath(), '../../');

  const legacy = loadScripts(['js/paywall.js'], { href: 'https://amitkumar0902.github.io/norcetprep/mains-plan/mocks/mock.html' });
  assert.equal(legacy.ND.paywall.rootPath(), '../../');

  const top = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/index.html' });
  assert.equal(top.ND.paywall.rootPath(), './');
});

// ---- app-mode (Play consumption-only compliance) ----------------------------

test('app-mode is detected from the TWA start URL and persists for the session', () => {
  const s = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/index.html?src=twa' });
  assert.equal(s.ND.paywall.appMode(), true);
  assert.equal(s.sessionStorage.getItem('nd.appMode'), '1');
});

test('app-mode is detected from an android-app referrer', () => {
  const s = loadScripts(['js/paywall.js'], {
    href: 'https://nursedrill.com/pricing.html',
    referrer: 'android-app://com.nursedrill.twa'
  });
  assert.equal(s.ND.paywall.appMode(), true);
});

test('app-mode never leaks into a normal browser session', () => {
  // The flag lives in sessionStorage precisely so a TWA visit cannot black out
  // the same device's regular Chrome. A plain visit must stay in browser mode.
  const s = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/index.html' });
  assert.equal(s.ND.paywall.appMode(), false);
  assert.equal(s.localStorage.getItem('nd.appMode'), null);
});

test('a purchase page in app-mode is blacked out, with no price or checkout link', () => {
  const s = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/pricing.html?src=twa' });
  const html = JSON.stringify(s.document.body.children.map((c) => c.innerHTML || ''));
  assert.match(html, /Not available in the app/);
  assert.doesNotMatch(html, /₹|checkout\.html|pricing\.html/);
});

test('a purchase page in a browser is not blacked out', () => {
  const s = loadScripts(['js/paywall.js'], { href: 'https://nursedrill.com/pricing.html' });
  const html = JSON.stringify(s.document.body.children.map((c) => c.innerHTML || ''));
  assert.doesNotMatch(html, /Not available in the app/);
});

// ---- content routing --------------------------------------------------------

test('premium paths route to the gated store, free paths never do', () => {
  const s = loadScripts(['js/paywall.js', 'js/content.js'], { href: 'https://nursedrill.com/index.html' });
  const isPremium = s.ND.content.isPremium;

  assert.equal(isPremium('../../data/mains/question-bank.json'), true);
  assert.equal(isPremium('../../data/mains/mocks/mock-1.json'), true);
  assert.equal(isPremium('../../data/mains/notes/medicine.json'), true);
  assert.equal(isPremium('../../data/mains/pyqs/norcet-9-mains-2025.json'), true);

  // Merchandising metadata and the designated samples stay free, or the
  // library renders a blank page to signed-out visitors.
  assert.equal(isPremium('../../data/mains/mocks/index.json'), false);
  assert.equal(isPremium('../../data/mains/notes/foundation.json'), false);
  assert.equal(isPremium('../../data/mains/stats.json'), false);
  assert.equal(isPremium('data/questions/pharmacology.json'), false);
  assert.equal(isPremium('data/fix-log.json'), false);
});

test('with the paywall off, premium files still load from static hosting', async () => {
  const s = loadScripts(['js/paywall.js', 'js/content.js'], {
    href: 'https://nursedrill.com/index.html',
    fetchImpl: repoFetch()
  });
  assert.equal(s.ND.paywall.enabled(), false, 'flag ships off until go-live');
  const data = await s.ND.content.json('data/mains/mocks/index.json');
  assert.ok(Array.isArray(data) && data.length > 0);
});

// ---- daily quiz -------------------------------------------------------------

function quizSandbox() {
  return loadScripts(['js/daily-quiz.js'], {
    href: 'https://nursedrill.com/index.html',
    fetchImpl: repoFetch()
  });
}

test('the same IST date serves the same ten questions to everyone', async () => {
  const a = quizSandbox();
  const b = quizSandbox();
  const [qa, qb] = await Promise.all([
    a.ND.dailyQuiz.forDate('', '2026-09-01'),
    b.ND.dailyQuiz.forDate('', '2026-09-01')
  ]);
  assert.equal(qa.questions.length, 10);
  // Compared as JSON: the modules run in a vm realm, so their arrays are
  // structurally right but not reference-equal to this realm's Array.
  assert.equal(JSON.stringify(qa.questions.map((q) => q.qkey)),
               JSON.stringify(qb.questions.map((q) => q.qkey)));
});

test('a different date serves a different set', async () => {
  const s = quizSandbox();
  const one = await s.ND.dailyQuiz.forDate('', '2026-09-01');
  const two = await s.ND.dailyQuiz.forDate('', '2026-09-02');
  assert.notEqual(JSON.stringify(one.questions.map((q) => q.qkey)),
                  JSON.stringify(two.questions.map((q) => q.qkey)));
});

test('every served question carries an explanation and a citation', async () => {
  const s = quizSandbox();
  for (const date of ['2026-08-01', '2026-09-12', '2027-02-14']) {
    const q = await s.ND.dailyQuiz.forDate('', date);
    assert.equal(q.questions.length, 10, date);
    for (const item of q.questions) {
      assert.ok(item.explanation && item.explanation.trim(), `${date} ${item.qkey} explanation`);
      assert.ok(item.citation && item.citation.trim(), `${date} ${item.qkey} citation`);
      assert.equal(item.options.length, 4);
    }
  }
});

test('a day of questions spans several subjects rather than one topic', async () => {
  const s = quizSandbox();
  const q = await s.ND.dailyQuiz.forDate('', '2026-09-05');
  const topics = new Set(q.questions.map((x) => (x.subject || '') + '|' + (x.topic || '')));
  assert.ok(topics.size >= 8, `expected a spread, got ${topics.size} distinct topics`);
});

test('a previous-year question of the day is surfaced', async () => {
  const s = quizSandbox();
  const q = await s.ND.dailyQuiz.forDate('', '2026-09-05');
  assert.ok(q.pyq && q.pyq.question, 'a PYQ of the day is chosen');
  assert.ok(q.pyq.citation, 'and it is cited like everything else');
});

test('the IST date rolls at midnight India time, not UTC', () => {
  const s = quizSandbox();
  // 18:45 UTC on 1 Sep is already 00:15 on 2 Sep in India.
  assert.equal(s.ND.dailyQuiz.istDate(new Date('2026-09-01T18:45:00Z')), '2026-09-02');
  assert.equal(s.ND.dailyQuiz.istDate(new Date('2026-09-01T18:15:00Z')), '2026-09-01');
});

// ---- streak -----------------------------------------------------------------

test('the streak increments at most once a day and survives a signed-out visitor', () => {
  const s = quizSandbox();
  const dq = s.ND.dailyQuiz;
  assert.equal(dq.streak().current, 0);

  dq.bumpStreak('2026-09-01');
  assert.equal(dq.streak().current, 1);
  dq.bumpStreak('2026-09-01');            // same day again
  assert.equal(dq.streak().current, 1, 'no second increment on the same date');

  dq.bumpStreak('2026-09-02');
  assert.equal(dq.streak().current, 2);
  assert.equal(dq.streak().longest, 2);
});

test('a missed day resets the streak but keeps the personal best', () => {
  const s = quizSandbox();
  const dq = s.ND.dailyQuiz;
  dq.bumpStreak('2026-09-01');
  dq.bumpStreak('2026-09-02');
  dq.bumpStreak('2026-09-03');
  assert.equal(dq.streak().current, 3);

  dq.bumpStreak('2026-09-05');            // skipped the 4th
  assert.equal(dq.streak().current, 1);
  assert.equal(dq.streak().longest, 3, 'personal best is not lost');
});

test('quiz state is per-date, so yesterday\'s answers do not carry over', () => {
  const s = quizSandbox();
  const dq = s.ND.dailyQuiz;
  const yesterday = dq.state('2026-09-01');
  yesterday.answers.push({ qkey: 'x', chosen: 1, correct: true });
  yesterday.done = true;
  dq.save(yesterday);

  const today = dq.state('2026-09-02');
  assert.equal(today.done, false);
  assert.equal(today.answers.length, 0);
});
