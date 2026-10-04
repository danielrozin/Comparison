import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Jordan vs Kobe. Career lines, honors, and the death date are
 * Basketball-Reference. No 2026-27 game log exists
 * for either player. No prediction.
 */

const JORDAN = "michael-jordan";
const KOBE = "kobe-bryant";

const JORDAN_URL = "https://www.basketball-reference.com/players/j/jordami01.html";
const KOBE_URL = "https://www.basketball-reference.com/players/b/bryanko01.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER_CAT = `Career per game · Basketball-Reference`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Michael Jordan's career line is 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games over 15 years. Kobe Bryant's is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games over 20 years. Jordan won 6 championships and 6 Finals MVPs. Kobe won 5 championships and 2 Finals MVPs. As of October 3, 2026, neither player has played a 2026-27 game. Neither is named the better player.";

const FAQS = [
  {
    question: "What is Michael Jordan's career scoring line?",
    answer:
      "Jordan's per-game averages are 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games. Minutes per game were 38.3. Shooting is .497 from the field, .327 from three, and .835 from the line. Career points total 32,292. The career ran 15 years, with a 1984 debut and Hall of Fame induction as a player in 2009 (Basketball-Reference).",
  },
  {
    question: "What is Kobe Bryant's career scoring line?",
    answer:
      "Kobe's per-game averages are 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. Minutes per game were 36.1. Shooting is .447 from the field, .329 from three, and .837 from the line. Career points total 33,643. The career ran 20 years, with a 1996 debut (Basketball-Reference).",
  },
  {
    question: "How many championships does each player have?",
    answer:
      "Jordan won 6 NBA championships, 6 Finals MVPs, 5 MVPs, and 10 scoring titles, and made 14 All-Star teams. Kobe won 5 NBA championships, 2 Finals MVPs, and the 2007-08 MVP, and made 18 All-Star teams. Both were inducted into the Hall of Fame and named to the NBA 75th Anniversary Team. Those honors are not a single ranking.",
  },
  {
    question: "How long did each play?",
    answer:
      "Jordan played 15 years, debuted October 26, 1984, and was drafted by the Chicago Bulls 3rd overall in 1984. Thirteen years were with Chicago and 2 were with Washington. Kobe played 20 years, debuted November 3, 1996, and was drafted by the Charlotte Hornets 13th overall in 1996.",
  },
  {
    question: "Is there a single winner?",
    answer:
      "No. As of October 3, 2026, neither player has played a 2026-27 game. There is no forecast for a season that neither player is playing.",
  },
  {
    question: "What happened after Kobe's career?",
    answer:
      "Bryant retired after the 2015-16 season and died on January 26, 2020. He was inducted into the Hall of Fame as a player in 2020. He has no 2025-26 or 2026-27 season. Jordan has not played a 2026-27 game.",
  },
];

const VERDICT = `Career per game: Jordan 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games. Kobe 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games.

Career points: Jordan 32,292. Kobe 33,643.

Championships: Jordan 6. Kobe 5.`;

const EXPERT_ANALYSIS = `Michael Jordan's career line is 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games, totaling 32,292 points. Kobe Bryant's is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games, totaling 33,643 points. Jordan won 6 championships. Kobe won 5. Neither is named the better player.

2026-27 season. Stats as of ${AS_OF}. Neither player has played a 2026-27 regular-season game. Jordan played 15 seasons. Kobe played 20.

Jordan also has 6 Finals MVPs, 5 MVPs, 10 scoring titles, and 14 All-Star selections, and Kobe has 2 Finals MVPs, the 2007-08 MVP, and 18 All-Star selections. Chicago accounts for 13 of Jordan's years, at 31.5 points per game. Washington accounts for 2 years, at 21.2.`;

