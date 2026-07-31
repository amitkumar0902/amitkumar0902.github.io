---
id: T04
title: Play Store path & billing policy
labels: [wayfinder:research]
status: open
assignee: none
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
