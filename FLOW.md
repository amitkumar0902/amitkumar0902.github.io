# FLOW.md — every block of this site and how it works

`index.html` is **amit.agent**: a single-file, chat-first portfolio. No framework, no
build step for the page itself — one HTML file containing all CSS, HTML and JS
(~3,500 lines). LLM mode is **live by default**: `CONFIG.endpoint` points at the
deployed Cloudflare Worker `https://llm-proxy.amitkumar0902.workers.dev`, which
proxies OpenRouter's free models with the API key held server-side as a secret.
This document walks every block: what it is, what it does, where it lives. Line
numbers are approximate (drift as the file is edited); function names are the
stable anchors.

---

## 0 · Bird's-eye view

```
 BUILD TIME (laptop)                      RUNTIME (visitor's browser)                    BACKEND (live)
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
                  endpoint configured                    endpoint cleared / call failed
                  (default: the Worker)                                  │
                         │                                       │
                  buildMessages():                        classify(q) → INTENTS
                  system prompt + history                 → hand-written HTML answer,
                  + CONTEXT chunks + question             typed out with fake streaming
                         │
                  streamLLM() ── POST /v1/chat/completions ──▶ llm-proxy.amitkumar0902.workers.dev
                         ◀────────── SSE token stream ────────  ──▶ OpenRouter :free model
                                     (or point ?endpoint= at an ngrok'd llama.cpp / vLLM / Ollama)
                         │
                  renderInline() while streaming → attachSources() chips → ♪ READ (TTS)
```

Two design rules drive everything:

1. **Retrieval always happens in the browser.** No server is needed to find facts.
2. **The LLM only phrases.** It is instructed to use nothing but the retrieved CONTEXT
   chunks — if retrieval found nothing relevant, it must say "I don't have that".

## 1 · Repo map

```
index.html                 the agent — everything below in one file
index-classic.html         previous visual portfolio (sidebar "Classic portfolio" ↔ nav "Agent")
blogs.html, blog-*.html,
book-review-*.html         writing (also KB source material)
pubs/                      talk-deck PDFs + Amit_kumar.pdf (current résumé)
images/                    avatar/site images
posts-kb.json              generated: blog/book-review chunks        (26 chunks)
talks-kb.json              generated: slide text of the decks        (37 chunks)
resume-kb.json             generated: résumé sections                (10 chunks)
scripts/build-kb.py        generates the three JSONs (needs pdftotext)
scripts/mock-llm.py        fake OpenAI-compatible SSE server for local testing
worker/llm-proxy.js        Cloudflare Worker: browser → OpenRouter proxy
worker/wrangler.toml       Worker config (UPSTREAM_BASE, FREE_ONLY, DEFAULT_MODEL)
worker/README.md           deploy + verify + ngrok instructions
.github/workflows/static.yml   pushes to main → GitHub Pages publishes the repo root
norcetprep/, rrbprep/      separate products; not part of the portfolio or its KB
FLOW.md                    this file
```

## 2 · Build time — `scripts/build-kb.py`

Run manually (`python3 scripts/build-kb.py`) after editing a post or swapping a PDF.
Shared plumbing: `clean()` squeezes whitespace, **strips phone numbers** and
normalises the outdated LinkedIn handle; `chunk_paragraphs()` greedily packs whole
paragraphs into ~1,500-char chunks (a trailing stub <200 chars is merged into the
previous chunk); `emit()` labels multi-chunk docs "(part n/N)" and caps every doc at
6 chunks.

