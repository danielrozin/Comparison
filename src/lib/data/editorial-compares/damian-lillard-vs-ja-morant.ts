import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Lillard vs Morant. Career lines are the Basketball-Reference per-game and
 * totals tables. The trade is the NBA.com story updated June 30, 2026. The
 * October 21 game is the NBA.com games page. Fetched 2026-10-03.
 * No prediction. The 2026-27 projection table is not quoted.
 */

const LILLARD = "damian-lillard";
const MORANT = "ja-morant";

const LILLARD_URL = "https://www.basketball-reference.com/players/l/lillada01.html";
const MORANT_URL = "https://www.basketball-reference.com/players/m/moranja01.html";
const TRADE = "https://www.nba.com/news/blazers-grizzlies-ja-morant-trade";
const SCHEDULE = "https://www.nba.com/games?date=2026-10-21";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER_CAT = `Career per game · Basketball-Reference, fetched ${FETCHED}`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;
const SCHEDULE_CAT = `Schedule · NBA.com games page, fetched ${FETCHED}`;

const SHORT_ANSWER =
  "On the Basketball-Reference per-game table, Damian Lillard's career line is 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games. Ja Morant's is 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games. Both are listed with the Portland Trail Blazers. NBA.com's story, updated June 30, 2026, says Portland and Memphis agreed on a trade Monday that sent Morant to Portland. That Monday was June 29, 2026. Stats as of October 3, 2026, there is no 2026-27 regular-season game log. This page does not predict the season.";

const FAQS = [
  {
    question: "Where are Damian Lillard and Ja Morant listed for 2026-27?",
    answer:
      "Basketball-Reference lists both with the Portland Trail Blazers, fetched October 3, 2026. NBA.com's story, updated June 30, 2026, says the Trail Blazers and Grizzlies agreed on a trade Monday. Portland received Ja Morant. Memphis received Jerami Grant and Kris Murray. The story lists Damian Lillard on Portland's roster with Jrue Holiday and Scoot Henderson. The Blazers' post and the Grizzlies' post on that story are dated June 30, 2026.",
  },
  {
    question: "What day was the Morant trade?",
    answer:
      "The NBA.com story was updated June 30, 2026, and it says the teams agreed on the trade Monday. June 29, 2026 was a Monday. The story does not print the numeral June 29. It does print the players: Ja Morant to Portland, Jerami Grant and Kris Murray to Memphis. A cash figure in that story is attributed to a later newsletter report, so this page does not use it.",
  },
  {
    question: "What are their career scoring lines?",
    answer:
      "Lillard's per-game career row is 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games over 13 years. The totals table lists 22,598 points. Morant's per-game career row is 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games over 7 years. The totals table lists 7,331 points. Shooting on those per-game rows is .439 / .371 / .899 for Lillard and .466 / .311 / .773 for Morant, field goals, threes, and free throws.",
  },
  {
    question: "Did Lillard play in 2025-26?",
    answer:
      "The 2025-26 row on his per-game table says he did not play, injured (Achilles). His last logged season on that table is 2024-25 with Milwaukee: 58 games, 24.9 points, 4.7 rebounds, and 7.1 assists. This page does not add a playing-status line that row does not print.",
  },
  {
    question: "What did Morant average in 2025-26?",
    answer:
      "With Memphis, 20 games, all starts, 19.5 points, 3.3 rebounds, and 8.1 assists. NBA.com's trade story prints the same 19.5 points and 8.1 assists over 20 games, and a career average of 22.4 points. The honors list on his Basketball-Reference page shows 2 All-Star selections, 2021-22 All-NBA, 2019-20 Rookie of the Year, and 2021-22 Most Improved.",
  },
  {
    question: "When do the Trail Blazers play the Suns?",
    answer:
      "NBA.com's games page for October 21, 2026 lists Phoenix at Portland at 10:00 pm ET, regular season, game 0022600092. Both teams are shown at 0-0. That is a schedule fact for the teams. The page does not say Lillard is playing that night. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log, and this page does not quote a projection.",
  },
];

