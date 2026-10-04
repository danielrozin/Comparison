import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Joel Embiid vs Nikola Jokic. Career lines, the 2025-26 regular season, and
 * the honors lists are from Basketball-Reference. 2026-10-03.
 * Projection rows are not quoted. No winner and no prediction.
 */

const EMBIID = "joel-embiid";
const JOKIC = "nikola-jokic";

const EMBIID_URL = "https://www.basketball-reference.com/players/e/embiijo01.html";
const JOKIC_URL = "https://www.basketball-reference.com/players/j/jokicni01.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER = `Career · Basketball-Reference`;
const LAST = `2025-26 regular season · Basketball-Reference`;
const THIS = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Joel Embiid's career line is 27.6 points, 10.8 rebounds, and 3.7 assists in 490 games. Nikola Jokic's career line is 22.2 points, 11.1 rebounds, and 7.5 assists in 810 games. Embiid won the 2022-23 MVP. Jokic won MVP in 2020-21, 2021-22, and 2023-24, plus the 2023 championship. Stats as of October 3, 2026, neither player has a 2026-27 regular-season game log, and the projection rows are not used. Neither is named the better player.";

const FAQS = [
  {
    question: "What are Joel Embiid's and Nikola Jokic's career lines?",
    answer:
      "Embiid, in 10 seasons and 490 games: 13,544 points, at 27.6 points, 10.8 rebounds, and 3.7 assists per game. Jokic, in 11 seasons and 810 games: 18,009 points, at 22.2 points, 11.1 rebounds, and 7.5 assists per game. Both lines are the Basketball-Reference career rows.",
  },
  {
    question: "What did Embiid and Jokic average in 2025-26?",
    answer:
      "Embiid played 38 games, all starts, at 31.6 minutes: 26.9 points, 7.7 rebounds, and 3.9 assists. Jokic played 65 games, all starts, at 34.8 minutes: 27.7 points, 12.9 rebounds, and 10.7 assists. Jokic's 2025-26 awards cell reads MVP-2, All-Star, and All-NBA. Embiid's 2025-26 awards cell is blank.",
  },
  {
    question: "Which MVP seasons did each player win?",
    answer:
      "Embiid won the 2022-23 MVP. Jokic won MVP in 2020-21, 2021-22, and 2023-24. Jokic also won the 2023 championship, the 2022-23 Finals MVP, and the 2022-23 West finals MVP. Nothing is stated about the 2026-27 MVP award.",
  },
  {
    question: "Has the 2026-27 season started for Embiid and Jokic?",
    answer:
      "No regular-season game log is on either page. Stats as of October 3, 2026. Each 2026-27 table is labeled a projection, and those rows are not used. Embiid is listed with the Philadelphia 76ers. Jokic is listed with the Denver Nuggets.",
  },
  {
    question: "How many All-Star selections does each player have?",
    answer:
      "Embiid made 7 All-Star teams, with 5 All-NBA selections and 3 All-Defensive selections. Jokic made 8 All-Star teams and 8 All-NBA teams.",
  },
  {
    question: "Who is the better player, Embiid or Jokic?",
    answer:
      "Neither is named the better player. Embiid's column is the higher career scoring average and the 2022-23 MVP. Jokic's column is the longer career, the assist line, three MVP seasons, and the 2023 championship. The 2026-27 season has no game log yet.",
  },
];

const VERDICT = `Career points per game: Embiid 27.6, Jokic 22.2. Career rebounds per game: Jokic 11.1, Embiid 10.8. Career assists per game: Jokic 7.5, Embiid 3.7.

2025-26 regular season: Embiid 26.9 points in 38 games. Jokic 27.7 points, 12.9 rebounds, and 10.7 assists in 65 games.

MVPs: Embiid in 2022-23. Jokic in 2020-21, 2021-22, and 2023-24. Jokic also won the 2023 championship.

2026-27 season: Stats as of October 3, 2026, there is no regular-season game log. Neither is named the winner of the 2026-27 season. There is no game forecast.`;

const EXPERT_ANALYSIS = `Joel Embiid's career line is 27.6 points, 10.8 rebounds, and 3.7 assists in 490 games. Nikola Jokic's career line is 22.2 points, 11.1 rebounds, and 7.5 assists in 810 games. Embiid was MVP in 2022-23. Jokic was MVP in 2020-21, 2021-22, and 2023-24. Neither is named the better player.

Source note: career totals, the 2025-26 regular-season lines, and the honors lists are from the two Basketball-Reference player pages. ${EMBIID_URL} ${JOKIC_URL}

2026-27 season. Stats as of ${AS_OF}. Neither player has a 2026-27 regular-season game log. Both 2026-27 tables on Basketball-Reference are labeled projections, and those projections are not used.

Career. Embiid was born March 16, 1994, stands 7-0 and 280 pounds, was drafted 3rd overall by Philadelphia in 2014, and debuted October 26, 2016. He has played 10 seasons and 490 games and scored 13,544 points. Jokic was born February 19, 1995, stands 6-11 and 284 pounds, was drafted 41st overall by Denver in 2014, and debuted October 28, 2015. He has played 11 seasons and 810 games and scored 18,009 points. Embiid plays for the Philadelphia 76ers. Jokic plays for the Denver Nuggets.

2025-26 regular season. Embiid played 38 games at 31.6 minutes: 26.9 points, 7.7 rebounds, and 3.9 assists. Jokic played 65 games at 34.8 minutes: 27.7 points, 12.9 rebounds, and 10.7 assists, and was an All-Star, All-NBA, and second in MVP voting. Jokic also led the league in rebounding and assists in 2025-26.

Honors from the same player pages. Embiid: 7 All-Star selections, 2 scoring titles, 5 All-NBA selections, 3 All-Defensive selections, 2016-17 All-Rookie, and the 2022-23 MVP. Jokic: 8 All-Star selections, 8 All-NBA selections, 2015-16 All-Rookie, 3 MVPs, the 2023 championship, the 2022-23 Finals MVP, and the 2022-23 West finals MVP.`;

