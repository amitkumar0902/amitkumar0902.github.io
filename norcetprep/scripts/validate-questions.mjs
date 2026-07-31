#!/usr/bin/env node
/**
 * Validate every question the product serves — the free topic banks and the
 * Mains content (bank, mocks, PYQ sets, day slices, high-yield topic banks).
 *
 * The floor for all generated content, run in CI on every change:
 *   shape        — four options, key in range, an explanation
 *   citation     — every question names the reference behind it (PRD story 26)
 *   consistency  — no duplicate options, no catch-all option, and the keyed
 *                  option is not explained as if it were wrong
 *   ids          — unique within a file
 *
 * Usage: node norcetprep/scripts/validate-questions.mjs [--free-only]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const FREE_ONLY = process.argv.includes('--free-only');
const LETTERS = ['A', 'B', 'C', 'D'];

const errors = [];
function fail(where, msg) { errors.push(`${where}: ${msg}`); }

function normalize(s) {
  return String(s).toLowerCase().replace(/^[a-d]\.\s*/, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function validateQuestion(q, where) {
  if (!q || typeof q !== 'object') return fail(where, 'not an object');
  if (typeof q.question !== 'string' || !q.question.trim()) return fail(where, 'missing question text');
  if (!Array.isArray(q.options) || q.options.length !== 4) return fail(where, 'options must be an array of 4');
  for (let i = 0; i < 4; i++) {
    if (typeof q.options[i] !== 'string' || !q.options[i].trim()) return fail(where, `option ${LETTERS[i]} empty`);
  }
  if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) {
    return fail(where, `answer key must be an integer 0-3, got ${q.correct}`);
  }
  if (typeof q.explanation !== 'string' || !q.explanation.trim()) fail(where, 'missing explanation');

  // The citation rule — a claim with no source behind it does not ship.
  if (typeof q.citation !== 'string' || !q.citation.trim()) {
    fail(where, 'missing source citation (run scripts/assign-citations.mjs)');
  } else if (/\bp{1,2}\.\s?\d+|\bpage \d+/i.test(q.citation)) {
    // Page-level references are the ones we cannot stand behind; the
    // methodology page promises chapter/guideline granularity.
    fail(where, `citation claims a page reference: "${q.citation}"`);
  }

  const opts = q.options.map(normalize);
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      if (opts[i] && opts[i] === opts[j]) fail(where, `options ${LETTERS[i]} and ${LETTERS[j]} are identical`);
    }
  }
  if (opts.some((o) => /^(all of the above|none of the above|all of these|both a and b)$/.test(o))) {
    fail(where, 'catch-all option makes the answer key ambiguous');
  }

  if (q.explanations && typeof q.explanations === 'object') {
    const raw = (L) => String(q.explanations[L] || '').trim();
    const keyed = normalize(raw(LETTERS[q.correct]));
    if (!keyed) fail(where, `no per-option explanation for the keyed option ${LETTERS[q.correct]}`);
    else if (/^(incorrect|wrong|not correct)\b/.test(keyed)) {
      fail(where, 'the keyed option is explained as if it were wrong');
    }
    // A distractor whose prose *asserts* it is the answer means the key and the
    // explanation disagree. Matching on a bare leading "correct" would also hit
    // legitimate text like "Correct tracheal position…", so require the verdict
    // form: "Correct —", "Correct answer", "This is the correct answer".
    for (let i = 0; i < 4; i++) {
      if (i === q.correct) continue;
      if (/^(correct\s*[—:,-]|correct answer\b|this is the correct\b)/i.test(raw(LETTERS[i]))) {
        fail(where, `distractor ${LETTERS[i]} is explained as the correct answer`);
      }
    }
  }
}

function questionLists(data) {
  if (Array.isArray(data)) return [data];
  const out = [];
  for (const v of Object.values(data)) {
    if (Array.isArray(v) && v.some((x) => x && typeof x === 'object' && x.question)) out.push(v);
  }
  return out;
}

function validateFile(file, { requireArray = false } = {}) {
  const label = path.relative(ROOT, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    fail(label, `parse error: ${e.message}`);
    return 0;
  }
  if (requireArray && !Array.isArray(data)) {
    fail(label, 'root must be a JSON array');
    return 0;
  }
  let n = 0;
  for (const list of questionLists(data)) {
    const ids = new Set();
    list.forEach((q, i) => {
      validateQuestion(q, `${label}[${i}]`);
      if (q && q.id != null && q.id !== '') {
        const k = String(q.id);
        if (ids.has(k)) fail(`${label}[${i}]`, `duplicate id "${k}"`);
        ids.add(k);
      }
      n++;
    });
  }
  return n;
}

function dir(p) {
  if (!fs.existsSync(p)) return [];
  return fs.readdirSync(p).filter((f) => f.endsWith('.json')).sort().map((f) => path.join(p, f));
}

let total = 0;
console.log('— free topic banks —');
for (const f of dir(path.join(ROOT, 'data/questions'))) {
  const n = validateFile(f, { requireArray: true });
  total += n;
  console.log(`${path.basename(f)}: ${n}`);
}

if (!FREE_ONLY) {
  console.log('— mains content —');
  const mains = [
    path.join(ROOT, 'data/mains/question-bank.json'),
    path.join(ROOT, 'data/mains/drill-drug-calc.json'),
    ...dir(path.join(ROOT, 'data/mains/mocks')),
    ...dir(path.join(ROOT, 'data/mains/pyqs')),
    ...dir(path.join(ROOT, 'data/mains/day-slices')),
    ...dir(path.join(ROOT, 'data/mains/topics/high-yield'))
  ];
  for (const f of mains) {
    if (!fs.existsSync(f)) continue;
    if (path.basename(f) === 'index.json') continue; // library metadata, not questions
    const n = validateFile(f);
    total += n;
  }
  console.log(`${mains.length} mains files checked`);
}

console.log('---');
console.log(`questions validated: ${total}`);
if (errors.length) {
  const shown = errors.slice(0, 40);
  for (const e of shown) console.error('  ' + e);
  if (errors.length > shown.length) console.error(`  … and ${errors.length - shown.length} more`);
  console.error(`\nValidation failed: ${errors.length} problem(s).`);
  process.exit(1);
}
console.log('All questions valid.');
