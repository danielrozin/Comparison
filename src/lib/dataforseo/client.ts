/**
 * DataForSEO API Client
 * Server-side only — never import in client components
 */

const DATAFORSEO_BASE = "https://api.dataforseo.com/v3";

function getAuthHeader(): string {
  const login = process.env.DATAFORSEO_LOGIN;
  const password = process.env.DATAFORSEO_PASSWORD;
  if (!login || !password) {
    throw new Error("DataForSEO credentials not configured. Set DATAFORSEO_LOGIN and DATAFORSEO_PASSWORD.");
  }
  return "Basic " + Buffer.from(`${login}:${password}`).toString("base64");
}

async function apiRequest<T>(endpoint: string, body?: unknown): Promise<T> {
  const response = await fetch(`${DATAFORSEO_BASE}${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Authorization": getAuthHeader(),
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`DataForSEO API error ${response.status}: ${text}`);
  }

  return response.json() as Promise<T>;
}

// ============================================================
// Keyword Discovery
// ============================================================

export interface KeywordSuggestion {
  keyword: string;
  search_volume: number;
  cpc: number;
  competition: number;
  keyword_difficulty: number;
  search_intent: string;
}

interface DataForSEOResponse<T> {
  tasks: {
    result: T[];
    status_code: number;
    status_message: string;
  }[];
}

interface KeywordSuggestionsResult {
  items: {
    keyword: string;
    keyword_info: {
      search_volume: number;
      cpc: number;
      competition: number;
    };
    keyword_properties: {
      keyword_difficulty: number;
    };
    search_intent_info: {
      main_intent: string;
    };
  }[];
}

export async function getKeywordSuggestions(
  seed: string,
  location: number = 2840, // US
  language: string = "en",
  limit: number = 100
): Promise<KeywordSuggestion[]> {
  const data = await apiRequest<DataForSEOResponse<KeywordSuggestionsResult>>(
    "/dataforseo_labs/google/keyword_suggestions/live",
    [
      {
        keyword: seed,
        location_code: location,
        language_code: language,
        include_seed_keyword: true,
        limit,
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    keyword: item.keyword,
    search_volume: item.keyword_info?.search_volume || 0,
    cpc: item.keyword_info?.cpc || 0,
    competition: item.keyword_info?.competition || 0,
    keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
    search_intent: item.search_intent_info?.main_intent || "informational",
  }));
}

// ============================================================
// Related Keywords
// ============================================================

interface RelatedKeywordsResult {
  items: {
    keyword_data: {
      keyword: string;
      keyword_info: {
        search_volume: number;
        cpc: number;
        competition: number;
      };
    };
    related_keywords: string[];
  }[];
}

export async function getRelatedKeywords(
  seed: string,
  location: number = 2840,
  language: string = "en",
  limit: number = 50
): Promise<KeywordSuggestion[]> {
  const data = await apiRequest<DataForSEOResponse<RelatedKeywordsResult>>(
    "/dataforseo_labs/google/related_keywords/live",
    [
      {
        keyword: seed,
        location_code: location,
        language_code: language,
        limit,
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    keyword: item.keyword_data.keyword,
    search_volume: item.keyword_data.keyword_info?.search_volume || 0,
    cpc: item.keyword_data.keyword_info?.cpc || 0,
    competition: item.keyword_data.keyword_info?.competition || 0,
    keyword_difficulty: 0,
    search_intent: "informational",
  }));
}

// ============================================================
// Keyword Ideas (for vs/comparison queries)
// ============================================================

interface KeywordIdeasResult {
  items: {
    keyword: string;
    keyword_info: {
      search_volume: number;
      cpc: number;
      competition: number;
    };
    keyword_properties: {
      keyword_difficulty: number;
    };
    search_intent_info: {
      main_intent: string;
    };
  }[];
}

export async function getKeywordIdeas(
  seeds: string[],
  location: number = 2840,
  language: string = "en",
  limit: number = 200
): Promise<KeywordSuggestion[]> {
  const data = await apiRequest<DataForSEOResponse<KeywordIdeasResult>>(
    "/dataforseo_labs/google/keyword_ideas/live",
    [
      {
        keywords: seeds,
        location_code: location,
        language_code: language,
        limit,
        include_serp_info: false,
        filters: [
          ["keyword_info.search_volume", ">", 100],
        ],
        order_by: ["keyword_info.search_volume,desc"],
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    keyword: item.keyword,
    search_volume: item.keyword_info?.search_volume || 0,
    cpc: item.keyword_info?.cpc || 0,
    competition: item.keyword_info?.competition || 0,
    keyword_difficulty: item.keyword_properties?.keyword_difficulty || 0,
    search_intent: item.search_intent_info?.main_intent || "informational",
  }));
}

// ============================================================
// Competitor Keywords (domains ranking for comparison queries)
// ============================================================

interface CompetitorDomainsResult {
  items: {
    domain: string;
    avg_position: number;
    intersections: number;
    full_domain_metrics: {
      organic: {
        count: number;
        estimated_paid_traffic_cost: number;
      };
    };
  }[];
}

export async function getCompetitorDomains(
  seeds: string[],
  location: number = 2840,
  language: string = "en",
  limit: number = 20
): Promise<{
  domain: string;
  avgPosition: number;
  intersections: number;
  organicCount: number;
}[]> {
  const data = await apiRequest<DataForSEOResponse<CompetitorDomainsResult>>(
    "/dataforseo_labs/google/competitors_domain/live",
    [
      {
        keywords: seeds,
        location_code: location,
        language_code: language,
        limit,
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    domain: item.domain,
    avgPosition: item.avg_position,
    intersections: item.intersections,
    organicCount: item.full_domain_metrics?.organic?.count || 0,
  }));
}

// ============================================================
// Domain Keywords (what a competitor domain ranks for)
// ============================================================

interface DomainKeywordsResult {
  items: {
    keyword_data: {
      keyword: string;
      keyword_info: {
        search_volume: number;
        cpc: number;
        competition: number;
      };
    };
    ranked_serp_element: {
      serp_item: {
        rank_group: number;
        url: string;
      };
    };
  }[];
}

export async function getDomainKeywords(
  domain: string,
  filters?: string[][],
  location: number = 2840,
  language: string = "en",
  limit: number = 100
): Promise<{
  keyword: string;
  searchVolume: number;
  position: number;
  url: string;
}[]> {
  const data = await apiRequest<DataForSEOResponse<DomainKeywordsResult>>(
    "/dataforseo_labs/google/ranked_keywords/live",
    [
      {
        target: domain,
        location_code: location,
        language_code: language,
        limit,
        filters: filters || [
          ["keyword_data.keyword", "like", "%vs%"],
        ],
        order_by: ["keyword_data.keyword_info.search_volume,desc"],
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    keyword: item.keyword_data.keyword,
    searchVolume: item.keyword_data.keyword_info?.search_volume || 0,
    position: item.ranked_serp_element?.serp_item?.rank_group || 0,
    url: item.ranked_serp_element?.serp_item?.url || "",
  }));
}

// ============================================================
// Bulk Keyword Metrics
// ============================================================

interface BulkKeywordResult {
  items: {
    keyword: string;
    search_volume: number;
    cpc: number;
    competition: number;
  }[];
}

export async function getBulkKeywordMetrics(
  keywords: string[],
  location: number = 2840,
  language: string = "en"
): Promise<{
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
}[]> {
  const data = await apiRequest<DataForSEOResponse<BulkKeywordResult>>(
    "/dataforseo_labs/google/bulk_keyword_difficulty/live",
    [
      {
        keywords,
        location_code: location,
        language_code: language,
      },
    ]
  );

  const items = data.tasks?.[0]?.result?.[0]?.items || [];
  return items.map((item) => ({
    keyword: item.keyword,
    searchVolume: item.search_volume || 0,
    cpc: item.cpc || 0,
    competition: item.competition || 0,
  }));
}