const VERDICT = `Career per game: Lillard 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games. Morant 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games.

2025-26: Lillard's row says he did not play, injured (Achilles). Morant played 20 games for Memphis at 19.5 points, 3.3 rebounds, and 8.1 assists.

2026-27 season: Both are listed with Portland. The trade story updated June 30, 2026 says the teams agreed Monday, June 29, 2026. Stats as of October 3, 2026, there is no regular-season game log. The Suns are at the Trail Blazers on October 21, 2026, at 10:00 pm ET. This page does not pick a winner and does not predict that game.`;

const EXPERT_ANALYSIS = `Damian Lillard's career line on the per-game table is 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games. Ja Morant's is 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games. Basketball-Reference lists both with the Portland Trail Blazers. This page does not predict 2026-27.

Source note: the per-game rows, totals, team fields, and the 2025-26 injury note are from Basketball-Reference, fetched ${AS_OF}. The trade is from NBA.com's story updated June 30, 2026. The October 21 game is from NBA.com's games page. ${LILLARD_URL} ${MORANT_URL} ${TRADE} ${SCHEDULE}

2026-27 season. Stats as of ${AS_OF}. No regular-season game log is on either player page, so this page does not quote a 2026-27 scoring line. Morant's page has a table labeled 2026-27 Projection, and this page does not quote it. NBA.com lists Phoenix at Portland on October 21, 2026, at 10:00 pm ET. That is the schedule. It is not a statement that Lillard is in the lineup. His 2025-26 per-game row says he did not play, injured (Achilles). The June 30 story lists him on Portland's current roster. This page does not add a health clearance or a return date the sources do not print.

The trade. The story says Portland and Memphis agreed Monday. The story was updated June 30, 2026, and June 29, 2026 was that Monday. Portland received Ja Morant. Memphis received Jerami Grant and Kris Murray. The same story says Grant averaged 18.6 points and 3.5 rebounds over 57 games last season, and Murray averaged 5.8 points and 3.6 rebounds over 56 games. Lillard made 9 All-Star teams, with 7 All-NBA selections, 2012-13 Rookie of the Year, and 2023-24 All-Star Game MVP. Morant made 2 All-Star teams, with 2021-22 All-NBA, 2019-20 Rookie of the Year, and 2021-22 Most Improved.`;

