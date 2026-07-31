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

## Decisions so far

<!-- the index — one line per closed ticket: gist + link; detail lives in the ticket -->

## Not yet specified

- **Growth & distribution engine** beyond the current SEO loop (Telegram /
  YouTube / influencer / referral motions) — sharpens after
  [Competitor & pricing landscape](tickets/t01-competitor-landscape.md) and
  [Brand, domain & trust](tickets/t08-brand-domain-trust.md).
- **Analytics & funnel instrumentation** — which product/revenue analytics and
  where they run; sharpens after
  [Platform & entitlement architecture](tickets/t07-platform-architecture.md).
- **Launch sequencing & migration** — cutover from the allowlist to real
  accounts, grandfathering the existing user, announcement plan; sharpens after
  pricing + architecture land.
- **Hindi / bilingual content** — whether language coverage is a differentiator
  worth building for; sharpens after competitor research.
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
