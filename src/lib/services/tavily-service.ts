/**
 * Tavily is not the web search provider anymore.
 *
 * These names stay so older imports keep compiling. Every call goes to
 * Apify (`APIFY_API_TOKEN`) through `apify-search`. Nothing in this module
 * reads `TAVILY_API_KEY` or calls api.tavily.com.
 */

export {
  enrichComparisonData,
  enrichEntityData,
  searchWeb as searchTavily,
  searchWebDetailed as searchTavilyDetailed,
  webSearchProviderErrorReason as tavilyProviderErrorReason,
} from "@/lib/services/apify-search";

export type {
  EnrichmentResult,
  WebSearchOptions as TavilySearchOptions,
  WebSearchOutcome as TavilySearchOutcome,
  WebSearchProviderError as TavilyProviderError,
  WebSearchResult as TavilyResult,
} from "@/lib/services/apify-search";
