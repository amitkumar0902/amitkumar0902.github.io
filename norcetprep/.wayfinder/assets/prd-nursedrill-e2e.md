# NurseDrill E2E — requirement register

> Compact companion to the canonical
> [formal PRD](../../../docs/prds/2026-08-01/nursedrill-e2e.md) (user stories,
> acceptance criteria, implementation/testing decisions). This register is the
> status-tagged view — the fastest read of what's BUILT vs what remains.

| | |
|---|---|
| Status | **Locked** — synthesizes the 13 closed map decisions; adds none |
| Owner | Amit (solo builder) |
| Written | 2026-08-01, from [Map: Monetize NORCET Prep](../map.md) via [PRD ticket](../tickets/t15-e2e-prd.md) |
| Build state | Phases 1–4 repo-side **built** — all 13 tracer-bullet issues implemented (2026-08-01); nothing pushed or deployed |
| Sources | Every requirement cites its ticket. Owner-pending facts live in [Business & payment prerequisites](../tickets/t10-business-prereqs.md) |

Requirement status legend: **[BUILT]** in repo, ships on push · **[CONSOLE]** owner
console/dashboard step (runbook: [DEPLOY.md](../../DEPLOY.md)) · **[TODO]** not yet
built · **[FEB-WAVE]** app-cycle scope · **[RED-PATH]** only if the launch gate fails.

---

## 1. Product

**NurseDrill** (nursedrill.com) — a paid, subscription-style prep product for Indian
nursing-officer exams, NORCET-first. One engineer, AI-drafted / engineer-reviewed
content with an explicit quality bar, sold as one-time **validity plans** (not
auto-renewing subscriptions). Web-first PWA now; consumption-only Android TWA for the
next exam wave. Evolves the existing free site at amitkumar0902.github.io/norcetprep/.

**The wedge** ([Competitor & pricing landscape](../tickets/t01-competitor-landscape.md)):
an empty **₹500–1,500/yr specialist slot** between ₹299–649 commodity mega-bundles
(Adda247/Testbook) and ₹8k–33k video coaching (NNL/NPrep). Differentiation: Mains/
Stage-II depth, explanation-first QBank, transparent pricing, English-first. Video is
the least defensible asset (most pirated); a living QBank is the most — so no video.

**Non-goals** (map Out-of-scope): iOS; live coaching/cohorts; onboarding other exams
(architecture stays extensible; rrbprep is a future effort).

## 2. Users & market ([NORCET exam calendar & market size](../tickets/t02-exam-calendar-market.md))

- Indian nursing graduates pursuing AIIMS NORCET; ~**92k Prelims candidates** per
  cycle and growing; repeat attempts are the norm (12-month plan covers two cycles).
