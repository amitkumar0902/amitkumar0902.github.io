---
labels: [wayfinder:map]
effort: monetize-norcetprep
created: 2026-07-31
---

# Map: Monetize NORCET Prep

## Destination

A locked, buildable spec for turning the free NORCET site into a subscription
product: pricing & packaging, platform architecture (real auth, payments,
server-enforced entitlements, protected premium content), an AI-drafted /
engineer-reviewed content engine with an explicit quality bar, brand + custom
domain, and a Play Store presence by wrapping the existing PWA. Every decision
resolved so the build can start without further debate; the build itself is
beyond this map.

## Notes

- Domain: Indian nursing-exam prep (AIIMS NORCET). Product today: static GitHub
  Pages site (~547 free topic MCQs + a premium-grade Mains toolkit: mocks, notes,
  flashcards, diagrams, toppers frequency analysis), PWA-ready (`manifest` + `sw.js`),
  Firebase sync scaffolded but **unconfigured** (placeholder config, local-only),
  client-side allowlist login only — no real auth, no payments.
- Locked at charting (2026-07-31): **subscription** model · **AI-drafted,
  engineer-reviewed** content · **NORCET-first, built to extend** to other nursing
  exams (rrbprep later) · mobile = **PWA wrapped for Play Store (TWA/Capacitor)**.
- Tracker: local markdown — conventions in [README](README.md); see the frontier
  with `node norcetprep/.wayfinder/frontier.mjs`.
- Grilling tickets: use the `interrogate` skill (stands in for /grilling in this
  environment) plus batched AskUserQuestion rounds. One ticket per session;
  research tickets exempt.
- This repo is **public** — the map and tickets are world-readable. Keep
  credentials, keys, and personal data out.
- **Hard timing** (research, 2026-07-31): NORCET 11 — registration closes
  13 Aug, Prelims 12 Sep, Mains 30 Sep 2026; biannual cadence puts the next
  demand wave ~Feb–Apr 2027. A web-first paid launch can catch NORCET 11; the
  Play app (~4–6 weeks incl. its 14-day tester soak) realistically lands for
  the 2027 wave.

## Decisions so far

<!-- the index — one line per closed ticket: gist + link; detail lives in the ticket -->

- [Competitor & pricing landscape](tickets/t01-competitor-landscape.md) — the
  wedge is an empty **₹500–₹1,500/yr specialist slot** between ₹299–₹649
  commodity mega-bundles (Adda247/Testbook) and ₹8k–33k video coaching
  (Nursing Next Live/NPrep); differentiate on Mains/Stage-II depth,
  explanation-first QBank, transparent pricing, English-first option; Telegram
  is the market's funnel *and* its piracy engine — video is the least
  defensible asset, a live QBank the most.
- [NORCET exam calendar & market size](tickets/t02-exam-calendar-market.md) —
  NORCET 11: reg closes 13 Aug, Prelims 12 Sep, Mains 30 Sep 2026; locked
  biannual cadence (next wave ~Feb–Apr 2027); ~92k prelims candidates and
  growing; repeat attempts the norm.
- [India payments & recurring billing rails](tickets/t03-payments-rails.md) —
  sell **validity plans** (one-time 3/6/12-month access) via hosted payment
  pages, not auto-recurring; apply to Razorpay + Cashfree in parallel
  (Easebuzz backup); individual KYC needs PAN/Aadhaar/bank name-match, policy
  pages, and preferably a custom domain.
- [Play Store path & billing policy](tickets/t04-play-store-path.md) — wrap as
  **TWA (Bubblewrap), consumption-only app**: all selling happens on the web
  (~2% PSP vs 15% Play); app-mode shows zero purchase UI and zero checkout
  links; needs `.nojekyll` + assetlinks at the origin root, 12 testers ×
  14 days, target API 36, an account-deletion flow; ~4–6 weeks to listed.
