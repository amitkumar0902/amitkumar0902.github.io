# PRD — NurseDrill: end-to-end paid product

> Synthesized 2026-08-01 from the **Monetize NORCET Prep** wayfinder map
> (`norcetprep/.wayfinder/map.md`) — 14 closed decision tickets, the signed-off
> paywall prototype, and the Phase 1–3 build. This document adds **no new
> decisions**; where a detail is still owner-pending it says so and points at
> the *Business & payment prerequisites* ticket. Companion artifact: the
> compact requirement register with build-status tags
> (`norcetprep/.wayfinder/assets/prd-nursedrill-e2e.md`).

## Problem Statement

I run a free NORCET (AIIMS nursing-officer exam) prep site that has grown real
content — ~547 free topic MCQs, a premium-grade Mains toolkit with 1,569 bank
questions, 10 full mocks, recall-style previous-year papers, notes, flashcards,
diagrams, and drills — but it earns nothing and is protected by nothing. The
"gate" is a client-side allowlist in a public repository (which exposes user
emails and every piece of premium content to anyone who looks). There are no
real accounts, no payments, no legal pages, and the site lives on a personal
github.io URL that payment gateways and the Play Store treat as
non-credible.

Meanwhile the market has a hole: aspirants choose between ₹299–649 commodity
mega-bundles where nursing is an afterthought, and ₹8k–33k video coaching
platforms. The ₹500–1,500/yr NORCET-specialist slot is empty. The audience is
large and growing (92k prelims candidates per cycle, repeat attempts the norm)
and the buying season is hard-dated: NORCET 11 prelims on 12 Sep 2026, results
18 Sep, and a 12-day Mains window that is the product's core buying moment.
If the product is not live and trustworthy by then, demand sleeps until
~Feb 2027.

One person operates everything, so every mechanism — support, content
production, growth — must fit a solo operator's week, and the exam-prep
market's trust deficit (fake faculty, fake MRPs, countdown timers, piracy)
means the product must win on honesty rather than volume.

## Solution

Turn the free site into **NurseDrill** (nursedrill.com): a paid, NORCET-first
nursing-exam prep product sold as **one-time validity plans** (₹299/3-mo ·
₹599/6-mo · ₹999/12-mo, all-inclusive, no auto-renewal), with a permanent free
funnel (topic MCQs, daily quiz, labelled samples) converting on-product into a
premium tier: the full mock library, the complete Mains toolkit, and
cutoff-anchored analytics.

Everything runs on one Firebase project on one custom domain: real accounts
(Google + email/password) with automatic progress merge, premium content moved
out of the public repository into entitlement-gated Firestore, checkout via
hosted Razorpay payment pages with a single webhook function unlocking access
in seconds, and a service worker that keeps only free content cacheable.
Content quality is enforced by a layered pipeline — automated validators, an
adversarial cross-model verification gate, human review of flagged items plus
a sample, and mandatory source citations — with a public methodology page and
a dated public fix-log as the trust surface. Growth is on-product (daily quiz,
streaks, shareable report cards) fed by an automated Telegram channel, all
inside a ~5 h/week ceiling.

The launch is calendar-gated: domain and gateway KYC first (the
slowest external clock), accounts second, paywall machinery third, with an
explicit checkpoint on 31 Aug 2026 and a fallback (founding waitlist that
locks launch pricing, paid flips Jan 2027) if gateways or the legal content
gate aren't ready. A consumption-only Android TWA (zero purchase UI, selling
stays on the web) follows for the Feb 2027 wave. The visual identity is the
"Clinical Excellence" design system; the voice is confident honesty — real
dates, printed offer deadlines that never move, no dark patterns.

## User Stories

### Anonymous aspirant — the free funnel

1. As an anonymous aspirant, I want to browse all ~547 topic-wise MCQs with
   explanations without any account, so that I can study free and judge the
   product's quality before ever paying.

**Acceptance Criteria:**
- All topic pages and SEO pillar pages load with no login, no gate, and no
  interstitial, on both the product domain and (until migration completes) the
  legacy origin.
