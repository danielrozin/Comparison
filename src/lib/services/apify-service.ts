/**
 * Apify Service — Competitor scraping and content gap analysis.
 *
 * Provides two scraping modes:
 *   1. Apify actor-based (requires APIFY_API_TOKEN and credits)
 *   2. Simple fetch-based (free, works for public sitemaps)
 *
 * Uses Redis (optional) to persist run metadata and content gaps.
 */

import { getRedis } from "@/lib/services/redis";
import { searchComparisons } from "@/lib/services/comparison-service";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ScrapedComparison {
  url: string;
  title: string;
  entityA: string | null;
  entityB: string | null;
  category: string | null;
  domain: string;
}

interface ApifyRunResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

interface ApifyRunStatusResponse {
  data: {
    id: string;
    status: string;
    defaultDatasetId: string;
  };
}

// ---------------------------------------------------------------------------
// Competitor URL patterns
// ---------------------------------------------------------------------------

const COMPETITOR_PATTERNS: Record<
  string,
  { urlPattern: RegExp; parseEntities: (path: string) => { a: string; b: string } | null }
> = {
  "versus.com": {
    urlPattern: /\/en\/([a-z0-9_-]+)-vs-([a-z0-9_-]+)/i,
    parseEntities(path: string) {
      const m = path.match(this.urlPattern);
      if (!m) return null;
      return { a: m[1].replace(/-/g, " "), b: m[2].replace(/-/g, " ") };
    },
  },
  "diffen.com": {
    urlPattern: /\/([A-Za-z0-9_-]+)-vs-([A-Za-z0-9_-]+)/i,
    parseEntities(path: string) {
      const m = path.match(this.urlPattern);
      if (!m) return null;
      return { a: m[1].replace(/-/g, " "), b: m[2].replace(/-/g, " ") };
    },
  },
  "g2.com": {
    urlPattern: /\/compare\/([a-z0-9_-]+)-vs-([a-z0-9_-]+)/i,
    parseEntities(path: string) {
      const m = path.match(this.urlPattern);
      if (!m) return null;
      return { a: m[1].replace(/-/g, " "), b: m[2].replace(/-/g, " ") };
    },
  },
};

function getDomainKey(domain: string): string | null {
  const d = domain.replace(/^www\./, "").toLowerCase();
  for (const key of Object.keys(COMPETITOR_PATTERNS)) {
    if (d.includes(key)) return key;
  }
  return null;
}

