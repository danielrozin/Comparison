import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Knicks vs 76ers. Head-to-head and the 2026 playoff series are from
 * Basketball-Reference. The July 2026 LeBron signing and the Sixers' 45-37
 * season are from NBA.com. The October 20 opener is from the NBA.com games
 * page. Fetched 2026-10-03. No prediction. Older playoff series that were
 * not on those pages are not listed.
 */

const NYK = "new-york-knicks";
const PHI = "philadelphia-76ers";

const H2H = "https://www.basketball-reference.com/teams/NYK/head2head.html";
const PLAYOFFS = "https://www.basketball-reference.com/playoffs/NBA_2026.html";
const SERIES =
  "https://www.basketball-reference.com/playoffs/2026-nba-eastern-conference-semifinals-76ers-vs-knicks.html";
const SIGNING = "https://www.nba.com/news/lebron-james-free-agency-sixers-2026";
const SCHEDULE = "https://www.nba.com/games?date=2026-10-20";

const FETCHED = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const H2H_CAT = `Head-to-head · Basketball-Reference Knicks table, fetched ${FETCHED}`;
const PLAYOFF_CAT = `2026 playoffs · Basketball-Reference, fetched ${FETCHED}`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "On the Knicks head-to-head table, the Knicks are 214-267 against the 76ers in 481 games. In the 2026 playoffs the Knicks swept the 76ers 4-0 in the Eastern Conference semifinals, then won the championship by beating the Spurs 4-1. LeBron James signed with the 76ers in July 2026. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log. NBA.com lists the 76ers at the Knicks on October 20, 2026, at 7:00 pm ET. This page does not predict that game.";

const FAQS = [
  {
    question: "What is the Knicks' record against the 76ers?",
    answer:
      "On the Knicks head-to-head table at Basketball-Reference, fetched October 3, 2026, the Knicks are 214-267 in 481 games. The same row lists 103.6 points scored per game and 104.4 points allowed per game. The page does not label that row as regular season only, so this page does not add that label. The 76ers' side of the same row is 267 wins and 214 losses.",
  },
  {
    question: "Who won the 2026 playoff series between the Knicks and the 76ers?",
    answer:
      "The Knicks swept the 76ers 4-0 in the 2026 Eastern Conference semifinals. Basketball-Reference lists the games as May 4, Philadelphia 98 at New York 137; May 6, Philadelphia 102 at New York 108; May 8, New York 108 at Philadelphia 94; and May 10, New York 144 at Philadelphia 114. Jalen Brunson's series line on the series page is 29.0 points, 2.8 rebounds, and 6.0 assists in 4 games. The same playoff index says the 76ers had beaten the Celtics 4-3 in the first round.",
  },
  {
    question: "Did the Knicks win the 2026 championship?",
    answer:
      "Yes. Basketball-Reference's 2026 playoff page names the New York Knicks the league champion. The Finals were Knicks over Spurs, 4-1. The games were June 3, New York 105 at San Antonio 95; June 5, New York 105 at San Antonio 104; June 8, San Antonio 115 at New York 111; June 10, San Antonio 106 at New York 107; and June 13, New York 94 at San Antonio 90. Jalen Brunson was Finals MVP at 32.6 points, 4.2 rebounds, and 4.6 assists.",
  },
  {
    question: "Did LeBron sign with the 76ers?",
    answer:
      "Yes, in July 2026. NBA.com's story, updated July 27, 2026, says he announced the move on social media Friday and that it became official on Sunday. His posts on that story are dated July 24, 2026, and the 76ers' post is dated July 27, 2026. The same story says the 76ers went 45-37 last season and were swept in the second round by the champion Knicks. He said he believes he can help make the 76ers a championship team. That is his statement, not a prediction.",
  },
  {
    question: "When do the 76ers play the Knicks to open 2026-27?",
    answer:
      "NBA.com's games page for October 20, 2026 lists Philadelphia at New York at 7:00 pm ET. That is a schedule fact. Stats as of October 3, 2026, Basketball-Reference has no 2026-27 regular-season game log for either team. This page does not predict the opener or the season series.",
  },
  {
    question: "Which older Knicks-76ers playoff series does this page include?",
    answer:
      "Only the 2026 Eastern Conference semifinals, because that series is on the Basketball-Reference pages fetched October 3, 2026. This page does not list earlier series from other sites. The Knicks franchise header on the head-to-head page lists 3 championships, 81 seasons, a 3,078-3,191 record, and 47 playoff appearances. It does not break those championships into a series list.",
  },
];

const VERDICT = `Head-to-head table: Knicks 214 wins, 267 losses in 481 games.

2026 Eastern Conference semifinals: Knicks swept the 76ers 4-0.

2026 NBA Finals: Knicks beat the Spurs 4-1 and are the league champion on Basketball-Reference's 2026 playoff page.

2026-27 season: LeBron James signed with the 76ers in July 2026. Stats as of October 3, 2026, there is no regular-season game log. The 76ers are at the Knicks on October 20, 2026, at 7:00 pm ET. This page does not pick a winner and does not predict that game.`;

