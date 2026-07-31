---
id: T06
title: Pricing & packaging
labels: [wayfinder:grilling]
status: closed
assignee: amit
blocked-by: [T01]
---

## Question

Where is the free/paid line, and what does the subscription cost? Decide with
the owner, against [Competitor & pricing landscape](t01-competitor-landscape.md)
findings:

- What stays free as the SEO/acquisition funnel (topic MCQs? some mocks?) and
  what becomes premium (full mocks, Mains toolkit, flashcards, diagrams,
  drills?).
- Tier structure: monthly vs quarterly vs till-exam **validity plans** (the
  Indian prep norm), and price points vs competitor benchmarks.
- Launch/intro pricing, and whether the existing allowlisted user is
  grandfathered.
- What ongoing content drops the price implicitly promises (feeds
  [Content engine & quality bar](t09-content-engine.md)).

## Resolution

Decided 2026-07-31 in a grilling session with the owner. All four forks went
to the recommended options.

**Free/paid line — funnel free, depth paid.** Free forever: all ~547 topic
MCQs, the daily free quiz, the currently-public Stage 1/2 mocks (kept as
labelled samples), and open samples of Mains notes/diagrams (enough to judge
quality). Paid: the full mock library, the complete Mains toolkit (notes,
flashcards, labelled diagrams, drills, toppers frequency analysis, PYQ mocks),
and cutoff-anchored analytics. Minimal takeback: this matches what the
allowlist already gated.

**Price ladder — ₹299 / ₹599 / ₹999** for 3 / 6 / 12-month validity. One-time
payments, no auto-renewal anywhere; expiry reminders with an honest renew CTA
at list price (no win-back traps). Prices are all-inclusive as displayed (no
GST line while unregistered under ₹20L — revisit display if registration ever
happens). Marketing anchors: "less than a third of the ₹3,000 application
fee"; the 12-month covers both the 2026 and spring-2027 cycles (repeat
attempts are the norm per
[NORCET exam calendar & market size](t02-exam-calendar-market.md)).
Three Razorpay Payment Pages, one per SKU, uid in notes (per
[Platform & entitlement architecture](t07-platform-architecture.md)).

**Launch offer — honest and time-boxed.** ₹249 / ₹449 / ₹699 until
**11 Sep 2026, 23:59 IST** (the night before NORCET 11 prelims), then list
price — and the date is real: it ends. No countdown widgets, no fake MRPs;
the launch cohort doubles as the testimonial pool and the 12-tester pool the
Play Console requires.

**Refunds — 7-day no-questions-asked**, one refund per account (disclosed),
self-serve request → gateway refund → entitlement revoke. Stated before
checkout (CPA 2019 / gateway-activation requirement per
[Legal & compliance baseline](t05-legal-compliance.md)); operationalized in
[Support & ops](t14-support-ops.md).

**Grandfathering** — the existing allowlisted user receives a free 12-month
entitlement (`source: 'grant'`), applied at cutover
([Launch sequencing & migration](t13-launch-sequencing.md)).

**Public content promise — exam-season weekly.** During exam seasons
(Jul–Sep, Feb–Apr): a new full mock every week plus continuous bank growth;
explicitly slower off-season. This is the bar
[Content engine & quality bar](t09-content-engine.md) must design the
pipeline to sustain — pricing promises nothing beyond it.

**Addendum (2026-07-31, from
[Launch sequencing & migration](t13-launch-sequencing.md)):** the launch-offer
window is now **30 days from actual paid go-live** — the true end date is
printed at launch and never moves. This supersedes the fixed "ends 11 Sep
2026" line, which held only in the launched-before-prelims scenario.