function parseComparisonUrl(
  url: string,
  domain: string
): { entityA: string; entityB: string } | null {
  const key = getDomainKey(domain);
  if (!key) return null;
  try {
    const path = new URL(url).pathname;
    return COMPETITOR_PATTERNS[key].parseEntities(path)
      ? { entityA: COMPETITOR_PATTERNS[key].parseEntities(path)!.a, entityB: COMPETITOR_PATTERNS[key].parseEntities(path)!.b }
      : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Apify helpers
// ---------------------------------------------------------------------------

const APIFY_BASE = "https://api.apify.com/v2";

function getToken(): string {
  const t = process.env.APIFY_API_TOKEN;
  if (!t) throw new Error("APIFY_API_TOKEN is not set");
  return t;
}

async function startApifyRun(
  domain: string,
  mode: "sitemap" | "listing"
): Promise<string> {
  const token = getToken();
  const actorId = "apify~cheerio-scraper";

  const startUrls =
    mode === "sitemap"
      ? [{ url: `https://${domain}/sitemap.xml` }]
      : [{ url: `https://${domain}` }];

  // Build a page function that extracts comparison links
  const pageFunction = `async function pageFunction(context) {
    const { $, request } = context;
    const results = [];
    $('a[href*="-vs-"], loc').each(function() {
      const href = $(this).attr('href') || $(this).text();
      if (href && href.includes('-vs-')) {
        results.push({
          url: href.startsWith('http') ? href : 'https://${domain}' + href,
          title: $(this).text().trim() || href,
        });
      }
    });
    // For sitemap XML, also extract <loc> tags
    $('loc').each(function() {
      const loc = $(this).text().trim();
      if (loc && loc.includes('-vs-')) {
        results.push({ url: loc, title: loc });
      }
    });
    return results;
  }`;

  const body = {
    startUrls,
    pageFunction,
    maxRequestsPerCrawl: 500,
    maxConcurrency: 5,
  };

  const res = await fetch(
    `${APIFY_BASE}/acts/${actorId}/runs?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify run failed (${res.status}): ${text}`);
  }

  const json = (await res.json()) as ApifyRunResponse;
  return json.data.id;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get Apify run status and optionally its dataset items.
 */
export async function getApifyRunStatus(
  runId: string
): Promise<{ status: string; items?: unknown[] }> {
  const token = getToken();

  const statusRes = await fetch(
    `${APIFY_BASE}/actor-runs/${runId}?token=${token}`
  );
  if (!statusRes.ok) {
    throw new Error(`Failed to get run status: ${statusRes.status}`);
  }
  const statusJson = (await statusRes.json()) as ApifyRunStatusResponse;
  const status = statusJson.data.status;

  if (status === "SUCCEEDED") {
    const datasetId = statusJson.data.defaultDatasetId;
    const itemsRes = await fetch(
      `${APIFY_BASE}/datasets/${datasetId}/items?token=${token}&format=json`
    );
    if (!itemsRes.ok) {
      throw new Error(`Failed to get dataset items: ${itemsRes.status}`);
    }
    const items = (await itemsRes.json()) as unknown[];
    return { status, items };
  }

  return { status };
}

/**
 * Scrape a competitor sitemap or listing page using Apify.
 * Polls until completion or timeout (default 5 min).
 */
export async function scrapeCompetitorSitemap(
  domain: string,
  mode: "sitemap" | "listing" = "sitemap",
  timeoutMs: number = 300_000
): Promise<{ runId: string; comparisons: ScrapedComparison[] }> {
  const runId = await startApifyRun(domain, mode);

  // Store run in Redis
  const redis = getRedis();
  if (redis) {
    await redis.lpush(
      "scraper:runs",
      JSON.stringify({ runId, domain, mode, startedAt: Date.now() })
    );
  }

  // Poll for completion
  const startTime = Date.now();
  const pollIntervalMs = 10_000;

  while (Date.now() - startTime < timeoutMs) {
    const result = await getApifyRunStatus(runId);

    if (result.status === "SUCCEEDED" && result.items) {
      const comparisons = processApifyResults(result.items, domain);

      if (redis) {
        await redis.set(
          `scraper:results:${runId}`,
          JSON.stringify(comparisons),
          { ex: 86400 * 7 }
        );
      }

      return { runId, comparisons };
    }

    if (result.status === "FAILED" || result.status === "ABORTED" || result.status === "TIMED-OUT") {
      throw new Error(`Apify run ${runId} ended with status: ${result.status}`);
    }

    // Wait before next poll
    await new Promise((r) => setTimeout(r, pollIntervalMs));
  }

  throw new Error(`Apify run ${runId} timed out after ${timeoutMs}ms`);
}

/**
 * Start a scrape and return immediately (non-blocking).
 */
export async function startScrape(
  domain: string,
  mode: "sitemap" | "listing" = "sitemap"
): Promise<string> {
  const runId = await startApifyRun(domain, mode);

  const redis = getRedis();
  if (redis) {
    await redis.lpush(
      "scraper:runs",
      JSON.stringify({ runId, domain, mode, startedAt: Date.now() })
    );
  }

  return runId;
}

/**
 * Process raw Apify results into ScrapedComparison objects.
 */
function processApifyResults(
  items: unknown[],
  domain: string
): ScrapedComparison[] {
  const seen = new Set<string>();
  const comparisons: ScrapedComparison[] = [];

  for (const item of items) {
    // Items may be arrays (page function returns arrays) or objects
    const entries = Array.isArray(item) ? item : [item];
    for (const entry of entries) {
      const e = entry as Record<string, unknown>;
      const url = (e.url as string) || "";
      if (!url || seen.has(url)) continue;
      seen.add(url);

      const parsed = parseComparisonUrl(url, domain);
      if (!parsed) continue;

      comparisons.push({
        url,
        title: (e.title as string) || `${parsed.entityA} vs ${parsed.entityB}`,
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        category: null,
        domain,
      });
    }
  }

  return comparisons;
}

/**
 * Simple sitemap scraper — no Apify required.
 * Fetches sitemap.xml directly, parses comparison URLs.
 */
export async function scrapeSimple(
  domain: string
): Promise<ScrapedComparison[]> {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/$/, "");
  const sitemapUrls = [
    `https://${cleanDomain}/sitemap.xml`,
    `https://www.${cleanDomain}/sitemap.xml`,
  ];

  let xmlText = "";
  for (const sitemapUrl of sitemapUrls) {
    try {
      const res = await fetch(sitemapUrl, {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; AVersusB/1.0)" },
        signal: AbortSignal.timeout(15_000),
      });
      if (res.ok) {
        xmlText = await res.text();
        break;
      }
    } catch {
      // Try next URL
    }
  }

  if (!xmlText) {
    throw new Error(`Could not fetch sitemap from ${cleanDomain}`);
  }

  // Extract URLs from sitemap XML using regex (avoid XML parser dependency)
  const locRegex = /<loc>\s*(.*?)\s*<\/loc>/gi;
  const urls: string[] = [];
  let match: RegExpExecArray | null;
  while ((match = locRegex.exec(xmlText)) !== null) {
    urls.push(match[1]);
  }

  const seen = new Set<string>();
  const comparisons: ScrapedComparison[] = [];

  for (const url of urls) {
    if (!url.includes("-vs-") || seen.has(url)) continue;
    seen.add(url);

    const parsed = parseComparisonUrl(url, cleanDomain);
    if (!parsed) continue;

    comparisons.push({
      url,
      title: `${parsed.entityA} vs ${parsed.entityB}`,
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      category: null,
      domain: cleanDomain,
    });
  }

  return comparisons;
}

/**
 * Find content gaps — comparisons that competitors have but we don't.
 */
export async function findContentGaps(
  scrapedComparisons: ScrapedComparison[]
): Promise<ScrapedComparison[]> {
  const gaps: ScrapedComparison[] = [];

  for (const comp of scrapedComparisons) {
    if (!comp.entityA || !comp.entityB) continue;

    // Build a slug-style query
    const query = `${comp.entityA} vs ${comp.entityB}`;
    try {
      const existing = await searchComparisons(query, 1);
      if (existing.length === 0) {
        gaps.push(comp);
      }
    } catch {
      // If search fails, assume it's a gap
      gaps.push(comp);
    }
  }

  // Store gaps in Redis
  const redis = getRedis();
  if (redis && gaps.length > 0) {
    await redis.set("scraper:gaps", JSON.stringify(gaps), { ex: 86400 * 7 });
  }

  return gaps;
}
