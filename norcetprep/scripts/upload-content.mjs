#!/usr/bin/env node
// Owner tool: push premium content JSON into Firestore `content/norcet/**`
// (Phase 3). Clients read it through js/content.js once entitled; the static
// copies leave the product domain at go-live (firebase.json ignore list).
//
// Layout (mirrors js/content.js — change both together):
//   content/norcet/files/{slug}          {v, path, bytes, sha256, json | parts}
//   content/norcet/chunks/{slug}.p{N}    {json: <string part>}   (files > ~900KB)
//   content/norcet/files/_manifest       {paths[], count, uploadedAt}
// slug = site-relative path with '/' → '~', e.g. data~mains~mocks~mock-1.json
//
// Setup (one-off):  npm install firebase-admin        (node_modules is gitignored)
// Auth:             GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json
// Usage:
//   node norcetprep/scripts/upload-content.mjs            # dry-run: list what would upload
//   node norcetprep/scripts/upload-content.mjs --write    # upload changed files
//   node norcetprep/scripts/upload-content.mjs --write --prune   # also delete docs
//                                                    # for files no longer premium
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(new URL('.', import.meta.url)), '..'); // norcetprep/
const WRITE = process.argv.includes('--write');
const PRUNE = process.argv.includes('--prune');
const CHUNK_BYTES = 900_000; // Firestore doc limit is 1MiB; leave header room

// ---- The premium set (mirror of js/content.js) ----
const PREMIUM_PREFIXES = [
  'data/mains/question-bank.json',
  'data/mains/mocks/',
  'data/mains/pyqs/',
  'data/mains/notes/',
  'data/mains/flashcards/',
  'data/mains/day-slices/',
  'data/mains/topics/',
  'data/mains/frequency-analysis.json',
  'data/mains/_audit/',
  'data/mains/drill-drug-calc.json',
  'data/mains/mock-blueprint.json'
];
const FREE_EXCEPTIONS = new Set([
  'data/mains/mocks/index.json',
  'data/mains/mocks/mock-1.json',   // the designated free sample mock
  'data/mains/notes/foundation.json'
]);

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else yield p;
  }
}

function premiumFiles() {
  const out = [];
  for (const pre of PREMIUM_PREFIXES) {
    const abs = join(ROOT, pre);
    if (pre.endsWith('/')) {
      let entries = [];
      try { entries = [...walk(abs)]; } catch { continue; }
      for (const f of entries) {
        const rel = relative(ROOT, f).split('\\').join('/');
        if (rel.endsWith('.json') && !FREE_EXCEPTIONS.has(rel)) out.push(rel);
      }
    } else {
      try { statSync(abs); } catch { continue; }
      if (!FREE_EXCEPTIONS.has(pre)) out.push(pre);
    }
  }
  return out.sort();
}

const slugOf = (p) => p.split('/').join('~');
const sha = (s) => createHash('sha256').update(s).digest('hex');
const utf8len = (s) => Buffer.byteLength(s, 'utf8');

function chunkString(s, maxBytes) {
  // Split on UTF-8 byte budget without cutting a code point.
  const parts = [];
  let buf = Buffer.from(s, 'utf8');
  while (buf.length > maxBytes) {
    let cut = maxBytes;
    while (cut > 0 && (buf[cut] & 0xc0) === 0x80) cut--; // don't split a continuation byte
    parts.push(buf.subarray(0, cut).toString('utf8'));
    buf = buf.subarray(cut);
  }
  parts.push(buf.toString('utf8'));
  return parts;
}

const files = premiumFiles();
console.log(`Premium set: ${files.length} JSON files`);

let totalBytes = 0;
const plan = files.map((rel) => {
  const raw = readFileSync(join(ROOT, rel), 'utf8');
  JSON.parse(raw); // fail fast on invalid JSON before any write
  const bytes = utf8len(raw);
  totalBytes += bytes;
  const parts = bytes > CHUNK_BYTES ? chunkString(raw, CHUNK_BYTES) : null;
  return { rel, slug: slugOf(rel), raw, bytes, hash: sha(raw), parts };
});
console.log(`Total ${(totalBytes / 1024 / 1024).toFixed(1)} MB · ` +
  `${plan.filter(p => p.parts).length} file(s) need chunking`);

if (!WRITE) {
  for (const p of plan) {
    console.log(`  ${p.rel}  ${(p.bytes / 1024).toFixed(0)}KB${p.parts ? ` → ${p.parts.length} chunks` : ''}`);
  }
  console.log('\nDry run only — re-run with --write to upload.');
  process.exit(0);
}

const admin = (await import('firebase-admin')).default;
admin.initializeApp();
const db = admin.firestore();
const filesCol = db.collection('content').doc('norcet').collection('files');
const chunksCol = db.collection('content').doc('norcet').collection('chunks');

let uploaded = 0, skipped = 0;
for (const p of plan) {
  const ref = filesCol.doc(p.slug);
  const snap = await ref.get();
  if (snap.exists && snap.get('sha256') === p.hash) { skipped++; continue; }

  const meta = { v: 1, path: p.rel, bytes: p.bytes, sha256: p.hash,
    uploadedAt: admin.firestore.FieldValue.serverTimestamp() };
  if (p.parts) {
    for (let i = 0; i < p.parts.length; i++) {
      await chunksCol.doc(`${p.slug}.p${i}`).set({ json: p.parts[i] });
    }
    await ref.set({ ...meta, parts: p.parts.length });
  } else {
    await ref.set({ ...meta, json: p.raw });
  }
  uploaded++;
  console.log(`  ↑ ${p.rel}${p.parts ? ` (${p.parts.length} chunks)` : ''}`);
}

await filesCol.doc('_manifest').set({
  paths: plan.map(p => p.rel),
  count: plan.length,
  uploadedAt: admin.firestore.FieldValue.serverTimestamp()
});

if (PRUNE) {
  const want = new Set(plan.map(p => p.slug));
  const existing = await filesCol.get();
  for (const doc of existing.docs) {
    if (doc.id === '_manifest' || want.has(doc.id)) continue;
    const parts = doc.get('parts') || 0;
    for (let i = 0; i < parts; i++) await chunksCol.doc(`${doc.id}.p${i}`).delete();
    await doc.ref.delete();
    console.log(`  ✕ pruned ${doc.id}`);
  }
}

console.log(`Done: ${uploaded} uploaded, ${skipped} unchanged.`);
