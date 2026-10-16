import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Norway vs Sweden.
 * Statistics Norway population tables; Statistics Sweden population statistics, January-June 2026.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Sweden had 10,610,483 residents at 30 June 2026, nearly twice Norway's 5,636,904 at the end of the second quarter of 2026. Sweden grew by 4,954 people in the first half of 2026, with 50,329 births and 47,499 deaths. Norway grew by 33,060 in 2025, with 55,401 births, 45,040 deaths and net migration of 22,324, and by 3,134 in the second quarter of 2026. Stockholm county alone had 2,493,767 residents.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Sweden: 10,610,483 residents at 30 June 2026.
- Norway: 5,636,904 residents at the end of June 2026.
- Sweden grew by 4,954 in January to June 2026.
- Norway grew by 33,060 in 2025 and by 3,134 in Q2 2026.
- Stockholm county had 2,493,767 residents at 30 June 2026.

Population size

Sweden's population at 30 June 2026 was 10,610,483, up from 10,592,686 a year earlier and 9,373,379 in 2010. Norway's population was 5,627,400 at the end of 2025 and 5,636,904 at the end of the second quarter of 2026.

Births, deaths and migration

1. Sweden, first half of 2026: 50,329 births and 47,499 deaths, an excess of 2,830 births.
2. Norway, 2025: 55,401 births and 45,040 deaths, plus net migration of 22,324.
3. Norway, Q2 2026: 15,511 births, 10,787 deaths and net migration of -1,590.

Where people live

Stockholm county is Sweden's most populous, with 2,493,767 residents, close to half of Norway's national total.

How to compare

