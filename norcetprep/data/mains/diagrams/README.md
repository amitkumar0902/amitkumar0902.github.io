# Notes-page diagrams

Labelled diagrams shown on the right side of matching note cards in `mains-plan/notes/`.

## How it works

- `manifest.json` (auto-generated) maps `note.id` → `{ file, alt, source, license, sourceUrl }`.
- The notes page fetches `manifest.json` and renders an `<aside class="note-diagram">` on each card whose ID has a manifest entry.
- Cards without a matching entry leave the right column empty (intentional — no filler).

## Adding a diagram

1. Edit `norcetprep/scripts/diagrams-sources.json`. Each entry needs:
   - `topicId` — must match an existing `id` in one of `data/mains/notes/*.json` (the script validates).
   - Either `url` (downloaded via wget/fetch) **or** `localFile` (path relative to `norcetprep/`, points to an existing project asset).
   - `license`, `source`, `sourceUrl` (for attribution in the figcaption), `alt` (a11y).
2. Run `node scripts/fetch-diagrams.mjs` from the `norcetprep/` directory.
   - Adds new files to this folder, regenerates `manifest.json`.
   - `--force` re-downloads everything; default skips cached files.

## Sources & licenses

All entries link to public-domain or Creative Commons sources (mainly Wikimedia Commons; project-original SVGs in `data/mains/images/` may also be referenced via `localFile`). The figcaption on each card surfaces the attribution and license, satisfying CC-BY requirements.
