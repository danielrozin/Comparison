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

interface TavilyResponse {
  results: TavilyResult[];
}

/**
 * Direct Tavily search wrapper.
 * Returns an empty array if the API key is not set or the request fails.
 */
export async function searchTavily(
  query: string,
  maxResults: number = 5
): Promise<TavilyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    console.warn("Tavily: TAVILY_API_KEY not configured, skipping search");
    return [];
  }

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: apiKey,
        query,
        max_results: maxResults,
      }),
    });

    if (!response.ok) {
      console.warn(`Tavily: API returned ${response.status} ${response.statusText}`);
      return [];
    }

    const data: TavilyResponse = await response.json();
    return data.results || [];
  } catch (error) {
    console.warn("Tavily: search failed:", error);
    return [];
  }
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
export async function enrichComparisonData(
  entityA: string,
  entityB: string
): Promise<string> {
  // Run two searches in parallel: one for direct comparison, one for each entity
  const [comparisonResults, entityAResults, entityBResults] = await Promise.all([
    searchTavily(`${entityA} vs ${entityB} comparison 2026`, 3),
    searchTavily(`${entityA} latest features specs 2026`, 2),
    searchTavily(`${entityB} latest features specs 2026`, 2),
  ]);

  const allResults = [...comparisonResults, ...entityAResults, ...entityBResults];
  if (allResults.length === 0) return "";

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

  return parts.join("\n");
}
