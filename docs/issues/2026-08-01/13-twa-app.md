# Issue 13 — Android TWA app (Feb-2027 wave)

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Ship the PWA as a consumption-only Play Store app for the Feb–Apr 2027 demand
wave (PRD user stories 22–23): Bubblewrap TWA bound to the nursedrill.com
origin, the closed-test soak, and a listing that passes Play's policy bar.
Selling stays on the web; the app shows zero purchase UI (the client-side
app-mode blackout is already built — this slice proves it end-to-end on
device).

## Acceptance criteria

- [ ] `assetlinks.json` served at the origin root and verified (no URL-bar
      chrome in the installed app); target API level meets the current Play
      requirement.
- [ ] App-mode compliance audit on device: from a fresh install, no screen
      reachable shows a price, a plan, an unlock CTA, or any link to
      pricing/checkout; locked content shows neutral copy + sign-in only;
      a web-purchased account unlocks premium in the app.
- [ ] Same account, progress, entitlements, and airplane-mode reading as the
      web (one codebase — no separate native logic).
- [ ] Play Console complete: data-safety form, in-listing privacy policy,
      account-deletion URL declared; the 12-tester × 14-day closed test run
      and passed.
- [ ] Production listing live ahead of the Feb 2027 wave; listing copy
      carries the AIIMS non-affiliation line and no false-authority claims.

## Blocked by

- Blocked by [issue 10](10-go-live-flip.md) (a stable paid product on a
  stable domain precedes the wrapper; the TWA binds to that origin).

## User stories addressed

- User story 22 (same product as a Play app)
- User story 23 (consumption-only compliance)
