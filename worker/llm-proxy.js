// ════════════════════════════════════════════════════════════
//  llm-proxy.js — Cloudflare Worker for amit.agent
//
//  POST /v1/chat/completions   (also "/", "/chat", "/chat/completions")
//      → forwards to ${UPSTREAM_BASE}/chat/completions with the secret
//        LLM_API_KEY attached, and streams the SSE body straight back.
//  GET  /health → { ok, upstream, freeOnly, keyConfigured }
//
//  Default upstream is OpenRouter (https://openrouter.ai/api/v1). Any
//  OpenAI-compatible server works — Groq, Together, a box behind ngrok —
//  just change UPSTREAM_BASE in wrangler.toml.
//
//  Deploy:
//    cd worker
//    npx wrangler deploy
//    npx wrangler secret put LLM_API_KEY      (paste the OpenRouter key)
//  Put the printed URL into index.html → CONFIG.endpoint (or the page's
//  "LLM Backend" panel). The key never reaches the browser.
// ════════════════════════════════════════════════════════════

const DEFAULT_UPSTREAM = 'https://openrouter.ai/api/v1';
const SITE = 'https://amitkumar0902.github.io';

// Browsers on these origins may call the proxy. Add your own dev port.
const ALLOWED_ORIGINS = new Set([
  SITE,
  'http://localhost:4321', 'http://127.0.0.1:4321',
  'http://localhost:8000', 'http://127.0.0.1:8000',
  'http://localhost:5500', 'http://127.0.0.1:5500',
]);

const MAX_BODY_BYTES = 128 * 1024;   // system prompt + context + history + a pasted JD
const MAX_MESSAGES   = 26;           // system + 12 turns
const MAX_TOKENS_CAP = 1500;

// Per-IP rate limit (in-memory, best effort; resets on cold start).
const RATE = { perMin: 20, perHour: 200 };
const ipHits = new Map(); // ip -> [timestamps]

