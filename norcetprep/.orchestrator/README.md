# NORCET Excellence Hub — orchestrator (local)

This folder approximates a lightweight **SEO/content orchestrator** for the static GitHub Pages site. It does not run automated agents; it holds **state**, **prompts**, and **runbooks** so you (or Cursor) can execute campaigns in order.

**Master doc:** [../SEO_PLAYBOOK.md](../SEO_PLAYBOOK.md) (ranking loop, commands, GSC, outreach).

## Files

| File | Purpose |
|------|---------|
| `state.json` | Active campaign, focus queries, URLs, placements log |
| `topic-spec.json` | Machine-readable topic gaps (min Qs, priority, subtopics) |
| `GAP_REPORT.md` | Human summary of gaps vs `topic-spec.json` |
| `MAINTENANCE.md` | Quarterly checks + outdated copy patterns |
| `prompts/question-gen.md` | Templates for question-generation LLM turns |
| `analytics/runbook.md` | Google Search Console export + report format |
| `distribution/templates.md` | Outreach drafts + logging |
| `campaigns/pharmacology-mcq-free.json` | Example campaign spec |

## Workflow

1. Update `state.json` with `campaign`, `focus_queries`, `priority_urls`.
2. Edit `topic-spec.json` after counting questions: `node scripts/validate-questions.mjs` (see counts in output).
3. Generate questions using prompts in `prompts/question-gen.md`; merge into `data/questions/*.json`; re-run validator.
4. Sync [index.html](../index.html) card counts with validator output.
5. SEO: topic meta, pillar pages, [sitemap.xml](../sitemap.xml).
6. Log outreach in `state.json` → `placements` and/or monthly `analytics/reports/`.

## topic-loader.js

Question pages load JSON by **URL slug** (`topics/pharmacology.html` → `data/questions/pharmacology.json`). There is no duplicate topic map in the loader. Shared bank slugs for **hub progress** and **mocks** live in [js/topic-banks.js](../js/topic-banks.js).
