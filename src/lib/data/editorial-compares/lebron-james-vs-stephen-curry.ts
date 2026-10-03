import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * LeBron vs Curry. Career and 2025-26 lines are Basketball-Reference.
 * The July 2026 76ers signing and the 24th-season line are the NBA.com
 * story updated July 27, 2026. Fetched 2026-10-03. No prediction.
 * Projection rows and reported contract dollars are not quoted.
 */

const LEBRON = "lebron-james";
const CURRY = "stephen-curry";

const LEBRON_URL = "https://www.basketball-reference.com/players/j/jamesle01.html";
const CURRY_URL = "https://www.basketball-reference.com/players/c/curryst01.html";
const SIGNING = "https://www.nba.com/news/lebron-james-free-agency-sixers-2026";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER_CAT = `Career per game · Basketball-Reference, fetched ${FETCHED}`;
const RECENT_CAT = `2025-26 regular season · Basketball-Reference, fetched ${FETCHED}`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "LeBron James's career line on the per-game table is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. Stephen Curry's is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. In 2025-26 LeBron averaged 20.9 points in 60 games and Curry averaged 26.6 points in 43 games. LeBron signed with the 76ers in July 2026, and NBA.com says 2026-27 adds at least one more season after 23. Stats as of October 3, 2026, there is no 2026-27 regular-season game log. This page does not predict the season.";

const FAQS = [
  {
    question: "What are LeBron's and Curry's career scoring lines?",
    answer:
      "LeBron's per-game career row is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games over 23 years. Career points total 43,440 (Basketball-Reference). Curry's per-game career row is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games over 17 years. Career points total 26,528 (Basketball-Reference). Career shooting is .507 / .348 / .737 for LeBron and .471 / .422 / .912 for Curry, field goals, threes, and free throws.",
  },
  {
    question: "What did each average in 2025-26?",
    answer:
      "LeBron, with the Lakers: 60 games, 20.9 points, 6.1 rebounds, and 7.2 assists. Curry, with the Warriors: 43 games, 26.6 points, 3.6 rebounds, and 4.7 assists. NBA.com's signing story, updated July 27, 2026, prints the same 20.9, 6.1, and 7.2 line for LeBron and the same 26.8 career points average.",
  },
  {
    question: "How many championships does each player have?",
    answer:
      "LeBron won 4 NBA championships, 4 Finals MVPs, and 4 MVPs, and made 22 All-Star teams. Curry won 4 NBA championships and 2 MVPs, made 12 All-Star teams, and was 2021-22 Finals MVP. Basketball-Reference is the source, fetched October 3, 2026. This page does not turn those honors into a ranking.",
  },
  {
    question: "Where is LeBron listed for 2026-27?",
    answer:
      "Basketball-Reference lists his team as the Philadelphia 76ers. NBA.com's story, updated July 27, 2026, says he announced the move on social media Friday and that it became official on Sunday. His posts on that story are dated July 24, 2026. He told the Lakers on June 30 that he would not return. NBA.com writes that he was the first player to log 23 seasons and will add at least one more this season. That is the story's line, not a forecast from this page.",
  },
  {
    question: "Where is Stephen Curry listed?",
    answer:
      "Basketball-Reference lists the Golden State Warriors. Experience there is 17 years. The 2025-26 awards cell is All-Star. Stats as of October 3, 2026, his page has no 2026-27 regular-season game log. A table is labeled 2026-27 Projection, and this comparison does not quote it.",
  },
  {
    question: "Does this page predict 2026-27?",
    answer:
      "No. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log for either player. Reported contract dollars in the signing story are labeled as reports, so they are not used. This page does not pick a winner.",
  },
];

const VERDICT = `Career per game: LeBron 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. Curry 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games.

2025-26: LeBron 20.9 points in 60 games. Curry 26.6 points in 43 games.

Championships on the honors lists: 4 and 4.

2026-27 season: LeBron is listed with the 76ers. Curry is listed with the Warriors. Stats as of October 3, 2026, there is no regular-season game log. This page does not pick a winner.`;

const EXPERT_ANALYSIS = `LeBron James's career line is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games, totaling 43,440 points. Stephen Curry's is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games, totaling 26,528 points. In 2025-26 LeBron averaged 20.9 points in 60 games and Curry averaged 26.6 points in 43 games. This page does not pick a winner.

Source note: the career rows, the 2025-26 lines, and the team fields are from Basketball-Reference, fetched ${AS_OF}. The signing and the line that 2026-27 adds at least one season after 23 are from NBA.com's story updated July 27, 2026, which also prints the 20.9 and 26.8 figures. ${LEBRON_URL} ${CURRY_URL} ${SIGNING}

2026-27 season. Stats as of ${AS_OF}. LeBron's team on Basketball-Reference is the Philadelphia 76ers. Curry's is the Golden State Warriors. NBA.com says LeBron announced the move Friday, that it became official Sunday, and that he told the Lakers on June 30 he would not return. His posts on that story are dated July 24, 2026. He said he believes he can help make the 76ers a championship team. That is his statement. NBA.com writes that he logged 23 seasons and will add at least one more this season. Neither player page has a 2026-27 game log. Tables labeled 2026-27 Projection are not quoted.

Honors on the same pages: LeBron 4 championships, 4 Finals MVPs, 4 MVPs, and 22 All-Star selections. Curry 4 championships, 2 MVPs, 12 All-Star selections, and 2021-22 Finals MVP. Career shooting is .507 from the field for LeBron and .422 from three for Curry.`;