- Every question shows an explanation; explanations carry source citations as
  the verification pipeline covers them.
- Pages remain crawlable static HTML (the SEO funnel is a hard requirement).
- The free tier is presented as "free forever" — no bait-and-switch.

2. As an anonymous aspirant, I want a free sample mock and open sample notes,
   so that I can experience the paid product's depth before purchase.

**Acceptance Criteria:**
- At least one full-length mock is takeable free without an account.
- One notes section (the designated sample) is openly readable; locked
  sections are visibly labelled rather than hidden.
- Sample content is clearly marked as a sample of premium, with an honest
  unlock path nearby.
- The mock library remains browsable by everyone — locked items show title,
  question count, and duration (merchandising), never a blank page.

3. As an anonymous aspirant, I want a daily free quiz of 10 verified questions
   with a streak counter, so that I have a reason to return every day to the
   place where the paywall lives.

**Acceptance Criteria:**
- Quiz draws from the verified question bank; a previous-year question of the
  day is surfaced on-site.
- Streak persists locally for anonymous users and moves into the account on
  sign-in.
- Quiz start and completion fire analytics events.
- The quiz lives on the product home, not on an external channel.

4. As an anonymous aspirant, I want transparent pricing with what's included
   and what stays free, so that I can decide without discovering surprises at
   checkout.

**Acceptance Criteria:**
- Three plans shown with real prices; every plan includes everything — the
  page states the duration is the only difference.
- Launch pricing shows both launch and list price; the offer end date is
  printed in plain text exactly once, and there is no countdown widget
  anywhere.
- The page states: price is final at checkout, no auto-renewal ever, 7-day
  no-questions refund (one per account), unlimited devices.
- In the Android app, this page renders neutral locked copy with no prices and
  no purchase links.

5. As a skeptical aspirant in a market full of fake toppers, I want to read
   exactly how questions are produced and checked and see errors publicly
   fixed, so that I can trust an unknown brand with my exam.

**Acceptance Criteria:**
- A methodology page describes the pipeline truthfully (automated checks,
  independent cross-verification, human review, source citations) without
  fake authority — no "expert-verified" claims unless a credentialed reviewer
  actually exists.
- A public fix-log lists reported errors and their fixes with dates.
- Every page footer carries "not affiliated with or endorsed by AIIMS"; the
  AIIMS logo is never used; no selection/rank promises anywhere.
- The founder is named — a transparent solo builder, not a fake institute.

6. As a Telegram-native aspirant, I want a NurseDrill channel that posts the
   daily MCQ and PYQ-of-the-day, so that my existing habit feeds me into the
   site.

**Acceptance Criteria:**
- A bot auto-posts daily from the verified bank with links into the on-site
  quiz — no manual daily effort.
- The channel is the announcement line for weekly mocks and launch moments.
- DMs point to the support email; the channel is a feeder, not a support or
  content home.

### Accounts & data

7. As an aspirant, I want to create one free account with Google or
   email/password, so that my progress follows me across devices.

**Acceptance Criteria:**
- Both providers work; password reset works; failures show human-readable
  errors.
- No phone OTP anywhere (no SMS cost at v1).
- On first sign-in, practice progress already on the device merges into the
  account without loss, and a line of copy says so.
- Account creation fires the signup analytics event once.

8. As a signed-in aspirant, I want my progress, streaks, and mock results
   synced to every device I use, with no device limit, so that I can study on
   phone and laptop interchangeably.

**Acceptance Criteria:**
- Signing in on a second device merges rather than overwrites (per-key merge
  policies).
- The account page lists devices seen (telemetry only); copy states devices
  are not limited.
- A manual "sync now" control exists and reports success or failure.

9. As a privacy-conscious user (and per Play policy), I want to delete my
   account and data from within the product, so that leaving is as easy as
   joining.

**Acceptance Criteria:**
- Deletion from the account page removes the auth user, the synced data, the
  device records, and local study data, after re-authentication where
  required.
- Copy states payment audit records are retained only as accounting law
  requires.
- The deletion page URL is stable and declarable in the Play data-safety
  form.

