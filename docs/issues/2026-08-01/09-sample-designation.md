# Issue 09 — Sample designation (make the "sample mocks" promise true)

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Pricing promises "sample mocks and sample Mains notes — judge the quality
before paying a rupee" (PRD user stories 2, 4). The notes sample exists
(Foundation section); the mock-library sample mechanism exists (`free` flag
honored end-to-end) but **no library mock is designated free yet**. The owner
picks the sample mock(s) — a content judgment — and this slice wires the
designation through every layer so a signed-out visitor can actually take one
with the paywall on.

## Acceptance criteria

- [ ] Owner has chosen the sample mock(s) (recommendation: one Stage-II-style
      mock, clearly labelled "sample · free").
- [ ] With the paywall enabled, a signed-out visitor can start, take, and
      finish the designated mock and see its full report; every other library
      mock stays locked.
- [ ] The designation is consistent across all layers: library listing shows
      it unlocked, the mock loads without entitlement, its data is exempted
      from the premium manifest and remains statically served, and the
      go-live hosting-exclusion list in the deploy runbook reflects it.
- [ ] Library and pricing copy label samples honestly; the requirement
      register's sample line is updated.

## Blocked by

None — can start immediately (owner's pick is part of the slice).

## User stories addressed

- User story 2 (sample mock + sample notes)
- User story 4 (pricing promises are concretely true)
