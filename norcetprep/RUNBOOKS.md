# NurseDrill runbooks

The procedures a solo operator needs at 11pm without thinking. Printed SLAs
(from the support decisions) are the constraint every runbook below is written
to keep:

| Promise | Where it is printed |
|---|---|
| Replies within **48 hours** | `legal/contact.html` |
| Payment and access problems fixed **same day** | `legal/contact.html`, `legal/refund.html` |
| Fixes batched **weekly** into the public fix-log | `methodology.html`, `fix-log.html` |
| Refund processed within **48h**, money back in **5–7 business days** | `legal/refund.html`, account page |
| **No doubt-solving** — reports are for errors in questions | `legal/contact.html`, report modal |
| **Deploy freeze 48h before every exam date** | below |

---

## 1. Refund

Intake is self-serve: the account page shows a refund request inside the 7-day
window (one per account), which writes to `refundRequests/{id}` with the
order reference. Email requests are equally valid — same steps.

1. **Find the payment.** Razorpay dashboard → Payments → search the order or
   payment reference from the request. Confirm the amount and the account
   email.
2. **Check eligibility.** Within 7 days of the grant, and the account has not
   used its one refund. Both are visible on the request document
   (`createdAt`, `paidUntil`) and on `users/{uid}`.
3. **Refund in the dashboard.** Full refund. The gateway fires
   `refund.processed`.
4. **Verify revocation.** The webhook sets `paid_until` to now and marks the
   payment audit `refunded`. Confirm on `users/{uid}` — the account page should
   read "Free tier" on their next load.
5. **Mark the one-per-account flag** so a second refund is refused:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
     node norcetprep/scripts/grant-entitlement.mjs --email <their-email> --mark-refunded
   ```
6. **Reply** within 48h: refunded, 5–7 business days to appear, no questions
   asked. Do not ask them to reconsider — that is the dark pattern the whole
   product refuses.

If the webhook did not revoke (function down, event missed), revoke by hand
with `grant-entitlement.mjs --email <email> --months 0` and note it in the
audit record.

## 2. Payment that never unlocked (reconciliation)

Symptom: "I paid and nothing happened." Same-day SLA.

1. **Look for the audit record.** Firestore `payments/{paymentId}`. Status
   tells you what happened:
   - `granted` — the grant went through; the user is probably signed into a
     different account. Compare `email` on the audit with their account email.
   - `unmatched` — the payment arrived without a usable `uid` (someone opened
     the payment page directly, or edited the URL). This is the common case.
   - *missing entirely* — the webhook never received it. Check the Razorpay
     dashboard → Webhooks → delivery log, and the function logs.
2. **Grant by hand**, recording where it came from:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
     node norcetprep/scripts/grant-entitlement.mjs \
       --email <their-account-email> --months <3|6|12> --order <paymentId>
   ```
3. **Confirm with them** that access is live, and tell them plainly what went
   wrong. If it was our fault, say so.
4. If `unmatched` records appear more than once in a week, the payment page's
   `uid` field is broken — check that all three Payment Pages still carry the
   custom fields named exactly `uid` and `plan`.

## 3. Incident (site down, checkout broken, wrong content live)

1. **Raise the banner** — visible to everyone, signed in or not, in the app too:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccount.json \
     node norcetprep/scripts/incident.mjs raise "Checkout is failing on UPI. We're fixing it — no one is charged twice."
   ```
2. **Pin the same note** in the Telegram channel (the manual `announce`
   endpoint — see §5). There is no status page at v1, by decision.
3. Fix it. During the Mains window, hotfixes only — nothing else ships.
4. **Clear the banner** and post the all-clear:
   ```bash
   node norcetprep/scripts/incident.mjs clear
   ```
5. If it touched content correctness, it belongs in the public fix-log
   (`data/fix-log.json`) the same day.

## 4. Weekly content triage (the fix cadence)

Fixed weekday, ~1.5–3 h. This is the loop the methodology page describes, so
it has to actually run.

1. **Read the reports.** Firestore `reports/` — user-filed, newest first.
2. **Run the gates** over anything touched, plus whatever is newly drafted:
   ```bash
   node norcetprep/scripts/validate-questions.mjs
   node norcetprep/scripts/verify-questions.mjs norcetprep/data/questions/*.json
   node norcetprep/scripts/verify-questions.mjs norcetprep/data/mains/mocks/mock-*.json
   ```
   The flag queue lands in `data/mains/_audit/flag-queue.json`.
3. **Review 100% of flags** plus a 20% random sample of what passed.
4. **Fix, then log.** Every correction gets an entry in `data/fix-log.json`
   (date, where, what was wrong, what changed, found_by). Reported errors get
   a reply too.
5. **Publish**: commit, push (hosting deploys), and if premium content changed:
   ```bash
   GOOGLE_APPLICATION_CREDENTIALS=… node norcetprep/scripts/upload-content.mjs --write
   ```
6. **If a weekly mock fails its gates, it ships late.** Say so on Telegram.
   That is policy, not aspiration.

## 5. Telegram

The daily MCQ posts itself (`dailyTelegramPost`, 07:30 IST). Manual posts —
weekly mock, launch, incident all-clear:

```bash
curl -X POST https://asia-south1-<project>.cloudfunctions.net/announce \
  -H 'content-type: application/json' \
  -H "x-announce-key: $ANNOUNCE_KEY" \
  -d '{"text":"This week'\''s full mock is live. 160 Q, 180 minutes, exam scoring."}'
```

If the daily post fails, the function logs `ALERT nursedrill` and the
log-based alert emails you (§6). Posting failures are not urgent — fix at the
next sitting; a missed day is not an incident.

## 6. Alarms — console setup

One-time, in the Firebase/GCP console. Everything here exists so failures reach
the owner from a monitor rather than from an angry user.

1. **Webhook / function failure → email.**
   Cloud Logging → Logs Explorer → query:
   ```
   resource.type="cloud_run_revision"
   (severity>=ERROR OR textPayload:"ALERT nursedrill")
   ```
   → *Create alert* → notification channel = your email → 5-minute window.
2. **Billing budget.** GCP Billing → Budgets & alerts → monthly budget ₹1,000
   with alerts at 50 / 90 / 100%. The cost envelope at launch scale is
   ₹0–500/month; anything above that means something is wrong, not popular.
3. **Uptime ping.** GCP Monitoring → Uptime checks → `https://nursedrill.com/`
   every 5 minutes, alert after two consecutive failures, same email channel.
   Add a second check on `/pricing.html` — the money path deserves its own.
4. **Optional chat alert.** Set `ALERT_WEBHOOK_URL` in the functions
   environment to post failures into a chat webhook as well as the logs.

## 7. Deploy freeze

**No deploys in the 48 hours before any exam date**, and hotfixes only during
the 12-day Mains window. First freeze: 10–12 Sep 2026 (NORCET 11 Prelims), then
28–30 Sep (Mains).

Freezing means: no pushes to `main` that touch `norcetprep/**` (the hosting
Action deploys on push), no content uploads, no Firestore rule changes. Queue
the work; it will keep.
