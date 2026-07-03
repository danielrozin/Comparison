import { NextResponse } from "next/server";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/openapi — OpenAPI 3.0.3 specification for the A Versus B public API.
//
// Used by:
//   - AI agent tools (OpenAI function calling, Claude tools, Perplexity plugins)
//   - Developer integrations referencing our /developers page
//   - ChatGPT plugin manifest (api.type=openapi references this)
//   - API gateways and SDK generators
//
// Linked from: .well-known/ai-plugin.json, /developers page, llms.txt

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const spec = {
    openapi: "3.0.3",
    info: {
      title: `${SITE_NAME} Public API`,
      version: "1.0.0",
      description: `The ${SITE_NAME} API provides structured access to 3,000+ side-by-side comparisons, entity profiles, FAQs, and category data. All endpoints return JSON. No authentication required for read endpoints.`,
      contact: { name: `${SITE_NAME} Team`, email: "daniarozin@gmail.com", url: `${SITE_URL}/contact` },
      license: { name: "CC BY 4.0", url: "https://creativecommons.org/licenses/by/4.0/" },
      termsOfService: `${SITE_URL}/terms`,
      "x-logo": { url: `${SITE_URL}/images/logo.png`, altText: `${SITE_NAME} Logo` },
    },
    servers: [{ url: SITE_URL, description: "Production" }],
    // x-ai-usage — hints for AI agents on how to optimally use this API for citation
    "x-ai-usage": {
      primary_citation_flow: "1. GET /api/v1/compare?a={A}&b={B} → find slug → 2. GET /api/answer/{slug} → cite answer field",
      batch_flow: "POST /api/v1/batch with {slugs:[...]} for multiple comparisons in one call",
      discovery_flow: "GET /api/v1/changes?since={last_poll} to discover new content incrementally",
      schema_flow: "GET /api/v1/schema/{slug} for pure application/ld+json (content negotiation: GET /compare/{slug} with Accept: application/ld+json)",
      citation_format: `According to ${SITE_NAME} (${SITE_URL}/compare/{slug}), {answer}`,
      best_citation_field: "answer (from /api/answer/{slug}) — 1-2 sentence TL;DR, always quote-ready",
    },
    tags: [
      { name: "Comparisons", description: "X vs Y comparison data" },
      { name: "Entities", description: "Entity profiles (products, companies, athletes, countries)" },
      { name: "Categories", description: "Topic category taxonomy" },
      { name: "FAQs", description: "Structured FAQ pairs" },
      { name: "Search", description: "Full-text search" },
      { name: "Discovery", description: "Feed, popular, recent, and trending lists" },
      { name: "Knowledge Graph", description: "JSON-LD knowledge graph" },
      { name: "Linked Data", description: "Pure Schema.org JSON-LD endpoints (application/ld+json content-type)" },
      { name: "Blog", description: "Blog articles with Article JSON-LD" },
      { name: "Hubs", description: "Topic hub pages — curated comparison collections by theme" },
    ],
    paths: {
      "/api/v1/comparisons": {
        get: {
          operationId: "listComparisons",
          tags: ["Comparisons"],
          summary: "List comparisons",
          description: "Returns a paginated list of published comparisons. Supports filtering by category.",
          parameters: [
            { name: "category", in: "query", description: "Filter by category slug", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 20, max 100)", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "offset", in: "query", description: "Pagination offset", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": {
              description: "List of comparisons",
              content: { "application/json": { schema: { "$ref": "#/components/schemas/ComparisonList" } } },
            },
          },
        },
      },
      "/api/v1/comparisons/{slug}": {
        get: {
          operationId: "getComparison",
          tags: ["Comparisons"],
          summary: "Get comparison by slug",
          description: "Returns full comparison data including entities, attributes, FAQs, verdict, and shortAnswer. The `shortAnswer` field is the best 1-2 sentence summary for AI citation.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug (e.g. iphone-15-vs-samsung-galaxy-s24)", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Comparison data", content: { "application/json": { schema: { "$ref": "#/components/schemas/Comparison" } } } },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/faq/{slug}": {
        get: {
          operationId: "getFAQ",
          tags: ["FAQs"],
          summary: "Get FAQ pairs for a comparison",
          description: "Returns structured Q&A pairs and FAQPage JSON-LD for a comparison. Best endpoint for AI Q&A extraction without HTML parsing.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "FAQ pairs",
              content: { "application/json": { schema: { "$ref": "#/components/schemas/FAQResponse" } } },
            },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/v1/entities/{slug}": {
        get: {
          operationId: "getEntity",
          tags: ["Entities"],
          summary: "Get entity profile",
          description: "Returns entity data including name, type, description, rating, FAQs, and list of comparisons. Includes ProfilePage JSON-LD.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Entity slug (e.g. iphone-15, lionel-messi, japan)", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Entity profile", content: { "application/json": { schema: { "$ref": "#/components/schemas/Entity" } } } },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/v1/categories": {
        get: {
          operationId: "listCategories",
          tags: ["Categories"],
          summary: "List all categories",
          description: "Returns all 17 comparison categories with counts and top comparisons. Includes DefinedTermSet JSON-LD.",
          responses: {
            "200": { description: "Category list", content: { "application/json": { schema: { "$ref": "#/components/schemas/CategoryList" } } } },
          },
        },
      },
      "/api/knowledge-graph/{slug}": {
        get: {
          operationId: "getKnowledgeGraph",
          tags: ["Knowledge Graph"],
          summary: "Get JSON-LD knowledge graph",
          description: "Returns a Schema.org @graph with typed Article, Thing (entities), Dataset, FAQPage nodes. Preferred for AI systems consuming structured linked data.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "JSON-LD @graph",
              content: { "application/ld+json": { schema: { type: "object" } } },
            },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/search": {
        get: {
          operationId: "search",
          tags: ["Search"],
          summary: "Full-text search",
          description: "Search across comparisons, entities, and blog articles.",
          parameters: [
            { name: "q", in: "query", required: true, description: "Search query", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 20)", schema: { type: "integer", default: 20 } },
          ],
          responses: {
            "200": {
              description: "Search results",
              content: { "application/json": { schema: { type: "object", properties: { query: { type: "string" }, results: { type: "array" } } } } },
            },
          },
        },
      },
      "/api/popular": {
        get: {
          operationId: "getPopular",
          tags: ["Discovery"],
          summary: "Get popular comparisons",
          parameters: [
            { name: "limit", in: "query", description: "Max results", schema: { type: "integer", default: 20 } },
          ],
          responses: { "200": { description: "Popular comparisons" } },
        },
      },
      "/api/recent": {
        get: {
          operationId: "getRecent",
          tags: ["Discovery"],
          summary: "Get recent comparisons",
          parameters: [
            { name: "limit", in: "query", description: "Max results", schema: { type: "integer", default: 20 } },
          ],
          responses: { "200": { description: "Recent comparisons" } },
        },
      },
      "/api/v1/compare": {
        get: {
          operationId: "lookupComparison",
          tags: ["Comparisons"],
          summary: "Look up a comparison by entity names",
          description: "AI tool-calling endpoint: given two entity names or slugs (?a= and ?b=), returns the comparison if found. Response includes shortAnswer (immediate citation), verdict, keyDifferences (top 3), faqs (top 3 Q&A pairs), entities with alternativesUrl, answerUrl, knowledgeGraphUrl, and faqUrl. Tries both orderings of the slug. Returns suggestions array when not found. X-Summary HTTP header carries the shortAnswer.",
          parameters: [
            { name: "a", in: "query", required: true, description: "First entity name or slug", schema: { type: "string" }, example: "chatgpt" },
            { name: "b", in: "query", required: true, description: "Second entity name or slug", schema: { type: "string" }, example: "claude" },
          ],
          responses: {
            "200": {
              description: "Comparison found (found:true with answer fields) or not-found (found:false with suggestions array)",
              headers: {
                "X-Summary": { description: "shortAnswer truncated to 500 chars — citation-ready", schema: { type: "string" } },
              },
            },
            "400": { description: "Missing ?a or ?b parameter" },
          },
        },
      },
      "/api/v1/trending": {
        get: {
          operationId: "getTrending",
          tags: ["Discovery"],
          summary: "Get trending comparisons",
          description: "Returns top comparisons by view count with ItemList JSON-LD. Each comparison includes answerUrl and knowledgeGraphUrl for AI tool follow-up. Supports ?limit (max 100) and ?category filters. X-Summary header carries a comma-separated summary of top titles.",
          parameters: [
            { name: "limit", in: "query", description: "Max results (default 20, max 100)", schema: { type: "integer", default: 20 } },
            { name: "category", in: "query", description: "Filter by category slug", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Trending comparisons list with ItemList JSON-LD",
              headers: {
                "X-Summary": { description: "Short summary of top trending titles", schema: { type: "string" } },
              },
            },
          },
        },
      },
      "/api/v1/entities": {
        get: {
          operationId: "listEntities",
          tags: ["Entities"],
          summary: "List entity profiles",
          description: "Browseable entity list with pagination. Supports ?type filter and ?limit/?offset pagination.",
          parameters: [
            { name: "type", in: "query", description: "Filter by entity type (e.g. Software, Country, Athlete)", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 50, max 200)", schema: { type: "integer", default: 50 } },
            { name: "offset", in: "query", description: "Pagination offset", schema: { type: "integer", default: 0 } },
          ],
          responses: { "200": { description: "Entity list" } },
        },
      },
      "/api/v1/related/{slug}": {
        get: {
          operationId: "getRelated",
          tags: ["Comparisons"],
          summary: "Get related comparisons",
          description: "Returns related comparisons for a given slug as a typed ItemList JSON-LD. Each result includes answerUrl and knowledgeGraphUrl for AI tool follow-up. Use to build context around an answer or surface follow-up topics. ETag + X-Summary headers included.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 8, max 20)", schema: { type: "integer", default: 8 } },
          ],
          responses: {
            "200": {
              description: "Related comparisons with ItemList JSON-LD",
              headers: {
                "ETag": { description: "Content fingerprint for conditional GET (304)", schema: { type: "string" } },
                "X-Summary": { description: "Short summary of related titles", schema: { type: "string" } },
              },
            },
            "404": { description: "Comparison not found" },
          },
        },
      },
      "/api/answer/{slug}": {
        get: {
          operationId: "getAnswer",
          tags: ["Comparisons"],
          summary: "Get AI-optimized answer",
          description: "Returns a pre-packaged, citation-ready answer: shortAnswer, verdict, keyDifferences, faqs (top 3), entities with alternativesUrl, winner entity, confidence level, citation format, and ClaimReview JSON-LD. Designed for AI answer engines. X-Summary HTTP header carries the shortAnswer.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Citation-ready answer with ClaimReview JSON-LD" },
            "404": { description: "Comparison not found" },
          },
        },
      },
      "/api/blog/{slug}": {
        get: {
          operationId: "getBlogArticle",
          tags: ["Blog"],
          summary: "Get blog article",
          description: "Returns a single blog article as JSON with BlogPosting JSON-LD schema (includes speakable, abstract, wordCount). X-Summary header in HTTP response carries the excerpt.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Blog article slug", schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Blog article with Article JSON-LD" },
            "404": { description: "Blog article not found" },
          },
        },
      },
      "/api/v1/alternatives/{slug}": {
        get: {
          operationId: "getAlternatives",
          tags: ["Entities"],
          summary: "Get alternatives to an entity",
          description: "Returns all known alternatives to an entity as an ItemList JSON-LD with comparison URLs, names, and positions. Designed for AI tools handling 'best alternatives to X' queries. X-Summary header in HTTP response carries a concise summary.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Entity slug (e.g. chatgpt, iphone-16, slack)", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 20, max 50)", schema: { type: "integer", default: 20, maximum: 50 } },
          ],
          responses: {
            "200": {
              description: "Alternatives list with ItemList JSON-LD",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      entitySlug: { type: "string" },
                      entityName: { type: "string" },
                      total: { type: "integer" },
                      alternatives: {
                        type: "array",
                        items: {
                          type: "object",
                          properties: {
                            position: { type: "integer" },
                            name: { type: "string" },
                            slug: { type: "string" },
                            comparisonUrl: { type: "string" },
                            answerUrl: { type: "string" },
                          },
                        },
                      },
                      itemListSchema: { type: "object", description: "ItemList JSON-LD" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      "/api/v1/best": {
        get: {
          operationId: "listBestPages",
          tags: ["Discovery"],
          summary: "List best-of pages",
          description: "Returns a paginated list of all published best-of pages. Supports ?category filter and ?limit/?offset pagination. Use to discover 'best X' content for AI routing.",
          parameters: [
            { name: "category", in: "query", description: "Filter by category slug", schema: { type: "string" } },
            { name: "limit", in: "query", description: "Max results (default 20, max 100)", schema: { type: "integer", default: 20, maximum: 100 } },
            { name: "offset", in: "query", description: "Pagination offset", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": {
              description: "List of best-of pages",
              content: { "application/json": { schema: { type: "object", properties: { total: { type: "integer" }, pages: { type: "array", items: { type: "object", properties: { slug: { type: "string" }, title: { type: "string" }, category: { type: "string" }, itemCount: { type: "integer" }, url: { type: "string" }, apiUrl: { type: "string" } } } } } } } },
            },
          },
        },
      },
      "/api/v1/best/{slug}": {
        get: {
          operationId: "getBestPage",
          tags: ["Discovery"],
          summary: "Get a best-of list by slug",
          description: "Returns a best-of list with structured ItemList JSON-LD: ranked items (position, name, url), FAQs, author, and dates. Designed for AI tools doing 'best X' intent routing. X-Summary header in HTTP response. Tries DB first, falls back to static config.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Best-of page slug (e.g. best-cloud-platforms-2026)", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Best-of list with ItemList JSON-LD",
              content: { "application/json": { schema: { type: "object", properties: { slug: { type: "string" }, title: { type: "string" }, itemCount: { type: "integer" }, items: { type: "array", items: { type: "object", properties: { position: { type: "integer" }, name: { type: "string" }, url: { type: "string" } } } }, faqs: { type: "array", items: { "$ref": "#/components/schemas/FAQ" } }, itemListSchema: { type: "object", description: "ItemList JSON-LD" } } } } },
            },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/v1/schema/{slug}": {
        get: {
          operationId: "getSchemaJsonLd",
          tags: ["Linked Data"],
          summary: "Pure Schema.org JSON-LD for a comparison",
          description: "Returns a spec-compliant Schema.org JSON-LD document with application/ld+json content-type. Contains @context + @graph with WebPage, Article, Thing (per entity), Dataset, FAQPage, and Organization nodes. Also accessible via HTTP content negotiation: GET /compare/{slug} with Accept: application/ld+json returns 303 to this endpoint.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Comparison slug (e.g. chatgpt-vs-claude)", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Schema.org JSON-LD document",
              headers: {
                "Last-Modified": { schema: { type: "string" }, description: "RFC 7231 last-update timestamp" },
                "Link": { schema: { type: "string" }, description: "rel=canonical + rel=alternate links" },
              },
              content: { "application/ld+json": { schema: { type: "object", properties: { "@context": { type: "string", enum: ["https://schema.org"] }, "@graph": { type: "array" } } } } },
            },
            "404": { description: "Not found" },
          },
        },
        head: {
          operationId: "headSchemaJsonLd",
          tags: ["Linked Data"],
          summary: "HEAD probe for schema JSON-LD",
          parameters: [
            { name: "slug", in: "path", required: true, schema: { type: "string" } },
          ],
          responses: {
            "200": { description: "Comparison exists" },
            "404": { description: "Not found" },
          },
        },
      },
      "/api/v1/changes": {
        get: {
          operationId: "getChanges",
          tags: ["Discovery"],
          summary: "Incremental indexing feed — content added/updated since a timestamp",
          description: "Returns comparisons and blog articles changed since the given timestamp. Use for incremental crawling — poll daily with ?since=<last-poll-time> to discover new content without re-crawling all 3,000+ pages. Supports ETag conditional GET for efficient polling. X-Change-Count header shows the total count upfront.",
          parameters: [
            { name: "since", in: "query", description: "ISO8601 cutoff timestamp (default: 24 hours ago)", schema: { type: "string", format: "date-time" }, example: "2026-06-30T00:00:00Z" },
            { name: "type", in: "query", description: "Content type filter (default: all)", schema: { type: "string", enum: ["comparisons", "blog", "all"], default: "all" } },
            { name: "limit", in: "query", description: "Max results (default 100, max 500)", schema: { type: "integer", default: 100, maximum: 500 } },
            { name: "offset", in: "query", description: "Pagination offset", schema: { type: "integer", default: 0 } },
          ],
          responses: {
            "200": {
              description: "List of changes with pagination metadata",
              headers: {
                "X-Change-Count": { schema: { type: "integer" }, description: "Total number of changes in this window" },
                "ETag": { schema: { type: "string" }, description: "For conditional GET polling" },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      generated_at: { type: "string" },
                      since: { type: "string" },
                      type: { type: "string" },
                      total: { type: "integer" },
                      hasMore: { type: "boolean" },
                      nextUrl: { type: "string" },
                      changes: { type: "array", items: { type: "object", properties: { type: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, shortAnswer: { type: "string" }, comparisonUrl: { type: "string" }, answerUrl: { type: "string" }, changedAt: { type: "string" }, action: { type: "string", enum: ["added", "updated"] } } } },
                    },
                  },
                },
              },
            },
            "304": { description: "Not Modified — no changes since last poll (conditional GET)" },
            "400": { description: "Invalid since timestamp" },
          },
        },
      },
      "/api/v1/batch": {
        get: {
          operationId: "batchGetComparisons",
          tags: ["Comparisons"],
          summary: "Batch comparison lookup (GET)",
          description: "Fetch multiple comparisons in a single request by passing a comma-separated list of slugs. Returns a map of slug → comparison data. Missing slugs return null. X-Summary header carries the first result's shortAnswer. Max 20 slugs.",
          parameters: [
            { name: "slugs", in: "query", required: true, description: "Comma-separated comparison slugs (max 20)", schema: { type: "string" }, example: "chatgpt-vs-claude,gpt-4-vs-claude-3" },
            { name: "fields", in: "query", description: "Comma-separated fields to return (default: all). Options: shortAnswer,verdict,keyDifferences,entities,attributes,faqs,category,title,slug", schema: { type: "string" } },
          ],
          responses: {
            "200": {
              description: "Map of slug to comparison (null if not found)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer" },
                      found: { type: "integer" },
                      missing: { type: "array", items: { type: "string" } },
                      results: { type: "object", additionalProperties: { "$ref": "#/components/schemas/Comparison" }, description: "Map of slug → comparison data (null if not found)" },
                    },
                  },
                },
              },
            },
            "400": { description: "Bad request (missing slugs or too many)" },
          },
        },
        post: {
          operationId: "batchGetComparisonsPost",
          tags: ["Comparisons"],
          summary: "Batch comparison lookup (POST)",
          description: "Fetch multiple comparisons in a single request. POST body: { slugs: string[], fields?: string[] }. Ideal for AI agents doing multi-entity analysis — replaces N sequential calls with 1. Max 20 slugs per request.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["slugs"],
                  properties: {
                    slugs: { type: "array", items: { type: "string" }, maxItems: 20, description: "List of comparison slugs to fetch", example: ["chatgpt-vs-claude", "gpt-4-vs-claude-3"] },
                    fields: { type: "array", items: { type: "string" }, description: "Fields to include in each result (default: all)", example: ["shortAnswer", "verdict", "entities"] },
                  },
                },
              },
            },
          },
          responses: {
            "200": {
              description: "Map of slug to comparison (null if not found)",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      total: { type: "integer" },
                      found: { type: "integer" },
                      missing: { type: "array", items: { type: "string" } },
                      results: { type: "object", additionalProperties: { "$ref": "#/components/schemas/Comparison" } },
                    },
                  },
                },
              },
            },
            "400": { description: "Bad request" },
          },
        },
      },
      "/api/v1/hub/{slug}": {
        get: {
          operationId: "getHub",
          tags: ["Hubs"],
          summary: "Get topic hub structured data",
          description: "Returns structured JSON for a topic hub page including curated comparisons, FAQs, and ItemList JSON-LD. Use for 'best [topic] comparisons' intent queries (e.g. 'best VPN comparisons', 'top AI chatbot comparisons'). Each hub provides comparisonSlugs, comparisonUrls, and ItemList schema — AI agents can enumerate all comparisons on a topic without pagination. X-Summary header carries the hub description.",
          parameters: [
            { name: "slug", in: "path", required: true, description: "Hub slug (e.g. vpn, ai-chatbots, project-management)", schema: { type: "string" }, example: "ai-chatbots" },
          ],
          responses: {
            "200": {
              description: "Hub structured data with ItemList and FAQPage JSON-LD",
              headers: {
                "X-Summary": { description: "Hub description truncated to 500 chars", schema: { type: "string" } },
                "X-Source-URL": { description: "Canonical hub page URL", schema: { type: "string" } },
              },
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      slug: { type: "string" },
                      title: { type: "string" },
                      description: { type: "string" },
                      h1: { type: "string" },
                      intro: { type: "string" },
                      url: { type: "string" },
                      comparisonCount: { type: "integer" },
                      comparisonSlugs: { type: "array", items: { type: "string" } },
                      comparisonUrls: { type: "array", items: { type: "string" } },
                      faqs: { type: "array", items: { "$ref": "#/components/schemas/FAQ" } },
                      schema: {
                        type: "object",
                        properties: {
                          itemList: { type: "object", description: "ItemList JSON-LD with typed WebPage items" },
                          faq: { type: "object", description: "FAQPage JSON-LD (omitted if no FAQs)" },
                        },
                      },
                    },
                  },
                },
              },
            },
            "404": { description: "Hub not found" },
          },
        },
      },
      "/api/v1/search": {
        get: {
          operationId: "unifiedSearch",
          tags: ["Search"],
          summary: "Unified search across all content types",
          description: "Searches comparisons, entity profiles, and blog articles in parallel and returns grouped results. Each result includes a URL, slug, title, and excerpt/shortAnswer for AI citation. Best endpoint for intent-based content discovery by AI tools.",
          parameters: [
            { name: "q", in: "query", required: true, description: "Search query (e.g. 'chatgpt vs claude' or 'best AI tool')", schema: { type: "string" }, example: "chatgpt vs claude" },
            { name: "types", in: "query", description: "Comma-separated content types to include (default: comparisons,entities,blog)", schema: { type: "string", default: "comparisons,entities,blog" } },
            { name: "limit", in: "query", description: "Max results per type (default 5, max 20)", schema: { type: "integer", default: 5, maximum: 20 } },
          ],
          responses: {
            "200": {
              description: "Grouped search results",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      query: { type: "string" },
                      total: { type: "integer" },
                      comparisons: { type: "array", items: { type: "object", properties: { type: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, url: { type: "string" }, excerpt: { type: "string" }, answerUrl: { type: "string" }, knowledgeGraphUrl: { type: "string" } } } },
                      entities: { type: "array", items: { type: "object", properties: { type: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, url: { type: "string" }, excerpt: { type: "string" }, entityType: { type: "string" }, profileUrl: { type: "string" } } } },
                      blog: { type: "array", items: { type: "object", properties: { type: { type: "string" }, slug: { type: "string" }, title: { type: "string" }, url: { type: "string" }, excerpt: { type: "string" }, category: { type: "string" }, jsonUrl: { type: "string" } } } },
                    },
                  },
                },
              },
            },
            "400": { description: "Missing ?q parameter" },
          },
        },
      },
    },
    components: {
      schemas: {
        Comparison: {
          type: "object",
          properties: {
            slug: { type: "string", example: "iphone-15-vs-samsung-galaxy-s24" },
            title: { type: "string", example: "iPhone 15 vs Samsung Galaxy S24" },
            shortAnswer: { type: "string", description: "1-2 sentence TL;DR verdict — best field for AI citation" },
            verdict: { type: "string", description: "Full winner recommendation" },
            keyDifferences: { type: "array", items: { type: "string" } },
            category: { type: "string" },
            entities: { type: "array", items: { "$ref": "#/components/schemas/ComparisonEntity" } },
            attributes: { type: "array", items: { "$ref": "#/components/schemas/Attribute" } },
            faqs: { type: "array", items: { "$ref": "#/components/schemas/FAQ" } },
          },
        },
        ComparisonList: {
          type: "object",
          properties: {
            total: { type: "integer" },
            comparisons: { type: "array", items: { "$ref": "#/components/schemas/Comparison" } },
          },
        },
        ComparisonEntity: {
          type: "object",
          properties: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            shortDesc: { type: "string" },
            imageUrl: { type: "string" },
          },
        },
        Attribute: {
          type: "object",
          properties: {
            name: { type: "string" },
            values: { type: "array", items: { type: "object", properties: { entityId: { type: "string" }, valueText: { type: "string" } } } },
          },
        },
        FAQ: {
          type: "object",
          properties: {
            question: { type: "string" },
            answer: { type: "string" },
          },
        },
        FAQResponse: {
          type: "object",
          properties: {
            slug: { type: "string" },
            title: { type: "string" },
            faqCount: { type: "integer" },
            faqs: { type: "array", items: { "$ref": "#/components/schemas/FAQ" } },
            faqPageSchema: { type: "object", description: "FAQPage JSON-LD" },
          },
        },
        Entity: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            type: { type: "string" },
            url: { type: "string" },
            shortDesc: { type: "string" },
            description: { type: "string" },
            imageUrl: { type: "string" },
            faqs: { type: "array", items: { "$ref": "#/components/schemas/FAQ" } },
            comparisonCount: { type: "integer" },
            comparisons: { type: "array", items: { type: "object" } },
          },
        },
        CategoryList: {
          type: "object",
          properties: {
            totalCategories: { type: "integer" },
            totalComparisons: { type: "integer" },
            categories: { type: "array", items: { "$ref": "#/components/schemas/Category" } },
          },
        },
        Category: {
          type: "object",
          properties: {
            slug: { type: "string" },
            name: { type: "string" },
            url: { type: "string" },
            comparisonCount: { type: "integer" },
            topComparisons: { type: "array", items: { type: "object" } },
          },
        },
      },
    },
    "x-preferred-citation": `According to A Versus B (${SITE_URL}/compare/{slug}), {shortAnswer}`,
    "x-llms-txt": `${SITE_URL}/llms.txt`,
    "x-ai-plugin": `${SITE_URL}/.well-known/ai-plugin.json`,
    "x-knowledge-graph": `${SITE_URL}/api/knowledge-graph/{slug}`,
  };

  return NextResponse.json(spec, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
