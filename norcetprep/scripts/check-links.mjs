#!/usr/bin/env node
/**
 * Every local href, src and fetch() path on the site must resolve to a file
 * that exists. A 404 on a study page is a support ticket; a 404 on the money
 * path is a lost sale.
 *
 *   node norcetprep/scripts/check-links.mjs
 *
 * Checks: <a href>, <link href>, <script src>, <img src>, and the data paths
 * the app fetches by string. External URLs, mailto:, tel:, and #anchors are
 * skipped — this is about files we ship.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const SKIP_DIRS = new Set(['stitch_nursedrill_exam_prep_interface', 'imp', '.wayfinder', '.orchestrator', 'node_modules', '.well-known', 'test']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(p, out);
    } else if (/\.(html|js)$/.test(e.name)) out.push(p);
  }
  return out;
}

const problems = [];
let checked = 0;

// `fromRoot`: scripts build data paths at runtime from rootPath(), so a bare
// 'data/…' inside a .js file means the site root, not the script's folder.
function resolveTarget(from, ref, fromRoot) {
  const clean = ref.split('#')[0].split('?')[0];
  if (!clean) return null;
  let target = clean.startsWith('/')
    ? path.join(ROOT, clean.replace(/^\//, ''))
    : fromRoot
      ? path.join(ROOT, clean.replace(/^(\.{1,2}\/)+/, ''))
      : path.resolve(path.dirname(from), clean);
  if (target.endsWith('/')) target = path.join(target, 'index.html');
  if (!fs.existsSync(target)) return target;
  if (fs.statSync(target).isDirectory() && !fs.existsSync(path.join(target, 'index.html'))) return target;
  return null;
}

const HTML_REFS = /(?:href|src)\s*=\s*["']([^"']+)["']/g;
// Data paths the scripts fetch by string, e.g. fetch('../../data/mains/x.json')
const JS_REFS = /['"`]((?:\.{1,2}\/)*data\/[A-Za-z0-9._\/-]+\.json)['"`]/g;

for (const file of walk(ROOT)) {
  let src = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  const isHtml = file.endsWith('.html');
  // Comments explain paths ("e.g. '../../data/mains/x.json'"); they don't ship one.
  if (!isHtml) src = src.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
  const pattern = isHtml ? HTML_REFS : JS_REFS;
  pattern.lastIndex = 0;
  let m;
  while ((m = pattern.exec(src)) !== null) {
    const ref = m[1];
    if (/^(https?:|mailto:|tel:|data:|javascript:|#|\/\/)/.test(ref)) continue;
    if (ref.includes('${') || ref.includes("' +") || /[-=]$/.test(ref)) continue;  // built at runtime
    checked++;
    const missing = resolveTarget(file, ref, !isHtml);
    if (missing) problems.push(`${rel} → ${ref}  (no ${path.relative(ROOT, missing)})`);
  }
}

// The scripts that fetch by rootPath() + 'data/...' are checked against the
// site root instead, since that is what rootPath() resolves to.
const ROOT_RELATIVE = new Set();
for (const file of walk(ROOT).filter((f) => f.endsWith('.js'))) {
  const src = fs.readFileSync(file, 'utf8');
  for (const m of src.matchAll(/root\s*\+\s*['"](data\/[A-Za-z0-9._\/-]+)['"]/g)) ROOT_RELATIVE.add(m[1]);
  for (const m of src.matchAll(/['"](data\/questions\/)['"]\s*\+/g)) ROOT_RELATIVE.add('data/questions/');
}
for (const rel of ROOT_RELATIVE) {
  checked++;
  const target = path.join(ROOT, rel);
  if (!fs.existsSync(target)) problems.push(`(runtime path) → ${rel}`);
}

console.log(`local references checked: ${checked}`);
if (problems.length) {
  for (const p of problems.slice(0, 60)) console.error('  BROKEN  ' + p);
  if (problems.length > 60) console.error(`  … and ${problems.length - 60} more`);
  console.error(`\nFailed: ${problems.length} broken local reference(s).`);
  process.exit(1);
}
console.log('All local references resolve.');
