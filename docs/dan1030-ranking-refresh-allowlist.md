# DAN-1030 — Already-ranking comparison slugs (refresh pin allow-list)

**Deliverable for the refresh pipeline** (`refreshStaleComparisons(limit, onlySlugs)` /
`getComparisonsForRefresh(limit, { onlySlugs })`, wired in DAN-1027).

## What to use

- **Allow-list:** `scripts/data/dan1030-pinned-slugs.json` — JSON array of **165**
  comparison slugs, every one confirmed to exist as a `Comparison.slug` row.
- **With signal:** `scripts/data/dan1030-pinned-slugs.csv` —
  `slug,bestPosition,impressions,topKeyword,topVolume`, sorted by impressions proxy.

Pin it directly:

```ts
import slugs from "@/../scripts/data/dan1030-pinned-slugs.json";
await refreshStaleComparisons(limit, slugs);
```

## How it was built

1. **Source:** DataForSEO `dataforseo_labs/google/ranked_keywords/live` for
   `aversusb.net`, `location_code 2840`, `language_code en`, filtered to
   `rank_group <= 100` (every keyword where a page appears on Google pages 1–10).
   Script: `scripts/dan1030-ranking-slugs.mjs`. Pull returned 871 ranking
   keywords (cost $0.097), 765 of them on `/compare/` URLs.
2. **Aggregate** to unique `/compare/` slug → **170 distinct already-ranking
   comparison pages** (matches the "~174" referenced in DAN-1027).
3. **Validate** each slug against the live `Comparison` table (1,642 rows).
   Script: `scripts/dan1030-finalize.mjs`.
   - 163 matched `Comparison.slug` exactly.
   - 2 ranked under reverse pair order and were remapped to their canonical row:
     `mercedes-vs-tesla → tesla-vs-mercedes`,
     `google-pixel-vs-samsung-galaxy → samsung-galaxy-vs-google-pixel`.
   - **165 DB-validated slugs** → the pinned allow-list.

## The `impressions` column

There is no GSC connection wired on this machine, so `impressions` is a
**proxy**, not real Search Console data: for each ranking keyword on the page,
`search_volume × position-based CTR`, summed across the page's keywords. It is
only a ranking/ordering signal for which pages to refresh first — treat it as
directional. If you want auto-selection to match this list exactly, the cleaner
path is to backfill `searchImpressions` from GSC (your offer in the issue); this
proxy is the best available without GSC API access.

## 5 ranking URLs that do NOT map to a Comparison row (not pinnable)

These appear in Google with `/compare/...` URLs but have no `Comparison.slug`
row, so they cannot be refreshed by `onlySlugs`. Listed in
`scripts/data/dan1030-unmatched-urls.json` — likely stale/indexed fallback URLs
(separate cleanup, out of scope for the refresh pin):

- `mercedes-vs-audi` (only model-level pages exist, e.g. `audi-q5-vs-mercedes-glc`)
- `xbox-series-x-vs-nintendo-switch-2`
- `macbook-pro-14-vs-16` (canonical variant `macbook-pro-14-vs-macbook-pro-16` exists)
- `b-2-vs-b-52`
- `paramount-plus-vs-hulu`

## Position footprint of the 170 ranking pages (best position per page)

| Bucket | Pages |
|--------|-------|
| 11–20  | 8     |
| 21–50  | 80    |
| 51–100 | 82    |

No page currently holds a top-10 position — this is the depth/refresh runway
DAN-1027 targets.
