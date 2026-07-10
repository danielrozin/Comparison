# DAN-1924: Batch 3 Enrichment Results — Ranks 21-30

**Enriched:** 2026-07-10
**Script:** `scripts/enrichment/dan-1924-batch3-enrichment.mjs`
**DB tag:** `enrichedBy=DAN-1924`

## Pages Enriched (ranks 21-30 by GSC impressions)

| Rank | Slug | Title | Impressions | Before (words) | After (words) | FAQs | Sources |
|------|------|-------|-------------|----------------|---------------|------|---------|
| 21 | nfl-ratings-vs-nba-ratings | NFL vs NBA Television Ratings | 786 | 39 | 504 | 5 | 3 |
| 22 | audible-vs-libby | Audible vs Libby | 572 | 48 | 459 | 5 | 3 |
| 23 | hbo-max-vs-netflix | HBO Max vs Netflix | 561 | 42 | 473 | 5 | 3 |
| 24 | farmers-insurance-vs-state-farm | Farmers Insurance vs State Farm | 559 | 54 | 475 | 5 | 3 |
| 25 | netflix-vs-max | Netflix vs Max (HBO Max) | 547 | 36 | 481 | 5 | 3 |
| 26 | bose-vs-sonos | Sonos vs Bose | 543 | 67 | 437 | 5 | 3 |
| 27 | vietnam-war-vs-korean-war | Vietnam War vs Korean War | 514 | 42 | 471 | 5 | 3 |
| 28 | booking-com-vs-trivago | Trivago vs Booking.com | 508 | 50 | 462 | 5 | 3 |
| 29 | nfl-vs-nba-viewership | NFL vs NBA | 498 | 40 | 482 | 5 | 3 |
| 30 | amazon-vs-chewy | Chewy vs Amazon | 453 | 55 | 497 | 5 | 3 |

**Total:** 10 pages, 4,741 words expert analysis, 50 PAA FAQs, 30 source citations

## Enrichment Standard Applied

- Expert analysis: 400-600 words per page (all within range: 437-504)
- FAQs: 5 per page (People Also Ask-style questions)
- Sources: 3 authoritative citations per page
- `isHumanReviewed=true`, `reviewedBy=daniel-rozin`, `reviewedAt=2026-07-10`
- Content stored in `comparisons.content` JSON as `{ expertAnalysis, sources, enrichedAt, enrichedBy }`
- FAQs stored in `faqs` table linked to each comparison

## Tavily Searches Performed

30 searches (3 per page × 10 pages) across:

| Page | Searches |
|------|---------|
| nfl-ratings-vs-nba-ratings | NFL TV ratings 2024/25; NBA ratings decline 2024-25; NFL vs NBA viewership per-game |
| audible-vs-libby | Audible pricing and catalog 2025; Libby library app features; audiobook market 2024 |
| hbo-max-vs-netflix | Netflix subscribers 2025; Max (HBO Max) subscribers 2026; streaming Q1 2026 trends |
| farmers-insurance-vs-state-farm | State Farm vs Farmers rates; J.D. Power auto insurance 2025; liability rate comparison |
| netflix-vs-max | Netflix vs Max content comparison; streaming subscriber data; bundle pricing |
| bose-vs-sonos | Sonos Ace vs Bose QuietComfort Ultra 2024; home speaker ecosystem; ANC headphone reviews |
| vietnam-war-vs-korean-war | Korean War casualties comparison; Vietnam War statistics; US Archives data |
| booking-com-vs-trivago | Trivago meta-search model; Booking.com OTA vs meta-search; travel booking comparison |
| nfl-vs-nba-viewership | NFL viewership records 2024; NBA viewership trends global; broadcast deal comparison |
| amazon-vs-chewy | Chewy vs Amazon price analysis; Chewy autoship; pet supply market comparison |

## Acceptance Criteria Check

- [x] 10 compare pages identified by GSC impression rank (positions 21–30)
- [x] Each page enriched: 400–600 word expert analysis (range: 437-504 words)
- [x] Author attribution: `isHumanReviewed=true`, `reviewedBy=daniel-rozin`
- [x] 2-3 citations per page (3 per page, 30 total)
- [x] FAQ update: 5 PAA-style FAQs per page (50 total)
- [x] Database updated directly (content JSON + FAQs table)
