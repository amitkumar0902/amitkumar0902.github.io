#!/usr/bin/env node
/**
 * Keeps printed question counts honest.
 *
 * The home page renders bank counts from the JSON itself, so those cannot
 * drift. What can drift is prose: "547 topic-wise MCQs" on pricing, the stats
 * file the app reads, the mock library's per-mock counts (locked tiles are sold
 * on those numbers). This checks every such claim against the real data and
 * fails when one is wrong — an inflated count is the cheapest kind of
 * dishonesty and the easiest to prevent.
 *
 * Usage: node norcetprep/scripts/check-index-counts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');

function countFree() {
  const dir = path.join(ROOT, 'data', 'questions');
  let total = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    total += JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).length;
  }
  return total;
}

const free = countFree();
const bank = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/mains/question-bank.json'), 'utf8')).length;
let errors = 0;

// ---- prose claims ------------------------------------------------------------
// file · regex whose first capture is the printed number · the truth it must equal
const CLAIMS = [
  ['pricing.html', /All ([\d,]+) topic-wise MCQs/, free],
  ['index.html', /([\d,]+) topic-wise MCQs/, free],
  ['pricing.html', /([\d,]+) bank questions/, bank]
];

for (const [file, re, truth] of CLAIMS) {
  const p = path.join(ROOT, file);
  if (!fs.existsSync(p)) continue;
  const m = fs.readFileSync(p, 'utf8').match(re);
  if (!m) continue; // the claim isn't made on this page — fine
  const shown = parseInt(m[1].replace(/,/g, ''), 10);
  if (shown !== truth) {
    console.error(`MISMATCH [${file}]: page says ${shown}, data has ${truth}`);
    errors++;
  } else {
    console.log(`OK [${file}]: ${shown}`);
  }
}

// ---- stats.json --------------------------------------------------------------
const statsPath = path.join(ROOT, 'data/mains/stats.json');
if (fs.existsSync(statsPath)) {
  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
  if (stats.totalQs !== bank) {
    console.error(`MISMATCH [stats.json]: totalQs ${stats.totalQs}, bank has ${bank}`);
    errors++;
  } else {
    console.log(`OK [stats.json]: totalQs ${bank}`);
  }
}

// ---- mock library index ------------------------------------------------------
const idxPath = path.join(ROOT, 'data/mains/mocks/index.json');
if (fs.existsSync(idxPath)) {
  const idx = JSON.parse(fs.readFileSync(idxPath, 'utf8'));
  for (const m of idx) {
    const file = path.join(ROOT, 'data/mains/mocks', `mock-${m.id}.json`);
    if (!fs.existsSync(file)) {
      console.error(`MISSING mock file for index entry "${m.id}"`);
      errors++;
      continue;
    }
    const real = JSON.parse(fs.readFileSync(file, 'utf8')).questions.length;
    if (real !== m.count) {
      console.error(`MISMATCH [mock ${m.id}]: index says ${m.count}, file has ${real}`);
      errors++;
    }
  }
  console.log(`OK [mocks/index.json]: ${idx.length} entries checked`);
}

console.log('---');
console.log(`free bank: ${free} · mains bank: ${bank}`);
if (errors) {
  console.error(`\nFailed: ${errors} count claim(s) do not match the data.`);
  process.exit(1);
}
console.log('All printed counts match the data.');
