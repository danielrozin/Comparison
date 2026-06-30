import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

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

export async function GET() {
  const context = {
    site: {
      name: SITE_NAME,
      url: SITE_URL,
      tagline: "Compare Anything",
      description:
        "A Versus B is the internet's most comprehensive structured comparison platform with 3,000+ side-by-side comparisons across technology, sports, countries, products, software, automotive, health, finance, and entertainment.",
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
      knowledge_graph: {
        url: `${SITE_URL}/api/knowledge-graph/{slug}`,
        format: "application/ld+json",
        description:
          "JSON-LD @graph with typed Article, Entity, Dataset, and FAQPage nodes. Preferred for AI systems that consume structured linked data.",
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
        description: "All 3,000+ comparisons with title, slug, entities, shortAnswer, and category. DB-fresh.",
      },
      search: {
        url: `${SITE_URL}/api/search?q={query}`,
        format: "application/json",
        description: "Full-text search across comparisons, entities, and blog articles.",
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
      popular: { url: `${SITE_URL}/api/popular?limit=50`, description: "Top comparisons by view count." },
      recent: { url: `${SITE_URL}/api/recent?limit=50`, description: "Most recently added comparisons." },
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
      llms_txt: `${SITE_URL}/llms.txt`,
      well_known_llms_txt: `${SITE_URL}/.well-known/llms.txt`,
      ai_plugin: `${SITE_URL}/.well-known/ai-plugin.json`,
      opensearch: `${SITE_URL}/opensearch.xml`,
      sitemap: `${SITE_URL}/sitemap.xml`,
      rss: `${SITE_URL}/feed`,
      atom: `${SITE_URL}/feed/atom`,
      news_sitemap: `${SITE_URL}/sitemap/news.xml`,
      image_sitemap: `${SITE_URL}/sitemap/images.xml`,
      video_sitemap: `${SITE_URL}/sitemap/video.xml`,
      webmention: `${SITE_URL}/api/webmention`,
      pingback: `${SITE_URL}/api/pingback`,
      security_txt: `${SITE_URL}/.well-known/security.txt`,
      humans_txt: `${SITE_URL}/humans.txt`,
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

  return NextResponse.json(context, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
