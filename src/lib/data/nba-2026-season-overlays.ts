import type {
  CitationStats,
  ComparisonResource,
  QuickAnswerTLDR,
  RelatedComparison,
} from "@/types";

/**
 * Scorecard replacements for DB-backed NBA pages whose live attributes still
 * print a 2025-26 LeBron line of 28.3 points per game.
 *
 * As of 2026-10-03:
 * - https://www.basketball-reference.com/players/j/jamesle01.html
 * - https://www.basketball-reference.com/players/j/jordami01.html
 * - https://www.basketball-reference.com/players/b/bryanko01.html
 * - https://www.nba.com/news/lebron-james-free-agency-sixers-2026
 *
 * Basketball-Reference's 2026-27 rows are labeled projections. They are not
 * quoted. Contract dollars and betting odds in the NBA.com story are marked
 * "per reports" or as betting lines, so they are left out.
 */

export type NamedCell = {
  match: string;
  text: string;
  winner?: boolean;
  /** Extra entity names or slugs that should receive this cell. */
  also?: string[];
};

export type NamedFact = { label: string; cells: NamedCell[] };

export type NamedAttribute = {
  slug: string;
  name: string;
  category: string;
  cells: NamedCell[];
};

export type EntityPatch = {
  match: string;
  shortDesc: string;
  pros: string[];
  cons: string[];
  bestFor: string;
};

export interface SeasonScorecard {
  verdict: string;
  expertAnalysis: string;
  facts: NamedFact[];
  rows: NamedAttribute[];
  entityPatches: EntityPatch[];
  citationStats: CitationStats;
  resources: ComparisonResource[];
  relatedComparisons: RelatedComparison[];
  title: string;
  metaTitle: string;
  metaDescription: string;
  updatedAt: string;
  clearSchemaMarkup: true;
}

const SOURCE_DATE = "2026-10-03";
const AS_OF = "October 3, 2026";
const UPDATED_AT = "2026-10-03T00:00:00Z";

const LEBRON_BBR = "https://www.basketball-reference.com/players/j/jamesle01.html";
const JORDAN_BBR = "https://www.basketball-reference.com/players/j/jordami01.html";
const KOBE_BBR = "https://www.basketball-reference.com/players/b/bryanko01.html";
const SIGNING = "https://www.nba.com/news/lebron-james-free-agency-sixers-2026";

const CAREER = `Career · Basketball-Reference`;
const LAST_SEASON = `2025-26 regular season · Basketball-Reference`;
const THIS_SEASON = `2026-27 season · Stats as of ${AS_OF}`;

const LEBRON_2526 = "20.9 points, 6.1 rebounds, 7.2 assists in 60 games";
const LEBRON_CAREER = "26.8 points, 7.5 rebounds, 7.4 assists in 1,622 games";
const NO_LOG =
  "No 2026-27 regular-season game log. The 2026-27 table is labeled a projection and is not quoted here.";

function sources(
  entries: { name: string; url: string }[],
  dataPointCount: number
): CitationStats {
  return {
    sourceCount: entries.length,
    dataPointCount,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: entries.map((entry) => ({
      name: `${entry.name}`,
      url: entry.url,
    })),
  };
}

const LEBRON_JORDAN_SHORT =
  "LeBron James averaged 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games during the 2025-26 regular season. His career line through that season is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. Michael Jordan's career line is 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games. LeBron signed with the Philadelphia 76ers in July 2026, and 2026-27 is his 24th season. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log, so this page does not quote one. This page does not pick a winner.";

