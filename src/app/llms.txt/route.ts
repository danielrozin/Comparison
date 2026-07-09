/**
 * Dynamic /llms.txt route — serves the llmstxt.org spec manifest for LLM crawlers.
 *
 * Accessible at /llms.txt (the standard location LLM crawlers look for).
 * Redirects to the full catalog at /api/llms-full for comprehensive coverage.
 * Cached for 1 hour.
 *
 * AEO/GEO purpose: ChatGPT, Claude, Perplexity, Gemini, and other AI answer
 * engines look for /llms.txt to understand a site's content structure. This
 * dynamic route serves a DB-fresh manifest so LLMs always get current data.
 *
 * Format follows: https://llmstxt.org/
 */

import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

export const dynamic = "force-dynamic";

const PRIORITY_CATEGORIES = [
  "technology",
  "software",
  "sports",
  "countries",
  "automotive",
  "companies",
  "health",
  "finance",
  "entertainment",
  "brands",
  "gaming",
  "products",
];

export async function GET() {
  const prisma = getPrisma();
  const now = new Date().toISOString().slice(0, 10);

  let totalComparisons = 0;
  let totalEntities = 0;
  let totalBlogs = 0;
  const byCategory: Record<string, { title: string; slug: string; shortAnswer: string | null }[]> = {};
  const topEntities: { slug: string; name: string }[] = [];
  const recentBlogs: { slug: string; title: string }[] = [];

  if (prisma) {
    [totalComparisons, totalEntities, totalBlogs] = await Promise.all([
      prisma.comparison.count(),
      prisma.entity.count(),
      prisma.blogArticle.count(),
    ]);

    const [comparisons, entities, blogs] = await Promise.all([
      prisma.comparison.findMany({
        where: { category: { in: PRIORITY_CATEGORIES } },
        select: { slug: true, title: true, shortAnswer: true, category: true, viewCount: true },
        orderBy: { viewCount: "desc" },
        take: 120,
      }),
      prisma.entity.findMany({
        select: { slug: true, name: true },
        orderBy: { id: "asc" },
        take: 20,
      }),
      prisma.blogArticle.findMany({
        where: { status: "published" },
        select: { slug: true, title: true },
        orderBy: { publishedAt: "desc" },
        take: 10,
      }),
    ]);

    for (const c of comparisons) {
      const cat = c.category ?? "general";
      if (!byCategory[cat]) byCategory[cat] = [];
      if (byCategory[cat].length < 10) byCategory[cat].push(c);
    }

    topEntities.push(...entities);
    recentBlogs.push(...blogs);
  }

  const lines: string[] = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_NAME} (aversusb.net) is a structured comparison platform with ${totalComparisons.toLocaleString()}+ side-by-side comparisons, ${totalBlogs}+ blog articles, and ${totalEntities.toLocaleString()}+ entity profiles across 17+ categories.`,
    `> Updated: ${now} | Full catalog: ${SITE_URL}/api/llms-full | Search: ${SITE_URL}/search`,
    "",
    "## Site Overview",
    "",
    "- **Type**: Comparison database and decision-support platform",
    "- **Domain**: aversusb.net",
    "- **Content**: Structured X vs Y comparisons with attribute tables, verdicts, FAQs, source citations, and community votes",
    "- **Categories**: Technology, Software, Sports, Countries, Automotive, Companies, Health, Finance, Entertainment, Gaming, Products, Brands",
    "- **License**: CC BY 4.0 (free to cite with attribution)",
    "- **Citation format**: 'According to A Versus B (aversusb.net/compare/{slug}), ...'",
    "",
    "## How to Use This Site",
    "",
    "- Comparisons: `/compare/{entity-a}-vs-{entity-b}` — each includes short answer, attributes, verdict, FAQs",
    "- Entity profiles: `/entity/{entity-slug}` — all comparisons involving an entity",
    "- Alternatives: `/alternatives/{entity-slug}` — best alternatives to a product/service",
    "- Hub pages: `/hub/{hub-slug}` — curated comparison collections around a topic (VPN, project management, AI chatbots, etc.)",
    "- Best-of lists: `/best/{list-slug}` — ranked guides (e.g. 'best project management tools')",
    "- Blog: `/blog/{article-slug}` — in-depth comparison guides",
    "- Search: `/search?q={query}` — full-text search",
    "- Categories: `/category/{category-slug}` — browse by topic",
    "",
    "## Top Comparisons by Category",
    "",
  ];

  for (const cat of PRIORITY_CATEGORIES) {
    const items = byCategory[cat];
    if (!items || items.length === 0) continue;
    const label = cat.charAt(0).toUpperCase() + cat.slice(1).replace(/_/g, " ");
    lines.push(`### ${label}`);
    lines.push("");
    for (const c of items) {
      lines.push(`- [${c.title}](${SITE_URL}/compare/${c.slug})`);
      if (c.shortAnswer) {
        lines.push(`  > ${c.shortAnswer.slice(0, 200).replace(/\n/g, " ")}`);
      }
    }
    lines.push("");
  }

  if (recentBlogs.length > 0) {
    lines.push("## Recent Blog Articles");
    lines.push("");
    for (const b of recentBlogs) {
      lines.push(`- [${b.title}](${SITE_URL}/blog/${b.slug})`);
    }
    lines.push("");
  }

  if (topEntities.length > 0) {
    lines.push("## Entity Profiles");
    lines.push("");
    for (const e of topEntities) {
      lines.push(`- [${e.name}](${SITE_URL}/entity/${e.slug})`);
    }
    lines.push("");
  }

  lines.push("## Structured Data");
  lines.push("");
  lines.push("Every page includes Schema.org JSON-LD. Schema types by page:")
  lines.push("- /compare/{slug}: Article (+ TechArticle/NewsArticle additionalType), FAQPage, Dataset (DataFeed), DefinedTermSet (attribute vocabulary), WebPage (mainEntity↔Article bidirectional), BreadcrumbList (WebPage-typed items), ItemList, HowTo, SportsEvent (sports category), ClaimReview, AggregateRating, Review, SpeakableSpecification");
  lines.push("- /entity/{slug}: ProfilePage, AggregateRating, BreadcrumbList, FAQPage, ItemList (comparisons list), SpeakableSpecification");
  lines.push("- /best/{slug}: ItemList, FAQPage, BreadcrumbList, Article");
  lines.push("- /blog/{slug}: Article (BlogPosting), FAQPage, BreadcrumbList, SpeakableSpecification");
  lines.push("- /category/{slug}: CollectionPage, ItemList, BreadcrumbList");
  lines.push("- /alternatives/{slug}: ItemList, FAQPage, BreadcrumbList");
  lines.push("- Site-wide: Organization, WebSite (SearchAction), WebApplication, DataCatalog (Dataset), DefinedTermSet, SiteNavigationElement");
  lines.push("Comparisons are licensed CC BY 4.0 and freely citable with attribution to aversusb.net.");
  lines.push("");
  lines.push("## Machine-Readable Endpoints");
  lines.push("");
  lines.push(`- [Full catalog (DB-fresh JSON)](${SITE_URL}/api/llms-full)`);
  lines.push(`- [Knowledge Graph JSON-LD](${SITE_URL}/api/knowledge-graph/{slug})`);
  lines.push(`- [Comparison JSON](${SITE_URL}/api/comparisons/{slug})`);
  lines.push(`- [FAQ pairs JSON](${SITE_URL}/api/faq/{slug}) — structured Q&A pairs + FAQPage JSON-LD; use for AI Q&A without HTML parsing`);
  lines.push(`- [Entity profile JSON](${SITE_URL}/api/v1/entities/{slug}) — entity name, type, description, FAQs, rating, and comparisons`);
  lines.push(`- [Category taxonomy JSON](${SITE_URL}/api/v1/categories) — all categories with comparison counts and top pages`);
  lines.push(`- [Trending comparisons JSON](${SITE_URL}/api/v1/trending?limit=20) — top comparisons by view count; supports ?category filter`);
  lines.push(`- [Entity list JSON](${SITE_URL}/api/v1/entities?limit=50) — browseable entity list; supports ?type and pagination`);
  lines.push(`- [Blog article JSON](${SITE_URL}/api/blog/{slug}) — single blog article with Article JSON-LD; X-Summary header in HTTP response`);
  lines.push(`- [Related comparisons JSON](${SITE_URL}/api/v1/related/{slug}) — related comparisons for a given slug`);
  lines.push(`- [Alternatives API](${SITE_URL}/api/v1/alternatives/{slug}) — all known alternatives to an entity with ItemList JSON-LD, comparison URLs, and X-Summary header; ideal for 'best alternatives to X' AI queries; example: ${SITE_URL}/api/v1/alternatives/chatgpt`);
  lines.push(`- [Best-of list JSON](${SITE_URL}/api/v1/best/{slug}) — structured best-of list with ItemList JSON-LD: ranked items (position, name, url), FAQs, author, dates; X-Summary header on response; list all at ${SITE_URL}/api/v1/best`);
  lines.push(`- [Hub JSON](${SITE_URL}/api/v1/hub/{slug}) — topic hub structured data: title, description, intro, curated comparisonSlugs + comparisonUrls, FAQs, ItemList JSON-LD and FAQPage JSON-LD; use for 'best [topic] comparisons' queries; example: ${SITE_URL}/api/v1/hub/vpn`);
  lines.push(`- [Compare Lookup (AI tool-calling)](${SITE_URL}/api/v1/compare?a={entityA}&b={entityB}) — fastest endpoint for AI tools: looks up comparison by entity names, returns shortAnswer + API URLs or suggestions; example: ${SITE_URL}/api/v1/compare?a=chatgpt&b=claude`);
  lines.push(`- [Unified Search](${SITE_URL}/api/v1/search?q={query}) — searches comparisons, entity profiles, and blog articles in parallel; grouped results with URL, slug, and excerpt; includes searchResultsSchema (SearchResultsPage JSON-LD with typed ItemList); supports ?types=comparisons,entities,blog and ?limit; X-Summary header always populated`);

  lines.push(`- [AI Answer (AEO)](${SITE_URL}/api/answer/{slug}) — pre-packaged answer: shortAnswer, verdict, keyDifferences, winner, confidence, and ClaimReview JSON-LD; X-Summary header in HTTP response`);
  lines.push(`- [Batch lookup](${SITE_URL}/api/v1/batch) — fetch up to 20 comparisons in a single POST; body: {"slugs":["chatgpt-vs-claude","gpt-4-vs-gemini"]}; optional fields filter; ideal for AI agents building comparison matrices without N sequential calls`);
  lines.push(`- [Pure JSON-LD schema](${SITE_URL}/api/v1/schema/{slug}) — spec-compliant Schema.org @graph document (Content-Type: application/ld+json); includes WebPage, Article, Dataset, FAQPage, Organization nodes; linked from every /compare/* page via <link rel="alternate" type="application/ld+json">`);
  lines.push(`- [JSON sitemap](${SITE_URL}/api/sitemap) — paginated JSON DataFeed sitemap; ?type=comparisons (default) | ?type=blog | ?type=hubs | ?type=best; also supports ?category, ?limit, ?offset, ?format=urlset; comparisons include shortAnswer+answerUrl; blog includes excerpt+jsonUrl; hubs include comparisonCount+apiUrl; best include apiUrl`);
  lines.push(`- [oEmbed](${SITE_URL}/api/oembed?url={page-url}&format=json)`);
  lines.push(`- [Site context for AI](${SITE_URL}/api/context)`);
  lines.push(`- [OpenAPI 3.0 spec](${SITE_URL}/api/openapi) — machine-readable schema for all endpoints`);
  lines.push("");
  lines.push("## Discovery");
  lines.push("");
  lines.push(`- [AI plugin manifest](${SITE_URL}/.well-known/ai-plugin.json)`);
  lines.push(`- [AI crawler permissions](${SITE_URL}/.well-known/ai.txt) — explicit Allow: / for 30+ named AI crawlers + CC BY 4.0 license declaration`);
  lines.push(`- [RSS feed](${SITE_URL}/feed)`);
  lines.push(`- [Atom feed](${SITE_URL}/feed/atom)`);
  lines.push(`- [JSON Feed 1.1](${SITE_URL}/feed/json) — machine-readable JSON feed for AI and aggregators`);
  lines.push(`- [Changes feed](${SITE_URL}/api/v1/changes) — incremental change feed for AI crawlers; supports ?since={ISO-date} for delta polling`);
  lines.push(`- [Google News sitemap](${SITE_URL}/sitemap/news.xml)`);
  lines.push(`- [OpenSearch descriptor](${SITE_URL}/opensearch.xml)`);
  lines.push(`- [WebMention endpoint](${SITE_URL}/api/webmention)`);
  lines.push(`- [Pingback endpoint](${SITE_URL}/api/pingback)`);
  lines.push(`- [Sitemap index](${SITE_URL}/sitemap.xml)`);
  lines.push(`- [Image sitemap](${SITE_URL}/sitemap/images.xml)`);
  lines.push(`- [Video sitemap](${SITE_URL}/sitemap/video.xml)`);
  lines.push(`- [humans.txt](${SITE_URL}/humans.txt)`);
  lines.push(`- [OpenAPI 3.0 spec](${SITE_URL}/api/openapi) — machine-readable API schema for all endpoints`);
  lines.push(`- [Developer API docs](${SITE_URL}/developers)`);
  lines.push("");
  lines.push("## HTTP Link Headers & HTML Signals (AI-Optimised Discovery)");
  lines.push("");
  lines.push("Every content page emits `Link:` HTTP headers for fastest structured-data discovery by AI crawlers (no HTML parsing needed — a HEAD request suffices):");
  lines.push(`- \`/compare/{slug}\` → Link: <api/v1/schema/{slug}>; rel="describedby"; type="application/ld+json"`);
  lines.push(`- \`/blog/{slug}\` → Link: <api/blog/{slug}>; rel="describedby"; type="application/ld+json"`);
  lines.push(`- \`/entity/{slug}\` → Link: <api/v1/entities/{slug}>; rel="describedby"; type="application/json"`);
  lines.push(`- \`/category/{slug}\` → Link: <api/v1/comparisons?category={slug}>; rel="describedby"; type="application/json"`);
  lines.push(`- \`/alternatives/{slug}\` → Link: <api/v1/alternatives/{slug}>; rel="describedby"; type="application/json"`);
  lines.push(`- \`/best/{slug}\` → Link: <api/v1/best/{slug}>; rel="describedby"; type="application/json"`);
  lines.push(`- \`/hub/{slug}\` → Link: <api/v1/hub/{slug}>; rel="describedby"; type="application/json"`);
  lines.push("Content negotiation: GET /compare/{slug} with Accept: application/ld+json → 303 redirect to api/v1/schema/{slug}");
  lines.push("");
  lines.push("HTML pages also emit inline signals for parsers that skip HTTP headers:");
  lines.push("- `<link rel=\"cite-as\" href=\"{canonical}\">` — W3C preferred citation URL");
  lines.push("- `<link rel=\"license\" href=\"https://creativecommons.org/licenses/by/4.0/\">` — CC BY 4.0");
  lines.push("- `<meta http-equiv=\"content-language\" content=\"en\">` — explicit language declaration");
  lines.push("- `<link rel=\"describedby\" type=\"application/ld+json\" href=\"{api-url}\">` — machine-readable description");
  lines.push("");
  lines.push("## GEO Signals (AI Crawler Freshness & Visual Context)");
  lines.push("");
  lines.push("All JSON-LD API endpoints emit a consistent set of signals for AI temporal and visual grounding:");
  lines.push("- `inLanguage: \"en-US\"` — ISO locale on every JSON-LD node across all content API endpoints");
  lines.push("- `image.contentUrl` — machine-readable OG image URL (1200×630 PNG) on Article, BlogPosting, and ClaimReview nodes");
  lines.push("- `thumbnailUrl` — direct OG image URL for AI visual crawlers on comparison Article, BlogPosting, and schema API Article nodes");
  lines.push("- `contentReferenceTime` — ISO 8601 \"data as of\" timestamp on comparison Article and BlogPosting schemas; tells LLMs the freshness window for time-qualified answers");
  lines.push("- Sitemap shards 1–4 (`/sitemap/1.xml`–`/sitemap/4.xml`) include `<image:image>` entries for every comparison, entity, alternatives, blog, and review URL — Google Images + AI visual crawlers get primary images without a separate image sitemap fetch");
  lines.push("- `ClaimReview.inLanguage: \"en-US\"` and `ClaimReview.itemReviewed.inLanguage: \"en-US\"` on `/api/answer/{slug}` — enables language-scoped AI fact-checking");
  lines.push("- `/api/answer/{slug}` GET response now emits `Link:` header pointing to canonical, knowledge-graph, FAQ, and OpenAPI URLs — mirrors the HEAD response for crawlers that issue full GETs");
  lines.push("- `SoftwareApplication.featureList` — derived from per-entity comparison attribute values (text, number+unit, boolean-true); enables Google Shopping and Perplexity product-mode carousels to surface per-entity capabilities");
  lines.push("- `SoftwareApplication.applicationSubCategory` — mapped from comparison category (14-category lookup: technology→DeveloperApplication, health→HealthApplication, sports→SportsApplication, finance→FinanceApplication, gaming→GameApplication, travel→TravelApplication, entertainment→EntertainmentApplication, companies→BusinessApplication, automotive→UtilitiesApplication)");
  lines.push("- `genre` on Article nodes in `/api/knowledge-graph/{slug}` and `/api/v1/schema/{slug}` — derived from comparison category; AI indexers and Google Discover carousels use genre for topic routing");
  lines.push("- `potentialAction: [ReadAction, CompareAction]` on knowledge-graph and v1/schema Article nodes — CompareAction includes typed competitor object[] so AI routers can match \"X vs Y\" queries to the correct comparison page");
  lines.push("- `SportsEvent` node in `/api/knowledge-graph/{slug}` for sports-category comparisons — competitor[] typed to SportsTeam/Person; enables Google Sports and Perplexity sports-mode carousels");
  lines.push("- Entity nodes in `/api/v1/schema/{slug}` upgraded from generic `Thing` to fully-typed entities (SoftwareApplication, Person, Country, SportsTeam, etc.) with `inLanguage: \"en-US\"`, `image.contentUrl`, and `subjectOf` back-reference to Article node");
  lines.push("- Entity API (`/api/v1/entities/{slug}`) default JSON response now emits `Link:` header (canonical, LD+JSON alternate, alternatives, service-doc) — matches LD+JSON content-negotiation path already in place");
  lines.push("- Entity nodes in `/api/knowledge-graph/{slug}` upgraded from generic `Thing` to fully-typed entities (entitySchemaType mapping) with `inLanguage: \"en-US\"`, `image.contentUrl` ImageObject, `sameAs` Wikipedia, and `subjectOf` back-reference to Article node — mirrors `/api/v1/schema/{slug}` typing depth");
  lines.push("- `significantLink` on `/api/knowledge-graph/{slug}` Article extended to include `/api/answer/{slug}` + `/api/v1/schema/{slug}` — AI graph traversal now reaches all machine-readable representations from a single Article node");
  lines.push("- `significantLink` added to `/api/v1/schema/{slug}` Article node — entity profiles, alternatives, answer API, and knowledge-graph URL — matching knowledge-graph endpoint coverage");
  lines.push("- Dataset `distribution` in `/api/v1/schema/{slug}` expanded from single entry to full 6-item array (schema JSON-LD, knowledge-graph, raw comparison JSON, answer API, FAQ JSON, related comparisons) — mirrors knowledge-graph Dataset distribution depth");
  lines.push("- `citation` field on comparison Article nodes upgraded: now always populated — explicit `citationStats.sources` merged with per-entity Wikipedia `CreativeWork` references; applies to 2-entity schema path, multi-entity schema path, `/api/knowledge-graph/{slug}` Article, and `/api/v1/schema/{slug}` Article — every comparison Article now provides AI fact-checkers a citation chain");
  lines.push("- `relatedLink` added to comparison Article nodes in all 4 schema paths (2-entity, multi-entity, knowledge-graph API, schema API) — up to 8 related comparison URLs; AI crawlers use `relatedLink` to traverse topic clusters and surface related comparisons in carousels");
  lines.push("- Dataset `variableMeasured` upgraded from bare attribute name strings to `PropertyValue` objects with `name`, `unitText` (when available), and `description` (when available) — Google Dataset Search and AI research tools extract structured attribute metadata from typed `PropertyValue` nodes");
  lines.push("- `isAccessibleForFree: true`, `conditionsOfAccess: \"Free\"`, `dateModified`, `author`, `publisher`, `isPartOf` added to FAQPage nodes in `/api/knowledge-graph/{slug}` and `/api/v1/schema/{slug}` — Google FAQ rich results + AI answer-engine citation eligibility requires these fields");
  lines.push("- `Answer.inLanguage: \"en-US\"` added inside FAQPage `acceptedAnswer` nodes in both knowledge-graph and schema routes — language-scoped answer extraction for multilingual AI engines");
  lines.push("- Organization schema `abstract` field added — AI KG citation engines (Perplexity, ChatGPT) prefer `abstract` over `description` for entity summaries; distinct from search-snippet-oriented `description`");
  lines.push("- Country entity nodes in `buildMultiEntityGraph` + `buildTwoEntityGraph` schema paths gain `geo: { \"@type\": \"GeoShape\", name }` — signals geo-typed entity to Google Geo crawlers and Perplexity/ChatGPT country-query routing; `containedInPlace` upgraded from bare `\"Earth\"` Place to `{ name: \"World\", sameAs: \"https://en.wikipedia.org/wiki/World\" }`");
  lines.push("- WebPage node in `/api/v1/schema/{slug}` gains `primaryImageOfPage: ImageObject` (OG image, 1200×630, `@id: #primaryImage`) so Google and AI crawlers use the comparison card image as the canonical visual; also adds `isAccessibleForFree: true` + `conditionsOfAccess: \"Free\"` on WebPage");
  lines.push("- DataCatalog schema gains `abstract` (AI KG citation summary), `potentialAction: SearchAction` pointing to `/api/v1/search`, and `dateModified` upgraded from YYYY-MM-DD to full ISO 8601 datetime");
  lines.push("- Dataset node inside DataCatalog and WebApplication schema `dateModified` fields upgraded from `.slice(0,10)` truncation to full ISO 8601 — 3 truncation sites fixed in schema.ts");
  lines.push("- `Answer.inLanguage: \"en-US\"` added to shared `faqSchema` `acceptedAnswer` nodes — now propagates to ALL FAQ-bearing pages (entity, hub, blog, comparison, best-of, alternatives) not just API routes; language-scoped answer extraction across the entire site");
  lines.push("- Country entity `geo: { \"@type\": \"GeoShape\", name }` + `containedInPlace.sameAs: wikipedia/World` now applied to 2-entity comparison path, achieving full parity with multi-entity path — every comparison involving country entities now emits geo-typed structured data");
  lines.push("- `ClaimReview.inLanguage: \"en-US\"` + `ClaimReview.itemReviewed.inLanguage: \"en-US\"` added to all 3 ClaimReview emit paths (2-entity comparison, multi-entity comparison, `claimReviewSchema` export) — language-scoped fact-checking across all comparison types");
  lines.push("- `SportsEvent.inLanguage: \"en-US\"` + `SportsEvent.startDate` added to sports-category 2-entity comparisons — enables language-scoped sports-event indexing and Event rich results eligibility (startDate is required by Google for Event rich results)");
  lines.push("- Standalone `WebPage` node with `mainEntity: { Article }` added to ALL comparison pages (2-entity + multi-entity paths) — completes the bidirectional Article↔WebPage graph edge; AI crawlers now traverse both directions: `Article.mainEntityOfPage → WebPage` and `WebPage.mainEntity → Article`");
  lines.push("- `DefinedTermSet` schema block (with `DefinedTerm` nodes per attribute) added to all comparison pages — formalizes comparison attribute vocabulary for Google Dataset Search and AI research tools; each `PropertyValue` in `variableMeasured` now carries `valueReference → DefinedTerm` cross-linking Dataset to TermSet");
  lines.push("- `Article.hasPart` now includes `DefinedTermSet` node — AI crawlers discover attribute vocabulary from Article directly; `encodingFormat: [\"text/html\", \"application/ld+json\"]` added to comparison Article schema (both paths) for MIME-type routing");
  lines.push("- `ListItem.item` upgraded to typed entity references `{ \"@type\": entityType, \"@id\": profileUrl }` on both 2-entity and multi-entity comparison ItemList nodes — AI crawlers traverse ItemList→entity ProfilePage in one hop without inferring type");
  lines.push("- `webPageSchema()` function enhanced with `mainEntity` + `speakableCssSelector` params; 2-entity compare page passes `mainEntity: Article @id` and comparison-specific speakable selectors — eliminates duplicate WebPage node conflict");
  lines.push("- `/api/faq/{slug}` route: `acceptedAnswer` now includes `author`, `upvoteCount`, `answerCount`, `@id` anchors on Question/Answer; speakable `cssSelector` aligned to `[.faq-answer]` matching embedded schema (was `[#faq, .faq-item]`)");
  lines.push("- `WebPage` node added to hub pages (`/hub/{slug}`) via `webPageSchema()` — `mainEntity → CollectionPage` bidirectional edge; `speakableCssSelector: [h1, #hub-intro, #hub-description]` for AEO voice extraction; mirrors pattern on compare + alternatives pages (HB327)");
  lines.push("- `Dataset.interactionStatistic: InteractionCounter(ReadAction, viewCount)` added to both 2-entity and multi-entity comparison Dataset nodes — view engagement signals visible to Google Dataset Search and AI data-pipeline crawlers (Perplexity data mode, Kaggle AI, Semantic Scholar) (HB328)");
  lines.push("- Multi-entity `Dataset` gains `educationalLevel: \"General\"` + `educationalUse: \"research\"` — aligns with 2-entity Dataset parity; educational classifier signals for AI research indexing (HB328)");
  lines.push("- `FAQPage.about[]` added to both 2-entity and multi-entity comparison FAQ schemas — typed entity references linking FAQ answers to their subject entities; enables AI engines to attribute Q&A pairs without re-parsing parent Article; `faqSchema()` export updated with optional `about` param (HB328)");

  const body = lines.join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=7200",
      "X-Robots-Tag": "noindex",
      "Last-Modified": new Date().toUTCString(),
    },
  });
}