- Locked biannual cadence. **NORCET 11: registration closes 13 Aug 2026 · Prelims
  12 Sep · Mains 30 Sep.** Next demand wave ~Feb–Apr 2027 (the app's wave).
- Budget Android phones, price-sensitive, Telegram-native. English-first product;
  a translations slot is reserved in the content schema.

## 3. Business model ([Pricing & packaging](../tickets/t06-pricing-packaging.md), [India payments rails](../tickets/t03-payments-rails.md))

- **SKUs**: ₹299 / 3-mo · ₹599 / 6-mo · ₹999 / 12-mo — one-time validity, all-inclusive
  (every plan gets everything; duration is the only difference). No auto-renewal
  anywhere; honest expiry reminder with renew-at-list CTA.
- **Launch offer**: ₹249 / ₹449 / ₹699 for **30 days from actual paid go-live**
  ([Launch sequencing](../tickets/t13-launch-sequencing.md) addendum). The end date is
  printed once, on the pricing page, at launch — and never moves. No countdowns.
- **Refunds**: 7-day no-questions, one per account (disclosed pre-checkout);
  self-serve request → gateway refund → entitlement revoke.
- **Rails**: hosted Razorpay Payment Pages (Cashfree fallback, Easebuzz backup), one
  page per SKU, uid+plan in notes → webhook unlock in seconds. Sole proprietor,
  **no GST while under ₹20L** turnover; prices displayed all-inclusive.
- **Grandfathering**: the existing allowlisted user gets a free 12-month entitlement
  (`source: 'grant'`) at Phase 2 cutover.
- **Cost envelope**: Firebase Blaze ≈ ₹0–500/month at launch scale + domains.

## 4. Brand, domain, trust ([Brand, domain & trust](../tickets/t08-brand-domain-trust.md))

- Brand **NurseDrill**; primary domain **nursedrill.com**, .in parked. Buy URGENTLY —
  "norcetprep" .com/.in were sniped by one actor on 28 May 2026; never build equity
  under the old name. Product lines keep "NORCET" in titles for SEO.
- Trust posture: transparent solo builder ("built openly by an engineer"), public
  methodology page, public dated fix-log, quiet about AI tooling, **zero dark
  patterns**, "not affiliated with or endorsed by AIIMS" on every surface.
- Copy register: **confident honesty** — locked by the signed-off
  [paywall UX prototype](prototype-paywall.html) ([ticket](../tickets/t11-paywall-ux-prototype.md)).
- Migration: old github.io URLs → canonical stubs + Search Console change-of-address.

## 5. Design

- **Clinical Excellence** system (Stitch export, in-repo at
  `norcetprep/stitch_nursedrill_exam_prep_interface/`): Manrope, studio-white glass
  cards, deep slate teal `#042f2e`, electric mint accents, micro-labels. Implemented:
  `css/clinical.css` (money-path pages) + retokened `css/mains-theme.css` (whole app,
  light + dark) + Performance-Analytics mock report + branded share card.
- The Stitch mock's **copy is not spec** (fake ranks/XP, per-tier features,
  certification claims conflict with T06/T08); the clickable
  [prototype](prototype-paywall.html) remains the locked interaction reference.
- Home screen's Stitch layout (daily-quiz hero, mastery tiles) lands with the growth
  features that power it (§8); bottom tab-bar navigation is an open design question
  for that same work.

## 6. Product scope & requirements

### 6.1 Free tier — the funnel (stays crawlable, static)

- **FREE-1 [BUILT]** ~547 topic MCQs with explanations (20 topic pages + 5 SEO pillar
  pages) — restored in `8275c45`; validators green in CI.
- **FREE-2 [BUILT]** Free mock page (self-contained), labelled sample mocks
  mechanism (`free: true` in `mocks/index.json` — owner designates), Foundation
  notes section open as the quality sample.
- **FREE-3 [BUILT]** Daily free quiz — 10 questions chosen deterministically by IST date
  from citation-carrying questions, + streaks, PYQ-of-the-day, on the product home
  (`js/daily-quiz.js`, `js/home.js`); behaviour-tested.
- **FREE-4 [BUILT]** Hub + merchandising: locked premium tiles with honest unlock
  CTAs; mock library browsable by everyone.

### 6.2 Accounts ([Platform architecture](../tickets/t07-platform-architecture.md))

- **ACCT-1 [BUILT]** Firebase Auth: Google + email/password (no phone OTP at v1);
  anonymous auth retained for legacy sync-codes.
- **ACCT-2 [BUILT]** First sign-in merges local `nm.v1.*` progress into
  `users/{uid}.progress` via existing merge policies; device telemetry recorded —
  **no device limits, ever** (telemetry only).
- **ACCT-3 [BUILT]** Account deletion flow (Play data-safety requirement): user
  deletes doc + auth user + local wipe from `account.html`.
- **ACCT-4 [CONSOLE]** Firebase project (id target `nursedrill-web`), real web config
  pasted into `js/firebase-config.js`, providers enabled, authorized domains,
  Firestore in **asia-south1** (privacy policy promises it), rules deployed.
- **ACCT-5 [CONSOLE]** Grandfather grant via `scripts/grant-entitlement.mjs`
  (12 months, onboarded personally, grace overlap with old allowlist).

### 6.3 Payments & entitlements

- **PAY-1 [BUILT]** Entitlement schema: `users/{uid}.entitlements.norcet.paid_until`
  (+ source/orderId/plan) — client-unwritable by rules; rrb-extensible; Play-billing-
  ready (`source` field) with no schema change.
- **PAY-2 [BUILT]** Checkout flow: `pricing → checkout.html (sign-in enforced) →
  Razorpay hosted page (uid+plan in notes) → checkout-success.html` polling the
  entitlement. Buy CTAs are flag-gated until go-live.