const LEBRON_JORDAN_FAQS = [
  {
    question: "What did LeBron average in 2025-26?",
    answer:
      "20.9 points, 6.1 rebounds, and 7.2 assists in 60 games for the Los Angeles Lakers. Basketball-Reference's 2025-26 per-game row and NBA.com's signing story, updated July 27, 2026, both print that line. His career average through that season is 26.8 points, 7.5 rebounds, and 7.4 assists. The 20.9 figure is the 2025-26 regular season, not the career line.",
  },
  {
    question: "Did LeBron sign with the 76ers?",
    answer:
      "Yes, in July 2026. NBA.com's story, updated July 27, 2026, says he announced the move on social media Friday and that it became official on Sunday. His posts on that story are dated July 24, 2026, and the 76ers' post is dated July 27, 2026. The same story says he told the Lakers on June 30 that he would not return. He said, \"I believe I can help make the Philadelphia 76ers a championship team and I am so excited to energize a new fan base and start this incredible journey one last time.\" That is his statement, not a prediction from this page.",
  },
  {
    question: "Is 2026-27 LeBron's 24th season?",
    answer:
      "Yes. NBA.com writes that he was the first player in league history to log 23 seasons and will add at least one more this season. Basketball-Reference's career row through 2025-26 is labeled 23 years, and that page's game logs stop at 2025-26. Stats as of October 3, 2026, there is no 2026-27 regular-season line to quote.",
  },
  {
    question: "How do LeBron's and Jordan's career lines compare?",
    answer:
      "Through 2025-26, LeBron has 43,440 points, 12,095 rebounds, and 12,016 assists in 1,622 games, at 26.8 points, 7.5 rebounds, and 7.4 assists per game. Jordan's career line is 32,292 points, 6,672 rebounds, and 5,633 assists in 1,072 games, at 30.1 points, 6.2 rebounds, and 5.3 assists per game. Jordan has 6 championships and 6 Finals MVPs. LeBron has 4 championships, 4 Finals MVPs, and 10 Finals appearances. NBA.com calls LeBron the league's all-time leading scorer.",
  },
  {
    question: "Is there a 2026-27 stat line yet?",
    answer:
      "No. Stats as of October 3, 2026. Basketball-Reference has no 2026-27 regular-season game log for LeBron, and the 2026-27 table on his page is labeled a projection. This page does not quote that projection. Jordan's career is complete, so he has no 2026-27 season.",
  },
  {
    question: "Who is better, LeBron or Jordan?",
    answer:
      "This page does not pick a winner. The career table is the stable record. The 2026-27 block is only what was known on October 3, 2026: LeBron is with the 76ers for a 24th season, and no regular-season game has been logged.",
  },
];

const LEBRON_JORDAN_ANALYSIS = `LeBron James averaged 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games in the 2025-26 regular season. His career line through that season is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games, totaling 43,440 points. Michael Jordan's career line is 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games, totaling 32,292 points, with 6 championships and 6 Finals MVPs. LeBron has 4 championships, 4 Finals MVPs, and 10 Finals appearances. He signed with the Philadelphia 76ers in July 2026, and 2026-27 is his 24th season. This page does not pick a winner.

2026-27 season. Stats as of ${AS_OF}. LeBron's team is the Philadelphia 76ers. NBA.com says he announced the move on social media Friday, that it became official on Sunday, and that he had told the Lakers on June 30 he would not return. His posts on that story are dated July 24, 2026. The 76ers post is dated July 27, 2026. He said, "I believe I can help make the Philadelphia 76ers a championship team and I am so excited to energize a new fan base and start this incredible journey one last time." NBA.com also writes that he was the first player to log 23 seasons and will add at least one more this season, and that he turns 42 on December 30. Basketball-Reference has no 2026-27 game log. Its 2026-27 table is labeled a projection, and this page does not quote it. Jordan has no 2026-27 season.

Career. Basketball-Reference lists LeBron at 23 years, 1,622 games, 43,440 points, 12,095 rebounds, and 12,016 assists. The per-game career line is 26.8 points, 7.5 rebounds, and 7.4 assists. Jordan is listed at 15 years, 1,072 games, 32,292 points, 6,672 rebounds, and 5,633 assists, at 30.1 points, 6.2 rebounds, and 5.3 assists per game. Jordan's 1986-87 regular season is listed at 37.1 points per game. LeBron's 2005-06 regular season is listed at 31.4 points per game. Those are single seasons, not career averages.

2025-26 regular season. LeBron, age 41, played 60 games for the Lakers at 33.2 minutes per game: 20.9 points, 6.1 rebounds, 7.2 assists, 51.5% from the field, 31.7% from three, and 73.7% from the line. He was an All-Star. Jordan has no 2025-26 row. His career shooting line is 49.7% from the field, 32.7% from three, and 83.5% from the line.

Accolades from the same pages. LeBron: 22 All-Star selections, 21 All-NBA selections, 4 MVPs, 4 Finals MVPs, 4 championships, 2003-04 Rookie of the Year, and the 2007-08 scoring title. Jordan: 14 All-Star selections, 10 scoring titles, 5 MVPs, 6 Finals MVPs, 6 championships, 1987-88 Defensive Player of the Year, and the 2009 Hall of Fame. NBA.com calls LeBron the league's all-time leading scorer and says he led a team to the Finals in 10 seasons.

This page does not give a contract amount. NBA.com's dollar figure is labeled "per reports," so it stays out. Betting odds stay out. The 2026-27 projection row stays out.`;

