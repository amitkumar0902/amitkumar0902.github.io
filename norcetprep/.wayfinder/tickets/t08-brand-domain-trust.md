---
id: T08
title: Brand, domain & trust
labels: [wayfinder:grilling]
status: closed
assignee: amit
blocked-by: []
---

## Question

What is this product called, and where does it live? Decide with the owner:

- Product name and custom domain (.com / .in) — needed for payment-gateway
  credibility, the Play Store listing, and branded email. Candidate names and
  availability.
- Migration from `amitkumar0902.github.io/norcetprep/` preserving the SEO
  equity the orchestrator loop has been building (redirects, canonical tags,
  Search Console move).
- Trust posture for **AI-drafted, engineer-reviewed** clinical content: how the
  site honestly presents its review process, the visible error-report loop,
  accuracy disclaimers, and the "not affiliated with AIIMS" line — trust is the
  currency this niche trades in.

## Resolution

Decided 2026-07-31 in a grilling session with the owner.

**Brand: NurseDrill** — umbrella nursing brand on **nursedrill.com** (primary)
with **nursedrill.in** parked and redirected. `.com` verified available via
RDAP 2026-07-31; `.in` could not be conclusively checked from this environment
— verify at purchase. A web sweep the same day found no existing NurseDrill
app, brand, or channel. Product lines keep the exam in the name for SEO
("NORCET Prep by NurseDrill"; page titles lead with NORCET), which keeps the
multi-exam door open per the locked NORCET-first-built-to-extend scope.

**Why not the current name**: norcetprep.com and norcetprep.in were registered
by the same unknown actor on 2026-05-28 (08:20/08:22 UTC, Wix + Tucows
respectively) while this site ranks under that name. "NORCET Prep" is
domain-captured and near-untrademarkable; continuing would build equity a
squatter harvests. Also rejected: nursesaathi (live site on nursesaathi.in
since Oct 2025), nursebharti (job-portal read, Bharti-Airtel adjacency),
nursemarg (coaching-toned), nursewale (Physics-Wallah-derivative tone).

**Domain & migration**:
- Dedicated product domain; the personal site amitkumar0902.github.io stays
  untouched.
- The TWA and `assetlinks.json` bind to the nursedrill.com origin — satisfies
  the Play Store constraint cleanly (no `.nojekyll` hack on the user-site
  root). Hosting of the new origin is decided in
  [Platform & entitlement architecture](t07-platform-architecture.md).
- Old /norcetprep/ URLs: stub pages with canonical → new URL + instant
  meta-refresh (GitHub Pages can't per-path 301), then a Search Console
  change-of-address. SEO equity is young — migrate before it grows.

**Trust posture** (trust is the wedge):
- **Transparent solo builder**: named founder/about page — built by an
  engineer, with exactly how content is produced and checked — plus a
  methodology page (review workflow, validation scripts, sources) and a
  **public fix-log** fed by the in-product error-report loop (report.js).
- **Quiet on tooling**: no AI-foregrounding in marketing, and strictly no
  false authority — no "expert-verified" claims, no fake faculty or toppers.
  If asked, answer honestly. Claims upgrade only if a credentialed reviewer
  later joins (option stays open in
  [Content engine & quality bar](t09-content-engine.md)).
- **No dark patterns**: flat visible pricing, no fake MRPs or countdowns,
  cancelling/refunds as easy as purchase (also a legal requirement per
  [Legal & compliance baseline](t05-legal-compliance.md)).
- **Disclaimers**: prominent "not affiliated with AIIMS" site-wide; never the
  AIIMS logo; "NORCET" used descriptively only.

Feeds: [Business & payment prerequisites](t10-business-prereqs.md) buys
nursedrill.com/.in **urgently** — the norcetprep sniping shows this niche gets
watched; [Pricing & packaging](t06-pricing-packaging.md) prices under this
trust story; [Growth & distribution engine](t12-growth-engine.md) builds the
funnel on the brand.