Both countries count registered residents. Compare figures from the same date when looking at growth.`;

const BUILT = buildEditorialComparison({
  slug: "norway-vs-sweden",
  title: "Norway vs Sweden: Population and Growth in 2026",
  shortAnswer: SHORT_ANSWER,
  verdict: "Sweden: 10,610,483 residents (30 June 2026), growth of 4,954 in H1 2026.\n\nNorway: 5,636,904 residents (end of Q2 2026), growth of 33,060 in 2025.",
  category: "countries",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "norway", "slug": "norway", "name": "Norway", "shortDesc": "Nordic country with 5,636,904 residents at the end of June 2026.", "imageUrl": null, "entityType": "place", "position": 0, "pros": ["Population grew by 33,060 in 2025", "More births than deaths: 55,401 vs 45,040 in 2025", "Net migration of 22,324 in 2025"], "cons": ["About half Sweden's population", "Net migration was negative in Q2 2026"], "bestFor": "Comparing smaller Nordic populations"},
    {"id": "sweden", "slug": "sweden", "name": "Sweden", "shortDesc": "Nordic country with 10,610,483 residents at 30 June 2026.", "imageUrl": null, "entityType": "place", "position": 1, "pros": ["Largest Nordic population", "Stockholm county: 2,493,767 residents", "Population over 10 million since mid-2017"], "cons": ["Growth slowed: 4,954 in the first half of 2026", "Births and deaths close: 50,329 vs 47,499 in H1 2026"], "bestFor": "Comparing the largest Nordic population"},
  ],
  keyDifferences: [{"label": "Population", "entityAValue": "5,636,904 (end of Q2 2026)", "entityBValue": "10,610,483 (30 June 2026)", "winner": "tie"}, {"label": "Recent growth", "entityAValue": "3,134 in Q2 2026", "entityBValue": "4,954 in H1 2026", "winner": "tie"}, {"label": "Births", "entityAValue": "15,511 in Q2 2026", "entityBValue": "50,329 in H1 2026", "winner": "tie"}, {"label": "Deaths", "entityAValue": "10,787 in Q2 2026", "entityBValue": "47,499 in H1 2026", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Population a year earlier", "Population", "norway", "sweden", "5,601,049 (start of Q2 2025)", "10,592,686 (30 June 2025)"),
    textAttr("a1", "2025 growth", "Population", "norway", "sweden", "33,060", "Not compared"),
    textAttr("a2", "2025 net migration", "Population", "norway", "sweden", "22,324", "Not compared"),
    textAttr("a3", "Largest region", "Population", "norway", "sweden", "Not compared", "Stockholm county: 2,493,767"),
    textAttr("a4", "Statistics office", "Population", "norway", "sweden", "Statistics Norway (SSB)", "Statistics Sweden (SCB)"),
  ],
  faqs: [{"question": "Which has more people, Norway or Sweden?", "answer": "Sweden. It had 10,610,483 residents at 30 June 2026, compared with Norway's 5,636,904 at the end of the second quarter of 2026."}, {"question": "Is Sweden's population growing?", "answer": "Slowly. Sweden grew by 4,954 people in the first half of 2026, with 50,329 births and 47,499 deaths."}, {"question": "How much did Norway grow in 2025?", "answer": "Norway's population grew by 33,060 in 2025, from 5,594,340 to 5,627,400, with net migration of 22,324."}, {"question": "How many people live in Stockholm county?", "answer": "2,493,767 at 30 June 2026."}, {"question": "Did Norway have net emigration in 2026?", "answer": "In the second quarter of 2026, net migration was -1,590, with 10,095 immigrants and 11,685 emigrants."}, {"question": "How many births did Norway record in 2025?", "answer": "55,401 births and 45,040 deaths, an excess of 10,361 births."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Sweden has nearly twice Norway's population; Norway grew faster in 2025.", keyFact: "Sweden had 10,610,483 residents at 30 June 2026; Norway had 5,636,904." },
  citationStats: {"sourceCount": 3, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Statistics Norway: Population", "url": "https://www.ssb.no/en/befolkning/folketall/statistikk/befolkning"}, {"name": "Statistics Sweden: Population statistics, January-June 2026", "url": "https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population-and-living-conditions/population-composition-and-development/population-statistics/pong/tables-and-graphs/population-statistics---month-quarter-half-year/population-statistics---january-june-2026/"}, {"name": "Statistics Sweden: Preliminary population statistics, first six months 2010-2026", "url": "https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population-and-living-conditions/population-composition-and-development/population-statistics/pong/tables-and-graphs/population-statistics---month-quarter-half-year/preliminary-population-statistics-for-sweden-first-six-months-of-20102026/"}]},
  resources: [{"type": "external", "label": "Statistics Norway: Population", "url": "https://www.ssb.no/en/befolkning/folketall/statistikk/befolkning", "description": "Population 5,636,904 at end of Q2 2026; 2025 growth 33,060; births, deaths, migration."}, {"type": "external", "label": "Statistics Sweden: Population statistics, January-June 2026", "url": "https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population-and-living-conditions/population-composition-and-development/population-statistics/pong/tables-and-graphs/population-statistics---month-quarter-half-year/population-statistics---january-june-2026/", "description": "Whole country 10,610,483; growth 4,954; births 50,329; deaths 47,499; Stockholm 2,493,767."}, {"type": "external", "label": "Statistics Sweden: Preliminary population statistics, first six months 2010-2026", "url": "https://www.scb.se/en/finding-statistics/statistics-by-subject-area/population-and-living-conditions/population-composition-and-development/population-statistics/pong/tables-and-graphs/population-statistics---month-quarter-half-year/preliminary-population-statistics-for-sweden-first-six-months-of-20102026/", "description": "Population 30 June: 10,610,483 (2026), 10,592,686 (2025), 9,373,379 (2010)."}],
  metaTitle: "Norway vs Sweden | A Versus B",
});

BUILT.metadata.metaDescription = "Norway vs Sweden population in 2026: 5.64 million vs 10.61 million, recent growth, births, deaths, migration and Stockholm county.";

export const NORWAY_VS_SWEDEN: EditorialComparison = BUILT;
