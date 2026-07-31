// Daily quiz — the on-product conversion engine (T12 / PRD user story 3).
//
// Ten questions a day, the same ten for everyone, drawn deterministically from
// the verified bank by the IST calendar date. No account needed: the streak
// lives in local storage and merges into the account on sign-in through the
// existing progress merge (nm.v1.streak / nm.v1.dailyQuiz are synced keys).
//
// Why deterministic: a daily quiz people can reroll is not a daily quiz, and
// the Telegram bot has to be able to post the same questions the site serves
// without shipping the questions themselves anywhere.
(function () {
  'use strict';
  var ND = window.ND = window.ND || {};

  var COUNT = 10;
  var STORE_KEY = 'dailyQuiz';        // { date, answers:[], done, score }
  var PYQ_KEY = 'dailyPyq';

  // ---- IST date ---------------------------------------------------------------
  // The exam is Indian and so is the day boundary: 00:00 IST, wherever you are.
  function istDate(now) {
    var d = now || new Date();
    var ist = new Date(d.getTime() + (330 + d.getTimezoneOffset()) * 60000);
    return ist.getFullYear() + '-' + pad(ist.getMonth() + 1) + '-' + pad(ist.getDate());
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function dayNumber(dateStr) {
    // Days since epoch for the IST date — the seed. Stable across devices.
    var p = dateStr.split('-');
    return Math.floor(Date.UTC(+p[0], +p[1] - 1, +p[2]) / 86400000);
  }

  // Mulberry32: small, fast, and identical everywhere — the bot in Node and the
  // browser must select the same questions from the same seed.
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // A question is quiz-eligible when it has been through the pipeline: an
  // explanation, a citation, and four options. Anything unverified stays out.
  function eligible(q) {
    return q && typeof q.question === 'string' && Array.isArray(q.options) && q.options.length === 4 &&
      typeof q.correct === 'number' && q.explanation && String(q.explanation).trim() &&
      q.citation && String(q.citation).trim();
  }

  function pick(pool, seed, n) {
    var r = rng(seed);
    var idx = pool.map(function (_, i) { return i; });
    for (var i = idx.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = idx[i]; idx[i] = idx[j]; idx[j] = t;
    }
    var out = [], seenTopic = {};
    // Spread across topics first, then fill — ten questions on one topic is a
    // worse daily than ten across the syllabus.
    for (var k = 0; k < idx.length && out.length < n; k++) {
      var q = pool[idx[k]];
      var key = (q.subject || '') + '|' + (q.topic || '');
      if (seenTopic[key]) continue;
      seenTopic[key] = 1;
      out.push(q);
    }
    for (var m = 0; m < idx.length && out.length < n; m++) {
      if (out.indexOf(pool[idx[m]]) === -1) out.push(pool[idx[m]]);
    }
    return out;
  }

  // ---- storage ----------------------------------------------------------------
  function get(k, d) {
    if (window.NM) return NM.get(k, d);
    try { var v = localStorage.getItem('nm.v1.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; }
  }
  function set(k, v) {
    if (window.NM) return NM.set(k, v);
    try { localStorage.setItem('nm.v1.' + k, JSON.stringify(v)); } catch (e) {}
  }

  function state(date) {
    var s = get(STORE_KEY, null);
    if (!s || s.date !== date) s = { date: date, answers: [], done: false, score: 0 };
    return s;
  }

  // Streak: at most one increment per IST day, and only on completion.
  function bumpStreak(date) {
    var s = get('streak', { current: 0, longest: 0, last: null });
    if (s.last === date) return s;
    var prev = new Date(date + 'T00:00:00Z');
    prev.setUTCDate(prev.getUTCDate() - 1);
    var yesterday = prev.toISOString().slice(0, 10);
    s.current = (s.last === yesterday) ? (s.current || 0) + 1 : 1;
    if (s.current > (s.longest || 0)) s.longest = s.current;
    s.last = date;
    set('streak', s);
    return s;
  }

  function streak() { return get('streak', { current: 0, longest: 0, last: null }); }

  // ---- data -------------------------------------------------------------------
  // The daily quiz draws from the FREE topic banks only: it is the free funnel,
  // it must work signed-out, and it must not leak premium content.
  var TOPIC_FILES = [
    'foundations', 'medical-surgical', 'pharmacology', 'anatomy-physiology',
    'obstetric-gynecology', 'pediatric', 'community-health', 'psychiatric',
    'microbiology', 'nutrition-biochemistry', 'administration-management',
    'first-aid', 'previous-years'
  ];

  var poolPromise = null;
  function pool(root) {
    if (poolPromise) return poolPromise;
    poolPromise = Promise.all(TOPIC_FILES.map(function (slug) {
      return fetch(root + 'data/questions/' + slug + '.json')
        .then(function (r) { return r.ok ? r.json() : []; })
        .then(function (list) {
          return list.filter(eligible).map(function (q) {
            var c = Object.assign({}, q);
            c.subject = c.subject || slugLabel(slug);
            c.qkey = slug + ':' + q.id;
            return c;
          });
        })
        .catch(function () { return []; });
    })).then(function (chunks) {
      var all = [];
      chunks.forEach(function (c) { all = all.concat(c); });
      // Stable order regardless of network race — the seed does the choosing.
      all.sort(function (a, b) { return a.qkey < b.qkey ? -1 : a.qkey > b.qkey ? 1 : 0; });
      return all;
    });
    return poolPromise;
  }

  function slugLabel(slug) {
    return slug.split('-').map(function (w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' ');
  }

  function forDate(root, date) {
    return pool(root).then(function (all) {
      if (!all.length) throw new Error('no verified questions available');
      var seed = dayNumber(date);
      var picked = pick(all, seed, COUNT);
      var pyqPool = all.filter(function (q) { return /previous/i.test(q.qkey) || q.year; });
      var pyq = pyqPool.length ? pick(pyqPool, seed + 7919, 1)[0] : null;
      return { date: date, questions: picked, pyq: pyq };
    });
  }

  ND.dailyQuiz = {
    istDate: istDate,
    dayNumber: dayNumber,
    forDate: forDate,
    state: state,
    streak: streak,
    bumpStreak: bumpStreak,
    save: function (s) { set(STORE_KEY, s); },
    count: COUNT,
    PYQ_KEY: PYQ_KEY
  };
  if (window.NM) window.NM.dailyQuiz = ND.dailyQuiz;
})();
