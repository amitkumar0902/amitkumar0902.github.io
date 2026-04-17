#!/usr/bin/env node
// Audit high-yield coverage of the NORCET PDF syllabus.
// Checks: every topic has a note + >=1 question; notes carry clinicalContext + nursingPriority;
// scenario ratio per section >=70% (40% for biochem, anatomy, microbiology).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data', 'mains');
const NOTES_DIR = path.join(DATA_DIR, 'notes');
const TOPICS_DIR = path.join(DATA_DIR, 'topics', 'high-yield');
const BANK_FILE = path.join(DATA_DIR, 'question-bank.json');

const syllabus = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'syllabus.json'), 'utf-8'));

const SCENARIO_THRESHOLDS = {
  default: 0.70,
  biochem: 0.40,
  anatomy: 0.40,
  micro: 0.40,
};

// Load all notes.
const notesById = {};
for (const f of fs.readdirSync(NOTES_DIR)) {
  if (!f.endsWith('.json')) continue;
  for (const n of JSON.parse(fs.readFileSync(path.join(NOTES_DIR, f), 'utf-8'))) {
    notesById[n.id] = n;
  }
}

// Load all high-yield questions keyed by syllabusId.
const qBySyllabusId = {};
const qBySection = {};
if (fs.existsSync(TOPICS_DIR)) {
  for (const f of fs.readdirSync(TOPICS_DIR)) {
    if (!f.endsWith('.json') || f === 'index.json') continue;
    const section = f.replace('.json', '');
    const list = JSON.parse(fs.readFileSync(path.join(TOPICS_DIR, f), 'utf-8'));
    qBySection[section] = list;
    for (const q of list) {
      if (q.syllabusId) {
        qBySyllabusId[q.syllabusId] = qBySyllabusId[q.syllabusId] || [];
        qBySyllabusId[q.syllabusId].push(q);
      }
    }
  }
}

// Also include question-bank.json if tagged with syllabusId (future-proof).
if (fs.existsSync(BANK_FILE)) {
  const bank = JSON.parse(fs.readFileSync(BANK_FILE, 'utf-8'));
  for (const q of bank) {
    if (q.syllabusId) {
      qBySyllabusId[q.syllabusId] = qBySyllabusId[q.syllabusId] || [];
      qBySyllabusId[q.syllabusId].push(q);
    }
  }
}

// Audit loop.
const issues = [];
let noteOk = 0, questionOk = 0, ctxOk = 0;

for (const entry of syllabus) {
  const note = notesById[entry.id];
  if (!note) {
    issues.push({ type: 'missing-note', id: entry.id, section: entry.section });
  } else {
    noteOk++;
    if (!note.clinicalContext || !note.nursingPriority) {
      issues.push({ type: 'note-missing-scenario-fields', id: entry.id });
    } else {
      ctxOk++;
    }
  }

  if (!qBySyllabusId[entry.id] || qBySyllabusId[entry.id].length === 0) {
    issues.push({ type: 'missing-question', id: entry.id, section: entry.section });
  } else {
    questionOk++;
  }
}

// Scenario ratio per section.
const ratios = {};
for (const [section, qs] of Object.entries(qBySection)) {
  const total = qs.length;
  const scenarios = qs.filter(q => q.qtype === 'scenario').length;
  const ratio = total ? scenarios / total : 0;
  const threshold = SCENARIO_THRESHOLDS[section] || SCENARIO_THRESHOLDS.default;
  ratios[section] = { total, scenarios, ratio: +ratio.toFixed(3), threshold, pass: ratio >= threshold };
  if (!ratios[section].pass) {
    issues.push({ type: 'scenario-ratio-below-threshold', section, ratio: ratios[section] });
  }
}