const BUILT = buildEditorialComparison({
  slug: "embiid-vs-jokic",
  title: "Embiid vs Jokic: Careers and 2026-27",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: EMBIID,
      slug: EMBIID,
      name: "Joel Embiid",
      shortDesc:
        "76ers center. Career line 27.6 points, 10.8 rebounds, and 3.7 assists in 490 games. 2022-23 MVP.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "Career scoring average is 27.6 points per game in 490 games",
        "2022-23 MVP",
        "2025-26 regular season: 26.9 points in 38 games",
        "13,544 career points",
      ],
      cons: [
        "490 games in 10 seasons. Jokic has 810 games in 11 seasons",
        "Career assists are 3.7 per game. Jokic's career mark is 7.5",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The career scoring average and the 2022-23 MVP",
    },
    {
      id: JOKIC,
      slug: JOKIC,
      name: "Nikola Jokic",
      shortDesc:
        "Nuggets center. Career line 22.2 points, 11.1 rebounds, and 7.5 assists in 810 games. MVP in 2020-21, 2021-22, and 2023-24.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "MVPs in 2020-21, 2021-22, and 2023-24",
        "2023 championship and 2022-23 Finals MVP",
        "Career line 11.1 rebounds and 7.5 assists per game",
        "2025-26 regular season: 27.7 points, 12.9 rebounds, and 10.7 assists in 65 games",
      ],
      cons: [
        "Career scoring average is 22.2. Embiid's is 27.6",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The assist line, the three MVP seasons, and the 2023 championship",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "27.6 in 490 games",
      entityBValue: "22.2 in 810 games",
      winner: "a",
    },
    {
      label: "Career assists per game",
      entityAValue: "3.7",
      entityBValue: "7.5",
      winner: "b",
    },
    {
      label: "MVP seasons",
      entityAValue: "2022-23",
      entityBValue: "2020-21, 2021-22, and 2023-24",
      winner: "b",
    },
    {
      label: "Championships",
      entityAValue: "None",
      entityBValue: "2023",
      winner: "b",
    },
    {
      label: "2026-27 regular season",
      entityAValue: "No game log as of October 3, 2026",
      entityBValue: "No game log as of October 3, 2026",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("career-ppg", "Points per game", CAREER, EMBIID, JOKIC, "27.6", "22.2", "a"),
    textAttr("career-rpg", "Rebounds per game", CAREER, EMBIID, JOKIC, "10.8", "11.1", "b"),
    textAttr("career-apg", "Assists per game", CAREER, EMBIID, JOKIC, "3.7", "7.5", "b"),
    textAttr("career-games", "Games", CAREER, EMBIID, JOKIC, "490", "810", "b"),
    textAttr("career-points", "Career points", CAREER, EMBIID, JOKIC, "13,544", "18,009", "b"),
    textAttr("season-2526-ppg", "2025-26 points per game", LAST, EMBIID, JOKIC, "26.9 in 38 games", "27.7 in 65 games", "b"),
    textAttr("season-2526-rpg", "2025-26 rebounds per game", LAST, EMBIID, JOKIC, "7.7", "12.9", "b"),
    textAttr("mvp", "MVP", CAREER, EMBIID, JOKIC, "2022-23", "2020-21, 2021-22, and 2023-24", "b"),
    textAttr("title", "Championships", CAREER, EMBIID, JOKIC, "None", "2023", "b"),
    textAttr(
      "season-2627-line",
      "Regular-season line",
      THIS,
      EMBIID,
      JOKIC,
      `None yet. Stats as of ${AS_OF}. Projection row not quoted.`,
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
      "No page-level winner. Career lines stay separate from the 2026-27 season, which has no game log.",
    keyFact:
      "Embiid was MVP in 2022-23. Jokic was MVP in 2020-21, 2021-22, and 2023-24, and won the 2023 championship. Stats as of October 3, 2026, there is no 2026-27 regular-season line.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 10,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Joel Embiid`, url: EMBIID_URL },
      { name: `Basketball-Reference — Nikola Jokic`, url: JOKIC_URL },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Joel Embiid",
      url: EMBIID_URL,
      description: `Career 27.6 / 10.8 / 3.7 in 490 games. 2025-26: 26.9 points in 38 games. 2022-23 MVP. 2026-27 row is a projection and is not used.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Nikola Jokic",
      url: JOKIC_URL,
      description: `Career 22.2 / 11.1 / 7.5 in 810 games. MVP-1 in 2020-21, 2021-22, and 2023-24. 2026-27 row is a projection and is not used.`,
    },
  ],
  metaTitle: "Embiid vs Jokic: Careers and 2026-27",
});

BUILT.metadata.metaDescription =
  "Embiid's career line is 27.6 points in 490 games. Jokic's is 22.2 in 810. The 2026-27 block is dated October 3, 2026, with no game log.";

export const EMBIID_VS_JOKIC: EditorialComparison = BUILT;
