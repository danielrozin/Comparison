import { buildEditorialComparison, textAttr } from "./helpers";
import type { EditorialComparison } from "./types";

/**
 * Lakers vs Celtics. Franchise headers, the Lakers head-to-head row, and
 * the Finals series list are Basketball-Reference. 2026-10-03.
 * The head-to-head table is not captioned regular season. No prediction.
 */

const LAL = "los-angeles-lakers";
const BOS = "boston-celtics";

const LAL_URL = "https://www.basketball-reference.com/teams/LAL/";
const BOS_URL = "https://www.basketball-reference.com/teams/BOS/";
const H2H = "https://www.basketball-reference.com/teams/LAL/head2head.html";
const SERIES = "https://www.basketball-reference.com/playoffs/series.html";

const SOURCE_DATE = "2026-10-03";
const PUBLISHED = "2026-10-03T00:00:00Z";
const AS_OF = "October 3, 2026";

const FRANCHISE_CAT = `Franchise header · Basketball-Reference`;
const H2H_CAT = `Head-to-head · Basketball-Reference Lakers table`;
const FINALS_CAT = `Finals series · Basketball-Reference playoff series history`;
const SEASON_CAT = `2026-27 season · Stats as of ${AS_OF}`;

const SHORT_ANSWER =
  "The Lakers franchise header lists 17 championships, 66 playoff appearances, and a 3,653-2,515 record across 79 seasons. The Celtics header lists 18 championships, 63 playoff appearances, and a 3,751-2,527 record across 81 seasons. On the Lakers head-to-head table the Lakers are 135-169 against Boston in 304 games. They have played 12 Finals, and the Celtics won 9 of them (Basketball-Reference). Stats as of October 3, 2026, this page does not quote a 2026-27 game and does not predict one.";

const FAQS = [
  {
    question: "How many championships does each franchise header list?",
    answer:
      "The Lakers header lists 17 championships, 66 playoff appearances, a 3,653-2,515 record, a .592 winning percentage, and 79 seasons from 1948-49 through 2026-27. The names on that header are Los Angeles Lakers and Minneapolis Lakers. The Celtics header lists 18 championships, 63 playoff appearances, a 3,751-2,527 record, a .597 winning percentage, and 81 seasons from 1946-47 through 2026-27.",
  },
  {
    question: "What is the Lakers' record against the Celtics?",
    answer:
      "On the Lakers head-to-head table, the Boston row is 304 games, 135 Lakers wins, 169 losses, a .444 winning percentage, 104.4 points scored per game, and 106.7 points allowed per game. Basketball-Reference does not label that row as regular season only, so this comparison does not add that label. The other side of the same row is 169 Celtics wins and 135 losses.",
  },
  {
    question: "How many times have they met in the Finals?",
    answer:
      "There have been 12 Finals series between the Celtics and the Lakers, including the 1959 series against the Minneapolis Lakers (Basketball-Reference). The Celtics won 9. The Lakers won 3: 2010, 4-3; 1987, 4-2; and 1985, 4-2. Celtics series wins are 2008, 4-2; 1984, 4-3; 1969, 4-3; 1968, 4-2; 1966, 4-3; 1965, 4-1; 1963, 4-2; 1962, 4-3; and 1959, 4-0.",
  },
  {
    question: "Which Finals meeting is the most recent?",
    answer:
      "2010. The series row is June 3 to June 17, 2010, Los Angeles Lakers 4, Boston Celtics 3. Basketball-Reference does not show a later Finals between these two franchises. The 2008 row is June 5 to June 17, Boston 4, Los Angeles 2.",
  },
  {
    question: "Do the 17 and 18 championships mean Finals wins against each other?",
    answer:
      "No. Those are the franchise-header championship counts. The Finals count against each other is the 12-series list: Celtics 9, Lakers 3. The head-to-head row is a third number, 135-169 in 304 games, and it is not labeled as Finals.",
  },
  {
    question: "What is known for 2026-27?",
    answer:
      "Stats as of October 3, 2026, both franchise headers include the 2026-27 season in the season span, and this page does not quote a 2026-27 Lakers-Celtics game. It does not predict the season series or a championship.",
  },
];

const VERDICT = `Franchise headers: Lakers 17 championships and a 3,653-2,515 record. Celtics 18 championships and a 3,751-2,527 record.

Head-to-head row: Lakers 135 wins and 169 losses in 304 games.

Finals series on the playoff series table: 12 meetings. Celtics won 9. Lakers won 3. The latest is 2010, Lakers 4, Celtics 3.

2026-27 season: Stats as of October 3, 2026, this page does not quote a game between them and does not pick a winner.`;

