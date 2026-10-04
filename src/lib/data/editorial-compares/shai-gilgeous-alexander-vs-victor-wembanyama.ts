import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Shai Gilgeous-Alexander vs Victor Wembanyama. Career lines, 2025-26
 * regular-season lines, and accolades are from Basketball-Reference player
 * pages. The 2026 West finals are from the 2026 playoff index. The October 20
 * game is a schedule fact from NBA.com. Projection rows
 * are not quoted. No winner and no prediction.
 */

const SGA = "shai-gilgeous-alexander";
const WEMBY = "victor-wembanyama";

const SGA_URL = "https://www.basketball-reference.com/players/g/gilgesh01.html";
const WEMBY_URL = "https://www.basketball-reference.com/players/w/wembavi01.html";
const PLAYOFFS = "https://www.basketball-reference.com/playoffs/NBA_2026.html";
const SCHEDULE = "https://www.nba.com/games?date=2026-10-20";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const CAREER = `Career · Basketball-Reference`;
const LAST = `2025-26 regular season · Basketball-Reference`;
const THIS = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "Shai Gilgeous-Alexander's career line is 25.3 points, 4.7 rebounds, and 5.3 assists in 530 games. Victor Wembanyama's career line is 23.4 points, 11.0 rebounds, and 3.5 assists in 181 games. SGA was MVP in 2024-25 and again in 2025-26. In the 2026 Western Conference finals, the Spurs beat the Thunder 4-3. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log, and the projection rows are not used. Neither is named the better player.";

const FAQS = [
  {
    question: "Is Shai Gilgeous-Alexander a back-to-back MVP?",
    answer:
      "Yes, for 2024-25 and 2025-26. Basketball-Reference marks MVP-1 on both of those regular-season rows, and Basketball-Reference's header says 2x MVP. The 2024-25 row is 32.7 points per game in 76 games. The 2025-26 row is 31.1 points, 4.3 rebounds, and 6.6 assists in 68 games. Nothing is stated about the 2026-27 MVP award.",
  },
  {
    question: "What are their career lines?",
    answer:
      "SGA, in 8 seasons and 530 games: 13,411 points, 2,503 rebounds, and 2,810 assists, at 25.3 points, 4.7 rebounds, and 5.3 assists per game. Wembanyama, in 3 seasons and 181 games: 4,238 points, 1,997 rebounds, 641 assists, and 627 blocks, at 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks per game. Basketball-Reference lists him at 7-4 and 235 pounds, drafted first overall in 2023.",
  },
  {
    question: "What happened in the 2026 Western Conference finals?",
    answer:
      "The Spurs beat the Thunder 4-3. Basketball-Reference's 2026 playoff index includes that series, including Game 7 on May 30, 2026: San Antonio 111 at Oklahoma City 103. Wembanyama's accolades include 2025-26 West finals MVP. SGA's accolades include 2024-25 West finals MVP, 2024-25 Finals MVP, and the 2025 championship. The 2026 league champion on that index is the Knicks, not the Thunder.",
  },
  {
    question: "What did each player average in the 2025-26 playoffs?",
    answer:
      "These are playoff lines, not the regular season. SGA played 15 games at 27.6 points per game. Wembanyama played 22 games at 23.8 points, 10.9 rebounds, 2.7 assists, and 3.5 blocks per game. Their regular-season lines were separate: SGA 31.1 points in 68 games, Wembanyama 25.0 points and 11.5 rebounds in 64 games.",
  },
  {
    question: "Is there a 2026-27 stat line yet?",
    answer:
      "No. Stats as of October 3, 2026. Basketball-Reference has no 2026-27 regular-season game log for either player, and each 2026-27 table is labeled a projection. Those rows are not used. NBA.com lists Oklahoma City at San Antonio on October 20, 2026, at 9:30 pm ET. That is a schedule fact, not a pick.",
  },
  {
    question: "Who is the better player, SGA or Wembanyama?",
    answer:
      "Neither is named the better player. SGA's column is the longer career, two MVPs, and the 2025 championship. Wembanyama's column is the rebounding and block lines, the 2025-26 Defensive Player of the Year award, and the 2026 West finals. The 2026-27 season has no game log yet.",
  },
];

const VERDICT = `Career points per game: SGA 25.3, Wembanyama 23.4. Career rebounds per game: Wembanyama 11.0, SGA 4.7.

2025-26 regular season: SGA 31.1 points, 4.3 rebounds, and 6.6 assists in 68 games. Wembanyama 25.0 points, 11.5 rebounds, and 3.1 assists in 64 games.

MVPs: SGA in 2024-25 and 2025-26. 2026 West finals: Spurs beat the Thunder 4-3.

2026-27 season: Stats as of October 3, 2026, there is no regular-season game log. Oklahoma City is at San Antonio on October 20, 2026, at 9:30 pm ET. Neither is named the winner of that game, and there is no forecast for it.`;

