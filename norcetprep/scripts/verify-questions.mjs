#!/usr/bin/env node
/**
 * verify-questions — the pipeline's adversarial gate (T09 / PRD user story 26).
 *
 * Every question is sent to a model from a DIFFERENT family than the one that
 * drafts our content, with one instruction: try to refute the answer key.
 * Anything it refutes — or is unsure about — lands in a flag queue for human
 * review. A deterministic consistency gate runs first and needs no API key.
 *
 *   node norcetprep/scripts/verify-questions.mjs <file...> [options]
 *
 *   --static-only        skip the model, run the consistency gate only
 *   --provider <name>    openai | gemini | anthropic   (default: auto-detect)
 *   --model <id>         override the provider's default model
 *   --out <path>         flag-queue output (default data/mains/_audit/flag-queue.json)
 *   --limit <n>          verify at most n unverified items (budget control)
 *   --force              re-verify items already in the cache
 *   --concurrency <n>    parallel model calls (default 4)
 *   --golden             run the acceptance fixture instead of real content
 *
 * Credentials come from the environment and are never written anywhere:
 *   OPENAI_API_KEY · GEMINI_API_KEY · ANTHROPIC_API_KEY
 *
 * Resumable: verdicts are cached by content hash in
 * data/mains/_audit/verify-cache.json, so re-running a 1,500-question file
 * after a crash costs only the items that changed.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const AUDIT = path.join(ROOT, 'data', 'mains', '_audit');
const CACHE_PATH = path.join(AUDIT, 'verify-cache.json');
const LETTERS = ['A', 'B', 'C', 'D'];

// The drafting family. The gate refuses to verify with the same family unless
// explicitly overridden — a model agreeing with itself is not verification.
const DRAFTED_BY = 'anthropic';

const PROVIDERS = {
  openai: {
    env: 'OPENAI_API_KEY',
    defaultModel: 'gpt-4o',
    async ask(prompt, { apiKey, model }) {
      const r = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          temperature: 0,
          response_format: { type: 'json_object' },
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!r.ok) throw new Error(`openai ${r.status}: ${(await r.text()).slice(0, 200)}`);
      const j = await r.json();
      return j.choices[0].message.content;
    }
  },
  gemini: {
    env: 'GEMINI_API_KEY',
    defaultModel: 'gemini-2.0-flash',
    async ask(prompt, { apiKey, model }) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, responseMimeType: 'application/json' }
        })
      });
      if (!r.ok) throw new Error(`gemini ${r.status}: ${(await r.text()).slice(0, 200)}`);
      const j = await r.json();
      return j.candidates[0].content.parts[0].text;
    }
  },
  anthropic: {
    env: 'ANTHROPIC_API_KEY',
    defaultModel: 'claude-sonnet-5',
    async ask(prompt, { apiKey, model }) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 700,
          temperature: 0,
          messages: [{ role: 'user', content: prompt }]
        })
      });
      if (!r.ok) throw new Error(`anthropic ${r.status}: ${(await r.text()).slice(0, 200)}`);
      const j = await r.json();
      return j.content.map((c) => c.text || '').join('');
    }
  }
};

// ---- args -------------------------------------------------------------------

function parseArgs(argv) {
  const opts = { files: [], staticOnly: false, force: false, concurrency: 4, threshold: 0.7 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--static-only') opts.staticOnly = true;
    else if (a === '--force') opts.force = true;
    else if (a === '--golden') opts.golden = true;
    else if (a === '--allow-same-family') opts.allowSameFamily = true;
    else if (a === '--provider') opts.provider = argv[++i];
    else if (a === '--model') opts.model = argv[++i];
    else if (a === '--out') opts.out = argv[++i];
    else if (a === '--limit') opts.limit = parseInt(argv[++i], 10);
    else if (a === '--concurrency') opts.concurrency = parseInt(argv[++i], 10);
    else if (a === '--threshold') opts.threshold = parseFloat(argv[++i]);
    else if (a.startsWith('--')) throw new Error(`unknown flag ${a}`);
    else opts.files.push(a);
  }
  return opts;
}

// ---- question extraction -----------------------------------------------------

function questionsIn(data) {
  if (Array.isArray(data)) return data.filter((q) => q && q.question && Array.isArray(q.options));
  const out = [];
  for (const v of Object.values(data)) {
    if (Array.isArray(v)) out.push(...v.filter((q) => q && q.question && Array.isArray(q.options)));
  }
  return out;
}

function hashOf(q) {
  const material = JSON.stringify([q.question, q.options, q.correct, q.explanation || '', q.citation || '']);
  return crypto.createHash('sha256').update(material).digest('hex').slice(0, 16);
}

// ---- consistency gate (no API key needed) ------------------------------------
//
// Mechanical faults an independent model should never have to spend a token on:
// contradictions inside the item itself.

function normalize(s) {
  return String(s).toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function consistencyIssues(q) {
  const issues = [];
  if (!Array.isArray(q.options) || q.options.length !== 4) issues.push('options must be exactly 4');
  if (!Number.isInteger(q.correct) || q.correct < 0 || q.correct > 3) issues.push('answer key out of range');
  if (!q.explanation || !String(q.explanation).trim()) issues.push('no explanation');
  if (!q.citation || !String(q.citation).trim()) issues.push('no source citation');

  const opts = (q.options || []).map(normalize);
  for (let i = 0; i < opts.length; i++) {
    for (let j = i + 1; j < opts.length; j++) {
      if (opts[i] && opts[i] === opts[j]) issues.push(`options ${LETTERS[i]} and ${LETTERS[j]} are identical`);
    }
  }
  if (opts.some((o) => /^(all of the above|none of the above|both a and b|all of these)$/.test(o))) {
    issues.push('catch-all option makes the key ambiguous');
  }

  // Per-option explanations exist and the keyed one is not written as a refusal.
  if (q.explanations && typeof q.explanations === 'object') {
    const missing = LETTERS.filter((L) => !q.explanations[L] || !String(q.explanations[L]).trim());
    if (missing.length) issues.push(`per-option explanation missing for ${missing.join(', ')}`);
    const keyed = normalize(q.explanations[LETTERS[q.correct]] || '');
    if (/^(incorrect|wrong|not correct|this is incorrect)/.test(keyed)) {
      issues.push('the keyed option is explained as if it were wrong');
    }
    // A distractor explained as the right answer means the key and the prose disagree.
    for (let i = 0; i < LETTERS.length; i++) {
      if (i === q.correct) continue;
      const t = normalize(q.explanations[LETTERS[i]] || '');
      if (/^(correct|this is the correct answer|the correct answer)/.test(t)) {
        issues.push(`distractor ${LETTERS[i]} is explained as correct`);
      }
    }
  }
  return issues;
}

// ---- model gate --------------------------------------------------------------

function refutationPrompt(q) {
  const opts = q.options.map((o, i) => `${LETTERS[i]}. ${o}`).join('\n');
  return `You are an examiner auditing a nursing-exam multiple-choice item for an Indian nursing-officer exam (AIIMS NORCET). Your job is to REFUTE it, not to be agreeable. Assume it is wrong until the evidence says otherwise.

QUESTION
${q.question}

OPTIONS
${opts}

CLAIMED ANSWER: ${LETTERS[q.correct]}
CLAIMED EXPLANATION: ${q.explanation || '(none)'}
CLAIMED SOURCE: ${q.citation || '(none)'}

Check, in order:
1. Is the claimed answer actually correct under current standards (Indian national guidelines where they exist, otherwise standard international practice)?
2. Is more than one option defensible, or are two options synonymous?
3. Is the explanation factually wrong, internally inconsistent, or does it contradict the key?
4. Is the content outdated (a superseded guideline, a renamed programme, a withdrawn drug)?
5. Does the cited source plausibly govern this fact?

Reply with JSON only:
{"verdict":"agree"|"refute"|"unsure","confidence":0.0-1.0,"reason":"<one or two sentences>","suggested_index":<0-3 or null>}

"agree" means the item is sound as written. "refute" means you can show it is wrong. "unsure" means ambiguous or you cannot verify. Confidence is your confidence in the verdict. Be strict: a defensible second answer is grounds to refute.`;
}

function parseVerdict(text) {
  const m = String(text).match(/\{[\s\S]*\}/);
  if (!m) throw new Error('no JSON in model reply');
  const v = JSON.parse(m[0]);
  const verdict = ['agree', 'refute', 'unsure'].includes(v.verdict) ? v.verdict : 'unsure';
  return {
    verdict,
    confidence: typeof v.confidence === 'number' ? Math.max(0, Math.min(1, v.confidence)) : 0,
    reason: String(v.reason || '').slice(0, 600),
    suggested: Number.isInteger(v.suggested_index) ? v.suggested_index : null
  };
}

function resolveProvider(opts) {
  let name = opts.provider;
  if (!name) {
    name = Object.keys(PROVIDERS).find((p) => process.env[PROVIDERS[p].env] && p !== DRAFTED_BY);
  }
  if (!name) return null;
  const p = PROVIDERS[name];
  if (!p) throw new Error(`unknown provider ${name}`);
  const apiKey = process.env[p.env];
  if (!apiKey) throw new Error(`${name} selected but ${p.env} is not set`);
  if (name === DRAFTED_BY && !opts.allowSameFamily) {
    throw new Error(
      `${name} drafts our content — verifying with the same family is not verification. ` +
      `Set OPENAI_API_KEY or GEMINI_API_KEY, or pass --allow-same-family if you know why.`
    );
  }
  return { name, apiKey, model: opts.model || p.defaultModel, ask: p.ask };
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let next = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i], i);
      }
    })
  );
  return out;
}

// ---- main --------------------------------------------------------------------

function loadCache() {
  try { return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')); } catch { return {}; }
}
function saveCache(cache) {
  fs.mkdirSync(AUDIT, { recursive: true });
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 0) + '\n');
}

async function run(opts) {
  const files = opts.golden ? [path.join(__dirname, 'fixtures', 'verify-golden.json')] : opts.files;
  if (!files.length) {
    console.error('usage: node scripts/verify-questions.mjs <file...> [--static-only] [--golden]');
    process.exit(2);
  }

  const provider = opts.staticOnly ? null : resolveProvider(opts);
  if (!opts.staticOnly && !provider) {
    console.error('No verifier credentials found (OPENAI_API_KEY / GEMINI_API_KEY).');
    console.error('Run with --static-only to use the consistency gate alone.');
    process.exit(2);
  }
  if (provider) console.log(`model gate: ${provider.name}/${provider.model} (drafting family: ${DRAFTED_BY})`);
  else console.log('model gate: skipped (--static-only)');

  const cache = loadCache();
  const flags = [];
  const stats = { items: 0, cached: 0, asked: 0, agreed: 0, flagged: 0, staticFlags: 0 };

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(file, 'utf8'));
    const questions = questionsIn(data);
    const label = path.relative(ROOT, file);
    const pending = [];

    for (const q of questions) {
      stats.items++;
      const issues = consistencyIssues(q);
      if (issues.length) {
        stats.staticFlags++;
        flags.push({ file: label, id: q.id ?? null, gate: 'consistency', reason: issues.join('; '), confidence: 1, suggested: null });
        continue; // a broken item does not deserve a model call
      }
      const h = hashOf(q);
      if (!opts.force && cache[h] && cache[h].verdict === 'agree') { stats.cached++; continue; }
      if (!opts.force && cache[h]) {
        stats.cached++;
        flags.push({ file: label, id: q.id ?? null, gate: 'model(cached)', reason: cache[h].reason, confidence: cache[h].confidence, suggested: cache[h].suggested });
        continue;
      }
      pending.push({ q, h });
    }

    const budget = opts.limit ? pending.slice(0, Math.max(0, opts.limit - stats.asked)) : pending;
    if (provider && budget.length) {
      await mapLimit(budget, opts.concurrency, async ({ q, h }) => {
        let v;
        try {
          v = parseVerdict(await provider.ask(refutationPrompt(q), provider));
        } catch (e) {
          v = { verdict: 'unsure', confidence: 0, reason: `verifier error: ${e.message}`, suggested: null };
        }
        stats.asked++;
        cache[h] = v;
        if (v.verdict === 'agree' && v.confidence >= opts.threshold) { stats.agreed++; return; }
        flags.push({ file: label, id: q.id ?? null, gate: 'model', verdict: v.verdict, reason: v.reason, confidence: v.confidence, suggested: v.suggested });
      });
      saveCache(cache);
    }
    const skipped = pending.length - budget.length;
    console.log(`${label}: ${questions.length} items` + (skipped ? ` (${skipped} left unverified by --limit)` : ''));
  }

  stats.flagged = flags.length;
  saveCache(cache);

  const outPath = opts.out || path.join(AUDIT, 'flag-queue.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify({ generated: new Date().toISOString().slice(0, 10), stats, flags }, null, 2) + '\n');

  console.log('---');
  console.log(`items ${stats.items} · cached ${stats.cached} · asked ${stats.asked} · agreed ${stats.agreed}`);
  console.log(`flags ${stats.flagged} (consistency ${stats.staticFlags}, model ${stats.flagged - stats.staticFlags}) → ${path.relative(ROOT, outPath)}`);
  return { stats, flags };
}

// ---- golden-set acceptance test ---------------------------------------------

async function golden(opts) {
  const fixturePath = path.join(__dirname, 'fixtures', 'verify-golden.json');
  const fixture = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
  const outPath = path.join(AUDIT, 'golden-run.json');
  const { flags } = await run({ ...opts, golden: true, out: outPath, force: true });

  const flaggedIds = new Set(flags.map((f) => f.id));
  const bad = fixture.filter((q) => q._expect === 'flag');
  const good = fixture.filter((q) => q._expect === 'pass');
  const modelOnly = bad.filter((q) => q._catchableBy === 'model');

  const missed = bad.filter((q) => !flaggedIds.has(q.id));
  const falseFlags = good.filter((q) => flaggedIds.has(q.id));

  console.log('\n=== golden set ===');
  console.log(`planted faults: ${bad.length} (${modelOnly.length} need the model gate)`);
  console.log(`caught: ${bad.length - missed.length}/${bad.length}`);
  console.log(`false flags on sound items: ${falseFlags.length}/${good.length}`);
  if (missed.length) console.log('missed: ' + missed.map((q) => `${q.id} (${q._fault})`).join(', '));
  if (falseFlags.length) console.log('false: ' + falseFlags.map((q) => q.id).join(', '));

  if (opts.staticOnly) {
    const staticBad = bad.filter((q) => q._catchableBy === 'static');
    const staticMissed = staticBad.filter((q) => !flaggedIds.has(q.id));
    if (staticMissed.length || falseFlags.length) {
      console.error(`FAIL — consistency gate missed ${staticMissed.length}, false-flagged ${falseFlags.length}`);
      process.exit(1);
    }
    console.log(`PASS (consistency gate: ${staticBad.length}/${staticBad.length}); ${modelOnly.length} semantic faults NOT exercised — run without --static-only before trusting the gate.`);
    return;
  }
  if (missed.length || falseFlags.length > 1) {
    console.error('FAIL — the gate must catch 100% of planted faults with near-zero false flags.');
    process.exit(1);
  }
  console.log('PASS');
}

const opts = parseArgs(process.argv.slice(2));
try {
  if (opts.golden) await golden(opts);
  else await run(opts);
} catch (e) {
  console.error('verify-questions:', e.message);
  process.exit(1);
}
