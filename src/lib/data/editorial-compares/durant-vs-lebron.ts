import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Durant vs LeBron. Career and 2025-26 lines are Basketball-Reference.
 * The July 2026 76ers signing is the NBA.com story updated July 27, 2026.
 * Fetched 2026-10-03. Projection rows and reported contract dollars are
 * not quoted. No prediction.
 */

const DURANT = "kevin-durant";
const LEBRON = "lebron-james";

const DURANT_URL = "https://www.basketball-reference.com/players/d/duranke01.html";
const LEBRON_URL = "https://www.basketball-reference.com/players/j/jamesle01.html";
const SIGNING = "https://www.nba.com/news/lebron-james-free-agency-sixers-2026";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER_CAT = `Career per game · Basketball-Reference, fetched ${FETCHED}`;
const RECENT_CAT = `2025-26 regular season · Basketball-Reference, fetched ${FETCHED}`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Kevin Durant's career line on the per-game table is 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games. LeBron James's is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. In 2025-26 Durant averaged 26.0 points in 78 games for Houston and LeBron averaged 20.9 points in 60 games for the Lakers. LeBron signed with the 76ers in July 2026. Stats as of October 3, 2026, there is no 2026-27 regular-season game log. This page does not predict the season.";

const FAQS = [
  {
    question: "What are Durant's and LeBron's career scoring lines?",
    answer:
      "Durant's per-game career row is 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games over 18 years. Career points total 32,597 (Basketball-Reference). LeBron's per-game career row is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games over 23 years. Career points total 43,440 (Basketball-Reference). Career shooting is .503 / .392 / .882 for Durant and .507 / .348 / .737 for LeBron, field goals, threes, and free throws.",
  },
  {
    question: "What did each average in 2025-26?",
    answer:
      "Durant, with Houston: 78 games, all starts, 26.0 points, 5.5 rebounds, and 4.8 assists. The awards cell is All-Star and All-NBA. LeBron, with the Lakers: 60 games, 20.9 points, 6.1 rebounds, and 7.2 assists. The awards cell is All-Star. NBA.com's signing story, updated July 27, 2026, prints the same 20.9, 6.1, and 7.2 line.",
  },
  {
    question: "How many championships does each player have?",
    answer:
      "Durant won 2 NBA championships, 2 Finals MVPs, the 2013-14 MVP, and 4 scoring titles, and made 16 All-Star teams. LeBron won 4 NBA championships, 4 Finals MVPs, and 4 MVPs, and made 22 All-Star teams. This page does not turn those honors into a ranking.",
  },
  {
    question: "Where is each player listed for 2026-27?",
    answer:
      "Basketball-Reference lists Durant with the Houston Rockets and LeBron with the Philadelphia 76ers, fetched October 3, 2026. NBA.com's story, updated July 27, 2026, says LeBron announced the move on social media Friday and that it became official on Sunday. His posts on that story are dated July 24, 2026. He told the Lakers on June 30 that he would not return. The story says he logged 23 seasons and will add at least one more this season.",
  },
  {
    question: "Does this page predict 2026-27?",
    answer:
      "No. Stats as of October 3, 2026, neither player page has a 2026-27 regular-season game log. Tables labeled 2026-27 Projection are not quoted. Reported contract dollars in the signing story are labeled as reports, so they are not used. This page does not pick a winner.",
  },
];

const VERDICT = `Career per game: Durant 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games. LeBron 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games.

2025-26: Durant 26.0 points in 78 games. LeBron 20.9 points in 60 games.

Championships on the honors lists: Durant 2. LeBron 4.

2026-27 season: Durant is listed with Houston. LeBron is listed with the 76ers. Stats as of October 3, 2026, there is no regular-season game log. This page does not pick a winner.`;

const EXPERT_ANALYSIS = `Kevin Durant's career line is 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games, totaling 32,597 points. LeBron James's is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games, totaling 43,440 points. In 2025-26 Durant averaged 26.0 points in 78 games and LeBron averaged 20.9 points in 60 games. This page does not pick a winner.

Source note: the career rows, the 2025-26 lines, and the team fields are from Basketball-Reference, fetched ${AS_OF}. The signing and the line that 2026-27 adds at least one season after 23 are from NBA.com's story updated July 27, 2026. ${DURANT_URL} ${LEBRON_URL} ${SIGNING}

2026-27 season. Stats as of ${AS_OF}. Durant's team field is the Houston Rockets. LeBron's is the Philadelphia 76ers. NBA.com says LeBron announced the move Friday, that it became official Sunday, and that he told the Lakers on June 30 he would not return. His posts on that story are dated July 24, 2026. Neither page has a 2026-27 game log. Tables labeled 2026-27 Projection are not quoted.

Honors on the same pages: Durant 2 championships, 2 Finals MVPs, the 2013-14 MVP, 4 scoring titles, and 16 All-Star selections. LeBron 4 championships, 4 Finals MVPs, 4 MVPs, and 22 All-Star selections. Durant played 18 years and debuted in 2007. LeBron played 23 years and debuted in 2003 (Basketball-Reference).`;

