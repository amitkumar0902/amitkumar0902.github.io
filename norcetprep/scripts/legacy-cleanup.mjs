#!/usr/bin/env node
// Legacy cleanup — neutralises prelims-era styling + broken links in
// mains-plan/day-*.html and mains-plan/pyqs.html.
//
// Actions per file:
//   1. Strip inline `style="background: linear-gradient(...)"` on <header class="day-hero">.
//   2. Replace <header class="day-hero"> wrapper with <header class="nm-hero">
//      (the minimalist theme already in use on index.html / syllabus.html).
//   3. Rewrite broken `../topics/<slug>.html` anchors → `notes/index.html?section=<map>`.
//   4. Rewrite `../norcet-free-mock-test.html` → `mocks/index.html`.
//   5. Rewrite `../topics/mock-test.html`       → `mocks/index.html`.
//   6. Replace <div class="notification-banner"> with the cleaner
//      <nav class="nm-nav"> pattern (still carries the same breadcrumb text).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const MP = path.join(ROOT, 'mains-plan');

// topics-slug → notes section map (fallback = 'foundation')
const TOPIC_MAP = {
  'medical-surgical':     'medicine',
  'obstetric-gynecology': 'midwifery',
  'pediatric':            'child',
  'community-health':     'chn',
  'pharmacology':         'pharma',
  'foundations':          'foundation',
  'psychiatric':          'mental',
  'microbiology':         'micro',
  'anatomy-physiology':   'anatomy',
  'nutrition-biochemistry': 'biochem',
  'administration-management': 'foundation',
  'previous-years':       'medicine',
  'first-aid':            'foundation',
  'mock-test':            'medicine'
};

const files = fs.readdirSync(MP)
  .filter(f => /^(day-\d+\.html|pyqs\.html)$/.test(f))
  .map(f => path.join(MP, f));

let totalSub = 0;
for (const f of files) {
  let s = fs.readFileSync(f, 'utf-8');
  const before = s;

  // (1) Strip ALL inline linear-gradient styling (hero + topic-card + strategy-box).
  //     Keep the element intact — just neutralise the inline `style`.
  s = s.replace(/style="[^"]*linear-gradient\([^"]*\)[^"]*"/gi, '');

  // (2) Neutralise the legacy class names → minimalist theme
  s = s.replace(/class="day-hero"/g, 'class="nm-hero"');
  s = s.replace(/class="notification-banner"/g, 'class="nm-nav"');
  s = s.replace(/<div class="nm-nav">/g, '<nav class="nm-nav">');
  s = s.replace(/(\s*<nav class="nm-nav">[\s\S]*?)<\/div>/m, '$1</nav>');

  // (3) Rewrite ../topics/<slug>.html → notes/index.html?section=<mapped>
  s = s.replace(/\.\.\/topics\/([a-z0-9-]+)\.html/gi, (_m, slug) => {
    const sec = TOPIC_MAP[slug] || 'foundation';
    return `notes/index.html?section=${sec}`;
  });

  // (4) Rewrite the legacy free-mock-test link
  s = s.replace(/\.\.\/norcet-free-mock-test\.html/g, 'mocks/index.html');

  // (5) Add high-yield aside at top of every day page (idempotent — guarded by marker).
  if (!s.includes('<!-- nm-hy-aside -->')) {
    const asideBlock = `
<!-- nm-hy-aside -->
<aside class="nm-hy-aside" style="margin:20px 0;padding:14px 18px;border:1px solid var(--rule);background:var(--bg-alt)">
  <strong>High-yield add-ons:</strong>
  <a href="syllabus.html">Syllabus checklist</a> ·
  <a href="notes/index.html">Scenario-first notes</a> ·
  <a href="watch.html">Watch playlist</a> ·
  <a href="mocks/index.html">Full mocks + PYQ mock</a>
</aside>`;
    s = s.replace(/(<\/header>)/, '$1' + asideBlock);
  }

  if (s !== before) {
    fs.writeFileSync(f, s);
    totalSub++;
    console.log('Cleaned', path.basename(f));
  }
}
console.log('Files cleaned:', totalSub, '/', files.length);
