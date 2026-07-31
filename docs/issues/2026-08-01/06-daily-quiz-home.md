# Issue 06 — Daily quiz + streaks + home restructure

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

The on-product conversion engine (PRD user story 3) and the home layout that
hosts it: a daily 10-question quiz drawn deterministically from verified bank
questions, a streak counter, PYQ-of-the-day, and the product home restructured
to the Clinical Excellence design source (exam strip, daily-quiz hero, free
subject-bank grid, locked premium tiles) — replacing the current 13-day-plan
hub as the landing experience. Wire the two reserved analytics events.

## Acceptance criteria

- [ ] The quiz serves the same 10 questions to everyone for a given IST date
      (deterministic seed), drawn only from verified questions; each question
      shows explanation + citation + report control after answering.
- [ ] Streak increments at most once per day, persists for anonymous users,
      and survives sign-in via the existing progress merge; a
      PYQ-of-the-day is surfaced on the home.
- [ ] `quiz_start` and `quiz_complete` analytics events fire (completing the
      six-event funnel's reserved pair).
- [ ] Home matches the design source's structure in light and dark: exam
      strip with the real next exam date, quiz card with streak, free banks
      grid with counts, locked Mains-toolkit tiles with honest unlock CTAs —
      and renders correctly in app-mode (no purchase UI).
- [ ] Works signed-out end-to-end; no regression to study-app navigation
      (existing pages remain reachable).

## Blocked by

None — can start immediately. (Draws on currently-verified questions; full
bank coverage arrives with [issue 04](04-full-bank-verification-run.md).)

## User stories addressed

- User story 3 (daily quiz + streaks on-product)
- User story 29 (funnel events complete)
