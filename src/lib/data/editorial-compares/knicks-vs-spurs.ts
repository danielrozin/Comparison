import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * NBA batch 2 — Knicks vs Spurs rivalry and Finals history.
 *
 * /compare/knicks-vs-spurs 404d on 3 October 2026.
 * /compare/spurs-vs-knicks 301d to /compare/knicks-vs-spurs.
 * The page is built at that shell slug. No new static redirect.
 *
 * as of 3 October 2026:
 * - https://www.basketball-reference.com/playoffs/NBA_2026.html
 * - https://www.basketball-reference.com/playoffs/NBA_1999.html
 * - https://www.basketball-reference.com/teams/NYK/head2head.html
 * - https://www.basketball-reference.com/teams/SAS/head2head.html
 * The opponent table is not captioned "regular season" on those pages.
 * /entity/new-york-knicks and /entity/san-antonio-spurs were index, follow.
 */

const KNICKS = "new-york-knicks";
const SPURS = "san-antonio-spurs";

const PLAYOFFS_2026 = "https://www.basketball-reference.com/playoffs/NBA_2026.html";
const PLAYOFFS_1999 = "https://www.basketball-reference.com/playoffs/NBA_1999.html";
const NYK_H2H = "https://www.basketball-reference.com/teams/NYK/head2head.html";
const SAS_H2H = "https://www.basketball-reference.com/teams/SAS/head2head.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";

const FINALS_CAT = "NBA Finals · Basketball-Reference";
const H2H_CAT =
  "Head-to-head · Basketball-Reference. Page seasons header: 1946-47 to 2026-27";
const SEASON_CAT = "2026-27 season · Stats as of October 3, 2026";

const SHORT_ANSWER =
  "The New York Knicks beat the San Antonio Spurs 4-1 in the 2026 NBA Finals. The Spurs beat the Knicks 4-1 in the 1999 NBA Finals. Basketball-Reference counts 107 Knicks games against San Antonio, with New York at 47 wins and San Antonio at 60. The Spurs head-to-head count is the same 107 games (Basketball-Reference). Neither is named the winner of a game that has not been played.";

const META_DESCRIPTION =
  "Knicks beat the Spurs 4-1 in the 2026 Finals. Spurs beat the Knicks 4-1 in 1999. Head-to-head: 107 games, Knicks 47 wins, Spurs 60.";

const FAQS = [
  {
    question: "Who won the 2026 NBA Finals between the Knicks and the Spurs?",
    answer:
      "The New York Knicks, 4-1. Basketball-Reference's 2026 playoff summary lists the Knicks as league champion. The games were June 3, New York 105 at San Antonio 95. June 5, New York 105 at San Antonio 104. June 8, San Antonio 115 at New York 111. June 10, San Antonio 106 at New York 107. June 13, New York 94 at San Antonio 90. Finals MVP: Jalen Brunson, 32.6 points, 4.2 rebounds, and 4.6 assists.",
  },
  {
    question: "Who won the 1999 NBA Finals between the Spurs and the Knicks?",
    answer:
      "The San Antonio Spurs, 4-1. Basketball-Reference's 1999 playoff summary lists San Antonio as league champion. The games were June 16, New York 77 at San Antonio 89. June 18, New York 67 at San Antonio 80. June 21, San Antonio 81 at New York 89. June 23, San Antonio 96 at New York 89. June 25, San Antonio 78 at New York 77. Finals MVP: Tim Duncan, 27.4 points, 14.0 rebounds, and 2.4 assists.",
  },
  {
    question: "What is the Knicks vs Spurs head-to-head record?",
    answer:
      "On the Knicks head-to-head table, San Antonio is 107 games, with New York at 47 wins and 60 losses, a .439 win percentage, 104.1 points scored per game, and 106.6 points allowed per game. San Antonio's head-to-head count is the same 107 games, with San Antonio at 60 wins and 47 losses (Basketball-Reference). Both pages head the franchise at seasons 1946-47 to 2026-27. The opponent table is not captioned regular season or playoffs.",
  },
  {
    question: "How many times have the Knicks and the Spurs met in the NBA Finals?",
    answer:
      "Two Finals are on the Basketball-Reference playoff summaries checked October 3, 2026. The 1999 Finals went to the Spurs, 4-1. The 2026 Finals went to the Knicks, 4-1. Those series are the rivalry history, not a score for one night.",
  },
  {
    question: "Have the Knicks and the Spurs played in 2026-27?",
    answer:
      "Not as of October 3, 2026. The 2026-27 regular season had not started on that date, so there is no 2026-27 head-to-head result. Stats as of October 3, 2026.",
  },
  {
    question: "Is the next Knicks vs Spurs game predicted?",
    answer:
      "No. The 1999 Finals and the 2026 Finals are finished series. The head-to-head count is Basketball-Reference's, as of October 3, 2026. Neither is named the winner of a game that has not been played.",
  },
];

