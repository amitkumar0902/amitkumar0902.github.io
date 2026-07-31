# Issue 04 — Full-bank verification run

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Close verification coverage before the paywall (PRD user story 26; launch bar
in Implementation Decisions). Run the layered pipeline — static validators,
the adversarial gate from issue 03, human review of 100% of flags plus a 20%
random sample — over the full 1,569-question bank, every paid mock, the small
sets (flashcards, diagrams, drug-calc), and the free 547 (the shop window
carries the trust story). Fill the known explanation holes. Make source
citations mandatory at the validator level so future content can't regress.

## Acceptance criteria

- [ ] Verification log covers 100% of the bank and every paid mock (the ~990
      previously-unlogged items included); audits regenerate clean.
- [ ] The citation rule is enforced by a validator that fails CI when a
      question lacks a source.
- [ ] All explanation holes drafted, gated, and human-reviewed through the
      same pipeline.
- [ ] Flashcards, diagrams, drug-calc drill audited; free topic MCQs swept
      with sampled human review.
- [ ] Human review effort logged and within the backlog estimate (~10–15 h
      total).

## Blocked by

- Blocked by [issue 03](03-verify-questions-tool.md) (the adversarial gate is
  a pipeline stage).

## User stories addressed

- User story 1 (explanations with citations as covered)
- User story 26 (verification coverage closed before the paywall)
