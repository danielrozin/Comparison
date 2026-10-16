import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Carnival vs Royal Caribbean.
 * Carnival about-us page; Royal Caribbean press center about page. No fares.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "Carnival Cruise Line, founded in 1972, runs 29 ships from 13 U.S. homeports on cruises from a weekend to a week or two, and opened its Celebration Key destination on Grand Bahama in summer 2025. Royal Caribbean, part of Royal Caribbean Group, runs 30 ships, including the Icon Class (Icon of the Seas debuted January 2024) and Oasis Class, and owns Perfect Day CocoCay and Royal Beach Clubs. Choose by ship style, departure port and itinerary length; compare current fares for your dates.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Carnival: 29 ships, 13 U.S. homeports, founded 1972.
- Royal Caribbean: 30 ships, more than 300 destinations in 80 countries.
- Carnival's private destination is Celebration Key on Grand Bahama (summer 2025).
- Royal Caribbean's are Perfect Day CocoCay (2019) and Royal Beach Clubs in Paradise Island and Santorini.
- Both are adding ships: Carnival five through 2033; Royal Caribbean Hero of the Seas in 2027 and more.

Fleet

Carnival operates 29 ships, with fourth and fifth Excel Class ships (Carnival Festivale in 2027, Carnival Tropicale in 2028) among five new ships through 2033. Royal Caribbean has 30 ships. Its Icon Class began with Icon of the Seas in January 2024, followed by Star of the Seas and Legend of the Seas; Hero of the Seas is due in 2027 and a new Oasis Class ship in 2028.

Where they sail

Carnival sails from every U.S. coast with 13 domestic homeports, two in Australia, and seasonal sailings in other regions. Royal Caribbean visits more than 300 destinations in 80 countries on all seven continents.

Private destinations

1. Carnival: Celebration Key on Grand Bahama, opened summer 2025.
2. Royal Caribbean: Perfect Day CocoCay (2019), Royal Beach Club Paradise Island (December 2025), Royal Beach Club Santorini (April 2026), Royal Beach Club Lelepa (October 2027).

Who should pick which

