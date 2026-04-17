# Gap report (manual + validator)

Run from repo root:

```bash
node norcetprep/scripts/validate-questions.mjs
```

Compare printed **counts per file** to `min_questions` in [topic-spec.json](./topic-spec.json).

## How to use

1. Any bank **below** `min_questions` → schedule Question-gen + JSON merge for that slug.
2. **Subtopics** in `topic-spec.json` are hints for batch prompts (see [prompts/question-gen.md](./prompts/question-gen.md)).
3. Re-run after each content sprint and update this section with date + notes.

## Last check

- **2026-03-20:** `validate-questions.mjs` — 17 files, **713** total MCQs. Compare each slug to `topic-spec.json` `min_questions` (several banks exceed targets).
- **2026-03-21 (ranking sprint):** **728** total MCQs (+15 pharmacology). Re-run `validate-questions.mjs` after edits.