const EXPERT_ANALYSIS = `Shai Gilgeous-Alexander's career line is 25.3 points, 4.7 rebounds, and 5.3 assists in 530 games. Victor Wembanyama's career line is 23.4 points, 11.0 rebounds, and 3.5 assists in 181 games. SGA was MVP in 2024-25 and 2025-26. In the 2026 West finals, the Spurs beat the Thunder 4-3. Neither is named the better player.

Source note: career totals, the 2025-26 regular-season lines, and the accolades are from the two Basketball-Reference player pages. The West finals are from Basketball-Reference's 2026 playoff index. The October 20 game is from NBA.com's games page. ${SGA_URL} ${WEMBY_URL} ${PLAYOFFS} ${SCHEDULE}

2026-27 season. Stats as of ${AS_OF}. Neither player has a 2026-27 regular-season game log. Both 2026-27 tables on Basketball-Reference are labeled projections, and those projections are not used. NBA.com lists Oklahoma City at San Antonio on October 20, 2026, at 9:30 pm ET. That is the schedule. It is not a prediction.

Career. SGA was born July 12, 1998, debuted October 17, 2018, and Basketball-Reference lists 8 years: 530 games, 13,411 points, 2,503 rebounds, 2,810 assists. Wembanyama was born January 4, 2004, Basketball-Reference lists him at 7-4 and 235 pounds, was drafted first overall in 2023, debuted October 25, 2023, and Basketball-Reference lists 3 years: 181 games, 4,238 points, 1,997 rebounds, 641 assists, 627 blocks.

2025-26 regular season. SGA played 68 games at 33.2 minutes: 31.1 points, 4.3 rebounds, 6.6 assists, 55.3% from the field, 38.6% from three, and 87.9% from the line, with MVP, All-Star, and All-NBA. Wembanyama played 64 games, 55 starts, at 29.2 minutes: 25.0 points, 11.5 rebounds, 3.1 assists, 1.0 steal, and 3.1 blocks, with All-Star, All-NBA, and Defensive Player of the Year. In 2024-25, SGA averaged 32.7 points in 76 games and was also MVP.

Playoffs, labeled separately from the regular season. SGA's 2025-26 playoff line is 15 games at 27.6 points per game. Wembanyama's is 22 games at 23.8 points, 10.9 rebounds, 2.7 assists, and 3.5 blocks. The 2026 West finals were Spurs over Thunder, 4-3. Game 7 was May 30, 2026: San Antonio 111 at Oklahoma City 103. Wembanyama is the 2025-26 West finals MVP. SGA is the 2024-25 West finals MVP, the 2024-25 Finals MVP, and a 2025 NBA champion. The 2026 champion on the playoff index is the Knicks.

Accolades from the same player pages. SGA: 4 All-Star selections, 4 All-NBA selections, 2024-25 scoring champion, 2018-19 All-Rookie. Wembanyama: 2 All-Star selections, 3 block titles, 2023-24 Rookie of the Year, 2 All-Defensive selections, 2025-26 Defensive Player of the Year.`;