const KOBE_LEBRON_SHORT =
  "Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games over 20 seasons. LeBron James's career line through 2025-26 is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games. LeBron averaged 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games in the 2025-26 regular season. He signed with the Philadelphia 76ers in July 2026, and 2026-27 is his 24th season. Stats as of October 3, 2026, there is no 2026-27 regular-season game log. This page does not pick a winner.";

const KOBE_LEBRON_FAQS = [
  {
    question: "What did LeBron average in 2025-26?",
    answer:
      "20.9 points, 6.1 rebounds, and 7.2 assists in 60 games for the Lakers. Basketball-Reference's 2025-26 row and NBA.com's July 27, 2026 signing story both print that line. His career average through 2025-26 is 26.8 points, 7.5 rebounds, and 7.4 assists. Kobe has no 2025-26 season. His career average is 25.0 points, 5.2 rebounds, and 4.7 assists.",
  },
  {
    question: "What is Kobe's career line?",
    answer:
      "Basketball-Reference lists 20 seasons, 1,346 games, 33,643 points, 7,047 rebounds, and 6,306 assists. The per-game line is 25.0 points, 5.2 rebounds, and 4.7 assists, with shooting of 44.7% from the field, 32.9% from three, and 83.7% from the line. Accolades: 5 championships, 2 Finals MVPs, the 2007-08 MVP, 18 All-Star selections, 15 All-NBA selections, and the 2020 Hall of Fame. He died on January 26, 2020.",
  },
  {
    question: "Did LeBron sign with the 76ers?",
    answer:
      "Yes, in July 2026. NBA.com's story, updated July 27, 2026, says he announced the move on social media Friday and that it became official on Sunday. His posts on that story are dated July 24, 2026, and the 76ers' post is dated July 27, 2026. He said, \"I believe I can help make the Philadelphia 76ers a championship team and I am so excited to energize a new fan base and start this incredible journey one last time.\" That sentence is his, not a forecast.",
  },
  {
    question: "Is 2026-27 LeBron's 24th season?",
    answer:
      "Yes. NBA.com writes that he was the first player to log 23 seasons and will add at least one more this season. Basketball-Reference's career row through 2025-26 says 23 years. Kobe's career row says 20 years. Stats as of October 3, 2026, LeBron has no 2026-27 regular-season game log, and Kobe has no 2026-27 season.",
  },
  {
    question: "Is there a 2026-27 stat line yet?",
    answer:
      "No. Stats as of October 3, 2026. Basketball-Reference has no 2026-27 regular-season game log for LeBron, and the 2026-27 table on his page is labeled a projection. This page does not quote it. Kobe's career ended after 20 seasons.",
  },
  {
    question: "Who is better, Kobe or LeBron?",
    answer:
      "This page does not pick a winner. Kobe's column is a completed 20-season career. LeBron's column splits that career record from the 2025-26 line and from the 2026-27 season, which has not posted a game log.",
  },
];

