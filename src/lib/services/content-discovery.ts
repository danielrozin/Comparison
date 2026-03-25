/**
 * Content Discovery Service
 * Pulls comparison topics and blog ideas from multiple data sources:
 * - Reddit (public JSON API)
 * - Quora (via Tavily search)
 * - Tavily (trending comparison topics)
 * - DataForSEO (keyword discovery)
 *
 * All sources are queried in parallel with graceful failure handling.
 */

import { searchTavily } from "@/lib/services/tavily-service";
import { discoverByCategory, type DiscoveredOpportunity } from "@/lib/dataforseo/keyword-discovery";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DiscoveredTopic {
  topic: string;
  source: "dataforseo" | "reddit" | "quora" | "tavily" | "google_trends" | "gsc";
  type: "comparison" | "blog";
  entityA: string | null;
  entityB: string | null;
  searchVolume: number | null;
  engagementScore: number; // upvotes, comments, impressions
  opportunityScore: number;
  sourceUrl: string | null;
  rawData?: unknown;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const REDDIT_SUBREDDITS = [
  "technology", "gadgets", "android", "apple", "gaming",
  "fitness", "personalfinance", "cars", "nutrition",
  "programming", "soccer", "nba", "movies",
];

const REDDIT_USER_AGENT = "AversusB/1.0 (content-discovery)";

const CATEGORY_TAVILY_SEEDS: Record<string, string[]> = {
  technology: ["smartphone", "laptop", "headphones", "smartwatch", "tablet"],
  sports: ["player", "team", "league", "athlete"],
  products: ["product", "brand", "gadget", "appliance"],
  companies: ["company", "platform", "service", "startup"],
  entertainment: ["movie", "show", "game", "streaming"],
  brands: ["brand", "manufacturer"],
  history: ["empire", "civilization", "era"],
  countries: ["country", "nation", "economy"],
};

// ---------------------------------------------------------------------------
// Entity parsing
// ---------------------------------------------------------------------------

function parseComparisonFromTitle(title: string): {
  entityA: string | null;
  entityB: string | null;
  isComparison: boolean;
} {
  const lower = title.toLowerCase().trim();

  // "A vs B" / "A versus B"
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+?)(?:\?|$|\s*[-:|])/);
  if (vsMatch) {
    return { entityA: clean(vsMatch[1]), entityB: clean(vsMatch[2]), isComparison: true };
  }

  // "A or B" pattern (with question context)
  const orMatch = lower.match(/(?:should\s+i|which\s+is\s+better|choose)\s+(.+?)\s+or\s+(.+?)(?:\?|$)/);
  if (orMatch) {
    return { entityA: clean(orMatch[1]), entityB: clean(orMatch[2]), isComparison: true };
  }

  // "A compared to B"
  const compMatch = lower.match(/(.+?)\s+compared\s+to\s+(.+?)(?:\?|$)/);
  if (compMatch) {
    return { entityA: clean(compMatch[1]), entityB: clean(compMatch[2]), isComparison: true };
  }

  // "difference between A and B"
  const diffMatch = lower.match(/difference\s+between\s+(.+?)\s+and\s+(.+?)(?:\?|$)/);
  if (diffMatch) {
    return { entityA: clean(diffMatch[1]), entityB: clean(diffMatch[2]), isComparison: true };
  }

  // Simple "X vs Y" anywhere in the title
  const simpleVs = lower.match(/(.{2,30}?)\s+vs\.?\s+(.{2,30})/);
  if (simpleVs) {
    return { entityA: clean(simpleVs[1]), entityB: clean(simpleVs[2]), isComparison: true };
  }

  return { entityA: null, entityB: null, isComparison: false };
}

