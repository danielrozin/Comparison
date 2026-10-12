/**
 * Web search for on-demand comparison generation and provisional promotion.
 *
 * Uses the Apify actor `apify/rag-web-browser` through the shared client in
 * `apify-service` (`runApifyActorSync`). That client reads `APIFY_API_TOKEN`
 * and sends it as a Bearer header.
 * Server-side only. Do not import this from a client component.
 *
 * Actor reference (checked against the current actor page):
 * https://apify.com/apify/rag-web-browser
 * Input: `query`, `maxResults` (default there is 3; we default to 5),
 * `outputFormats` (`markdown` | `text` | `html`), `requestTimeoutSecs`.
 * Each dataset item has `metadata.url`, `metadata.title`, and `markdown`.
 * A page that did not finish loading may only have `searchResult`.
 */

import { runApifyActorSync } from "@/lib/services/apify-service";

export interface WebSearchResult {
  url: string;
  title: string;
  content: string;
  score: number;
}

/**
 * Why a search never completed. `http` keeps the upstream status (401, 429, …)
 * so a quota or auth failure is not stored as "zero sources".
 */
export type WebSearchProviderError =
  | { type: "missing_key" }
  | { type: "timeout" }
  | { type: "network" }
  | { type: "http"; status: number };

/** A finished search. `ok` with an empty `results` means the actor had nothing. */
export type WebSearchOutcome =
  | { ok: true; results: WebSearchResult[] }
  | { ok: false; results: []; error: WebSearchProviderError };

export interface WebSearchOptions {
  /** Other callers keep a per-request warning. The promotion cron summarizes instead. */
  logFailures?: boolean;
  /**
   * Overrides the HTTP abort. The promote-provisional cron passes a longer
   * wait than on-demand generation, which still has to call the model.
   */
  timeoutMs?: number;
}

export interface EnrichmentResult {
  context: string;
  sources: WebSearchResult[];
  /**
   * Set when at least one of the searches failed at the provider.
   * Null when every search completed, including a search with zero hits.
   */
  providerError: string | null;
}

/** Name stored next to `search_provider_error:<code>` in logs. */
export const SEARCH_PROVIDER = "apify";

const RAG_WEB_BROWSER_ACTOR = "apify~rag-web-browser";

/**
 * HTTP abort for on-demand generation.
 *
 * Measured `rag-web-browser` runs often need 12–27s, but the generate route
 * `maxDuration` is 60s and the model call is capped at 45s. This search stays
 * at 17s so the route is not made longer. Promotion uses a separate budget.
 */
export const APIFY_SEARCH_TIMEOUT_MS = 17_000;

/**
 * HTTP abort for one promotion enrichment.
 *
 * The cron `maxDuration` is 120s. One enrichment fires three searches at
 * once, so this is the wait for the whole enrichment, not for one search.
 * 65s gives the actor a 60s run (successes were observed up to ~27s, and a
 * cold start needs room past that) and 5s for Apify to return the dataset
 * or the TIMED-OUT body before this client gives up. The cron only starts
 * another enrichment while the rest of the 120s can hold this wait.
 */
export const APIFY_PROMOTION_SEARCH_TIMEOUT_MS = 65_000;

/**
 * Run memory in MB (must be a power of two). An enrichment fires three
 * searches at once. 4 GB each stays under a typical account cap more easily
 * than the actor’s 8 GB browser setting. Plain HTML mode does not need the
 * larger browser pool.
 */
const ACTOR_MEMORY_MB = 4096;

/** Markdown is a whole page. Keep a paragraph, not the entire article. */
const MAX_SNIPPET_CHARS = 2_000;

const MAX_RESULTS_CAP = 10;

/** Token stored on promotion-failed reasons and the PostHog event. */
export function webSearchProviderErrorReason(error: WebSearchProviderError): string {
  const code = error.type === "http" ? String(error.status) : error.type;
  return `search_provider_error:${code}`;
}

/**
 * Search wrapper. Returns an empty array when the token is missing, the
 * search errors, or the actor has no hits. Callers that need to tell those
 * apart should use `searchWebDetailed`.
 */
