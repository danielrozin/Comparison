# aversusb.net organic collapse — diagnosis and financial impact

**Author:** Financial Analyst · **Date:** 2026-07-14
**Data source:** Google Search Console API (Search Analytics + URL Inspection), property `sc-domain:aversusb.net`
**Reproduce:** `node scripts/gsc-recovery-check.mjs 120`, `node scripts/gsc-collapse-diagnose.mjs`, `node scripts/gsc-inspect-urls.mjs`

## Bottom line

The late-June organic collapse is a **site-level algorithmic suppression**, not a technical fault. Every affected
page is still indexed, crawlable, and content-complete — Google simply stopped surfacing them. **No engineering
fix on the current board will recover this traffic**, and the traffic-first path to $1M ARR is stalled at zero
until a content-strategy decision is made.

## What happened

Weekly organic, site-wide (GSC):

| Week (Mon) | Site clicks | Site impressions | /compare/ impressions |
|---|---|---|---|
| 2026-06-08 | 37 | 14,491 | 12,318 |
| 2026-06-15 | 41 | 24,378 | 18,858 |
| 2026-06-22 | 43 | 21,222 | 19,561 |
| **2026-06-29** | **0** | **380** | **433** |
| 2026-07-06 | 0 | 481 | 454 |

Impressions fell ~98% in a single week and clicks went to **zero**. Two full weeks later there is **no recovery
signal** — the floor is flat, not rising.

Window comparison (2026-06-15..25 vs 2026-07-02..12):

| Metric | Before | After | Change |
|---|---|---|---|
| Pages earning impressions | 1,325 | 293 | **−77.9%** |
| Distinct queries | 4,476 | 227 | **−94.9%** |
| Impressions | 46,105 | 996 | **−97.8%** |
| Clicks | 82 | 0 | **−100%** |
| Avg position (impression-weighted) | 23.6 | 37.9 | **−14.3 ranks** |

1,176 of the 1,325 previously-ranking pages now earn **zero** impressions. The pre-collapse traffic leaders
(`/compare/messi-vs-ronaldo` at 8,053 impressions, `/compare/ps5-pro-vs-xbox-series-x…` at 4,666) are gone
from the results entirely.

## Why it is NOT a technical fault

This was the hypothesis worth killing, because it implies a cheap fix. It does not survive the evidence.

I inspected the vanished top pages through the **GSC URL Inspection API** — Google's own authoritative verdict:

```
/compare/messi-vs-ronaldo
  verdict         : PASS
  coverageState   : Submitted and indexed
  robotsTxtState  : ALLOWED
  indexingState   : INDEXING_ALLOWED
  pageFetchState  : SUCCESSFUL
  lastCrawlTime   : 2026-07-09T19:10:27Z
  googleCanonical : /compare/messi-vs-ronaldo   (matches userCanonical)
```

Identical `PASS` / `Submitted and indexed` for every vanished page tested. Independently confirmed:

- Site serves HTTP 200; apex→www 301 is clean; `robots.txt` is `Allow: /`; no `noindex` anywhere.
- Pages are **fully server-rendered**: correct `<title>`, meta description, one `<h1>`, and 6,000–8,000 words
  of real body content.
- The soft-404 bug is already fixed in production — a garbage slug (`/compare/banana-vs-stapler`) correctly
  returns **404**.
- Googlebot user-agent is served the same content as a browser (no cloaking, no bot-gating).

**Pages that are indexed, crawled, canonical and content-rich but earn zero impressions have been demoted below
the visibility threshold — that is suppression, not deindexing.**

## Consequence for the current board backlog

The open aversusb engineering issues — sitemap redirect entries (DAN b595b85f), 22 reverse-duplicate rivalries
(725a497e), study pages linking to 404s (69e3c7ce), merging PR #145 (DAN-2107) — are **hygiene, not the cure**.
They are worth doing, but none of them will move organic traffic off zero. Any plan that assumes traffic returns
when they land is mis-forecast.

## Most probable cause

The corpus is **~5,857 URLs** of programmatically-generated "X vs Y" comparison pages (sitemap 0–4: 150 + 468 +
5,000 + 234 + 5). Known quality signals already logged on the board: 22 reverse-duplicate rivalries (same matchup
published twice under mirrored slugs), pages linking to 404s, and — until recently — a soft-404 bug that returned
HTTP 200 with generated content for *any* arbitrary slug.

That combination is the textbook profile Google's scaled-content-abuse enforcement targets, and the timing lines
up with the June 2026 spam update. The suppression is a judgment on the corpus **as a whole**, which is why it
hit site-wide and all at once rather than page by page.

## Financial impact

- Organic is the **only** acquisition channel funding the traffic-first $1M ARR plan. It is now **0 clicks/week**.
- The **$20K committed 2026 target** (CEO-ratified, DAN-1088) has **no organic path** in the current state.
- Recovery from a site-level quality action is measured in **months**, requires a *demonstrated* corpus-quality
  change, and is **not guaranteed** — it is not a schedule risk, it is a strategy risk.
- Continuing to spend on content scale (Claude API, DataForSEO, Tavily, Apify) to add more pages of the same kind
  is spending **into** the thing that caused the suppression.

## Recommendation — this is a CEO/board decision, not an engineering ticket

1. **Freeze net-new programmatic page generation** until a corpus-quality decision is made. Adding pages of the
   same shape can only deepen the signal.
2. **Choose a path, explicitly:**
   - **(A) Consolidate for quality** — prune/merge the ~5,857-URL corpus down to a few hundred genuinely
     differentiated pages, `noindex` the rest, remove the duplicate rivalries, then wait for reassessment.
     Slow (2–6 months), uncertain, but it is the only route that restores organic.
   - **(B) De-risk the $20K off organic** — fund a non-organic channel (paid, direct, partnerships) and treat
     organic recovery as upside rather than the plan.
   These are not mutually exclusive, but (A) alone leaves 2026 revenue with no channel, and (B) alone concedes
   the traffic-first thesis. My recommendation is to run **B for the 2026 number and A for the 2027–28 number**.
3. **Re-measure weekly** with `scripts/gsc-recovery-check.mjs`. The signal to watch is impressions, not clicks —
   impressions will lift first if a reassessment lands.

## Caveats

- URL Inspection was run on a sample of 6 URLs (4 vanished leaders + 2 controls), not the full 1,176. All six
  returned identical `PASS` / indexed status, and the aggregate Search Analytics data is consistent with that,
  so I am confident in the conclusion — but the *cause* (scaled-content enforcement) is an inference from the
  corpus profile and timing, not something Google states via API.
- A manual action, if one exists, is only visible in the GSC web UI (`Security & Manual Actions`) and is **not
  exposed by any API**. Someone with UI access should check it — that is a five-minute, high-information check
  and would upgrade the cause from inference to fact.
