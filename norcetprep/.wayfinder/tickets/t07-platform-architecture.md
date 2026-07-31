---
id: T07
title: Platform & entitlement architecture
labels: [wayfinder:grilling]
status: open
assignee: none
blocked-by: [T03, T04]
---

## Question

How does a static-site product enforce paid access? Decide the v1 architecture:

- Real auth to replace the client-side allowlist (which also exposes user
  emails in a public repo): Firebase Auth — email link / password / phone OTP /
  Google — which, and why.
- Where premium content lives once it can no longer sit in the public repo:
  Firestore documents, Cloud Storage behind security rules, or a small API.
- Payment-webhook → entitlement-grant flow (Cloud Function?), and how the
  client checks entitlements (custom claims vs Firestore doc).
- What stays on GitHub Pages vs moves (Firebase Hosting on the custom domain?),
  and the PWA/offline implications for gated content.
- How the design satisfies the billing-policy constraints from
  [Play Store path & billing policy](t04-play-store-path.md) and the gateway
  realities from [India payments & recurring billing rails](t03-payments-rails.md).
- Extensibility: the same auth/entitlement/content schema must later absorb
  rrbprep and other exams (charting scope: NORCET-first, built to extend).