const EXPERT_ANALYSIS = `The Knicks are 214-267 against the 76ers in 481 games on the Knicks head-to-head table. In the 2026 playoffs they swept the 76ers 4-0, then beat the Spurs 4-1 for the championship. LeBron James signed with the 76ers in July 2026. This page does not predict the 2026-27 season.

Source note: the 481-game row is from the Knicks head-to-head page on Basketball-Reference, fetched ${AS_OF}. The sweep, the Finals, and the championship are from Basketball-Reference's 2026 playoff index and the Eastern Conference semifinals series page, fetched the same day. The signing and the 76ers' 45-37 record are from NBA.com's story updated July 27, 2026. The October 20 opener is from NBA.com's games page. ${H2H} ${PLAYOFFS} ${SERIES} ${SIGNING} ${SCHEDULE}

2026-27 season. Stats as of ${AS_OF}. No regular-season game log is on Basketball-Reference for this matchup, so this page does not quote a 2026-27 scoring line or a projection. NBA.com lists Philadelphia at New York on October 20, 2026, at 7:00 pm ET. That is the schedule. It is not a pick. LeBron's move is a roster fact: NBA.com says he announced it Friday, that it became official on Sunday, that his posts are dated July 24, 2026, and that the 76ers' post is dated July 27, 2026. The story says the 76ers went 45-37 and were swept by the Knicks in the second round.

Head-to-head. The Knicks row against the 76ers is 481 games, 214 wins, 267 losses, a .445 win percentage, 103.6 points scored per game, and 104.4 points allowed per game. The Knicks franchise header on that page lists 81 seasons from 1946-47 through 2026-27, a 3,078-3,191 record, 47 playoff appearances, and 3 championships. This page does not turn the 3 into a claim about how many of those titles came in 2026. The 2026 title is stated from the playoff index, which names the Knicks the league champion.

2026 playoffs. The East semifinals were a sweep. May 4, Philadelphia 98 at New York 137. May 6, Philadelphia 102 at New York 108. May 8, New York 108 at Philadelphia 94. May 10, New York 144 at Philadelphia 114. Brunson's series line is 29.0 points, 2.8 rebounds, and 6.0 assists in 4 games. The 76ers' first-round series on the same index was a 4-3 win over the Celtics. The Finals were Knicks over Spurs, 4-1, and Brunson was Finals MVP at 32.6 points, 4.2 rebounds, and 4.6 assists. Earlier Knicks-76ers playoff series are not on the pages fetched for this article, so they are not listed.

This page does not print the signing story's betting prices, and it does not print a contract figure for LeBron. Those lines are labeled as reports or as prices.`;

