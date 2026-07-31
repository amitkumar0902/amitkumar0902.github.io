#!/usr/bin/env node
/**
 * Adds js/site-chrome.js (trust footer + incident banner) to every served page
 * that does not already pull it in through core.js.
 *
 *   node norcetprep/scripts/inject-site-chrome.mjs            # dry run
 *   node norcetprep/scripts/inject-site-chrome.mjs --write
 *
 * Idempotent: pages that already reference the script are left alone. Pages
 * that load core.js get it from there (core.js injects it with the other
 * add-ons), so only the standalone HTML — topic pages, SEO pillars, legal,
 * product pages — is patched here.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const WRITE = process.argv.includes('--write');
const SKIP_DIRS = new Set(['stitch_nursedrill_exam_prep_interface', 'imp', '.wayfinder', 'scripts', 'node_modules']);

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue;
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(p, out);
    } else if (entry.name.endsWith('.html')) out.push(p);
  }
  return out;
}

function relToRoot(file) {
  const depth = path.relative(ROOT, file).split(path.sep).length - 1;
  return depth === 0 ? '' : '../'.repeat(depth);
}

let patched = 0, already = 0, viaCore = 0;
for (const file of walk(ROOT)) {
  const html = fs.readFileSync(file, 'utf8');
  if (html.includes('site-chrome.js')) { already++; continue; }
  if (/src=["'][^"']*js\/core\.js/.test(html)) { viaCore++; continue; }
  if (!/<\/body>/i.test(html)) continue;

  const tag = `<script src="${relToRoot(file)}js/site-chrome.js" defer></script>\n`;
  const out = html.replace(/<\/body>/i, tag + '</body>');
  if (WRITE) fs.writeFileSync(file, out);
  patched++;
  console.log((WRITE ? 'patched  ' : 'would patch ') + path.relative(ROOT, file));
}

console.log('---');
console.log(`${WRITE ? 'patched' : 'would patch'}: ${patched} · already had it: ${already} · covered by core.js: ${viaCore}`);
if (!WRITE) console.log('re-run with --write to apply');
