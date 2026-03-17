import { NextResponse } from "next/server";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { getRedis } from "@/lib/services/redis";

export async function GET() {
  // Combine trending (static) + recent user searches (from Redis) for popular list
  const trending = await getTrendingComparisons(10);
  const trendingItems = trending.map((t) => ({
    slug: t.slug,
    title: t.title,
    category: t.category,
    score: t.viewCount,
  }));

  // Get recent searches from Redis to boost popular items
  const redis = getRedis();
  if (redis) {
    try {
      const recentRaw = await redis.lrange("recent:searches", 0, 49);
      const slugCounts = new Map<string, { title: string; category: string; count: number }>();

      for (const item of recentRaw) {
        const parsed = typeof item === "string" ? JSON.parse(item) : item;
        const existing = slugCounts.get(parsed.slug);
        if (existing) {
          existing.count++;
        } else {
          slugCounts.set(parsed.slug, {
            title: parsed.title,
            category: parsed.category || parsed.subcategory || "",
            count: 1,
          });
        }
      }

      // Add frequently searched items that aren't already in trending
      const trendingSlugs = new Set(trendingItems.map((t) => t.slug));
      for (const [slug, data] of slugCounts) {
        if (!trendingSlugs.has(slug) && data.count >= 1) {
          trendingItems.push({
            slug,
            title: data.title,
            category: data.category,
            score: data.count * 1000,
          });
        }
      }
    } catch {
      // Ignore Redis errors, just use trending
    }
  }

  // Sort by score and return top items
  trendingItems.sort((a, b) => b.score - a.score);

  return NextResponse.json({
    comparisons: trendingItems.slice(0, 12).map(({ slug, title, category }) => ({
      slug,
      title,
      category,
    })),
  });
}
