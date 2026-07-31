// The Telegram feeder (T12 / PRD user story 6).
//
// A scheduled function posts the day's MCQ and the previous-year question of
// the day to the NurseDrill channel, every day at a fixed IST time, with no
// manual step. Both link into the on-site quiz, because conversion happens
// where the paywall is — the channel is a feeder, not a content home.
//
// The questions are chosen by the SAME deterministic rule the website uses
// (daily-quiz.js): the IST date seeds a Mulberry32 shuffle over the free topic
// banks. That is why the bot can post "today's first question" without the
// site and the bot ever exchanging a message.
//
// Deploy:  firebase deploy --only functions
// Secrets: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID, and (optional) ALERT_EMAIL_URL
//
// A manual announcement path is exported too — announce() posts arbitrary text
// for weekly-mock and launch moments.

const { onSchedule } = require('firebase-functions/v2/scheduler');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');
const { logger } = require('firebase-functions');

const BOT_TOKEN = defineSecret('TELEGRAM_BOT_TOKEN');
const CHAT_ID = defineSecret('TELEGRAM_CHAT_ID');
const ANNOUNCE_KEY = defineSecret('ANNOUNCE_KEY');

const SITE = 'https://nursedrill.com';
const QUIZ_URL = SITE + '/#quiz-h';
const BANK_BASE = SITE + '/data/questions/';
const LETTERS = ['A', 'B', 'C', 'D'];

// Mirrors js/daily-quiz.js — the two must select identically.
const TOPIC_FILES = [
  'foundations', 'medical-surgical', 'pharmacology', 'anatomy-physiology',
  'obstetric-gynecology', 'pediatric', 'community-health', 'psychiatric',
  'microbiology', 'nutrition-biochemistry', 'administration-management',
  'first-aid', 'previous-years'
];

function istDate(now) {
  const d = now || new Date();
  const ist = new Date(d.getTime() + (330 + d.getTimezoneOffset()) * 60000);
  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  return `${ist.getFullYear()}-${pad(ist.getMonth() + 1)}-${pad(ist.getDate())}`;
}

function dayNumber(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
}

function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function eligible(q) {
  return !!(q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 4 &&
  q.options.every((o) => typeof o === 'string' && o.trim()) &&
    typeof q.correct === 'number' && q.explanation && String(q.explanation).trim() &&
    q.citation && String(q.citation).trim());
}

function pick(pool, seed, n) {
  const r = rng(seed);
  const idx = pool.map((_, i) => i);
  for (let i = idx.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  const out = [];
  const seenTopic = new Set();
  for (let k = 0; k < idx.length && out.length < n; k++) {
    const q = pool[idx[k]];
    const key = (q.subject || '') + '|' + (q.topic || '');
    if (seenTopic.has(key)) continue;
    seenTopic.add(key);
    out.push(q);
  }
  for (let m = 0; m < idx.length && out.length < n; m++) {
    if (!out.includes(pool[idx[m]])) out.push(pool[idx[m]]);
  }
  return out;
}

async function loadPool() {
  const chunks = await Promise.all(TOPIC_FILES.map(async (slug) => {
    try {
      const res = await fetch(BANK_BASE + slug + '.json');
      if (!res.ok) return [];
      const list = await res.json();
      return list.filter(eligible).map((q) => ({ ...q, subject: q.subject || slug, qkey: slug + ':' + q.id }));
    } catch (e) {
      logger.warn('bank fetch failed', slug, e.message);
      return [];
    }
  }));
  const all = chunks.flat();
  all.sort((a, b) => (a.qkey < b.qkey ? -1 : a.qkey > b.qkey ? 1 : 0));
  return all;
}

async function selectionFor(date) {
  const all = await loadPool();
  if (!all.length) throw new Error('no eligible questions available');
  const seed = dayNumber(date);
  const questions = pick(all, seed, 10);
  const pyqPool = all.filter((q) => /^previous-years:/.test(q.qkey) || q.year);
  const pyq = pyqPool.length ? pick(pyqPool, seed + 7919, 1)[0] : null;
  return { questions, pyq };
}

// ---- Telegram ---------------------------------------------------------------

function esc(s) {
  return String(s == null ? '' : s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);
}

async function send(token, chatId, text, opts = {}) {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: opts.preview === true ? false : true
    })
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.ok === false) {
    throw new Error(`telegram ${res.status}: ${JSON.stringify(body).slice(0, 200)}`);
  }
  return body.result;
}