| Builder | Source | What it does |
|---|---|---|
| `build_posts()` | `blog-*.html`, `book-review-*.html` | strips `<script>/<style>/<nav>` and tags, turns block-element closings into newlines, drops nav crumbs ("← Home"), chunks the paragraphs. Dates/tags come from the `POSTS` table. |
| `build_resume()` | `pubs/Amit_kumar.pdf` via `pdftotext -layout` | splits on the résumé's section headings. For **Experience**, `experience_paragraphs()` detects company lines (end in a location), role lines (contain a date range), and bullet lines (start `◦`), and rebuilds each bullet as `"E42.AI … · Lead AI Engineer (Aug 2024 – Mar 2026): <bullet>"` so every chunk is self-explanatory out of context. |
| `build_talks()` | 10 decks in `pubs/` via `pdftotext` | prepends a header sentence (title/year/blurb from the `TALKS` table), then chunks page text. |

Every chunk has one shape:

```json
{ "id": "e42-llm-serving", "section": "Experience", "title": "Self-hosted LLM serving platform · E42.AI",
  "text": "…the fact, self-contained…", "url": "pubs/…", "tags": ["serving", "latency", …] }
```

`section·title` appear on the source chips; `url` makes a chip a link; `tags` add
retrieval vocabulary; `text` is what the LLM actually reads.

## 3 · The page — visual blocks (HTML/CSS)

All styling is a single `<style>` block: CSS variables define a graphite-dark palette
with an electric-blue accent (`--cyan`) and orange secondary (`--magenta`);
`[data-theme="light"]` overrides them for light mode. Fonts: Space Grotesk (display)
+ JetBrains Mono (data/labels).

**Atmosphere layers** (fixed, behind everything): `.grid` (faint line grid),
`.scanlines`, `.grain`, `.vignette`, and `#particles` — 28 divs with randomized
positions/durations floating upward, generated by a small IIFE.

**Splash** (`#splash`) — full-screen "▸ Initializing amit.agent" card; auto-fades
after 1.1 s, or on first click/keypress.

**Topbar** — left: hamburger (mobile), hex logo "A", brand "Amit Kumar · AI Architect".
Middle (hidden on small screens): timezone, GitHub handle, "Pune · HH:MM" — an IST
clock regardless of the visitor's timezone (`updateClock()`, ~2268, uses
`toLocaleTimeString('en-GB', {timeZone:'Asia/Kolkata'})`, refreshed every 30 s).
Right: ONLINE dot; the **mode badge** (`#modeBadge`) which is the single source of
truth about state — `SCRIPTED · 125 chunks · no LLM backend` vs
`RAG · LLM · <model> · 125 chunks`; the speaker toggle (voice auto-play); the
sun/moon theme toggle.

**Mobile drawer** (`#drawer` + backdrop) — on phones the two side columns disappear,
so the drawer replicates all of their content: model picker, ⚙ backend button,
topics, quick links, operator card, mission, skills, ambient. `setupDrawer()` (~2022)
toggles `body.drawer-open`; Escape/backdrop/✕ close it; tapping a topic or link also
closes it.

**Left column** — three HUD cards:
- *Operator*: avatar "AK", name/role, meta grid (At E42.ai · Since 2021 · Edu
  M.Tech · IIST · ● OPEN TO COLLABS).
- *Memory · Topics*: 10 `<li data-q="…">` items; clicking one submits its `data-q`
  as a chat question (wired by the global `[data-q]` click handler).
- *Quick Links*: Email / CV / GitHub / LinkedIn / Writings / ▸ Classic portfolio.

**Center — the chat shell**:
- *chat-head*: green channel dot, "Channel · amit.agent", and `#ping` — a cosmetic
  "↻ NNms · stream-ready" that re-randomizes every 3.5 s.
- `#chatlog`: the conversation. Message anatomy: `.msg.user` (right-aligned, magenta
  meta "YOU · HH:MM:SS") vs `.msg.agent` (cyan meta "AMIT.AGENT · …" plus the ♪ READ
  button); `.msg-body` holds the rendered HTML; agent messages may end with a
  `.sources` block and a `.source-preview` panel.
- *Chips* (`#chips`): 7 one-tap starter questions (Who are you? / Marvin / Multi-agent
  work / Top skills / Papers / Hire you / Surprise me).
