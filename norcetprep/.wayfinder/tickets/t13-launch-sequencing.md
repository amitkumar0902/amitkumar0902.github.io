---
id: T13
title: Launch sequencing & migration
labels: [wayfinder:grilling]
status: open
assignee: none
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
