import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Kobe Bryant vs Stephen Curry. Career lines and honors lists are from
 * Basketball-Reference. Curry's 2025-26 line is from the same page.
 * Fetched 2026-10-03. Curry's projection row is not quoted. No winner
 * and no prediction.
 */

const KOBE = "kobe-bryant";
const CURRY = "stephen-curry";

const KOBE_URL = "https://www.basketball-reference.com/players/b/bryanko01.html";
const CURRY_URL = "https://www.basketball-reference.com/players/c/curryst01.html";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER = `Career · Basketball-Reference, fetched ${FETCHED}`;
const LAST = `2025-26 regular season · Basketball-Reference, fetched ${FETCHED}`;
const THIS = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Stephen Curry's career line is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. Kobe's honors list shows 5 championships and the 2007-08 MVP. Curry's list shows 4 championships and MVPs in 2014-15 and 2015-16. Stats as of October 3, 2026, Curry has no 2026-27 regular-season game log, and Kobe's page lists January 26, 2020 as the date of death. This page does not pick a winner.";

const FAQS = [
  {
    question: "What are Kobe Bryant's and Stephen Curry's career lines?",
    answer:
      "Kobe, in 20 seasons and 1,346 games: 33,643 points, at 25.0 points, 5.2 rebounds, and 4.7 assists per game. Curry, in 17 seasons and 1,069 games: 26,528 points, at 24.8 points, 4.7 rebounds, and 6.3 assists per game. Both lines are the Basketball-Reference career rows, fetched October 3, 2026.",
  },
  {
    question: "How many championships does each honors list show?",
    answer:
      "Kobe's list says 5x NBA Champ, plus 2 Finals MVPs and the 2007-08 MVP. Curry's list says 4x NBA Champ, plus the 2021-22 Finals MVP and MVPs in 2014-15 and 2015-16. The per-game awards cells mark Curry MVP-1 in those two seasons.",
  },
  {
    question: "What did Curry average in 2025-26?",
    answer:
      "Curry played 43 games, 41 starts, at 30.9 minutes: 26.6 points, 3.6 rebounds, and 4.7 assists. The awards cell for that season is All-Star. Kobe has no 2025-26 row. His career row is the last line on the per-game table.",
  },
  {
    question: "Is there a 2026-27 line for Curry?",
    answer:
      "No. Stats as of October 3, 2026. Curry's 2026-27 table is labeled a projection, and this page does not quote it. Kobe's page lists a death date of January 26, 2020, and it has no 2026-27 game log. Curry is listed with the Golden State Warriors.",
  },
  {
    question: "Why does the basketball hub mention this comparison?",
    answer:
      "The sports basketball FAQ names Steph Curry vs Kobe Bryant in its answer about popular comparisons. The hub href is /compare/kobe-bryant-vs-steph-curry. That slug is alphabetical, and this page is that URL. The reverse /compare/steph-curry-vs-kobe-bryant redirects here in one hop.",
  },
  {
    question: "Who is the better player, Kobe or Curry?",
    answer:
      "This page does not pick a winner. Kobe's column is the longer career, 33,643 points, and 5 championships on the honors list. Curry's column is the assist line, 4 championships, and two MVP seasons. The 2026-27 season has no game log for Curry.",
  },
];

const VERDICT = `Career points per game: Kobe 25.0, Curry 24.8. Career assists per game: Curry 6.3, Kobe 4.7. Career points: Kobe 33,643 in 1,346 games, Curry 26,528 in 1,069 games.

Championships on the honors lists: Kobe 5, Curry 4. MVPs: Kobe in 2007-08. Curry in 2014-15 and 2015-16.

2025-26 regular season: Curry 26.6 points, 3.6 rebounds, and 4.7 assists in 43 games. Kobe has no 2025-26 row.

2026-27 season: Stats as of October 3, 2026, Curry has no regular-season game log. Kobe's page lists January 26, 2020 as the date of death. This page does not pick a winner and does not predict a game.`;

const EXPERT_ANALYSIS = `Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Stephen Curry's career line is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. Kobe's honors list shows 5 championships. Curry's shows 4. This page does not pick a winner.

Source note: career totals, Curry's 2025-26 regular-season line, and the honors lists are from the two Basketball-Reference player pages, fetched ${AS_OF}. ${KOBE_URL} ${CURRY_URL}

2026-27 season. Stats as of ${AS_OF}. Curry has no 2026-27 regular-season game log. The 2026-27 table on his page is labeled a projection, and this page does not quote it. Kobe's page lists the date of death as January 26, 2020, and it has no 2026-27 game log.

Career. Kobe was born August 23, 1978, is listed at 6-6 and 212 pounds, was drafted 13th overall by Charlotte in 1996, and debuted November 3, 1996. The career row says 20 years: 1,346 games, 33,643 points. The season rows are labeled LAL. The page lists a Hall of Fame induction as a player in 2020 and a death date of January 26, 2020. Curry was born March 14, 1988, is listed at 6-2 and 185 pounds, was drafted 7th overall by Golden State in 2009, and debuted October 28, 2009. The career row says 17 years: 1,069 games, 26,528 points. The info box lists him with the Golden State Warriors.

2025-26 regular season. Curry played 43 games at 30.9 minutes: 26.6 points, 3.6 rebounds, and 4.7 assists, with an All-Star mark on the awards cell. In 2024-25 he played 70 games at 24.5 points per game. Kobe has no season after the career row.

Honors from the same player pages. Kobe: 18 All-Star selections, 2 scoring titles, 5 championships, 15 All-NBA selections, 12 All-Defensive selections, the 2007-08 MVP, 2 Finals MVPs, and the Hall of Fame. Curry: 12 All-Star selections, 2 scoring titles, 4 championships, 11 All-NBA selections, MVPs in 2014-15 and 2015-16, and the 2021-22 Finals MVP.`;

