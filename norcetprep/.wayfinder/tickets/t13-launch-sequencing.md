---
id: T13
title: Launch sequencing & migration
labels: [wayfinder:grilling]
status: closed
assignee: amit
blocked-by: []
---

## Question

Graduated from map fog once [Pricing & packaging](t06-pricing-packaging.md)
landed (architecture was already decided). Decide the cutover from today's
allowlist-gated static site to the paid NurseDrill product — against the hard
12 Sep 2026 NORCET 11 window:

- Cutover order and dates: domain live → Firebase deploy → auth launch →
  paywall on → old-URL stubs + Search Console change-of-address. What ships
  first if time runs short — the deliberate fallback scope.
- Go/no-go: the criteria for catching NORCET 11 with a paid launch versus
  soft-launching free now and monetizing into the Feb 2027 wave.
- The existing allowlisted user: apply the free 12-month grant (decided in
  T06), personal comms, and a progress-migration check on first sign-in.
- Allowlist retirement: signup.html / FormSubmit access-request flow replaced
  by real accounts — any transition window for pending requesters.
- Announcement mechanics: where launch is announced (aligned with
  [Growth & distribution engine](t12-growth-engine.md)) and how the
  launch-price end date (11 Sep) is communicated honestly — it must actually
  end.

## Resolution

Decided 2026-07-31 in a grilling session with the owner. All four forks to the
recommended options: **two-gate plan · incremental KYC-first cutover · grace
overlap · first-30-days offer rule**.

**The phased calendar** (2026; each phase independently shippable):

*Phase 1 — "a real business exists" (target: by 7 Aug).* Buy nursedrill.com +
.in; Firebase project live; Firebase Hosting serves the **current site
unchanged** on nursedrill.com; publish T&C / Privacy / Refund / Contact + a
static pricing page; canonicals flip to nursedrill.com; Search Console
change-of-address filed; old github.io URLs get stubs. **Then immediately**:
apply to Razorpay AND Cashfree — the high-variance external clock starts now,
against a real domain with policy pages — and create the Play developer
account (verification starts; the app itself stays Feb-wave scope per the
map). Phase 1 is most of
[Business & payment prerequisites](t10-business-prereqs.md)' checklist —
that task completes alongside it.

*Phase 2 — accounts open (target: by 21 Aug).* Google + email/password auth
live; free accounts open to everyone (season users get captured regardless of
gate outcomes); local progress merges on first sign-in. **Grace overlap**: the
existing allowlisted user is onboarded personally — account created together,
free 12-month grant applied, progress verified — while the old allowlist
login keeps working in parallel; pending FormSubmit requesters get an email
invite. In parallel: the NORCET-9 rewrite batch (legal gate) and the backlog
verification pipeline run.

*Phase 3 — paywall machinery (target: by 31 Aug — the checkpoint).* Premium
content moved to Firestore; entitlement rules live; checkout pages + webhook
function deployed and end-to-end tested; sw precache trimmed; account/delete
pages done.

**The gates:**
- **Checkpoint 31 Aug** — green requires: (1) at least one gateway activated,
  (2) NORCET-9 rewritten + official PDF unpublished, (3) entitlement flow
  verified end-to-end.
- **Green** → paid go-live ~**5 Sep** (buffer before Prelims 12 Sep).
- **Yellow** (partially met) → paid go-live by the **18 Sep hard gate** —
  prelims-results day, opening the 12-day Mains window, the product's core
  buyer moment.
- **Red** (no gateway active, or legal gate unfinished) → **fallback mode**:
  free accounts + a founding waitlist through the season ("founding members
  lock launch pricing"); paid flips on in **Jan 2027**, ahead of the Feb
  wave. The waitlist honors ₹249/449/699.

**Offer window (amends Pricing & packaging):** the launch price runs **30 days
from actual paid go-live**; the true end date is printed at launch and never
moves. The fixed "11 Sep" line is superseded — dated addendum added to
[Pricing & packaging](t06-pricing-packaging.md).

**Allowlist retirement:** the old gate is removed at paid go-live — never
before the existing user's account is verified working. Nobody preparing for
NORCET 11 loses access mid-season.

**Announcement (launch moment only — the growth machine belongs to
[Growth & distribution engine](t12-growth-engine.md)):** quiet-confident. The
pricing page carries the honesty block; an on-site banner greets returning
visitors; outreach posts go through the existing .orchestrator loop
(Telegram/Quora templates); no paid promotion until T12 decides channels. The
launch-price end date appears exactly once — on the pricing page — and no
countdown widget exists anywhere.

Feeds: [Business & payment prerequisites](t10-business-prereqs.md) (Phase 1
is its sequenced checklist), [Growth & distribution engine](t12-growth-engine.md)
(fallback waitlist copy + channels), [Support & ops](t14-support-ops.md)
(go-live-day readiness).