- **PAY-3 [BUILT]** ONE Cloud Function webhook: verifies HMAC; `payment.captured` →
  idempotent grant extending `paid_until` (calendar months, stacking on remaining
  validity); `refund.processed` → revoke; unmatched payments audited to
  `payments/{id}` for manual reconciliation.
- **PAY-4 [CONSOLE]** Function deployed + `RAZORPAY_WEBHOOK_SECRET` set; three
  Payment Pages (custom fields named `uid`, `plan`; success redirect to
  checkout-success); webhook registered for both events; page URLs pasted into
  `js/payments-config.js`. Test-mode E2E is **checkpoint gate 3**.
- **PAY-5 [CONSOLE]** Gateway KYC: apply to **Razorpay AND Cashfree the same day**
  Phase 1 completes (high-variance external clock; exact form answers on
  [Business & payment prerequisites](../tickets/t10-business-prereqs.md)).

### 6.4 Premium content delivery

- **CONT-1 [BUILT]** Premium JSON (96 files ≈ 7.4MB: mocks, PYQs, notes, flashcards,
  day-slices, topic banks, frequency analytics, drills) leaves the public path →
  Firestore `content/norcet/files|chunks/**`, rules-gated by live `paid_until`;
  ≤900KB UTF-8-safe chunks; `scripts/upload-content.mjs` (idempotent, `--prune`).
- **CONT-2 [BUILT]** Client routing: `NM.data()` → static for free files, Firestore
  for premium once the paywall flag is on; Firestore offline persistence gives
  entitled users airplane-mode mocks (TWA review bar).
- **CONT-3 [BUILT]** Paywall UX: path auto-guard on `mains-plan/**`, interstitial
  per prototype (browser: plans + sign-in; app-mode: neutral, zero purchase UI);
  per-section notes gating; data-driven mock gating so samples run.
- **CONT-4 [BUILT]** Service worker precaches free shell only; premium data barred
  from SW caches entirely.
- **CONT-5 [CONSOLE]** Content uploaded to Firestore (re-run on every content change).
- **CONT-6 [TODO]** Known v1 gap, accepted: day-page/cheatsheet inline HTML is
  guard-only (fetchable by a determined user) — extraction to Firestore is
  post-launch content-track work. Old origin stays a public mirror until stubs land.

### 6.5 Content engine & quality bar ([Content engine](../tickets/t09-content-engine.md), [Legal baseline](../tickets/t05-legal-compliance.md))

- **QUAL-1 [BUILT — LEGAL GATE CLEARED]** All 121 NORCET-9 items rewritten to
  memory-recall style with original explanations and citations, applied across the PYQ
  set, bank, replay mock, ten full mocks, day slices and topic banks; the official PDF
  deleted from the repo and gitignored; every "verbatim"/"official paper" claim scrubbed.
- **QUAL-2 [BUILT]** `verify-questions.mjs` ships (independent-family refutation gate,
  resumable, golden-set acceptance test, consistency gate needing no API key). Citations
  are on all **5,742** questions and validator-enforced; 283 explanation holes filled; 134
  duplicate free questions replaced and 292 unverifiable year labels removed; 3 confirmed
  key errors fixed. Model-gate pass over the bank needs an API key — owner runs it.
- **QUAL-3 [TODO]** Season cadence: **new full mock weekly during exam season**
  (Jul–Sep, Feb–Apr; explicitly slower off-season) — the public promise pricing
  makes; pipeline must sustain it at ~1.5–3 h/week human review.
- **QUAL-4** Launch bar is **harden what exists — no volume push**. Sister-exam
  mocks (RRB/ESIC/DSSSB/JIPMER/AIIMS) ship as unadvertised bonus.
- **QUAL-5 [BUILT]** Error loop complete: in-product reports → weekly triage (RUNBOOKS §4)
  → public dated fix-log (`fix-log.html` + `data/fix-log.json`, seeded with 9 real entries)
  → methodology page describing the pipeline honestly.

### 6.6 Growth engine ([Growth & distribution](../tickets/t12-growth-engine.md)) — ~5 h/week ceiling

- **GROW-1 [BUILT]** Daily quiz + streaks + PYQ-of-the-day on the restructured product
  home (Clinical Excellence layout, light and dark, app-mode safe).