### Purchase & entitlement

10. As a convinced aspirant, I want to buy a plan in one payment on a trusted
    Indian payment page (UPI/cards/netbanking), so that paying feels safe and
    takes a minute.

**Acceptance Criteria:**
- Checkout requires sign-in first, with copy explaining the purchase attaches
  to the account; after sign-in the user returns to checkout automatically.
- Payment happens on the gateway's hosted page — card data never touches the
  product; the account identity travels with the payment.
- Checkout shows plan, price, refund promise, and the paying account's email
  before hand-off; the out-click fires an analytics event.
- After payment, a success page confirms activation within seconds and shows
  the paid-until date; if confirmation lags, honest copy explains, points at
  the account page and support, and the purchase event is not double-counted.

11. As a buyer, I want my access to activate instantly and automatically at
    any hour, so that I can start studying the night I pay.

**Acceptance Criteria:**
- The payment webhook verifies authenticity, grants the entitlement, and is
  idempotent under gateway retries.
- Buying while a plan is still active extends from the current expiry, never
  discards remaining days.
- A payment that can't be matched to an account is recorded for manual
  reconciliation and never silently dropped.
- Entitlement state is server-enforced; no client can write it.

12. As a buyer whose payment email differs from my account email, I want a
    same-day support path that moves my purchase to the right account, so that
    a mistake doesn't cost me study days.

**Acceptance Criteria:**
- Support page/policy promises same-day handling for payment/access issues.
- A documented runbook exists: verify payment in the gateway dashboard →
  manual grant with audit entry.
- The manual grant tool records source and order reference.

13. As a buyer with second thoughts, I want a 7-day no-questions refund, one
    per account, so that trying the product is risk-free.

**Acceptance Criteria:**
- Refund terms (window, one-per-account, gateway timeline of 5–7 business
  days) are stated before checkout and on the policy page.
- Request is self-serve (account page or email); processed within 48h.
- On refund, access is revoked and the one-per-account marker is set.
- Refund count is watched as a product-health metric.

14. As a subscriber near expiry, I want an honest reminder and a
    renew-at-list-price choice, so that continuing is my decision, not a trap.

**Acceptance Criteria:**
- No auto-charge exists anywhere; expiry simply returns the account to the
  free tier.
- Reminder copy is honest; renewal is the same one-time purchase flow at list
  price; remaining days stack on renewal-before-expiry.
- No win-back dark patterns ("price came back by popular demand" is banned).

15. As the existing allowlisted user, I want my access preserved through the
    transition with a free 12-month grant, so that going paid never punishes
    the earliest supporter mid-season.

**Acceptance Criteria:**
- Onboarded personally: account created together, grant applied, progress
  verified — while the old login still works (grace overlap).
- The legacy allowlist is retired only at paid go-live, after this account is
  verified working.
- The grant is a normal entitlement (distinct source marker), indistinguishable
  in product behavior from a purchase.

### Premium study experience

16. As a premium subscriber, I want the full mock library — 10 NORCET-mix
    mocks, recall-style previous-year paper mocks, and bonus staff-nurse
    mocks — with a new full mock every week in season, so that I never run out
    of realistic practice.

**Acceptance Criteria:**
- Exam-faithful runner: 160 questions, 180 minutes, +1/−1∕3 scoring, section
  behavior per the real pattern; resume works mid-attempt.
- Previous-year mocks are labelled memory-based recall — the word "verbatim"
  and any official-PDF claim appear nowhere.
- Weekly season mock lands on the announced day; if it fails quality gates it
  ships late, never unreviewed — and the copy says so.
- Sister-exam mocks (RRB/ESIC/DSSSB/JIPMER/AIIMS-pattern) are present as
  unadvertised bonus.

17. As a subscriber who just finished a mock, I want a cutoff-anchored report
    with subject-wise mastery and weak-topic guidance, so that I know exactly
    what to fix before the real exam.

**Acceptance Criteria:**
- Report shows post-negative score, percentage, an honest verdict band
  anchored to realistic cutoffs, per-subject accuracy bars with a visible flag
  under 50%, and average time per question against the exam's budget.
