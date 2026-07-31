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
- **Build note (2026-07-31, Phase 1):** the free topic site — 20 topic pages,
  5 SEO pillar pages, the pages behind all 547 free MCQs — had been deleted by
  the earlier Mains-overhaul commit while the sitemap, docs, and CI still
  referenced it. Discovered during the Phase 1 build and restored wholesale
  from git history (commit 8275c45); validators restored and green. The free
  funnel every decision assumed now actually exists.
- **Hard timing** (research, 2026-07-31): NORCET 11 — registration closes
  13 Aug, Prelims 12 Sep, Mains 30 Sep 2026; biannual cadence puts the next
  demand wave ~Feb–Apr 2027. A web-first paid launch can catch NORCET 11; the
  Play app (~4–6 weeks incl. its 14-day tester soak) realistically lands for
  the 2027 wave.
- **Build note (2026-08-01, issues 01–13):** the whole PRD issue list is
  implemented repo-side. The legal gate is cleared (NORCET-9 rewritten to
  recall, official PDF out of the repo); citations are on all 5,742 questions
  and validator-enforced; 134 duplicate free questions were replaced and 292
  unverifiable year labels removed (both published in the fix-log). New:
  methodology + fix-log pages, daily quiz + streaks + restructured home,
  Telegram feeder, incident banner + self-serve refund + runbooks, Full Mock
  Test 1 as the free sample, origin stubs, TWA scaffold, and `go-live.mjs` —
  the flip as one command that refuses to run on a red gate. 46 tests and five
  gates run in CI. What remains is owner console work; `go-live.mjs --check`
  lists it.
- **Build note (2026-07-31, Phase 3):** paywall machinery built inert behind
  one flag (`js/paywall.js` `PAYWALL_ENABLED`) — entitlement gate + app-mode
  blackout, Firestore content routing + upload script, checkout pages +
  webhook function, GA4 funnel, free-only sw precache. In-build calls, all
  flagged in DEPLOY.md: app-mode persists per-session (TWA shares the
  browser's localStorage — a permanent flag would poison normal Chrome);
  Foundation notes = the open sample, no library mock marked free yet (owner
  call via `free: true` in mocks/index.json); day-page/cheatsheet inline HTML
  stays static and is guard-only at v1; diagram SVGs stay static per T07.
  Go-live = one documented commit (flag, live URLs, printed end date, hosting
  ignores, sw bump, allowlist retirement).

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
- [Support & ops](tickets/t14-support-ops.md) — printed SLAs: **48h replies,
  same-day payment/access issues, weekly fix-batch** into the public fix-log;
  email + in-product reports only, no doubt-solving (stated plainly); refund
  and payment-reconciliation runbooks; lightweight alarms (uptime ping,
  budget alert, webhook-failure alert) with a site-banner incident flag;
  deploy freeze 48h before exam dates.
- [Growth & distribution engine](tickets/t12-growth-engine.md) — **~5 h/week
  ceiling**; conversion lives on-product (daily quiz + streaks); feeders =
  automated Telegram daily-MCQ bot (backbone) + light Instagram diagram
  posts (explicitly droppable); v1 referral = shareable cutoff-anchored
  report cards, no monetary referrals; SEO orchestrator loop retargeted to
  nursedrill.com; analytics = GA4 via Firebase with a minimal funnel event
  set. NurseDrill stays a separate nursing-only product — the personal site
  carries none of it.
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
- [PRD: NurseDrill end-to-end product spec](tickets/t15-e2e-prd.md) — the
  destination materialized, twice over: the canonical
  [formal PRD](../../docs/prds/2026-08-01/nursedrill-e2e.md) (31 user
  stories w/ acceptance criteria, implementation + testing decisions) and
  its compact companion, the
  [status-tagged requirement register](assets/prd-nursedrill-e2e.md)
  (BUILT/CONSOLE/TODO/FEB-WAVE = the E2E gap list) — zero new decisions;
  sized for `plan-from-prd`/`issues-from-prd`.

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
