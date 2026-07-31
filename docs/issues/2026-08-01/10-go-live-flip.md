# Issue 10 — Go-live flip

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Execute the launch (PRD user stories 10, 11, 15, 24, 30): verify the
entitlement flow end-to-end in gateway test mode (the checkpoint gate), then
take the paywall live with the single documented flip commit. This slice is
the moment the product starts charging — everything in it is the deploy
runbook's "Go-live flip" section made real.

## Acceptance criteria

- [ ] Test-mode E2E pass recorded: sign-in → checkout → test payment →
      webhook grant within seconds → premium mock opens → dashboard refund →
      entitlement revoked.
- [ ] The grandfathered user's account is verified working (12-month grant
      visible, progress intact) **before** the allowlist is removed.
- [ ] One commit contains all flip elements: paywall flag on; live-mode
      payment page URLs; pricing status block rewritten with the printed
      offer end date (launch + 30 days — printed once, never moved); premium
      statics excluded from product-domain hosting; service-worker cache name
      bumped; legacy allowlist retired (gate code removed, login/signup
      surfaces point at the account page).
- [ ] Post-flip smoke on the live domain: premium pages wall correctly for
      signed-out visitors, the sample mock still runs free, checkout charges
      live mode, purchase unlocks, analytics events flow.
- [ ] Launch announcement per the locked plan: pricing page carries the
      honesty block; site banner greets returning visitors; Telegram
      announcement; no countdown anywhere.

## Blocked by

- Blocked by [issue 01](01-webhook-test-suite.md) (webhook confidence before
  real money).
- Blocked by [issue 02](02-norcet9-recall-rewrite.md) (the legal gate).
- Blocked by [issue 04](04-full-bank-verification-run.md) (verification
  coverage is part of the launch bar).
- External (owner console, tracked outside these issues): domains + Firebase
  config + at least one gateway activated + payment pages created — the
  *Business & payment prerequisites* facts.

## User stories addressed

- User story 10 (checkout), 11 (instant unlock), 15 (grandfathered user
  protected), 24 (one-flag go-live), 30 (launch gates honored)
