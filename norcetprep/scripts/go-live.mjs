#!/usr/bin/env node
/**
 * The go-live flip, as one command instead of seven careful edits.
 *
 *   node norcetprep/scripts/go-live.mjs --check          # what's ready, what isn't
 *   node norcetprep/scripts/go-live.mjs                  # dry run: show every edit
 *   node norcetprep/scripts/go-live.mjs --write          # make them
 *   node norcetprep/scripts/go-live.mjs --write --rollback
 *
 * It performs exactly the checklist in DEPLOY.md → "Go-live flip":
 *   1. js/paywall.js            PAYWALL_ENABLED = true
 *   2. pricing.html             status block rewritten with the printed offer
 *                               end date (launch + 30 days — printed once,
 *                               never moved)
 *   3. firebase.json            premium statics excluded from hosting
 *   4. sw.js                    cache name bumped so grace-period caches drop
 *   5. js/origin-stub.js        legacy-origin redirect armed
 *   6. login/signup             redirect to account.html; allowlist gate
 *                               removed from js/core.js; js/allowlist.js deleted
 *
 * Live payment-page URLs are NOT edited here: they are pasted into
 * js/payments-config.js by hand, because that is the one step where a
 * copy-paste error charges the wrong amount. --check verifies they are set.
 *
 * The refusals are the point. It will not flip while the legal gate, the
 * gateway URLs or the validators are unresolved.
 */
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const REPO = path.join(ROOT, '..');
const WRITE = process.argv.includes('--write');
const ROLLBACK = process.argv.includes('--rollback');
const CHECK_ONLY = process.argv.includes('--check');

const edits = [];
function plan(file, description, transform) {
  edits.push({ file, description, transform });
}

// ---- preflight ---------------------------------------------------------------

function read(rel) { return fs.readFileSync(path.join(REPO, rel), 'utf8'); }

