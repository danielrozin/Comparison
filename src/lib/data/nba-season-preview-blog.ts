/**
 * 2026-27 NBA season preview blog.
 *
 * Reader copy lives in `NBA_SEASON_PREVIEW_ARTICLE`. Compare links are
 * `<!-- compare-cta:slug|Label -->` markers. The blog route turns each marker
 * into a TrackedCompareLink (`?source_page=`). Do not put crawl notes,
 * redirect history, or source-process wording in the article fields.
 */

import type { BlogArticle } from "@/lib/services/blog-generator";

export const NBA_SEASON_PREVIEW_BLOG_SLUG = "2026-27-nba-season-preview-10-debates";

/** PostHog `source_page` for this post's compare clicks. */
export const NBA_SEASON_PREVIEW_SOURCE_PAGE = `/blog/${NBA_SEASON_PREVIEW_BLOG_SLUG}`;

export interface NbaPreviewCompareLink {
  slug: string;
  label: string;
}

export const NBA_PREVIEW_DEBATES: readonly NbaPreviewCompareLink[] = [
  { slug: "lebron-vs-jordan", label: "LeBron vs Jordan" },
  { slug: "knicks-vs-76ers", label: "Knicks vs 76ers" },
  { slug: "shai-gilgeous-alexander-vs-victor-wembanyama", label: "SGA vs Wembanyama" },
  { slug: "oklahoma-city-thunder-vs-spurs", label: "Thunder vs Spurs" },
  { slug: "knicks-vs-spurs", label: "Knicks vs Spurs" },
  { slug: "flagg-vs-wembanyama", label: "Flagg vs Wembanyama" },
  { slug: "damian-lillard-vs-ja-morant", label: "Lillard vs Morant" },
  { slug: "lebron-james-vs-stephen-curry", label: "LeBron vs Curry" },
  { slug: "cooper-flagg-vs-kon-knueppel", label: "Flagg vs Knueppel" },
  { slug: "lakers-vs-celtics", label: "Lakers vs Celtics" },
];

export const NBA_PREVIEW_MORE_DEBATES: readonly NbaPreviewCompareLink[] = [
  { slug: "kobe-bryant-vs-lebron-james", label: "Kobe vs LeBron" },
  { slug: "jordan-vs-kobe", label: "Jordan vs Kobe" },
  { slug: "durant-vs-lebron", label: "Durant vs LeBron" },
];

export const NBA_PREVIEW_COMPARE_SLUGS: readonly string[] = [
  ...NBA_PREVIEW_DEBATES.map((link) => link.slug),
  ...NBA_PREVIEW_MORE_DEBATES.map((link) => link.slug),
];

const PUBLISHED_AT = "2026-10-03T00:00:00Z";

function compareCta(link: NbaPreviewCompareLink): string {
  return `<!-- compare-cta:${link.slug}|${link.label} -->`;
}

function debateSection(heading: string, body: string, link: NbaPreviewCompareLink): string {
  return `## ${heading}\n\n${body}\n\n${compareCta(link)}\n`;
}

const INTRO = `The 2026-27 NBA season opens on October 20, 2026. That night the Celtics are at the Pistons at 3:00 pm ET, the 76ers are at the Knicks at 7:00 pm ET, and the Thunder are at the Spurs at 9:30 pm ET (NBA.com). Each section below is one debate, with the sourced facts beside it.`;