- Wrong and flagged questions are reviewable inline with explanations.
- Wrong answers feed spaced repetition for later review.

18. As a proud scorer, I want a clean shareable report-card image, so that my
    flex in Telegram/WhatsApp groups advertises the product for free.

**Acceptance Criteria:**
- One tap renders a branded score card (score, percentage, subject bars,
  date, non-affiliation line) as an image download.
- Sharing fires an analytics event; no monetary referral mechanics exist.

19. As a premium subscriber, I want the complete Mains toolkit — scenario-first
    notes, flashcards, labelled diagrams, drug-calculation drills, toppers
    frequency analysis, and the full question bank with filters — so that
    Stage-II depth is one subscription, not five apps.

**Acceptance Criteria:**
- Each toolkit surface is entitlement-gated; free users see honest locked
  states, not errors.
- The question bank filters by subject/topic/tag and links into practice.
- Frequency analytics tie topics to their historical exam weight.

20. As a subscriber on unreliable data, I want already-loaded premium content
    readable offline, so that a train commute or an exam-morning network
    outage doesn't stop my revision.

**Acceptance Criteria:**
- Entitled content already fetched on the device remains readable with no
  connection; entitlement re-checks on reconnect rather than mid-flight.
- Free shell and free content work offline via the app shell cache.
- Premium content never enters shared browser caches beyond the entitled
  session's own storage.

21. As any user, I want to report a wrong question in two taps from the
    question itself, so that errors get fixed and I can see they were.

**Acceptance Criteria:**
- Report control on every rendered question with a reason picker; works
  offline-degraded (queued or stored locally).
- Reports are triaged weekly; fixes land with the weekly publish and appear
  dated in the public fix-log.
- Reporting is explicitly not a doubt-solving channel, and the FAQ says so.

### Android app (Feb-2027 wave)

22. As an Android-first aspirant, I want NurseDrill as a Play Store app that
    is the same product with the same account, so that install friction and
    trust concerns disappear.

**Acceptance Criteria:**
- The app is a TWA wrapper of the PWA bound to the product domain; one
  codebase, no separate native app.
- Sign-in, progress, entitlements, and offline behavior match the web
  exactly.
- Listing passes Play requirements: data-safety form, in-listing privacy
  policy, account-deletion URL, current target API level.

