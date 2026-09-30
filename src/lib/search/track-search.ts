/**
 * Shared wiring so every search box records the same properties.
 * The PostHog calls themselves live in analytics.ts.
 */

import { parseComparisonQuery } from "@/lib/parse-comparison-query";
import {
  trackComparisonSearch,
  trackSearchParsed,
  trackSearchResultClicked,
  trackSearchSubmitted,
  type SearchResultKind,
} from "@/lib/utils/analytics";
import {
  currentSourcePage,
  normalizeQuery,
  rememberSearch,
  searchIdFor,
  slugInResults,
  type SearchDestination,
  type SearchSurface,
} from "@/lib/search/search-session";

export function trackSubmittedQuery(args: {
  query: string;
  surface: SearchSurface;
  destination: SearchDestination;
  /** Live rows already fetched for this query. Used for canonical_slug_exists. */
  results: { slug: string }[];
  dropdownCount: number;
  /** When set, also fires the legacy comparison_search_performed event. */
  legacyResultType?: string;
}) {
  const raw = args.query.trim();
  const parsed = parseComparisonQuery(raw);
  const search_id = searchIdFor(raw);
  rememberSearch({
    search_id,
    query_raw: raw,
    query_normalized: normalizeQuery(raw),
    surface: args.surface,
  });
  trackSearchParsed(raw, parsed.slug, parsed.parsed);
  trackSearchSubmitted({
    search_id,
    query_raw: raw,
    surface: args.surface,
    parsed: parsed.parsed,
    parsed_slug: parsed.slug,
    canonical_slug_exists: slugInResults(parsed.slug, args.results),
    destination: args.destination,
    dropdown_result_count: args.dropdownCount,
    source_page: currentSourcePage(),
  });
  if (args.legacyResultType) {
    trackComparisonSearch(raw, args.legacyResultType, args.dropdownCount, args.surface);
  }
  return { parsed, search_id };
}

export function trackPickedResult(args: {
  query: string;
  surface: SearchSurface;
  slug: string;
  position: number;
  resultCount: number;
  resultKind: SearchResultKind;
}) {
  const raw = args.query.trim();
  const search_id = searchIdFor(raw);
  if (raw) {
    rememberSearch({
      search_id,
      query_raw: raw,
      query_normalized: normalizeQuery(raw),
      surface: args.surface,
    });
  }
  trackSearchResultClicked({
    search_id,
    query_raw: raw,
    surface: args.surface,
    slug: args.slug,
    position: args.position,
    result_count: args.resultCount,
    result_kind: args.resultKind,
  });
}
