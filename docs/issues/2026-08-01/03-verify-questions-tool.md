# Issue 03 — Adversarial verification tool (`verify-questions`)

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The pipeline's adversarial gate (PRD: Implementation Decisions → Content
pipeline; Testing Decisions → adversarial content gate). A CLI that sends each
question + answer key + explanation to an independent model from a different
family and asks it to refute; disagreement or low confidence lands the item in
a flag queue for human review. Its own acceptance test is a golden set of
deliberately wrong questions it must catch.

## Acceptance criteria

- [ ] Runs over any bank/mock JSON file and emits a flag-queue file
      (question id, refutation reason, confidence) plus a summary count.
- [ ] Uses a model family independent of the one that drafts content;
      credentials via environment, never committed.
- [ ] Golden set of ≥10 deliberately wrong items (wrong key, outdated
      guideline, ambiguous options) — 100% flagged; a matched set of correct
      items produces near-zero false flags.
- [ ] Resumable/idempotent over large files (safe to re-run; already-verified
      items skippable).
- [ ] Usage documented beside the other owner scripts; the weekly cadence
      (generate → gates → human queue → publish) references it.

## Blocked by

None — can start immediately.

## User stories addressed

- User story 26 (layered pipeline with adversarial gate)
