---
id: T04
title: Play Store path & billing policy
labels: [wayfinder:research]
status: closed
assignee: research-agent
blocked-by: []
---

## Question

What exactly does it take to ship the existing PWA as a Play Store app, and
what does Google's billing policy imply for a subscription product? Cover:

- **Wrapper path**: TWA (Bubblewrap / PWABuilder) vs Capacitor — trade-offs for
  a site that is already a PWA (`manifest.webmanifest` + `sw.js` exist); the
  PWA quality bar TWA demands (Lighthouse, offline behavior, HTTPS / custom
  domain implications).
- **Play Console mechanics**: developer account cost/verification, target API
  level requirements, data-safety form, review timelines.
- **Billing policy — the critical part**: when Google Play Billing is mandatory
  for digital subscriptions sold in-app, current service-fee tiers, and what
  the policy says today about an app that only *unlocks* entitlements purchased
  on the web (login-only / "consumption-only" behavior) without offering
  in-app purchase.

Deliverable: recommended wrapper path + the billing-policy constraints that
[Platform & entitlement architecture](t07-platform-architecture.md) must
satisfy, as an asset file.

## Resolution

Wrapper: **TWA via Bubblewrap** (PWABuilder as GUI) — reuses the existing PWA as-is; Capacitor
adds a second native project for no gain. Needs `assetlinks.json` at the origin root
`amitkumar0902.github.io/.well-known/` — repo controls the root but has **no `.nojekyll`**, so
Jekyll would drop the dot-directory (must add). Billing: Google's Payments policy (verified
2026-07-31) **explicitly allows consumption-only apps** ("log in … access content paid for
somewhere else"), so ship login-only and sell on the web (~2% PSP) — but anti-steering still
applies in India: **in app-mode, zero purchase UI and zero links to web checkout** (an embedded
Razorpay checkout inside the TWA = Play Billing violation; this is T07's hard constraint).
Selling in-app instead would cost 15% (India legacy subs rate) or 11% via India user-choice
billing + PSP + 24h reporting; Epic-settlement cuts (10%+5%, eff. 2026-06-30) are US/UK/EEA
only until ~Sept 2027. Play Console: $25 + ID verification, **12 testers × 14 days** for new
personal accounts, target API 36 from 2026-08-31, data-safety form, **account-deletion flow
required** (login exists), ~4–6 weeks end-to-end. [full findings](../assets/research-play-store-path.md)