const BUILT = buildEditorialComparison({
  slug: "shai-gilgeous-alexander-vs-victor-wembanyama",
  title: "Shai Gilgeous-Alexander vs Wembanyama",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: SGA,
      slug: SGA,
      name: "Shai Gilgeous-Alexander",
      shortDesc:
        "Thunder guard. Career line 25.3 points, 4.7 rebounds, and 5.3 assists in 530 games. MVP in 2024-25 and 2025-26.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "MVP in 2024-25 and 2025-26 (Basketball-Reference)",
        "2025 NBA champion, 2024-25 Finals MVP, and 2024-25 scoring champion",
        "2025-26 regular season: 31.1 points, 4.3 rebounds, and 6.6 assists in 68 games",
        "13,411 career points in 530 games",
      ],
      cons: [
        "Career rebounds are 4.7 per game. Wembanyama's career mark is 11.0",
        "The Thunder lost the 2026 West finals to the Spurs, 4-3",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The two MVP seasons and the 2025 championship",
    },
    {
      id: WEMBY,
      slug: WEMBY,
      name: "Victor Wembanyama",
      shortDesc:
        "Spurs big man. Career line 23.4 points, 11.0 rebounds, and 3.5 blocks in 181 games. 2025-26 Defensive Player of the Year and West finals MVP.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "2025-26 Defensive Player of the Year and West finals MVP",
        "Career line 11.0 rebounds and 3.5 blocks per game",
        "2025-26 regular season: 25.0 points, 11.5 rebounds, and 3.1 blocks in 64 games",
        "Spurs beat the Thunder 4-3 in the 2026 West finals",
      ],
      cons: [
        "3 seasons and 181 games. SGA has 8 seasons and 530 games",
        "Career scoring average is 23.4. SGA's is 25.3",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The rebounding, block, and 2026 West finals record",
    },
  ],
  keyDifferences: [
    {
      label: "Career points per game",
      entityAValue: "25.3 in 530 games",
      entityBValue: "23.4 in 181 games",
      winner: "a",
    },
    {
      label: "Career rebounds per game",
      entityAValue: "4.7",
      entityBValue: "11.0",
      winner: "b",
    },
    {
      label: "MVP seasons",
      entityAValue: "2024-25 and 2025-26",
      entityBValue: "None listed",
      winner: "a",
    },
    {
      label: "2026 West finals",
      entityAValue: "Thunder lost 3-4",
      entityBValue: "Spurs won 4-3",
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
    textAttr("career-ppg", "Points per game", CAREER, SGA, WEMBY, "25.3", "23.4", "a"),
    textAttr("career-rpg", "Rebounds per game", CAREER, SGA, WEMBY, "4.7", "11.0", "b"),
    textAttr("career-apg", "Assists per game", CAREER, SGA, WEMBY, "5.3", "3.5", "a"),
    textAttr("career-games", "Games", CAREER, SGA, WEMBY, "530", "181", "a"),
    textAttr("career-points", "Career points", CAREER, SGA, WEMBY, "13,411", "4,238", "a"),
    textAttr("blocks", "Blocks per game", CAREER, SGA, WEMBY, "—", "3.5"),
    textAttr("season-2526-ppg", "2025-26 points per game", LAST, SGA, WEMBY, "31.1 in 68 games", "25.0 in 64 games", "a"),
    textAttr("season-2526-rpg", "2025-26 rebounds per game", LAST, SGA, WEMBY, "4.3", "11.5", "b"),
    textAttr("mvp", "MVP", CAREER, SGA, WEMBY, "2024-25 and 2025-26", "Not listed", "a"),
    textAttr(
      "wcf",
      "2026 West finals",
      `2026 playoffs · Basketball-Reference`,
      SGA,
      WEMBY,
      "Thunder lost to the Spurs 4-3",
      "Spurs beat the Thunder 4-3. Wembanyama was West finals MVP",
      "b"
    ),
    textAttr(
      "season-2627-line",
      "Regular-season line",
      THIS,
      SGA,
      WEMBY,
      `None yet. Stats as of ${AS_OF}. Projection row not quoted.`,
      `None yet. Stats as of ${AS_OF}. Projection row not quoted.`
    ),
    textAttr(
      "opener",
      "October 20, 2026",
      THIS,
      SGA,
      WEMBY,
      "Thunder at Spurs, 9:30 pm ET. Schedule only.",
      "Thunder at Spurs, 9:30 pm ET. Schedule only."
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
      "No page-level winner. Career lines stay separate from the 2026 West finals result and from the 2026-27 season, which has no game log.",
    keyFact:
      "SGA was MVP in 2024-25 and 2025-26. In the 2026 West finals the Spurs beat the Thunder 4-3. Stats as of October 3, 2026, there is no 2026-27 regular-season line.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 12,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Shai Gilgeous-Alexander`, url: SGA_URL },
      { name: `Basketball-Reference — Victor Wembanyama`, url: WEMBY_URL },
      { name: `Basketball-Reference — 2026 NBA playoffs`, url: PLAYOFFS },
      { name: `NBA.com — games on October 20, 2026`, url: SCHEDULE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Shai Gilgeous-Alexander",
      url: SGA_URL,
      description: `Career 25.3 / 4.7 / 5.3 in 530 games. 2025-26: 31.1 points in 68 games. MVP-1 in 2024-25 and 2025-26. 2026-27 row is a projection and is not used.`,
    },
    {
      type: "external",
      label: "Basketball-Reference: Victor Wembanyama",
      url: WEMBY_URL,
      description: `Career 23.4 points, 11.0 rebounds, 3.5 blocks in 181 games. 2025-26: 25.0 points, 11.5 rebounds, 3.1 blocks. 2026-27 row is a projection and is not used.`,
    },
    {
      type: "external",
      label: "Basketball-Reference 2026 playoffs",
      url: PLAYOFFS,
      description: `West finals: Spurs over Thunder 4-3. Game 7 on May 30, San Antonio 111 at Oklahoma City 103.`,
    },
    {
      type: "external",
      label: "NBA.com games for October 20, 2026",
      url: SCHEDULE,
      description: `Oklahoma City at San Antonio, 9:30 pm ET. Schedule fact only.`,
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
  metaTitle: "Shai Gilgeous-Alexander vs Wembanyama",
});

BUILT.metadata.metaDescription =
  "SGA was MVP in 2024-25 and 2025-26. Career lines stay separate from the 2026-27 season, which has no game log yet.";

export const SGA_VS_WEMBANYAMA: EditorialComparison = BUILT;
