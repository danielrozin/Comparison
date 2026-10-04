/**
 * Tavily API Service
 * Provides real-time web data enrichment for AI-generated comparisons.
 * Server-side only — never import in client components.
 */

export interface TavilyResult {
  url: string;
  title: string;
  content: string;
  score: number;
}

/**
 * Why a search never completed. `http` keeps the upstream status (401, 429, …)
 * so a quota or auth failure is not stored as "zero sources".
 */
export type TavilyProviderError =
  | { type: "missing_key" }
  | { type: "timeout" }
  | { type: "network" }
  | { type: "http"; status: number };

/** A finished search. `ok` with an empty `results` means Tavily had nothing. */
export type TavilySearchOutcome =
  | { ok: true; results: TavilyResult[] }
  | { ok: false; results: []; error: TavilyProviderError };

interface TavilyResponse {
  results?: TavilyResult[];
}

// Hard timeout for any single Tavily request. Tavily has been the most
// common silent-stall culprit in the on-demand generation pipeline
// (DAN-596) — without this bound, a slow upstream search would hang
// the entire 60s server budget and leave the page stuck loading.
const TAVILY_REQUEST_TIMEOUT_MS = 8000;

/** Token stored on promotion-failed reasons and the PostHog event. */
export function tavilyProviderErrorReason(error: TavilyProviderError): string {
  const code = error.type === "http" ? String(error.status) : error.type;
  return `search_provider_error:${code}`;
}

/**
 * Direct Tavily search wrapper.
 * Returns an empty array when the key is missing, the search errors, or
 * Tavily has no hits. Callers that need to tell those apart should use
 * `searchTavilyDetailed`.
 */
export async function searchTavily(
  query: string,
  maxResults: number = 5,
  timeoutMs: number = TAVILY_REQUEST_TIMEOUT_MS
): Promise<TavilyResult[]> {
  const outcome = await searchTavilyDetailed(query, maxResults, timeoutMs);
  return outcome.results;
}

export interface TavilySearchOptions {
  /** Other callers keep a per-request warning. The promotion cron summarizes instead. */
  logFailures?: boolean;
}

/**
 * Same search as `searchTavily`, with an explicit outcome:
 * ok + hits, ok + zero hits, or a provider failure.
 */
export async function searchTavilyDetailed(
  query: string,
  maxResults: number = 5,
  timeoutMs: number = TAVILY_REQUEST_TIMEOUT_MS,
  options?: TavilySearchOptions,
): Promise<TavilySearchOutcome> {
  const logFailures = options?.logFailures !== false;
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    if (logFailures) console.warn("Tavily: TAVILY_API_KEY not configured, skipping search");
    return { ok: false, results: [], error: { type: "missing_key" } };
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (logFailures) console.warn(`Tavily: API returned ${response.status} ${response.statusText}`);
      return { ok: false, results: [], error: { type: "http", status: response.status } };
    }

    const data = (await response.json()) as TavilyResponse;
    const results = Array.isArray(data?.results) ? data.results : [];
    return { ok: true, results };
  } catch (error) {
    if (isAbortError(error)) {
      if (logFailures) {
        console.warn(`Tavily: search timed out after ${timeoutMs}ms for query: ${query.slice(0, 80)}`);
      }
      return { ok: false, results: [], error: { type: "timeout" } };
    }
    // Log the error name only. The request body holds the API key, and some
    // fetch errors echo that body.
    if (logFailures) {
      const name = error instanceof Error && error.name ? error.name : "Error";
      console.warn(`Tavily: search failed (${name})`);
    }
    return { ok: false, results: [], error: { type: "network" } };
  } finally {
    clearTimeout(timer);
  }
}

function isAbortError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const name = (error as { name?: unknown }).name;
  return name === "AbortError" || name === "TimeoutError";
}

/**
 * Searches for current facts about an entity and returns a condensed summary string.
 */
export async function enrichEntityData(
  entityName: string,
  entityType: string
): Promise<string> {
  const query = `${entityName} ${entityType} latest specs features price 2026`;
  const results = await searchTavily(query, 3);

  if (results.length === 0) return "";

  const snippets = results
    .map((r) => r.content)
    .join(" ")
    .slice(0, 1500);

  return `[${entityName}]: ${snippets}`;
}

/**
 * Searches for comparison data between two entities and returns a structured
 * context string (max ~500 words) suitable for injection into AI prompts.
 */
export interface EnrichmentResult {
  context: string;
  sources: TavilyResult[];
  /**
   * Set when at least one of the searches failed at the provider.
   * Null when every search completed, including a search with zero hits.
   * Callers that only read `context` and `sources` can ignore this.
   */
  providerError: string | null;
}

export async function enrichComparisonData(
  entityA: string,
  entityB: string
): Promise<string>;
export async function enrichComparisonData(
  entityA: string,
  entityB: string,
  returnSources: true,
  options?: TavilySearchOptions,
): Promise<EnrichmentResult>;
export async function enrichComparisonData(
  entityA: string,
  entityB: string,
  returnSources?: boolean,
  options?: TavilySearchOptions,
): Promise<string | EnrichmentResult> {
  // Run two searches in parallel: one for direct comparison, one for each entity.
  // The promotion cron turns per-request logs off and writes one summary.
  const [comparisonOutcome, entityAOutcome, entityBOutcome] = await Promise.all([
    searchTavilyDetailed(`${entityA} vs ${entityB} comparison 2026`, 3, undefined, options),
    searchTavilyDetailed(`${entityA} latest features specs 2026`, 2, undefined, options),
    searchTavilyDetailed(`${entityB} latest features specs 2026`, 2, undefined, options),
  ]);
  const outcomes = [comparisonOutcome, entityAOutcome, entityBOutcome];
  const allResults = outcomes.flatMap((outcome) => outcome.results);
  const failed = outcomes.find((outcome): outcome is Extract<TavilySearchOutcome, { ok: false }> => !outcome.ok);
  const providerError = failed ? tavilyProviderErrorReason(failed.error) : null;

  if (allResults.length === 0) {
    return returnSources ? { context: "", sources: [], providerError } : "";
  }

  // Build a concise context string, capped at roughly 500 words
  const parts: string[] = [];
  let wordCount = 0;
  const MAX_WORDS = 500;

  for (const result of allResults) {
    const snippet = result.content.trim();
    const words = snippet.split(/\s+/).length;
    if (wordCount + words > MAX_WORDS) {
      // Add a truncated portion if there's room
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
