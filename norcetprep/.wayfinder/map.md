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

- **Analytics & funnel instrumentation** — which product/revenue analytics and
  where they run; sharpens after
  [Platform & entitlement architecture](tickets/t07-platform-architecture.md).
- **Launch sequencing & migration** — cutover from the allowlist to real
  accounts, grandfathering the existing user, announcement plan; sharpens after
  pricing + architecture land.
- **Support & ops** — error-report triage, refund handling, doubt channels;
  sharpens after pricing + legal land.
- **rrbprep under the same roof** — how the extend-later architecture eventually
  absorbs the sibling site; sharpens after brand + architecture.

## Out of scope

- **Building the product** — this map ends where the build begins; execution runs
  on its own plan, fed by these decisions.
- **iOS / App Store** — mobile here means Play Store via PWA wrapper; iOS
  returns, if ever, as a fresh effort.
- **Live coaching / cohorts** — monetization is subscription content, not
  teaching time (ruled out at charting).
- **Multi-exam expansion execution** — the architecture stays extensible, but
  actually onboarding rrbprep or other exams is a future effort.
