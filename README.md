# amitkumar0902.github.io

Amit Kumar's portfolio, served by GitHub Pages from the repo root.

- `index.html` — **amit.agent**, the chat-first portfolio. Retrieval (BM25) runs in
  the browser over a knowledge base; an LLM composes the answer when a backend is
  configured, otherwise scripted intents answer. Sources are shown under each reply.
- `index-classic.html` — the classic single-page portfolio (linked from the agent sidebar).
- `blogs.html`, `blog-*.html`, `book-review-*.html` — writing. `pubs/` — talk decks and the CV.
- `posts-kb.json`, `talks-kb.json`, `resume-kb.json` — knowledge-base chunks generated
  from the posts, decks and CV by `scripts/build-kb.py` (needs `pdftotext`; re-run after
  editing a post or adding a PDF).
- `worker/` — Cloudflare Worker that proxies OpenRouter's free models and keeps the key
  server-side. See `worker/README.md`.
- `scripts/mock-llm.py` — OpenAI-compatible mock server for local testing.

## Enabling the LLM

The page works without a backend. To turn on LLM answers, pick one:

1. **Worker → OpenRouter (recommended for the live site).** Deploy `worker/` and
   put its URL in `index.html` → `CONFIG.endpoint` (or paste it in the page's
   "⚙ configure backend" panel). Free models only, by default.
2. **Local model over ngrok.** Run any OpenAI-compatible server (llama.cpp, vLLM,
   Ollama, LM Studio), `ngrok http <port>`, then open
   `index.html?endpoint=https://xxxx.ngrok-free.app&model=<id>` — the page stores
   it in localStorage and scrubs the URL.

## Local dev

```
python3 scripts/mock-llm.py            # fake LLM on :8765
python3 -m http.server 4321            # site on :4321
open "http://localhost:4321/?endpoint=http://127.0.0.1:8765"
```

Hand-written facts live in the `KB` array in `index.html`; scripted fallback
answers in `INTENTS`. Keep both grounded in what the site actually says.
