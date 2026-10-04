import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * NBA batch 2 — Cooper Flagg vs Victor Wembanyama.
 *
 * /compare/flagg-vs-wembanyama 404d on 3 October 2026.
 * /compare/wembanyama-vs-flagg 301d to /compare/flagg-vs-wembanyama.
 * That 301 is the runtime alphabetical shell, not a static redirect.
 * The page is built at flagg-vs-wembanyama so the 301 lands on it.
 *
 * as of 3 October 2026:
 * - https://www.basketball-reference.com/players/f/flaggco01.html
 * - https://www.basketball-reference.com/players/w/wembavi01.html
 * /entity/cooper-flagg and /entity/victor-wembanyama were noindex, nofollow,
 * so those hubs are not linked. /entity/san-antonio-spurs was
 * index, follow. 2026-27 projection rows are not quoted.
 */

const FLAGG = "cooper-flagg";
const WEMBY = "victor-wembanyama";

const FLAGG_URL = "https://www.basketball-reference.com/players/f/flaggco01.html";
const WEMBY_URL = "https://www.basketball-reference.com/players/w/wembavi01.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";

const CAREER_CAT = "Career · Basketball-Reference per-game tables";
const HONOR_CAT = "Accolades · Basketball-Reference";
const SEASON_CAT = "2026-27 season · Stats as of October 3, 2026";

const SHORT_ANSWER =
  "Cooper Flagg plays for the Dallas Mavericks. Basketball-Reference lists him as the 2025-26 Rookie of the Year, with a rookie per-game line of 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games. Victor Wembanyama plays for the San Antonio Spurs. His career line through three seasons is 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks in 181 games, and he won the 2025-26 Defensive Player of the Year and Western Conference Finals MVP. Stats as of October 3, 2026: neither player had a 2026-27 game log. Neither is named the better player.";

const META_DESCRIPTION =
  "Cooper Flagg of Dallas is the 2025-26 Rookie of the Year. Wembanyama's career line is 23.4 points, 11.0 rebounds, and 3.5 blocks. Stats as of October 3, 2026.";

const FAQS = [
  {
    question: "Is Cooper Flagg the reigning Rookie of the Year?",
    answer:
      "Basketball-Reference lists a 2025-26 Rookie of the Year honor for Cooper Flagg, and the per-game row is marked ROY-1. He plays for the Dallas Mavericks. The 2026-27 season had not started on October 3, 2026, so that 2025-26 award is the latest Rookie of the Year Basketball-Reference lists for him. Stats as of October 3, 2026.",
  },
  {
    question: "What are Victor Wembanyama's career averages?",
    answer:
      "Through three seasons, Basketball-Reference lists 181 games, 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks. Field goal percentage .484, three-point percentage .342, free throw percentage .817. Career totals there: 4,238 points, 1,997 rebounds, 641 assists, and 627 blocks.",
  },
  {
    question: "Which honors does Basketball-Reference list for Wembanyama?",
    answer:
      "Basketball-Reference lists these honors for Wembanyama: 2x All-Star, 3x blocks champ, 2025-26 All-NBA, 2023-24 Rookie of the Year, 2023-24 All-Rookie, 2x All-Defensive, 2025-26 Defensive Player of the Year, and 2025-26 Western Conference Finals MVP. His 2025-26 regular-season row also lists MVP-3.",
  },
  {
    question: "What did Cooper Flagg average as a rookie?",
    answer:
      "The 2025-26 per-game row, which is also his one-year career line: 70 games, all starts, 33.5 minutes, 21.0 points, 6.7 rebounds, 4.5 assists, 1.2 steals, and 0.9 blocks. Field goal percentage .468, three-point percentage .295, free throw percentage .827. Totals: 1,473 points, 466 rebounds, and 316 assists. He was drafted first overall by Dallas in 2025 and debuted October 22, 2025.",
  },
  {
    question: "Have Flagg and Wembanyama played in 2026-27?",
    answer:
      "Basketball-Reference has no 2026-27 game log for Cooper Flagg or Victor Wembanyama. Basketball-Reference also has a 2026-27 projection table for each player. Those rows are not quoted here. Stats as of October 3, 2026.",
  },
  {
    question: "Is one the better player?",
    answer:
      "No. It lists the honors and the career lines from Basketball-Reference. Stats as of October 3, 2026. Flagg's latest listed Rookie of the Year is 2025-26. Wembanyama's listed Rookie of the Year is 2023-24, and Basketball-Reference also lists the 2025-26 Defensive Player of the Year and Western Conference Finals MVP. Those are different awards in different seasons. Those awards are not a prediction.",
  },
];

