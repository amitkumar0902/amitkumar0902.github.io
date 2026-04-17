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

---

## Mains toolkit (NORCET 10 Mains 2026)

The `norcetprep/mains-plan/` subsite is a self-contained 13-day program for
the NORCET Mains 2026 exam, driven by the **High-Yield Topics NORCET** PDF
and the companion NORCET High-Yield YouTube playlist.

### Key pages

- **13-Day Plan** · `mains-plan/index.html`
- **High-Yield Syllabus checklist** · `mains-plan/syllabus.html` — all 610
  PDF topics with notes + MCQ + video links; persists progress in
  `localStorage` (key `syllabusDone`) and syncs to Firestore when
  `js/firebase-config.js` is configured.
- **Notes viewer** · `mains-plan/notes/index.html?section=<section>` —
  scenario-first notes with `clinicalContext` + `nursingPriority` per topic.
- **Watch** · `mains-plan/watch.html` — embedded YouTube playlist with
  per-episode syllabus linkage.
- **Bank** · `mains-plan/bank.html?syllabusId=<id>` (or `?tag=scenario`) —
  filter the unified question bank by topic or tag.
- **Mocks** · `mains-plan/mocks/` — 10 full-length mocks + a PYQ-only mock.

### Regenerate the Mains bundle

```bash
cd norcetprep/scripts
node build-syllabus.mjs               # rebuild syllabus.json from PDF topics
node consolidate-notes.mjs            # merge notes-content*.mjs → data/mains/notes/<section>.json
node gen-highyield.mjs                # per-topic scenario MCQs → data/mains/topics/high-yield/<section>.json
node enrich-syllabus-frequency.mjs    # apply topper frequency-analysis.json → syllabus.json (adds 'critical' tier + frequencyScore)
node build-mains-bank.mjs             # unified bank + 10 mocks + PYQ mock + NORCET-9 verbatim replay + audits
```

The builder globs every JSON file under `data/mains/pyqs/` as the
source of truth for PYQ rows, so adding a new Mains paper is a matter
of dropping a well-formed `<paper>.json` in that folder. The current
set is:

- `pyqs/norcet-9-mains-2025.json` — 121 Qs, verbatim from the official
  PDF (`imp/NORCET- 9 MAINS.pdf`).
- `pyqs/norcet-6-7-8-recalls.json` — 17 memory-based recalls.

The topper frequency table lives in `data/mains/frequency-analysis.json`
(transcribed from the WhatsApp images in `imp/`). Any topic appearing
in ≥ 8 paper-sittings is promoted to the **`critical`** priority tier
during the enrich step above; the Topper page
(`mains-plan/toppers.html`) renders the full ranked table and links
each row back into the matched syllabus entry's notes + MCQs.

### Enabling cross-device sync (Firebase) + remote reporting

1. Create a Firebase project → enable **Authentication → Anonymous** and
   **Cloud Firestore** (test-mode rules are fine for personal use).
2. Copy your config object (Project settings → General → Your apps → SDK
   config) into `norcetprep/js/firebase-config.js` — replace the
   placeholder `REPLACE_ME` values. A minimal working example:

   ```js
   window.NM_FIREBASE_CONFIG = {
     apiKey: 'AIza…',
     authDomain: 'norcet-mains.firebaseapp.com',
     projectId: 'norcet-mains',
     storageBucket: 'norcet-mains.appspot.com',
     appId: '1:…:web:…'
   };
   ```

3. Deploy the site (`git push`). On next load, `js/sync.js` runs anonymous
   auth and starts syncing `syllabusDone`, `notesDone`, `practiceDone`,
   `bankMode`, and reviewed-SRS state under a user doc, so the same
   progress is visible on phone and laptop. Question reports go to the
   `reports` collection (fallback: `localStorage.reports`).

If the Firebase config remains unset, the site continues to work entirely
offline — progress simply stays on whichever device it was recorded on.