const VERDICT = `2026 NBA Finals: Knicks over Spurs, 4-1. 1999 NBA Finals: Spurs over Knicks, 4-1.

Head-to-head table: 107 games, Knicks 47 wins, Spurs 60 wins. The opponent table is not captioned regular season.

2026-27, stats as of October 3, 2026: no games yet. There is no single winner.`;

const EXPERT_ANALYSIS = `The Knicks and the Spurs have split two NBA Finals. New York won the 2026 Finals, 4-1. San Antonio won the 1999 Finals, 4-1. Across the head-to-head table, the series is 107 games, with the Knicks at 47 wins and the Spurs at 60. Neither is named the winner of a game that has not been played.

Source note: the 2026 Finals are from Basketball-Reference's 2026 NBA playoffs summary. The 1999 Finals are from the 1999 NBA playoffs summary. The head-to-head row is from the Knicks opponent table, checked against the Spurs opponent table. Basketball-Reference lists Knicks franchise seasons from 1946-47 to 2026-27, record 3078-3191. The opponent table is not captioned regular season or playoffs.

2026 NBA Finals

Basketball-Reference lists the New York Knicks over the San Antonio Spurs, 4-1, and lists the Knicks as league champion. Finals MVP is Jalen Brunson, 32.6 points, 4.2 rebounds, and 4.6 assists. The games: June 3, New York 105 at San Antonio 95. June 5, New York 105 at San Antonio 104. June 8, San Antonio 115 at New York 111. June 10, San Antonio 106 at New York 107. June 13, New York 94 at San Antonio 90. New York won Games 1, 2, 4, and 5. San Antonio won Game 3.

1999 NBA Finals

Basketball-Reference lists the San Antonio Spurs over the New York Knicks, 4-1, and lists the Spurs as league champion. Finals MVP is Tim Duncan, 27.4 points, 14.0 rebounds, and 2.4 assists. The games: June 16, New York 77 at San Antonio 89. June 18, New York 67 at San Antonio 80. June 21, San Antonio 81 at New York 89. June 23, San Antonio 96 at New York 89. June 25, San Antonio 78 at New York 77. San Antonio won Games 1, 2, 4, and 5. New York won Game 3.

Head-to-head

On the Knicks table, the San Antonio row is 107 games, 47 Knicks wins, 60 Knicks losses, win percentage .439, 11,142 points scored, 11,404 points allowed, 104.1 points scored per game, and 106.6 points allowed per game. On the Spurs table, the New York row is the same 107 games, with San Antonio at 60 wins and 47 losses, win percentage .561, 11,404 points scored, and 11,142 points allowed. Both pages list franchise seasons from 1946-47 to 2026-27.

2026-27 season

Stats as of October 3, 2026. The regular season had not started, so there is no 2026-27 Knicks vs Spurs result to add. The Finals lines above are finished series from 1999 and 2026. They are not a forecast.`;

