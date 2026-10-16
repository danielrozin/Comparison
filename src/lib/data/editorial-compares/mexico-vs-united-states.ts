import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * ROO-224: Mexico vs United States.
 * INEGI Censo 2020 press release; U.S. Census Bureau 2020 Census first data release.
 * Facts read 16 October 2026 from official sources only. No winner.
 */

const PUBLISHED = "2026-10-16T00:00:00Z";
const SHORT_ANSWER = "The 2020 censuses counted 126,014,024 people in Mexico (reference date 15 March 2020) and 331,449,281 in the United States (1 April 2020, 50 states and DC). Mexico's population grew by 13.7 million from 2010, an average 1.2% a year, has a median age of 29, and ranks 11th in the world. The U.S. population grew 7.4% from 2010, and 37.2% lived in the five most populous states. About 797,266 people living in Mexico were born in the United States.";

const EXPERT_ANALYSIS = `${SHORT_ANSWER}

Key takeaways

- Mexico, 2020 census: 126,014,024 people.
- United States, 2020 census: 331,449,281 people.
- Mexico grew by 13.7 million from 2010, 1.2% a year on average; the U.S. grew 7.4% over the decade.
- Mexico's median age was 29.
- 797,266 people living in Mexico were born in the United States.

Population

Mexico's 2020 census counted 64,540,634 women (51.2%) and 61,473,390 men (48.8%). Mexico ranks 11th in population worldwide, below Japan and ahead of Ethiopia. The U.S. count includes everyone living in the 50 states and the District of Columbia on 1 April 2020; 123,425,864 people, or 37.2%, lived in the five most populous states.

Migration and households in Mexico

1. 1,212,252 people living in Mexico were born in another country; 797,266 of them in the United States.
2. Mexico had 35,219,141 occupied private homes, with an average of 3.6 occupants.
3. 7,364,645 people aged three and over, 6.1%, speak an Indigenous language.

How to compare

Both figures come from each country's 2020 census, taken weeks apart. For later years, compare each country's official estimates for the same date.`;

const BUILT = buildEditorialComparison({
  slug: "mexico-vs-united-states",
  title: "Mexico vs United States: 2020 Census Facts",
  shortAnswer: SHORT_ANSWER,
  verdict: "Mexico: 126,014,024 people (2020), median age 29, 11th in the world.\n\nUnited States: 331,449,281 people (2020), up 7.4% from 2010.",
  category: "countries",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {"id": "mexico", "slug": "mexico", "name": "Mexico", "shortDesc": "126,014,024 residents in the 2020 census; median age 29.", "imageUrl": null, "entityType": "place", "position": 0, "pros": ["11th most populous country in the world", "Population grew by 13.7 million from 2010", "Median age of 29"], "cons": ["About 38% of the U.S. population", "Average annual growth of 1.2% over 2010-2020"], "bestFor": "Comparing population size and structure"},
    {"id": "united-states", "slug": "united-states", "name": "United States", "shortDesc": "331,449,281 residents in the 2020 census (50 states and DC).", "imageUrl": null, "entityType": "place", "position": 1, "pros": ["Population grew 7.4% from 2010", "37.2% live in the five most populous states", "Census sets House apportionment"], "cons": ["Slower growth than the previous decade", "Population concentrated in a few states"], "bestFor": "Comparing population size and distribution"},
  ],
  keyDifferences: [{"label": "2020 census population", "entityAValue": "126,014,024", "entityBValue": "331,449,281", "winner": "tie"}, {"label": "Census date", "entityAValue": "15 March 2020", "entityBValue": "1 April 2020", "winner": "tie"}, {"label": "Growth since 2010", "entityAValue": "13.7 million (1.2% a year)", "entityBValue": "7.4%", "winner": "tie"}, {"label": "Concentration", "entityAValue": "Not compared", "entityBValue": "37.2% in five most populous states", "winner": "tie"}],
  attributes: [
    textAttr("a0", "Women", "Population", "mexico", "united-states", "64,540,634 (51.2%)", "Not compared"),
    textAttr("a1", "Men", "Population", "mexico", "united-states", "61,473,390 (48.8%)", "Not compared"),
    textAttr("a2", "Median age", "Population", "mexico", "united-states", "29", "Not compared"),
    textAttr("a3", "World population rank", "Population", "mexico", "united-states", "11th", "Not compared"),
    textAttr("a4", "Born in the other country", "Population", "mexico", "united-states", "797,266 U.S.-born residents", "Not compared"),
    textAttr("a5", "Occupied homes", "Population", "mexico", "united-states", "35,219,141 (3.6 occupants on average)", "Not compared"),
  ],
  faqs: [{"question": "What is the population of Mexico?", "answer": "Mexico's 2020 census counted 126,014,024 people, 51.2% women and 48.8% men."}, {"question": "What is the population of the United States?", "answer": "The 2020 Census counted 331,449,281 people in the 50 states and the District of Columbia as of 1 April 2020."}, {"question": "How much bigger is the U.S. population?", "answer": "The 2020 U.S. count of 331,449,281 is about 2.6 times Mexico's 126,014,024."}, {"question": "How fast did each population grow?", "answer": "Mexico grew by 13.7 million from 2010 to 2020, an average 1.2% a year. The U.S. grew 7.4% over the same decade."}, {"question": "How many Americans live in Mexico?", "answer": "Mexico's 2020 census counted 797,266 residents born in the United States, out of 1,212,252 foreign-born residents."}, {"question": "What is Mexico's median age?", "answer": "29 years in the 2020 census."}],
  relatedComparisons: [],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: { tldr: SHORT_ANSWER, winnerName: null, winnerReason: "The U.S. has about 2.6 times Mexico's population; Mexico has a younger median age of 29.", keyFact: "2020 censuses: Mexico 126,014,024; United States 331,449,281." },
  citationStats: {"sourceCount": 2, "dataPointCount": 12, "reviewsAnalyzed": null, "preferencePercent": null, "preferenceEntity": null, "lastResearched": "2026-10-16", "sources": [{"name": "INEGI: En México somos 126 014 024 habitantes (Censo 2020)", "url": "https://www.inegi.org.mx/app/saladeprensa/noticia.html?id=6237"}, {"name": "U.S. Census Bureau: First 2020 Census data release", "url": "https://www.census.gov/library/stories/2021/04/2020-census-data-release.html"}]},
  resources: [{"type": "external", "label": "INEGI: En México somos 126 014 024 habitantes (Censo 2020)", "url": "https://www.inegi.org.mx/app/saladeprensa/noticia.html?id=6237", "description": "126,014,024; 51.2% women; median age 29; 11th in world; 797,266 U.S.-born; 35,219,141 homes."}, {"type": "external", "label": "U.S. Census Bureau: First 2020 Census data release", "url": "https://www.census.gov/library/stories/2021/04/2020-census-data-release.html", "description": "331,449,281 as of 1 April 2020; +7.4% since 2010; 37.2% in five most populous states."}],
  metaTitle: "Mexico vs United States | A Versus B",
});

BUILT.metadata.metaDescription = "Mexico vs United States by the 2020 censuses: 126.0 million vs 331.4 million people, growth since 2010, median age, and U.S.-born residents of Mexico.";

export const MEXICO_VS_UNITED_STATES: EditorialComparison = BUILT;