export async function searchWeb(
  query: string,
  maxResults: number = 5,
  timeoutMs: number = APIFY_SEARCH_TIMEOUT_MS,
): Promise<WebSearchResult[]> {
  const outcome = await searchWebDetailed(query, maxResults, timeoutMs);
  return outcome.results;
}

/**
 * Same search as `searchWeb`, with an explicit outcome:
 * ok + hits, ok + zero hits, or a provider failure.
 */
export async function searchWebDetailed(
  query: string,
  maxResults: number = 5,
  timeoutMs: number = APIFY_SEARCH_TIMEOUT_MS,
  options?: WebSearchOptions,
): Promise<WebSearchOutcome> {
  const logFailures = options?.logFailures !== false;
  const waitMs = options?.timeoutMs ?? timeoutMs;
  const cappedResults = clampMaxResults(maxResults);
  const { requestTimeoutSecs, runTimeoutSecs } = actorBudgets(waitMs);

  const result = await runApifyActorSync(
    RAG_WEB_BROWSER_ACTOR,
    {
      query,
      maxResults: cappedResults,
      outputFormats: ["markdown"],
      // Plain HTML is about twice as fast as the headless browser. The
      // pages we cite (articles, specs, references) are mostly static.
      // https://apify.com/apify/rag-web-browser — "Scraping tool"
      scrapingTool: "raw-http",
      requestTimeoutSecs,
    },
    {
      timeoutMs: waitMs,
      query: { timeout: runTimeoutSecs, memory: ACTOR_MEMORY_MB },
    },
  );

  if (!result.ok) {
    if (result.failure === "missing_token") {
      logProviderFailure("missing_key", logFailures);
      return { ok: false, results: [], error: { type: "missing_key" } };
    }
    // A client abort and Apify's HTTP 400 `status: TIMED-OUT` both land here.
    // Either way the page has no finished search, so it must not be stored as
    // "zero sources" and must not count toward the promotion attempt cap.
    if (result.failure === "timeout") {
      logProviderFailure("timeout", logFailures);
      return { ok: false, results: [], error: { type: "timeout" } };
    }
    if (result.failure === "http" && result.status != null) {
      logProviderFailure(String(result.status), logFailures);
      return { ok: false, results: [], error: { type: "http", status: result.status } };
    }
    logProviderFailure("network", logFailures);
    return { ok: false, results: [], error: { type: "network" } };
  }

  const results = result.items
    .map((row) => mapRagItem(row))
    .filter((row): row is WebSearchResult => row !== null);
  return { ok: true, results };
}

/**
 * Searches for current facts about an entity and returns a condensed summary string.
 */
export async function enrichEntityData(entityName: string, entityType: string): Promise<string> {
  const query = `${entityName} ${entityType} latest specs features price 2026`;
  const results = await searchWeb(query, 3);

  if (results.length === 0) return "";

  const snippets = results
    .map((result) => result.content)
    .join(" ")
    .slice(0, 1500);

  return `[${entityName}]: ${snippets}`;
}

export async function enrichComparisonData(entityA: string, entityB: string): Promise<string>;
export async function enrichComparisonData(
  entityA: string,
  entityB: string,
  returnSources: true,
  options?: WebSearchOptions,
): Promise<EnrichmentResult>;
export async function enrichComparisonData(
  entityA: string,
  entityB: string,
  returnSources?: boolean,
  options?: WebSearchOptions,
): Promise<string | EnrichmentResult> {
  // Two facts plus a head-to-head. The three searches run together, so the
  // wait is one timeout, not three. The promotion cron turns per-request
  // logs off and writes one summary.
  const [comparisonOutcome, entityAOutcome, entityBOutcome] = await Promise.all([
    searchWebDetailed(`${entityA} vs ${entityB} comparison 2026`, 5, undefined, options),
    searchWebDetailed(`${entityA} latest features specs 2026`, 2, undefined, options),
    searchWebDetailed(`${entityB} latest features specs 2026`, 2, undefined, options),
  ]);
  const outcomes = [comparisonOutcome, entityAOutcome, entityBOutcome];
  const allResults = outcomes.flatMap((outcome) => outcome.results);
  const failed = outcomes.find(
    (outcome): outcome is Extract<WebSearchOutcome, { ok: false }> => !outcome.ok,
  );
  const providerError = failed ? webSearchProviderErrorReason(failed.error) : null;

  if (allResults.length === 0) {
    return returnSources ? { context: "", sources: [], providerError } : "";
  }

  const parts: string[] = [];
  let wordCount = 0;
  const MAX_WORDS = 500;

  for (const result of allResults) {
    const snippet = result.content.trim();
    const words = snippet.split(/\s+/).length;
    if (wordCount + words > MAX_WORDS) {
      const remaining = MAX_WORDS - wordCount;
      if (remaining > 30) {
        parts.push(snippet.split(/\s+/).slice(0, remaining).join(" ") + "...");
      }
      break;
    }
    parts.push(`- ${snippet} (source: ${result.url})`);
    wordCount += words;
  }

  const context = parts.join("\n");
  return returnSources ? { context, sources: allResults, providerError } : context;
}

