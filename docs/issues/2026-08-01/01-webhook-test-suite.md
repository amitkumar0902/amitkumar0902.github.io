# Issue 01 — Webhook function test suite

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Behavior-level tests for the one Cloud Function (the Razorpay webhook) — the
PRD's Testing Decisions flag it as the highest-value untested module. Stub the
Admin SDK; assert only external behavior: HTTP status returned to the gateway
and the resulting document states (user entitlement, payment audit). Runnable
with one command inside the functions package, no live Firebase needed.

## Acceptance criteria

- [ ] Bad/missing signature → 400, nothing written; valid signature verified
      over the raw body.
- [ ] Non-POST → 405; unknown event → 200 "ignored", nothing written.
- [ ] `payment.captured` with uid+plan notes → entitlement written with
      correct paid-until, plus a `granted` audit record.
- [ ] Duplicate delivery of the same payment id → 200, no second write
      (idempotency).
- [ ] Grant while a future expiry exists → extends from that expiry, never
      discards remaining days (validity stacking).
- [ ] Missing plan note → months resolved from the amount map (launch and
      list amounts); unknown amount → `unmatched`.
- [ ] Missing/unknown uid → 200 with an `unmatched` audit record, no
      entitlement write.
- [ ] `refund.processed` → entitlement revoked (paid-until now), audit marked
      refunded; duplicate refund → no-op; refund for unknown payment →
      `unmatched-refund` audit.
- [ ] Internal error → 500 (gateway retries are safe because grants are
      idempotent).

## Blocked by

None — can start immediately.

## User stories addressed

- User story 11 (instant, automatic, idempotent activation)
- User story 13 (refund revokes access)
