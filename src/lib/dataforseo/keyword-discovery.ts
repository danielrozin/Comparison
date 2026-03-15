/**
 * Keyword Discovery Engine
 * Systematically discovers comparison opportunities using DataForSEO
 */

import {
  getKeywordSuggestions,
  getKeywordIdeas,
  getRelatedKeywords,
  getCompetitorDomains,
  getDomainKeywords,
  type KeywordSuggestion,
} from "./client";

// Comparison query patterns to search
const SEED_PATTERNS = [
  "{entity} vs",
  "{entity} versus",
  "{entity} compared to",
  "compare {entity}",
  "{entity} or",
  "difference between {entity}",
  "{entity} alternative",
  "alternatives to {entity}",
  "best alternative to {entity}",
];

const CATEGORY_SEEDS: Record<string, string[]> = {
  sports: [
    "messi vs ronaldo", "lebron vs jordan", "brady vs manning",
    "mcgregor vs khabib", "federer vs nadal", "ali vs tyson",
    "nba player comparison", "nfl quarterback comparison",
  ],
  countries: [
    "usa vs china", "japan vs china", "india vs china",
    "germany vs france", "uk vs usa", "canada vs australia",
    "country comparison", "military comparison",
  ],
  technology: [
    "iphone vs samsung", "mac vs windows", "android vs ios",
    "ps5 vs xbox", "nvidia vs amd", "chrome vs firefox",
  ],
  products: [
    "nike vs adidas", "coca cola vs pepsi", "uber vs lyft",
    "airpods vs galaxy buds", "macbook vs dell xps",
  ],
  history: [
    "ww1 vs ww2", "roman empire vs ottoman empire",
    "cold war vs world war", "ancient greece vs ancient rome",
  ],
  companies: [
    "google vs microsoft", "amazon vs walmart", "tesla vs ford",
    "apple vs samsung", "netflix vs disney plus",
  ],
};

// Known competitor domains for comparison content
const COMPETITOR_DOMAINS = [
  "versus.com",
  "diffen.com",
  "comparably.com",
  "countryeconomy.com",
  "nationmaster.com",
  "similarweb.com",
  "g2.com",
  "capterra.com",
  "trustradius.com",
];

export interface DiscoveredOpportunity {
  keyword: string;
  searchVolume: number;
  cpc: number;
  competition: number;
  difficulty: number;
  intent: string;
  entityA: string | null;
  entityB: string | null;
  queryPattern: string | null;
  category: string | null;
  opportunityScore: number;
  source: string;
}

/**
 * Parse a comparison keyword into its components
 */
function parseComparisonKeyword(keyword: string): {
  entityA: string | null;
  entityB: string | null;
  queryPattern: string | null;
} {
  const lower = keyword.toLowerCase().trim();

  // "A vs B" or "A versus B"
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+)$/);
  if (vsMatch) {
    return { entityA: vsMatch[1].trim(), entityB: vsMatch[2].trim(), queryPattern: "vs" };
  }

  // "A compared to B"
  const comparedMatch = lower.match(/^(.+?)\s+compared\s+to\s+(.+)$/);
  if (comparedMatch) {
    return { entityA: comparedMatch[1].trim(), entityB: comparedMatch[2].trim(), queryPattern: "compare" };
  }

  // "compare A to/and B"
  const compareMatch = lower.match(/^compare\s+(.+?)\s+(?:to|and|with)\s+(.+)$/);
  if (compareMatch) {
    return { entityA: compareMatch[1].trim(), entityB: compareMatch[2].trim(), queryPattern: "compare" };
  }

  // "difference between A and B"
  const diffMatch = lower.match(/^difference\s+between\s+(.+?)\s+and\s+(.+)$/);
  if (diffMatch) {
    return { entityA: diffMatch[1].trim(), entityB: diffMatch[2].trim(), queryPattern: "difference" };
  }

  // "A or B"
  const orMatch = lower.match(/^(.+?)\s+or\s+(.+)$/);
  if (orMatch) {
    return { entityA: orMatch[1].trim(), entityB: orMatch[2].trim(), queryPattern: "or" };
  }

  // "alternatives to A" or "A alternatives"
  const altMatch = lower.match(/^(?:alternatives?\s+to|best\s+alternatives?\s+to)\s+(.+)$/);
  if (altMatch) {
    return { entityA: altMatch[1].trim(), entityB: null, queryPattern: "alternative" };
  }
  const altMatch2 = lower.match(/^(.+?)\s+alternatives?$/);
  if (altMatch2) {
    return { entityA: altMatch2[1].trim(), entityB: null, queryPattern: "alternative" };
  }

  return { entityA: null, entityB: null, queryPattern: null };
}

