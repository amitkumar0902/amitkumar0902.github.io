# How this site works — the complete flow

One page, no build step, no framework. `index.html` is **amit.agent**: a chat-first
portfolio that retrieves facts in the browser and (optionally) lets an LLM phrase the
answer. Everything below traces the path from your content to a visitor's answer.

```
 BUILD TIME (laptop)                      RUNTIME (visitor's browser)                    BACKEND (optional)
 ───────────────────                      ───────────────────────────                    ──────────────────
 blog-*.html ─┐                           index.html loads
 pubs/*.pdf  ─┼─ scripts/build-kb.py ─▶    ├─ KB[] hand-written chunks
 Amit_kumar.pdf┘  posts/talks/resume        ├─ fetch *-kb.json → ~125 chunks → BM25 index
               -kb.json                     ▼
                              visitor asks: "How accurate is the invoice extraction?"
                                            │
                              ┌── short-circuits (greeting / persona / "surprise me")
                                            │
                              retrieve(q) — BM25 over all chunks → top-10 "sources"
                                            │
                         ┌──────────────────┴───────────────────┐
                  endpoint configured?                   no endpoint / call failed
                         │                                       │
                  buildMessages():                        classify(q) → INTENTS
                  system prompt + history                 → hand-written HTML answer,
                  + CONTEXT chunks + question             typed out with fake streaming
                         │
                  streamLLM() ── POST /v1/chat/completions ──▶ Cloudflare Worker ──▶ OpenRouter :free model
                         ◀────────── SSE token stream ────────  (or your ngrok'd llama.cpp / vLLM / Ollama)
                         │
                  renderInline() while streaming → attachSources() chips → ♪ READ (TTS)
```

Two rules drive the design:

1. **Retrieval always happens in the browser.** No server is needed to find facts.
2. **The LLM only phrases.** It is instructed to use nothing but the retrieved CONTEXT
   chunks — if retrieval found nothing, it must say "I don't have that".

---

## 1 · Build time — turning content into a knowledge base

`scripts/build-kb.py` (run manually after editing content; needs `pdftotext`) emits
three JSON files to the repo root:

| Output | Source | How |
|---|---|---|
| `posts-kb.json` | `blog-*.html`, `book-review-*.html` | strip tags/nav → paragraphs → pack into ~1500-char chunks |
| `resume-kb.json` | `pubs/Amit_kumar.pdf` | split on section headings; each Experience bullet is rebuilt as `"E42.AI · Lead AI Engineer (Aug 2024 – Mar 2026): …"` so a chunk explains itself; phone numbers stripped; the outdated LinkedIn handle normalised |
| `talks-kb.json` | the 10 decks in `pubs/` | slide text, grouped by page, max 6 chunks per deck |

Every chunk has the same shape — `{id, section, title, text, url, tags}`. `url` makes
its source chip clickable; `tags` add retrieval vocabulary.

A second, curated layer lives directly in `index.html` as the `KB` array (line ~1734):
~50 hand-written chunks — identity, each role, each E42 project with its metrics,
systems (Marvin/Eddie/Vortex), talks, education, recognition, skills, contact, and a
meta chunk describing this very page. **This array is the first place to edit when a
fact changes.**

## 2 · Page load

Order of events inside the single `<script>` block:

1. **`CONFIG`** (~1660) — endpoint, model, apiKey, TTS provider, `topK: 10`, `maxTurns: 12`.
2. **`applyOverrides()`** (~1692) — reads `?endpoint=…&model=…` from the URL, persists
   them to localStorage (`ak.endpoint`, `ak.model`, `ak.apiKey`), scrubs them from the
   address bar, then lets localStorage override `CONFIG`. This is how a visitor (or you)
   points the deployed page at an ngrok tunnel without touching code.
3. **`chatUrl()`** (~1712) — normalises whatever was pasted:
   `abc.ngrok-free.app` → `https://abc.ngrok-free.app/v1/chat/completions`;
   local hosts get `http://`; an explicit `/v1` isn't doubled.