const EXPERT_ANALYSIS = `The Celtics franchise header lists 18 championships. The Lakers header lists 17. In the 12 Finals series on Basketball-Reference's playoff series table, the Celtics won 9 and the Lakers won 3. On the Lakers head-to-head table, the Lakers are 135-169 against Boston in 304 games. This page does not predict 2026-27.

Source note: the headers are the Lakers and Celtics franchise pages. The 304-game row is the Lakers head-to-head page. The 12 Finals series are filtered from the playoff series history table to rows whose series is Finals and whose two teams are the Celtics and the Lakers, including Minneapolis in 1959. ${LAL_URL} ${BOS_URL} ${H2H} ${SERIES}

2026-27 season. Stats as of ${AS_OF}. Both headers run through 2026-27. This page does not quote a 2026-27 meeting, a score, or a projection. The latest Finals row between them is 2010.

Finals series, winner first. 2010, Los Angeles 4, Boston 3, June 3 to June 17. 2008, Boston 4, Los Angeles 2, June 5 to June 17. 1987, Los Angeles 4, Boston 2, June 2 to June 14. 1985, Los Angeles 4, Boston 2, May 27 to June 9. 1984, Boston 4, Los Angeles 3, May 27 to June 12. 1969, Boston 4, Los Angeles 3, April 23 to May 5. 1968, Boston 4, Los Angeles 2, April 21 to May 2. 1966, Boston 4, Los Angeles 3, April 17 to April 28. 1965, Boston 4, Los Angeles 1, April 18 to April 25. 1963, Boston 4, Los Angeles 2, April 14 to April 24. 1962, Boston 4, Los Angeles 3, April 7 to April 18. 1959, Boston 4, Minneapolis 0, April 4 to April 9.

The head-to-head row is a separate count from those Finals. It is 304 games, Lakers 135 wins, 169 losses, .444, 104.4 points scored per game, and 106.7 allowed. The table caption is "40 Opponents," and Basketball-Reference does not say the row is regular season only.`;

