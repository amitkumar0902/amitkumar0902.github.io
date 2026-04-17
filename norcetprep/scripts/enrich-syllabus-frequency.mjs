#!/usr/bin/env node
// enrich-syllabus-frequency.mjs
// Reads data/mains/frequency-analysis.json and data/mains/syllabus.json.
// Fuzzy-matches each topper row's keywords to syllabus entries, then writes
// back `frequencyScore`, `appearances[]`, and promotes `priority` to a new
// `critical` tier when the topper's frequency >= criticalThreshold (8 by default).
// Also emits _audit/frequency-coverage.md listing any topper row with zero
// syllabus matches.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SYLL_PATH = path.join(ROOT, 'data/mains/syllabus.json');
const FREQ_PATH = path.join(ROOT, 'data/mains/frequency-analysis.json');
const AUDIT_DIR = path.join(ROOT, 'data/mains/_audit');

function normalise(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokensOf(s) {
  return new Set(normalise(s).split(' ').filter(t => t.length >= 2));
}

function scoreKeywordAgainstTopic(keyword, topicText) {
  const kwN = normalise(keyword);
  const topicN = normalise(topicText);
  if (!kwN || !topicN) return 0;
  if (topicN.includes(kwN)) return 1.0;
  // Token overlap (Jaccard)
  const a = tokensOf(kwN);
  const b = tokensOf(topicN);
  if (!a.size || !b.size) return 0;
  let inter = 0;
  for (const t of a) if (b.has(t)) inter++;
  const union = a.size + b.size - inter;
  return inter >= Math.min(2, a.size) ? inter / union : 0;
}

function matchFreqRowToSyllabus(freqRow, syllabus) {
  // Return { strong: [...], loose: [...] }
  // strong = keyword literally contained in topic text (score 1.0)
  // loose  = Jaccard-style token overlap (score 0.5..0.99) — used for audit only
  const strong = [];
  const loose = [];
  for (const entry of syllabus) {
    const topicBlob = [entry.topic, entry.subtopic].filter(Boolean).join(' | ');
    let best = 0;
    let matchedKw = '';
    for (const kw of freqRow.keywords) {
      const s = scoreKeywordAgainstTopic(kw, topicBlob);
      if (s > best) { best = s; matchedKw = kw; }
      if (best >= 1.0) break;
    }
    if (best >= 1.0) strong.push({ id: entry.id, score: best, keyword: matchedKw });
    else if (best >= 0.6) loose.push({ id: entry.id, score: best, keyword: matchedKw });
  }
  strong.sort((a, b) => b.score - a.score);
  loose.sort((a, b) => b.score - a.score);
  return { strong, loose };
}

function main() {
  const syllabus = JSON.parse(fs.readFileSync(SYLL_PATH, 'utf8'));
  const freq = JSON.parse(fs.readFileSync(FREQ_PATH, 'utf8'));
  const rows = freq.rows || [];
  const threshold = (freq._meta && freq._meta.criticalThreshold) || 8;

  // Reset existing derived fields so we can re-run idempotently.
  for (const entry of syllabus) {
    delete entry.frequencyScore;
    delete entry.appearances;
    if (entry.priority === 'critical' && entry._originalPriority) {
      entry.priority = entry._originalPriority;
      delete entry._originalPriority;
    }
  }

  const entryById = new Map(syllabus.map(e => [e.id, e]));
  const unmatchedRows = [];
  const matchedRows = [];
  const perRowMatches = {};

  for (const row of rows) {
    const { strong, loose } = matchFreqRowToSyllabus(row, syllabus);
    perRowMatches[row.id] = { strong, loose };
    if (!strong.length && !loose.length) {
      unmatchedRows.push(row);
      continue;
    }
    matchedRows.push(row);
    // Only apply frequencyScore/appearances to STRONG matches so the critical
    // tier stays precise. Loose matches are surfaced in the audit for review.
    for (const m of strong) {
      const entry = entryById.get(m.id);
      if (!entry) continue;
      if (!entry.frequencyScore || row.frequency > entry.frequencyScore) {
        entry.frequencyScore = row.frequency;
        entry.appearances = row.appearances.slice();
        entry.frequencyTopic = row.topic;
      }
    }
  }

  // Promote entries to `critical` when frequency >= threshold.
  let promoted = 0;
  for (const entry of syllabus) {
    if ((entry.frequencyScore || 0) >= threshold && entry.priority !== 'critical') {
      entry._originalPriority = entry.priority;
      entry.priority = 'critical';
      promoted++;
    }
  }

  fs.writeFileSync(SYLL_PATH, JSON.stringify(syllabus, null, 2) + '\n');

  // Write audit report
  fs.mkdirSync(AUDIT_DIR, { recursive: true });
  const lines = [];
  lines.push('# Frequency Coverage Audit');
  lines.push('');
  lines.push('_Generated: ' + new Date().toISOString() + '_');
  lines.push('');
  lines.push(`- Topper rows: **${rows.length}**`);
  lines.push(`- Matched to syllabus: **${matchedRows.length}**`);
  lines.push(`- Unmatched rows: **${unmatchedRows.length}**`);
  lines.push(`- Critical-tier promotions (freq ≥ ${threshold}): **${promoted}**`);
  lines.push('');
  if (unmatchedRows.length) {
    lines.push('## Unmatched topper rows');
    lines.push('');
    for (const r of unmatchedRows) {
      lines.push(`- \`${r.id}\` — ${r.topic} (freq ${r.frequency})`);
    }
    lines.push('');
  }
  lines.push('## Matches per topper row');
  lines.push('');
  lines.push('| Topper row | Freq | Strong | Loose | Sample strong syllabus IDs |');
  lines.push('|------------|------|--------|-------|----------------------------|');
  for (const r of rows) {
    const m = perRowMatches[r.id] || { strong: [], loose: [] };
    const sample = (m.strong || []).slice(0, 3).map(x => `\`${x.id}\``).join(', ') || '—';
    lines.push(`| ${r.topic.substring(0, 60)} | ${r.frequency} | ${m.strong.length} | ${m.loose.length} | ${sample} |`);
  }
  lines.push('');
  fs.writeFileSync(path.join(AUDIT_DIR, 'frequency-coverage.md'), lines.join('\n') + '\n');

  // Write machine-readable JSON too
  fs.writeFileSync(
    path.join(AUDIT_DIR, 'frequency-coverage.json'),
    JSON.stringify({
      generated: new Date().toISOString(),
      totalRows: rows.length,
      matchedRows: matchedRows.length,
      unmatchedRows: unmatchedRows.map(r => ({ id: r.id, topic: r.topic, frequency: r.frequency })),
      promoted,
      criticalThreshold: threshold,
      perRowMatchCounts: Object.fromEntries(
        Object.entries(perRowMatches).map(([k, v]) => [k, { strong: v.strong.length, loose: v.loose.length }])
      ),
      matchedTopicsByRow: Object.fromEntries(
        Object.entries(perRowMatches).map(([k, v]) => [k, v.strong.map(m => m.id).slice(0, 10)])
      )
    }, null, 2) + '\n'
  );

  const fail = unmatchedRows.length > 0;
  console.log(`Frequency enrich: ${matchedRows.length}/${rows.length} matched; ${promoted} promoted to 'critical'.`);
  if (fail) {
    console.warn('Unmatched topper rows:');
    for (const r of unmatchedRows) console.warn(`  - ${r.id}: ${r.topic}`);
  }
  if (process.env.STRICT === '1' && fail) {
    console.error('STRICT mode: failing because some topper rows have no syllabus matches.');
    process.exit(2);
  }
}

main();
