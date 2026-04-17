#!/usr/bin/env node
// Injects a "Notes for today + Watch this topic" aside into every
// mains-plan/day-N.html, driven by data/mains/syllabus.json (day → syllabusIds)
// and data/mains/videos.json (syllabusId → YouTube episode).
//
// Idempotent: looks for the sentinel <!-- nm-day-links --> and replaces that
// block on subsequent runs.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MP = path.join(ROOT, 'mains-plan');
const DATA = path.join(ROOT, 'data/mains');

const syllabus = JSON.parse(fs.readFileSync(path.join(DATA, 'syllabus.json'), 'utf-8'));
let videos = { episodes: [] };
try { videos = JSON.parse(fs.readFileSync(path.join(DATA, 'videos.json'), 'utf-8')); } catch {}

// Build day → topics index (cap at 12 priority=must / top topics).
const byDay = {};
for (const s of syllabus) {
  if (!byDay[s.day]) byDay[s.day] = [];
  byDay[s.day].push(s);
}
for (const d in byDay) {
  byDay[d].sort((a, b) => {
    const rank = p => p === 'must' ? 0 : p === 'high' ? 1 : 2;
    return rank(a.priority) - rank(b.priority);
  });
}

// syllabusId → first video episode
const idToVideo = {};
for (const ep of videos.episodes || []) {
  for (const sid of ep.topics || []) {
    if (!idToVideo[sid]) idToVideo[sid] = ep;
  }
}

function buildAside(day) {
  const topics = (byDay[day] || []).slice(0, 12);
  if (!topics.length) return '';
  const notesList = topics.map(t => {
    const href = `notes/index.html?section=${t.section}#${t.id}`;
    const tag = t.priority === 'must'
      ? ' <span style="color:var(--accent);font-size:.85em">★</span>'
      : '';
    return `      <li><a href="${escapeHtml(href)}">${escapeHtml(t.topic)}</a>${tag}</li>`;
  }).join('\n');
  const watchTopics = topics.filter(t => idToVideo[t.id]).slice(0, 6);
  const watchList = watchTopics.length
    ? watchTopics.map(t => {
        const ep = idToVideo[t.id];
        const href = `watch.html#v=${ep.videoId}`;
        return `      <li><a href="${escapeHtml(href)}">${escapeHtml(ep.title || ep.videoId)} <span class="small muted">— ${escapeHtml(t.topic)}</span></a></li>`;
      }).join('\n')
    : `      <li><a href="watch.html">Browse the NORCET High-Yield playlist</a></li>`;

  return `
<!-- nm-day-links -->
<section class="nm-day-links" style="margin:24px 0;padding:18px 20px;border:1px solid var(--rule);background:var(--bg-alt)">
  <h3 style="margin-top:0">High-yield hooks for Day ${day}</h3>
  <div style="display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
    <div>
      <strong>Notes for today</strong>
      <ul style="margin:8px 0 0;padding-left:18px">
${notesList}
      </ul>
    </div>
    <div>
      <strong>Watch this topic</strong>
      <ul style="margin:8px 0 0;padding-left:18px">
${watchList}
      </ul>
    </div>
    <div>
      <strong>Practice</strong>
      <ul style="margin:8px 0 0;padding-left:18px">
        <li><a href="bank.html?day=${day}">Day ${day} question bank</a></li>
        <li><a href="syllabus.html">Syllabus checklist</a></li>
        <li><a href="mocks/index.html">Full mocks + PYQ mock</a></li>
      </ul>
    </div>
  </div>
</section>
<!-- /nm-day-links -->`;
}

function escapeHtml(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const files = fs.readdirSync(MP).filter(f => /^day-\d+\.html$/.test(f));
let injected = 0;
for (const f of files) {
  const match = f.match(/^day-(\d+)\.html$/);
  if (!match) continue;
  const day = +match[1];
  const block = buildAside(day);
  const fp = path.join(MP, f);
  let src = fs.readFileSync(fp, 'utf-8');

  // Remove existing block
  src = src.replace(/\n?<!-- nm-day-links -->[\s\S]*?<!-- \/nm-day-links -->\n?/m, '');

  // Insert after the <header class="nm-hero"> close (or after first <header>).
  const anchors = [
    /(<\/header>)/,
    /(<main[^>]*>)/,
    /(<body[^>]*>)/
  ];
  let done = false;
  for (const rx of anchors) {
    if (rx.test(src)) {
      src = src.replace(rx, '$1' + block);
      done = true;
      break;
    }
  }
  if (done) {
    fs.writeFileSync(fp, src);
    injected++;
  }
}
console.log(`Injected day-link asides into ${injected}/${files.length} day pages.`);