function preflight() {
  const results = [];
  const check = (name, ok, detail) => results.push({ name, ok, detail });

  // 1. The legal gate. What is banned is claiming OUR content is an official
  // paper — not mentioning that AIIMS publishes one, which is honest advice.
  let claims = [];
  try {
    claims = execSync(
      `grep -rilE "verbatim|(exact|full|complete) official (paper|pdf)|from the official (paper|pdf)|official (paper|pdf) (replay|mock|as an in-app)" --include=*.html --include=*.json ${ROOT} || true`,
      { encoding: 'utf8' }
    ).split('\n').filter((l) => l &&
      !l.includes('stitch_') && !l.includes('.wayfinder') &&
      !l.endsWith('data/fix-log.json'));   // the fix-log records the correction
  } catch (e) { /* grep found nothing */ }
  check('legal gate: no "verbatim"/"official PDF" claims on served pages', claims.length === 0, claims.join(', '));
  check('legal gate: the official paper is not in the repo', !fs.existsSync(path.join(ROOT, 'imp')));

  // 2. Payment pages configured with real URLs.
  const pay = read('norcetprep/js/payments-config.js');
  const placeholders = (pay.match(/YOUR_RAZORPAY_PAGE_URL_\w+/g) || []);
  check('payment pages: live URLs pasted into js/payments-config.js', placeholders.length === 0,
    placeholders.length ? `${placeholders.length} placeholder(s) left` : '');
  check('payment pages: URLs are live-mode (not …/test/…)', !/razorpay\.com\/[^"']*test/i.test(pay));

  // 3. Firebase config is real.
  const cfg = read('norcetprep/js/firebase-config.js');
  check('firebase: real web config pasted', !/YOUR_/.test(cfg));

  // 4. Content gates green.
  for (const [name, cmd] of [
    ['validators: questions', 'node norcetprep/scripts/validate-questions.mjs'],
    ['validators: printed counts', 'node norcetprep/scripts/check-index-counts.mjs'],
    ['gates: consistency gate on the golden set', 'node norcetprep/scripts/verify-questions.mjs --golden --static-only'],
    ['tests: webhook + Telegram', 'npm --prefix functions test'],
    ['tests: front-end behaviour', 'node --test norcetprep/test/frontend.test.js']
  ]) {
    let ok = true, detail = '';
    try {
      execSync(cmd, { cwd: REPO, stdio: 'pipe' });
    } catch (e) {
      ok = false;
      detail = String(e.stdout || e.message).split('\n').slice(-3).join(' ').slice(0, 160);
    }
    check(name, ok, detail);
  }

  // 5. A designated free sample exists, or "judge before you pay" is a lie.
  const idx = JSON.parse(read('norcetprep/data/mains/mocks/index.json'));
  check('sample: at least one library mock is free', idx.some((m) => m.free));

  return results;
}

// ---- the edits ----------------------------------------------------------------

function offerEndDate() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// 1. the flag
plan('norcetprep/js/paywall.js', 'PAYWALL_ENABLED → true', (s) =>
  ROLLBACK
    ? s.replace('var PAYWALL_ENABLED = true;', 'var PAYWALL_ENABLED = false;')
    : s.replace('var PAYWALL_ENABLED = false;', 'var PAYWALL_ENABLED = true;')
);

// 2. pricing status block, with the end date printed exactly once
const LIVE_BLOCK = (end) => `<div class="ce-card">
  <strong>Paid plans are live.</strong> Everything listed under "what stays free" stays free —
  that does not change. The launch price below runs until <strong>${end}</strong>; that date is
  printed here once and does not move. After it, the list price applies.
</div>`;
const PRE_BLOCK_RE = /<div class="ce-card">\s*<strong>Status:<\/strong>[\s\S]*?<\/div>/;
const LIVE_BLOCK_RE = /<div class="ce-card">\s*<strong>Paid plans are live\.<\/strong>[\s\S]*?<\/div>/;
plan('norcetprep/pricing.html', 'status block → live, with the printed offer end date', (s) => {
  if (ROLLBACK) {
    return s.replace(LIVE_BLOCK_RE, `<div class="ce-card">
  <strong>Status:</strong> paid plans open with our premium launch in
  <strong>September 2026</strong>. Until then, everything currently on this site stays free. The
  launch price below runs for the first 30 days after launch — the exact end date will be printed
  here on launch day, and it won't move.
</div>`);
  }
  if (LIVE_BLOCK_RE.test(s)) return s;          // already flipped: never re-date it
  return s.replace(PRE_BLOCK_RE, LIVE_BLOCK(offerEndDate()));
});

// 3. premium statics leave the product domain (they live in Firestore now).
// Listed file by file rather than by glob so the free sample keeps serving —
// Firebase hosting ignore patterns have no negation.
const PREMIUM_IGNORES = [
  'norcetprep/data/mains/question-bank.json',
  'norcetprep/data/mains/mock-blueprint.json',
  'norcetprep/data/mains/frequency-analysis.json',
  'norcetprep/data/mains/drill-drug-calc.json',
  'norcetprep/data/mains/pyqs/**',
  'norcetprep/data/mains/day-slices/**',
  'norcetprep/data/mains/topics/**',
  'norcetprep/data/mains/flashcards/**',
  'norcetprep/data/mains/_audit/**'
];
plan('firebase.json', 'premium statics excluded from hosting (sample mock kept)', (s) => {
  const json = JSON.parse(s);
  // Must mirror firebase.json's baseline. Note there is no '**/.*' rule:
  // /.well-known/assetlinks.json has to be served for the TWA to verify.
  const base = [
    'firebase.json', '**/node_modules/**', 'imp/**', 'scripts/**', '**/*.pdf',
    '**/.git*', '**/.DS_Store', '**/.firebase/**'
  ];
  if (ROLLBACK) {
    json.hosting.ignore = base;
  } else {
    const mocks = fs.readdirSync(path.join(ROOT, 'data/mains/mocks'))
      .filter((f) => f.startsWith('mock-') && f.endsWith('.json'))
      .filter((f) => f !== 'mock-1.json')          // the designated free sample
      .map((f) => 'norcetprep/data/mains/mocks/' + f);
    const notes = fs.readdirSync(path.join(ROOT, 'data/mains/notes'))
      .filter((f) => f.endsWith('.json') && f !== 'foundation.json')  // the open notes sample
      .map((f) => 'norcetprep/data/mains/notes/' + f);
    json.hosting.ignore = [...base, ...PREMIUM_IGNORES, ...mocks, ...notes];
  }
  return JSON.stringify(json, null, 2) + '\n';
});

// 4. service-worker cache bump — grace-period caches still hold premium JSON
plan('norcetprep/sw.js', 'cache name bumped', (s) => {
  const m = s.match(/const CACHE = '([^']+)'/);
  if (!m) throw new Error('cache name not found in sw.js');
  const next = ROLLBACK ? m[1].replace(/-paid$/, '') : (m[1].endsWith('-paid') ? m[1] : m[1] + '-paid');
  return s.replace(m[0], `const CACHE = '${next}'`);
});

// 5. arm the legacy-origin stubs (T08 migration: after go-live, not before)
plan('norcetprep/js/origin-stub.js', 'legacy-origin redirect armed', (s) =>
  ROLLBACK
    ? s.replace('var STUBS_ARMED = true;', 'var STUBS_ARMED = false;')
    : s.replace('var STUBS_ARMED = false;', 'var STUBS_ARMED = true;')
);

// 6. retire the legacy allowlist
const REDIRECT_STUB = (title) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — NurseDrill</title>
<meta name="robots" content="noindex">
<link rel="canonical" href="https://nursedrill.com/account.html">
<meta http-equiv="refresh" content="0; url=account.html">
<link rel="stylesheet" href="css/clinical.css">
</head>
<body>
<p class="ce-sub">Sign-in moved to your <a href="account.html">account page</a>.</p>
<script>location.replace('account.html' + location.search);</script>
</body>
</html>
`;
plan('norcetprep/login.html', 'redirect stub → account.html', () => REDIRECT_STUB('Sign in'));
plan('norcetprep/signup.html', 'redirect stub → account.html', () => REDIRECT_STUB('Create account'));
plan('norcetprep/js/core.js', 'legacy allowlist gate removed', (s) => {
  const start = s.indexOf('  // ==== Legacy auth gate');
  const end = s.indexOf('  var NM = {};');
  if (start === -1 || end === -1) return s;   // already removed
  return s.slice(0, start) +
    '  // The legacy allowlist gate was retired at paid go-live; entitlement\n' +
    '  // gating lives in js/paywall.js.\n\n' +
    s.slice(end);
});

// ---- run ----------------------------------------------------------------------

const results = preflight();
console.log('Preflight');
for (const r of results) {
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.detail ? ' — ' + r.detail : ''}`);
}
const blocked = results.filter((r) => !r.ok);