const VERDICT = `Cooper Flagg: Dallas Mavericks, 2025-26 Rookie of the Year. Rookie line: 21.0 points, 6.7 rebounds, 4.5 assists in 70 games.

Victor Wembanyama: San Antonio Spurs. Career line: 23.4 points, 11.0 rebounds, 3.5 assists, 3.5 blocks in 181 games. Listed honors include 2025-26 Defensive Player of the Year and 2025-26 Western Conference Finals MVP.

2026-27, stats as of October 3, 2026: Basketball-Reference has no game log for either player. There is no winner.`;

const EXPERT_ANALYSIS = `Cooper Flagg is the Dallas Mavericks forward Basketball-Reference lists as the 2025-26 Rookie of the Year. Victor Wembanyama is the San Antonio Spurs big man with three seasons, a career line of 23.4 points, 11.0 rebounds, and 3.5 blocks, and the 2025-26 Defensive Player of the Year and Western Conference Finals MVP. Stats as of October 3, 2026, neither player had a 2026-27 game log. Neither is named the better player.

Source note: Flagg's team, draft, rookie line, and 2025-26 Rookie of the Year are from Basketball-Reference. Wembanyama's team, career line, playoff line, and honors are from Basketball-Reference. Projection tables are not used.

Cooper Flagg

He is 6-9 and 205 pounds, born December 21, 2006, in Newport, Maine. Team: Dallas Mavericks. Draft: Dallas, first overall, 2025. NBA debut: October 22, 2025. Experience: 1 year. Honors: 2025-26 Rookie of the Year and 2025-26 All-Rookie. The 2025-26 per-game line is 70 games, 70 starts, 33.5 minutes, 21.0 points, 6.7 rebounds, 4.5 assists, 1.2 steals, and 0.9 blocks, on .468 from the field, .295 from three, and .827 from the line. The one-year totals are 1,473 points, 466 rebounds, and 316 assists. That line is also the career line, because he has played one season.

Victor Wembanyama

He is 7-4 and 235 pounds, born January 4, 2004, in Le Chesnay, France. Team: San Antonio Spurs. Draft: San Antonio, first overall, 2023. NBA debut: October 25, 2023. Experience: 3 years. The honors line is 2x All-Star, 3x blocks champ, 2025-26 All-NBA, 2023-24 Rookie of the Year, 2023-24 All-Rookie, 2x All-Defensive, 2025-26 Defensive Player of the Year, and 2025-26 Western Conference Finals MVP. The three-year per-game line is 181 games, 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks, on .484 from the field, .342 from three, and .817 from the line. Career totals: 4,238 points, 1,997 rebounds, 641 assists, and 627 blocks. The 2025-26 regular-season row is 64 games, 25.0 points, 11.5 rebounds, 3.1 assists, 1.0 steal, and 3.1 blocks. The playoff per-game table there is 22 games, 23.8 points, 10.9 rebounds, 2.7 assists, and 3.5 blocks.

2026-27 season

Stats as of October 3, 2026. The regular season had not started. Basketball-Reference has no 2026-27 game log for either player. Basketball-Reference also has a 2026-27 projection table for each player. Those rows are not quoted here. The career lines above are the completed seasons on the per-game tables.`;

