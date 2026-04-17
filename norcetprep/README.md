# NORCET Excellence Hub (static site)

Free topic-wise MCQs and Stage 1 / Stage 2 mock tests for AIIMS NORCET preparation — hosted on **GitHub Pages**.

**Live site:** `https://amitkumar0902.github.io/norcetprep/`

## For contributors

1. Edit `data/questions/<slug>.json` (array of objects with `question`, `options` [4], `correct` 0–3, `explanation`).
2. Run:

   ```bash
   node norcetprep/scripts/validate-questions.mjs
   node norcetprep/scripts/check-index-counts.mjs
   ```

3. If you add a **new** topic: add `topics/<slug>.html`, JSON file, slug to [js/topic-banks.js](js/topic-banks.js), and a card on [index.html](index.html). Add URL to [sitemap.xml](sitemap.xml).

## SEO & growth

See **[SEO_PLAYBOOK.md](SEO_PLAYBOOK.md)** and **[.orchestrator/README.md](.orchestrator/README.md)**.

## Project owner checklist (not in git)

- Google Search Console + sitemap submit
- GitHub repo **About** description + website URL + topics
