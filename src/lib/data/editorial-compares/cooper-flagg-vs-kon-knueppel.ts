import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Flagg vs Knueppel. Rookie lines, draft info, and honors are
 * Basketball-Reference. The 2026-27 projection
 * tables are not quoted. No prediction.
 */

const FLAGG = "cooper-flagg";
const KNUEPPEL = "kon-knueppel";

const FLAGG_URL = "https://www.basketball-reference.com/players/f/flaggco01.html";
const KNUEPPEL_URL = "https://www.basketball-reference.com/players/k/knuepko01.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const ROOKIE_CAT = `2025-26 per game · Basketball-Reference`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Cooper Flagg's 2025-26 line is 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games for Dallas. Kon Knueppel's is 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games for Charlotte. Flagg won 2025-26 Rookie of the Year. Knueppel finished second in that vote and made 2025-26 All-Rookie. Stats as of October 3, 2026, neither player has a 2026-27 regular-season game log. There is no 2026-27 forecast.";

const FAQS = [
  {
    question: "What did Cooper Flagg average as a rookie?",
    answer:
      "The 2025-26 per-game line is 70 games, all starts, 33.5 minutes, 21.0 points, 6.7 rebounds, 4.5 assists, 1.2 steals, and 0.9 blocks. Shooting is .468 from the field, .295 from three, and .827 from the line. He scored 1,473 points. He won 2025-26 Rookie of the Year and made 2025-26 All-Rookie.",
  },
  {
    question: "What did Kon Knueppel average as a rookie?",
    answer:
      "The 2025-26 per-game line is 81 games, 80 starts, 31.5 minutes, 18.5 points, 5.3 rebounds, 3.4 assists, 0.7 steals, and 0.2 blocks. Shooting is .475 from the field, .425 from three, and .863 from the line. He scored 1,498 points. He finished second in Rookie of the Year voting, made 2025-26 All-Rookie, and did not win Rookie of the Year.",
  },
  {
    question: "Where were they drafted?",
    answer:
      "Flagg's info box says the Dallas Mavericks drafted him 1st overall in 2025. He debuted October 22, 2025. Knueppel's info box says the Charlotte Hornets drafted him 4th overall in 2025. He debuted the same day. Both pages list Duke. Flagg is listed at 6-9 and 205 pounds, born December 21, 2006. Knueppel is listed at 6-6 and 215 pounds, born August 3, 2005.",
  },
  {
    question: "Who is listed as Rookie of the Year?",
    answer:
      "Flagg. The honors list prints 2025-26 Rookie of the Year, and the season awards cell is ROY-1. Knueppel's season awards cell is ROY-2, which is the voting place on that cell, and his honors list is All-Rookie. Knueppel is not called the Rookie of the Year.",
  },
  {
    question: "Where is each player listed for 2026-27?",
    answer:
      "Basketball-Reference lists Flagg with the Dallas Mavericks and Knueppel with the Charlotte Hornets. Each info box says experience of 1 year. Stats as of October 3, 2026, neither page has a 2026-27 regular-season game log.",
  },
  {
    question: "Is the 2026-27 projection used?",
    answer:
      "No. Both pages include a table labeled 2026-27 Projection. That table is not quoted. There is no 2026-27 game log to put in its place, and there is no 2026-27 forecast.",
  },
];

const VERDICT = `2025-26 per game: Flagg 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games. Knueppel 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games.

Honors: Flagg won 2025-26 Rookie of the Year. Knueppel finished second in that vote and made 2025-26 All-Rookie.

2026-27 season: Flagg is listed with Dallas. Knueppel is listed with Charlotte. Stats as of October 3, 2026, there is no regular-season game log. Neither is named the winner of the 2026-27 season.`;

const EXPERT_ANALYSIS = `Cooper Flagg averaged 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games as a rookie. Kon Knueppel averaged 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games. Flagg won 2025-26 Rookie of the Year. Knueppel did not. There is no 2026-27 forecast.

Source note: the per-game rows, totals, draft lines, and honors are from the two Basketball-Reference player pages. ${FLAGG_URL} ${KNUEPPEL_URL}

2026-27 season. Stats as of ${AS_OF}. Flagg's team field is the Dallas Mavericks. Knueppel's is the Charlotte Hornets. Neither page has a 2026-27 regular-season game log. Each page has a table labeled 2026-27 Projection, and that table is not quoted.

The rookie shooting lines are .468 / .295 / .827 for Flagg and .475 / .425 / .863 for Knueppel, field goals, threes, and free throws. Point totals are 1,473 and 1,498. Both debuted October 22, 2025. Flagg was the 1st overall pick. Knueppel was the 4th.`;