23. As an app-store reviewer (and as Google's policy), I want the app to show
    zero purchase UI, so that consumption-only compliance is unambiguous.

**Acceptance Criteria:**
- In app-mode: no prices, no plan names, no unlock buttons, no links to
  pricing or checkout — locked content shows only neutral copy plus sign-in.
- Purchase pages refuse app-mode sessions outright.
- App-mode detection survives in-app navigation but never poisons the same
  device's regular browser sessions.
- Web purchases unlock in the app on next sign-in/refresh with no purchase
  path shown.

### Owner-operator

24. As the solo owner, I want deploys to be a git push, so that operating the
    product doesn't require console archaeology.

**Acceptance Criteria:**
- Push to main deploys hosting automatically once enabled; the workflow is
  inert until its secret and flag exist.
- Firestore rules and the webhook function deploy via documented one-line
  commands.
- A single flag flip (one commit, documented checklist) takes the paywall
  live: flag, live payment URLs, printed offer end date, premium statics off
  hosting, cache bump, allowlist retirement.

25. As the owner, I want premium content published to the gated store with one
    idempotent command, so that content updates are routine, not risky.

**Acceptance Criteria:**
- Dry-run mode lists what would change; write mode uploads only changed
  files; oversized files chunk automatically and reassemble losslessly.
- A prune mode removes store content no longer in the source set.
- Invalid content fails before any write.

26. As the owner, I want the weekly content pipeline to run on a fixed
    weekday rhythm inside ~1.5–3 h/week of my review time, so that the season
    promise is sustainable.

**Acceptance Criteria:**
- Pipeline stages: blueprint-driven draft → static validators (CI) →
  adversarial cross-model refutation gate → human review of 100% of flagged
  items plus a 20% random sample → publish → fix-log feedback loop.
- Every question carries a mandatory source citation, enforced by a
  validator.
- The NORCET-9 rewrite (all 121 items to recall style, 100% human-reviewed,
  official PDF unpublished) is complete before any paywall — the legal gate.
- If a week's mock misses its gates, it ships late; the honesty rule is
  policy, not aspiration.

27. As the owner, I want printed support SLAs I can actually keep — 48h
    replies, same-day payment/access fixes, weekly fix batches — so that
    support earns trust without eating the build.

**Acceptance Criteria:**
- SLAs printed on the contact page; the fix cadence on the methodology page.
- One inbox (support email) + in-product reports; social DMs auto-point to
  email; no WhatsApp support; no doubt-solving, stated plainly.
- Refund and reconciliation runbooks are written and followed.

28. As the owner, I want lightweight alarms and an incident banner, so that I
    hear about failures from monitors, not angry users.

**Acceptance Criteria:**
- Uptime ping on the product domain; billing budget alert; webhook-failure
  alert to email.
- An incident banner togglable via a remote flag, plus a pinned Telegram
  post — no status page at v1.
- Deploy freeze for 48h before every prelims/mains date; hotfixes only
  during the Mains window.

29. As the owner, I want a six-event GA4 funnel (signup, paywall view,
    checkout click, purchase, quiz start/complete, report share), so that I
    can see where aspirants fall out without building a dashboard.

**Acceptance Criteria:**
- Exactly this minimal event set; standard GA4 funnel views suffice; no
  custom dashboards until a real question demands one.
- Events degrade to no-ops when analytics is unconfigured; nothing blocks the
  page on analytics.
- The webhook remains the truth for revenue; the purchase event is
  presentation-layer only.

30. As the owner under a hard calendar, I want explicit launch gates with a
    fallback, so that a slow gateway or unfinished legal gate degrades the
    plan instead of collapsing it.

**Acceptance Criteria:**
- Checkpoint (31 Aug 2026) is green only when: a gateway is activated, the
  NORCET-9 legal gate is done, and the entitlement flow is verified
  end-to-end in test mode.
- Green → paid go-live ~5 Sep; partial → go-live by the 18 Sep hard gate
  (prelims results, the Mains buying window); red → fallback mode.
- Fallback: free accounts + a founding waitlist through the season that locks
  launch pricing (₹249/449/699 honored), paid flips Jan 2027 ahead of the
  Feb wave.
- Nobody preparing for NORCET 11 loses existing access mid-season under any
  path.

31. As the owner protecting young SEO equity, I want the old github.io URLs to
    hand off cleanly to nursedrill.com, so that rankings consolidate on the
    brand I own.

**Acceptance Criteria:**
- Canonicals flip to the product domain once it serves; old URLs become stub
  pages (canonical + instant redirect) after go-live.
- Search Console change-of-address is filed; the sitemap moves.
- The personal site outside the product directory stays untouched.

## Implementation Decisions

**Platform.** One Firebase project (Blaze) on nursedrill.com serves
everything: Hosting (deployed by a push-triggered workflow that stays inert
until its secret and enable-flag exist), Auth (Google + email/password +
legacy anonymous), Firestore in the Mumbai region (the privacy policy promises
data residency), and exactly one HTTPS Cloud Function — the payment webhook.
The legacy origin remains only as canonical stubs after migration.

**Entitlement model.** Validity plans reduce to timestamps: a per-product
`paid_until` inside the user document's entitlements map, written only by the
webhook and the owner's grant tool (Admin SDK); security rules make
entitlements client-unwritable and gate premium content reads on a live
timestamp. Grants extend from the later of now or current expiry, in calendar
months. The source field distinguishes gateway, manual grant, and a future
Play Billing source with no schema change; a second exam later means a second
key in the same map and a parallel content subtree — nothing else moves.

**Premium content store.** Premium JSON (banks, mocks, PYQs, notes,
flashcards, day slices, analytics data) lives in a rules-gated content
collection, one document per file with string-part chunk documents for
oversized files (UTF-8-safe splitting, one read per chunk). An idempotent
owner CLI (dry-run default, write and prune modes, hash-skip, fail-fast JSON
validation) publishes it. The client data loader routes premium paths to
Firestore when the paywall is enabled and static hosting otherwise; free files
always load statically. Firestore offline persistence provides
airplane-mode reading for entitled users. Labelled diagram images stay static
(pages presenting them are gated); day-page/cheatsheet inline HTML is
guard-only at v1 with extraction accepted as post-launch content work.

**Paywall.** A single build-time flag arms the whole paywall on both origins;
until then everything deploys dark. A path-based auto-guard walls premium
pages via a full-page interstitial (plans + sign-in in browser; neutral copy
in app-mode); merchandising pages (mock library, notes index) stay open and
render locked tiles, with data-driven exceptions for owner-designated free
samples. The go-live flip is one documented commit: flag, live payment-page
URLs, printed offer end date, premium statics excluded from hosting, service
worker cache bump, allowlist retirement.

**Checkout contract.** Three hosted Razorpay Payment Pages (one per SKU),
created with two custom fields — the account id and the plan code — prefilled
by the checkout page via URL parameters and delivered to the webhook inside
payment notes; the success redirect returns to the product's confirmation
page, which polls the entitlement. Checkout availability is deliberately
independent of the paywall flag (gated instead on real payment-page URLs
being configured) so the end-to-end flow can be tested in gateway test mode
before launch. The webhook verifies the HMAC signature over the raw body,
handles capture and refund events, is idempotent via the payment-id audit
record, maps plan from notes with an amount fallback, and files unmatched
payments as audit records for the manual reconciliation runbook.

**App-mode.** Detection is start-URL parameter or Android app referrer,
persisted per-session (deliberately not in durable storage: a TWA shares the
browser profile, and a permanent flag would black out the user's normal
browser). App-mode strips every purchase surface; purchase routes render a
neutral locked card.

**Service worker.** Precache is the free shell plus free data only; premium
data is barred from service-worker caches entirely (network-only pass-through)
— Firestore persistence is premium's offline story. HTML stays network-first,
static assets stale-while-revalidate.

**Analytics.** GA4 through the Firebase SDK with a queue-and-drop tracker
that no-ops until real configuration exists. Exactly six funnel events; the
webhook, not the purchase event, is revenue truth.

**Design.** The Clinical Excellence system (Manrope; studio-white glass
cards; deep slate teal; electric mint accents; micro-labels) is implemented as
a shared stylesheet for product pages plus retokened theme variables (light
and dark) for the study app, an interstitial skin, a Performance-Analytics
report layout, and a branded share card. The Stitch mock's visuals are spec;
its copy is not (fake ranks, per-tier features, and certification claims
conflict with locked pricing and trust decisions). The signed-off clickable
prototype remains the interaction reference; the copy register is confident
honesty.

**Content pipeline.** Blueprint-driven generation weighted by frequency
analysis; static validators in CI; a new adversarial verification tool sends
each question to an independent model family to refute, flagging
disagreement; humans review all flags plus a 20% sample; source citations are
schema-enforced; the schema reserves a translations slot (English-first at
launch). The NORCET-9 rewrite precedes any paywall; the official PDF and raw
transcript leave the served site (git history retention is accepted residual
risk).

**Support & ops.** Printed SLAs (48h replies, same-day payment/access, weekly
fix batch), one inbox plus in-product reports, refund and reconciliation
runbooks, uptime/budget/webhook alarms, a Firestore-flag incident banner, and
a 48h pre-exam deploy freeze.

## Testing Decisions

A good test exercises **external behavior** — the states a user or integration
partner can observe — never implementation internals. The suite favors a small
number of behavior-level checks over exhaustive unit scaffolding, because one
person maintains it.

- **Content validators (exists, CI):** schema, options, answer keys,
  duplicates, and index-count consistency run on every change; they are the
  floor for all generated content and the prior art for future validator-style
  tests.
- **Paywall & content-routing harness (exists):** a Node harness with a DOM
  shim asserts the gate's observable behavior — root-path math on both
  origins, app-mode detection and session persistence, premium-vs-free
  routing, locked rejections without static fallback, flag-on walls on
  premium paths and their absence on free shells, and lossless UTF-8 chunk
  round-trips against the real question bank.
- **Webhook function (to add — the highest-value gap):** unit tests with a
  stubbed Admin SDK covering signature rejection, capture grant, retry
  idempotency, validity stacking from a future expiry, plan mapping fallback
  by amount, unmatched-payment auditing, and refund revocation. External
  behavior only: HTTP status plus resulting document states.
- **Adversarial content gate (to build with the pipeline):** the cross-model
  refutation tool is itself content testing; its acceptance test is a small
  golden set of deliberately wrong questions it must flag.
- **End-to-end entitlement flow (manual, gated):** the checkpoint requires a
  scripted test-mode pass — sign-in → checkout → test payment → webhook grant
  → premium read → dashboard refund → revocation — following the deploy
  runbook. This is a launch gate, not an automated suite.
- Presentation surfaces (report layout, share card, interstitial styling) are
  verified by eye against the prototype and design source; no DOM-snapshot
  tests.

## Out of Scope

- **iOS / App Store** — mobile means Play via TWA; iOS would be a fresh
  effort.
- **Live coaching, cohorts, doubt-solving** — subscription content only;
  doubt-solving is explicitly refused in the support charter.
- **Onboarding additional exams** (rrbprep etc.) — the schema stays
  extensible, but execution is a future effort.
- **Auto-recurring billing / UPI Autopay** — validity plans only at v1;
  mandates revisit later as an optional add-on.
- **Monetary referral programs** — v1 referral is the shareable report card
  only.
- **Phone OTP auth**, **Hindi translations** (schema slot reserved), **custom
  analytics dashboards**, **video content** (least defensible, most pirated),
  **status page**, **WhatsApp support**.
- **In-app purchases / Play Billing** — the app is consumption-only; selling
  stays on the web.
- **GST mechanics** until the ₹20L threshold approaches; **DPDP tooling**
  until duties commence (13 May 2027).
- **Extraction of day-page/cheatsheet inline HTML into the gated store** —
  accepted v1 gap, post-launch content work.

## Further Notes

- **Decision provenance:** the wayfinder map at `norcetprep/.wayfinder/` is
  the canonical decision record — 14 closed tickets (5 research, 7 grilling,
  1 prototype, 1 task) each holding its full resolution; this PRD cites them
  by name and must not drift from them. The register asset
  (`prd-nursedrill-e2e.md` under the map's assets) tags every requirement
  BUILT / CONSOLE / TODO / FEB-WAVE / RED-PATH and is the quickest view of
  the remaining gap.
- **Current state (2026-08-01):** Phases 1–3 are built repo-side and deploy
  dark (hosting config, legal pages with owner TODO markers, accounts,
  paywall machinery, checkout, webhook, design system). Nothing is pushed;
  pushing publishes the tracker in a public repo and updates the live free
  site — both intended, owner-confirmed timing. All console-side work
  (domains, Firebase config, gateway KYC, payment pages, content upload,
  analytics id) is the deploy runbook's checklist, and the still-open
  *Business & payment prerequisites* ticket collects the resulting facts.
- **The calendar is the forcing function:** gateway KYC and the domain
  purchase are the slowest external clocks and run first; the NORCET-9
  rewrite is the only content blocker on the checkpoint; 18 Sep 2026
  (prelims results) is the hard gate; missing the season moves paid to
  Jan 2027 via the waitlist, not to a worse compromise.
- **Public repository caveat:** the repo (including this PRD and the tracker)
  is world-readable. No credentials, keys, or personal data may appear in
  any planning artifact; premium content's history exposure is accepted and
  shrinks to near-nil once unpublished from serving surfaces.
- **Voice guardrail for all future copy:** confident honesty — real dates,
  printed deadlines that never move, no countdown widgets, no fake scarcity,
  no invented authority. If a growth tactic needs a dark pattern, the tactic
  is wrong.
