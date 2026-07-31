---
id: T09
title: Content engine & quality bar
labels: [wayfinder:grilling]
status: open
assignee: none
blocked-by: []
---

## Question

What must the premium content engine produce, at what cadence and quality, for
a subscription to be worth paying for — and keep paying for? Decide:

- The launch bar: how many mocks / bank questions / notes premium must have on
  day one (calibrated by [Competitor & pricing landscape](t01-competitor-landscape.md)
  once it lands).
- The ongoing drop cadence a subscription implicitly promises, and what each
  drop contains.
- The AI-generation + engineer-review pipeline: extend the existing scripts
  (`gen-highyield.mjs`, validators, `verification-log.md`, `_audit`) into a
  repeatable production line.
- Clinical-accuracy safeguards without a domain expert: cross-model
  verification, confidence-flagged review queues, the user error-report loop
  (`report.js`) as a first-class quality input.
- What to do about the verbatim NORCET-9 PYQ paper before charging for it —
  [Legal & compliance baseline](t05-legal-compliance.md) resolved the verdict:
  all 121 items must be rewritten into reworded recall style before the
  paywall; this ticket decides how that rewrite fits the pipeline.
- Language strategy: [Competitor & pricing landscape](t01-competitor-landscape.md)
  found an English-first option is an exploitable gap in a Hindi-led market —
  decide English-first vs bilingual for banks, notes, and explanations.
