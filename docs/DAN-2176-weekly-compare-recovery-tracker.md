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
| 2026-07-20 | ~~416~~ → **523** | −97.3% | 0 | 176 | W30 — GSC retroactive revision (+26%); still at floor |
| 2026-07-27 | ~~302~~ → **343** | −98.2% | 0 | 102 | W31 — GSC retroactively revised 302→343 (+13.6%); still at floor |
| 2026-08-03 | ~~115~~ → **181** | −99.1% | 0 | 71 | W32 complete (2026-08-11 read); GSC revised 115→181 |

## Read — 2026-08-11 (W32 complete)

**Still suppressed. No reversal. Seven post-collapse weeks. Deepening week-over-week decline.**

- **W32 final: 181 impressions**, −99.1% vs baseline. GSC revised up from the 2026-08-08 partial read of ~115 (3 days), consistent with latency correction pattern.
- Script reading today (2026-08-11): W31 = 302 (script shows lower than the 343 noted on 2026-08-08; GSC data fluctuates slightly with latency windows — treat W31 as ~302–343, both at −98%). W32 = 181 (complete).
- **Pages with impressions: 71** — new low since the collapse. W30 had 176, W31 had 102, W32 has 71. The visible crawl footprint is shrinking within the already-suppressed set.
- **Clicks: 0** for all seven post-collapse weeks (down from 42/wk at baseline).
- **WoW trend: deepening.** W31 (~302–343) → W32 (181) = approximately −40% to −47% WoW. Not noise.
- **vs baseline (19,561): −99.1%** — worst week on record.
- **No new technical levers available.** All fixes shipped and indexed before next SpamBrain refresh. Recovery awaits an algorithm update, not a crawl event.

**Verdict: Still suppressed. No SpamBrain refresh signal. Continue weekly tracking.**

## Read — 2026-08-08 (W32 mid-week check)

**Still suppressed. W31 revised upward 302→343 (GSC latency). W32 partial shows ~38/day rate. No SpamBrain refresh signal.**

- W31 revised: 302 → 343 (GSC retroactive correction, consistent with prior pattern). Still −98.2% vs baseline.
- W32 partial (115 impressions in 3 days = ~38/day run-rate) — slightly below W31's 343/7 = 49/day. Partial data; interpret cautiously. Will be revised upward next read.
- **No new technical levers available.** All fixes shipped and crawled (consolidation, quality gate, dead-link removal, redirects). Suppression is algorithm-level; lift requires SpamBrain refresh.

**Recovery condition unchanged:** suppression lifts on a SpamBrain algorithm refresh, not on a crawl of the fixes. Continue weekly tracking.

## Read — 2026-08-06 (W32 start check)

**Still suppressed. W32 partial data trending lower. No SpamBrain refresh signal.**

- W32 partial (45 impressions in 2 days = ~22/day run-rate) is on pace for ~158/week — further decline from W31 (302/7 = 43/day). Partial data; interpret cautiously.
- **No new technical levers available.** All fixes shipped and crawled (consolidation, quality gate, dead-link removal, redirects). Suppression is algorithm-level; lift requires SpamBrain refresh.

**Recovery condition unchanged:** suppression lifts on a SpamBrain algorithm refresh, not on a crawl of the fixes. Continue weekly tracking.

## Read — 2026-08-04 (W31 complete)

**Still suppressed. No reversal. Six post-collapse weeks, all pinned to floor.**

- **W31 (302)** vs W30 revised (523) is **−42.3% WoW** — decline, not improvement. Both weeks are ~−97–98% vs baseline. Note: W30 was retroactively revised by GSC from 416 → 523 since the last check (2026-07-28); this is normal GSC latency, not a real prior-week spike.
- Five post-collapse complete weeks: W27 433 → W28 454 → W29 397 → W30 523 → W31 302. Oscillating in the 300–523 band, all ≥−97% vs baseline.
- **Clicks remain 0** for all five post-collapse weeks (down from 42/wk at baseline).
- Pages with impressions: W31 **102** — lowest since the collapse (W27 baseline was 806). Slight downward drift in crawl exposure.
- No SpamBrain refresh signal. All shipped levers (84-cluster consolidation, generator quality gate, neymar deepening, dead-link purge) remain indexed and awaiting the refresh.

**Recovery condition unchanged:** suppression lifts on a SpamBrain algorithm refresh, not a crawl of the fixes. Continue weekly tracking.

## Read — 2026-07-28 (W30 complete)

**Still suppressed. No reversal. Five post-collapse weeks, all pinned to floor.**

- **W30 (416 at time of read, later revised to 523 by GSC)** vs W29 (397) — noise-level fluctuation at time of read.
- Levers shipped and indexed: 84-cluster consolidation + 301s, generator quality gate, neymar deepening, archival batches (DAN-2519/2520/2532), 680 dead internal links resolved (DAN-2581, PR #238). All fixes in place and crawled before next SpamBrain refresh.

**Recovery condition unchanged:** suppression lifts on a SpamBrain algorithm refresh, not on a crawl of the fixes. Continue weekly tracking.

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
| 2026-08-11 | W27–W32 | Still suppressed. W32 final 181 (GSC revised from 115 partial). Pages=71 (new low). WoW ~−40%. Seven weeks at floor. No reversal. |
| 2026-08-08 | W27–W32 | Still suppressed. W31 revised 302→343 (GSC latency). W32 partial 115/3days (~38/day). Seven weeks at floor. No reversal. |
| 2026-08-06 | W27–W32 | Still suppressed. W32 partial trending lower (~22/day vs W31's 43/day). Six weeks at floor. No reversal. |
| 2026-08-04 | W27–W31 | Still suppressed, W31 302 (−42.3% WoW vs W30 revised 523). W30 GSC-revised 416→523. Six weeks at floor. No reversal. Continue. |
| 2026-07-28 | W27–W30 | Still suppressed, W30 416 (later revised to 523 by GSC). Five weeks at floor. No reversal. Continue. |
| 2026-07-21 | W27–W29 | Still suppressed, W29 final 397 (−12.6% WoW). DAN-2581 dead-link fix live. No reversal. Continue. |
| 2026-07-16 | W27–W29 | Still suppressed, flat at ~−98%. No reversal. Continue. |
