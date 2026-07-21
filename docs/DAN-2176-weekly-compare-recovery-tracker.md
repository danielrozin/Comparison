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
| 2026-07-13 | 397 | −98.0% | 0 | 153 | W29 — still suppressed (updated from 125 partial on 07-16) |

## Read — 2026-07-21 (W29 complete + W30 start)

**Still suppressed. No reversal. Four post-collapse weeks, all pinned to floor.**

- **W29 final (397)** vs W28 (454) is **−12.6% WoW** — a slight decline, not improvement.
- Three post-collapse complete weeks: W27 433 → W28 454 → W29 397. All within noise range of each other, all at ~−98% vs baseline.
- **Clicks remain 0** all three post-collapse weeks (down from 42/wk at baseline).
- Pages with impressions: W27 116 → W28 151 → W29 153 — marginally wider corpus but still 81% fewer than baseline (806).
- Dead-link fix ([DAN-2581](/DAN/issues/DAN-2581), PR #238 merged 2026-07-21) eliminated 680 internal 404s across 23% of the site — this should improve crawl quality signals once Googlebot re-crawls, but will not manifest in GSC impressions until a SpamBrain algorithm refresh fires.

**Levers shipped:** 84-cluster consolidation + 301s, generator quality gate, neymar deepening, subsequent consolidation batches (DAN-2519/DAN-2520/DAN-2532 archived low-signal pages), 680 dead internal links resolved (DAN-2581). All fixes must be in place and crawled *before* the SpamBrain refresh to benefit from it — which they now are.

**Disposition:** DAN-1800 stays `done`. Tracking continues weekly here. Close-out condition unchanged: a **sustained multi-week impression climb** post-refresh, at which point report recovery to DAN-1799.

## Read — 2026-07-16 (W29 check — partial)

**Still suppressed. No reversal.** Third consecutive week pinned to the floor.

- W28 (454) vs W27 (433) is **+4.8% WoW**, but that is noise at this magnitude, not recovery — both weeks are ~−98% against baseline.
- W29 partial run-rate (125 over ~2 elapsed GSC days ≈ 62/day) tracked W28 (454/7 ≈ 65/day) — flat.

## Log

| Date | Weeks checked | Verdict |
|---|---|---|
| 2026-07-21 | W27–W29 | Still suppressed, W29 final 397 (−12.6% WoW). DAN-2581 dead-link fix live. No reversal. Continue. |
| 2026-07-16 | W27–W29 | Still suppressed, flat at ~−98%. No reversal. Continue. |