const DEBATE_BODIES: readonly string[] = [
  `LeBron James signed with the Philadelphia 76ers in July 2026. He announced it on Friday, the move became official on Sunday, and he had told the Lakers on June 30 that he would not return (NBA.com, updated July 27, 2026). He was the first player to log 23 seasons and will add at least one more; he turns 42 on December 30 (NBA.com). Michael Jordan's career line is 30.1 points, 6.2 rebounds, and 5.3 assists in 1,072 games, with 32,292 points, 6 championships, and 6 Finals MVPs (Basketball-Reference). Stats as of October 3, 2026: LeBron's career line through 2025-26 is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games and 43,440 points, his 2025-26 line was 20.9 points, 6.1 rebounds, and 7.2 assists in 60 games for the Lakers, and there is no 2026-27 game log yet (Basketball-Reference).`,

  `The Knicks swept the 76ers 4-0 in the 2026 Eastern Conference semifinals, then won the championship by beating the Spurs 4-1 (Basketball-Reference). The four games were May 4 (Philadelphia 98 at New York 137), May 6 (102-108), May 8 (New York 108 at Philadelphia 94), and May 10 (New York 144 at Philadelphia 114). The 76ers had beaten the Celtics 4-3 in the first round; they went 45-37 and were swept in the second round (NBA.com, updated July 27, 2026). Stats as of October 3, 2026: the Knicks are 214-267 against the 76ers in 481 games, there is no 2026-27 regular-season game log yet (Basketball-Reference), and Philadelphia is at New York on October 20, 2026, at 7:00 pm ET (NBA.com).`,

  `Shai Gilgeous-Alexander won MVP in 2024-25 and again in 2025-26 (Basketball-Reference). In 2024-25 he averaged 32.7 points in 76 games; in 2025-26 he averaged 31.1 points, 4.3 rebounds, and 6.6 assists in 68 games. Victor Wembanyama's 2025-26 line was 25.0 points, 11.5 rebounds, 3.1 assists, and 3.1 blocks in 64 games, with Defensive Player of the Year and Western Conference finals MVP (Basketball-Reference). Stats as of October 3, 2026: SGA's career line is 25.3 points, 4.7 rebounds, and 5.3 assists in 530 games, Wembanyama's is 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks in 181 games, and neither has a 2026-27 game log (Basketball-Reference).`,

  `The Spurs beat the Thunder 4-3 in the 2026 Western Conference finals (Basketball-Reference). Game 7 was May 30, 2026: San Antonio 111 at Oklahoma City 103. The 2026 league champion is the Knicks (Basketball-Reference). Stats as of October 3, 2026: there is no 2026-27 game log yet, and Oklahoma City is at San Antonio on October 20, 2026, at 9:30 pm ET (NBA.com).`,

  `The Knicks beat the Spurs 4-1 in the 2026 Finals, and Jalen Brunson was Finals MVP at 32.6 points, 4.2 rebounds, and 4.6 assists (Basketball-Reference). The games were June 3 (New York 105 at San Antonio 95), June 5 (105-104), June 8 (San Antonio 115 at New York 111), June 10 (San Antonio 106 at New York 107), and June 13 (New York 94 at San Antonio 90). In the 1999 Finals the Spurs beat the Knicks 4-1, and Tim Duncan was Finals MVP at 27.4 points, 14.0 rebounds, and 2.4 assists (Basketball-Reference). Stats as of October 3, 2026: in 107 head-to-head games the Knicks have 47 wins and the Spurs have 60 (Basketball-Reference).`,

  `Cooper Flagg won 2025-26 Rookie of the Year with Dallas, averaging 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games (Basketball-Reference). He was drafted first overall in 2025 and debuted on October 22, 2025. Victor Wembanyama won Rookie of the Year in 2023-24 (Basketball-Reference). Stats as of October 3, 2026: Wembanyama's career line is 23.4 points, 11.0 rebounds, 3.5 assists, and 3.5 blocks in 181 games, his 2025-26 awards include Defensive Player of the Year and Western Conference finals MVP, and neither player has a 2026-27 game log (Basketball-Reference).`,

  `Portland and Memphis agreed on Monday, June 29, 2026, to send Ja Morant to the Trail Blazers, with Jerami Grant and Kris Murray going to Memphis (NBA.com, updated June 30, 2026). Morant averaged 19.5 points and 8.1 assists in 20 games for Memphis in 2025-26 (NBA.com). In 2025-26 Damian Lillard did not play because of an Achilles injury; his last logged season is 2024-25 with Milwaukee, 58 games at 24.9 points, 4.7 rebounds, and 7.1 assists (Basketball-Reference). Stats as of October 3, 2026: both are with Portland, Lillard's career line is 25.1 points, 4.3 rebounds, and 6.7 assists in 900 games, Morant's is 22.4 points, 4.6 rebounds, and 7.4 assists in 327 games, and there is no 2026-27 game log (Basketball-Reference). Phoenix is at Portland on October 21, 2026, at 10:00 pm ET (NBA.com). That is the schedule for the teams. It is not a lineup note for Lillard.`,

  `LeBron James is with the 76ers after the July 2026 signing, and Stephen Curry is with the Warriors (NBA.com and Basketball-Reference). Curry's career line is 24.8 points, 4.7 rebounds, and 6.3 assists in 1,069 games and 26,528 points (Basketball-Reference). Stats as of October 3, 2026: LeBron's career line through 2025-26 is 26.8 points, 7.5 rebounds, and 7.4 assists in 1,622 games and 43,440 points, his 2025-26 line was 20.9 points in 60 games, Curry's 2025-26 line was 26.6 points, 3.6 rebounds, and 4.7 assists in 43 games, and neither has a 2026-27 game log (Basketball-Reference).`,

  `Cooper Flagg won 2025-26 Rookie of the Year at 21.0 points, 6.7 rebounds, and 4.5 assists in 70 games for Dallas (Basketball-Reference). Kon Knueppel averaged 18.5 points, 5.3 rebounds, and 3.4 assists in 81 games for Charlotte, made All-Rookie, and finished second in Rookie of the Year voting (Basketball-Reference). Stats as of October 3, 2026: neither player has a 2026-27 game log (Basketball-Reference).`,

  `They have met in the Finals 12 times; the Celtics won 9 and the Lakers won 3, the latest in 2010 (Basketball-Reference). Boston opens on October 20, 2026, at Detroit, at 3:00 pm ET (NBA.com). Stats as of October 3, 2026: the Celtics have 18 championships and a 3,751-2,527 record across 81 seasons from 1946-47 through 2026-27, the Lakers have 17 championships, counting Minneapolis, and a 3,653-2,515 record across 79 seasons from 1948-49 through 2026-27, the Lakers are 135-169 against Boston in 304 games, and no 2026-27 game is quoted here (Basketball-Reference).`,
];