if (CHECK_ONLY) {
  console.log('---');
  console.log(blocked.length ? `${blocked.length} gate(s) still red.` : 'All gates green — ready to flip.');
  process.exit(blocked.length ? 1 : 0);
}

if (blocked.length && WRITE && !ROLLBACK) {
  console.error('\nRefusing to flip: the gates above are red. Fix them, or run --check to see why.');
  process.exit(1);
}

console.log(`\n${ROLLBACK ? 'Rollback' : 'Flip'} — ${WRITE ? 'writing' : 'dry run'}`);
for (const e of edits) {
  const full = path.join(REPO, e.file);
  if (!fs.existsSync(full)) { console.log(`  SKIP  ${e.file} (missing)`); continue; }
  const before = fs.readFileSync(full, 'utf8');
  const after = e.transform(before);
  if (after === before) { console.log(`  ----  ${e.file}: ${e.description} (already done)`); continue; }
  if (WRITE) fs.writeFileSync(full, after);
  console.log(`  ${WRITE ? 'EDIT' : 'WOULD'}  ${e.file}: ${e.description}`);
}

if (WRITE && !ROLLBACK) {
  const allowlist = path.join(ROOT, 'js/allowlist.js');
  if (fs.existsSync(allowlist)) { fs.unlinkSync(allowlist); console.log('  EDIT  norcetprep/js/allowlist.js: deleted'); }
  const sw = path.join(ROOT, 'sw.js');
  fs.writeFileSync(sw, fs.readFileSync(sw, 'utf8').replace(/^\s*'\.\/js\/allowlist\.js',\n/m, ''));
}

console.log('---');
if (!WRITE) {
  console.log('Dry run. Re-run with --write to apply, then commit as ONE commit and push.');
} else if (ROLLBACK) {
  console.log('Rolled back. The paywall is off again; nothing charges.');
} else {
  console.log('Flipped. Now, in order:');
  console.log('  1. git add -A && git commit -m "norcetprep: paid go-live"');
  console.log('  2. git push   (the hosting Action deploys)');
  console.log('  3. Smoke the live domain — see DEPLOY.md "Post-flip smoke".');
  console.log('  4. Announce: pricing page carries the honesty block; post to Telegram.');
}