/**
 * Score an opportunity based on multiple factors
 */
function scoreOpportunity(kw: KeywordSuggestion): number {
  let score = 0;

  // Volume is king (log scale to not over-weight massive keywords)
  score += Math.log10(Math.max(kw.search_volume, 1)) * 20;

  // Lower difficulty = higher opportunity
  score += Math.max(0, 100 - kw.keyword_difficulty) * 0.3;

  // CPC indicates commercial value
  score += Math.min(kw.cpc * 5, 25);

  // Lower competition = easier to rank
  score += (1 - kw.competition) * 15;

  return Math.round(score * 100) / 100;
}

/**
 * Discover keywords by category
 */
export async function discoverByCategory(
  category: string
): Promise<DiscoveredOpportunity[]> {
  const seeds = CATEGORY_SEEDS[category];
  if (!seeds) return [];

  const results: DiscoveredOpportunity[] = [];

  // Get keyword ideas from all seeds
  const ideas = await getKeywordIdeas(seeds);

  for (const kw of ideas) {
    const parsed = parseComparisonKeyword(kw.keyword);
    results.push({
      keyword: kw.keyword,
      searchVolume: kw.search_volume,
      cpc: kw.cpc,
      competition: kw.competition,
      difficulty: kw.keyword_difficulty,
      intent: kw.search_intent,
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      queryPattern: parsed.queryPattern,
      category,
      opportunityScore: scoreOpportunity(kw),
      source: "dataforseo_ideas",
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Discover keywords by expanding a seed entity
 */
export async function discoverByEntity(
  entity: string,
  category?: string
): Promise<DiscoveredOpportunity[]> {
  const seeds = SEED_PATTERNS.map((p) => p.replace("{entity}", entity));
  const results: DiscoveredOpportunity[] = [];

  // Get suggestions for each pattern
  const suggestions = await getKeywordSuggestions(`${entity} vs`, undefined, undefined, 50);
  const related = await getRelatedKeywords(`${entity} vs`, undefined, undefined, 50);

  const allKeywords = [...suggestions, ...related];

  for (const kw of allKeywords) {
    const parsed = parseComparisonKeyword(kw.keyword);
    results.push({
      keyword: kw.keyword,
      searchVolume: kw.search_volume,
      cpc: kw.cpc,
      competition: kw.competition,
      difficulty: kw.keyword_difficulty,
      intent: kw.search_intent,
      entityA: parsed.entityA,
      entityB: parsed.entityB,
      queryPattern: parsed.queryPattern,
      category: category || null,
      opportunityScore: scoreOpportunity(kw),
      source: "dataforseo_entity_expansion",
    });
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Discover keywords from competitor domains
 */
export async function discoverFromCompetitors(): Promise<DiscoveredOpportunity[]> {
  const results: DiscoveredOpportunity[] = [];

  for (const domain of COMPETITOR_DOMAINS) {
    try {
      const keywords = await getDomainKeywords(domain, undefined, undefined, undefined, 50);

      for (const kw of keywords) {
        const parsed = parseComparisonKeyword(kw.keyword);
        results.push({
          keyword: kw.keyword,
          searchVolume: kw.searchVolume,
          cpc: 0,
          competition: 0,
          difficulty: 0,
          intent: "informational",
          entityA: parsed.entityA,
          entityB: parsed.entityB,
          queryPattern: parsed.queryPattern,
          category: null,
          opportunityScore: kw.searchVolume > 0 ? Math.log10(kw.searchVolume) * 20 : 0,
          source: `competitor_${domain}`,
        });
      }
    } catch {
      console.error(`Failed to scan competitor: ${domain}`);
    }
  }

  return results.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

/**
 * Find competing domains for our target keywords
 */
export async function findCompetitorDomains(
  category: string
): Promise<{
  domain: string;
  avgPosition: number;
  intersections: number;
  organicCount: number;
}[]> {
  const seeds = CATEGORY_SEEDS[category];
  if (!seeds) return [];

  return getCompetitorDomains(seeds);
}

export { parseComparisonKeyword, scoreOpportunity, CATEGORY_SEEDS, COMPETITOR_DOMAINS };
