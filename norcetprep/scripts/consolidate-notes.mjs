#!/usr/bin/env node
// Merge all notes-content*.mjs into per-section JSON files at data/mains/notes/<section>.json.
// Maps note IDs to syllabus IDs by exact match, then by section-number prefix.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { NOTE_CONTENT } from './notes-content.mjs';
import { NOTE_CONTENT_B } from './notes-content-b.mjs';
import { NOTE_CONTENT_C } from './notes-content-c.mjs';
import { NOTE_CONTENT_MED } from './notes-content-med.mjs';
import { NOTE_CONTENT_CHILD } from './notes-content-child.mjs';
import { NOTE_CONTENT_PM } from './notes-content-pharma-mental.mjs';
import { NOTE_CONTENT_MBA } from './notes-content-mba.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data', 'mains');
const OUT_DIR = path.join(DATA_DIR, 'notes');
fs.mkdirSync(OUT_DIR, { recursive: true });

const syllabus = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'syllabus.json'), 'utf-8'));
const allNotes = {
  ...NOTE_CONTENT,
  ...NOTE_CONTENT_B,
  ...NOTE_CONTENT_C,
  ...NOTE_CONTENT_MED,
  ...NOTE_CONTENT_CHILD,
  ...NOTE_CONTENT_PM,
  ...NOTE_CONTENT_MBA,
};

// Map notes by section-number prefix (e.g. medicine-60).
const byPrefix = {};
for (const [id, content] of Object.entries(allNotes)) {
  const m = id.match(/^([a-z]+)-(\d+)-/);
  if (m) {
    const key = `${m[1]}-${m[2]}`;
    if (!byPrefix[key]) byPrefix[key] = { id, content };
  }
}

const videos = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'videos.json'), 'utf-8'));
const videoByTopic = {};
for (const ep of videos.episodes || []) {
  for (const t of ep.topics || []) {
    if (!videoByTopic[t]) videoByTopic[t] = [];
    videoByTopic[t].push(ep.videoId);
  }
}

const bySection = {};
const missing = [];
for (const entry of syllabus) {
  let note = allNotes[entry.id];
  if (!note) {
    const m = entry.id.match(/^([a-z]+)-(\d+)-/);
    if (m) {
      const key = `${m[1]}-${m[2]}`;
      if (byPrefix[key]) note = byPrefix[key].content;
    }
  }
  if (!note) {
    missing.push(entry.id);
    continue;
  }
  const finalNote = {
    id: entry.id,
    section: entry.section,
    sectionLabel: entry.sectionLabel,
    topic: entry.topic,
    subtopic: entry.subtopic,
    day: entry.day,
    priority: entry.priority,
    title: note.title || entry.topic,
    definition: note.definition,
    keyPoints: note.keyPoints || [],
    pearls: note.pearls || [],
    redFlags: note.redFlags || [],
    sources: note.sources || [],
    clinicalContext: note.clinicalContext,
    nursingPriority: note.nursingPriority,
    videoIds: [...new Set([...(note.videoIds || []), ...(videoByTopic[entry.id] || [])])],
  };
  if (!bySection[entry.section]) bySection[entry.section] = [];
  bySection[entry.section].push(finalNote);
}

for (const [section, list] of Object.entries(bySection)) {
  const out = path.join(OUT_DIR, `${section}.json`);
  fs.writeFileSync(out, JSON.stringify(list, null, 2));
  console.log(`Wrote ${list.length} ${section} notes → ${out}`);
}

if (missing.length) {
  console.log(`\nMissing ${missing.length} notes:`);
  missing.slice(0, 20).forEach(id => console.log('  -', id));
  if (missing.length > 20) console.log(`  ... and ${missing.length - 20} more`);
} else {
  console.log('\nAll syllabus topics have notes!');
}

const totalCoverage = syllabus.length - missing.length;
console.log(`\nCoverage: ${totalCoverage}/${syllabus.length} (${(100*totalCoverage/syllabus.length).toFixed(1)}%)`);