const KOBE_LEBRON_ANALYSIS = `Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games and 33,643 points. LeBron James's career line through 2025-26 is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games and 43,440 points. LeBron's 2025-26 regular-season line was 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games. He signed with the Philadelphia 76ers in July 2026, and 2026-27 is his 24th season. This page does not pick a winner.

2026-27 season. Stats as of ${AS_OF}. LeBron's team is the Philadelphia 76ers. NBA.com says he announced the move on social media Friday, that it became official on Sunday, and that he told the Lakers on June 30 he would not return. His posts on that story are dated July 24, 2026. The 76ers post is dated July 27, 2026. NBA.com writes that he logged 23 seasons and will add at least one more this season. Basketball-Reference has no 2026-27 game log, and its 2026-27 table is a projection this page does not quote. Kobe has no 2026-27 season.

Career. Kobe: 20 years, 1,346 games, 33,643 points, 7,047 rebounds, 6,306 assists, 25.0 points, 5.2 rebounds, and 4.7 assists per game. LeBron through 2025-26: 23 years, 1,622 games, 43,440 points, 12,095 rebounds, 12,016 assists, 26.8 points, 7.5 rebounds, and 7.4 assists per game. Kobe shot 44.7% from the field, 32.9% from three, and 83.7% from the line for his career.

2025-26 regular season. LeBron played 60 games for the Lakers: 20.9 points, 6.1 rebounds, 7.2 assists, 51.5% from the field, 31.7% from three, and 73.7% from the line, and he was an All-Star. Kobe has no 2025-26 row.

Accolades from the same pages. Kobe: 5 championships, 2 Finals MVPs, the 2007-08 MVP, 18 All-Star selections, 15 All-NBA selections, 12 All-Defensive selections, 2 scoring titles, and the 2020 Hall of Fame. LeBron: 4 championships, 4 Finals MVPs, 4 MVPs, 22 All-Star selections, 21 All-NBA selections, and 10 Finals appearances. NBA.com calls him the league's all-time leading scorer.

This page does not give a contract amount. The dollar figure in the NBA.com story is labeled "per reports." Betting odds and the 2026-27 projection row stay out.`;

function lebronSeasonRows(otherMatch: string, otherNoSeason: string): NamedAttribute[] {
  return [
    {
      slug: "career-ppg",
      name: "Points per game",
      category: CAREER,
      cells: [
        { match: "lebron", text: "26.8", winner: otherMatch === "kobe" },
        { match: otherMatch, text: otherMatch === "jordan" ? "30.1" : "25.0", winner: otherMatch === "jordan" },
      ],
    },
    {
      slug: "career-points",
      name: "Career points",
      category: CAREER,
      cells: [
        { match: "lebron", text: "43,440", winner: true },
        { match: otherMatch, text: otherMatch === "jordan" ? "32,292" : "33,643" },
      ],
    },
    {
      slug: "career-rpg",
      name: "Rebounds per game",
      category: CAREER,
      cells: [
        { match: "lebron", text: "7.5", winner: true },
        { match: otherMatch, text: otherMatch === "jordan" ? "6.2" : "5.2" },
      ],
    },
    {
      slug: "career-apg",
      name: "Assists per game",
      category: CAREER,
      cells: [
        { match: "lebron", text: "7.4", winner: true },
        { match: otherMatch, text: otherMatch === "jordan" ? "5.3" : "4.7" },
      ],
    },
    {
      slug: "championships",
      name: "Championships",
      category: CAREER,
      cells: [
        { match: "lebron", text: "4" },
        {
          match: otherMatch,
          text: otherMatch === "jordan" ? "6" : "5",
          winner: true,
        },
      ],
    },
    {
      slug: "career-games",
      name: "Games",
      category: CAREER,
      cells: [
        { match: "lebron", text: "1,622", winner: true },
        { match: otherMatch, text: otherMatch === "jordan" ? "1,072" : "1,346" },
      ],
    },
    {
      slug: "career-seasons",
      name: "Seasons through 2025-26",
      category: CAREER,
      cells: [
        { match: "lebron", text: "23" },
        { match: otherMatch, text: otherMatch === "jordan" ? "15" : "20" },
      ],
    },
    {
      slug: "mvp-awards",
      name: "MVP awards",
      category: CAREER,
      cells: [
        { match: "lebron", text: "4", winner: otherMatch === "kobe" },
        { match: otherMatch, text: otherMatch === "jordan" ? "5" : "1", winner: otherMatch === "jordan" },
      ],
    },
    {
      slug: "finals-mvp",
      name: "Finals MVPs",
      category: CAREER,
      cells: [
        { match: "lebron", text: "4", winner: otherMatch === "kobe" },
        {
          match: otherMatch,
          text: otherMatch === "jordan" ? "6" : "2",
          winner: otherMatch === "jordan",
        },
      ],
    },
    {
      slug: "season-2526-team",
      name: "Team",
      category: LAST_SEASON,
      cells: [
        { match: "lebron", text: "Los Angeles Lakers" },
        { match: otherMatch, text: otherNoSeason },
      ],
    },
    {
      slug: "season-2526-games",
      name: "Games",
      category: LAST_SEASON,
      cells: [
        { match: "lebron", text: "60" },
        { match: otherMatch, text: otherNoSeason },
      ],
    },
    {
      slug: "season-2526-ppg",
      name: "Points per game",
      category: LAST_SEASON,
      cells: [
        { match: "lebron", text: "20.9" },
        { match: otherMatch, text: otherNoSeason },
      ],
    },
    {
      slug: "season-2526-rpg",
      name: "Rebounds per game",
      category: LAST_SEASON,
      cells: [
        { match: "lebron", text: "6.1" },
        { match: otherMatch, text: otherNoSeason },
      ],
    },
    {
      slug: "season-2526-apg",
      name: "Assists per game",
      category: LAST_SEASON,
      cells: [
        { match: "lebron", text: "7.2" },
        { match: otherMatch, text: otherNoSeason },
      ],
    },
    {
      slug: "season-2627-team",
      name: "Team",
      category: THIS_SEASON,
      cells: [
        { match: "lebron", text: "Philadelphia 76ers. Signed in July 2026." },
        { match: otherMatch, text: otherNoSeason.replace("2025-26", "2026-27") },
      ],
    },
    {
      slug: "season-2627-line",
      name: "Regular-season line",
      category: THIS_SEASON,
      cells: [
        {
          match: "lebron",
          text: `None yet. 24th season. ${NO_LOG} Stats as of ${AS_OF}.`,
        },
        {
          match: otherMatch,
          text: `No 2026-27 season. Stats as of ${AS_OF}.`,
        },
      ],
    },
  ];
}