function stripPrefix(option) {
  return String(option).replace(/^[A-D]\.\s*/, '');
}

// Answers are hidden behind a spoiler so the channel is practice, not a
// giveaway — and the explanation stays on the site, where the funnel is.
function mcqMessage(q, date) {
  const opts = q.options.map((o, i) => `${LETTERS[i]}. ${esc(stripPrefix(o))}`).join('\n');
  return [
    `<b>Daily MCQ · ${esc(date)}</b>`,
    '',
    esc(q.question),
    '',
    opts,
    '',
    `Answer: <tg-spoiler>${LETTERS[q.correct]}</tg-spoiler>`,
    `<i>${esc(q.citation)}</i>`,
    '',
    `Nine more, with full explanations: ${QUIZ_URL}`
  ].join('\n');
}

function pyqMessage(q) {
  const opts = q.options.map((o, i) => `${LETTERS[i]}. ${esc(stripPrefix(o))}`).join('\n');
  return [
    '<b>Previous-year question of the day</b>',
    '<i>Memory-based recall, reworded — not a reproduction of any official paper.</i>',
    '',
    esc(q.question),
    '',
    opts,
    '',
    `Answer: <tg-spoiler>${LETTERS[q.correct]}</tg-spoiler>`,
    '',
    `Explanation and source on site: ${QUIZ_URL}`
  ].join('\n');
}

// ---- failure alert ----------------------------------------------------------
// Monitors should tell the owner, not angry users (T14). Cloud Logging fires
// the configured log-based alert on this error; the optional webhook is the
// same signal delivered to email or chat.
async function alertOwner(what, err) {
  logger.error('ALERT nursedrill', what, err && err.message);
  const hook = process.env.ALERT_WEBHOOK_URL;
  if (!hook) return;
  try {
    await fetch(hook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: `NurseDrill alert — ${what}: ${err && err.message}` })
    });
  } catch (e) {
    logger.error('alert webhook failed', e.message);
  }
}

// ---- the scheduled post -----------------------------------------------------

exports.dailyTelegramPost = onSchedule(
  {
    schedule: '30 7 * * *',        // 07:30 IST — before the morning study block
    timeZone: 'Asia/Kolkata',
    region: 'asia-south1',
    secrets: [BOT_TOKEN, CHAT_ID],
    retryCount: 2
  },
  async () => {
    const date = istDate();
    try {
      const { questions, pyq } = await selectionFor(date);
      await send(BOT_TOKEN.value(), CHAT_ID.value(), mcqMessage(questions[0], date), { preview: true });
      if (pyq) await send(BOT_TOKEN.value(), CHAT_ID.value(), pyqMessage(pyq));
      logger.info('daily post sent', date);
    } catch (e) {
      await alertOwner('daily Telegram post failed', e);
      throw e;                      // let the scheduler retry
    }
  }
);

// ---- manual announcements ---------------------------------------------------
// Weekly-mock and launch posts. Guarded by a shared key so the endpoint is not
// an open megaphone; it posts text and nothing else.
exports.announce = onRequest(
  { region: 'asia-south1', secrets: [BOT_TOKEN, CHAT_ID, ANNOUNCE_KEY], maxInstances: 1 },
  async (req, res) => {
    if (req.method !== 'POST') return res.status(405).send('POST only');
    if (req.get('x-announce-key') !== ANNOUNCE_KEY.value()) return res.status(403).send('forbidden');
    const text = req.body && typeof req.body.text === 'string' ? req.body.text.trim() : '';
    if (!text) return res.status(400).send('text required');
    if (text.length > 3500) return res.status(400).send('too long for one Telegram message');
    try {
      await send(BOT_TOKEN.value(), CHAT_ID.value(), text, { preview: req.body.preview === true });
      return res.status(200).send('posted');
    } catch (e) {
      await alertOwner('manual announcement failed', e);
      return res.status(500).send('failed');
    }
  }
);

// Exported for the test suite: the selection rule is the contract with the
// website, so it is tested rather than trusted.
exports._internal = { istDate, dayNumber, selectionFor, mcqMessage, pyqMessage, pick, rng, eligible };