- *Input bar*: auto-growing `<textarea>` (`autosizeInput()`, Enter submits,
  Shift+Enter newlines), 🎙 mic button (speech-to-text), SEND.

**Right column** — four HUD cards:
- *Model · LLM Backend*: the model-select button (opens the popover), `#modelMeta`
  ("No backend set…" or "Routed via <host> · Active: <model>"), and the
  **⚙ configure backend** trigger.
- *Current Mission*: "Autonomous intelligence · E42.ai", focus line, role/date row.
- *Skills · Live Telemetry*: six animated bars with letter grades (S+/S) — visual
  flavor for the skills list.
- *Ambient*: Mood BUILDING (flavor); **Last push** and **Public repos** — real values
  from the GitHub API (`githubTelemetry()`, ~2280: public-events feed → newest
  PushEvent, falling back to the repo's `pushed_at`; unauthenticated, silently blank
  on failure); **Now reading** row → opens the newest deck PDF; **Now playing** row →
  the Spotify widget (§7).

**Overlays** — `#modelPopover`: a fixed-position listbox shared by both model-select
buttons (`setupModelDropdown()`, ~2115: positions itself under the trigger, flips
above if it would overflow, closes on outside-click/Escape/scroll/resize).
`#cfgPanel`: the backend form (§8). Both sit above everything via z-index.

## 4 · JS boot sequence (top to bottom of the `<script>`)

| # | Block | Anchor | What happens |
|---|---|---|---|
| 1 | `CONFIG` | ~1660 | `endpoint: 'https://llm-proxy.amitkumar0902.workers.dev'` (LLM on by default), model, apiKey, ttsProvider `'piper'`, piperVoice, `topK: 10`, `maxTurns: 12` |
| 2 | `LS` | ~1688 | the localStorage keys: `ak.endpoint / ak.model / ak.apiKey / ak.theme / ak.tts` |
| 3 | `applyOverrides()` | ~1692 | `?endpoint=…&model=…` → saved to localStorage → **scrubbed from the URL** (`window.history.replaceState` — `window.` because the chat transcript variable is also named `history`); then localStorage overrides `CONFIG` |
| 4 | `chatUrl()` | ~1712 | normalises any paste into a full URL: adds scheme (`http://` for local hosts, `https://` otherwise), appends `/v1/chat/completions` unless already there |
| 5 | `KB` | ~1734 | ~50 hand-written chunks — identity, every role, every E42 project with metrics, systems, 9 talks, education, recognition, skills, contact, meta |
| 6 | `SYSTEM_PROMPT` | ~1933 | the grounding contract (§6) |
| 7 | Now reading + `setupNowPlaying()` | ~1975/1991 | ambient rows (§7) |
| 8 | `setupDrawer()` / `setupTheme()` | ~2022/2037 | drawer open/close; theme = saved `ak.theme` else OS `prefers-color-scheme`, toggle persists |
| 9 | Model block | ~2063–2177 | `MODEL_OPTIONS` (the OpenRouter `:free` picker list), `refreshModeBadge()` (badge + meta + active-model labels), `systemNote()` (amber SYSTEM lines in chat), `applyModelChange()` (persist + announce), `setupModelDropdown()` |
| 10 | `setupBackendPanel()` | ~2179 | the ⚙ form (§8) |
| 11 | Splash/clock/GitHub/ping/particles | ~2260–2334 | ambience + real telemetry |
| 12 | BM25 | ~2336–2415 | `STOP`, `tok()`, `rebuildIndex()`, `pullKbJson()`, `bm25Score()`, `retrieve()` (§5) |
| 13 | `streamLLM()` | ~2418 | the SSE client (§6) |
| 14 | `history` / `WEAK_SCORE` / `buildMessages()` | ~2472–2508 | prompt assembly (§6) |
| 15 | `INTENTS` / `FALLBACK` / `classify()` | ~2510–2817 | scripted brain (§6) |
| 16 | Rendering | ~2819–3103 | `nowLabel`, `addUserMessage`, `escapeHtml`, `addAgentTyping`, `streamReply`, `streamTextInto`, `tokenize`, `attachSources`, `streamLLMReply`, `renderInline` |
| 17 | Short-circuits | ~3115–3178 | `isGreeting`/`isPersonaQuestion`/`isSurpriseMe` + their replies |
| 18 | `sendQuery()` + form wiring | ~3180–3264 | the dispatcher (§6) |
| 19 | `Piper` / `TTS` / `attachSpeakControl()` | ~3267–3438 | voice output (§9) |
| 20 | `setupSTT()` | ~3441 | voice input (§9) |
| 21 | Boot | ~3491 | `sendQuery('Hi')` after 1.3 s → the greeting you see |

