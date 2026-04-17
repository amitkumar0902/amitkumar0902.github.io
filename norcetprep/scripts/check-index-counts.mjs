#!/usr/bin/env node
/**
 * Compare topic-card copy in index.html to actual JSON array lengths.
 * Skips mock-test and revision (non-numeric marketing copy).
 * Usage: node norcetprep/scripts/check-index-counts.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const indexPath = path.join(root, 'index.html');
const dataDir = path.join(root, 'data', 'questions');

function extractCards(html) {
  const re = /<div class="topic-card" data-topic="([^"]+)"[\s\S]*?<p>([^<]*)<\/p>/g;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    out.push({ slug: m[1], blurb: m[2].trim() });
  }
  return out;
}

function firstInt(s) {
  const n = s.match(/(\d+)/);
  return n ? parseInt(n[1], 10) : null;
}

function main() {
  const html = fs.readFileSync(indexPath, 'utf8');
  const cards = extractCards(html);
  const skip = new Set(['mock-test', 'revision']);
  let errors = 0;

  for (const { slug, blurb } of cards) {
    if (skip.has(slug)) continue;
    const shown = firstInt(blurb);
    const jsonPath = path.join(dataDir, `${slug}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.error(`Missing JSON for card slug "${slug}": ${jsonPath}`);
      errors++;
      continue;
    }
    const len = JSON.parse(fs.readFileSync(jsonPath, 'utf8')).length;
    if (shown === null) {
      console.warn(`[${slug}] Could not parse number from: "${blurb}" (JSON has ${len})`);
      continue;
    }
    if (shown !== len) {
      console.error(`MISMATCH [${slug}]: index shows ${shown}, JSON has ${len}`);
      errors++;
    } else {
      console.log(`OK [${slug}]: ${len}`);
    }
  }

  if (errors) {
    console.error(`\nFailed: ${errors} issue(s). Update index.html blurbs or JSON.`);
    process.exit(1);
  }
  console.log('\nAll comparable topic cards match JSON counts.');
}

main();