- [Launch sequencing & migration](tickets/t13-launch-sequencing.md) —
  **two-gate season plan**, incremental KYC-first cutover: Phase 1 by 7 Aug
  (domain + current site on Firebase Hosting + policy pages → apply to both
  gateways, create Play account), Phase 2 by 21 Aug (free accounts +
  grace-overlap migration of the allowlisted user), Phase 3 by 31 Aug
  (paywall machinery) = the checkpoint; green → paid live ~5 Sep, hard gate
  18 Sep (Mains window), red → founding waitlist + paid Jan 2027; launch
  offer amended to 30-days-from-go-live; allowlist retired only at paid
  go-live.
- [Paywall & subscription UX prototype](tickets/t11-paywall-ux-prototype.md) —
  **signed off with no changes — the product spec is locked**: clickable
  prototype of the full money path (free funnel → plans → auth → Razorpay
  hand-off → instant unlock → premium library → account) including the TWA
  app-mode blackout; copy register locked to confident honesty; the prototype
  ([asset](assets/prototype-paywall.html)) is the UX reference for the build.
- [Content engine & quality bar](tickets/t09-content-engine.md) — launch bar =
  **harden what exists, no volume push**: NORCET-9 rewritten to recall style
  (+ the official PDF unpublished), layered gates (validators → cross-model
  refutation → human review of flagged + 20% sample → mandatory source
  citation) run over the full 1,569-question bank and every paid mock;
  sister-exam mocks ship as unadvertised bonus; season promise met by the same
  pipeline at ~1.5–3 h/week human review; English-first with a translations
  slot reserved in the schema.
- [Pricing & packaging](tickets/t06-pricing-packaging.md) — free = topic MCQs
  + daily quiz + current public mocks + Mains samples; paid = full mock
  library + complete Mains toolkit + analytics; SKUs **₹299/3-mo · ₹599/6-mo ·
  ₹999/12-mo** one-time validity (all-inclusive, no auto-renew); launch price
  ₹249/₹449/₹699 for the first 30 days from go-live (T13 addendum — end date
  printed at launch, never moved); 7-day no-questions refund (one
  per account); existing allowlisted user grandfathered 12 months; public
  promise = exam-season weekly mock + growing bank.
- [Platform & entitlement architecture](tickets/t07-platform-architecture.md) —
  **Firebase all-in on nursedrill.com**: Auth (Google + email/password),
  Firestore, one webhook Cloud Function, Hosting deployed by GitHub Action;
  entitlements = per-product `paid_until` timestamps on `users/{uid}`
  (dual-source-ready, rrb-extensible); premium content moves from the public
  repo into rules-gated Firestore; hosted Payment Pages → instant webhook
  unlock; app-mode shows zero purchase paths; sw precache trims to free
  content; account-deletion flow added; no device limits, telemetry only.
- [Brand, domain & trust](tickets/t08-brand-domain-trust.md) — brand =
  **NurseDrill**: nursedrill.com primary + .in parked, **buy urgently**
  ("norcetprep" .com/.in was sniped by one actor on 28 May 2026); product
  lines keep "NORCET" in titles; trust = transparent solo builder +
  methodology page + public fix-log, quiet on tooling, no dark patterns,
  AIIMS disclaimers; old URLs migrate via canonical stubs + GSC
  change-of-address.
- [Legal & compliance baseline](tickets/t05-legal-compliance.md) — lawful to
  charge with **no GST under ₹20L** turnover; before the paywall: rewrite the
  verbatim NORCET-9 replay into reworded recalls (exam papers are copyrighted;
  AIIMS asserts it), publish T&C/Privacy/Refund/Contact pages, make cancelling
  as easy as signing up; DPDP duties start 13 May 2027; prominent "not
  affiliated with AIIMS" everywhere.

## Not yet specified

*(empty — everything visible is ticketed; new fog gets written here as it
appears)*

## Out of scope

- **Building the product** — this map ends where the build begins; execution runs
  on its own plan, fed by these decisions.
- **iOS / App Store** — mobile here means Play Store via PWA wrapper; iOS
  returns, if ever, as a fresh effort.
- **Live coaching / cohorts** — monetization is subscription content, not
  teaching time (ruled out at charting).
- **Multi-exam expansion execution** — the architecture stays extensible, but
  actually onboarding rrbprep or other exams is a future effort.
