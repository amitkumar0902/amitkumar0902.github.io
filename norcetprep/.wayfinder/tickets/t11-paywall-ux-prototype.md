---
id: T11
title: Paywall & subscription UX prototype
labels: [wayfinder:prototype]
status: closed
assignee: amit
blocked-by: [T06, T07]
---

## Question

Make the paid experience concrete enough to react to before anything is built:
a rough clickable flow — landing → account creation (replacing the allowlist
gate) → free content with paywall touchpoints → plan picker → checkout hand-off
→ unlocked premium state — plus the app-wrapper variant if
[Play Store path & billing policy](t04-play-store-path.md) constraints change
what the app may show. React with the owner, iterate once, link the prototype
as the asset.

Sign-off here is the map's convergence point: after it, the spec is locked and
the build can start.

## Resolution

Resolved 2026-07-31. The owner clicked through the prototype and **signed off
with no changes** — the map's convergence point is reached and the product
spec is locked.

**The prototype (the asset)**:
[prototype-paywall.html](../assets/prototype-paywall.html), also published for
click-through as a private artifact at
<https://claude.ai/code/artifact/3fbd8818-856a-49f3-9673-d7c1e45fcf20>.
A single-file simulation of the entire money path with a simulator rig
(browser vs TWA app-mode · signed-out / free / premium · per-decision
annotations): landing & free funnel (daily quiz, 547-MCQ banks, locked Mains
tiles) → plan picker (₹249/449/699 launch → ₹299/599/999, honesty block,
refund / no-auto-renew / all-inclusive lines) → Google/email auth with the
progress-merge note → Razorpay hand-off → instant-unlock success → premium
mock library (weekly-drop banner, recall-labelled NORCET-9, cutoff-anchored
report) → account (devices without limits, refund entry, delete-account) →
methodology page + public fix-log → and the TWA app-mode blackout (zero
purchase paths; neutral locked copy + sign-in only).

**Confirmed by reaction**:
- **Copy register locked: confident honesty.** The wry anti-dark-pattern
  voice ("won't come back by popular demand"; "ships late, never unreviewed")
  stays — it is the differentiation, per
  [Brand, domain & trust](t08-brand-domain-trust.md).
- No screen changes requested. The prototype is the UX reference for the
  build.

The spec is locked across brand (T08), architecture (T07), pricing (T06),
content engine (T09), and this UX. Remaining map work is operational:
[Growth & distribution engine](t12-growth-engine.md),
[Launch sequencing & migration](t13-launch-sequencing.md),
[Support & ops](t14-support-ops.md), and the real-world
[Business & payment prerequisites](t10-business-prereqs.md).
