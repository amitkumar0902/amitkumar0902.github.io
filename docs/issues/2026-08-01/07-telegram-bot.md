# Issue 07 — Telegram daily-MCQ bot

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The automated feeder backbone (PRD user story 6): a NurseDrill-branded
Telegram channel plus a scheduled function that auto-posts the daily MCQ and
PYQ-of-the-day from the verified bank, each linking into the on-site daily
quiz. Near-zero marginal effort after setup — the bot, not the owner, keeps
the channel alive. Also the announcement line for weekly mocks and launch.

## Acceptance criteria

- [ ] A scheduled function posts once daily at a fixed IST time with no
      manual step; the posted MCQ matches that date's on-site quiz content.
- [ ] Every post links into the on-site quiz (conversion happens where the
      paywall is); posts carry no dark-pattern urgency.
- [ ] Bot token lives in secret config, never in the repo; a posting failure
      triggers an alert to the owner.
- [ ] Channel description carries the brand, the site link, and the AIIMS
      non-affiliation line; DMs auto-point to the support email.
- [ ] A manual "announce" path exists for weekly-mock and launch posts.

## Blocked by

- Blocked by [issue 06](06-daily-quiz-home.md) (posts link into the on-site
  daily quiz).

## User stories addressed

- User story 6 (Telegram feeder into the on-site funnel)