const BUILT = buildEditorialComparison({
  slug: "lakers-vs-celtics",
  title: "Lakers vs Celtics: Rivalry History",
  shortAnswer: SHORT_ANSWER,
  verdict: VERDICT,
  category: "sports",
  publishedAt: PUBLISHED,
  updatedAt: PUBLISHED,
  entities: [
    {
      id: LAL,
      slug: LAL,
      name: "Los Angeles Lakers",
      shortDesc:
        "Franchise header: 17 championships, 66 playoff appearances, 3,653-2,515. Finals series against Boston: 3 wins in 12 meetings on the series table.",
      imageUrl: null,
      entityType: "team",
      position: 0,
      pros: [
        "Franchise header lists 17 championships and 66 playoff appearances",
        "Won the 2010, 1987, and 1985 Finals against Boston on the series table",
        "Header record 3,653-2,515, .592, across 79 seasons from 1948-49 through 2026-27",
      ],
      cons: [
        "135-169 against Boston in 304 games on the Lakers head-to-head table",
        "Won 3 of the 12 Finals series on the playoff series table",
      ],
      bestFor: "The 17 championships on the franchise header and the three Finals wins",
    },
    {
      id: BOS,
      slug: BOS,
      name: "Boston Celtics",
      shortDesc:
        "Franchise header: 18 championships, 63 playoff appearances, 3,751-2,527. Won 9 of 12 Finals series against the Lakers on the series table.",
      imageUrl: null,
      entityType: "team",
      position: 1,
      pros: [
        "Franchise header lists 18 championships and 63 playoff appearances",
        "Won 9 of 12 Finals series against the Lakers on the series table",
        "169 wins in the 304-game Lakers head-to-head row",
      ],
      cons: [
        "Lost the 2010 Finals, 3-4, the latest meeting between these franchises",
        "No 2026-27 meeting is quoted on this page",
      ],
      bestFor: "The 18 championships on the franchise header and the Finals series count",
    },
  ],
  keyDifferences: [
    {
      label: "Championships on the franchise header",
      entityAValue: "17",
      entityBValue: "18",
      winner: "b",
    },
    {
      label: "Finals series on the playoff series table",
      entityAValue: "3 wins in 12 meetings",
      entityBValue: "9 wins in 12 meetings",
      winner: "b",
    },
    {
      label: "Head-to-head row",
      entityAValue: "135 wins, 169 losses in 304 games",
      entityBValue: "169 wins, 135 losses in those games",
      winner: "b",
    },
    {
      label: "Latest Finals meeting",
      entityAValue: "2010, won 4-3",
      entityBValue: "2010, lost 3-4",
      winner: "a",
    },
    {
      label: "2026-27 game on this page",
      entityAValue: "None quoted. Stats as of October 3, 2026.",
      entityBValue: "None quoted. Stats as of October 3, 2026.",
      winner: "tie",
    },
  ],
  attributes: [
    textAttr("titles", "Championships on the franchise header", FRANCHISE_CAT, LAL, BOS, "17", "18", "b"),
    textAttr("record", "Franchise record", FRANCHISE_CAT, LAL, BOS, "3,653-2,515, .592, 79 seasons", "3,751-2,527, .597, 81 seasons", "b"),
    textAttr("playoffs", "Playoff appearances", FRANCHISE_CAT, LAL, BOS, "66", "63", "a"),
    textAttr("h2h", "Head-to-head row", H2H_CAT, LAL, BOS, "135-169 in 304 games", "169-135 in those 304 games", "b"),
    textAttr("finals", "Finals series", FINALS_CAT, LAL, BOS, "3 wins in 12 meetings", "9 wins in 12 meetings", "b"),
    textAttr("latest", "Latest Finals", FINALS_CAT, LAL, BOS, "2010, Lakers 4, Celtics 3", "2010, Celtics 3, Lakers 4", "a"),
    textAttr(
      "season-2627",
      "2026-27 meeting",
      SEASON_CAT,
      LAL,
      BOS,
      `None quoted. Stats as of ${AS_OF}.`,
      `None quoted. Stats as of ${AS_OF}.`
    ),
  ],
  faqs: FAQS,
  relatedComparisons: [
    { slug: "lebron-vs-jordan", title: "LeBron vs Jordan", category: "sports" },
    { slug: "knicks-vs-76ers", title: "Knicks vs 76ers", category: "sports" },
  ],
  expertAnalysis: EXPERT_ANALYSIS,
  quickAnswer: {
    tldr: SHORT_ANSWER,
    winnerName: null,
    winnerReason:
      "No page-level winner and no 2026-27 prediction. The headers, the head-to-head row, and the Finals series are finished counts.",
    keyFact:
      "Celtics header: 18 championships. Lakers header: 17. Finals series table: Celtics 9, Lakers 3, in 12 meetings. Head-to-head row: Lakers 135-169 in 304 games.",
  },
  citationStats: {
    sourceCount: 4,
    dataPointCount: 7,
    reviewsAnalyzed: null,
    preferencePercent: null,
    preferenceEntity: null,
    lastResearched: SOURCE_DATE,
    sources: [
      { name: `Basketball-Reference — Lakers franchise`, url: LAL_URL },
      { name: `Basketball-Reference — Celtics franchise`, url: BOS_URL },
      { name: `Basketball-Reference — Lakers head-to-head`, url: H2H },
      { name: `Basketball-Reference — playoff series history`, url: SERIES },
    ],
  },
  resources: [
    {
      type: "external",
      label: "Basketball-Reference Lakers franchise",
      url: LAL_URL,
      description: `17 championships, 66 playoff appearances, 3,653-2,515, 79 seasons from 1948-49 through 2026-27. Names include Minneapolis Lakers.`,
    },
    {
      type: "external",
      label: "Basketball-Reference Celtics franchise",
      url: BOS_URL,
      description: `18 championships, 63 playoff appearances, 3,751-2,527, 81 seasons from 1946-47 through 2026-27.`,
    },
    {
      type: "external",
      label: "Basketball-Reference Lakers head-to-head",
      url: H2H,
      description: `Boston row: 304 games, Lakers 135 wins, 169 losses, 104.4 points scored per game, 106.7 allowed. Not labeled regular season.`,
    },
    {
      type: "external",
      label: "Basketball-Reference playoff series history",
      url: SERIES,
      description: `12 Finals series. Celtics won 9. Lakers won 3. Latest: 2010, Lakers 4, Celtics 3.`,
    },
  ],
  metaTitle: "Lakers vs Celtics: Rivalry History",
});

BUILT.metadata.metaDescription =
  "Celtics list 18 championships and Lakers list 17. They met in 12 Finals on the series table, and the Celtics won 9. Stats as of October 3, 2026.";

export const LAKERS_VS_CELTICS: EditorialComparison = BUILT;
