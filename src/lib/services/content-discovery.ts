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
  source: "dataforseo" | "reddit" | "quora" | "tavily" | "google_trends" | "gsc" | "twitter" | "facebook" | "instagram" | "tiktok" | "youtube";
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
  "cooking", "food", "travel", "education", "pcgaming",
  "investing", "cryptocurrency", "buildapc",
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
  health: ["medication", "diet", "supplement", "treatment", "fitness"],
  food_and_drink: ["restaurant", "ingredient", "recipe", "cuisine", "beverage"],
  education: ["university", "degree", "certification", "online course"],
  automotive: ["car", "suv", "electric vehicle", "manufacturer"],
  gaming: ["game", "console", "graphics card", "esports", "gaming laptop"],
  software: ["saas", "dev tool", "productivity app", "cloud platform"],
  finance: ["bank", "investment", "cryptocurrency", "trading platform"],
  travel: ["destination", "airline", "hotel", "travel comparison"],
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

  // "A vs B" / "A versus B" (anchored at start)
  const vsMatch = lower.match(/^(.+?)\s+(?:vs\.?|versus)\s+(.+?)(?:\?|$|\s*[-:|])/);
  if (vsMatch) {
    return { entityA: clean(vsMatch[1]), entityB: clean(vsMatch[2]), isComparison: true };
  }

  // "A or B" pattern (with question context)
  const orMatch = lower.match(/(?:should\s+i|which\s+is\s+better|choose|pick)\s+(.+?)\s+or\s+(.+?)(?:\?|$)/);
  if (orMatch) {
    return { entityA: clean(orMatch[1]), entityB: clean(orMatch[2]), isComparison: true };
  }

  // "A compared to B" / "A comparison with B"
  const compMatch = lower.match(/(.+?)\s+(?:compared\s+to|comparison\s+with)\s+(.+?)(?:\?|$)/);
  if (compMatch) {
    return { entityA: clean(compMatch[1]), entityB: clean(compMatch[2]), isComparison: true };
  }

  // "difference between A and B" / "differences between A and B"
  const diffMatch = lower.match(/differences?\s+between\s+(.+?)\s+and\s+(.+?)(?:\?|$)/);
  if (diffMatch) {
    return { entityA: clean(diffMatch[1]), entityB: clean(diffMatch[2]), isComparison: true };
  }

  // "compare A and/to/with B"
  const compareMatch = lower.match(/compare\s+(.+?)\s+(?:and|to|with|vs\.?)\s+(.+?)(?:\?|$)/);
  if (compareMatch) {
    return { entityA: clean(compareMatch[1]), entityB: clean(compareMatch[2]), isComparison: true };
  }

  // "A over B" / "A better than B"
  const overMatch = lower.match(/(.{2,50}?)\s+(?:over|better\s+than|worse\s+than)\s+(.{2,50}?)(?:\?|$)/);
  if (overMatch) {
    return { entityA: clean(overMatch[1]), entityB: clean(overMatch[2]), isComparison: true };
  }

  // "A or B" without question context (looser — catches "iPhone or Samsung" style)
  const looseOrMatch = lower.match(/^(.{2,40}?)\s+or\s+(.{2,40}?)(?:\?|$|\s*[-:|])/);
  if (looseOrMatch) {
    return { entityA: clean(looseOrMatch[1]), entityB: clean(looseOrMatch[2]), isComparison: true };
  }

  // Simple "X vs Y" anywhere in the title (expanded from 30 to 50 chars)
  const simpleVs = lower.match(/(.{2,50}?)\s+vs\.?\s+(.{2,50})/);
  if (simpleVs) {
    return { entityA: clean(simpleVs[1]), entityB: clean(simpleVs[2]), isComparison: true };
  }

  // "alternative to A" / "alternatives to A" / "A alternative" — single entity
  const altMatch = lower.match(/(?:best\s+)?alternatives?\s+(?:to|for)\s+(.{2,50}?)(?:\?|$)/);
  if (altMatch) {
    return { entityA: clean(altMatch[1]), entityB: null, isComparison: false };
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
      // Search for trending comparisons using category-specific seed terms
      const seedTerm = seeds[Math.floor(Math.random() * seeds.length)];
      const results = await searchTavily(
        `${seedTerm} vs comparison 2026 best which is better ${cat}`,
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
// Apify Social Media Scrapers (Twitter/X, Facebook, Instagram)
// ---------------------------------------------------------------------------

const APIFY_BASE = "https://api.apify.com/v2";

function getApifyToken(): string | null {
  return process.env.APIFY_API_TOKEN || null;
}

/** Run an Apify actor synchronously and return dataset items (with timeout). */
async function runApifyActorSync(
  actorId: string,
  input: Record<string, unknown>,
  timeoutMs = 60_000
): Promise<Record<string, unknown>[]> {
  const token = getApifyToken();
  if (!token) return [];

  const res = await fetch(
    `${APIFY_BASE}/acts/${actorId}/run-sync-get-dataset-items?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      signal: AbortSignal.timeout(timeoutMs),
    }
  );

  if (!res.ok) {
    console.warn(`Apify actor ${actorId} failed: ${res.status}`);
    return [];
  }

  return (await res.json()) as Record<string, unknown>[];
}

/**
 * Discover comparison topics from Twitter/X via Apify.
 * Uses the Tweet Scraper V2 actor to find tweets with comparison keywords.
 */
export async function discoverFromTwitter(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) return [];

  const topics: DiscoveredTopic[] = [];
  const searchQueries = [
    "vs better which 2026",
    "versus comparison review",
    "compared to which should",
    "vs which one should I buy",
    "better than alternative to",
  ];

  try {
    // apidojo~tweet-scraper (134M+ runs, most popular Twitter actor)
    const items = await runApifyActorSync("apidojo~tweet-scraper", {
      searchTerms: searchQueries,
      maxTweets: 100,
      searchMode: "live",
    }, 120_000);

    for (const item of items) {
      const text = (item.full_text || item.text || "") as string;
      if (!text || text.length < 15) continue;

      const parsed = parseComparisonFromTitle(text);
      if (!parsed.isComparison) continue;

      const likes = ((item.favorite_count || item.likeCount || 0) as number);
      const retweets = ((item.retweet_count || item.retweetCount || 0) as number);
      const engagement = likes + retweets * 3;

      topics.push({
        topic: text.slice(0, 200),
        source: "twitter",
        type: "comparison",
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        searchVolume: null,
        engagementScore: engagement,
        opportunityScore: Math.min(engagement * 0.15, 60) + 15,
        sourceUrl: (item.url || item.tweetUrl || null) as string | null,
        rawData: { likes, retweets, platform: "twitter" },
      });
    }
  } catch (err) {
    console.warn("Twitter/X discovery failed:", err instanceof Error ? err.message : err);
  }

  return topics;
}

/**
 * Discover comparison topics from Facebook via Apify.
 * Searches public Facebook posts for comparison discussions.
 */
export async function discoverFromFacebook(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) return [];

  const topics: DiscoveredTopic[] = [];

  try {
    // apify~facebook-posts-scraper for public post search
    const items = await runApifyActorSync("apify~facebook-posts-scraper", {
      searchType: "posts",
      searchQueries: ["vs comparison 2026", "versus which is better", "compared to review", "which one is better buy"],
      maxPosts: 100,
      resultsLimit: 100,
    }, 120_000);

    for (const item of items) {
      const text = (item.text || item.postText || item.message || "") as string;
      if (!text || text.length < 15) continue;

      const parsed = parseComparisonFromTitle(text.slice(0, 300));
      if (!parsed.isComparison) continue;

      const likes = ((item.likes || item.likesCount || 0) as number);
      const shares = ((item.shares || item.sharesCount || 0) as number);
      const comments = ((item.comments || item.commentsCount || 0) as number);
      const engagement = likes + shares * 3 + comments * 2;

      topics.push({
        topic: text.slice(0, 200),
        source: "facebook",
        type: "comparison",
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        searchVolume: null,
        engagementScore: engagement,
        opportunityScore: Math.min(engagement * 0.1, 50) + 10,
        sourceUrl: (item.url || item.postUrl || null) as string | null,
        rawData: { likes, shares, comments, platform: "facebook" },
      });
    }
  } catch (err) {
    console.warn("Facebook discovery failed:", err instanceof Error ? err.message : err);
  }

  return topics;
}

/**
 * Discover comparison topics from Instagram via Apify.
 * Searches Instagram hashtags and posts for comparison content.
 */
export async function discoverFromInstagram(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) return [];

  const topics: DiscoveredTopic[] = [];
  const hashtags = ["vs", "versus", "comparison", "whichisbetter", "headtohead", "review2026"];

  try {
    // apify~instagram-scraper (107M+ runs, most popular Instagram actor)
    const items = await runApifyActorSync("apify~instagram-scraper", {
      search: hashtags.join(" "),
      searchType: "hashtag",
      resultsLimit: 100,
    }, 120_000);

    for (const item of items) {
      const caption = (item.caption || item.text || "") as string;
      if (!caption || caption.length < 15) continue;

      const parsed = parseComparisonFromTitle(caption.slice(0, 300));
      if (!parsed.isComparison) continue;

      const likes = ((item.likesCount || item.likes || 0) as number);
      const comments = ((item.commentsCount || item.comments || 0) as number);
      const engagement = likes + comments * 2;

      topics.push({
        topic: caption.slice(0, 200),
        source: "instagram",
        type: "comparison",
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        searchVolume: null,
        engagementScore: engagement,
        opportunityScore: Math.min(engagement * 0.05, 40) + 10,
        sourceUrl: (item.url || item.postUrl || null) as string | null,
        rawData: { likes, comments, platform: "instagram" },
      });
    }
  } catch (err) {
    console.warn("Instagram discovery failed:", err instanceof Error ? err.message : err);
  }

  return topics;
}

/**
 * Discover comparison topics from TikTok via Apify.
 * Uses the TikTok Scraper actor to find comparison videos.
 */
export async function discoverFromTikTok(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) return [];

  const topics: DiscoveredTopic[] = [];

  try {
    // clockworks~tiktok-scraper (72M+ runs)
    const items = await runApifyActorSync("clockworks~tiktok-scraper", {
      searchQueries: ["vs comparison", "versus which is better", "vs review 2026"],
      resultsPerPage: 50,
      shouldDownloadVideos: false,
    }, 120_000);

    for (const item of items) {
      const text = (item.text || item.desc || item.description || "") as string;
      if (!text || text.length < 10) continue;

      const parsed = parseComparisonFromTitle(text.slice(0, 300));
      if (!parsed.isComparison) continue;

      const likes = ((item.diggCount || item.likes || 0) as number);
      const shares = ((item.shareCount || item.shares || 0) as number);
      const views = ((item.playCount || item.views || 0) as number);
      const engagement = likes + shares * 3 + Math.floor(views / 100);

      topics.push({
        topic: text.slice(0, 200),
        source: "tiktok",
        type: "comparison",
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        searchVolume: null,
        engagementScore: engagement,
        opportunityScore: Math.min(engagement * 0.08, 50) + 12,
        sourceUrl: (item.webVideoUrl || item.url || null) as string | null,
        rawData: { likes, shares, views, platform: "tiktok" },
      });
    }
  } catch (err) {
    console.warn("TikTok discovery failed:", err instanceof Error ? err.message : err);
  }

  return topics;
}

/**
 * Discover comparison topics from YouTube via Apify.
 * Searches for comparison/review videos.
 */
export async function discoverFromYouTube(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) return [];

  const topics: DiscoveredTopic[] = [];

  try {
    // streamers~youtube-scraper (13M+ runs)
    const items = await runApifyActorSync("streamers~youtube-scraper", {
      searchKeywords: ["vs comparison 2026", "versus which is better", "head to head review"],
      maxResults: 50,
    }, 120_000);

    for (const item of items) {
      const title = (item.title || item.text || "") as string;
      if (!title || title.length < 10) continue;

      const parsed = parseComparisonFromTitle(title);
      if (!parsed.isComparison) continue;

      const views = ((item.viewCount || item.views || 0) as number);
      const likes = ((item.likes || 0) as number);
      const engagement = views + likes * 10;

      topics.push({
        topic: title.slice(0, 200),
        source: "youtube",
        type: "comparison",
        entityA: parsed.entityA,
        entityB: parsed.entityB,
        searchVolume: null,
        engagementScore: engagement,
        opportunityScore: Math.min(Math.log10(Math.max(engagement, 1)) * 15, 60) + 10,
        sourceUrl: (item.url || null) as string | null,
        rawData: { views, likes, platform: "youtube" },
      });
    }
  } catch (err) {
    console.warn("YouTube discovery failed:", err instanceof Error ? err.message : err);
  }

  return topics;
}

/**
 * Discover from all social media platforms via Apify.
 * Twitter/X, Facebook, Instagram, TikTok, YouTube — all in parallel.
 */
export async function discoverFromSocialMedia(): Promise<DiscoveredTopic[]> {
  if (!getApifyToken()) {
    console.warn("Social media discovery skipped: APIFY_API_TOKEN not set");
    return [];
  }

  // Run all 5 platforms in parallel
  const [twitter, facebook, instagram, tiktok, youtube] = await Promise.all([
    discoverFromTwitter().catch((err) => {
      console.warn("Twitter scrape failed:", err instanceof Error ? err.message : err);
      return [] as DiscoveredTopic[];
    }),
    discoverFromFacebook().catch((err) => {
      console.warn("Facebook scrape failed:", err instanceof Error ? err.message : err);
      return [] as DiscoveredTopic[];
    }),
    discoverFromInstagram().catch((err) => {
      console.warn("Instagram scrape failed:", err instanceof Error ? err.message : err);
      return [] as DiscoveredTopic[];
    }),
    discoverFromTikTok().catch((err) => {
      console.warn("TikTok scrape failed:", err instanceof Error ? err.message : err);
      return [] as DiscoveredTopic[];
    }),
    discoverFromYouTube().catch((err) => {
      console.warn("YouTube scrape failed:", err instanceof Error ? err.message : err);
      return [] as DiscoveredTopic[];
    }),
  ]);

  return [...twitter, ...facebook, ...instagram, ...tiktok, ...youtube];
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
  const [redditTopics, quoraTopics, tavilyTopics, dataforseoTopics, gscTopics, socialMediaTopics] =
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
      // Social media: Twitter/X, Facebook, Instagram via Apify
      discoverFromSocialMedia().catch((err) => {
        console.warn("Social media discovery failed entirely:", err);
        return [] as DiscoveredTopic[];
      }),
    ]);

  // Merge all topics (GSC first for priority in dedup, then social, then others)
  const all = [...gscTopics, ...socialMediaTopics, ...redditTopics, ...quoraTopics, ...tavilyTopics, ...dataforseoTopics];

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
