#!/usr/bin/env node
// Phase-1 domain flip: rewrite every reference to the old GitHub Pages origin
// (https://amitkumar0902.github.io/norcetprep) to the product domain
// (https://nursedrill.com) across norcetprep HTML, sitemap.xml, and robots.txt.
//
// Dry-run by default (prints per-file replacement counts); pass --write to apply.
// Run ONLY once nursedrill.com is live on Firebase Hosting — flipping canonicals
// to a dead domain would tell Google the site's canonical home doesn't resolve.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OLD = 'https://amitkumar0902.github.io/norcetprep';
const NEW = 'https://nursedrill.com';
const WRITE = process.argv.includes('--write');
const SKIP_DIRS = new Set(['.wayfinder', '.orchestrator', 'imp', 'node_modules']);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(html|xml|txt|webmanifest)$/.test(name)) yield p;
  }
}

let files = 0, total = 0;
for (const p of walk(ROOT)) {
  const src = readFileSync(p, 'utf8');
  // "OLD/" → "NEW/" and a bare trailing "OLD" → "NEW"
  const out = src.split(OLD + '/').join(NEW + '/').split(OLD).join(NEW);
  if (out === src) continue;
  const n = src.split(OLD).length - 1;
  files++; total += n;
  console.log(`${WRITE ? 'flipped' : 'would flip'}  ${n}\t${p.slice(ROOT.length + 1)}`);
  if (WRITE) writeFileSync(p, out);
}
console.log(`\n${WRITE ? 'Flipped' : 'Dry-run:'} ${total} reference(s) in ${files} file(s).` +
  (WRITE ? '' : '  Apply with: node norcetprep/scripts/flip-canonicals.mjs --write'));