4. **KB + BM25 index** — `tok()` lowercases and drops stop-words (keeping who/what/how,
   because chunk titles use them); `rebuildIndex()` (~2350) computes token lists,
   document frequencies and IDF. Then `pullKbJson()` fetches the three JSON files,
   appends them and re-indexes → the badge shows the final chunk count.
5. **UI wiring** — model dropdown + `refreshModeBadge()` (~2074), the ⚙ backend panel
   (`setupBackendPanel`, ~2179: Save / Test / Reset against localStorage), drawer,
   theme toggle, IST clock, GitHub telemetry (public events API, falling back to the
   repo's `pushed_at`), particles, TTS (`TTS`, ~3298: Piper WASM voice with
   speechSynthesis fallback), mic input (Web Speech API).
6. **Ambient extras** — "Now reading" opens the latest deck; "Now playing"
   (`NOW_PLAYING_URL`, ~1989) lazy-loads the Spotify playlist embed on first click and
   toggles it open/closed. A non-embed URL would open externally instead.
7. **Boot** (~3491) — after 1.3 s the page calls `sendQuery('Hi')`, producing the greeting.

## 3 · Answering a question — `sendQuery()` (~3180)

```
sendQuery(text)
 ├─ addUserMessage → history.push
 ├─ typing indicator
 ├─ isGreeting?  isPersonaQuestion?  isSurpriseMe?   → hand-written reply, done.
 │    (instant, free, and immune to a dead model)
 ├─ sources = retrieve(text)          ← ALWAYS runs, both modes
 ├─ if CONFIG.endpoint:
 │     streamLLMReply(buildMessages(text, sources))
 │     success → done;  failure → amber SYSTEM note, fall through ↓
 └─ scripted: classify(text) → INTENTS answer (or FALLBACK menu)
       typed out, sources attached, ♪ READ attached
```

**Retrieval** — `retrieve()` (~2403): BM25 (k1=1.5, b=0.75) over every chunk, keep
positive scores, take top-10. If the best score is under `WEAK_SCORE = 1.8`, the user
message gets tagged `[low-confidence retrieval]` so the model leans toward "I don't
have that".

**Prompt** — `buildMessages()` (~2478) assembles:

```
[ system  : SYSTEM_PROMPT  (grounding rules, "preserve specifics", résumé chunks
            authoritative for dates/metrics, JD-fit allowance, HTML-only output) ]
[ history : last 12 turns (2 if the user pasted something huge, e.g. a JD) ]
[ user    : CONTEXT — the 10 chunks, each as
            [#1 · Experience · Document Intelligence Platform · E42.AI (bm25=9.31)] …
            USER QUESTION: … ]
```

**LLM call** — `streamLLM()` (~2418): one `fetch` POST
(`{model, messages, stream:true, temperature:0.5, max_tokens:900}`) to `chatUrl()`.
Adds `Authorization` only if an apiKey is set (never needed for the Worker) and
`ngrok-skip-browser-warning` for ngrok hosts. Parses the response as SSE — skips `:`
keep-alives, reads `data:` lines, yields `choices[0].delta.content`, stops at
`[DONE]`, throws on an in-stream `{error}`. If a server ignores `stream:true` and
replies with plain JSON, that's handled too.

**Rendering** — `streamLLMReply()` (~2989) re-renders on every token via
`renderInline()` (~3041), which trusts the model's HTML but also repairs stray
markdown (`**bold**`, `- bullets` merged into one `<ul>`, `[text](url)`). On success:
push to history, `attachSources()` renders the chips (collapsed when > 3; chips with a
`url` link out, others preview the chunk text inline), speak-button attached. On
failure: an amber SYSTEM line explains why (model retired → "pick another", 429 →
"free-tier limit", else "backend error") and returns false so the scripted path runs.

