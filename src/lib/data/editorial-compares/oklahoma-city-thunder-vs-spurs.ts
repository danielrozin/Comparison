import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * NBA batch 2 — Spurs vs Thunder.
 *
 * The brief URL /compare/spurs-vs-oklahoma-city-thunder 301s to
 * /compare/oklahoma-city-thunder-vs-spurs, which 404d on 3 October 2026.
 * That alphabetical slug is the shell canonical, so the page lives here.
 * There is no static redirect entry. Publishing this slug is what makes
 * the existing 301 land on a page.
 *
 * as of 3 October 2026:
 * - https://www.basketball-reference.com/playoffs/NBA_2026.html
 * - https://www.nba.com/games?date=2026-10-20
 * Entity hubs /entity/oklahoma-city-thunder and /entity/san-antonio-spurs
 * were index, follow. No 52-30 record. No pick for the October 20 game.
 * Basketball-Reference 2026-27 projection rows are not quoted.
 */

const THUNDER = "oklahoma-city-thunder";
const SPURS = "san-antonio-spurs";

const PLAYOFFS_2026 = "https://www.basketball-reference.com/playoffs/NBA_2026.html";
const SCHEDULE = "https://www.nba.com/games?date=2026-10-20";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";

const PLAYOFF_CAT = "2026 playoffs · Basketball-Reference";
const SEASON_CAT = "2026-27 season · Stats as of October 3, 2026 · NBA.com schedule";

const SHORT_ANSWER =
  "The San Antonio Spurs beat the Oklahoma City Thunder 4-3 in the 2026 Western Conference Finals. Game 7 on May 30, 2026 was San Antonio 111 at Oklahoma City 103 (Basketball-Reference). NBA.com schedules Oklahoma City at San Antonio on October 20, 2026, at 9:30 pm ET. Neither is named the winner of the October 20 game.";

const META_DESCRIPTION =
  "Spurs beat the Thunder 4-3 in the 2026 West Finals. Game 7 on May 30, 2026 was 111-103. OKC is at San Antonio on October 20, 2026, at 9:30 pm ET.";

const FAQS = [
  {
    question: "Who won the 2026 Western Conference Finals, the Spurs or the Thunder?",
    answer:
      "The San Antonio Spurs. San Antonio beat Oklahoma City, 4-3 (Basketball-Reference). Game 7 was May 30, 2026: San Antonio 111 at Oklahoma City 103.",
  },
  {
    question: "What was the score of Game 7 of the 2026 Western Conference Finals?",
    answer:
      "San Antonio 111, Oklahoma City 103, on Saturday, May 30, 2026, in Oklahoma City (Basketball-Reference).",
  },
  {
    question: "When do the Thunder play the Spurs next?",
    answer:
      "NBA.com schedules Oklahoma City at San Antonio on October 20, 2026, at 9:30 pm ET. Neither is named the winner of that game.",
  },
  {
    question: "Has the 2026-27 season started for the Thunder and the Spurs?",
    answer:
      "Not on October 3, 2026. The October 20 game is still ahead.",
  },
  {
    question: "Where is the 2026 Spurs vs Thunder series documented?",
    answer:
      "Game 1, May 18: San Antonio 122 at Oklahoma City 115. Game 2, May 20: San Antonio 113 at Oklahoma City 122. Game 3, May 22: Oklahoma City 123 at San Antonio 108. Game 4, May 24: Oklahoma City 82 at San Antonio 103. Game 5, May 26: San Antonio 114 at Oklahoma City 127. Game 6, May 28: Oklahoma City 91 at San Antonio 118. Game 7, May 30: San Antonio 111 at Oklahoma City 103 (Basketball-Reference).",
  },
  {
    question: "Is the October 20 Spurs vs Thunder game predicted?",
    answer:
      "No. NBA.com schedules the game for October 20, 2026, at 9:30 pm ET, Oklahoma City at San Antonio. The 2026 Western Conference Finals is a finished series. Neither is named the winner of a game that has not been played.",
  },
];

const VERDICT = `Finished series: the Spurs won the 2026 Western Conference Finals, 4-3. Game 7 on May 30, 2026 was San Antonio 111, Oklahoma City 103.

2026-27 schedule, stats as of October 3, 2026: Oklahoma City at San Antonio on October 20, 2026, 9:30 pm ET. That is a tip time, not a pick.

Neither is named the winner.`;

const EXPERT_ANALYSIS = `The San Antonio Spurs beat the Oklahoma City Thunder 4-3 in the 2026 Western Conference Finals. Game 7 on May 30, 2026 was San Antonio 111 at Oklahoma City 103 (Basketball-Reference). As of October 3, 2026, NBA.com schedules the next meeting for October 20, 2026, at 9:30 pm ET, Oklahoma City at San Antonio. Neither is named the winner of that game.

2026 Western Conference Finals

San Antonio beat Oklahoma City, 4-3 (Basketball-Reference). The games are: May 18, San Antonio 122 at Oklahoma City 115. May 20, San Antonio 113 at Oklahoma City 122. May 22, Oklahoma City 123 at San Antonio 108. May 24, Oklahoma City 82 at San Antonio 103. May 26, San Antonio 114 at Oklahoma City 127. May 28, Oklahoma City 91 at San Antonio 118. May 30, San Antonio 111 at Oklahoma City 103. San Antonio won Games 1, 4, 6, and 7. Oklahoma City won Games 2, 3, and 5.

2026-27 season

Stats as of October 3, 2026. The 2026-27 regular season had not started. NBA.com schedules the Thunder at the Spurs for October 20, 2026, at 9:30 pm ET, in San Antonio. Neither team is named the winner.

What is not included

The finished series above is the 2026 playoffs. It is not a 2026-27 result.`;

