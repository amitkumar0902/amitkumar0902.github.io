// Serves the site over HTTP and checks it the way a first-time visitor's
// browser would: does the home page load, is every script it references
// actually served, do the banks and the free sample mock come back complete,
// and does any page print a price outside the elements app-mode hides.
//
//   node norcetprep/test/smoke.mjs      (run from the repo root)
//
// This is the cheap version of the pre-launch click-through. It catches the
// failure that unit tests never do: a file that exists in the repo but is not
// reachable at the URL the page asks for.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'norcetprep';
const PORT = 8912;
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml' };

const server = http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const file = path.join(ROOT, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); return res.end('nope'); }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  res.end(fs.readFileSync(file));
});

await new Promise((r) => server.listen(PORT, r));
const base = `http://localhost:${PORT}`;

const checks = [];
async function check(name, fn) {
  try { await fn(); checks.push(['PASS', name]); }
  catch (e) { checks.push(['FAIL', `${name} — ${e.message}`]); }
}

await check('home page serves', async () => {
  const r = await fetch(base + '/index.html');
  if (!r.ok) throw new Error('HTTP ' + r.status);
  const html = await r.text();
  for (const marker of ['id="quiz-host"', 'id="exam-strip"', 'js/daily-quiz.js', 'Not affiliated']) {
    if (!html.includes(marker)) throw new Error('missing ' + marker);
  }
});

await check('every script the home loads is served', async () => {
  const html = await (await fetch(base + '/index.html')).text();
  const srcs = [...html.matchAll(/<script src="((?!https?:)[^"]+)"/g)].map((m) => m[1]);
  for (const s of srcs) {
    const r = await fetch(base + '/' + s);
    if (!r.ok) throw new Error(`${s} → ${r.status}`);
  }
});

await check('the stylesheet and manifest serve', async () => {
  for (const u of ['/css/home.css', '/manifest.webmanifest', '/img/icon-512.svg']) {
    const r = await fetch(base + u);
    if (!r.ok) throw new Error(`${u} → ${r.status}`);
  }
});

await check('all 13 free banks serve and every question is usable', async () => {
  const slugs = ['foundations', 'medical-surgical', 'pharmacology', 'anatomy-physiology',
    'obstetric-gynecology', 'pediatric', 'community-health', 'psychiatric', 'microbiology',
    'nutrition-biochemistry', 'administration-management', 'first-aid', 'previous-years'];
  let total = 0;
  for (const s of slugs) {
    const r = await fetch(`${base}/data/questions/${s}.json`);
    if (!r.ok) throw new Error(`${s} → ${r.status}`);
    const list = await r.json();
    total += list.length;
    for (const q of list) {
      if (q.options.length !== 4 || !q.explanation || !q.citation) throw new Error(`${s}#${q.id} incomplete`);
    }
  }
  if (total !== 547) throw new Error(`expected 547 questions, got ${total}`);
});

await check('the free sample mock serves and is complete', async () => {
  const idx = await (await fetch(base + '/data/mains/mocks/index.json')).json();
  const sample = idx.find((m) => m.free);
  if (!sample) throw new Error('no mock designated free');
  const r = await fetch(`${base}/data/mains/mocks/mock-${sample.id}.json`);
  if (!r.ok) throw new Error(`sample mock → ${r.status}`);
  const mock = await r.json();
  if (mock.questions.length !== sample.count) throw new Error('sample count mismatch');
});

await check('the fix-log data serves and has entries', async () => {
  const d = await (await fetch(base + '/data/fix-log.json')).json();
  if (!d.entries || !d.entries.length) throw new Error('fix-log is empty');
});

await check('the trust pages serve', async () => {
  for (const u of ['/methodology.html', '/fix-log.html', '/pricing.html', '/account.html']) {
    const r = await fetch(base + u);
    if (!r.ok) throw new Error(`${u} → ${r.status}`);
    const html = await r.text();
    if (!/not affiliated/i.test(html)) throw new Error(`${u} missing the AIIMS disclaimer`);
  }
});

await check('no page advertises a price outside the purchase surfaces', async () => {
  // The app-mode blackout depends on prices living only where nd-buy-only can
  // hide them. A stray ₹ in the study app would leak into the Play build.
  const files = ['/index.html', '/mains-plan/index.html', '/mains-plan/mocks/index.html'];
  for (const u of files) {
    const html = await (await fetch(base + u)).text();
    const body = html.replace(/class="[^"]*nd-buy-only[^"]*"[^>]*>[^<]*</g, '');
    if (/₹\d/.test(body)) throw new Error(`${u} prints a price outside a nd-buy-only element`);
  }
});

server.close();
for (const [status, name] of checks) console.log(`  ${status}  ${name}`);
const failed = checks.filter((c) => c[0] === 'FAIL').length;
console.log(failed ? `\n${failed} smoke check(s) failed.` : '\nAll smoke checks passed.');
process.exit(failed ? 1 : 0);
