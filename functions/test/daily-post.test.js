// Behaviour tests for the Telegram feeder.
//
// The contract that matters: the bot must select the SAME question the website
// serves for that IST date (nobody wants "today's MCQ" to disagree with the
// site), it must link back into the on-site quiz, and it must not give the
// answer away in plain text or claim a recall set is an official paper.

const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const fs = require('node:fs');
const Module = require('node:module');

// Stub the functions SDK — none of it is needed to test selection and copy.
const stubs = {
  'firebase-functions/v2/scheduler': { onSchedule: (_o, h) => h },
  'firebase-functions/v2/https': { onRequest: (_o, h) => h },
  'firebase-functions/params': { defineSecret: (name) => ({ name, value: () => 'test' }) },
  'firebase-functions': { logger: { info() {}, warn() {}, error() {} } }
};
const realLoad = Module._load;
Module._load = function (request, parent, isMain) {
  if (Object.prototype.hasOwnProperty.call(stubs, request)) return stubs[request];
  return realLoad.call(this, request, parent, isMain);
};

const REPO = path.join(__dirname, '..', '..');
const BANKS = path.join(REPO, 'norcetprep', 'data', 'questions');

// The bot fetches the live site's banks; serve the repo's copies instead.
const realFetch = global.fetch;
global.fetch = async (url) => {
  const m = String(url).match(/data\/questions\/([a-z-]+\.json)$/);
  if (!m) return realFetch(url);
  const file = path.join(BANKS, m[1]);
  if (!fs.existsSync(file)) return { ok: false, status: 404, json: async () => ({}) };
  return { ok: true, status: 200, json: async () => JSON.parse(fs.readFileSync(file, 'utf8')) };
};

const { _internal } = require('../daily-post');

test('the IST date rolls at midnight India time', () => {
  assert.equal(_internal.istDate(new Date('2026-09-01T18:45:00Z')), '2026-09-02');
  assert.equal(_internal.istDate(new Date('2026-09-01T18:15:00Z')), '2026-09-01');
});

test('the bot picks the same questions the website does for a date', async () => {
  // The website's rule, loaded from the site script itself — if either side
  // drifts, this fails, which is the whole point.
  const { loadScripts, repoFetch } = require(path.join(REPO, 'norcetprep', 'test', 'dom-shim.js'));
  const site = loadScripts(['js/daily-quiz.js'], {
    href: 'https://nursedrill.com/index.html',
    fetchImpl: repoFetch()
  });

  for (const date of ['2026-08-15', '2026-09-12', '2027-02-01']) {
    const fromSite = await site.ND.dailyQuiz.forDate('', date);
    const fromBot = await _internal.selectionFor(date);
    assert.equal(
      JSON.stringify(fromBot.questions.map((q) => q.qkey)),
      JSON.stringify(fromSite.questions.map((q) => q.qkey)),
      `selection differs on ${date}`
    );
    assert.equal(fromBot.pyq.qkey, fromSite.pyq.qkey, `PYQ differs on ${date}`);
  }
});

test('the posted MCQ hides the answer and links into the on-site quiz', async () => {
  const { questions } = await _internal.selectionFor('2026-09-12');
  const msg = _internal.mcqMessage(questions[0], '2026-09-12');

  assert.match(msg, /nursedrill\.com/, 'links back to the site');
  assert.match(msg, /<tg-spoiler>[A-D]<\/tg-spoiler>/, 'answer is behind a spoiler');
  // The message is HTML, so the citation arrives escaped ("Brunner &amp; …").
  const escapedCitation = questions[0].citation.replace(/&/g, '&amp;');
  assert.ok(msg.includes(escapedCitation), 'the source travels with the question');
  // The explanation stays on site — that is where the funnel is.
  assert.ok(!msg.includes(questions[0].explanation), 'explanation is not given away in the post');
});

test('posts carry no urgency copy and no purchase push', async () => {
  const { questions, pyq } = await _internal.selectionFor('2026-09-12');
  for (const msg of [_internal.mcqMessage(questions[0], '2026-09-12'), _internal.pyqMessage(pyq)]) {
    assert.doesNotMatch(msg, /hurry|last chance|only \d+ (left|hours)|limited time|₹/i);
    assert.doesNotMatch(msg, /checkout|pricing\.html/i);
  }
});

test('the previous-year post says it is memory-based recall, not an official paper', async () => {
  const { pyq } = await _internal.selectionFor('2026-09-12');
  const msg = _internal.pyqMessage(pyq);
  assert.match(msg, /not a reproduction of any official paper/i, 'the disclaimer is on the post');
  assert.doesNotMatch(msg, /verbatim|official PDF/i, 'and it claims nothing it should not');
});

test('only verified questions are eligible for posting', () => {
  assert.equal(_internal.eligible({ question: 'q', options: [1, 2, 3, 4], correct: 0, explanation: 'e', citation: 'c' }), false);
  assert.equal(_internal.eligible({ question: 'q', options: ['a', 'b', 'c', 'd'], correct: 0, explanation: 'e' }), false, 'no citation');
  assert.equal(_internal.eligible({ question: 'q', options: ['a', 'b', 'c', 'd'], correct: 0, citation: 'c' }), false, 'no explanation');
  assert.equal(_internal.eligible({ question: 'q', options: ['a', 'b', 'c', 'd'], correct: 0, explanation: 'e', citation: 'c' }), true);
});