const built = buildEditorialComparison({
  slug: "knicks-vs-spurs",
  title: "Knicks vs Spurs: Rivalry and Finals",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: KNICKS,
      slug: KNICKS,
      name: "New York Knicks",
      shortDesc:
        "Won the 2026 NBA Finals over the Spurs, 4-1. Lost the 1999 NBA Finals to the Spurs, 4-1.",
      imageUrl: null,
      entityType: "team",
      position: 0,
      pros: [
        "2026 NBA champions. Finals over the Spurs, 4-1 (Basketball-Reference)",
        "Finals MVP Jalen Brunson: 32.6 points, 4.2 rebounds, 4.6 assists",
        "Won Game 3 of the 1999 Finals, 89-81 at home",
      ],
      cons: [
        "Lost the 1999 NBA Finals to the Spurs, 4-1",
        "Head-to-head table: 47 wins and 60 losses in 107 games",
        "No 2026-27 meeting had been played as of October 3, 2026",
      ],
      bestFor: "The 2026 NBA Finals winner against the Spurs",
    },
    {
      id: SPURS,
      slug: SPURS,
      name: "San Antonio Spurs",
      shortDesc:
        "Won the 1999 NBA Finals over the Knicks, 4-1. Lost the 2026 NBA Finals to the Knicks, 4-1.",
      imageUrl: null,
      entityType: "team",
      position: 1,
      pros: [
        "1999 NBA champions. Finals over the Knicks, 4-1 (Basketball-Reference)",
        "Finals MVP Tim Duncan: 27.4 points, 14.0 rebounds, 2.4 assists",
        "Head-to-head table: 60 wins and 47 losses in 107 games",
      ],
      cons: [
        "Lost the 2026 NBA Finals to the Knicks, 4-1",
        "Won only Game 3 of the 2026 Finals, 115-111 in New York",
        "No 2026-27 meeting had been played as of October 3, 2026",
      ],
      bestFor: "The 1999 NBA Finals winner against the Knicks",
    },
  ],
  keyDifferences: [
    {
      label: "2026 NBA Finals",
      entityAValue: "Won, 4-1",
      entityBValue: "Lost, 1-4",
      winner: "a",
    },
    {
      label: "1999 NBA Finals",
      entityAValue: "Lost, 1-4",
      entityBValue: "Won, 4-1",
      winner: "b",
    },
    {
      label: "Head-to-head wins",
      entityAValue: "47 in 107 games",
      entityBValue: "60 in 107 games",
      winner: "b",
    },
    {
      label: "2026-27 games",
      entityAValue: "None as of October 3, 2026",
      entityBValue: "None as of October 3, 2026",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr(
      "finals-2026",
      "2026 NBA Finals",
      FINALS_CAT,
      KNICKS,
      SPURS,
      "Won, 4-1. Brunson Finals MVP",
      "Lost, 1-4",
      "a"
    ),
    textAttr(
      "finals-1999",
      "1999 NBA Finals",
      FINALS_CAT,
      KNICKS,
      SPURS,
      "Lost, 1-4",
      "Won, 4-1. Duncan Finals MVP",
      "b"
    ),
    textAttr(
      "h2h-wins",
      "Head-to-head wins",
      H2H_CAT,
      KNICKS,
      SPURS,
      "47 wins, 60 losses, .439",
      "60 wins, 47 losses, .561",
      "b"
    ),
    textAttr(
      "h2h-ppg",
      "Points per game in those 107 games",
      H2H_CAT,
      KNICKS,
      SPURS,
      "104.1 scored, 106.6 allowed",
      "106.6 scored, 104.1 allowed"
    ),
    textAttr(
      "season-games",
      "2026-27 games played",
      SEASON_CAT,
      KNICKS,
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
      slug: "knicks-vs-76ers",
      title: "Knicks vs 76ers: Rivalry and 2026-27",
      category: "sports",
    },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "Knicks won the 2026 Finals and Spurs won the 1999 Finals. The head-to-head table is a history line, not a pick.",
    keyFact:
      "2026 Finals: Knicks 4-1. 1999 Finals: Spurs 4-1. Head-to-head: 107 games, Knicks 47 wins, Spurs 60 wins.",
  },
  citationStats: {
    sourceCount: 4,
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
        name: "Basketball-Reference — 1999 NBA playoffs",
        url: PLAYOFFS_1999,
      },
      {
        name: "Basketball-Reference — Knicks head-to-head",
        url: NYK_H2H,
      },
      {
        name: "Basketball-Reference — Spurs head-to-head",
        url: SAS_H2H,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference 2026 NBA playoffs",
      url: PLAYOFFS_2026,
      description:
        "Knicks over Spurs, 4-1. League champion: New York Knicks. Finals MVP: Jalen Brunson, 32.6 / 4.2 / 4.6.",
    },
    {
      type: "external",
      label: "Basketball-Reference 1999 NBA playoffs",
      url: PLAYOFFS_1999,
      description:
        "Spurs over Knicks, 4-1. League champion: San Antonio Spurs. Finals MVP: Tim Duncan, 27.4 / 14.0 / 2.4.",
    },
    {
      type: "external",
      label: "Knicks head-to-head",
      url: NYK_H2H,
      description:
        "San Antonio row: 107 games, 47 wins, 60 losses, .439, 104.1 points scored per game, 106.6 allowed. Seasons header 1946-47 to 2026-27.",
    },
    {
      type: "external",
      label: "Spurs head-to-head",
      url: SAS_H2H,
      description:
        "New York row: 107 games, 60 wins, 47 losses, .561. Same games as the Knicks table.",
    },
    {
      type: "blog",
      label: "New York Knicks hub",
      url: "/entity/new-york-knicks",
      description: "New York Knicks team hub.",
    },
    {
      type: "blog",
      label: "San Antonio Spurs hub",
      url: "/entity/san-antonio-spurs",
      description: "San Antonio Spurs team hub.",
    },
  ],
  metaTitle: "Knicks vs Spurs: Rivalry and Finals | A Versus B",
});

built.metadata.metaDescription = META_DESCRIPTION;

export const KNICKS_VS_SPURS: EditorialComparison = built;