const BUILT = buildEditorialComparison({
  slug: "jordan-vs-kobe",
  title: "Jordan vs Kobe: Career Comparison",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: JORDAN,
      slug: JORDAN,
      name: "Michael Jordan",
      shortDesc:
        "Career 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games. 6 championships and 6 Finals MVPs.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "Career per game: 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games",
        "6 championships, 6 Finals MVPs, 5 MVPs, 10 scoring titles",
        "Career points: 32,292",
      ],
      cons: [
        "Career length is 15 years, against Kobe's 20",
        "2026-27 games played: none as of October 3, 2026",
      ],
      bestFor: "The career scoring average and the championships",
    },
    {
      id: KOBE,
      slug: KOBE,
      name: "Kobe Bryant",
      shortDesc:
        "Career 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games. 5 championships and 2 Finals MVPs.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "Career per game: 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games",
        "Career points: 33,643",
        "5 championships, 18 All-Star selections, 2007-08 MVP",
      ],
      cons: [
        "Career scoring average is 25.0",
        "2026-27 games played: none",
      ],
      bestFor: "The 20-year career line and the point total",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "30.1 in 1,072 games",
      entityBValue: "25.0 in 1,346 games",
      winner: "a",
    },
    {
      label: "Career points",
      entityAValue: "32,292",
      entityBValue: "33,643",
      winner: "b",
    },
    {
      label: "Championships",
      entityAValue: "6",
      entityBValue: "5",
      winner: "a",
    },
    {
      label: "Career length",
      entityAValue: "15 years",
      entityBValue: "20 years",
      winner: "b",
    },
    {
      label: "2026-27 games played",
      entityAValue: "None. Stats as of October 3, 2026.",
      entityBValue: "None. Stats as of October 3, 2026.",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Career points per game", CAREER_CAT, JORDAN, KOBE, "30.1 in 1,072 games", "25.0 in 1,346 games", "a"),
    textAttr("career-rpg", "Career rebounds per game", CAREER_CAT, JORDAN, KOBE, "6.2", "5.2", "a"),
    textAttr("career-apg", "Career assists per game", CAREER_CAT, JORDAN, KOBE, "5.3", "4.7", "a"),
    textAttr("career-pts", "Career points", CAREER_CAT, JORDAN, KOBE, "32,292", "33,643", "b"),
    textAttr("titles", "Championships", CAREER_CAT, JORDAN, KOBE, "6", "5", "a"),
    textAttr("years", "Career length", CAREER_CAT, JORDAN, KOBE, "15 years", "20 years", "b"),
    textAttr(
      "season-2627",
      "2026-27 games played",
      SEASON_CAT,
      JORDAN,
      KOBE,
      `None. Stats as of ${AS_OF}.`,
      `None. Stats as of ${AS_OF}.`
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
      "No page-level winner.",
    keyFact:
      "Jordan 30.1 points in 1,072 games and 6 championships. Kobe 25.0 points in 1,346 games and 5 championships.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Michael Jordan`, url: JORDAN_URL },
      { name: `Basketball-Reference — Kobe Bryant`, url: KOBE_URL },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Michael Jordan",
      url: JORDAN_URL,
      description: `Career 30.1 points, 6.2 rebounds, 5.3 assists in 1,072 games. Honors: 6 championships, 6 Finals MVPs, 5 MVPs.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Kobe Bryant",
      url: KOBE_URL,
      description: `Career 25.0 points, 5.2 rebounds, 4.7 assists in 1,346 games. Honors: 5 championships, 2 Finals MVPs.`,
    },
    {
      type: "blog",
      label: "Michael Jordan hub",
      url: "/entity/michael-jordan",
      description: "Michael Jordan player hub.",
    },
    {
      type: "blog",
      label: "Kobe Bryant hub",
      url: "/entity/kobe-bryant",
      description: "Kobe Bryant player hub.",
    },
  ],
  metaTitle: "Jordan vs Kobe: Career Comparison",
});

BUILT.metadata.metaDescription =
  "Jordan's career line is 30.1 points in 1,072 games, with 6 championships. Kobe's is 25.0 in 1,346 games, with 5.";

export const JORDAN_VS_KOBE: EditorialComparison = BUILT;