function cors(origin) {
  const allow = ALLOWED_ORIGINS.has(origin) ? origin : SITE;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function rateLimited(ip) {
  const now = Date.now();
  if (ipHits.size > 5000) ipHits.clear();               // crude memory guard
  const arr = (ipHits.get(ip) || []).filter(t => now - t < 3600_000);
  const lastMin = arr.filter(t => now - t < 60_000).length;
  if (lastMin >= RATE.perMin || arr.length >= RATE.perHour) return true;
  arr.push(now);
  ipHits.set(ip, arr);
  return false;
}

function json(body, status, h) {
  return new Response(JSON.stringify(body), {
    status, headers: { ...h, 'Content-Type': 'application/json' },
  });
}
// OpenAI-style error envelope so the browser can show `error.message`.
function jsonError(message, status, h) {
  return json({ error: { message, code: status } }, status, h);
}

async function handleChat(req, env, h) {
  if (!env.LLM_API_KEY) {
    return jsonError('Worker not configured: LLM_API_KEY missing (npx wrangler secret put LLM_API_KEY)', 500, h);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return jsonError('Request too large', 413, h);

  let payload;
  try { payload = JSON.parse(raw); }
  catch { return jsonError('Bad JSON', 400, h); }

  const upstreamBase = (env.UPSTREAM_BASE || DEFAULT_UPSTREAM).replace(/\/+$/, '');
  const isOpenRouter = /openrouter\.ai/.test(upstreamBase);
  const model = String(payload.model || env.DEFAULT_MODEL || 'google/gemma-4-31b-it:free');

  // Guard rails so a stranger can't burn paid credits through the proxy.
  const freeOnly = String(env.FREE_ONLY ?? 'true') !== 'false';
  if (isOpenRouter && freeOnly && !/:free$/.test(model)) {
    return jsonError(`Only ':free' models are allowed through this proxy (got "${model}"). Set FREE_ONLY = "false" in wrangler.toml to lift that.`, 400, h);
  }
  if (env.ALLOWED_MODELS) {
    const allowed = env.ALLOWED_MODELS.split(',').map(s => s.trim()).filter(Boolean);
    if (allowed.length && !allowed.includes(model)) {
      return jsonError(`Model "${model}" is not in ALLOWED_MODELS`, 400, h);
    }
  }

  // Optional prioritized fallback list (OpenRouter `models`). Every entry must pass
  // the same guards as `model` so the fallback path can't smuggle a paid model in.
  let models = Array.isArray(payload.models) ? payload.models.map(String).slice(0, 3) : null;   // OpenRouter max
  if (models) {
    if (isOpenRouter && freeOnly && models.some(m => !/:free$/.test(m))) {
      return jsonError('All entries in models[] must be \':free\' models', 400, h);
    }
    if (env.ALLOWED_MODELS) {
      const allowed = env.ALLOWED_MODELS.split(',').map(s => s.trim()).filter(Boolean);
      if (allowed.length && models.some(m => !allowed.includes(m))) models = null;
    }
  }

  const messages = Array.isArray(payload.messages) ? payload.messages.slice(-MAX_MESSAGES) : [];
  if (!messages.length) return jsonError('messages[] is required', 400, h);

  const body = {
    model,
    ...(models ? { models } : {}),
    messages,
    stream: payload.stream !== false,
    temperature: typeof payload.temperature === 'number' ? payload.temperature : 0.5,
    max_tokens: Math.min(Number(payload.max_tokens) || 900, MAX_TOKENS_CAP),
  };

  const headers = {
    'Authorization': `Bearer ${env.LLM_API_KEY}`,
    'Content-Type': 'application/json',
    'Accept': body.stream ? 'text/event-stream' : 'application/json',
  };
  if (isOpenRouter) {                 // OpenRouter attribution (optional, shows on their dashboard)
    headers['HTTP-Referer'] = SITE;
    headers['X-Title'] = 'amit.agent';
  }

  let upstream;
  try {
    upstream = await fetch(upstreamBase + '/chat/completions', {
      method: 'POST', headers, body: JSON.stringify(body),
    });
  } catch (e) {
    return jsonError('Upstream fetch failed: ' + e.message, 502, h);
  }

  if (!upstream.ok) {
    // Pass the upstream error body through (it already carries error.message),
    // but with our CORS headers so the browser can actually read it.
    const text = await upstream.text().catch(() => '');
    return new Response(text || JSON.stringify({ error: { message: `Upstream ${upstream.status}`, code: upstream.status } }), {
      status: upstream.status,
      headers: { ...h, 'Content-Type': upstream.headers.get('Content-Type') || 'application/json' },
    });
  }

  return new Response(upstream.body, {
    status: 200,
    headers: {
      ...h,
      'Content-Type': upstream.headers.get('Content-Type') || (body.stream ? 'text/event-stream; charset=utf-8' : 'application/json'),
      'Cache-Control': 'no-store',
      'X-Accel-Buffering': 'no',
    },
  });
}

export default {
  async fetch(req, env) {
    const origin = req.headers.get('Origin') || '';
    const h = cors(origin);

    if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: h });
    // A browser on a foreign origin gets refused outright (curl has no Origin and
    // is only held back by the rate limit + free-only guard).
    if (origin && !ALLOWED_ORIGINS.has(origin)) return jsonError('Origin not allowed', 403, h);

    const url = new URL(req.url);
    const path = url.pathname.replace(/\/+$/, '') || '/';

    if (req.method === 'GET' && path === '/health') {
      return json({
        ok: true,
        upstream: env.UPSTREAM_BASE || DEFAULT_UPSTREAM,
        freeOnly: String(env.FREE_ONLY ?? 'true') !== 'false',
        keyConfigured: Boolean(env.LLM_API_KEY),
      }, 200, h);
    }
    if (req.method !== 'POST') return jsonError('Method not allowed', 405, h);

    const ip = req.headers.get('CF-Connecting-IP') || 'unknown';
    if (rateLimited(ip)) return jsonError('Rate limited. Try again in a minute.', 429, h);

    if (['/', '/chat', '/chat/completions', '/v1/chat/completions'].includes(path)) {
      return handleChat(req, env, h);
    }
    return jsonError('Not found', 404, h);
  },
};
