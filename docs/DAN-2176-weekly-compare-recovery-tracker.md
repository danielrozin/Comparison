# DAN-2176 — Weekly /compare/* spam-recovery tracker

**Parent:** DAN-1800 (recovery) → DAN-1799 (collapse)
**Baseline + method:** `docs/DAN-1800-thin-page-audit.md`
**Data source:** Google Search Console API (`sc-domain:aversusb.net`), page dimension filtered to `contains /compare/`, bucketed Mon–Sun.
**Re-run:** `npx tsx scripts/dan2176-weekly-compare-trend.ts --weeks 12`

## Baseline

- **W26 (Jun 22–28) = 19,561 impressions / 806 pages** — last complete pre-collapse week.
- 4-week pre-collapse average (Jun 1–28) = **~15,000 impressions/wk**.
- Collapse onset **June 26** (W27), attributed to the Google June 2026 Spam Update (scaled-content-abuse). Prod is technically healthy: 200 / index,follow / self-canonical. Not a technical fault — do not re-debug as one.

## Weekly trend

| Week (Mon) | Impressions | vs W26 baseline | Clicks | Pages | Note |
|---|---:|---:|---:|---:|---|
| 2026-06-01 | 9,261 | −52.7% | 22 | 478 | pre-collapse |
| 2026-06-08 | 12,318 | −37.0% | 36 | 612 | pre-collapse |
| 2026-06-15 | 18,858 | −3.6% | 40 | 753 | pre-collapse |
| **2026-06-22** | **19,561** | **0.0%** | 42 | 806 | **baseline (W26)** |
| 2026-06-29 | 433 | −97.8% | 0 | 116 | **W27 — collapse** |
| 2026-07-06 | 454 | −97.7% | 0 | 151 | W28 — flat at floor |
| 2026-07-13 | 125 | (partial) | 0 | 67 | W29 — incomplete, GSC ~2-day lag |

## Read — 2026-07-16 (W29 check)

**Still suppressed. No reversal.** Third consecutive week pinned to the floor.

- W28 (454) vs W27 (433) is **+4.8% WoW**, but that is noise at this magnitude, not recovery — both weeks are ~−98% against baseline.
- **Clicks are 0** for both post-collapse weeks (down from 42/wk at baseline).
- Pages with any impressions fell **806 → 116 → 151**, i.e. the corpus is broadly suppressed rather than a few pages losing rank.
- W29 partial run-rate (125 over ~2 elapsed GSC days ≈ 62/day) tracks W28 (454/7 ≈ 65/day) — **flat, not climbing**.

**Levers already shipped and live** (84-cluster consolidation + 301s, grubhub 404, generator quality gate, neymar deepening DAN-1812, subsequent consolidation batches). None have moved impressions yet. This is expected: spam-update suppression typically lifts only on a **SpamBrain refresh**, not on a crawl of the fixes. The fixes must be in place and crawled *before* the refresh to benefit from it — which they now are.

**Disposition:** DAN-1800 stays `done` (the recovery levers shipped; the ticket was scoped to shipping them, not to the algorithmic outcome). Tracking continues weekly here. Close-out condition unchanged: a **sustained multi-week impression climb** post-refresh, at which point report recovery to DAN-1799.

## Log

| Date | Weeks checked | Verdict |
|---|---|---|
| 2026-07-16 | W27–W29 | Still suppressed, flat at ~−98%. No reversal. Continue. |
