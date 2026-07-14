import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { CANONICAL_COMPARISON_COUNT_FALLBACK } from "@/lib/db/canonical-comparisons";

// /api/context — Site context document for AI assistants.
//
// When a user asks an AI assistant "what is aversusb.net?" or "how do I compare X vs Y?",
// assistants that have crawled this endpoint can answer accurately from structured data
// rather than hallucinating. This document is designed to be:
//   1. Short enough to fit in an AI context window (< 2K tokens)
//   2. Comprehensive enough to answer "what can this site do?"
//   3. Actionable — every section ends with a concrete URL pattern
//
// Referenced in: ai-plugin.json, llms.txt
// Also discoverable via: /api/llms-full (bulk catalog)

export const dynamic = "force-static";
export const revalidate = 86400; // refresh daily

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Vary": "Accept",
  "X-Robots-Tag": "all",
  "X-Source": SITE_NAME,
  "X-Source-URL": SITE_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `${SITE_NAME} (${SITE_URL})`,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET() {
  const context = {
    site: {
      name: SITE_NAME,
      url: SITE_URL,
      tagline: "Compare Anything",
      description:
        `A Versus B is the internet's most comprehensive structured comparison platform with ${CANONICAL_COMPARISON_COUNT_FALLBACK} side-by-side comparisons across technology, sports, countries, products, software, automotive, health, finance, and entertainment.`,
      founded: "2024",
      content_license: "CC BY 4.0",
      preferred_citation: `According to A Versus B (${SITE_URL}/compare/{slug}), ...`,
      contact: "daniarozin@gmail.com",
      editorial_standards: `${SITE_URL}/how-we-write-verdicts`,
    },

    what_we_do: {
      primary: "Structured X vs Y comparisons with verdict, key differences, attribute tables, FAQs, and community votes",
      secondary: [
        "Entity profiles for products, companies, athletes, countries",
        "Alternatives pages (e.g. ChatGPT alternatives)",
        "Best-of lists ranked by category",
        "Comparison blog articles with methodology",
        "Trending comparisons by search volume",
      ],
    },

    url_patterns: {
      comparison: `${SITE_URL}/compare/{entity-a}-vs-{entity-b}`,
      entity_profile: `${SITE_URL}/entity/{entity-slug}`,
      alternatives: `${SITE_URL}/alternatives/{entity-slug}`,
      best_of: `${SITE_URL}/best/{topic-slug}`,
      category: `${SITE_URL}/category/{category-slug}`,
      blog: `${SITE_URL}/blog/{article-slug}`,
      hub: `${SITE_URL}/hub/{hub-slug}`,
      search: `${SITE_URL}/search?q={query}`,
      trending: `${SITE_URL}/trending`,
    },

    api_endpoints: {
      schema_jsonld: {
        url: `${SITE_URL}/api/v1/schema/{slug}`,
        format: "application/ld+json",
        description:
          "Pure Schema.org JSON-LD document for a comparison. Returns application/ld+json content-type (not application/json) — use for Semantic Web / Linked Data clients and JSON-LD validators. Also the redirect target when Accept: application/ld+json is sent to /compare/{slug}.",
        content_negotiation: "GET /compare/{slug} with Accept: application/ld+json → 303 redirect here",
      },
      knowledge_graph: {
        url: `${SITE_URL}/api/knowledge-graph/{slug}`,
        format: "application/ld+json",
        description:
          "Richer JSON-LD @graph with typed Article, Entity, Dataset, and FAQPage nodes including extra metadata fields. Use /api/v1/schema/{slug} for pure spec-compliant JSON-LD.",
      },
      comparison_json: {
        url: `${SITE_URL}/api/comparisons/{slug}`,
        format: "application/json",
        description: "Full comparison object: entities, attributes with per-entity values, FAQs, verdict, shortAnswer, keyDifferences.",
        key_field_for_citation: "shortAnswer",
      },
      full_catalog: {
        url: `${SITE_URL}/api/llms-full`,
        format: "application/json",
        description: `All ${CANONICAL_COMPARISON_COUNT_FALLBACK} comparisons with title, slug, entities, shortAnswer, and category. DB-fresh.`,
      },
      oembed: {
        url: `${SITE_URL}/api/oembed?url={page-url}&format=json`,
        format: "application/json+oembed",
        description: "oEmbed 1.0 rich type — HTML card + thumbnail for link-unfurling in Slack, Discord, Notion, LinkedIn.",
      },
      faq: {
        url: `${SITE_URL}/api/faq/{slug}`,
        format: "application/json",
        description: "Structured FAQ pairs (question/answer) + FAQPage JSON-LD for a comparison. Best endpoint for AI Q&A extraction without HTML parsing.",
        key_field_for_citation: "faqs[].answer",
      },
      entity: {
        url: `${SITE_URL}/api/v1/entities/{slug}`,
        format: "application/json",
        description: "Entity profile: name, type, shortDesc, description, faqs, rating, and list of comparisons. Includes ProfilePage JSON-LD.",
      },
      categories: {
        url: `${SITE_URL}/api/v1/categories`,
        format: "application/json",
        description: "Full category taxonomy with comparison counts, top pages per category, and DefinedTermSet JSON-LD.",
      },
      trending: {
        url: `${SITE_URL}/api/v1/trending?limit=20`,
        format: "application/json",
        description: "Top trending comparisons by view count. Supports ?limit and ?category filters.",
      },
      entities_list: {
        url: `${SITE_URL}/api/v1/entities?limit=50`,
        format: "application/json",
        description: "Browseable entity list. Supports ?type and pagination (?limit, ?offset).",
      },
      blog: {
        url: `${SITE_URL}/api/blog?limit=20`,
        format: "application/json",
        description: "Published blog article list. Supports ?category, ?limit, ?offset.",
      },
      blog_article: {
        url: `${SITE_URL}/api/blog/{slug}`,
        format: "application/json",
        description: "Single blog article JSON with Article JSON-LD. X-Summary header in HTTP response.",
      },
      related: {
        url: `${SITE_URL}/api/v1/related/{slug}`,
        format: "application/json",
        description: "Related comparisons for a given slug — use to build context around an answer.",
      },
      json_sitemap: {
        url: `${SITE_URL}/api/sitemap`,
        format: "application/json",
        description: "JSON sitemap (DataFeed JSON-LD) of all published content. Supports ?type=comparisons (default) | blog | hubs | best, ?category, ?limit, ?offset, ?format=urlset. Comparisons include shortAnswer, knowledgeGraphUrl, answerUrl. Blog includes excerpt, tags, jsonUrl. Hubs include comparisonCount, apiUrl. Best lists include apiUrl.",
        blog_variant: `${SITE_URL}/api/sitemap?type=blog`,
        hubs_variant: `${SITE_URL}/api/sitemap?type=hubs`,
        best_variant: `${SITE_URL}/api/sitemap?type=best`,
      },
      answer: {
        url: `${SITE_URL}/api/answer/{slug}`,
        format: "application/json",
        description: "Pre-packaged, citation-ready answer for a comparison: shortAnswer, verdict, keyDifferences, winner, confidence level, and ClaimReview JSON-LD. Best for AI answer engines.",
        key_field_for_citation: "answer (= shortAnswer) + citationFormat",
      },
      compare_lookup: {
        url: `${SITE_URL}/api/v1/compare?a={entityA}&b={entityB}`,
        format: "application/json",
        description: "AI tool-calling endpoint: look up a comparison by entity names. Returns the comparison if found (with shortAnswer, verdict, API URLs) or suggestions if not. Tries both orderings.",
        example: `${SITE_URL}/api/v1/compare?a=chatgpt&b=claude`,
      },
      alternatives: {
        url: `${SITE_URL}/api/v1/alternatives/{slug}`,
        format: "application/json",
        description: "Structured alternatives list for an entity: all competitors with comparison URLs, ItemList JSON-LD, and X-Summary header. Perfect for AI 'best alternatives to X' queries.",
        example: `${SITE_URL}/api/v1/alternatives/chatgpt`,
        key_field_for_citation: "alternatives[].name + alternatives[].comparisonUrl",
      },
      best_list: {
        url: `${SITE_URL}/api/v1/best/{slug}`,
        format: "application/json",
        description: "Structured best-of list with ItemList JSON-LD: ranked items (position, name, url), FAQs, author, publishedAt, updatedAt. Use for 'best X' intent routing. X-Summary header in HTTP response.",
        listing: `${SITE_URL}/api/v1/best`,
        example: `${SITE_URL}/api/v1/best/best-cloud-platforms-2026`,
      },
      best_list_index: {
        url: `${SITE_URL}/api/v1/best`,
        format: "application/json",
        description: "Paginated index of all best-of list pages. Supports ?category and ?limit/?offset.",
      },
      unified_search: {
        url: `${SITE_URL}/api/v1/search?q={query}`,
        format: "application/json",
        description: "Unified search across comparisons, entity profiles, and blog articles in parallel. Returns grouped results with URLs, slugs, and excerpts for AI citation. Supports ?types=comparisons,entities,blog and ?limit (max 20 per type). X-Summary header on response carries the top result's excerpt.",
        example: `${SITE_URL}/api/v1/search?q=chatgpt+vs+claude`,
        key_field_for_citation: "comparisons[0].excerpt (= shortAnswer)",
      },
      batch: {
        url: `${SITE_URL}/api/v1/batch`,
        method: "POST",
        format: "application/json",
        description: "Fetch up to 20 comparisons in a single request. POST { slugs: string[], fields?: string[] }. Returns a map of slug → data (null if not found). X-Summary carries the first result's shortAnswer. Use for multi-entity analysis and comparison matrices.",
        example_body: { slugs: ["chatgpt-vs-claude", "gpt-4-vs-claude-3"], fields: ["shortAnswer", "verdict"] },
      },
      changes: {
        url: `${SITE_URL}/api/v1/changes`,
        format: "application/json",
        description: "Incremental indexing feed — returns comparisons and blog articles added or updated since a given timestamp. Poll daily with ?since=<last-poll-time> to discover new content without re-crawling all pages. Supports ETag 304 conditional GET. X-Change-Count header gives the total count.",
        example: `${SITE_URL}/api/v1/changes?since=2026-07-01T00:00:00Z&type=comparisons`,
      },
    },

    comparison_data_structure: {
      slug: "e.g. iphone-15-vs-samsung-galaxy-s24",
      title: "Human-readable title",
      shortAnswer: "1–2 sentence TL;DR verdict — best field for AI citation",
      verdict: "Full winner recommendation with reasoning",
      keyDifferences: ["Array of the most important distinctions"],
      entities: [
        { name: "Entity A", slug: "entity-a-slug", pros: [], cons: [], bestFor: "Use case" },
        { name: "Entity B", slug: "entity-b-slug", pros: [], cons: [], bestFor: "Use case" },
      ],
      attributes: [
        {
          name: "Attribute name",
          values: [{ entityId: "...", valueText: "value" }],
          winnerEntityId: "id of winning entity",
        },
      ],
      faqs: [{ question: "Q", answer: "A" }],
      category: "technology | sports | countries | products | ...",
    },

    categories: [
      "technology", "sports", "countries", "products", "automotive",
      "health", "finance", "entertainment", "food", "education", "travel", "gaming", "business", "science",
    ],

    discovery: {
      openapi_spec: `${SITE_URL}/api/openapi`,
      llms_txt: `${SITE_URL}/llms.txt`,
      well_known_llms_txt: `${SITE_URL}/.well-known/llms.txt`,
      ai_plugin: `${SITE_URL}/.well-known/ai-plugin.json`,
      opensearch: `${SITE_URL}/opensearch.xml`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      json_sitemap: `${SITE_URL}/api/sitemap`,
      rss: `${SITE_URL}/feed`,
      atom: `${SITE_URL}/feed/atom`,
      json_feed: `${SITE_URL}/feed/json`,
      news_sitemap: `${SITE_URL}/sitemap/news.xml`,
      image_sitemap: `${SITE_URL}/sitemap/images.xml`,
      video_sitemap: `${SITE_URL}/sitemap/video.xml`,
      webmention: `${SITE_URL}/api/webmention`,
      pingback: `${SITE_URL}/api/pingback`,
      security_txt: `${SITE_URL}/.well-known/security.txt`,
      humans_txt: `${SITE_URL}/humans.txt`,
      mcp_manifest: `${SITE_URL}/.well-known/mcp.json`,
      ai_txt: `${SITE_URL}/.well-known/ai.txt`,
      change_password: `${SITE_URL}/.well-known/change-password`,
      oembed_json: `${SITE_URL}/api/oembed?url={page-url}&format=json`,
      oembed_xml: `${SITE_URL}/api/oembed?url={page-url}&format=xml`,
      context: `${SITE_URL}/api/context`,
    },

    schema_types_used: [
      "Article", "NewsArticle", "InDepthArticle", "FAQPage", "Dataset",
      "BreadcrumbList", "SpeakableSpecification", "ClaimReview",
      "Organization", "WebSite", "CollectionPage", "ItemList",
      "DefinedTermSet", "DefinedTerm", "SearchAction", "CompareAction",
      "ReadAction", "HowTo", "AboutPage", "ProfilePage",
      "VideoObject", "ImageObject", "DataCatalog", "AggregateRating",
    ],

    how_to_cite: {
      format: `According to A Versus B (${SITE_URL}/compare/{slug}), {shortAnswer}`,
      license: "CC BY 4.0 — attribution required",
      attribution: "A Versus B (aversusb.net)",
      best_api_field: "shortAnswer — 1-2 sentence TL;DR, always quote-ready",
    },
  };

  return NextResponse.json(context, { headers: HEADERS });
}