const BUILT = buildEditorialComparison({
  slug: "kobe-bryant-vs-steph-curry",
  title: "Kobe vs Curry: Career Comparison",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: KOBE,
      slug: KOBE,
      name: "Kobe Bryant",
      shortDesc:
        "Lakers guard. Career line 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Five championships and the 2007-08 MVP on the honors list.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "33,643 career points in 1,346 games",
        "5 championships, 2 Finals MVPs, and the 2007-08 MVP on the honors list",
        "18 All-Star selections",
        "Hall of Fame induction as a player in 2020",
      ],
      cons: [
        "Career assists are 4.7 per game. Curry's career mark is 6.3",
        "The page lists January 26, 2020 as the date of death",
        "No 2025-26 or 2026-27 game log",
      ],
      bestFor: "The career point total and the five championships on the honors list",
    },
    {
      id: CURRY,
      slug: CURRY,
      name: "Stephen Curry",
      shortDesc:
        "Warriors guard. Career line 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. MVPs in 2014-15 and 2015-16.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "MVPs in 2014-15 and 2015-16",
        "4 championships and the 2021-22 Finals MVP on the honors list",
        "Career assists are 6.3 per game",
        "2025-26 regular season: 26.6 points, 3.6 rebounds, and 4.7 assists in 43 games",
      ],
      cons: [
        "Career points are 26,528. Kobe's career total is 33,643",
        "The honors list shows 4 championships. Kobe's list shows 5",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The assist line, the two MVP seasons, and the 2025-26 line",
    },
  ],
  keyDifferences: [
    {
      label: "Career points",
      entityAValue: "33,643 in 1,346 games",
      entityBValue: "26,528 in 1,069 games",
      winner: "a",
    },
    {
      label: "Career assists per game",
      entityAValue: "4.7",
      entityBValue: "6.3",
      winner: "b",
    },
    {
      label: "Championships on the honors list",
      entityAValue: "5",
      entityBValue: "4",
      winner: "a",
    },
    {
      label: "MVP seasons",
      entityAValue: "2007-08",
      entityBValue: "2014-15 and 2015-16",
      winner: "b",
    },
    {
      label: "2026-27 regular season",
      entityAValue: "No game log. Date of death January 26, 2020",
      entityBValue: "No game log as of October 3, 2026",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Points per game", CAREER, KOBE, CURRY, "25.0", "24.8", "a"),
    textAttr("career-rpg", "Rebounds per game", CAREER, KOBE, CURRY, "5.2", "4.7", "a"),
    textAttr("career-apg", "Assists per game", CAREER, KOBE, CURRY, "4.7", "6.3", "b"),
    textAttr("career-games", "Games", CAREER, KOBE, CURRY, "1,346", "1,069", "a"),
    textAttr("career-points", "Career points", CAREER, KOBE, CURRY, "33,643", "26,528", "a"),
    textAttr("titles", "Championships on the honors list", CAREER, KOBE, CURRY, "5", "4", "a"),
    textAttr("mvp", "MVP", CAREER, KOBE, CURRY, "2007-08", "2014-15 and 2015-16", "b"),
    textAttr(
      "season-2526-ppg",
      "2025-26 points per game",
      LAST,
      KOBE,
      CURRY,
      "No 2025-26 row",
      "26.6 in 43 games",
      "b"
    ),
    textAttr(
      "season-2627-line",
      "Regular-season line",
      THIS,
      KOBE,
      CURRY,
      "No game log. Date of death January 26, 2020.",
      `None yet. Stats as of ${AS_OF}. Projection row not quoted.`
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "lebron-vs-jordan", title: "LeBron vs Jordan", category: "sports" },
    { slug: "kobe-bryant-vs-lebron-james", title: "Kobe vs LeBron", category: "sports" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "No page-level winner. Career lines stay separate from Curry's 2026-27 season, which has no game log.",
    keyFact:
      "Kobe's honors list shows 5 championships and the 2007-08 MVP. Curry's shows 4 championships and MVPs in 2014-15 and 2015-16. Stats as of October 3, 2026, Curry has no 2026-27 regular-season line.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: `Basketball-Reference — Kobe Bryant (fetched ${FETCHED})`, url: KOBE_URL },
      { name: `Basketball-Reference — Stephen Curry (fetched ${FETCHED})`, url: CURRY_URL },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Kobe Bryant",
      url: KOBE_URL,
      description: `Fetched ${FETCHED}. Career 25.0 / 5.2 / 4.7 in 1,346 games, 33,643 points. Honors list: 5 championships and the 2007-08 MVP. Date of death January 26, 2020.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Stephen Curry",
      url: CURRY_URL,
      description: `Fetched ${FETCHED}. Career 24.8 / 4.7 / 6.3 in 1,069 games. 2025-26: 26.6 points in 43 games. MVP-1 in 2014-15 and 2015-16. 2026-27 row is a projection and is not used.`,
    },
    {
      type: "blog",
      label: "Kobe Bryant hub",
      url: "/entity/kobe-bryant",
      description: "AversusB hub. Index, follow on October 3, 2026.",
    },
  ],
  metaTitle: "Kobe vs Curry: Career Comparison",
});

BUILT.metadata.metaDescription =
  "Kobe's career line is 25.0 points in 1,346 games, with 5 championships. Curry's is 24.8 in 1,069, with 4. Stats as of October 3, 2026.";

export const KOBE_BRYANT_VS_STEPH_CURRY: EditorialComparison = BUILT;
