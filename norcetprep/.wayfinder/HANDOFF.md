# HANDOFF — NurseDrill (norcetprep monetization)

Written 2026-07-31 by the session that charted the map and built Phases 1–2.
Audience: the next agent (or a future session) picking this up cold.

## What this is

The free NORCET prep site (`norcetprep/`, live at
amitkumar0902.github.io/norcetprep/) is becoming **NurseDrill** — a paid,
subscription (validity-plan) nursing-exam product at **nursedrill.com**, later
wrapped as a Play Store TWA. The entire plan was charted as a wayfinder map
and **every decision is resolved**; the build is underway.

**Read in this order before doing anything:**
1. [map.md](map.md) — destination, all decisions at a glance (the index).
2. The resolution of whichever ticket touches your task (`tickets/*.md` —
   each holds the full detail; assets under `assets/` hold research + the
   signed-off UX prototype `assets/prototype-paywall.html`).
3. [../DEPLOY.md](../DEPLOY.md) — the go-live runbook (Phase 1 + Phase 2
   console steps).
4. [README.md](README.md) — tracker conventions (claim → resolve → frontier).

## State of the world (2026-07-31, end of session)

**Planning: 13 of 14 tickets closed.** The only open ticket is
[Business & payment prerequisites](tickets/t10-business-prereqs.md) (a task,
claimed): domains, gateway KYC, Play account — owner-side, checklist + exact
form answers are on the ticket. When the owner reports the facts, record a
`## Resolution`, close it, add the map index line — **the map is then
complete**.

**Build: Phase 1 and Phase 2 repo sides are DONE** (commits `ff3c998`,
`9b72783`; free-site restore `8275c45`). Owner console steps for both are
pending (see DEPLOY.md). Built so far: Firebase Hosting config serving
`norcetprep/` as the nursedrill.com root, deploy Action (inert until
`FIREBASE_DEPLOY_ENABLED` var + service-account secret exist), four policy
pages (`legal/` — owner TODOs still unfilled), `pricing.html`,
`account.html` + `js/auth.js` (Google/email auth, progress merge, devices,
deletion flow), evolved `firebase/firestore.rules` (entitlements
client-unwritable; `content/{exam}` gated by `paid_until`),
`scripts/grant-entitlement.mjs`, `scripts/flip-canonicals.mjs` (run with
`--write` only when the domain is live).

**NOTHING HAS BEEN PUSHED.** ~15 local commits sit on `main`. Pushing:
(a) updates the live github.io site immediately (intended Phase 1 behavior —
restored topic pages, footer, pricing go live), and (b) publishes this whole
tracker in a **public repo**. The owner knows; confirm before pushing anyway.

## Landmines & non-obvious context

- **The free topic site had been deleted** (commit `77b9b63`, the "Mains
  overhaul") while sitemap/docs/CI still referenced it — restored wholesale in
  `8275c45`. If something references a page that 404s, check git history
  before assuming it never existed.
- **`js/core.js` gate semantics are intentional**: the legacy allowlist gate
  and `NM.rootPath()` key off the `/norcetprep/` path marker. On
  nursedrill.com (origin root) the gate **disarms by design** — old origin
  stays gated (grace overlap), new origin runs open until Phase 3
  entitlements. `rootPath()` was made origin-portable; the gate was not — on
  purpose. Don't "fix" it.
- **norcetprep.com AND norcetprep.in were sniped** by one actor on
  2026-05-28 — that's why the brand is NurseDrill. Never build equity under
  the old name. nursedrill.com was still free at last check; buying it is the
  owner's most urgent task.
- **Legal gate before any paywall**: the verbatim NORCET-9 Mains paper
  (`data/mains/pyqs/norcet-9-mains-2025.json`, 121 Qs) must be rewritten to
  memory-recall style, and the official PDF (`imp/`) unpublished. Firebase
  hosting already excludes `imp/` + all PDFs; the JSON still ships (pages
  consume it) — the rewrite is content work, not an exclusion.
- **Firebase config is a placeholder** (`js/firebase-config.js`) — everything
  auth/sync degrades gracefully until the owner pastes the real config.
- **Play clock**: new personal dev accounts need a 12-tester × 14-day closed
  test before production — the app targets the **Feb 2027** wave; web launch
  targets this cycle.
- **Owner preferences (memory-backed)**: NEVER publish claude.ai Artifacts —
  local HTML files only. Commits on `main` with `norcetprep:` prefix +
  `Co-Authored-By: Claude` trailer; don't push unasked. Wayfinder sessions:
  claim before working, one ticket per session, AskUserQuestion with batched
  forks + a recommended option first.

## The calendar (drives everything)

| Date | What |
|---|---|
| ≤7 Aug | Phase 1 console: domains, hosting live, policy TODOs, **both gateway KYC applications**, Play account |
| ≤21 Aug | Phase 2 console: Firebase config/providers/Firestore(asia-south1)/rules; accounts open; grandfather grant (12 mo) |
| ≤31 Aug | Phase 3 built = **checkpoint**: gateway active + NORCET-9 rewritten + entitlement E2E |
| ~5 Sep | Green → paid go-live (launch price ₹249/449/699, 30 days from go-live) |
| 12 Sep | NORCET 11 Prelims (deploy freeze 48h before) |
| **18 Sep** | Prelims results = **hard gate** — paid must be live for the 12-day Mains window |
| Red path | Founding waitlist (locks launch pricing); paid flips on Jan 2027 |

## Next work, in rough order

1. **Close T10** when the owner reports facts (domains, project id, gateway
   outcomes, Play verification, live policy URLs). Map complete.
2. **Phase 3 build** (per
   [Platform & entitlement architecture](tickets/t07-platform-architecture.md)
   and [Pricing & packaging](tickets/t06-pricing-packaging.md)):
   premium content → Firestore `content/norcet/**` chunks + upload script;
   checkout pages (3 Razorpay hosted-page links, uid in notes) + ONE webhook
   Cloud Function (verify signature → write `entitlements.norcet`); client
   entitlement gating on mains/mock pages; sw precache trimmed to free
   content; app-mode blackout (`?src=twa` + referrer → zero purchase UI);
   GA4 events (six-event funnel per
   [Growth & distribution engine](tickets/t12-growth-engine.md)).
3. **Content track, parallel** (per
   [Content engine & quality bar](tickets/t09-content-engine.md)):
   NORCET-9 rewrite batch (100% owner-reviewed, one-time); build
   `verify-questions.mjs` (cross-model refutation gate); run the layered
   pipeline over the full 1,569-Q bank + all mocks; fill
   `needs_explanations.json` holes; source citations enforced.
4. **Growth plumbing** (T12): daily-quiz + streaks on the hub, Telegram
   bot auto-posting from the verified bank, shareable report cards.
5. **App track** (Feb-wave): Bubblewrap TWA once the domain is stable —
   constraints in [Play Store path & billing policy](tickets/t04-play-store-path.md).

## Working conventions

- Validate before committing content/index changes:
  `node norcetprep/scripts/validate-questions.mjs` and
  `node norcetprep/scripts/check-index-counts.mjs` (CI runs both).
- Tracker state: `node norcetprep/.wayfinder/frontier.mjs`.
- New decisions discovered mid-build → new tickets or map fog, per
  [README.md](README.md); the map's Decisions-so-far is the single index —
  gist + link only, detail in tickets.
- Memory (`~/.claude/.../memory/`) holds the map pointer and the
  no-artifacts preference — update it if conventions change.
