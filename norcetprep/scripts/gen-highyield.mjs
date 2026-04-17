#!/usr/bin/env node
// Generate scenario-based MCQs from per-section notes.
// Output: data/mains/topics/high-yield/<section>.json (array of MCQs with syllabusId, qtype='scenario').
// Distractors are drawn from nursingPriority of other topics in the same section to ensure plausibility.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data', 'mains');
const NOTES_DIR = path.join(DATA_DIR, 'notes');
const OUT_DIR = path.join(DATA_DIR, 'topics', 'high-yield');
fs.mkdirSync(OUT_DIR, { recursive: true });

const SECTIONS = [
  'midwifery', 'gyn', 'surgery', 'foundation', 'chn',
  'medicine', 'ent', 'child', 'pharma', 'mental',
  'micro', 'biochem', 'anatomy',
];

const SUBJECT_MAP = {
  midwifery: 'OBG', gyn: 'OBG', surgery: 'Medical-Surgical',
  foundation: 'Fundamentals', chn: 'Community Health', medicine: 'Medical-Surgical',
  ent: 'Medical-Surgical', child: 'Pediatric', pharma: 'Pharmacology',
  mental: 'Psychiatric', micro: 'Microbiology', biochem: 'Nutrition',
  anatomy: 'Anatomy',
};

function shorten(text, maxLen = 160) {
  if (!text) return text;
  let t = text.trim();
  if (t.endsWith('.')) t = t.slice(0, -1);
  if (t.length <= maxLen) return t;
  return t.slice(0, maxLen - 1) + '…';
}

function pickDistractors(section, correctPriority, allPriorities, n = 3) {
  const normalized = correctPriority.toLowerCase().trim();
  const pool = allPriorities
    .filter(p => p && p.toLowerCase().trim() !== normalized)
    .map(p => shorten(p, 140));
  const unique = [...new Set(pool)];
  for (let i = unique.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [unique[i], unique[j]] = [unique[j], unique[i]];
  }
  return unique.slice(0, n);
}

// Deterministic random (seeded) for reproducible output.
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const LETTER = ['A', 'B', 'C', 'D'];

let nextId = 100001;
let total = 0;
const allGenerated = [];

for (const section of SECTIONS) {
  const notesFile = path.join(NOTES_DIR, `${section}.json`);
  if (!fs.existsSync(notesFile)) continue;
  const notes = JSON.parse(fs.readFileSync(notesFile, 'utf-8'));
  const allPriorities = notes.map(n => n.nursingPriority).filter(Boolean);
  const rand = mulberry32(section.length * 997 + notes.length);

  const out = [];
  for (const note of notes) {
    if (!note.clinicalContext || !note.nursingPriority) continue;
    const correct = shorten(note.nursingPriority, 160);
    const distractors = pickDistractors(section, note.nursingPriority, allPriorities, 3);
    while (distractors.length < 3) distractors.push('Call the family and wait for further instruction before acting.');

    const options = [correct, ...distractors];
    for (let i = options.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [options[i], options[j]] = [options[j], options[i]];
    }
    const correctIdx = options.indexOf(correct);

    const explanations = {};
    options.forEach((opt, idx) => {
      explanations[LETTER[idx]] = idx === correctIdx
        ? `Correct — per the note, the priority action is: ${correct}. ${note.keyPoints?.[0] || ''}`.trim()
        : `Reflects management of a different scenario; not the priority for the stem described.`;
    });

    const stem = `${note.clinicalContext}\n\nWhat is the nurse's immediate priority action?`;

    out.push({
      id: nextId++,
      syllabusId: note.id,
      qtype: 'scenario',
      question: stem,
      options,
      correct: correctIdx,
      explanation: `Priority: ${correct} ${note.pearls?.[0] ? '(' + note.pearls[0] + ')' : ''}`.trim(),
      explanations,
      subject: SUBJECT_MAP[section] || 'Mixed',
      topic: note.topic,
      section,
      day: note.day,
      difficulty: note.priority === 'must' ? 'High' : note.priority === 'should' ? 'Medium' : 'Easy',
      source: 'NORCET High-Yield Generator v1',
      year: 2025,
      tags: ['scenario', 'highyield', note.priority],
    });
  }

  const outFile = path.join(OUT_DIR, `${section}.json`);
  fs.writeFileSync(outFile, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} ${section} MCQs → ${outFile}`);
  total += out.length;
  allGenerated.push(...out);
}

// Also consolidate into single manifest.
fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify({
  generated: new Date().toISOString(),
  total,
  bySection: Object.fromEntries(SECTIONS.map(s => {
    const f = path.join(OUT_DIR, `${s}.json`);
    return [s, fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf-8')).length : 0];
  })),
}, null, 2));

console.log(`\nTotal scenario MCQs generated: ${total}`);
