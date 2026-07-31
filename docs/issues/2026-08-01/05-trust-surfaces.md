# Issue 05 — Trust surfaces: methodology page + public fix-log

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The two promised-but-unbuilt trust pages (PRD user story 5): a methodology
page describing the pipeline truthfully, and a public dated fix-log fed by the
weekly report triage — plus footer wiring so every surface links them. These
pages are referenced by the signed-off prototype, the pricing promises, and
the support SLAs; they must exist before launch.

## Acceptance criteria

- [ ] Methodology page describes: automated consistency checks, independent
      cross-verification, human review, mandatory source citations, and the
      weekly fix cadence — with **no** "expert-verified" or AI-foregrounding
      language (claims discipline per PRD Implementation Decisions → Design/
      Content pipeline).
- [ ] Public fix-log page lists dated entries (question id, what was wrong,
      what changed); seeded from the existing verification log; the weekly
      triage runbook appends to it.
- [ ] Both pages linked from footers across free pages, product pages, and
      the study app; the in-question report flow mentions fixes land in the
      public fix-log.
- [ ] A named founder/about presence (transparent solo builder) exists on or
      via the methodology page.
- [ ] Pages follow the Clinical Excellence system and carry the AIIMS
      non-affiliation line.

## Blocked by

None — can start immediately.

## User stories addressed

- User story 5 (methodology + fix-log + named builder)
- User story 21 (reports visibly become fixes)
