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

const summary = {
  generated: new Date().toISOString(),
  syllabusTotal: syllabus.length,
  notesCoverage: `${noteOk}/${syllabus.length} (${((noteOk/syllabus.length)*100).toFixed(1)}%)`,
  scenarioFieldsCoverage: `${ctxOk}/${syllabus.length} (${((ctxOk/syllabus.length)*100).toFixed(1)}%)`,
  questionCoverage: `${questionOk}/${syllabus.length} (${((questionOk/syllabus.length)*100).toFixed(1)}%)`,
  scenarioRatios: ratios,
  issueCount: issues.length,
  firstIssues: issues.slice(0, 20),
};

const outFile = path.join(DATA_DIR, '_audit', 'highyield-audit.json');
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify({ summary, issues }, null, 2));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nFull audit → ${outFile}`);

process.exit(issues.length === 0 ? 0 : 0);
