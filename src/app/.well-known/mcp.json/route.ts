import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// /.well-known/mcp.json — Model Context Protocol discovery manifest
//
// Some AI tools (Claude Code, Cursor, Copilot) look for this file to discover
// what MCP-compatible tools a site exposes. This manifest points to the
// primary data endpoints in a format MCP clients understand.
//
// Spec reference: https://modelcontextprotocol.io/

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const manifest = {
    name: SITE_NAME,
    description: "Structured comparison data platform — 3,000+ X vs Y comparisons across technology, sports, products, countries, software, and more.",
    version: "1.0.0",
    homepage: SITE_URL,
    openapi: `${SITE_URL}/api/openapi`,
    tools: [
      {
        name: "get_changes",
        description: "Get recently added or updated comparisons and blog articles since a given timestamp. Enables incremental indexing — poll daily with the last-poll timestamp to discover new content without re-crawling 3,000+ pages. Supports ETag conditional GET.",
        endpoint: `${SITE_URL}/api/v1/changes`,
        method: "GET",
        parameters: {
          since: { type: "string", required: false, description: "ISO8601 cutoff timestamp (default: 24 hours ago). e.g. 2026-06-30T00:00:00Z" },
          type: { type: "string", required: false, description: "Content type: comparisons | blog | all (default: all)" },
          limit: { type: "integer", required: false, description: "Max results (default 100, max 500)" },
          offset: { type: "integer", required: false, description: "Pagination offset" },
        },
        returns: "JSON: { generated_at, since, total, hasMore, nextUrl, changes[] }. X-Change-Count header carries total count.",
      },
      {
        name: "batch_get_comparisons",
        description: "Fetch multiple comparisons in a single request. Pass up to 20 slugs; returns a map of slug → comparison data. Ideal for comparison matrices and multi-entity analysis — replaces N sequential API calls with 1.",
        endpoint: `${SITE_URL}/api/v1/batch`,
        method: "POST",
        body: {
          slugs: { type: "array", items: { type: "string" }, maxItems: 20, required: true, description: "List of comparison slugs to fetch" },
          fields: { type: "array", items: { type: "string" }, required: false, description: "Fields to include: shortAnswer,verdict,keyDifferences,entities,attributes,faqs (default: all)" },
        },
        returns: "JSON: { total, found, missing[], results: { [slug]: comparisonData | null } }. X-Summary header carries the first result's shortAnswer.",
      },
      {
        name: "search_comparisons",
        description: "Search for comparisons, entities, and blog articles by query. Use for 'X vs Y', 'best alternatives to X', 'which is better' queries.",
        endpoint: `${SITE_URL}/api/v1/search`,
        method: "GET",
        parameters: {
          q: { type: "string", required: true, description: "Search query, e.g. 'chatgpt vs claude'" },
          types: { type: "string", required: false, description: "Comma-separated: comparisons,entities,blog (default: all)" },
          limit: { type: "integer", required: false, description: "Max results per type (default 5, max 20)" },
        },
        returns: "JSON: { query, total, comparisons[], entities[], blog[] }",
      },
      {
        name: "get_comparison",
        description: "Get full comparison data for a slug including verdict, shortAnswer, attributes, FAQs, and key differences.",
        endpoint: `${SITE_URL}/api/v1/comparisons/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Comparison slug, e.g. 'iphone-16-vs-samsung-galaxy-s25'" },
        },
        returns: "JSON with shortAnswer (best field for citation), verdict, keyDifferences, attributes, faqs",
      },
      {
        name: "get_answer",
        description: "Get a pre-packaged citation-ready answer for a comparison. Returns shortAnswer, verdict, winner, and ClaimReview JSON-LD.",
        endpoint: `${SITE_URL}/api/answer/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Comparison slug" },
        },
        returns: "JSON: { answer, verdict, winner, keyDifferences, confidence, source: { url, dateModified }, claimReviewJsonLd }",
      },
      {
        name: "lookup_compare",
        description: "Look up a comparison by entity names (no slug needed). Returns comparison or suggestions.",
        endpoint: `${SITE_URL}/api/v1/compare`,
        method: "GET",
        parameters: {
          a: { type: "string", required: true, description: "First entity name, e.g. 'ChatGPT'" },
          b: { type: "string", required: true, description: "Second entity name, e.g. 'Claude'" },
        },
        returns: "JSON: { found, comparison, answer, comparisonUrl, suggestions[] }",
      },
      {
        name: "get_alternatives",
        description: "Get all alternatives to a product/service with ranked list.",
        endpoint: `${SITE_URL}/api/v1/alternatives/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Entity slug, e.g. 'chatgpt'" },
        },
        returns: "JSON: { entity, alternatives[], itemListJsonLd }",
      },
      {
        name: "get_entity",
        description: "Get entity profile with stats, related comparisons, and FAQ.",
        endpoint: `${SITE_URL}/api/v1/entities/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Entity slug" },
        },
        returns: "JSON entity profile with ProfilePage JSON-LD",
      },
      {
        name: "get_faq",
        description: "Get structured FAQ pairs for a comparison.",
        endpoint: `${SITE_URL}/api/faq/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Comparison slug" },
        },
        returns: "JSON: { faqs: [ { question, answer } ] } with FAQPage JSON-LD",
      },
      {
        name: "get_schema_jsonld",
        description: "Get pure Schema.org JSON-LD for a comparison. Returns application/ld+json content-type — use for Semantic Web clients, JSON-LD Playground, RDF tools, and AI crawlers doing content negotiation. Also accessible via content negotiation: GET /compare/{slug} with Accept: application/ld+json.",
        endpoint: `${SITE_URL}/api/v1/schema/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Comparison slug, e.g. 'chatgpt-vs-claude'" },
        },
        returns: "application/ld+json: { @context, @graph: [WebPage, Article, Thing×N, Dataset, FAQPage, Organization] }",
      },
      {
        name: "get_knowledge_graph",
        description: "Get the rich JSON-LD @graph for a comparison with extra metadata fields (Article, Dataset, FAQPage, HowTo nodes). Use get_schema_jsonld for pure spec-compliant JSON-LD.",
        endpoint: `${SITE_URL}/api/knowledge-graph/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Comparison slug" },
        },
        returns: "application/ld+json @graph",
      },
      {
        name: "list_trending",
        description: "Get currently trending comparisons by search volume and recent engagement.",
        endpoint: `${SITE_URL}/api/v1/trending`,
        method: "GET",
        returns: "JSON: { trending[] } with ItemList JSON-LD",
      },
      {
        name: "get_best_list",
        description: "Get best-of ranked list for a topic.",
        endpoint: `${SITE_URL}/api/v1/best/{slug}`,
        method: "GET",
        parameters: {
          slug: { type: "string", required: true, description: "Topic slug, e.g. 'vpn'" },
        },
        returns: "JSON ranked list with ItemList JSON-LD",
      },
    ],
    resources: [
      {
        name: "full_catalog",
        description: "Complete catalog of all 3,000+ comparisons with slug, title, entities, shortAnswer, category.",
        url: `${SITE_URL}/api/llms-full`,
        format: "application/json",
      },
      {
        name: "llms_txt",
        description: "LLM-optimized site manifest with capabilities, URL patterns, and API documentation.",
        url: `${SITE_URL}/llms.txt`,
        format: "text/plain",
      },
      {
        name: "site_context",
        description: "Compact site context document for AI assistant system prompts.",
        url: `${SITE_URL}/api/context`,
        format: "application/json",
      },
      {
        name: "json_sitemap",
        description: "JSON sitemap of all pages for AI crawler enumeration.",
        url: `${SITE_URL}/api/sitemap`,
        format: "application/json",
      },
    ],
    preferred_citation: `According to A Versus B (${SITE_URL}/compare/{slug}), ...`,
    content_license: "CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/",
  };

  return NextResponse.json(manifest, {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "all",
    },
  });
}