const BUILT = buildEditorialComparison({
  slug: "cooper-flagg-vs-kon-knueppel",
  title: "Flagg vs Knueppel: Rookie Seasons",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: FLAGG,
      slug: FLAGG,
      name: "Cooper Flagg",
      shortDesc:
        "2025-26: 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games. Honors list: 2025-26 Rookie of the Year. Listed with Dallas.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "2025-26: 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games",
        "Honors list: 2025-26 Rookie of the Year and All-Rookie",
        "Drafted 1st overall by Dallas in 2025",
      ],
      cons: [
        "Three-point percentage on the rookie row is .295",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The Rookie of the Year line and the 21.0 scoring average",
    },
    {
      id: KNUEPPEL,
      slug: KNUEPPEL,
      name: "Kon Knueppel",
      shortDesc:
        "2025-26: 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games. Awards cell ROY-2. Honors list: 2025-26 All-Rookie. Listed with Charlotte.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "2025-26: 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games",
        "Three-point percentage on that row: .425",
        "Totals table: 1,498 points",
        "Honors list: 2025-26 All-Rookie",
      ],
      cons: [
        "Awards cell reads ROY-2, and the honors list does not show Rookie of the Year",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The 81-game rookie line and the three-point percentage",
    },
  ],
  keyDifferences: [
    {
      label: "2025-26 points per game",
      entityAValue: "21.0 in 70 games",
      entityBValue: "18.5 in 81 games",
      winner: "a",
    },
    {
      label: "2025-26 three-point percentage",
      entityAValue: ".295",
      entityBValue: ".425",
      winner: "b",
    },
    {
      label: "Rookie of the Year on the honors list",
      entityAValue: "2025-26 Rookie of the Year",
      entityBValue: "Not listed. Awards cell is ROY-2",
      winner: "a",
    },
    {
      label: "2026-27 team",
      entityAValue: "Dallas Mavericks",
      entityBValue: "Charlotte Hornets",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("ppg", "2025-26 points per game", ROOKIE_CAT, FLAGG, KNUEPPEL, "21.0 in 70 games", "18.5 in 81 games", "a"),
    textAttr("rpg", "2025-26 rebounds per game", ROOKIE_CAT, FLAGG, KNUEPPEL, "6.7", "5.3", "a"),
    textAttr("apg", "2025-26 assists per game", ROOKIE_CAT, FLAGG, KNUEPPEL, "4.5", "3.4", "a"),
    textAttr("fg3", "2025-26 three-point percentage", ROOKIE_CAT, FLAGG, KNUEPPEL, ".295", ".425", "b"),
    textAttr("pts", "2025-26 points", ROOKIE_CAT, FLAGG, KNUEPPEL, "1,473", "1,498", "b"),
    textAttr("roy", "Rookie of the Year", ROOKIE_CAT, FLAGG, KNUEPPEL, "Honors list: 2025-26 Rookie of the Year", "Not on the honors list. Awards cell: ROY-2", "a"),
    textAttr(
      "team-2627",
      "Listed team",
      SEASON_CAT,
      FLAGG,
      KNUEPPEL,
      `Dallas Mavericks. No game log. Stats as of ${AS_OF}.`,
      `Charlotte Hornets. No game log. Stats as of ${AS_OF}.`
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "lebron-vs-jordan", title: "LeBron vs Jordan", category: "sports" },
    { slug: "shai-gilgeous-alexander-vs-victor-wembanyama", title: "SGA vs Wembanyama", category: "sports" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "No page-level winner and no 2026-27 prediction. The rookie rows and the honors lists are finished results.",
    keyFact:
      "Flagg 21.0 points in 70 games and 2025-26 Rookie of the Year on the honors list. Knueppel 18.5 points in 81 games, awards cell ROY-2, honors list All-Rookie.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Cooper Flagg`, url: FLAGG_URL },
      { name: `Basketball-Reference — Kon Knueppel`, url: KNUEPPEL_URL },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Cooper Flagg",
      url: FLAGG_URL,
      description: `2025-26: 21.0 points, 6.7 rebounds, 4.5 assists in 70 games. Honors: 2025-26 Rookie of the Year. Team: Dallas Mavericks.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Kon Knueppel",
      url: KNUEPPEL_URL,
      description: `2025-26: 18.5 points, 5.3 rebounds, 3.4 assists in 81 games. Awards cell ROY-2. Honors: 2025-26 All-Rookie. Team: Charlotte Hornets.`,
    },
  ],
  metaTitle: "Flagg vs Knueppel: Rookie Seasons",
});

BUILT.metadata.metaDescription =
  "Flagg averaged 21.0 points in 70 games and is 2025-26 Rookie of the Year on his honors list. Knueppel averaged 18.5 in 81 games. Stats as of October 3, 2026.";

export const COOPER_FLAGG_VS_KON_KNUEPPEL: EditorialComparison = BUILT;
