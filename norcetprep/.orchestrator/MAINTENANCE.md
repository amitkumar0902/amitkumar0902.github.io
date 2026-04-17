# Maintenance checklist (quarterly or before big exam cycle)

## Copy and facts

- [ ] Grep site for outdated patterns:
  - `Dec 2025`, `200 MCQs`, `180 Minutes` as a single-paper exam
  - Old countdown years
- [ ] Hub exam cards match **official** NORCET notice ([aiimsexams.ac.in](https://aiimsexams.ac.in)): Stage 1 (100 Q / 90 min), Stage 2 (160 Q / 180 min), cutoffs.
- [ ] [index.html](../index.html) topic card **question counts** match `node norcetprep/scripts/validate-questions.mjs` output.

## Technical

- [ ] [sitemap.xml](../sitemap.xml) includes every `topics/*.html` and `norcet-*.html`.
- [ ] [robots.txt](../robots.txt) `Sitemap:` URL matches deployed base.
- [ ] No broken internal links on hub and pillar pages.
- [ ] `node norcetprep/scripts/validate-questions.mjs` exits 0.

## JSON health

- [ ] No duplicate `id` within each `data/questions/*.json` file.
- [ ] Every item has `question`, `options` (length 4), integer `correct` in 0–3, non-empty `explanation`.

## SEO / distribution

- [ ] Google Search Console: sitemap submitted; review coverage.
- [ ] GitHub repo **About**: website URL + description with primary keywords.
- [ ] Append new outreach URLs to [state.json](./state.json) `placements`.

## Last sweep log

- **2026-03-21 (ranking sprint):** Grep for `Dec 2025` / `200 MCQs` / single-paper `180 Minutes` in `norcetprep/*.{html,js,md}` — **no stale matches** (only this doc + SEO_PLAYBOOK mention as grep targets). Ran `validate-questions.mjs` + `check-index-counts.mjs` — **exit 0**, **728** total MCQs, hub cards match JSON. **Exam copy:** verify Stage 1/2 vs [aiimsexams](https://aiimsexams.ac.in) before each NORCET cycle (not changed in this pass).
