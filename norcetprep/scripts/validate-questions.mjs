#!/usr/bin/env node
/**
 * Validate all JSON question banks under data/questions/
 * Usage: node norcetprep/scripts/validate-questions.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(__dirname, '..', 'data', 'questions');

function validateQuestion(q, fileLabel, index) {
  const prefix = `${fileLabel}[${index}]`;
  if (!q || typeof q !== 'object') {
    throw new Error(`${prefix}: not an object`);
  }
  if (typeof q.question !== 'string' || !q.question.trim()) {
    throw new Error(`${prefix}: missing question text`);
  }
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`${prefix}: options must be array of length 4`);
  }
  for (let i = 0; i < 4; i++) {
    if (typeof q.options[i] !== 'string' || !q.options[i].trim()) {
      throw new Error(`${prefix}: option ${i} empty or not string`);
    }
  }
  if (typeof q.correct !== 'number' || q.correct !== Math.floor(q.correct) || q.correct < 0 || q.correct > 3) {
    throw new Error(`${prefix}: correct must be integer 0-3, got ${q.correct}`);
  }
  if (typeof q.explanation !== 'string' || !q.explanation.trim()) {
    throw new Error(`${prefix}: missing explanation`);
  }
}

function main() {
  if (!fs.existsSync(dataDir)) {
    console.error('Missing directory:', dataDir);
    process.exit(1);
  }
  const files = fs.readdirSync(dataDir).filter((f) => f.endsWith('.json')).sort();
  let total = 0;
  const counts = {};

  for (const file of files) {
    const full = path.join(dataDir, file);
    const label = file;
    let data;
    try {
      data = JSON.parse(fs.readFileSync(full, 'utf8'));
    } catch (e) {
      console.error(`Parse error ${label}:`, e.message);
      process.exit(1);
    }
    if (!Array.isArray(data)) {
      console.error(`${label}: root must be JSON array`);
      process.exit(1);
    }
    const ids = new Set();
    data.forEach((q, i) => {
      validateQuestion(q, label, i);
      if (q.id != null && q.id !== '') {
        const idKey = String(q.id);
        if (ids.has(idKey)) {
          throw new Error(`${label}[${i}]: duplicate id "${idKey}"`);
        }
        ids.add(idKey);
      }
    });
    counts[file.replace('.json', '')] = data.length;
    total += data.length;
    console.log(`${label}: ${data.length} OK`);
  }

  console.log('---');
  console.log('Files:', files.length, 'Total questions:', total);
  console.log('Per slug (for index.html cards):', JSON.stringify(counts, null, 2));
}

try {
  main();
} catch (e) {
  console.error('Validation failed:', e.message);
  process.exit(1);
}
