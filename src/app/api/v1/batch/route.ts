import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// POST /api/v1/batch
//
// Batch comparison lookup — fetch multiple comparisons in a single request.
// Designed for AI agents doing multi-entity analysis, embedding index builds,
// and comparison matrices. Reduces N sequential API calls to 1.
//
// Request body (JSON):
//   { "slugs": ["iphone-16-vs-samsung-s25", "pixel-9-vs-iphone-16"] }
//   — OR —
//   { "slugs": ["..."], "fields": ["shortAnswer", "verdict", "entities"] }
//
// Query params (alternative to body):
//   ?slugs=iphone-16-vs-samsung-s25,pixel-9-vs-iphone-16
//   ?fields=shortAnswer,verdict,entities
//
// Limits:
//   - max 20 slugs per request
//   - fields filter: shortAnswer, verdict, keyDifferences, entities, attributes, faqs, category, title, slug
//
// Returns:
//   { total, found, missing, results: { [slug]: comparisonData | null } }
//   X-Summary header carries the first result's shortAnswer (if any).

export const dynamic = "force-dynamic";

const ALLOWED_FIELDS = new Set([
  "slug", "title", "shortAnswer", "verdict", "keyDifferences",
  "entities", "attributes", "faqs", "category", "metadata",
]);

const MAX_SLUGS = 20;

const BATCH_URL = `${SITE_URL}/api/v1/batch`;

const HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-Source-URL": BATCH_URL,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
  "X-Attribution": `${SITE_NAME} (${BATCH_URL})`,
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

function filterFields(obj: Record<string, unknown>, fields: string[] | null): Record<string, unknown> {
  if (!fields || fields.length === 0) return obj;
  return Object.fromEntries(
    fields.filter((f) => ALLOWED_FIELDS.has(f)).map((f) => [f, obj[f]])
  );
}

async function handleBatch(slugs: string[], fields: string[] | null) {
  if (slugs.length === 0) {
    return NextResponse.json(
      { error: "No slugs provided", example: { slugs: ["chatgpt-vs-claude", "gpt-4-vs-claude-3"] } },
      { status: 400, headers: HEADERS }
    );
  }

  if (slugs.length > MAX_SLUGS) {
    return NextResponse.json(
      { error: `Too many slugs. Maximum is ${MAX_SLUGS} per request.`, provided: slugs.length },
      { status: 400, headers: HEADERS }
    );
  }

  // Fetch all comparisons in parallel
  const results = await Promise.all(
    slugs.map(async (slug) => {
      try {
        const comparison = await getComparisonBySlug(slug.trim());
        if (!comparison) return { slug, data: null };
        const raw = comparison as unknown as Record<string, unknown>;
        raw.slug = slug;
        raw.comparisonUrl = `${SITE_URL}/compare/${slug}`;
        raw.answerUrl = `${SITE_URL}/api/answer/${slug}`;
        raw.knowledgeGraphUrl = `${SITE_URL}/api/knowledge-graph/${slug}`;
        raw.schemaJsonLdUrl = `${SITE_URL}/api/v1/schema/${slug}`;
        return { slug, data: filterFields(raw, fields) };
      } catch {
        return { slug, data: null };
      }
    })
  );

  const found = results.filter((r) => r.data !== null).length;
  const missing = results.filter((r) => r.data === null).map((r) => r.slug);
  const resultMap = Object.fromEntries(results.map((r) => [r.slug, r.data]));

  const firstResult = results.find((r) => r.data !== null);
  const firstShortAnswer = firstResult?.data
    ? (firstResult.data as Record<string, unknown>).shortAnswer as string | undefined
    : undefined;

  // ItemList JSON-LD — gives AI crawlers a typed list of the fetched comparisons
  // with WebPage-typed items so each node has @id and inLanguage signal.
  const foundResults = results.filter((r) => r.data !== null);
  const itemListSchema = foundResults.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BATCH_URL}#list`,
    name: `Batch comparison results from ${SITE_NAME}`,
    inLanguage: "en-US",
    numberOfItems: foundResults.length,
    itemListElement: foundResults.map((r, i) => {
      const itemUrl = `${SITE_URL}/compare/${r.slug}`;
      const title = (r.data as Record<string, unknown>).title as string | undefined;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: title ?? r.slug,
        item: { "@type": "WebPage", "@id": itemUrl, name: title ?? r.slug, url: itemUrl },
      };
    }),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    license: "https://creativecommons.org/licenses/by/4.0/",
  } : undefined;

  return NextResponse.json(
    { total: slugs.length, found, missing, results: resultMap, ...(itemListSchema ? { itemListSchema } : {}) },
    {
      headers: {
        ...HEADERS,
        ...(firstShortAnswer ? { "X-Summary": firstShortAnswer.slice(0, 500) } : {}),
      },
    }
  );
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const slugParam = searchParams.get("slugs") ?? "";
  const fieldsParam = searchParams.get("fields") ?? "";

  const slugs = slugParam.split(",").map((s) => s.trim()).filter(Boolean);
  const fields = fieldsParam ? fieldsParam.split(",").map((f) => f.trim()).filter(Boolean) : null;

  return handleBatch(slugs, fields);
}

export async function POST(request: NextRequest) {
  let body: { slugs?: unknown; fields?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400, headers: HEADERS });
  }

  if (!Array.isArray(body.slugs)) {
    return NextResponse.json(
      { error: "Request body must include 'slugs' array", example: { slugs: ["chatgpt-vs-claude"] } },
      { status: 400, headers: HEADERS }
    );
  }

  const slugs = (body.slugs as unknown[]).map(String).filter(Boolean);
  const fields = Array.isArray(body.fields) ? (body.fields as unknown[]).map(String) : null;

  return handleBatch(slugs, fields);
}