## 5 · Retrieval — BM25 in the browser

- `tok()` (~2338): lowercase, strip punctuation, drop `STOP` words — but the stop list
  deliberately **keeps who/what/where/when/why/how**, because chunk titles use them
  ("Who he is") and dropping them would turn "who are you" into an empty query.
- `rebuildIndex()` (~2350): tokenises `title + text + section + tags` of every chunk,
  computes doc lengths, document frequencies, and IDF
  (`log(1 + (N − df + 0.5)/(df + 0.5))`).
- `pullKbJson()` (~2369): fetches `posts-kb.json`, `resume-kb.json`, `talks-kb.json`,
  appends them to `KB`, re-indexes, refreshes the badge count. (This is why the site
  must be served over http, not opened as `file://`.)
- `bm25Score()` (~2388): classic BM25, k1 = 1.5, b = 0.75 (term-frequency saturation +
  length normalisation).
- `retrieve()` (~2403): score all chunks, keep > 0, sort desc, return top
  `CONFIG.topK` as `{chunk, score}` pairs — used as LLM context *and* as the visible
  source chips.
- `WEAK_SCORE = 1.8` (~2476): if the best hit scores below this, the user message is
  tagged `[low-confidence retrieval …]` so the model prefers "I don't have that" over
  stretching an unrelated chunk.

## 6 · Answering — the full lifecycle

### `sendQuery()` (~3180) — the dispatcher

```
sendQuery(text)
 ├─ addUserMessage(text) — escaped, right-aligned; history.push({role:'user'})
 ├─ addAgentTyping() — three-dot bubble that the answer will replace
 ├─ isGreeting(text)?        bare "hi/hey/namaste…" (≤3 words)      → GREETING_REPLY
 ├─ isPersonaQuestion(text)? "who are you / what is this…" (regex)  → PERSONA_REPLY
 ├─ isSurpriseMe(text)?      "surprise me / pitch me / why hire"    → SURPRISE_REPLY
 │      (hand-written, instant, free — and immune to a dead model)
 ├─ sources = retrieve(text)                  ← ALWAYS, both modes
 ├─ if CONFIG.endpoint:
 │      ok = await streamLLMReply(node, buildMessages(text, sources), sources)
 │      ok → done.   failed → amber SYSTEM note explains why, fall through ↓
 └─ scripted: classify(text) → intent.answer() | FALLBACK
        streamReply() types it out → attachSources() → attachSpeakControl()
```

### LLM mode

**`buildMessages()`** (~2478) assembles:

```
[ system  : SYSTEM_PROMPT ]
[ history : last 12 turns — only 2 if the user pasted >1500 chars (e.g. a job description) ]
[ user    : "CONTEXT (the only source of truth …):
             [#1 · Experience · Document Intelligence Platform · E42.AI (bm25=9.31)]
             …chunk text…
             USER QUESTION: (+ low-confidence flag when weak)
             <the question>" ]
```

