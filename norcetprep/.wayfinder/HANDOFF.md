# HANDOFF — NurseDrill (norcetprep monetization)

Updated 2026-08-01, after the build session that implemented all 13
tracer-bullet issues. Audience: the next agent (or a future session) picking
this up cold.

## What this is

The free NORCET prep site (`norcetprep/`) is now **NurseDrill** — a paid,
validity-plan nursing-exam product for **nursedrill.com**, later wrapped as a
Play Store TWA. The plan was charted as a wayfinder map and **every decision is
resolved**; the build is done repo-side.

**Read in this order before doing anything:**
1. [map.md](map.md) — destination and all decisions (the index).
2. The ticket that covers your task (`tickets/*.md`); assets under `assets/`
   hold the research and the signed-off prototype.
3. [../DEPLOY.md](../DEPLOY.md) — the console runbook, phase by phase, ending
   in the one-command go-live flip.
4. [../RUNBOOKS.md](../RUNBOOKS.md) — refund, reconciliation, incident, weekly
   triage, alarms, deploy freeze.
5. [README.md](README.md) — tracker conventions.

## State of the world (2026-08-01)

**Planning: 13 of 14 tickets closed.** The only open one is
[Business & payment prerequisites](tickets/t10-business-prereqs.md) — owner-side
facts (domains, gateway KYC, Play account). When those land, record a
`## Resolution`, close it, add the map index line, and the map is complete.

**Build: everything in the PRD's issue list is implemented.** The 13 issues at
`docs/issues/2026-08-01/` are all done; the requirement register
([assets/prd-nursedrill-e2e.md](assets/prd-nursedrill-e2e.md)) carries the
current per-requirement status. In short:

- **Legal gate cleared.** All 121 NORCET-9 items are memory-based recall in our
  own words, with citations; the official PDF is out of the repo and
  gitignored; no "verbatim"/"official paper" claim survives on any served page.
- **Content hardened.** Citations on all 5,742 questions, validator-enforced.
  283 explanation holes filled. 134 duplicate free questions replaced with real
  ones and 292 unverifiable year labels removed — both logged publicly. Three
  confirmed answer-key errors fixed.
- **Trust surfaces live**: `methodology.html`, `fix-log.html` (data-driven,
  9 seeded entries), footers wired site-wide via `js/site-chrome.js`.
- **Daily quiz + streaks + new product home**, deterministic by IST date.
- **Telegram feeder** (`functions/daily-post.js`), selecting identically to the
  site — with a contract test proving it.
- **Ops kit**: incident banner (`config/site` + `scripts/incident.mjs`),
  self-serve refund on the account page, runbooks, alarm console steps.
- **Sample designated**: Full Mock Test 1 is free, wired through all five
  layers that must agree.
- **Go-live is one command**: `scripts/go-live.mjs` (`--check` / dry run /
  `--write` / `--write --rollback`). It refuses to flip on a red gate.
- **Migration and app**: `js/origin-stub.js` (armed by the flip),
  `.well-known/assetlinks.json`, `android/README.md` with the on-device
  consumption-only audit.

**Test and gate coverage** — all green, all in CI:
```
npm --prefix functions test                       # 29 — webhook + Telegram
node --test norcetprep/test/frontend.test.js      # 17 — paywall, routing, quiz
node norcetprep/scripts/validate-questions.mjs    # 5,742 questions
node norcetprep/scripts/check-index-counts.mjs    # printed counts vs data
node norcetprep/scripts/check-links.mjs           # 1,099 local references
node norcetprep/scripts/verify-questions.mjs --golden --static-only
```

**NOTHING HAS BEEN PUSHED.** ~25 local commits sit on `main`. Pushing
(a) updates the live github.io site immediately and (b) publishes this tracker
in a **public repo**. The owner knows; confirm before pushing anyway.

## What is left

Everything remaining is **owner-side**, and `go-live.mjs --check` names it:

1. **Console steps** in DEPLOY.md — domains, Firebase project + config,
   gateway KYC and Payment Pages, functions deploy, content upload, GA4 id,
   Telegram bot secrets, the three alarms.
2. **Paste the live Razorpay page URLs** into `js/payments-config.js` by hand.
   The flip script deliberately refuses to do this one.
3. **Run the model gate over the bank**: `verify-questions.mjs` needs an
   `OPENAI_API_KEY` or `GEMINI_API_KEY` (it refuses the drafting family). The
   consistency gate runs without one and is green.
4. **Review the flag queues** in `data/mains/_audit/` — 13 items the NORCET-9
   rewrite flagged as clinically arguable, 32 from the free-bank sweep. None
   are known errors; they are judgement calls.
5. **Test-mode E2E** (checkpoint gate 3), then the flip.
6. **Close T10** when the facts exist.

## Landmines & non-obvious context

- **The free topic site had been deleted** once (commit `77b9b63`) and restored
  in `8275c45`. If something references a page that 404s, check git history
  before assuming it never existed. `check-links.mjs` now guards this.
- **`js/core.js`'s legacy gate is intentionally origin-keyed** — it disarms on
  nursedrill.com by design and is removed entirely by the go-live flip. Don't
  "fix" it in the meantime.
- **norcetprep.com AND .in were sniped** on 2026-05-28. Never build equity
  under that name. nursedrill.com is the brand everywhere.
- **App-mode lives in sessionStorage on purpose** — a TWA shares the browser
  profile, and a durable flag would black out the user's normal Chrome. There
  is a test for it; keep it.
- **The hosting ignore list has no `**/.*` rule** any more, because
  `/.well-known/assetlinks.json` must be served for the TWA to verify. If you
  re-add it, the app shows a URL bar.
- **Firebase config is still a placeholder** — auth, sync, analytics and the
  incident banner all degrade quietly until the owner pastes the real config.
- **Owner preferences (memory-backed)**: never publish claude.ai Artifacts —
  local HTML only. Commits on `main` with the `norcetprep:` prefix and a
  `Co-Authored-By: Claude` trailer; don't push unasked. Wayfinder sessions:
  claim before working, one ticket per session.

## The calendar (drives everything)

| Date | What |
|---|---|
| ≤7 Aug | Phase 1 console: domains, hosting live, policy TODOs, **both gateway KYC applications**, Play account |
| ≤21 Aug | Phase 2 console: Firebase config/providers/Firestore(asia-south1)/rules; accounts open; grandfather grant (12 mo) |
| ≤31 Aug | Phase 3 = **checkpoint**: gateway active + legal gate (**done**) + entitlement E2E |
| ~5 Sep | Green → paid go-live (`go-live.mjs --write`; launch price ₹249/449/699, 30 days) |
| 10–12 Sep | **Deploy freeze** (Prelims 12 Sep) |
| **18 Sep** | Prelims results = **hard gate** — paid must be live for the 12-day Mains window |
| Red path | Founding waitlist (locks launch pricing); paid flips Jan 2027 |
| Feb–Apr 2027 | App wave — TWA listed after the 12×14 closed test |

## Working conventions

- Before committing content or index changes, run the gates listed above; CI
  runs all of them.
- Tracker state: `node norcetprep/.wayfinder/frontier.mjs`.
- New decisions discovered mid-build → new tickets or map fog, per
  [README.md](README.md). The map's Decisions-so-far stays a gist-plus-link
  index; detail lives in tickets.
- Every content correction, however small, gets a `data/fix-log.json` entry.
  The methodology page promises that in public.