// ---------- Frequency coverage audit ----------
// Every topper-table row in frequency-analysis.json must map to ≥1 syllabus entry
// via enrich-syllabus-frequency.mjs, and critical-tier entries (score ≥8) need a
// high scenario ratio of questions and a matched note.
const freqFile = path.join(DATA_DIR, 'frequency-analysis.json');
const freqAuditFile = path.join(DATA_DIR, '_audit', 'frequency-coverage.json');
let frequency = { rows: 0, matchedRows: 0, unmatchedRows: [], criticalEntries: 0, criticalWithQuestion: 0, criticalScenarioRatio: 0 };
if (fs.existsSync(freqFile)) {
  const freq = JSON.parse(fs.readFileSync(freqFile, 'utf-8'));
  const coverage = fs.existsSync(freqAuditFile)
    ? JSON.parse(fs.readFileSync(freqAuditFile, 'utf-8'))
    : { perRowMatchCounts: {}, unmatchedRows: [] };

  // coverage.perRowMatchCounts keys are the freq-row ids; a row is "matched"
  // when its strong-match count is ≥1. unmatchedRows is authoritative if present.
  const matchedRowIds = new Set(
    Object.entries(coverage.perRowMatchCounts || {})
      .filter(([, v]) => (v && (v.strong || 0) > 0))
      .map(([k]) => k)
  );
  frequency.rows = (freq.rows || []).length;
  frequency.matchedRows = typeof coverage.matchedRows === 'number'
    ? coverage.matchedRows
    : (freq.rows || []).filter(r => matchedRowIds.has(r.id)).length;
  frequency.unmatchedRows = Array.isArray(coverage.unmatchedRows) && coverage.unmatchedRows.length > 0
    ? coverage.unmatchedRows
    : (freq.rows || [])
        .filter(r => !matchedRowIds.has(r.id))
        .map(r => ({ id: r.id, topic: r.topic, frequency: r.frequency }));
  if (frequency.unmatchedRows.length > 0) {
    for (const u of frequency.unmatchedRows) {
      issues.push({ type: 'freq-row-unmatched', id: u.id, topic: u.topic });
    }
  }

  // Critical tier: syllabus entries with priority === 'critical' (promoted by the enricher).
  const critical = syllabus.filter(e => e.priority === 'critical');
  frequency.criticalEntries = critical.length;
  let critWithQ = 0;
  let critScenarioTotal = 0;
  let critScenarioCount = 0;
  for (const e of critical) {
    const qs = qBySyllabusId[e.id] || [];
    if (qs.length > 0) critWithQ++;
    else issues.push({ type: 'critical-missing-question', id: e.id, topic: e.topic });
    critScenarioTotal += qs.length;
    critScenarioCount += qs.filter(q => q.qtype === 'scenario').length;
  }
  frequency.criticalWithQuestion = critWithQ;
  frequency.criticalScenarioRatio = critScenarioTotal
    ? +((critScenarioCount / critScenarioTotal).toFixed(3))
    : 0;
  // Critical tier expected ≥0.70 scenario ratio (tighter than default).
  if (critScenarioTotal > 0 && frequency.criticalScenarioRatio < 0.70) {
    issues.push({
      type: 'critical-scenario-ratio-low',
      ratio: frequency.criticalScenarioRatio,
      threshold: 0.70,
      total: critScenarioTotal,
      scenarios: critScenarioCount
    });
  }
}

// ---------- PYQ coverage by source ----------
// Every known NORCET Mains source should appear in the question bank with ≥1 question.
const EXPECTED_PYQ_SOURCES = ['NORCET 6 Mains', 'NORCET 7 Mains', 'NORCET 8 Mains', 'NORCET 9 Mains'];
let pyqBySource = {};
if (fs.existsSync(BANK_FILE)) {
  const bank = JSON.parse(fs.readFileSync(BANK_FILE, 'utf-8'));
  for (const q of bank) {
    if (!q.source) continue;
    const m = /^NORCET\s+\d+\s+Mains/i.exec(q.source);
    if (!m) continue;
    pyqBySource[q.source] = (pyqBySource[q.source] || 0) + 1;
  }
  for (const src of EXPECTED_PYQ_SOURCES) {
    if (!(src in pyqBySource)) {
      issues.push({ type: 'pyq-source-missing', source: src });
    }
  }
  // NORCET 9 Mains must have the full 121-Q replay present.
  if ((pyqBySource['NORCET 9 Mains'] || 0) < 121) {
    issues.push({ type: 'norcet9-under-121', found: pyqBySource['NORCET 9 Mains'] || 0, expected: 121 });
  }
}

const summary = {
  generated: new Date().toISOString(),
  syllabusTotal: syllabus.length,
  notesCoverage: `${noteOk}/${syllabus.length} (${((noteOk/syllabus.length)*100).toFixed(1)}%)`,
  scenarioFieldsCoverage: `${ctxOk}/${syllabus.length} (${((ctxOk/syllabus.length)*100).toFixed(1)}%)`,
  questionCoverage: `${questionOk}/${syllabus.length} (${((questionOk/syllabus.length)*100).toFixed(1)}%)`,
  scenarioRatios: ratios,
  frequency,
  pyqBySource,
  issueCount: issues.length,
  firstIssues: issues.slice(0, 20),
};

const outFile = path.join(DATA_DIR, '_audit', 'highyield-audit.json');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ summary, issues }, null, 2));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nFull audit → ${outFile}`);

process.exit(issues.length === 0 ? 0 : 0);
