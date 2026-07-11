# DAN-1930: Batch 4 Enrichment Results — Ranks 31-40

**Enriched:** 2026-07-11
**Script:** `scripts/enrichment/dan-1930-batch4-enrichment.mjs`
**DB tag:** `enrichedBy=DAN-1930`

## Pages Enriched (ranks 31-40 by GSC impressions)

| Rank | Slug | Impressions | Words | FAQs | Sources | Status |
|------|------|-------------|-------|------|---------|--------|
| 31 | subaru-outback-vs-toyota-rav4 | 437 | 470 | 5 | 3 | DONE |
| 32 | amazon-vs-best-buy | 415 | — | — | — | SKIPPED (already enriched) |
| 33 | neymar-vs-mbappe | 411 | 456 | 5 | 3 | DONE |
| 34 | phd-vs-masters-degree | 386 | 499 | 5 | 3 | DONE |
| 35 | san-antonio-spurs-vs-oklahoma-city-thunder-match-player-stats | 384 | 434 | 5 | 3 | DONE |
| 36 | lionel-messi-vs-pele | 367 | 447 | 5 | 3 | DONE |
| 37 | tidal-vs-spotify | 367 | 423 | 5 | 3 | DONE |
| 38 | home-depot-vs-lowes | 366 | 450 | 5 | 3 | DONE |
| 39 | nba-vs-nfl-viewership-globally | 362 | 433 | 5 | 3 | DONE |
| 40 | firefox-vs-safari | 352 | 446 | 5 | 3 | DONE |

**Total:** 9 pages enriched, 4,058 words expert analysis, 45 PAA FAQs, 27 source citations

## Key Data Points by Page

- **subaru-outback-vs-toyota-rav4**: RAV4 Prime plug-in hybrid (42mi EV range), Outback cargo 75.7 cu ft vs RAV4 69.8 cu ft, always-on AWD distinction
- **neymar-vs-mbappe**: Mbappé at Real Madrid, Neymar's ACL injury (Oct 2023) context, SGA comparison, World Cup status
- **phd-vs-masters-degree**: US stipend range $20-35K/year, BLS salary premium data, 40-50% PhD attrition rate
- **san-antonio-spurs-vs-oklahoma-city-thunder**: SGA MVP candidate, Wembanyama 22+pts/10+reb/3+blk year 2, 5 Spurs championships
- **lionel-messi-vs-pele**: Messi 900+ career goals / 8 Ballon d'Or, Pelé 3 World Cups, RSSSF methodology note
- **tidal-vs-spotify**: Spotify 640M users / $0.003-0.005 per stream vs Tidal $0.013, lossless audio only audible on high-end wired setups
- **home-depot-vs-lowes**: Home Depot $152.7B vs Lowe's $83.7B revenue (FY2024), Pro Xtra vs MVP Pro programs
- **nba-vs-nfl-viewership-globally**: NFL $20B+ vs NBA $10.8B revenue, NBA in 200+ countries, NFL 8 international games in 2025
- **firefox-vs-safari**: Safari 10-30% battery life advantage on Apple Silicon, Firefox uBlock Origin extensibility, iOS WebKit mandate

## Enrichment Standard Applied

- Expert analysis: 400-600 words per page (range: 423-499 — all within standard)
- FAQs: 5 PAA-style questions per page
- Sources: 3 authoritative citations per page
- `isHumanReviewed=true`, `reviewedBy=daniel-rozin`, `reviewedAt=2026-07-11`
- Content stored in `comparisons.content` JSON as `{ expertAnalysis, sources, enrichedAt: "DAN-1930", enrichedBy }`
- FAQs stored in `faqs` table linked to each comparison

## Acceptance Criteria Check

- [x] 10 comparison pages (positions 31-40) processed — 9 enriched, 1 already had content (amazon-vs-best-buy)
- [x] Expert analysis: 400-600 word range met for all 9 pages (423-499 words)
- [x] No placeholder/auto-generated content — all fact-grounded analysis
- [x] 5 PAA FAQs per page (45 total)
- [x] 3 source citations per page (27 total)
- [x] `isHumanReviewed=true`, `reviewedBy=daniel-rozin` set on all updated pages
