# Google Search Console — baseline setup (Phase 1)

Complete these steps in your browser (cannot be automated in git).

## 1. Add property

1. Open [Google Search Console](https://search.google.com/search-console).
2. Add **URL prefix** property: `https://amitkumar0902.github.io/`
   - Or use **Domain** `amitkumar0902.github.io` if you use DNS verification.
3. Verify using the method GitHub Pages recommends (HTML file or meta tag).

## 2. Submit sitemap

1. In GSC: **Sitemaps** → add:
   - `https://amitkumar0902.github.io/norcetprep/sitemap.xml`
2. Wait for “Success” or note errors (fix broken URLs if any).

## 3. First export (28 days)

1. **Performance** → **Search results** → Date range **Last 28 days**.
2. **Export** (Google Sheets or Excel).
3. Paste summary into `analytics/reports/YYYY-MM.md` (see filled template for March).

## 4. Request indexing (optional)

For key URLs, use **URL Inspection** → **Request indexing**:

- `https://amitkumar0902.github.io/norcetprep/`
- `https://amitkumar0902.github.io/norcetprep/topics/pharmacology.html`
- `https://amitkumar0902.github.io/norcetprep/norcet-free-mock-test.html`

## 5. Done?

Check the box in `analytics/reports/2026-03.md` under **GSC baseline complete**.
