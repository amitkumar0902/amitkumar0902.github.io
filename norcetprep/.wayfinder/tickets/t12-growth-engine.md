---
id: T12
title: Growth & distribution engine
labels: [wayfinder:grilling]
status: closed
assignee: amit
blocked-by: []
---

## Question

With the wedge ([Competitor & pricing landscape](t01-competitor-landscape.md))
and brand ([Brand, domain & trust](t08-brand-domain-trust.md)) locked, decide
how NurseDrill acquires and converts aspirants — and what it deliberately
won't do:

- On-product free funnel: daily free quiz / PYQ-of-the-day / streaks living on
  the site + app — competitor research found incumbents outsource their funnel
  to Telegram/YouTube; ours should convert where the paywall is.
- Feeder channels: what runs on Telegram / YouTube / Instagram as *feeders,
  not homes* — and the owner's realistic weekly time budget for them.
- The existing SEO orchestrator loop: how it continues under nursedrill.com
  (it currently optimizes github.io URLs).
- Launch-window motion for the 12 Sep NORCET 11 cycle: what ships during the
  Jul–Sep buying season, and launch-offer mechanics that don't violate the
  no-dark-patterns trust posture.
- Referral / word-of-mouth mechanics worth building in v1 vs later.
- Instrumentation (graduated from map fog once
  [Platform & entitlement architecture](t07-platform-architecture.md) fixed the
  stack as Firebase): which funnel analytics — GA4 vs a privacy-light
  alternative — which conversion events (signup, sample→paywall hit, checkout
  out-click, webhook-confirmed purchase), and where dashboards live.

## Resolution

Decided 2026-07-31 in a grilling session with the owner. Product-shape
clarification confirmed along the way: **NurseDrill is a separate,
nursing-only product** — own domain, own Play Store app — fully independent of
the owner's personal site.

**Time budget — the constraint everything fits inside:** ~**5 h/week**
steady-state for all growth work (on top of ~1.5–3 h content review and
support). Any motion that exceeds it gets automated or dropped.

**Conversion home — on-product:** the daily free quiz (10 questions from the
verified bank) + streaks ship at v1; PYQ-of-the-day surfaces on-site. Feeders
point in; conversion happens where the paywall is.

**Feeders — both, lightly:**
- **Telegram (backbone, automated):** a NurseDrill-branded channel; a bot
  auto-posts the daily MCQ + PYQ-of-the-day from the verified bank, each
  linking into the on-site quiz; also the announcement line for weekly mocks
  and launch. Near-zero marginal effort after the bot exists (a small
  scheduled function fits the Firebase stack). Seed it during Phase 2
  (August) so the channel has a pulse before the paywall flips.
- **Instagram (secondary, manual-light):** 1–2 posts/week from the existing
  labelled diagrams/flashcards as carousels; explicitly the first thing
  dropped in a busy week — no follower goals that create obligation.
- **YouTube: ruled out as an engine** (no-video economics; most-pirated
  format) — at most occasional one-off strategy posts.

**Referral v1 — shareable report cards:** the cutoff-anchored mock report
renders as a clean shareable image (score, est. cutoff band, brand); share
CTA after every mock — aspirants already flex scores in Telegram/WhatsApp
groups, so every share is an organic ad. **No monetary referrals at v1**
(credit ledger + abuse surface deferred; revisit post-revenue).

**SEO loop:** the existing `.orchestrator` sprint loop continues at its
cadence, retargeted after Phase 1's change-of-address — focus URLs move to
nursedrill.com equivalents; outreach templates rebranded (NurseDrill naming +
AIIMS disclaimer).

**Instrumentation — GA4 via the Firebase SDK**, minimal event set: signup ·
sample→paywall view · checkout out-click · purchase (confirmed on the success
screen; webhook remains the entitlement truth) · daily-quiz start/complete ·
report-card share. Dashboards: GA4's standard funnel — no custom dashboard
until a real question demands one. Plain disclosure in the privacy policy;
revisit a privacy-light alternative when DPDP duties commence (May 2027).

**Launch-window motion:** per
[Launch sequencing & migration](t13-launch-sequencing.md) — quiet-confident;
in fallback mode the founding-waitlist copy flows through these same
channels.

Feeds: [Support & ops](t14-support-ops.md) (support surface stays distinct
from marketing channels); the build plan (quiz, streaks, share-card renderer,
Telegram bot, GA4 events).
