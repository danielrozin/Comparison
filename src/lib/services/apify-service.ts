/**
 * Apify Service — the one place the app calls api.apify.com.
 *
 * Every caller reads `APIFY_API_TOKEN` through `readApifyToken` and sends it
 * with `apifyFetch` as a Bearer header. The token is never put in the URL.
 *
 * Two kinds of work share that client:
 *   1. Competitor scraping (cheerio actor, async run + dataset poll) and a
 *      free sitemap fetch that does not call Apify.
 *   2. Synchronous actor runs (`runApifyActorSync`), used by web search and
 *      social discovery.
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

export const APIFY_API_BASE = "https://api.apify.com/v2";

/** The only reader of `APIFY_API_TOKEN`. Blank and whitespace-only values count as unset. */
export function readApifyToken(): string | null {
  const raw = process.env.APIFY_API_TOKEN;
  if (typeof raw !== "string") return null;
  const token = raw.trim();
  return token.length > 0 ? token : null;
}

export type ApifySyncFailure = "missing_token" | "timeout" | "network" | "http";

export type ApifySyncResult =
  | { ok: true; status: number; items: unknown[] }
  | { ok: false; status: number | null; items: []; failure: ApifySyncFailure };

export interface ApifySyncOptions {
  /** HTTP abort for this call. */
  timeoutMs?: number;
  /** Actor run query params. `timeout` is seconds, `memory` is megabytes. */
  query?: Record<string, string | number>;
}

/**
 * POST /acts/:actorId/run-sync-get-dataset-items.
 * A missing token does not call the network. Failures are returned, not thrown,
 * and the token is not included in any message.
 */
export async function runApifyActorSync(
  actorId: string,
  input: unknown,
  options?: ApifySyncOptions,
): Promise<ApifySyncResult> {
  if (!readApifyToken()) {
    return { ok: false, status: null, items: [], failure: "missing_token" };
  }

  const timeoutMs = options?.timeoutMs ?? 60_000;
  const endpoint = new URL(`${APIFY_API_BASE}/acts/${actorId}/run-sync-get-dataset-items`);
  for (const [key, value] of Object.entries(options?.query ?? {})) {
    endpoint.searchParams.set(key, String(value));
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await apifyFetch(endpoint.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: controller.signal,
    });
    if (!response.ok) {
      // A run the platform kills comes back as HTTP 400, not as a client abort:
      // {"error":{"type":"run-failed","message":"... status: TIMED-OUT."}}
      // That is a timeout. Other 400s (bad input, a FAILED run) stay http errors.
      const failure = (await apifySyncFailureFromError(response)) ?? "http";
      return { ok: false, status: response.status, items: [], failure };
    }
    const data: unknown = await response.json();
    if (!Array.isArray(data)) {
      return { ok: false, status: response.status, items: [], failure: "network" };
    }
    return { ok: true, status: response.status, items: data };
  } catch (error) {
    if (isAbortError(error)) {
      return { ok: false, status: null, items: [], failure: "timeout" };
    }
    return { ok: false, status: null, items: [], failure: "network" };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Authenticated request. Throws when the token is missing.
 * The token is sent only to `https://api.apify.com/`, never in the URL.
 */
export async function apifyFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const url = path.startsWith("http")
    ? path
    : `${APIFY_API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
  assertApifyHost(url);
  const token = readApifyToken();
  if (!token) throw new Error("APIFY_API_TOKEN is not set");
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body != null && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...init, headers });
}

function assertApifyHost(url: string): void {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("Refusing to send the Apify token to a non-Apify host");
  }
  if (parsed.protocol !== "https:" || parsed.hostname !== "api.apify.com") {
    throw new Error("Refusing to send the Apify token to a non-Apify host");
  }
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: unknown }).name;
  return name === "AbortError" || name === "TimeoutError";
}

/** Error bodies are small JSON. Ignore anything larger instead of logging it. */
const APIFY_ERROR_BODY_MAX_CHARS = 4_000;

/**
 * Read a failed sync response and return "timeout" when Apify says the run
 * was TIMED-OUT. Returns null for every other failure so the caller keeps
 * the HTTP status. The body is not logged: it can carry a run id.
 */
async function apifySyncFailureFromError(response: Response): Promise<ApifySyncFailure | null> {
  let text = "";
  try {
    text = await response.text();
  } catch {
    return null;
  }
  return isApifyRunTimedOut(text) ? "timeout" : null;
}

function isApifyRunTimedOut(text: string): boolean {
  const sample = text.slice(0, APIFY_ERROR_BODY_MAX_CHARS);
  let parsed: unknown;
  try {
    parsed = JSON.parse(sample);
  } catch {
    return false;
  }
  if (!parsed || typeof parsed !== "object") return false;
  const error = (parsed as { error?: unknown }).error;
  if (!error || typeof error !== "object") return false;
  const record = error as { message?: unknown; status?: unknown };
  if (typeof record.status === "string" && record.status.toUpperCase() === "TIMED-OUT") {
    return true;
  }
  return typeof record.message === "string" && /status:\s*TIMED-OUT\b/i.test(record.message);
}

async function startApifyRun(
  domain: string,
  mode: "sitemap" | "listing"
): Promise<string> {
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

  const res = await apifyFetch(`/acts/${actorId}/runs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

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
  const statusRes = await apifyFetch(`/actor-runs/${encodeURIComponent(runId)}`);
  if (!statusRes.ok) {
    throw new Error(`Failed to get run status: ${statusRes.status}`);
  }
  const statusJson = (await statusRes.json()) as ApifyRunStatusResponse;
  const status = statusJson.data.status;

  if (status === "SUCCEEDED") {
    const datasetId = statusJson.data.defaultDatasetId;
    const itemsRes = await apifyFetch(
      `/datasets/${encodeURIComponent(datasetId)}/items?format=json`,
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
