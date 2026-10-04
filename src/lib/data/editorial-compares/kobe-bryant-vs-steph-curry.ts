import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Kobe Bryant vs Stephen Curry. Career lines and honors lists are from
 * Basketball-Reference. Curry's 2025-26 line is from the same page.
 * Curry's projection row is not quoted. No winner
 * and no prediction.
 */

const KOBE = "kobe-bryant";
const CURRY = "stephen-curry";

const KOBE_URL = "https://www.basketball-reference.com/players/b/bryanko01.html";
const CURRY_URL = "https://www.basketball-reference.com/players/c/curryst01.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER = `Career · Basketball-Reference`;
const LAST = `2025-26 regular season · Basketball-Reference`;

const SHORT_ANSWER =
  "Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Stephen Curry's career line is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. Kobe won 5 championships and the 2007-08 MVP. Curry won 4 championships and MVPs in 2014-15 and 2015-16. Stats as of October 3, 2026, Curry has no 2026-27 regular-season game log. Neither is named the better player.";

const FAQS = [
  {
    question: "What are Kobe Bryant's and Stephen Curry's career lines?",
    answer:
      "Kobe, in 20 seasons and 1,346 games: 33,643 points, at 25.0 points, 5.2 rebounds, and 4.7 assists per game. Curry, in 17 seasons and 1,069 games: 26,528 points, at 24.8 points, 4.7 rebounds, and 6.3 assists per game. Both lines are the Basketball-Reference career rows.",
  },
  {
    question: "How many championships does each player have?",
    answer:
      "Kobe won 5 NBA championships, plus 2 Finals MVPs and the 2007-08 MVP. Curry won 4 NBA championships, plus the 2021-22 Finals MVP and MVPs in 2014-15 and 2015-16.",
  },
  {
    question: "What did Curry average in 2025-26?",
    answer:
      "Curry played 43 games, 41 starts, at 30.9 minutes: 26.6 points, 3.6 rebounds, and 4.7 assists. The awards cell for that season is All-Star. Kobe has no 2025-26 row. His career row is the last line on the per-game table.",
  },
  {
    question: "Is there a 2026-27 line for Curry?",
    answer:
      "No. Stats as of October 3, 2026. Curry's 2026-27 table is labeled a projection, and that table is not quoted. Curry has no 2026-27 game log. He plays for the Golden State Warriors.",
  },
  {
    question: "How many All-Star selections does each player have?",
    answer:
      "Kobe made 18 All-Star teams, with 15 All-NBA selections and 12 All-Defensive selections. Curry made 12 All-Star teams and 11 All-NBA teams.",
  },
  {
    question: "Who is the better player, Kobe or Curry?",
    answer:
      "Neither is named the better player. Kobe's column is the longer career, 33,643 points, and 5 championships. Curry's column is the assist line, 4 championships, and two MVP seasons. The 2026-27 season has no game log for Curry.",
  },
];

const VERDICT = `Career points per game: Kobe 25.0, Curry 24.8. Career assists per game: Curry 6.3, Kobe 4.7. Career points: Kobe 33,643 in 1,346 games, Curry 26,528 in 1,069 games.

Championships: Kobe 5, Curry 4. MVPs: Kobe in 2007-08. Curry in 2014-15 and 2015-16.

2025-26 regular season: Curry 26.6 points, 3.6 rebounds, and 4.7 assists in 43 games. Kobe has no 2025-26 row.

2026-27 season: Stats as of October 3, 2026, Curry has no regular-season game log. There is no 2026-27 forecast.`;

const EXPERT_ANALYSIS = `Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Stephen Curry's career line is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. Kobe won 5 championships. Curry won 4. Neither is named the better player.

2026-27 season. Stats as of ${AS_OF}. Curry has no 2026-27 regular-season game log. The 2026-27 table on his page is labeled a projection, and that table is not quoted.

Career. Kobe was born August 23, 1978, stood 6-6 and 212 pounds, was drafted 13th overall by Charlotte in 1996, and debuted November 3, 1996. He played 20 seasons and 1,346 games, scored 33,643 points, and his seasons were with the Lakers. He was inducted into the Hall of Fame as a player in 2020. Bryant retired after the 2015-16 season and died on January 26, 2020. Curry was born March 14, 1988, stands 6-2 and 185 pounds, was drafted 7th overall by Golden State in 2009, and debuted October 28, 2009. He has played 17 seasons and 1,069 games, scored 26,528 points, and plays for the Golden State Warriors.

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
        "Lakers guard. Career line 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Five championships and the 2007-08 MVP.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "33,643 career points in 1,346 games",
        "5 championships, 2 Finals MVPs, and the 2007-08 MVP",
        "18 All-Star selections",
        "Hall of Fame induction as a player in 2020",
      ],
      cons: [
        "Career assists are 4.7 per game. Curry's career mark is 6.3",
      ],
      bestFor: "The career point total and the five championships",
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
        "4 championships and the 2021-22 Finals MVP",
        "Career assists are 6.3 per game",
        "2025-26 regular season: 26.6 points, 3.6 rebounds, and 4.7 assists in 43 games",
      ],
      cons: [
        "Career points are 26,528. Kobe's career total is 33,643",
        "4 championships. Kobe won 5",
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
      label: "Championships",
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
  ],
  attributes: [
    textAttr("career-ppg", "Points per game", CAREER, KOBE, CURRY, "25.0", "24.8", "a"),
    textAttr("career-rpg", "Rebounds per game", CAREER, KOBE, CURRY, "5.2", "4.7", "a"),
    textAttr("career-apg", "Assists per game", CAREER, KOBE, CURRY, "4.7", "6.3", "b"),
    textAttr("career-games", "Games", CAREER, KOBE, CURRY, "1,346", "1,069", "a"),
    textAttr("career-points", "Career points", CAREER, KOBE, CURRY, "33,643", "26,528", "a"),
    textAttr("titles", "Championships", CAREER, KOBE, CURRY, "5", "4", "a"),
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
      "Kobe won 5 championships and the 2007-08 MVP. Curry won 4 championships and MVPs in 2014-15 and 2015-16. Stats as of October 3, 2026, Curry has no 2026-27 regular-season line.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 9,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Kobe Bryant`, url: KOBE_URL },
      { name: `Basketball-Reference — Stephen Curry`, url: CURRY_URL },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Kobe Bryant",
      url: KOBE_URL,
      description: `Career 25.0 / 5.2 / 4.7 in 1,346 games, 33,643 points. 5 championships and the 2007-08 MVP.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Stephen Curry",
      url: CURRY_URL,
      description: `Career 24.8 / 4.7 / 6.3 in 1,069 games. 2025-26: 26.6 points in 43 games. MVP-1 in 2014-15 and 2015-16. 2026-27 row is a projection and is not used.`,
    },
    {
      type: "blog",
      label: "Kobe Bryant hub",
      url: "/entity/kobe-bryant",
      description: "Kobe Bryant player hub.",
    },
  ],
  metaTitle: "Kobe vs Curry: Career Comparison",
});

BUILT.metadata.metaDescription =
  "Kobe's career line is 25.0 points in 1,346 games, with 5 championships. Curry's is 24.8 in 1,069, with 4. Stats as of October 3, 2026.";

export const KOBE_BRYANT_VS_STEPH_CURRY: EditorialComparison = BUILT;
