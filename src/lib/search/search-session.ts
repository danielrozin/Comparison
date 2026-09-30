/**
 * One id per typed query, shared by the home box, the header overlay,
 * /search, and the missing-compare page.
 *
 * The id lives in memory for the dropdown (results can settle before the
 * person submits) and in sessionStorage once they submit, so a full
 * navigation to /compare or the Pages Router 404 can still attach it.
 */

export type SearchSurface = "home" | "overlay" | "search_page" | "not_found_form" | "url";

export type SearchDestination = "compare" | "search_page" | "dropdown_item";

export interface StoredSearch {
  search_id: string;
  query_raw: string;
  query_normalized: string;
  surface: SearchSurface;
}

const LAST_SEARCH_KEY = "avb_last_search";

const idsByQuery = new Map<string, string>();

/** Lowercase, trim, and collapse whitespace. Same rule as the search dashboard. */
export function normalizeQuery(q: string): string {
  return q.toLowerCase().trim().replace(/\s+/g, " ");
}

export function newSearchId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `search-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function rememberSearch(entry: StoredSearch): void {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(LAST_SEARCH_KEY, JSON.stringify(entry));
  } catch {
    // Private mode can throw. The in-memory id still covers this page.
  }
}

export function readLastSearch(): StoredSearch | null {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(LAST_SEARCH_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredSearch>;
    if (!parsed.search_id || typeof parsed.query_raw !== "string" || !parsed.surface) return null;
    return {
      search_id: parsed.search_id,
      query_raw: parsed.query_raw,
      query_normalized: parsed.query_normalized || normalizeQuery(parsed.query_raw),
      surface: parsed.surface,
    };
  } catch {
    return null;
  }
}

/**
 * Stable id for this normalized query. Reuses the id written at submit time
 * so /search does not mint a second one for a query the home box already sent.
 */
export function searchIdFor(query: string): string {
  const normalized = normalizeQuery(query);
  const stored = readLastSearch();
  if (stored && stored.query_normalized === normalized) return stored.search_id;
  const existing = idsByQuery.get(normalized);
  if (existing) return existing;
  const id = newSearchId();
  idsByQuery.set(normalized, id);
  return id;
}

export function slugInResults(slug: string | null, results: { slug: string }[]): boolean {
  if (!slug) return false;
  return results.some((result) => result.slug === slug);
}

/**
 * True or false only when `results` were fetched for this exact query.
 * A previous query's rows, or a fetch that has not settled yet, are unknown.
 */
export function canonicalSlugExists(args: {
  slug: string | null;
  query: string;
  results: { slug: string }[];
  resultsQuery: string | null;
}): boolean | null {
  if (!args.slug) return false;
  if (args.resultsQuery == null) return null;
  if (normalizeQuery(args.resultsQuery) !== normalizeQuery(args.query)) return null;
  return slugInResults(args.slug, args.results);
}

export function currentSourcePage(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("source_page") ?? "";
}

export function lastSearchAttachment(): {
  from_search: boolean;
  search_id: string;
  query_raw: string;
} {
  const last = readLastSearch();
  return {
    from_search: Boolean(last),
    search_id: last?.search_id ?? "",
    query_raw: last?.query_raw ?? "",
  };
}
