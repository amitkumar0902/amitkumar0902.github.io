# Issue 08 — Ops kit: incident banner, refund request, alarms

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The operational plumbing the support decisions promised (PRD user stories 13,
27, 28): a site-wide incident banner togglable via a remote flag, a self-serve
refund request entry on the account page, and the alarm wiring (webhook
failure, billing budget, uptime) with its console steps added to the deploy
runbook.

## Acceptance criteria

- [ ] Flipping a remote flag shows a site-wide incident banner (all page
      families, both themes, app-mode included) within minutes; clearing it
      removes the banner. Readable by signed-out visitors.
- [ ] Account page offers a refund request for an active entitlement inside
      the 7-day window: captures the order reference, records a request the
      owner can act on, confirms with the honest timeline copy (processed
      within 48h; money back in 5–7 business days), and reflects the
      one-per-account rule.
- [ ] A webhook/function failure produces an email alert to the owner;
      budget-alert and uptime-ping setup are documented as console steps in
      the deploy runbook.
- [ ] The refund runbook (gateway refund → entitlement revoke → confirmation)
      is documented end-to-end with the new request surface as its intake.
- [ ] Nothing here contradicts the printed SLAs (48h replies, same-day
      payment/access issues).

## Blocked by

None — can start immediately.

## User stories addressed

- User story 13 (self-serve refund)
- User story 27 (SLAs and runbooks)
- User story 28 (alarms and incident banner)