const BUILT = buildEditorialComparison({
  slug: "lebron-james-vs-stephen-curry",
  title: "LeBron vs Curry: Careers and 2026-27",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: LEBRON,
      slug: LEBRON,
      name: "LeBron James",
      shortDesc:
        "Career 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. 2025-26: 20.9 points in 60 games. Listed with the 76ers.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "Career per game: 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games",
        "Totals table: 43,440 points",
        "Honors list: 4 championships, 4 Finals MVPs, 4 MVPs, 22 All-Star selections",
        "2025-26: 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games",
      ],
      cons: [
        "2025-26 scoring average was 20.9, below the career 26.8",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career totals and the July 2026 76ers signing",
    },
    {
      id: CURRY,
      slug: CURRY,
      name: "Stephen Curry",
      shortDesc:
        "Career 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games. 2025-26: 26.6 points in 43 games. Listed with the Warriors.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "Career per game: 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games",
        "Career three-point percentage on that row: .422",
        "Honors list: 4 championships, 2 MVPs, 2021-22 Finals MVP",
        "2025-26: 26.6 points in 43 games",
      ],
      cons: [
        "Career rebounds and assists on the per-game row are 4.7 and 6.3",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career shooting line and the 2025-26 scoring average",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "26.8 in 1,622 games",
      entityBValue: "24.8 in 1,069 games",
      winner: "a",
    },
    {
      label: "2025-26 points per game",
      entityAValue: "20.9 in 60 games",
      entityBValue: "26.6 in 43 games",
      winner: "b",
    },
    {
      label: "Championships on the honors list",
      entityAValue: "4",
      entityBValue: "4",
      winner: "tie",
    },
    {
      label: "2026-27 team",
      entityAValue: "Philadelphia 76ers",
      entityBValue: "Golden State Warriors",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Career points per game", CAREER_CAT, LEBRON, CURRY, "26.8 in 1,622 games", "24.8 in 1,069 games", "a"),
    textAttr("career-rpg", "Career rebounds per game", CAREER_CAT, LEBRON, CURRY, "7.5", "4.7", "a"),
    textAttr("career-apg", "Career assists per game", CAREER_CAT, LEBRON, CURRY, "7.4", "6.3", "a"),
    textAttr("career-pts", "Career points", CAREER_CAT, LEBRON, CURRY, "43,440", "26,528", "a"),
    textAttr("titles", "Championships on the honors list", CAREER_CAT, LEBRON, CURRY, "4", "4"),
    textAttr(
      "season-2526",
      "2025-26 points per game",
      RECENT_CAT,
      LEBRON,
      CURRY,
      "20.9 points, 6.1 rebounds, 7.2 assists in 60 games",
      "26.6 points, 3.6 rebounds, 4.7 assists in 43 games",
      "b"
    ),
    textAttr(
      "team-2627",
      "Listed team",
      SEASON_CAT,
      LEBRON,
      CURRY,
      `Philadelphia 76ers. NBA.com: at least one more season after 23. Stats as of ${AS_OF}.`,
      `Golden State Warriors. No game log. Stats as of ${AS_OF}.`
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
      "No page-level winner and no 2026-27 prediction. The career rows and the 2025-26 lines are finished results.",
    keyFact:
      "LeBron 26.8 points in 1,622 games and 20.9 in 2025-26. Curry 24.8 points in 1,069 games and 26.6 in 2025-26. LeBron is listed with the 76ers. Curry is listed with the Warriors.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: `Basketball-Reference — LeBron James (fetched ${FETCHED})`, url: LEBRON_URL },
      { name: `Basketball-Reference — Stephen Curry (fetched ${FETCHED})`, url: CURRY_URL },
      { name: `NBA.com — LeBron signs with the 76ers (fetched ${FETCHED})`, url: SIGNING },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: LeBron James",
      url: LEBRON_URL,
      description: `Fetched ${FETCHED}. Career 26.8 points, 7.5 rebounds, 7.4 assists in 1,622 games. 2025-26: 20.9 points in 60 games. Team: Philadelphia 76ers.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Stephen Curry",
      url: CURRY_URL,
      description: `Fetched ${FETCHED}. Career 24.8 points, 4.7 rebounds, 6.3 assists in 1,069 games. 2025-26: 26.6 points in 43 games. Team: Golden State Warriors.`,
    },
    {
      type: "external",
      label: "NBA.com: LeBron signs with the 76ers",
      url: SIGNING,
      description: `Updated July 27, 2026. July signing. 23 seasons logged, and the story says he will add at least one more. Contract dollars are labeled per reports and are not used.`,
    },
    {
      type: "blog",
      label: "LeBron James hub",
      url: "/entity/lebron-james",
      description: "LeBron James player hub.",
    },
  ],
  metaTitle: "LeBron vs Curry: Careers and 2026-27",
});

BUILT.metadata.metaDescription =
  "LeBron's career line is 26.8 points in 1,622 games. Curry's is 24.8 in 1,069. The 2026-27 block is dated October 3, 2026, with no game log.";

export const LEBRON_JAMES_VS_STEPHEN_CURRY: EditorialComparison = BUILT;
