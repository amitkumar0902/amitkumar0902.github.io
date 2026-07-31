---
id: T14
title: Support & ops
labels: [wayfinder:grilling]
status: closed
assignee: amit
blocked-by: []
---

## Question

Graduated from map fog once [Pricing & packaging](t06-pricing-packaging.md)
landed (legal baseline was already closed). Decide how a paid product is
operated by one person:

- Support surface: support email on nursedrill.com; what is explicitly
  offered (account/payment/content-error help) and explicitly not offered
  (doubt-solving/coaching — out of scope by charter).
- Error-report triage: the in-product report loop feeds the public fix-log
  (per [Brand, domain & trust](t08-brand-domain-trust.md)) — decide the
  triage cadence and the fix-SLA the methodology page states.
- Refund ops: the 7-day no-questions policy (per T06) as a runbook —
  self-serve request form → gateway refund → entitlement revoke.
- Payment reconciliation: the paid-under-another-email runbook (per
  [Platform & entitlement architecture](t07-platform-architecture.md)).
- Monitoring: uptime/quota alarms for exam-morning traffic spikes on
  Firebase; what pages a status notice appears on.
- The owner's honest weekly time budget for all of the above, season vs
  off-season — the number every SLA above must fit inside.

## Resolution

Decided 2026-07-31 in a grilling session with the owner — the map's final
decision ticket. All three forks to the recommended options: **48h reply ·
weekly fix-batch · email + in-product only · lightweight alarms**.

**Printed service levels** (on the contact page; fix cadence also on the
methodology page):
- Support replies within **48 hours**; **payment/access problems same-day** —
  those are revenue- and exam-critical.
- Error reports triage **weekly**, in the Thursday sitting shared with mock
  review; fixes land with the weekly publish, dated in the public fix-log.
- Principle: a looser number we keep beats a tighter one we miss.

**Channels & boundaries:**
- **support@nursedrill.com** + the in-product report-an-error buttons. One
  inbox, searchable.
- Telegram/Instagram DMs auto-point to email. No WhatsApp support, no support
  group at v1.
- **No doubt-solving** — stated plainly in the FAQ: content subscription, not
  coaching; that's how the price stays under ₹1,000. Report-an-error is not
  doubt-solving.

**Refund runbook** (policy per [Pricing & packaging](t06-pricing-packaging.md):
7-day no-questions, one per account):
1. Self-serve request from the account page, or email.
2. Owner processes in the gateway dashboard within 48h; money returns in 5–7
   business days (gateway timeline — stated on the policy page).
3. Entitlement revoked (`paid_until` → now); `refunded: true` on the user doc
   enforces one-per-account.
4. Confirmation email; refund count watched as a product-health metric.

**Reconciliation runbook** (paid under another email / webhook missed, per
[Platform & entitlement architecture](t07-platform-architecture.md)):
1. Email provides payment ID/UTR + account email.
2. Owner verifies in the gateway dashboard.
3. Manual grant (`source: 'grant'`, orderId noted) + audit entry in
   `payments/`.

**Monitoring & incidents:**
- Free uptime ping on nursedrill.com · Firebase Blaze **budget alert** ·
  **webhook-failure alert** (function error → email).
- Incident notice = site banner flipped via a Firestore flag + pinned
  Telegram post. No status page at v1.
- **Deploy freeze 48h before every prelims/mains date**; during the 12-day
  Mains window, hotfixes only.

**Time budget:** support + triage live inside the existing ~1.5–3 h/week ops
block (the same-day exception is rare by design); growth's ~5 h/week ceiling
stays untouched.

Feeds: the build plan (report form, refund-request UI, banner flag, alerts)
and go-live-day readiness in
[Launch sequencing & migration](t13-launch-sequencing.md).
