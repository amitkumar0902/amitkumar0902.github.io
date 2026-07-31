---
id: T07
title: Platform & entitlement architecture
labels: [wayfinder:grilling]
status: closed
assignee: amit
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

## Resolution

Decided 2026-07-31 in a grilling session with the owner. Forks chosen:
**Firebase all-in · Google + email/password auth · instant webhook unlock ·
no device limit (telemetry only)**. The architecture:

**Stack & hosting** — one Firebase project (Blaze) serves everything: Auth,
Firestore, a single Cloud Function, and Firebase Hosting bound to
**nursedrill.com** — free SEO pages and the gated app on one origin, so TWA
assetlinks, the auth session, and the conversion funnel all live together.
Deploys via a GitHub Action (`firebase deploy` on push) so the git-push
workflow survives. GitHub Pages keeps only the canonical/meta-refresh stubs at
old /norcetprep/ URLs (per [Brand, domain & trust](t08-brand-domain-trust.md)).
The README's plan to share one project across norcetprep + rrbprep stands.

**Auth** — Firebase Auth with Google sign-in + email/password; no phone OTP at
v1 (no SMS budget — revisit only if sharing telemetry demands it). On first
sign-in, local progress (`nm.v1.*`) merges into the user's Firestore doc using
the merge policies already written in js/sync.js; anonymous sync-codes retire
for signed-in users. The public allowlist gate (allowlist.js — which exposes
user emails in a public repo) is deleted.

**Entitlements** — validity plans reduce to timestamps (per
[India payments & recurring billing rails](t03-payments-rails.md)):

```
users/{uid}: {
  entitlements: {
    norcet: { paid_until: Timestamp, source: 'razorpay'|'play'|'grant',
              orderId, plan }
  },
  devices: { <deviceId>: { ua, lastSeen } }   // telemetry only, no enforcement
}
```

Clients read their own doc but can never write `entitlements` (evolving the
existing sketched rule that protected `isPaid` — the boolean becomes
per-product `paid_until`). Premium reads check
`entitlements.norcet.paid_until > request.time` via rules `get()`. `source`
means a future Play Billing grant (Digital Goods API, per
[Play Store path & billing policy](t04-play-store-path.md)) needs no schema
change; rrbprep later = `entitlements.rrb` + `content/rrb/**` and nothing else
moves — this also answers the "rrbprep under the same roof" fog
architecturally (onboarding it stays out of scope).

**Premium content** — leaves the public repo entirely (a public repo is a free
mirror of everything in it). Premium banks/mocks/notes move to Firestore under
`content/norcet/{bank|mocks|notes}/…`, chunked ~one doc per mock-section /
per-topic bank (≤1 MB and one read per chunk), gated by the entitlement rule.
Free content (topic MCQs, samples, SEO pages) stays static and crawlable. The
NORCET-9 verbatim replay must be rewritten (per
[Legal & compliance baseline](t05-legal-compliance.md)) before it enters the
paid store — content work owned by
[Content engine & quality bar](t09-content-engine.md).

**Checkout & unlock** — Razorpay (Cashfree fallback) hosted Payment Page per
plan; the site links out with the uid prefilled in `notes`. One HTTPS Cloud
Function receives `payment.captured`, verifies the webhook signature, maps
notes.uid → user doc, writes the entitlement plus a server-only
`payments/{orderId}` audit doc (collection already sketched in rules). Unlock
lands in seconds, 24/7. Edge cases (paid under another email, webhook missed):
support email + an owner-run reconciliation script against the gateway
dashboard at v1; a self-serve claim form is a fast-follow if tickets justify.

**App-mode blackout** (hard Play constraint) — TWA launches with
`start_url ?src=twa` (persisted) plus a `document.referrer ===
"android-app://<package>"` check. In app-mode: pricing routes and every buy
CTA render neutral "locked" copy with **no link-out** (India anti-steering);
checkout pages refuse app-mode sessions server-side. The same origin in a
normal browser keeps the full funnel.

**Offline / PWA** — sw.js precache shrinks to free assets + app shell (today
it precaches the entire premium bank — that ends). Premium content rides
Firestore offline persistence: entitled users keep cached banks/mocks readable
offline; entitlement re-evaluates on reconnect. Airplane-mode mock-taking
(the TWA review bar) is satisfied by shell + persisted content.

**Account deletion** (Play requirement) — `/account/delete` page + callable
function purging the Auth user, user doc, and device telemetry; URL declared
in the Play data-safety form.

**Cost envelope** — Blaze at launch scale ≈ ₹0–500/month (Firestore reads
dominate; one function; hosting within free tier). No fixed costs beyond the
domains.

Feeds: [Paywall & subscription UX prototype](t11-paywall-ux-prototype.md)
prototypes this flow; [Content engine & quality bar](t09-content-engine.md)
fills `content/norcet/**`; [Business & payment prerequisites](t10-business-prereqs.md)
runs gateway KYC against nursedrill.com;
[Pricing & packaging](t06-pricing-packaging.md) defines the SKUs the Payment
Pages carry.