**Scripted fallback** — `classify()` (~2793) scores each of the ~24 `INTENTS` (~2510)
by summed lengths of matched keywords (short keywords ≤ 4 chars must match as whole
words, so "you" can't trigger "yo"); best score ≥ 3 wins, otherwise `FALLBACK` lists
what to ask. Answers are `{text, list, after}` objects typed out with
punctuation-aware pacing.

## 4 · The backend

The page speaks plain **OpenAI `/v1/chat/completions`**, so anything compatible works.

**Path A — Cloudflare Worker → OpenRouter (`worker/llm-proxy.js`).** Exists so the
API key never reaches the browser. Request pipeline: CORS preflight → **403 for any
foreign browser Origin** → per-IP rate limit (20/min, 200/h, in-memory) → `handleChat`:
128 KB body cap, last 26 messages, `max_tokens ≤ 1500`, and a **`FREE_ONLY` guard**
that refuses any OpenRouter model id not ending in `:free` (nobody burns your credits).
Upstream SSE is piped straight through; upstream errors are relayed with CORS headers
so the page can read `error.message`. `GET /health` reports config sans secrets.
Deploy: `cd worker && npx wrangler deploy && npx wrangler secret put LLM_API_KEY`.

**Path B — local model over ngrok.** Run llama.cpp / vLLM / Ollama / LM Studio, expose
with `ngrok http <port>`, then open `index.html?endpoint=https://xxxx.ngrok-free.app`
(or paste it into the ⚙ panel). Your server must answer CORS preflights
(llama.cpp does by default; Ollama needs `OLLAMA_ORIGINS`; vLLM `--allowed-origins`).

**Path C — none.** Scripted mode. The page always answers.

`MODEL_OPTIONS` (~2063) lists the OpenRouter `:free` models shown in the picker; free
models rotate, so refresh this list occasionally from https://openrouter.ai/models?q=free.

## 5 · Local development & testing

```
python3 scripts/mock-llm.py            # fake OpenAI-compatible SSE server on :8765
python3 -m http.server 4321            # serve the site (fetch() needs http, not file://)
open "http://localhost:4321/?endpoint=http://127.0.0.1:8765"
```

The mock echoes how many messages/context chunks it received (proves retrieval + the
streaming path) and `model: "bad-model"` returns an OpenRouter-style 404 (proves the
error → scripted fallback path).

## 6 · Deploy & repo map

Push to `main` → `.github/workflows/static.yml` publishes the whole repo to GitHub
Pages. (`norcetprep/` deploys separately to Firebase and is unrelated to the portfolio.)

```
index.html            the agent (CSS + HTML + all JS in one file)
index-classic.html    the previous visual portfolio (linked from the sidebar; "Agent" links back)
blogs.html, blog-*.html, book-review-*.html    writing
pubs/                 talk decks + Amit_kumar.pdf (current résumé)
posts-kb.json, talks-kb.json, resume-kb.json   generated retrieval chunks
scripts/build-kb.py   regenerates those three   ·  scripts/mock-llm.py  fake backend
worker/               Cloudflare Worker proxy (llm-proxy.js, wrangler.toml, README)
```

## 7 · Where to change what

| You want to… | Edit |
|---|---|
| Fix/add a fact the agent knows | `KB` array in `index.html` (or the source post/PDF, then re-run `build-kb.py`) |
| Change offline answers | `INTENTS` / `FALLBACK` / `SURPRISE_REPLY` |
| Change the agent's behaviour/tone | `SYSTEM_PROMPT` |
| Point at a backend permanently | `CONFIG.endpoint` |
| Add/remove picker models | `MODEL_OPTIONS` |
| Change the playlist | `NOW_PLAYING_URL` + the two `.np-text` labels |
| Change the "Now reading" deck | `NOW_READING_URL` + the two row labels |
| Worker limits / origins / free-only | constants at the top of `worker/llm-proxy.js` |