const built = buildEditorialComparison({
  slug: "oklahoma-city-thunder-vs-spurs",
  title: "Spurs vs Thunder: 2026 West Finals",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: THUNDER,
      slug: THUNDER,
      name: "Oklahoma City Thunder",
      shortDesc:
        "Lost the 2026 Western Conference Finals to the Spurs, 4-3. Game 7 was 103-111 at home on May 30, 2026.",
      imageUrl: null,
      entityType: "team",
      position: 0,
      pros: [
        "Won Games 2, 3, and 5 of the 2026 Western Conference Finals (Basketball-Reference)",
        "Game 5 was 127-114 at home on May 26, 2026",
        "Scheduled at San Antonio on October 20, 2026, 9:30 pm ET (NBA.com)",
      ],
      cons: [
        "Lost the series 4-3",
        "Game 7 on May 30, 2026 was 103-111 at home",
        "Game 6 on May 28, 2026 was 91-118 in San Antonio",
      ],
      bestFor: "The 2026 Western Conference Finals loser, 4-3",
    },
    {
      id: SPURS,
      slug: SPURS,
      name: "San Antonio Spurs",
      shortDesc:
        "Won the 2026 Western Conference Finals over the Thunder, 4-3. Game 7 was 111-103 in Oklahoma City.",
      imageUrl: null,
      entityType: "team",
      position: 1,
      pros: [
        "Won the 2026 Western Conference Finals, 4-3 (Basketball-Reference)",
        "Won Game 7 on May 30, 2026, 111-103 in Oklahoma City",
        "Host Oklahoma City on October 20, 2026, 9:30 pm ET (NBA.com)",
      ],
      cons: [
        "Lost Games 2, 3, and 5 of that series",
        "Game 3 on May 22, 2026 was 108-123 at home",
        "The October 20, 2026 game had not been played as of October 3, 2026",
      ],
      bestFor: "The 2026 Western Conference Finals winner, 4-3",
    },
  ],
  keyDifferences: [
    {
      label: "2026 Western Conference Finals",
      entityAValue: "3 wins",
      entityBValue: "4 wins",
      winner: "b",
    },
    {
      label: "Game 7, May 30, 2026",
      entityAValue: "103",
      entityBValue: "111",
      winner: "b",
    },
    {
      label: "October 20, 2026",
      entityAValue: "At San Antonio, 9:30 pm ET",
      entityBValue: "Home against Oklahoma City, 9:30 pm ET",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "wcf-2026",
      "2026 Western Conference Finals",
      PLAYOFF_CAT,
      THUNDER,
      SPURS,
      "Lost, 3 wins to 4",
      "Won, 4 wins to 3",
      "b"
    ),
    textAttr(
      "game-7",
      "Game 7, May 30, 2026",
      PLAYOFF_CAT,
      THUNDER,
      SPURS,
      "103 at home",
      "111 in Oklahoma City",
      "b"
    ),
    textAttr(
      "series-games",
      "Series games won",
      PLAYOFF_CAT,
      THUNDER,
      SPURS,
      "Games 2, 3, and 5",
      "Games 1, 4, 6, and 7",
      "b"
    ),
    textAttr(
      "oct-20",
      "October 20, 2026",
      SEASON_CAT,
      THUNDER,
      SPURS,
      "At San Antonio, 9:30 pm ET",
      "Home, 9:30 pm ET"
    ),
    textAttr(
      "season-games",
      "2026-27 games played",
      SEASON_CAT,
      THUNDER,
      SPURS,
      "None as of October 3, 2026",
      "None as of October 3, 2026"
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    {
      slug: "lebron-vs-jordan",
      title: "LeBron James vs Michael Jordan",
      category: "sports",
    },
    {
      slug: "kobe-bryant-vs-lebron-james",
      title: "Kobe Bryant vs LeBron James",
      category: "sports",
    },
    {
      slug: "shai-gilgeous-alexander-vs-victor-wembanyama",
      title: "Shai Gilgeous-Alexander vs Wembanyama",
      category: "sports",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "The 2026 Western Conference Finals is a finished series. NBA.com schedules the October 20, 2026 game for 9:30 pm ET.",
    keyFact:
      "Spurs over Thunder, 4-3. Game 7 on May 30, 2026: San Antonio 111, Oklahoma City 103. Next game: Oklahoma City at San Antonio, October 20, 2026, 9:30 pm ET.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 5,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "Basketball-Reference — 2026 NBA playoffs",
        url: PLAYOFFS_2026,
      },
      {
        name: "NBA.com — games for 2026-10-20",
        url: SCHEDULE,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference 2026 NBA playoffs",
      url: PLAYOFFS_2026,
      description:
        "Spurs over Thunder, 4-3. Game 7 on May 30, 2026: San Antonio 111 at Oklahoma City 103.",
    },
    {
      type: "external",
      label: "NBA.com games on October 20, 2026",
      url: SCHEDULE,
      description:
        "OKC at SAS, 9:30 pm ET. Schedule only.",
    },
    {
      type: "blog",
      label: "Oklahoma City Thunder hub",
      url: "/entity/oklahoma-city-thunder",
      description: "Oklahoma City Thunder team hub.",
    },
    {
      type: "blog",
      label: "San Antonio Spurs hub",
      url: "/entity/san-antonio-spurs",
      description: "San Antonio Spurs team hub.",
    },
  ],
  metaTitle: "Spurs vs Thunder: 2026 West Finals | A Versus B",
});

built.metadata.metaDescription = META_DESCRIPTION;

export const OKLAHOMA_CITY_THUNDER_VS_SPURS: EditorialComparison = built;