Pick Carnival for many U.S. departure ports and cruises from a weekend up. Pick Royal Caribbean for Icon and Oasis Class ships and its private destinations. Compare fares, cabin types and what is included for your dates.`;

const BUILT = buildEditorialComparison({
  slug: "carnival-vs-royal-caribbean",
  title: "Carnival vs Royal Caribbean: Fleets and Destinations",
  shortAnswer: SHORT_ANSWER,
  verdict: "Carnival: 29 ships, 13 U.S. homeports, Celebration Key.\n\nRoyal Caribbean: 30 ships, Icon and Oasis Class, Perfect Day CocoCay and Royal Beach Clubs.\n\nCompare fares and inclusions for your dates.",
  category: "travel",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "carnival", "slug": "carnival", "name": "Carnival", "shortDesc": "Carnival Cruise Line, founded 1972, with 29 ships and 13 U.S. homeports.", "imageUrl": null, "entityType": "brand", "position": 0, "pros": ["29 ships with cruises from a weekend to a week or two", "13 domestic homeports on every U.S. coast", "Celebration Key private destination on Grand Bahama"], "cons": ["Fewer ships than Royal Caribbean", "Five new ships still to come through 2033"], "bestFor": "Short and week-long cruises from many U.S. ports"},
    {"id": "royal-caribbean", "slug": "royal-caribbean", "name": "Royal Caribbean", "shortDesc": "Royal Caribbean International, part of Royal Caribbean Group, with 30 ships.", "imageUrl": null, "entityType": "brand", "position": 1, "pros": ["Icon and Oasis Class ships with themed neighborhoods", "Perfect Day CocoCay and Royal Beach Clubs", "More than 300 destinations in 80 countries"], "cons": ["Largest ships sail fewer itineraries", "Some destinations are newer or still launching"], "bestFor": "Big-ship resort-style cruises and private destinations"},
  ],
  keyDifferences: [{"label": "Ships", "entityAValue": "29", "entityBValue": "30", "winner": "tie"}, {"label": "Founded or heritage", "entityAValue": "1972", "entityBValue": "More than 50 years", "winner": "tie"}, {"label": "Private destination", "entityAValue": "Celebration Key (Grand Bahama)", "entityBValue": "Perfect Day CocoCay, Royal Beach Clubs", "winner": "tie"}, {"label": "Reach", "entityAValue": "13 U.S. homeports, 2 in Australia", "entityBValue": "300+ destinations in 80 countries", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Fleet", "Cruise lines", "carnival", "royal-caribbean", "29 ships", "30 ships"),
    textAttr("a1", "Newest classes", "Cruise lines", "carnival", "royal-caribbean", "Excel Class (Festivale 2027, Tropicale 2028)", "Icon Class (Icon of the Seas, 2024); Hero of the Seas 2027"),
    textAttr("a2", "Cruise lengths", "Cruise lines", "carnival", "royal-caribbean", "A weekend to a week or two", "Varies by ship and region"),
    textAttr("a3", "Private destinations", "Cruise lines", "carnival", "royal-caribbean", "Celebration Key (2025)", "Perfect Day CocoCay (2019); Royal Beach Clubs from 2025"),
    textAttr("a4", "Parent", "Cruise lines", "carnival", "royal-caribbean", "Carnival Cruise Line", "Royal Caribbean Group (NYSE: RCL)"),
  ],
  faqs: [{"question": "Which is bigger, Carnival or Royal Caribbean?", "answer": "Royal Caribbean lists 30 ships and Carnival lists 29. Its newest ships belong to the Icon Class, which began in January 2024."}, {"question": "Where do Carnival cruises leave from?", "answer": "Carnival lists 13 domestic homeports on every U.S. coast, two in Australia, and seasonal sailings in other regions."}, {"question": "What are the private islands?", "answer": "Carnival opened Celebration Key on Grand Bahama in summer 2025. Royal Caribbean has Perfect Day CocoCay in The Bahamas and Royal Beach Clubs in Paradise Island and Santorini, with Lelepa planned for October 2027."}, {"question": "What is Icon of the Seas?", "answer": "Royal Caribbean's first Icon Class ship, which debuted in January 2024. Star of the Seas and Legend of the Seas followed, and Hero of the Seas is due in 2027."}, {"question": "Is Carnival or Royal Caribbean cheaper?", "answer": "Fares depend on ship, cabin, dates and promotions, so compare quotes for the same itinerary length and cabin type."}, {"question": "Which is better for a first cruise?", "answer": "Carnival offers short cruises from many U.S. ports; Royal Caribbean offers resort-style ships and private destinations. Choose by port, length and onboard style."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "Carnival for many U.S. ports and short cruises; Royal Caribbean for Icon and Oasis Class ships and private destinations.", keyFact: "Carnival lists 29 ships; Royal Caribbean lists 30." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "Carnival: About us", "url": "https://www.carnival.com/about-carnival/about-us"}, {"name": "Royal Caribbean press center: About", "url": "https://royalcaribbeanpresscenter.com/about/"}]},
  resources: [{"type": "external", "label": "Carnival: About us", "url": "https://www.carnival.com/about-carnival/about-us", "description": "Founded 1972; 29 ships; 13 domestic homeports; Celebration Key summer 2025; five new ships through 2033."}, {"type": "external", "label": "Royal Caribbean press center: About", "url": "https://royalcaribbeanpresscenter.com/about/", "description": "30 ships; 300+ destinations in 80 countries; Icon Class from January 2024; Perfect Day CocoCay 2019; Royal Beach Clubs."}],
  metaTitle: "Carnival vs Royal Caribbean | A Versus B",
});

BUILT.metadata.metaDescription = "Carnival vs Royal Caribbean: 29 vs 30 ships, U.S. homeports, Icon and Oasis Class, Celebration Key vs Perfect Day CocoCay, and new ships coming.";

export const CARNIVAL_VS_ROYAL_CARIBBEAN: EditorialComparison = BUILT;
