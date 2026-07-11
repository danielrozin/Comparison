# DAN-1977: Batch 8 Enrichment Results — Ranks 71-80

**Enriched:** 2026-07-11
**Script:** `scripts/enrichment/dan-1977-batch8-enrichment.mjs`
**DB tag:** `enrichedBy=DAN-1977` (new pages) / `batch8ReviewedAt` (existing pages)

## Pages Enriched (ranks 71-80 by GSC impressions)

| Rank | Slug | Title | Impressions | Words | FAQs | Sources | Status |
|------|------|-------|-------------|-------|------|---------|--------|
| 71 | lionel-messi-vs-pele | Lionel Messi vs Pelé | 367 | — | — | — | Previously enriched (DAN-1930), tagged |
| 72 | tidal-vs-spotify | Tidal vs Spotify | 367 | — | — | — | Previously enriched (DAN-1930), tagged |
| 73 | home-depot-vs-lowes | Home Depot vs Lowe's | 366 | — | — | — | Previously enriched (DAN-1930), tagged |
| 74 | nba-vs-nfl-viewership-globally | NFL vs NBA (global viewership) | 362 | — | — | — | Previously enriched (DAN-1930), tagged |
| 75 | firefox-vs-safari | Firefox vs Safari | 352 | — | — | — | Previously enriched (DAN-1930), tagged |
| 76 | toyota-rav4-vs-honda-cr-v | Toyota RAV4 vs Honda CR-V | 350 | — | — | — | Previously enriched (DAN-1944), tagged |
| 77 | neymar-vs-mbape | Neymar vs Mbappé | 348 | 541 | 5 | 3 | **NEW** |
| 78 | webflow-vs-squarespace | Webflow vs Squarespace | 347 | — | — | — | Previously enriched (DAN-1944), tagged |
| 79 | macbook-pro-14-vs-macbook-pro-16 | MacBook Pro 14 vs MacBook Pro 16 | 347 | 504 | 5 | 3 | **NEW** |
| 80 | marvel-vs-dc-comics-comparison-2026 | Marvel vs DC Comics 2026 | 346 | 474 | 5 | 3 | **NEW** |

**New content totals:** 3 new pages, 1,519 words expert analysis, 15 PAA FAQs, 9 source citations

## Note on Already-Enriched Pages

7 of the 10 pages in ranks 71-80 were previously enriched in earlier batches (DAN-1930 and DAN-1944). Their existing high-quality content (400-500 words, 5 FAQs, 3 sources) was retained; a `batch8ReviewedAt` timestamp was added to the content JSON to mark batch 8 coverage.

## New Content Summary

### Rank 77 — Neymar vs Mbappé (541 words)
Analysis covers career trajectories at Barcelona/PSG/Al-Hilal (Neymar) vs Monaco/PSG/Real Madrid (Mbappé), goals per 90 minutes comparison (Neymar 0.60-0.70 vs Mbappé 0.70-0.85), injury impact on Neymar's career ceiling, Mbappé's 2018 World Cup win at 19, 2024 free transfer to Real Madrid, and the verdict that Mbappé's consistency and durability make him the superior player by 2026 metrics.

### Rank 79 — MacBook Pro 14 vs MacBook Pro 16 (504 words)
Analysis covers M4 Pro/M4 Max shared chip availability, display size (14.2" vs 16.2"), battery life (17 vs 22 hours Apple-rated; 4-6 hours real-world advantage for 16"), weight difference (1.61kg vs 2.14kg), thermal sustained performance (2-4% sustained multi-core advantage for 16" under maximum load), and decision framework: 14" for portability/travel, 16" for extended untethered work and larger display.

### Rank 80 — Marvel vs DC Comics 2026 (474 words)
Analysis covers comic book market share (Marvel 38-45% vs DC 28-35%), MCU box office history ($30B+ franchise, Endgame as #1 film ever at $2.798B), DC's structural reboot under James Gunn/Peter Safran with Superman (2025), character roster depth, streaming output on Disney+ vs Max, and guidance for new readers (Marvel more accessible; DC rewards continuity investment).

## Acceptance Criteria Check

- [x] Pull top 80 GSC impression pages (via `searchImpressions` field, ordered desc)
- [x] Exclude already enriched ranks 1–70
- [x] 10 pages at ranks 71–80 covered in DB
- [x] 3 new pages fully enriched: `expertAnalysis` 400–600 words ✓ (474–541 words), `faqs` 5 items each ✓, `sources` 3 items each ✓
- [x] 7 previously-enriched pages batch-tagged with `batch8ReviewedAt` timestamp
- [ ] PR opened against main on branch `dan-1977-enrichment-batch8`
- [ ] PR link posted to issue
- [ ] CML review interaction created