**`SYSTEM_PROMPT`** (~1933) is the contract: answer ONLY from CONTEXT; say "I don't
have that" when it's missing; never substitute an unrelated chunk; never invent
names/dates/numbers; **preserve specifics** (year + school + degree, not just
"2022"); résumé-section chunks are authoritative for dates/titles/metrics;
pasted job descriptions get a structured fit-assessment (verdict → requirement-by-
requirement match/gap → practical notes); bare greetings are exempt from the "I
don't know" rules; output HTML only (`<b> <i> <ul> <li> <a> <br> <p>`), no markdown.

**`streamLLM()`** (~2418) — the wire client. One `fetch` POST of
`{model, messages, stream: true, temperature: 0.5, max_tokens: 900}` to `chatUrl()`.
Adds `Authorization: Bearer` only when an apiKey is set (never needed for the
Worker); adds `ngrok-skip-browser-warning` for ngrok hosts. Reads the body as SSE:
skips `:` keep-alive comments, parses `data:` lines, yields
`choices[0].delta.content`, returns on `[DONE]`, throws on an in-stream `{error}`.
A server that ignored `stream:true` and returned plain JSON is handled too.

**`streamLLMReply()`** (~2989) — consumes the generator; after each token re-renders
the accumulated text through `renderInline()` with a blinking caret, auto-scrolls.
Success: `history.push({role:'assistant'})`, `attachSources()`, `attachSpeakControl()`.
Failure: inserts an amber SYSTEM message *above* the pending bubble — the wording is
diagnostic (404/"No endpoints found" → "model unavailable upstream, pick another from
the dropdown"; 429 → "rate limited, free-tier resets"; otherwise "Backend error") —
then returns `false` so the scripted path fills the bubble instead. **The page never
dead-ends.**

**`renderInline()`** (~3041) — the model is told to emit HTML, but when it emits
markdown anyway this repairs it: `**bold**`/`*italic*`/`` `code` ``/`[text](url)` →
tags; consecutive `- bullets` (even blank-line-separated) merge into one `<ul>`;
`### headings` → bold paragraphs; if block-level HTML is already present it's trusted
and only inline fixes are applied.

**`attachSources()`** (~2934) — renders "▸ Sources · N" under the answer (auto-open
when ≤ 3). Each chip shows `section · title · bm25-score`; chips with a `url` open
the deck/post/PDF in a new tab (↗), chips without show the chunk's raw text in an
inline preview panel — the visitor can audit exactly what grounded the answer.

### Scripted mode

**`INTENTS`** (~2510) — ~24 intents (greeting, who, work_now, marvin, eddie, vortex,
skills, projects, talks, writing, experience, education, recognition, hire, resume,
philosophy, documents, rag, nlp2sql, serving, team, evals, location…). Each has
`keywords` and an `answer()` returning `{text, list, after}` in HTML.

**`classify()`** (~2793) — scores each intent by summing the lengths of matched
keywords (longer match = stronger signal; some intents add a `bonus`). Keywords
≤ 4 chars must match as **whole words** — so "you" can't trigger `yo`, "this" can't
trigger `hi` — while longer ones may prefix-match (`quantiz` → quantization).
Best score ≥ 3 wins; otherwise `FALLBACK` (~2779) lists what to ask.

**`streamReply()` / `streamTextInto()` / `tokenize()`** (~2850–2932) — fake
streaming for scripted answers: HTML is split into tags (kept atomic) and 1–2-char
text tokens, typed out with punctuation-aware pauses (140 ms after `.!?`, 60 ms after
`,;:`), so scripted and LLM answers feel identical.

## 7 · Ambient widgets

- **Now reading** (`NOW_READING_URL`, ~1975): the animated-bars row labeled with the
  latest deck; click opens the PDF in a new tab.
- **Now playing** (`NOW_PLAYING_URL`, ~1989 + `setupNowPlaying()`, ~1991): labeled
  "Ode to sleep — playlist". Because the URL is a Spotify **/embed/** link, the first
  click sets the hidden iframe's `src` (lazy-load — no Spotify traffic until clicked)
  and toggles `.is-open`, expanding the inline dark-themed player; further clicks
  collapse/expand. If you ever set a non-embed URL, the row becomes an external link
  (↗) instead. Both the right-HUD and drawer copies are wired identically.
- **Mood / Last push / Public repos**: Mood is flavor; the other two are live GitHub
  data (see §3, Ambient).

## 8 · Backend paths & the ⚙ panel

The page speaks plain OpenAI `/v1/chat/completions`, so three setups work:

**A · Cloudflare Worker → OpenRouter** (`worker/llm-proxy.js`) — **DEPLOYED and the
default**: `https://llm-proxy.amitkumar0902.workers.dev` on the account subdomain
`amitkumar0902.workers.dev`, with the OpenRouter key stored as the `LLM_API_KEY`
secret (a local copy sits in gitignored `worker/.dev.vars` for `wrangler dev`).
Request pipeline in `fetch()`:

```
OPTIONS → CORS preflight reply
Origin present but not in ALLOWED_ORIGINS (site + localhost dev ports) → 403
GET /health → { ok, upstream, freeOnly, keyConfigured }   (no secrets)
rateLimited(ip)?  20/min or 200/hour per IP (in-memory)   → 429
handleChat():
  body > 128 KB → 413 ·· messages capped to last 26 ·· max_tokens clamped ≤ 1500
  FREE_ONLY guard: on OpenRouter, model must end ":free" → else 400   (nobody spends your credits)
  optional ALLOWED_MODELS hard allowlist
  → fetch ${UPSTREAM_BASE}/chat/completions with Bearer LLM_API_KEY (+ HTTP-Referer/X-Title attribution)
  upstream ok    → pipe the SSE body straight through (no buffering)
  upstream error → relay its body + status with CORS headers so the page can read error.message
```

Redeploy after editing the Worker: `cd worker && npx wrangler deploy`. Rotate the
key: new key at openrouter.ai/keys → `npx wrangler secret put LLM_API_KEY` (and
update `.dev.vars`). Any OpenAI-compatible upstream works by changing
`UPSTREAM_BASE` in `wrangler.toml`. Free-tier reality: ~50 requests/day on a $0
OpenRouter account, 20/min — beyond that the page degrades to scripted answers.

**B · Local model over ngrok** — llama.cpp / vLLM / Ollama / LM Studio +
`ngrok http <port>`, then `index.html?endpoint=https://xxxx.ngrok-free.app`. The page
adds the ngrok skip-warning header; your server must answer CORS preflights
(llama.cpp: default ok; Ollama: `OLLAMA_ORIGINS`; vLLM: `--allowed-origins`).

**C · Cleared** — empty the endpoint (⚙ Reset or `?endpoint=`) → scripted mode; the page always answers.

**The ⚙ panel** (`setupBackendPanel()`, ~2179) — a fixed overlay opened from either
column or the drawer. Fields: Endpoint, Model (blank = use the picker), API key
(direct servers only — never for the Worker). **Save** persists to localStorage and
posts a SYSTEM note; **Test** temporarily applies the form values, streams a one-word
prompt, reports `OK · NNms · "reply"` or the error, then restores; **Reset** wipes
`ak.endpoint/ak.apiKey/ak.model` back to scripted mode.

**Model picker** — `MODEL_OPTIONS` starts as a curated list of verified `:free` ids
(Gemma 4 31B default, MiniMax M3, Nemotron 3 …), then `loadFreeCatalogue()` fetches
OpenRouter's public `/api/v1/models` at page load and replaces it with the **live**
`:free` catalogue: curated entries stay pinned on top, the rest are appended biggest-
context-first, retired ids are pruned (a saved-but-retired model auto-falls-back to
the top option), and the popover scrolls. If the API is unreachable the curated list
simply stands. Free-model 429s are absorbed by the `models:[…]` fallback list (max 3)
that rides along on every `:free` request — OpenRouter tries them in order.

## 9 · Voice — sound in and out

**Out (answers speak):**

```
answer finishes → attachSpeakControl(node, autoplay)   (~3414)
 ├─ clones .msg-body, strips sources/previews/caret → only the answer text is read
 ├─ adds the ♪ READ button in the message meta
 └─ topbar speaker toggle ON (TTS.on ⇄ ak.tts) → auto-plays each new answer

TTS.speak(text)   (~3298)
 ├─ 'piper' (default): Piper.load() dynamic-imports @diffusionstudio/vits-web from
 │    jsDelivr; first use downloads the ONNX voice (CONFIG.piperVoice =
 │    'en_US-ryan-medium', ~25 MB, browser-cached forever; button shows ⌛ LOADING);
 │    tts.predict() runs the VITS neural net in WASM → WAV Blob → Audio.play()
 └─ any failure → _speakViaBrowser(): OS speechSynthesis, sentence-by-sentence,
      best available en-US "natural/neural" voice
```

Fully client-side: no audio leaves or reaches a server; works offline once cached.
Clicking a playing button stops it; a new message stops the previous one.

**In (talk instead of type):** `setupSTT()` (~3441) — browser `SpeechRecognition`
with interim results streaming into the textarea; mic button pulses while listening;
hidden on unsupported browsers.

## 10 · What leaves the browser (complete list)

| Call | When | Purpose |
|---|---|---|
| Google Fonts | load | Space Grotesk + JetBrains Mono |
| `*-kb.json` (same origin) | load | the generated KB chunks |
| GitHub API (2 calls) | load | last push + repo count (unauth, fails silent) |
| OpenRouter `/api/v1/models` | load | live `:free` catalogue for the picker (public, no key) |
| `CONFIG.endpoint` (the Worker → OpenRouter) | per question | the chat completion |
| jsDelivr + HuggingFace | first ♪ READ only | Piper WASM + voice model |
| Spotify iframe | first click on Now playing | the embedded player |

localStorage keys: `ak.endpoint`, `ak.model`, `ak.apiKey`, `ak.theme`, `ak.tts`.
There is no analytics, no cookies, no tracking.

## 11 · Local dev & testing

```
python3 scripts/mock-llm.py            # fake OpenAI-compatible SSE server on :8765
python3 -m http.server 4321            # serve the site (fetch() needs http, not file://)
open "http://localhost:4321/?endpoint=http://127.0.0.1:8765"
```

The mock echoes how many messages/context chunks it received (proves retrieval and
streaming); `model: "bad-model"` returns an OpenRouter-style 404 (proves the error →
scripted fallback). `git push` to `main` deploys via GitHub Pages.

## 12 · Where to change what

| You want to… | Edit |
|---|---|
| Fix/add a fact the agent knows | `KB` array in `index.html` (or the source post/PDF, then re-run `scripts/build-kb.py`) |
| Change offline answers | `INTENTS` / `FALLBACK` / `SURPRISE_REPLY` / `GREETING_REPLY` / `PERSONA_REPLY` |
| Change the agent's behaviour/tone | `SYSTEM_PROMPT` |
| Change the default backend | `CONFIG.endpoint` (currently the deployed Worker) |
| Add/remove picker models | `MODEL_OPTIONS` |
| Change chips / topic shortcuts | the `#chips` buttons / `data-q` list items (HTML) |
| Change the playlist | `NOW_PLAYING_URL` + the two `.np-text` labels |
| Change the "Now reading" deck | `NOW_READING_URL` + the two row labels |
| Change the spoken voice | `CONFIG.piperVoice` (or `ttsProvider: 'browser'`) |
| Context size / memory | `CONFIG.topK` / `CONFIG.maxTurns` |
| Worker limits / origins / free-only | constants at the top of `worker/llm-proxy.js` + `wrangler.toml` |
