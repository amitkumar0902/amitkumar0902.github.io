# NORCET Excellence Hub — full SEO & growth playbook

One place for **ranking strategy**, **repo workflows**, and **manual steps** you cannot automate in git.

## 1. What “success” means

- **Not guaranteed:** #1 for “NORCET mock test” (high competition).
- **Realistic:** Growth in **Search Console impressions/clicks**, and **top 10 for some long-tail queries** (e.g. “free NORCET pharmacology MCQ no login”) over months with consistent updates + a few real links.

## 2. What is already in this repo

| Piece | Location |
|-------|----------|
| Hub + 19 topic cards | [index.html](index.html) |
| Shared question-bank slugs | [js/topic-banks.js](js/topic-banks.js) |
| Dynamic progress + countdown | [js/index.js](js/index.js) |
| Stage 1/2 mocks | [topics/mock-test.html](topics/mock-test.html), [js/mock-test.js](js/mock-test.js) |
| Question validation | [scripts/validate-questions.mjs](scripts/validate-questions.mjs) |
| Index vs JSON count check | [scripts/check-index-counts.mjs](scripts/check-index-counts.mjs) |
| Topic SEO patcher | [scripts/patch-topic-seo.mjs](scripts/patch-topic-seo.mjs) |
| Sitemap / robots | [sitemap.xml](sitemap.xml), [robots.txt](robots.txt) |
| Pillar pages | `norcet-*.html` |
| Orchestrator state & prompts | [.orchestrator/](.orchestrator/) |

## 3. Commands (run from repo root)

```bash
# Validate every MCQ bank (schema, 4 options, correct 0–3, duplicate ids)
node norcetprep/scripts/validate-questions.mjs

# Compare hub card numbers to JSON lengths (topic cards only)
node norcetprep/scripts/check-index-counts.mjs

# Re-apply meta + SEO blocks to legacy topic HTML (idempotent)
node norcetprep/scripts/patch-topic-seo.mjs
```

## 4. Google Search Console (you must do this)

1. Add property: `https://amitkumar0902.github.io/` (or URL-prefix for `/norcetprep/`).
2. **Sitemaps** → submit `https://amitkumar0902.github.io/norcetprep/sitemap.xml`.
3. Every **2–4 weeks**: Performance → Export queries + pages.
4. Paste insights into [.orchestrator/analytics/reports/](.orchestrator/analytics/reports/) (`YYYY-MM.md`).

Full steps: [.orchestrator/analytics/runbook.md](.orchestrator/analytics/runbook.md).

## 5. GitHub repo “About” (you must do this)

- **Website:** `https://amitkumar0902.github.io/norcetprep/`
- **Description:** short line with “NORCET”, “free”, “MCQ”, “mock”.
- **Topics:** see [.orchestrator/distribution/templates.md](.orchestrator/distribution/templates.md).

## 6. Content sprint loop (repeat forever)

1. Pick **1–2 queries** from GSC with position **8–20** and meaningful impressions.
2. **On-page:** improve `<title>` + meta description on the URL that already ranks (or the URL you want to rank).
3. **Depth:** add **300–600 words** (H2 + bullets) + **2–3 internal links** to related topic/mocks/pillars.
4. **MCQs:** add **10–20** questions to the matching `data/questions/<slug>.json`; run **validate** + **check-index-counts**; update [index.html](index.html) if counts changed.
5. **Outreach:** 1–2 posts (Telegram group, Quora, Dev.to) using [distribution/templates.md](.orchestrator/distribution/templates.md); log URLs in [.orchestrator/state.json](.orchestrator/state.json) → `placements`.
6. Update `focus_query` / `focus_url` in `state.json` for the next cycle.

## 7. Maintenance (monthly)

See [.orchestrator/MAINTENANCE.md](.orchestrator/MAINTENANCE.md): exam dates vs [aiimsexams.ac.in](https://aiimsexams.ac.in), broken links, sitemap, grep for old copy (“200 MCQs” single paper, wrong year).

## 8. CI

GitHub Actions runs `validate-questions.mjs` on PRs when JSON under `norcetprep/data/questions/` changes (see `.github/workflows/`).

## 9. Legal / quality

- Do **not** copy official exam PDFs verbatim.
- Prefer **original** explanations; PYQs as **memory-style** with your own wording.
- State clearly: **not affiliated with AIIMS** (already on mock pillar).

## 10. Further reading (external)

Ranking factors evolve; use Search Console as ground truth, not blog headlines alone.
