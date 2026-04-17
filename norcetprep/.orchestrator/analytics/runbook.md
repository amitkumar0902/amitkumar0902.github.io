# Analytics runbook — Google Search Console

## Export (monthly)

1. Open [Google Search Console](https://search.google.com/search-console) → select property `https://amitkumar0902.github.io/`.
2. **Performance** → **Search results** → set range **Last 28 days** (or 3 months for trends).
3. **Export** → Download **Excel** or **Google Sheets**.

## Columns to keep

- Query  
- Page  
- Clicks  
- Impressions  
- CTR  
- Position  

## Optional report in repo

Create `norcetprep/.orchestrator/analytics/reports/YYYY-MM.md` with:

- Top 10 queries by impressions (site or filtered by `/norcetprep/`).
- URLs with **high impressions, low CTR** → candidate for title/meta rewrite.
- Queries with **average position 8–15** → add 300–500 words + internal links on the matching page.

## Template snippet

```markdown
## GSC notes — YYYY-MM

### Top queries
| Query | Clicks | Impr | CTR | Pos |
|-------|--------|------|-----|-----|

### Actions
- [ ] Page X: tweak title for query "…"
- [ ] Add FAQ section to norcet-….html for "…"
```

## Search Console setup

- **Sitemap**: submit `https://amitkumar0902.github.io/norcetprep/sitemap.xml`
- Verify domain or URL-prefix property per GitHub Pages docs.