const BUILT = buildEditorialComparison({
  slug: "knicks-vs-76ers",
  title: "Knicks vs 76ers: Rivalry and 2026-27",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: NYK,
      slug: NYK,
      name: "New York Knicks",
      shortDesc:
        "214-267 against the 76ers on the Knicks head-to-head table. 2026 NBA champions. Swept the 76ers 4-0 in the East semifinals.",
      imageUrl: null,
      entityType: "team",
      position: 0,
      pros: [
        "2026 NBA champions, Finals win over the Spurs 4-1 (Basketball-Reference)",
        "Swept the 76ers 4-0 in the 2026 East semifinals",
        "Jalen Brunson was 2026 Finals MVP at 32.6 points, 4.2 rebounds, and 4.6 assists",
        "Franchise header lists 3 championships and 47 playoff appearances",
      ],
      cons: [
        "214-267 in 481 games against the 76ers on the Knicks head-to-head table",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The 2026 championship and the head-to-head table",
    },
    {
      id: PHI,
      slug: PHI,
      name: "Philadelphia 76ers",
      shortDesc:
        "267-214 on the other side of the Knicks head-to-head row. Swept by the Knicks in the 2026 East semifinals. LeBron James signed in July 2026.",
      imageUrl: null,
      entityType: "team",
      position: 1,
      pros: [
        "267 wins and 214 losses in the 481-game Knicks head-to-head row",
        "Beat the Celtics 4-3 in the 2026 first round",
        "LeBron James signed in July 2026",
      ],
      cons: [
        "Swept 4-0 by the Knicks in the 2026 East semifinals",
        "NBA.com lists last season at 45-37",
        "No 2026-27 regular-season game log as of October 3, 2026",
      ],
      bestFor: "The July 2026 signing and the other side of the head-to-head row",
    },
  ],
  keyDifferences: [
    {
      label: "Head-to-head row",
      entityAValue: "214 wins, 267 losses in 481 games",
      entityBValue: "267 wins, 214 losses in those games",
      winner: "tie",
    },
    {
      label: "2026 East semifinals",
      entityAValue: "Won 4-0",
      entityBValue: "Lost 0-4",
      winner: "a",
    },
    {
      label: "2026 NBA Finals",
      entityAValue: "Beat the Spurs 4-1",
      entityBValue: "Not in the Finals",
      winner: "a",
    },
    {
      label: "2026-27 roster note",
      entityAValue: "2026 champions. No game log yet",
      entityBValue: "LeBron signed in July 2026",
      winner: "tie",
    },
    {
      label: "October 20, 2026",
      entityAValue: "Home against Philadelphia, 7:00 pm ET",
      entityBValue: "At New York, 7:00 pm ET",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("h2h-record", "Head-to-head record", H2H_CAT, NYK, PHI, "214-267 in 481 games", "267-214 in those 481 games"),
    textAttr("h2h-points", "Points per game in that row", H2H_CAT, NYK, PHI, "103.6 scored, 104.4 allowed", "104.4 scored, 103.6 allowed"),
    textAttr("franchise-titles", "Championships on the Knicks header", H2H_CAT, NYK, PHI, "3 listed", "Not on this Knicks table"),
    textAttr("east-semis", "2026 East semifinals", PLAYOFF_CAT, NYK, PHI, "Won 4-0", "Lost 0-4", "a"),
    textAttr("finals-2026", "2026 Finals", PLAYOFF_CAT, NYK, PHI, "Beat the Spurs 4-1", "Not in the Finals", "a"),
    textAttr(
      "season-2627-note",
      "Regular-season line",
      SEASON_CAT,
      NYK,
      PHI,
      `None yet. Stats as of ${AS_OF}.`,
      `None yet. LeBron signed in July 2026. Stats as of ${AS_OF}.`
    ),
    textAttr(
      "opener",
      "October 20, 2026",
      SEASON_CAT,
      NYK,
      PHI,
      "76ers at Knicks, 7:00 pm ET. Schedule only.",
      "76ers at Knicks, 7:00 pm ET. Schedule only."
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
      "No page-level winner and no 2026-27 prediction. The head-to-head row and the 2026 series are finished results.",
    keyFact:
      "Knicks are 214-267 against the 76ers in 481 games on the Knicks head-to-head table. They swept the 76ers 4-0 in the 2026 East semifinals and beat the Spurs 4-1 in the Finals. The October 20 opener is a schedule fact.",
  },
  citationStats: {
    sourceCount: 5,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: FETCHED,
    sources: [
      { name: `Basketball-Reference — Knicks head-to-head (fetched ${FETCHED})`, url: H2H },
      { name: `Basketball-Reference — 2026 NBA playoffs (fetched ${FETCHED})`, url: PLAYOFFS },
      { name: `Basketball-Reference — 2026 East semifinals, 76ers vs Knicks (fetched ${FETCHED})`, url: SERIES },
      { name: `NBA.com — LeBron signs with the 76ers (fetched ${FETCHED})`, url: SIGNING },
      { name: `NBA.com — games on October 20, 2026 (fetched ${FETCHED})`, url: SCHEDULE },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference Knicks head-to-head",
      url: H2H,
      description: `Fetched ${FETCHED}. Knicks vs 76ers: 481 games, 214 wins, 267 losses, 103.6 points scored per game, 104.4 allowed. Franchise header: 3 championships.`,
    },
    {
      type: "external",
      label: "Basketball-Reference 2026 playoffs",
      url: PLAYOFFS,
      description: `Fetched ${FETCHED}. Knicks are league champion. Finals: Knicks over Spurs 4-1. East semifinals: Knicks over 76ers 4-0.`,
    },
    {
      type: "external",
      label: "2026 East semifinals series page",
      url: SERIES,
      description: `Fetched ${FETCHED}. Game scores and Brunson's series line of 29.0 points, 2.8 rebounds, and 6.0 assists.`,
    },
    {
      type: "external",
      label: "NBA.com: LeBron signs with the 76ers",
      url: SIGNING,
      description: `Updated July 27, 2026. July signing. 76ers went 45-37 and were swept by the Knicks. Contract dollars and betting odds are not used.`,
    },
    {
      type: "external",
      label: "NBA.com games for October 20, 2026",
      url: SCHEDULE,
      description: `Fetched ${FETCHED}. Philadelphia at New York, 7:00 pm ET. Schedule fact only.`,
    },
    {
      type: "blog",
      label: "New York Knicks hub",
      url: "/entity/new-york-knicks",
      description: "AversusB hub. Index, follow on October 3, 2026.",
    },
  ],
  metaTitle: "Knicks vs 76ers: Rivalry and 2026-27",
});

BUILT.metadata.metaDescription =
  "Knicks are 214-267 against the 76ers on Basketball-Reference. The 2026-27 block is dated October 3, 2026, with no game prediction.";

export const KNICKS_VS_76ERS: EditorialComparison = BUILT;