- **GROW-2 [BUILT/CONSOLE]** `functions/daily-post.js` — scheduled 07:30 IST post of the
  day's MCQ + PYQ, selected by the same rule as the site (contract test), plus a keyed
  `announce` endpoint. Console: create channel/bot, set the three secrets.
- **GROW-3 [BUILT]** Referral v1: shareable cutoff-anchored report card (branded
  PNG, share CTA after every mock). No monetary referrals at v1.
- **GROW-4 [TODO]** Instagram 1–2 diagram-carousel posts/week — explicitly the first
  thing dropped in a busy week. YouTube ruled out as an engine.
- **GROW-5 [BUILT]** Orchestrator focus URLs and outreach templates retargeted to
  nursedrill.com, rebranded, with the non-affiliation line and explicit no-dark-pattern rules.

### 6.7 Analytics ([Growth engine](../tickets/t12-growth-engine.md))

- **ANLY-1 [BUILT]** GA4 via Firebase SDK, minimal six-event funnel, all six now wired:
  `signup` · `paywall_view` · `checkout_click` · `purchase` · `quiz_start`/`quiz_complete`
  · `share_report`. Dashboards: GA4 standard — no custom dashboards until a question
  demands one.
- **ANLY-2 [CONSOLE]** Enable Analytics on the Firebase project; paste
  `measurementId`. Plain disclosure already in the privacy policy.

### 6.8 Legal & compliance ([Legal baseline](../tickets/t05-legal-compliance.md))

- **LEGAL-1 [BUILT/CONSOLE]** T&C, Privacy, Refund, Contact pages live before
  gateway applications — built; owner fills the amber `[TODO]` markers (legal name,
  address, dates) and publishes.
- **LEGAL-2** Cancelling/refunding as easy as buying (CPA 2019); no GST display
  while unregistered; DPDP duties begin **13 May 2027** (revisit privacy-light
  analytics then).
- **LEGAL-3** AIIMS non-affiliation disclaimer on every surface; exam names used
  descriptively; no selection/rank promises. QUAL-1 is the copyright gate.

### 6.9 Support & ops ([Support & ops](../tickets/t14-support-ops.md))

- **OPS-1** Printed SLAs: 48h replies · same-day payment/access issues · weekly
  fix-batch into the public fix-log. Channels: support email + in-product reports
  only; **no doubt-solving** (stated plainly).
- **OPS-2 [CONSOLE]** support@nursedrill.com forwarding; refund + payment-
  reconciliation runbooks (owner-run script against gateway dashboard).
- **OPS-3 [BUILT/CONSOLE]** Incident banner via `config/site` + `scripts/incident.mjs`,
  rendered by `js/site-chrome.js` on every page family; failure alerting in the functions;
  the three console monitors are stepped out in [RUNBOOKS.md](../../RUNBOOKS.md) §6.
- **OPS-4** **Deploy freeze 48h before every exam date** (first: 10–12 Sep 2026).

### 6.10 Android app ([Play Store path](../tickets/t04-play-store-path.md)) — Feb-2027 wave

- **APP-1 [FEB-WAVE]** Bubblewrap TWA, **consumption-only**: all selling on the web
  (~2% PSP vs 15% Play); app-mode (`?src=twa` + referrer, session-persisted) shows
  zero purchase UI — **[BUILT]** client-side already.
- **APP-2 [FEB-WAVE]** Origin-root prerequisites: assetlinks.json at nursedrill.com,
  target API 36, data-safety form with deletion URL (`account.html`), 12 testers ×
  14 days closed test (launch-cohort doubles as the tester pool), ~4–6 weeks to
  listed.
- **APP-3 [CONSOLE]** Play developer account ($25) + ID verification starts in
  Phase 1 — the clock is long, the app itself is Feb scope.

## 7. Architecture (fixed — [Platform architecture](../tickets/t07-platform-architecture.md))

One Firebase project (Blaze) on **nursedrill.com**: Hosting (GitHub Action deploys,
inert until repo var+secret exist) · Auth · Firestore (asia-south1) · exactly one
Cloud Function (Razorpay webhook, asia-south1). Free/SEO pages and the gated app on
one origin. GitHub Pages keeps only canonical stubs post-migration. Firestore rules:
users self-manage minus `entitlements`; `content/{exam}/**` readable only with live
`paid_until`; `payments/**` server-only. Single go-live switch: `PAYWALL_ENABLED`
in `js/paywall.js` — the flip commit is fully scripted in
[DEPLOY.md](../../DEPLOY.md) (flag, live URLs, printed offer end date, hosting
ignores for premium statics, SW cache bump, allowlist retirement).

