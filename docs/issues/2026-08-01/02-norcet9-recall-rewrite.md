# Issue 02 — NORCET-9 recall rewrite (the legal gate)

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The launch-blocking legal gate (PRD: Implementation Decisions → Content
pipeline; user story 26 AC). Rewrite all 121 verbatim NORCET-9 Mains items
into memory-based recall style with original explanations — 100%
owner-reviewed as a one-time batch — and remove every verbatim/official-paper
claim and artifact from served surfaces. Exam papers are copyrighted; this
must be complete before any paywall.

## Acceptance criteria

- [ ] All 121 items rewritten to recall style with original explanations and
      source citations; JSON passes the content validators.
- [ ] Owner has reviewed 100% of the batch; sign-off recorded in the
      verification log.
- [ ] The strings "verbatim" / "official PDF" (and equivalent claims) appear
      on no served page — mock library copy, PYQs page, meta descriptions,
      and structured data included; the paper is labelled "memory-based
      recall" everywhere.
- [ ] The official PDF and the raw transcript are absent from every served
      surface on the product domain (git history retention is the accepted
      residual risk, per PRD Further Notes).
- [ ] Free-tier and premium pages consuming the rewritten JSON render
      correctly.

## Blocked by

None — can start immediately. (Owner review time ~4–5 h is part of the slice.)

## User stories addressed

- User story 16 (recall-labelled paper mocks)
- User story 26 (pipeline legal gate)