function clean(s: string): string {
  return s.replace(/[^a-zA-Z0-9\s.+#-]/g, "").trim().slice(0, 60);
}

function normalizeTopicKey(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// ---------------------------------------------------------------------------
// Reddit (public JSON API — no auth needed)
// ---------------------------------------------------------------------------

export async function discoverFromReddit(
  subreddits?: string[]
): Promise<DiscoveredTopic[]> {
  const subs = subreddits || REDDIT_SUBREDDITS;
  const topics: DiscoveredTopic[] = [];

  for (const sub of subs) {
    try {
      const url = `https://www.reddit.com/r/${sub}/search.json?q=vs+OR+compare+OR+versus+OR+better&sort=relevance&t=month&limit=25`;
      const res = await fetch(url, {
        headers: { "User-Agent": REDDIT_USER_AGENT },
        signal: AbortSignal.timeout(10_000),
      });

      if (!res.ok) {
        console.warn(`Reddit: /r/${sub} returned ${res.status}`);
        continue;
      }

      const data = await res.json();
      const posts = data?.data?.children || [];

      for (const post of posts) {
        const d = post?.data;
        if (!d?.title) continue;

        const title = d.title as string;
        const parsed = parseComparisonFromTitle(title);
        const ups = (d.ups as number) || 0;
        const comments = (d.num_comments as number) || 0;
        const engagement = ups + comments * 2;

        topics.push({
          topic: title,
          source: "reddit",
          type: parsed.isComparison ? "comparison" : "blog",
          entityA: parsed.entityA,
          entityB: parsed.entityB,
          searchVolume: null,
          engagementScore: engagement,
          opportunityScore: Math.min(engagement * 0.1, 50) + (parsed.isComparison ? 20 : 5),
          sourceUrl: d.permalink ? `https://www.reddit.com${d.permalink}` : null,
          rawData: { subreddit: sub, ups, comments },
        });
      }

      // Respect Reddit rate limits — 1 second between requests
      await new Promise((r) => setTimeout(r, 1000));
    } catch (err) {
      console.warn(`Reddit: failed to fetch /r/${sub}:`, err instanceof Error ? err.message : err);
    }
  }

  return topics;
}

// ---------------------------------------------------------------------------
// Quora (via Tavily site-search)
// ---------------------------------------------------------------------------

export async function discoverFromQuora(
  categories?: string[]
): Promise<DiscoveredTopic[]> {
  const cats = categories || ["technology", "sports", "products"];
  const topics: DiscoveredTopic[] = [];

  for (const cat of cats) {
    try {
      const results = await searchTavily(
        `site:quora.com "vs" OR "versus" OR "which is better" ${cat}`,
        10
      );

      for (const r of results) {
        const title = r.title
          .replace(/ - Quora$/i, "")
          .replace(/^Quora\s*-\s*/i, "")
          .trim();
        const parsed = parseComparisonFromTitle(title);

        topics.push({
          topic: title,
          source: "quora",
          type: parsed.isComparison ? "comparison" : "blog",
          entityA: parsed.entityA,
          entityB: parsed.entityB,
          searchVolume: null,
          engagementScore: Math.round(r.score * 100),
          opportunityScore: r.score * 40 + (parsed.isComparison ? 20 : 5),
          sourceUrl: r.url,
        });
      }
    } catch (err) {
      console.warn(`Quora discovery failed for ${cat}:`, err instanceof Error ? err.message : err);
    }
  }

  return topics;
}

// ---------------------------------------------------------------------------
// Tavily (trending comparison topics)
// ---------------------------------------------------------------------------

export async function discoverFromTavily(
  categories?: string[]
): Promise<DiscoveredTopic[]> {
  const cats = categories || ["technology", "sports", "products"];
  const topics: DiscoveredTopic[] = [];

  for (const cat of cats) {
    try {
      const seeds = CATEGORY_TAVILY_SEEDS[cat] || [cat];
      // Search for trending comparisons in this category
      const results = await searchTavily(
        `${cat} vs comparison 2026 best which is better`,
        10
      );

      for (const r of results) {
        const parsed = parseComparisonFromTitle(r.title);

        // Also try to extract entities from the content snippet
        let entityA = parsed.entityA;
        let entityB = parsed.entityB;
        let isComp = parsed.isComparison;

        if (!isComp && r.content) {
          const contentParsed = parseComparisonFromTitle(r.content.slice(0, 200));
          if (contentParsed.isComparison) {
            entityA = contentParsed.entityA;
            entityB = contentParsed.entityB;
            isComp = true;
          }
        }

        topics.push({
          topic: r.title,
          source: "tavily",
          type: isComp ? "comparison" : "blog",
          entityA,
          entityB,
          searchVolume: null,
          engagementScore: Math.round(r.score * 100),
          opportunityScore: r.score * 35 + (isComp ? 20 : 10),
          sourceUrl: r.url,
        });
      }
    } catch (err) {
      console.warn(`Tavily discovery failed for ${cats}:`, err instanceof Error ? err.message : err);
    }
  }

  return topics;
}

// ---------------------------------------------------------------------------
// DataForSEO (existing keyword-discovery)
// ---------------------------------------------------------------------------

export async function discoverFromDataForSEO(
  category?: string
): Promise<DiscoveredTopic[]> {
  const cat = category || "technology";
  try {
    const opportunities = await discoverByCategory(cat);
    return opportunities.map((opp: DiscoveredOpportunity) => ({
      topic: opp.keyword,
      source: "dataforseo" as const,
      type: "comparison" as const,
      entityA: opp.entityA,
      entityB: opp.entityB,
      searchVolume: opp.searchVolume,
      engagementScore: opp.searchVolume || 0,
      opportunityScore: opp.opportunityScore,
      sourceUrl: null,
      rawData: {
        cpc: opp.cpc,
        competition: opp.competition,
        difficulty: opp.difficulty,
        intent: opp.intent,
      },
    }));
  } catch (err) {
    console.warn(`DataForSEO discovery failed for ${cat}:`, err instanceof Error ? err.message : err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Google Search Console (real search query data — highest signal)
// ---------------------------------------------------------------------------

export async function discoverFromGSC(): Promise<DiscoveredTopic[]> {
  try {
    const { analyzeGSCOpportunities } = await import("@/lib/services/gsc-service");
    const opportunities = await analyzeGSCOpportunities();

    return opportunities
      .filter((o) => !o.hasExistingPage && o.impressions >= 2)
      .map((opp) => ({
        topic: opp.query,
        source: "gsc" as const,
        type: opp.type === "comparison" ? ("comparison" as const) : ("blog" as const),
        entityA: opp.entityA,
        entityB: opp.entityB,
        searchVolume: opp.impressions,
        engagementScore: opp.impressions,
        // GSC data is highest-signal: real users searched for this
        opportunityScore: opp.opportunityScore + 30,
        sourceUrl: null,
        rawData: {
          clicks: opp.clicks,
          ctr: opp.ctr,
          position: opp.position,
        },
      }));
  } catch (err) {
    console.warn("GSC discovery failed:", err instanceof Error ? err.message : err);
    return [];
  }
}

// ---------------------------------------------------------------------------
// Main: discover from all sources in parallel
// ---------------------------------------------------------------------------

export async function discoverTopics(options?: {
  categories?: string[];
  limit?: number;
}): Promise<DiscoveredTopic[]> {
  const categories = options?.categories || ["technology"];
  const limit = options?.limit || 50;

  // Run all sources in parallel — each one is resilient to failure
  const [redditTopics, quoraTopics, tavilyTopics, dataforseoTopics, gscTopics] =
    await Promise.all([
      discoverFromReddit().catch((err) => {
        console.warn("Reddit discovery failed entirely:", err);
        return [] as DiscoveredTopic[];
      }),
      discoverFromQuora(categories).catch((err) => {
        console.warn("Quora discovery failed entirely:", err);
        return [] as DiscoveredTopic[];
      }),
      discoverFromTavily(categories).catch((err) => {
        console.warn("Tavily discovery failed entirely:", err);
        return [] as DiscoveredTopic[];
      }),
      // DataForSEO: discover for each requested category
      Promise.all(categories.map((c) => discoverFromDataForSEO(c)))
        .then((results) => results.flat())
        .catch((err) => {
          console.warn("DataForSEO discovery failed entirely:", err);
          return [] as DiscoveredTopic[];
        }),
      // GSC: real search queries — highest signal source
      discoverFromGSC().catch((err) => {
        console.warn("GSC discovery failed entirely:", err);
        return [] as DiscoveredTopic[];
      }),
    ]);

  // Merge all topics (GSC first for priority in dedup)
  const all = [...gscTopics, ...redditTopics, ...quoraTopics, ...tavilyTopics, ...dataforseoTopics];

  // Deduplicate by normalized topic key (keep highest opportunityScore)
  const deduped = new Map<string, DiscoveredTopic>();
  for (const topic of all) {
    const key = normalizeTopicKey(topic.topic);
    const existing = deduped.get(key);
    if (!existing || topic.opportunityScore > existing.opportunityScore) {
      deduped.set(key, topic);
    }
  }

  // Sort by opportunityScore descending and limit
  return Array.from(deduped.values())
    .sort((a, b) => b.opportunityScore - a.opportunityScore)
    .slice(0, limit);
}