## 8. Launch plan ([Launch sequencing & migration](../tickets/t13-launch-sequencing.md))

| Gate | Date | Contents |
|---|---|---|
| Phase 1 | **≤ 7 Aug** | Domains bought; Firebase live; site on nursedrill.com; policy TODOs filled; canonicals flipped; GSC change-of-address; **both gateway KYC applications same day**; Play account created |
| Phase 2 | **≤ 21 Aug** | Config pasted → accounts open to everyone; progress merge verified; grandfathered user onboarded (grace overlap); Telegram channel seeded; content pipeline running in parallel |
| Phase 3 | **≤ 31 Aug = CHECKPOINT** | Functions + Payment Pages + webhook live; content uploaded; **green requires: (1) ≥1 gateway activated, (2) NORCET-9 rewritten + PDF unpublished, (3) entitlement E2E verified** |
| Green | **~5 Sep** | Go-live flip commit; launch price starts (30 days, end date printed); allowlist retired |
| Yellow | **by 18 Sep** | Prelims-results day — the hard gate; the 12-day Mains window is the core buyer moment |
| Red | Jan 2027 | **[RED-PATH]** Founding waitlist through the season ("founding members lock launch pricing" — honors ₹249/449/699); paid flips ahead of the Feb wave |

Nobody preparing for NORCET 11 loses access mid-season: the legacy allowlist dies
only at paid go-live, after the grandfathered account is verified.

## 9. Definition of E2E-complete

**Web (this cycle):** every [CONSOLE] step done · checkpoint green · paid live with
printed offer window · premium statics off the product domain · allowlist retired ·
old-origin stubs + GSC change-of-address filed · six-event funnel flowing · daily
quiz + streaks + Telegram bot live · weekly-mock cadence holding · SLAs + alarms
+ runbooks operating.

**App (Feb wave):** TWA in production after the 12×14 soak, consumption-only,
zero purchase UI verified against Play policy, listed before the Feb–Apr 2027
demand wave.

## 10. Risks & dependencies

1. **Gateway KYC variance** — the reason for the KYC-first calendar and dual
   applications; red path exists because activation is not in our control.
2. **NORCET-9 legal gate** (QUAL-1) — the only content blocker on the checkpoint;
   owner review is one-time but mandatory.
3. **Domain squatter risk** — nursedrill.com free at last check; every day unbought
   risks a repeat of 28 May.
4. **Play tester clock** — 12×14 soak forces the Feb-wave app timeline; web carries
   this season by design.
5. **Solo-operator ceiling** — every recurring motion must fit ~5 h/week growth +
   1.5–3 h/week review + support SLAs; anything beyond gets automated or dropped.
6. **Owner facts pending** — registrar, project id, gateway outcomes, live policy
   URLs close via [Business & payment prerequisites](../tickets/t10-business-prereqs.md).

## 11. Decision index

[Competitor & pricing landscape](../tickets/t01-competitor-landscape.md) ·
[NORCET exam calendar & market size](../tickets/t02-exam-calendar-market.md) ·
[India payments & recurring billing rails](../tickets/t03-payments-rails.md) ·
[Play Store path & billing policy](../tickets/t04-play-store-path.md) ·
[Legal & compliance baseline](../tickets/t05-legal-compliance.md) ·
[Pricing & packaging](../tickets/t06-pricing-packaging.md) ·
[Platform & entitlement architecture](../tickets/t07-platform-architecture.md) ·
[Brand, domain & trust](../tickets/t08-brand-domain-trust.md) ·
[Content engine & quality bar](../tickets/t09-content-engine.md) ·
[Business & payment prerequisites](../tickets/t10-business-prereqs.md) (open) ·
[Paywall & subscription UX prototype](../tickets/t11-paywall-ux-prototype.md) ·
[Growth & distribution engine](../tickets/t12-growth-engine.md) ·
[Launch sequencing & migration](../tickets/t13-launch-sequencing.md) ·
[Support & ops](../tickets/t14-support-ops.md)