const LEBRON_PATCH: EntityPatch = {
  match: "lebron",
  shortDesc: `76ers in 2026-27, his 24th season. 2025-26 regular season: ${LEBRON_2526}. Career through 2025-26: ${LEBRON_CAREER}.`,
  pros: [
    "43,440 career points through 2025-26 (Basketball-Reference)",
    "4 championships, 4 MVPs, and 4 Finals MVPs",
    "22 All-Star selections and 21 All-NBA selections",
    "Signed with the 76ers in July 2026",
  ],
  cons: [
    "2025-26 regular season was 20.9 points per game in 60 games, below the 26.8 career average",
    "No 2026-27 regular-season game log as of October 3, 2026",
  ],
  bestFor: "The active career and the dated 2026-27 season block",
};

const LIVE_RELATED: RelatedComparison[] = [
  {
    slug: "kobe-bryant-vs-lebron-james",
    title: "Kobe vs LeBron: Career and 2026-27",
    category: "sports",
  },
  {
    slug: "lebron-vs-jordan",
    title: "LeBron vs Jordan: Career and 2026-27",
    category: "sports",
  },
  { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo", category: "sports" },
];

export const NBA_SEASON_OVERLAYS: Record<
  string,
  {
    shortAnswer: string;
    faqs: { question: string; answer: string }[];
    quickAnswer: QuickAnswerTLDR;
  } & SeasonScorecard
> = {
  "lebron-vs-jordan": {
    shortAnswer: LEBRON_JORDAN_SHORT,
    faqs: LEBRON_JORDAN_FAQS,
    quickAnswer: {
      tldr: LEBRON_JORDAN_SHORT,
      winnerName: null,
      winnerReason:
        "No page-level winner. Career lines, the 2025-26 regular season, and the 2026-27 roster note are separate blocks.",
      keyFact:
        "LeBron's 2025-26 regular season was 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games. He signed with the 76ers in July 2026. Stats as of October 3, 2026, there is no 2026-27 game log.",
    },
    title: "LeBron vs Jordan: Career and 2026-27",
    metaTitle: "LeBron vs Jordan: Career and 2026-27",
    metaDescription:
      "LeBron averaged 20.9 points per game in 2025-26. Career totals stay separate from the 2026-27 season, which has no game log yet.",
    updatedAt: UPDATED_AT,
    clearSchemaMarkup: true,
    verdict:
      "2025-26 regular season: LeBron James, 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games. Michael Jordan has no 2025-26 season. Career scoring average: Jordan 30.1, LeBron 26.8 through 2025-26. Championships: Jordan 6, LeBron 4. Career points: LeBron 43,440, Jordan 32,292. 2026-27 season: LeBron is with the Philadelphia 76ers, in his 24th season. Stats as of October 3, 2026, there is no regular-season game log. This page does not pick a winner.",
    expertAnalysis: LEBRON_JORDAN_ANALYSIS,
    facts: [
      {
        label: "2025-26 points per game",
        cells: [
          { match: "lebron", text: "20.9 in 60 games" },
          { match: "jordan", text: "No 2025-26 season" },
        ],
      },
      {
        label: "Career points per game",
        cells: [
          { match: "lebron", text: "26.8" },
          { match: "jordan", text: "30.1", winner: true },
        ],
      },
      {
        label: "Career points",
        cells: [
          { match: "lebron", text: "43,440", winner: true },
          { match: "jordan", text: "32,292" },
        ],
      },
      {
        label: "Championships",
        cells: [
          { match: "lebron", text: "4" },
          { match: "jordan", text: "6", winner: true },
        ],
      },
      {
        label: "2026-27 team",
        cells: [
          { match: "lebron", text: "Philadelphia 76ers, 24th season" },
          { match: "jordan", text: "No 2026-27 season" },
        ],
      },
    ],
    rows: lebronSeasonRows("jordan", "No 2025-26 season. Career ended after 15 seasons."),
    entityPatches: [
      LEBRON_PATCH,
      {
        match: "jordan",
        shortDesc:
          "15-season career at 30.1 points, 6.2 rebounds, and 5.3 assists, with 6 championships and 6 Finals MVPs.",
        pros: [
          "30.1 career points per game in 1,072 games",
          "6 championships and 6 Finals MVPs",
          "5 MVPs, 10 scoring titles, and the 1987-88 Defensive Player of the Year",
          "Hall of Fame, 2009",
        ],
        cons: [
          "15 seasons and 32,292 career points. LeBron has 23 seasons and 43,440 points through 2025-26",
          "No 2025-26 season and no 2026-27 season",
        ],
        bestFor: "The completed 15-season career",
      },
    ],
    citationStats: sources(
      [
        { name: "Basketball-Reference — LeBron James", url: LEBRON_BBR },
        { name: "Basketball-Reference — Michael Jordan", url: JORDAN_BBR },
        { name: "NBA.com — LeBron signs with the 76ers", url: SIGNING },
      ],
      16
    ),
    resources: [
      {
        type: "external",
        label: "Basketball-Reference: LeBron James",
        url: LEBRON_BBR,
        description: `2025-26: 20.9 points, 6.1 rebounds, 7.2 assists in 60 games. Career: 26.8, 7.5, and 7.4 in 1,622 games, 43,440 points. 2026-27 row is a projection and is not used.`,
      },
      {
        type: "external",
        label: "Basketball-Reference: Michael Jordan",
        url: JORDAN_BBR,
        description: `15 seasons, 1,072 games, 30.1 points, 6.2 rebounds, 5.3 assists, 32,292 points, 6 championships, 6 Finals MVPs.`,
      },
      {
        type: "external",
        label: "NBA.com: LeBron signs with the 76ers",
        url: SIGNING,
        description: `Updated July 27, 2026. July 2026 signing, 23 seasons logged plus one more, 20.9 and 26.8 lines. Contract dollars are labeled per reports and are not used.`,
      },
      {
        type: "blog",
        label: "LeBron James hub",
        url: "/entity/lebron-james",
        description: "LeBron James player hub.",
      },
      {
        type: "blog",
        label: "Michael Jordan hub",
        url: "/entity/michael-jordan",
        description: "Michael Jordan player hub.",
      },
    ],
    relatedComparisons: LIVE_RELATED.filter((item) => item.slug !== "lebron-vs-jordan"),
  },
  "kobe-bryant-vs-lebron-james": {
    shortAnswer: KOBE_LEBRON_SHORT,
    faqs: KOBE_LEBRON_FAQS,
    quickAnswer: {
      tldr: KOBE_LEBRON_SHORT,
      winnerName: null,
      winnerReason:
        "No page-level winner. Kobe's career line stays separate from LeBron's 2025-26 season and the 2026-27 roster note.",
      keyFact:
        "LeBron's 2025-26 regular season was 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games. Kobe's career line is 25.0 points, 5.2 rebounds, and 4.7 assists. Stats as of October 3, 2026, there is no 2026-27 game log.",
    },
    title: "Kobe vs LeBron: Career and 2026-27",
    metaTitle: "Kobe vs LeBron: Career and 2026-27",
    metaDescription:
      "LeBron averaged 20.9 points per game in 2025-26. Kobe's career line stays separate from LeBron's 2026-27 season with the 76ers.",
    updatedAt: UPDATED_AT,
    clearSchemaMarkup: true,
    verdict:
      "Career scoring average: LeBron 26.8 through 2025-26, Kobe 25.0. Career points: LeBron 43,440, Kobe 33,643. Championships: Kobe 5, LeBron 4. 2025-26 regular season: LeBron 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games. Kobe has no 2025-26 season. 2026-27 season: LeBron is with the Philadelphia 76ers, in his 24th season. Stats as of October 3, 2026, there is no regular-season game log. This page does not pick a winner.",
    expertAnalysis: KOBE_LEBRON_ANALYSIS,
    facts: [
      {
        label: "2025-26 points per game",
        cells: [
          { match: "kobe", text: "No 2025-26 season" },
          { match: "lebron", text: "20.9 in 60 games" },
        ],
      },
      {
        label: "Career points per game",
        cells: [
          { match: "kobe", text: "25.0" },
          { match: "lebron", text: "26.8", winner: true },
        ],
      },
      {
        label: "Career points",
        cells: [
          { match: "kobe", text: "33,643" },
          { match: "lebron", text: "43,440", winner: true },
        ],
      },
      {
        label: "Championships",
        cells: [
          { match: "kobe", text: "5", winner: true },
          { match: "lebron", text: "4" },
        ],
      },
      {
        label: "2026-27 team",
        cells: [
          { match: "kobe", text: "No 2026-27 season" },
          { match: "lebron", text: "Philadelphia 76ers, 24th season" },
        ],
      },
    ],
    rows: lebronSeasonRows("kobe", "No 2025-26 season. Career ended after 20 seasons."),
    entityPatches: [
      {
        match: "kobe",
        shortDesc:
          "20-season career at 25.0 points, 5.2 rebounds, and 4.7 assists, with 5 championships and 33,643 points.",
        pros: [
          "25.0 career points per game in 1,346 games",
          "5 championships and 2 Finals MVPs",
          "2007-08 MVP, 18 All-Star selections, and the 2020 Hall of Fame",
          "33,643 career points",
        ],
        cons: [
          "Career ended after the 2015-16 season",
          "1 MVP. LeBron has 4 through 2025-26",
          "No 2026-27 season",
        ],
        bestFor: "The completed 20-season career",
      },
      {
        ...LEBRON_PATCH,
        cons: [
          "2025-26 regular season was 20.9 points per game in 60 games, below the 26.8 career average",
          "4 championships. Kobe has 5",
          "No 2026-27 regular-season game log as of October 3, 2026",
        ],
      },
    ],
    citationStats: sources(
      [
        { name: "Basketball-Reference — Kobe Bryant", url: KOBE_BBR },
        { name: "Basketball-Reference — LeBron James", url: LEBRON_BBR },
        { name: "NBA.com — LeBron signs with the 76ers", url: SIGNING },
      ],
      16
    ),
    resources: [
      {
        type: "external",
        label: "Basketball-Reference: Kobe Bryant",
        url: KOBE_BBR,
        description: `20 seasons, 1,346 games, 25.0 points, 5.2 rebounds, 4.7 assists, 33,643 points, 5 championships.`,
      },
      {
        type: "external",
        label: "Basketball-Reference: LeBron James",
        url: LEBRON_BBR,
        description: `2025-26: 20.9 points, 6.1 rebounds, 7.2 assists in 60 games. Career: 26.8, 7.5, and 7.4. 2026-27 row is a projection and is not used.`,
      },
      {
        type: "external",
        label: "NBA.com: LeBron signs with the 76ers",
        url: SIGNING,
        description: `Updated July 27, 2026. July 2026 signing and the 24th season. Contract dollars are labeled per reports and are not used.`,
      },
      {
        type: "blog",
        label: "Kobe Bryant hub",
        url: "/entity/kobe-bryant",
        description: "Kobe Bryant player hub.",
      },
      {
        type: "blog",
        label: "LeBron James hub",
        url: "/entity/lebron-james",
        description: "LeBron James player hub.",
      },
    ],
    relatedComparisons: LIVE_RELATED.filter((item) => item.slug !== "kobe-bryant-vs-lebron-james"),
  },
};