const MORE = `## More debates

Kobe Bryant's career line is 25.0 points, 5.2 rebounds, and 4.7 assists in 1,346 games, with 33,643 points, 5 championships, 2 Finals MVPs, and 18 All-Star teams (Basketball-Reference). Jordan's career line is 30.1 points in 1,072 games with 6 championships (Basketball-Reference). Stats as of October 3, 2026: Kevin Durant's career line is 27.1 points, 6.9 rebounds, and 4.4 assists in 1,201 games and 32,597 points, with 2 championships, he averaged 26.0 points in 78 games in 2025-26 for Houston, LeBron's career point total through 2025-26 is 43,440, and these rows do not include a 2026-27 game log (Basketball-Reference).

${NBA_PREVIEW_MORE_DEBATES.map(compareCta).join("\n")}
`;

const SOURCES = `## Sources

- [NBA.com games, October 20, 2026](https://www.nba.com/games?date=2026-10-20)
- [Thunder at Spurs, October 20, 2026](https://www.nba.com/game/okc-vs-sas-0022600003)
- [NBA.com games, October 21, 2026](https://www.nba.com/games?date=2026-10-21)
- [Suns at Trail Blazers, October 21, 2026](https://www.nba.com/game/phx-vs-por-0022600092)
- [LeBron James signs with the 76ers](https://www.nba.com/news/lebron-james-free-agency-sixers-2026)
- [Trail Blazers add Ja Morant](https://www.nba.com/news/blazers-grizzlies-ja-morant-trade)
- [2026 NBA playoffs](https://www.basketball-reference.com/playoffs/NBA_2026.html)
- [MVP winners](https://www.basketball-reference.com/awards/mvp.html)
- [Rookie of the Year winners](https://www.basketball-reference.com/awards/roy.html)
`;

const CONTENT = [
  INTRO,
  "",
  ...NBA_PREVIEW_DEBATES.map((link, index) =>
    debateSection(link.label, DEBATE_BODIES[index] ?? "", link),
  ),
  MORE,
  SOURCES,
].join("\n");

export const NBA_SEASON_PREVIEW_ARTICLE: BlogArticle = {
  id: "blog-nba-2026-27-season-preview",
  slug: NBA_SEASON_PREVIEW_BLOG_SLUG,
  title: "2026-27 NBA season preview: 10 debates",
  excerpt:
    "Ten debates for the 2026-27 NBA season, from LeBron and Jordan to opening night on October 20, with the sourced facts behind each comparison.",
  content: CONTENT,
  category: "sports",
  tags: ["nba", "2026-27", "season-preview", "basketball"],
  metaTitle: "2026-27 NBA season preview: 10 debates",
  metaDescription:
    "Ten debates for the 2026-27 NBA season, from LeBron and Jordan to opening night on October 20, with the sourced facts behind each comparison.",
  relatedComparisonSlugs: [...NBA_PREVIEW_COMPARE_SLUGS],
  status: "published",
  publishedAt: PUBLISHED_AT,
  createdAt: PUBLISHED_AT,
  updatedAt: PUBLISHED_AT,
  viewCount: 0,
};

const REPO_BLOG_ARTICLES: readonly BlogArticle[] = [NBA_SEASON_PREVIEW_ARTICLE];

export function findRepoBlogArticle(slug: string): BlogArticle | null {
  return REPO_BLOG_ARTICLES.find((article) => article.slug === slug) ?? null;
}

export function listRepoBlogArticles(): BlogArticle[] {
  return [...REPO_BLOG_ARTICLES];
}

export type BlogHtmlPart =
  | { kind: "html"; html: string }
  | { kind: "cta"; slug: string; label: string };

const CTA_MARKER = /<!--\s*compare-cta:([a-z0-9-]+)\|([^>]*?)\s*-->/g;

/** Split rendered HTML so each compare marker can become a source_page CTA. */
export function splitHtmlAtCompareCtas(html: string): BlogHtmlPart[] {
  const parts: BlogHtmlPart[] = [];
  let last = 0;
  for (const match of html.matchAll(CTA_MARKER)) {
    const index = match.index ?? 0;
    if (index > last) {
      parts.push({ kind: "html", html: html.slice(last, index) });
    }
    parts.push({ kind: "cta", slug: match[1], label: match[2].trim() });
    last = index + match[0].length;
  }
  if (last < html.length) {
    parts.push({ kind: "html", html: html.slice(last) });
  }
  return parts;
}
