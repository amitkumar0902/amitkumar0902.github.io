---
id: T09
title: Content engine & quality bar
labels: [wayfinder:grilling]
status: closed
assignee: amit
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

## Resolution

Decided 2026-07-31 in a grilling session with the owner. All four forks went
to the recommended options: **harden what exists · layered gates ·
NORCET-9 rewritten before launch · English-first**.

**Day-one launch bar (no volume push).** The inventory already beats the
incumbents' headline numbers (1,569 bank questions incl. 404 PYQs and 771
scenario items; 10 full mocks + 8 recall-style PYQ paper-mocks + 5
sister-exam staff-nurse mocks; 13 notes sections; flashcards, labelled
diagrams, drug-calc drill). The bar is therefore quality, not volume:

1. **NORCET-9 repositioned**: all 121 verbatim items rewritten to memory-based
   recall style with original explanations — 100% human-reviewed as a one-time
   batch (~4–5 h); every "verbatim / official PDF" claim removed. The raw
   transcript JSON **and the official PDF in `imp/`** leave the served site
   and the sw precache (old git history retains them — accepted residual risk
   that drops to near-nil once unpublished, per
   [Legal & compliance baseline](t05-legal-compliance.md)).
2. **Verification coverage closed**: the layered pipeline (below) runs over
   the full 1,569-question bank (~990 currently outside the verification log)
   and every paid mock before the paywall goes live; `needs_explanations.json`
   holes are drafted and reviewed through the same gates.
3. **Small sets audited**: flashcards, diagrams, drug-calc drill.
4. **Free tier swept too**: the 547 topic MCQs get validators + the
   cross-model pass (sampled human review) — the shop window carries the
   trust story.
5. **Sister-exam mocks** (RRB/ESIC/DSSSB/JIPMER/AIIMS-SN) ship inside premium
   as unadvertised bonus content — seeds the multi-exam future at zero
   marketing commitment.

**The layered pipeline** (extends what exists — gen-highyield.mjs,
validate-questions.mjs, mock-blueprint.json, `_audit`, verification-log.md):

1. *Draft*: generator scripts, driven by mock-blueprint.json composition and
   frequency-analysis weighting.
2. *Static gates*: schema/options/answer-key/duplicate validators + `_audit`
   coverage reports (all existing, kept in CI).
3. *Adversarial gate* (new `verify-questions.mjs`): an independent model from
   a different family receives each question + key + explanation and tries to
   refute it; disagreement or low confidence → flag queue.
4. *Human gate*: engineer reviews 100% of flagged items + a 20% random
   sample. Every question carries a **mandatory source citation** (standard
   nursing references) enforced by the validator.
5. *Publish*: upload script writes chunks to `content/norcet/**` in Firestore
   (per [Platform & entitlement architecture](t07-platform-architecture.md));
   verification-log and audits regenerate.
6. *Feedback*: report.js error reports → weekly triage → fixes land on the
   **public fix-log** with dates (SLA owned by [Support & ops](t14-support-ops.md)).

Estimated human cost: backlog ~10–15 h total (flagged + sample, vs ~40 h full
manual); season cadence ~1.5–3 h/week.

**Season cadence ops** (the promise made in
[Pricing & packaging](t06-pricing-packaging.md)): during Jul–Sep and Feb–Apr —
Mon generate a 160-question Stage-II mock → Tue–Wed automated gates → Thu
human queue → Fri publish + announce. Off-season: bank-growth batches and
fix-log only. Honesty rule: if a week's mock fails its gates, it ships late,
never unreviewed.

**Language** — English-first at launch (occupies the underserved gap; zero
extra work). The question schema reserves a `translations` slot from day one;
Hindi glosses for high-confusion clinical terms are a post-revenue
enhancement.

**Claims discipline** (per [Brand, domain & trust](t08-brand-domain-trust.md)):
the public methodology page describes this pipeline truthfully without
AI-foregrounding — "every question passes automated consistency checks, an
independent cross-verification pass, and human review; carries a source
citation; and errors are publicly logged and fixed." No "expert-verified"
language unless a credentialed reviewer actually joins.

Feeds: [Paywall & subscription UX prototype](t11-paywall-ux-prototype.md)
shows sample explanations + the methodology page;
[Launch sequencing & migration](t13-launch-sequencing.md) gates go-live on
items 1–2 of the launch bar; [Growth & distribution engine](t12-growth-engine.md)
draws the daily free quiz from the verified bank.
