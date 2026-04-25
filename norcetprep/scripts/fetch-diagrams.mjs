#!/usr/bin/env node
// Fetch labelled diagrams for notes pages from Wikimedia Commons / OpenStax /
// MoHFW / NIH / CDC and write a manifest mapping note.id -> diagram metadata.
//
// Input:  scripts/diagrams-sources.json   (hand-curated list)
// Output: data/mains/diagrams/<topicId>.<ext>   (downloaded files)
//         data/mains/diagrams/manifest.json     (note.id -> {file, alt, source, license, sourceUrl})
//
// Usage:  node scripts/fetch-diagrams.mjs            (skip cached)
//         node scripts/fetch-diagrams.mjs --force    (re-download all)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCES = path.join(__dirname, 'diagrams-sources.json');
const NOTES_DIR = path.join(ROOT, 'data', 'mains', 'notes');
const OUT_DIR = path.join(ROOT, 'data', 'mains', 'diagrams');
const MANIFEST = path.join(OUT_DIR, 'manifest.json');

const args = process.argv.slice(2);
const FORCE = args.includes('--force');

function extFromUrl(url) {
  const u = new URL(url);
  const m = u.pathname.match(/\.(svg|png|jpg|jpeg|gif|webp)(\?.*)?$/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'png';
}

function loadValidIds() {
  const ids = new Set();
  for (const f of fs.readdirSync(NOTES_DIR)) {
    if (!f.endsWith('.json')) continue;
    const arr = JSON.parse(fs.readFileSync(path.join(NOTES_DIR, f), 'utf8'));
    for (const n of arr) if (n.id) ids.add(n.id);
  }
  return ids;
}

function tryWget(url, target) {
  const r = spawnSync('wget', ['-q', '--user-agent=norcetprep-fetch/1.0', '-O', target, url], {
    stdio: ['ignore', 'inherit', 'inherit'],
  });
  if (r.error && r.error.code === 'ENOENT') return { ok: false, reason: 'wget-missing' };
  if (r.status !== 0) return { ok: false, reason: `wget-exit-${r.status}` };
  return { ok: true };
}

async function tryFetch(url, target) {
  try {
    const res = await fetch(url, { headers: { 'user-agent': 'norcetprep-fetch/1.0' }, redirect: 'follow' });
    if (!res.ok) return { ok: false, reason: `http-${res.status}` };
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(target, buf);
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: e.message };
  }
}

async function main() {
  if (!fs.existsSync(SOURCES)) {
    console.error(`Missing ${SOURCES}. Create it with the curated topic list.`);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const sources = JSON.parse(fs.readFileSync(SOURCES, 'utf8'));
  const validIds = loadValidIds();

  let downloaded = 0, skipped = 0, errors = 0;
  const manifest = {};

  for (const entry of sources) {
    const { topicId, url, license, source, sourceUrl, alt, localFile } = entry;

    if (!validIds.has(topicId)) {
      console.warn(`warn: unknown topicId "${topicId}" (no matching note id) — skipping`);
      errors++;
      continue;
    }

    // Allow entries that point to an existing local file (e.g. hand-authored SVGs)
    if (localFile) {
      const local = path.join(ROOT, localFile);
      if (!fs.existsSync(local)) {
        console.error(`err:  ${topicId} → localFile not found: ${localFile}`);
        errors++;
        continue;
      }
      manifest[topicId] = { file: `../images/${path.basename(localFile)}`, alt, source, license, sourceUrl: sourceUrl || '' };
      console.log(`local: ${topicId} → ${localFile}`);
      skipped++;
      continue;
    }

    if (!url) {
      console.warn(`warn: ${topicId} has no url and no localFile — skipping`);
      errors++;
      continue;
    }

    const ext = extFromUrl(url);
    const file = `${topicId}.${ext}`;
    const target = path.join(OUT_DIR, file);

    if (fs.existsSync(target) && !FORCE) {
      console.log(`skip: ${topicId} (cached)`);
      manifest[topicId] = { file, alt, source, license, sourceUrl: sourceUrl || '' };
      skipped++;
      continue;
    }

    let r = tryWget(url, target);
    if (!r.ok && r.reason === 'wget-missing') {
      console.log(`note: wget not found, falling back to fetch`);
      r = await tryFetch(url, target);
    } else if (!r.ok) {
      // wget failed for non-missing reason; try fetch as backup
      r = await tryFetch(url, target);
    }

    if (r.ok) {
      console.log(`get:  ${topicId} → ${file}`);
      manifest[topicId] = { file, alt, source, license, sourceUrl: sourceUrl || '' };
      downloaded++;
    } else {
      console.error(`err:  ${topicId} — ${r.reason}`);
      // remove zero-byte target if wget left one
      if (fs.existsSync(target) && fs.statSync(target).size === 0) fs.unlinkSync(target);
      errors++;
    }
    // Small inter-request delay to avoid Wikimedia HTTP 429 bursts.
    await new Promise(r => setTimeout(r, 800));
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nDownloaded ${downloaded} · Skipped ${skipped} · Errors ${errors}`);
  console.log(`Manifest: ${path.relative(ROOT, MANIFEST)} (${Object.keys(manifest).length} entries)`);
}

main().catch(e => { console.error(e); process.exit(1); });