const BUILT = buildEditorialComparison({
  slug: "damian-lillard-vs-ja-morant",
  title: "Lillard vs Morant: Careers and 2026-27",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: LILLARD,
      slug: LILLARD,
      name: "Damian Lillard",
      shortDesc:
        "Career 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games. Listed with Portland. 2025-26 row: did not play, injured (Achilles).",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "Career per game: 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games",
        "Totals table: 22,598 points",
        "9 All-Star selections, 7 All-NBA, 2012-13 Rookie of the Year",
        "Listed with the Portland Trail Blazers",
      ],
      cons: [
        "2025-26 per-game row: did not play, injured (Achilles)",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career per-game line and the Portland roster note",
    },
    {
      id: MORANT,
      slug: MORANT,
      name: "Ja Morant",
      shortDesc:
        "Career 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games. Traded to Portland in the deal NBA.com dated to that Monday.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "Career per game: 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games",
        "2025-26: 19.5 points and 8.1 assists in 20 games",
        "2 All-Star selections, 2019-20 Rookie of the Year, 2021-22 Most Improved",
      ],
      cons: [
        "2025-26 line was 20 games, all with Memphis",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The 2025-26 line and the trade to Portland",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "25.1 in 900 games",
      entityBValue: "22.4 in 327 games",
      winner: "a",
    },
    {
      label: "Career assists per game",
      entityAValue: "6.7",
      entityBValue: "7.4",
      winner: "b",
    },
    {
      label: "2025-26 games",
      entityAValue: "Did not play, injured (Achilles)",
      entityBValue: "20 games, 19.5 points, 8.1 assists",
      winner: "tie",
    },
    {
      label: "2026-27 team",
      entityAValue: "Portland Trail Blazers",
      entityBValue: "Portland Trail Blazers",
      winner: "tie",
    },
    {
      label: "October 21, 2026",
      entityAValue: "Suns at Trail Blazers, 10:00 pm ET. Schedule only.",
      entityBValue: "Same game. Schedule only.",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Career points per game", CAREER_CAT, LILLARD, MORANT, "25.1 in 900 games", "22.4 in 327 games", "a"),
    textAttr("career-rpg", "Career rebounds per game", CAREER_CAT, LILLARD, MORANT, "4.3", "4.6", "b"),
    textAttr("career-apg", "Career assists per game", CAREER_CAT, LILLARD, MORANT, "6.7", "7.4", "b"),
    textAttr("career-pts", "Career points", CAREER_CAT, LILLARD, MORANT, "22,598", "7,331", "a"),
    textAttr(
      "season-2526",
      "2025-26 per game",
      CAREER_CAT,
      LILLARD,
      MORANT,
      "Did not play, injured (Achilles)",
      "20 games, 19.5 points, 3.3 rebounds, 8.1 assists, Memphis"
    ),
    textAttr(
      "team-2627",
      "Listed team",
      SEASON_CAT,
      LILLARD,
      MORANT,
      `Portland Trail Blazers. Stats as of ${AS_OF}. No game log.`,
      `Portland Trail Blazers. Trade agreed Monday, June 29, 2026. Stats as of ${AS_OF}.`
    ),
    textAttr(
      "opener",
      "October 21, 2026",
      SCHEDULE_CAT,
      LILLARD,
      MORANT,
      "Suns at Trail Blazers, 10:00 pm ET. Schedule only.",
      "Suns at Trail Blazers, 10:00 pm ET. Schedule only."
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
      "Lillard 25.1 points in 900 games. Morant 22.4 points in 327 games. Both are listed with Portland. The Suns are at Portland on October 21, 2026, at 10:00 pm ET. That game is a schedule fact.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: `Basketball-Reference — Damian Lillard (fetched ${FETCHED})`, url: LILLARD_URL },
      { name: `Basketball-Reference — Ja Morant (fetched ${FETCHED})`, url: MORANT_URL },
      { name: `NBA.com — Morant trade (fetched ${FETCHED})`, url: TRADE },
      { name: `NBA.com — games on October 21, 2026 (fetched ${FETCHED})`, url: SCHEDULE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Damian Lillard",
      url: LILLARD_URL,
      description: `Fetched ${FETCHED}. Career 25.1 points, 4.3 rebounds, 6.7 assists in 900 games. 2025-26: did not play, injured (Achilles). Team: Portland Trail Blazers.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Ja Morant",
      url: MORANT_URL,
      description: `Fetched ${FETCHED}. Career 22.4 points, 4.6 rebounds, 7.4 assists in 327 games. 2025-26: 19.5 points and 8.1 assists in 20 games. Team: Portland Trail Blazers.`,
    },
    {
      type: "external",
      label: "NBA.com: Trail Blazers add Ja Morant",
      url: TRADE,
      description: `Updated June 30, 2026. Teams agreed Monday. Morant to Portland. Grant and Murray to Memphis. Lillard is listed on the Portland roster.`,
    },
    {
      type: "external",
      label: "NBA.com games for October 21, 2026",
      url: SCHEDULE,
      description: `Fetched ${FETCHED}. Phoenix at Portland, 10:00 pm ET, game 0022600092. Schedule fact only.`,
    },
  ],
  metaTitle: "Lillard vs Morant: Careers and 2026-27",
});

BUILT.metadata.metaDescription =
  "Lillard's career line is 25.1 points in 900 games. Morant's is 22.4 in 327. Both are listed with Portland. Stats as of October 3, 2026.";

export const DAMIAN_LILLARD_VS_JA_MORANT: EditorialComparison = BUILT;
