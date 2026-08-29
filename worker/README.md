# llm-proxy

A tiny Cloudflare Worker that proxies chat requests from the GitHub Pages
portfolio (`index.html`, "amit.agent") to an OpenAI-compatible LLM API —
OpenRouter by default — so the API key never ships to the browser.

You do **not** need this to try the page: with no backend configured the
agent answers from scripted intents, and for local experiments you can point
the page straight at a model server behind ngrok (see "Without the Worker").

## One-time setup (OpenRouter, free models)

1. Get a key at https://openrouter.ai/keys (free models need an account but no credit).
2. Install Wrangler and log in:
   ```
   npm i -g wrangler
   wrangler login
   ```
3. From this directory:
   ```
   wrangler deploy
   ```
   First run asks you to pick a `workers.dev` subdomain. It prints the URL,
   something like `https://llm-proxy.<your-subdomain>.workers.dev`.
4. Add the key as a secret (never in code or logs):
   ```
   wrangler secret put LLM_API_KEY
   ```
5. Tell the page about it — either edit `../index.html` → `CONFIG.endpoint`,
   or open the live page, click **⚙ configure backend** in the "LLM Backend"
   panel and paste the Worker URL (stored in that browser only).

## Verify

```
curl https://llm-proxy.<sub>.workers.dev/health

curl -N https://llm-proxy.<sub>.workers.dev/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"google/gemma-4-31b-it:free","messages":[{"role":"user","content":"Say hello in one word."}],"stream":false}'
```

A 400 mentioning `:free` means the model isn't a free one; a 404 with
"No endpoints found" means OpenRouter retired that free model — pick another
from https://openrouter.ai/models?q=free and update `MODEL_OPTIONS` in
`index.html`.

## Routes

- `POST /v1/chat/completions` (also `/`, `/chat`) → `${UPSTREAM_BASE}/chat/completions`,
  streaming SSE passed straight through. The page reads `choices[0].delta.content`.
- `GET /health` → `{ ok, upstream, freeOnly, keyConfigured }`.

## What it enforces

- **Origin allowlist** — browsers on `amitkumar0902.github.io` (and localhost dev
  ports) only; anything else gets a 403. Edit `ALLOWED_ORIGINS`.
- **Free-only** — on OpenRouter, model ids must end in `:free` unless
  `FREE_ONLY = "false"`. Optional `ALLOWED_MODELS` hard allowlist.
- **Rate limit** — 20 req/min, 200 req/hour per IP (in-memory, best effort).
- **Caps** — 128 KB body, last 26 messages, `max_tokens ≤ 1500`.

## Other upstreams

Anything OpenAI-compatible works — set `UPSTREAM_BASE` in `wrangler.toml`
(e.g. `https://api.groq.com/openai/v1`, or your own `https://xxxx.ngrok-free.app/v1`)
and put that provider's key in `LLM_API_KEY`. `FREE_ONLY` only applies to OpenRouter.

## Without the Worker (ngrok / local model)

Run any OpenAI-compatible server locally (llama.cpp `llama-server`, vLLM,
Ollama, LM Studio…), expose it with `ngrok http 8080`, then open

```
https://amitkumar0902.github.io/?endpoint=https://xxxx.ngrok-free.app&model=<model-id>
```

The page stores the endpoint in localStorage and strips it from the URL. It
adds the `ngrok-skip-browser-warning` header automatically; your server must
answer CORS preflights (llama.cpp does by default; Ollama needs
`OLLAMA_ORIGINS=https://amitkumar0902.github.io`; vLLM needs `--allowed-origins`).

## Free-tier limits (OpenRouter, at the time of writing)

Free models are limited per account to about 20 requests/minute and a daily
cap (50/day without purchased credits, more once you've bought $10 of credit).
When the cap hits, the Worker passes the 429 through and the page falls back
to its scripted answers — the portfolio never goes blank.

## Cost

Cloudflare Workers free tier: 100k requests/day. You will not hit that.