const BUILT = buildEditorialComparison({
  slug: "durant-vs-lebron",
  title: "Durant vs LeBron: Careers and 2026-27",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: DURANT,
      slug: DURANT,
      name: "Kevin Durant",
      shortDesc:
        "Career 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games. 2025-26: 26.0 points in 78 games. Listed with Houston.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "Career per game: 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games",
        "2025-26: 26.0 points, 5.5 rebounds, and 4.8 assists in 78 games",
        "Honors list: 2 championships, 2 Finals MVPs, 2013-14 MVP, 4 scoring titles",
      ],
      cons: [
        "Career assists on the per-game row are 4.4",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career scoring average and the 2025-26 Houston line",
    },
    {
      id: LEBRON,
      slug: LEBRON,
      name: "LeBron James",
      shortDesc:
        "Career 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. 2025-26: 20.9 points in 60 games. Listed with the 76ers.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "Career per game: 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games",
        "Totals table: 43,440 points",
        "Honors list: 4 championships, 4 Finals MVPs, 4 MVPs, 22 All-Star selections",
      ],
      cons: [
        "2025-26 scoring average was 20.9, below the career 26.8",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career totals and the July 2026 76ers signing",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "27.1 in 1,201 games",
      entityBValue: "26.8 in 1,622 games",
      winner: "a",
    },
    {
      label: "Career points",
      entityAValue: "32,597",
      entityBValue: "43,440",
      winner: "b",
    },
    {
      label: "2025-26 points per game",
      entityAValue: "26.0 in 78 games",
      entityBValue: "20.9 in 60 games",
      winner: "a",
    },
    {
      label: "Championships on the honors list",
      entityAValue: "2",
      entityBValue: "4",
      winner: "b",
    },
    {
      label: "2026-27 team",
      entityAValue: "Houston Rockets",
      entityBValue: "Philadelphia 76ers",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Career points per game", CAREER_CAT, DURANT, LEBRON, "27.1 in 1,201 games", "26.8 in 1,622 games", "a"),
    textAttr("career-rpg", "Career rebounds per game", CAREER_CAT, DURANT, LEBRON, "6.9", "7.5", "b"),
    textAttr("career-apg", "Career assists per game", CAREER_CAT, DURANT, LEBRON, "4.4", "7.4", "b"),
    textAttr("career-pts", "Career points", CAREER_CAT, DURANT, LEBRON, "32,597", "43,440", "b"),
    textAttr("titles", "Championships on the honors list", CAREER_CAT, DURANT, LEBRON, "2", "4", "b"),
    textAttr(
      "season-2526",
      "2025-26 points per game",
      RECENT_CAT,
      DURANT,
      LEBRON,
      "26.0 points, 5.5 rebounds, 4.8 assists in 78 games",
      "20.9 points, 6.1 rebounds, 7.2 assists in 60 games",
      "a"
    ),
    textAttr(
      "team-2627",
      "Listed team",
      SEASON_CAT,
      DURANT,
      LEBRON,
      `Houston Rockets. No game log. Stats as of ${AS_OF}.`,
      `Philadelphia 76ers. Signed in July 2026. Stats as of ${AS_OF}.`
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
      "Durant 27.1 points in 1,201 games and 26.0 in 2025-26. LeBron 26.8 points in 1,622 games and 20.9 in 2025-26. Durant is listed with Houston. LeBron is listed with the 76ers.",
  },
  citationStats: {
    sourceCount: 3,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: `Basketball-Reference — Kevin Durant (fetched ${FETCHED})`, url: DURANT_URL },
      { name: `Basketball-Reference — LeBron James (fetched ${FETCHED})`, url: LEBRON_URL },
      { name: `NBA.com — LeBron signs with the 76ers (fetched ${FETCHED})`, url: SIGNING },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Kevin Durant",
      url: DURANT_URL,
      description: `Fetched ${FETCHED}. Career 27.1 points, 6.9 rebounds, 4.4 assists in 1,201 games. 2025-26: 26.0 points in 78 games. Team: Houston Rockets.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: LeBron James",
      url: LEBRON_URL,
      description: `Fetched ${FETCHED}. Career 26.8 points, 7.5 rebounds, 7.4 assists in 1,622 games. 2025-26: 20.9 points in 60 games. Team: Philadelphia 76ers.`,
    },
    {
      type: "external",
      label: "NBA.com: LeBron signs with the 76ers",
      url: SIGNING,
      description: `Updated July 27, 2026. July signing. 23 seasons logged, and the story says he will add at least one more. Contract dollars are labeled per reports and are not used.`,
    },
    {
      type: "blog",
      label: "Kevin Durant hub",
      url: "/entity/kevin-durant",
      description: "Kevin Durant player hub.",
    },
    {
      type: "blog",
      label: "LeBron James hub",
      url: "/entity/lebron-james",
      description: "LeBron James player hub.",
    },
  ],
  metaTitle: "Durant vs LeBron: Careers and 2026-27",
});

BUILT.metadata.metaDescription =
  "Durant's career line is 27.1 points in 1,201 games. LeBron's is 26.8 in 1,622. The 2026-27 block is dated October 3, 2026, with no game log.";

export const DURANT_VS_LEBRON: EditorialComparison = BUILT;
