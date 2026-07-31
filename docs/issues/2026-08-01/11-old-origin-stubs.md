# Issue 11 — Old-origin stubs + Search Console change-of-address

## Parent PRD
[docs/prds/2026-08-01/nursedrill-e2e.md](../../prds/2026-08-01/nursedrill-e2e.md)

## What to build

Consolidate SEO on the owned brand (PRD user story 31). One repo serves both
origins, so stubs must be **origin-conditional**: on the legacy github.io
host, pages canonical-and-redirect to their nursedrill.com equivalents; the
product domain is untouched. Then file the Search Console change-of-address
so the young equity moves before it grows.

## Acceptance criteria

- [ ] Visiting any legacy-origin URL redirects (instant meta-refresh or
      script) to the same path on nursedrill.com, and its canonical points
      there; the product domain's rendering is bit-identical to before.
- [ ] The sitemap references only nursedrill.com URLs; robots stays sane on
      both origins.
- [ ] Search Console: new domain property verified, sitemap submitted,
      change-of-address filed from the old property.
- [ ] The personal site outside the product directory is untouched.
- [ ] Spot-check: the top-ranking free topic pages resolve correctly
      end-to-end from old URL to new content.

## Blocked by

- Blocked by [issue 10](10-go-live-flip.md) (stubs follow go-live per the
  launch sequencing decision; canonicals alone flip earlier via the existing
  script).

## User stories addressed

- User story 31 (SEO equity consolidates on nursedrill.com)