function clampMaxResults(maxResults: number): number {
  if (!Number.isFinite(maxResults)) return 5;
  return Math.min(MAX_RESULTS_CAP, Math.max(1, Math.floor(maxResults)));
}

/**
 * Split one HTTP wait into the platform run timeout and the actor's own
 * request budget.
 *
 * On the 17s on-demand wait there is only a second of slack. The generate
 * route cannot spare more.
 *
 * On a promotion wait the actor's documented example request budget is 40s.
 * That sits 15s under the platform kill, and the HTTP client sits 5s past
 * the kill. A cold start then has time to boot, the actor can return pages
 * it already fetched, and Apify can send the body before we abort. When
 * those two clocks are a second apart, Apify kills the run and answers
 * HTTP 400 `status: TIMED-OUT` with an empty dataset.
 */
function actorBudgets(timeoutMs: number): { requestTimeoutSecs: number; runTimeoutSecs: number } {
  const httpSecs = Math.max(1, Math.ceil(timeoutMs / 1000));
  if (httpSecs < 40) {
    const runTimeoutSecs = Math.max(1, httpSecs - 1);
    const requestTimeoutSecs = Math.max(1, runTimeoutSecs - 1);
    return { requestTimeoutSecs, runTimeoutSecs };
  }
  const runTimeoutSecs = Math.max(1, httpSecs - 5);
  const requestTimeoutSecs = Math.max(1, Math.min(40, runTimeoutSecs - 15));
  return { requestTimeoutSecs, runTimeoutSecs };
}

function logProviderFailure(code: string, logFailures: boolean): void {
  if (!logFailures) return;
  console.warn(`search_provider_error:${code} provider=${SEARCH_PROVIDER}`);
}

function mapRagItem(item: unknown): WebSearchResult | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  // A 500 from the crawler is a Google redirect shell, not a page we can cite.
  if (crawlStatus(row) >= 400) return null;
  const markdown = asString(row.markdown) || asString(row.text);
  if (!markdown) return null;

  const metadata = asRecord(row.metadata);
  const searchResult = asRecord(row.searchResult);
  let url = asString(metadata.url) || asString(row["metadata.url"]);
  // `https://www.google.com/goto?...` is a redirect, not the article.
  if (!url || isGoogleRedirect(url)) url = asString(searchResult.url);
  if (!url || isGoogleRedirect(url)) return null;

  const title =
    asString(metadata.title) || asString(row["metadata.title"]) || asString(searchResult.title);
  return {
    url,
    title,
    content: clipSnippet(markdown),
    score: 1,
  };
}

function crawlStatus(row: Record<string, unknown>): number {
  const crawl = asRecord(row.crawl);
  const status = crawl.httpStatusCode;
  const code = typeof status === "number" ? status : Number(status);
  return Number.isFinite(code) ? code : 0;
}

/** Google `/goto` and `/url` links must never be stored as a citation. */
function isGoogleRedirect(url: string): boolean {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    const google = host === "google.com" || host.endsWith(".google.com");
    if (!google) return false;
    const path = parsed.pathname.toLowerCase();
    return path === "/goto" || path.startsWith("/goto/") || path === "/url" || path.startsWith("/url/");
  } catch {
    return false;
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function clipSnippet(value: string): string {
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= MAX_SNIPPET_CHARS) return text;
  return text.slice(0, MAX_SNIPPET_CHARS).trim();
}
