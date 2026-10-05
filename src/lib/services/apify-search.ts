/**
 * Web search for on-demand comparison generation and provisional promotion.
 *
 * Uses the Apify actor `apify/rag-web-browser` through the sync dataset
 * endpoint. The token is read from `APIFY_API_TOKEN` and sent only as a
 * Bearer header — never in the URL, the logs, or the request body.
 * Server-side only. Do not import this from a client component.
 *
 * Actor reference (checked against the current actor page):
 * https://apify.com/apify/rag-web-browser
 * Input: `query`, `maxResults` (default there is 3; we default to 5),
 * `outputFormats` (`markdown` | `text` | `html`), `requestTimeoutSecs`.
 * Each dataset item has `metadata.url`, `metadata.title`, and `markdown`.
 * A page that did not finish loading may only have `searchResult`.
 */

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

const APIFY_ACTOR_ENDPOINT =
  "https://api.apify.com/v2/acts/apify~rag-web-browser/run-sync-get-dataset-items";

/**
 * HTTP abort for on-demand generation.
 *
 * `POST /api/comparisons/generate` has `maxDuration` 60s, and the model call
 * after search is capped at 45s. 12s + 45s stays inside that 60s budget.
 * The actor’s own `requestTimeoutSecs` is shorter, so it can return whatever
 * it already fetched instead of us aborting the connection.
 */
export const APIFY_SEARCH_TIMEOUT_MS = 12_000;

/**
 * HTTP abort for one promotion enrichment. The cron’s `maxDuration` is 120s
 * and it may run six enrichments in a row: 6 × 18s = 108s.
 */
export const APIFY_PROMOTION_SEARCH_TIMEOUT_MS = 18_000;

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
  const token = readApifyToken();
  if (!token) {
    logProviderFailure("missing_key", logFailures);
    return { ok: false, results: [], error: { type: "missing_key" } };
  }

  const cappedResults = clampMaxResults(maxResults);
  const { requestTimeoutSecs, runTimeoutSecs } = actorBudgets(waitMs);
  const endpoint = new URL(APIFY_ACTOR_ENDPOINT);
  endpoint.searchParams.set("timeout", String(runTimeoutSecs));
  endpoint.searchParams.set("memory", String(ACTOR_MEMORY_MB));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), waitMs);

  try {
    const response = await fetch(endpoint.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query,
        maxResults: cappedResults,
        outputFormats: ["markdown"],
        // Plain HTML is about twice as fast as the headless browser. The
        // pages we cite (articles, specs, references) are mostly static.
        // https://apify.com/apify/rag-web-browser — "Scraping tool"
        scrapingTool: "raw-http",
        requestTimeoutSecs,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      logProviderFailure(String(response.status), logFailures);
      return { ok: false, results: [], error: { type: "http", status: response.status } };
    }

    const data: unknown = await response.json();
    // A 2xx body that is not the dataset array is not "zero hits". Counting
    // it as an empty search would burn a promotion attempt.
    if (!Array.isArray(data)) {
      logProviderFailure("network", logFailures);
      return { ok: false, results: [], error: { type: "network" } };
    }
    const results = data
      .map((row) => mapRagItem(row))
      .filter((row): row is WebSearchResult => row !== null);
    return { ok: true, results };
  } catch (error) {
    if (isAbortError(error)) {
      logProviderFailure("timeout", logFailures);
      return { ok: false, results: [], error: { type: "timeout" } };
    }
    // The error text can echo the request. Log the code only, never the token.
    logProviderFailure("network", logFailures);
    return { ok: false, results: [], error: { type: "network" } };
  } finally {
    clearTimeout(timer);
  }
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
    searchWebDetailed(`${entityA} vs ${entityB} comparison 2026`, 3, undefined, options),
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

function readApifyToken(): string | null {
  const raw = process.env.APIFY_API_TOKEN;
  if (typeof raw !== "string") return null;
  const token = raw.trim();
  return token.length > 0 ? token : null;
}

function clampMaxResults(maxResults: number): number {
  if (!Number.isFinite(maxResults)) return 5;
  return Math.min(MAX_RESULTS_CAP, Math.max(1, Math.floor(maxResults)));
}

/**
 * Platform `timeout` is a second under the HTTP abort. `requestTimeoutSecs`
 * is a second under that, so the actor can hand back partial pages.
 */
function actorBudgets(timeoutMs: number): { requestTimeoutSecs: number; runTimeoutSecs: number } {
  const httpSecs = Math.max(1, Math.ceil(timeoutMs / 1000));
  const runTimeoutSecs = Math.max(1, httpSecs - 1);
  const requestTimeoutSecs = Math.max(1, runTimeoutSecs - 1);
  return { requestTimeoutSecs, runTimeoutSecs };
}

function logProviderFailure(code: string, logFailures: boolean): void {
  if (!logFailures) return;
  console.warn(`search_provider_error:${code} provider=${SEARCH_PROVIDER}`);
}

function mapRagItem(item: unknown): WebSearchResult | null {
  if (!item || typeof item !== "object") return null;
  const row = item as Record<string, unknown>;
  const metadata = asRecord(row.metadata);
  const searchResult = asRecord(row.searchResult);
  const url =
    asString(metadata.url) || asString(row["metadata.url"]) || asString(searchResult.url);
  if (!url) return null;
  const title =
    asString(metadata.title) || asString(row["metadata.title"]) || asString(searchResult.title);
  const markdown = asString(row.markdown) || asString(row.text);
  const fallback = asString(searchResult.description) || asString(metadata.description);
  return {
    url,
    title,
    content: clipSnippet(markdown || fallback),
    score: 1,
  };
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

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: unknown }).name;
  return name === "AbortError" || name === "TimeoutError";
}