const built = buildEditorialComparison({
  slug: "flagg-vs-wembanyama",
  title: "Flagg vs Wembanyama: Careers",
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
        "Dallas Mavericks forward. 2025-26 Rookie of the Year. Rookie line: 21.0 points, 6.7 rebounds, 4.5 assists in 70 games.",
      imageUrl: null,
      entityType: "person",
      position: 0,
      pros: [
        "2025-26 Rookie of the Year and 2025-26 All-Rookie (Basketball-Reference)",
        "70 games, 21.0 points, 6.7 rebounds, 4.5 assists",
        "Drafted first overall by Dallas in 2025. Debut October 22, 2025",
      ],
      cons: [
        "One NBA season (2025-26)",
        "Three-point percentage .295 on that rookie row",
        "No 2026-27 game log as of October 3, 2026",
      ],
      bestFor: "The 2025-26 Rookie of the Year, with Dallas",
    },
    {
      id: WEMBY,
      slug: WEMBY,
      name: "Victor Wembanyama",
      shortDesc:
        "San Antonio Spurs. Career: 23.4 points, 11.0 rebounds, 3.5 blocks in 181 games. 2025-26 Defensive Player of the Year.",
      imageUrl: null,
      entityType: "person",
      position: 1,
      pros: [
        "Career line: 23.4 points, 11.0 rebounds, 3.5 assists, 3.5 blocks in 181 games",
        "2025-26 Defensive Player of the Year, All-NBA, and Western Conference Finals MVP",
        "2x All-Star, 3x blocks champ, 2023-24 Rookie of the Year, 2x All-Defensive",
      ],
      cons: [
        "2025-26 regular season was 64 games, not a full 82",
        "No 2026-27 game log as of October 3, 2026",
        "His Rookie of the Year is 2023-24, not 2025-26",
      ],
      bestFor: "The Spurs career line and the 2025-26 award list",
    },
  ],
  keyDifferences: [
    {
      label: "Team",
      entityAValue: "Dallas Mavericks",
      entityBValue: "San Antonio Spurs",
      winner: "tie",
    },
    {
      label: "Rookie of the Year season",
      entityAValue: "2025-26",
      entityBValue: "2023-24",
      winner: "tie",
    },
    {
      label: "Career points per game",
      entityAValue: "21.0 in 70 games",
      entityBValue: "23.4 in 181 games",
      winner: "b",
    },
    {
      label: "2026-27 game log",
      entityAValue: "None as of October 3, 2026",
      entityBValue: "None as of October 3, 2026",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("team", "Team", CAREER_CAT, FLAGG, WEMBY, "Dallas Mavericks", "San Antonio Spurs"),
    textAttr(
      "roy",
      "Rookie of the Year",
      HONOR_CAT,
      FLAGG,
      WEMBY,
      "2025-26",
      "2023-24"
    ),
    textAttr(
      "other-honors",
      "Other honors",
      HONOR_CAT,
      FLAGG,
      WEMBY,
      "2025-26 All-Rookie",
      "2x All-Star, 3x blocks champ, 2025-26 All-NBA, 2x All-Defensive, 2025-26 Defensive Player of the Year, 2025-26 Western Conference Finals MVP"
    ),
    textAttr(
      "ppg",
      "Career points per game",
      CAREER_CAT,
      FLAGG,
      WEMBY,
      "21.0 in 70 games",
      "23.4 in 181 games",
      "b"
    ),
    textAttr(
      "rpg",
      "Career rebounds per game",
      CAREER_CAT,
      FLAGG,
      WEMBY,
      "6.7",
      "11.0",
      "b"
    ),
    textAttr(
      "bpg",
      "Career blocks per game",
      CAREER_CAT,
      FLAGG,
      WEMBY,
      "0.9",
      "3.5",
      "b"
    ),
    textAttr(
      "season-games",
      "2026-27 games logged",
      SEASON_CAT,
      FLAGG,
      WEMBY,
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
      "Flagg won the 2025-26 Rookie of the Year. Wembanyama has a three-year career line and won the 2025-26 Defensive Player of the Year. Those are different facts, not a pick.",
    keyFact:
      "Flagg, Dallas: 2025-26 Rookie of the Year, 21.0 points in 70 games. Wembanyama, Spurs: 23.4 points, 11.0 rebounds, 3.5 blocks in 181 games. Stats as of October 3, 2026: no 2026-27 game log.",
  },
  citationStats: {
    sourceCount: 2,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      {
        name: "Basketball-Reference — Cooper Flagg",
        url: FLAGG_URL,
      },
      {
        name: "Basketball-Reference — Victor Wembanyama",
        url: WEMBY_URL,
      },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference: Cooper Flagg",
      url: FLAGG_URL,
      description:
        "Dallas. 2025-26 Rookie of the Year. 70 games, 21.0 points, 6.7 rebounds, 4.5 assists. No 2026-27 game log quoted.",
    },
    {
      type: "external",
      label: "Basketball-Reference: Victor Wembanyama",
      url: WEMBY_URL,
      description:
        "Spurs. Career 181 games, 23.4 points, 11.0 rebounds, 3.5 blocks. 2025-26 Defensive Player of the Year and Western Conference Finals MVP.",
    },
    {
      type: "blog",
      label: "San Antonio Spurs hub",
      url: "/entity/san-antonio-spurs",
      description:
        "San Antonio Spurs team hub.",
    },
  ],
  metaTitle: "Flagg vs Wembanyama: Careers | A Versus B",
});

built.metadata.metaDescription = META_DESCRIPTION;

export const FLAGG_VS_WEMBANYAMA: EditorialComparison = built;
