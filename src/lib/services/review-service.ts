/**
 * SmartReview Service
 * Handles product review CRUD, aggregation, and category-level queries.
 * Uses Prisma when DATABASE_URL is set, falls back to mock data otherwise.
 */

import { getPrisma } from "@/lib/db/prisma";
import { getRedis } from "./redis";

const CACHE_TTL_REVIEW = 600; // 10 min
const CACHE_TTL_AGGREGATION = 300; // 5 min

async function getCache<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

async function setCache(key: string, value: unknown, ttl: number): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // Silently fail — cache is optional
  }
}

// ============================================================
// Types
// ============================================================

export interface ReviewData {
  id: string;
  entityId: string;
  source: string;
  sourceUrl: string | null;
  authorName: string | null;
  rating: number | null;
  title: string | null;
  body: string | null;
  pros: string[];
  cons: string[];
  sourceDate: Date | null;
  sentiment: number | null;
  isVerified: boolean;
  createdAt: Date;
}

export interface AggregationData {
  entityId: string;
  averageRating: number;
  totalReviews: number;
  smartScore: number;
  sourceBreakdown: Record<string, { avg: number; count: number }> | null;
  avgSentiment: number | null;
  positivePct: number | null;
  negativePct: number | null;
  topPros: string[];
  topCons: string[];
  lastAggregatedAt: Date;
}

export interface ReviewedEntity {
  id: string;
  slug: string;
  name: string;
  shortDesc: string | null;
  imageUrl: string | null;
  entityType: { slug: string; name: string };
  reviewAggregation: AggregationData | null;
}

// ============================================================
// Mock data fallback
// ============================================================

const MOCK_REVIEWED_ENTITIES: ReviewedEntity[] = [
  {
    id: "mock-1", slug: "chatgpt", name: "ChatGPT", shortDesc: "AI chatbot by OpenAI",
    imageUrl: null, entityType: { slug: "technology", name: "Technology" },
    reviewAggregation: { entityId: "mock-1", averageRating: 4.5, totalReviews: 187, smartScore: 92, sourceBreakdown: { reddit: { avg: 4.3, count: 89 }, g2: { avg: 4.7, count: 98 } }, avgSentiment: 0.72, positivePct: 85, negativePct: 8, topPros: ["Easy to use", "Versatile", "Fast responses"], topCons: ["Can hallucinate", "Subscription cost"], lastAggregatedAt: new Date() },
  },
  {
    id: "mock-2", slug: "claude", name: "Claude", shortDesc: "AI assistant by Anthropic",
    imageUrl: null, entityType: { slug: "technology", name: "Technology" },
    reviewAggregation: { entityId: "mock-2", averageRating: 4.6, totalReviews: 142, smartScore: 94, sourceBreakdown: { reddit: { avg: 4.5, count: 65 }, producthunt: { avg: 4.8, count: 77 } }, avgSentiment: 0.78, positivePct: 88, negativePct: 5, topPros: ["Thoughtful answers", "Long context", "Safe and honest"], topCons: ["Availability", "No image generation"], lastAggregatedAt: new Date() },
  },
  {
    id: "mock-3", slug: "iphone-16", name: "iPhone 16", shortDesc: "Apple flagship smartphone",
    imageUrl: null, entityType: { slug: "product", name: "Product" },
    reviewAggregation: { entityId: "mock-3", averageRating: 4.3, totalReviews: 312, smartScore: 88, sourceBreakdown: { reddit: { avg: 4.1, count: 156 }, trustpilot: { avg: 4.5, count: 156 } }, avgSentiment: 0.65, positivePct: 79, negativePct: 11, topPros: ["Great camera", "Fast chip", "Build quality"], topCons: ["Price", "Battery could be better"], lastAggregatedAt: new Date() },
  },
];

// ============================================================
// Queries
// ============================================================

export async function getReviewsByEntity(
  entitySlug: string,
  options: { limit?: number; offset?: number; source?: string } = {}
): Promise<{ reviews: ReviewData[]; total: number }> {
  const { limit = 20, offset = 0, source } = options;
  const cacheKey = `reviews:${entitySlug}:${source || "all"}:${offset}:${limit}`;

  const cached = await getCache<{ reviews: ReviewData[]; total: number }>(cacheKey);
  if (cached) return cached;

  const prisma = getPrisma();
  if (!prisma) {
    const mockEntity = MOCK_REVIEWED_ENTITIES.find((e) => e.slug === entitySlug);
    return { reviews: [], total: mockEntity?.reviewAggregation?.totalReviews ?? 0 };
  }

  const where = {
    entity: { slug: entitySlug },
    status: "active",
    ...(source && { source }),
  };

  const [reviews, total] = await Promise.all([
    prisma.productReview.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: offset,
      take: limit,
    }),
    prisma.productReview.count({ where }),
  ]);

  const result = { reviews: reviews as ReviewData[], total };
  await setCache(cacheKey, result, CACHE_TTL_REVIEW);
  return result;
}

export async function getEntityAggregation(entitySlug: string): Promise<AggregationData | null> {
  const cacheKey = `review-agg:${entitySlug}`;
  const cached = await getCache<AggregationData>(cacheKey);
  if (cached) return cached;

  const prisma = getPrisma();
  if (!prisma) {
    const mock = MOCK_REVIEWED_ENTITIES.find((e) => e.slug === entitySlug);
    return mock?.reviewAggregation ?? null;
  }

  const agg = await prisma.reviewAggregation.findFirst({
    where: { entity: { slug: entitySlug } },
  });

  if (!agg) return null;

  const result: AggregationData = {
    entityId: agg.entityId,
    averageRating: agg.averageRating,
    totalReviews: agg.totalReviews,
    smartScore: agg.smartScore,
    sourceBreakdown: agg.sourceBreakdown as AggregationData["sourceBreakdown"],
    avgSentiment: agg.avgSentiment,
    positivePct: agg.positivePct,
    negativePct: agg.negativePct,
    topPros: agg.topPros,
    topCons: agg.topCons,
    lastAggregatedAt: agg.lastAggregatedAt,
  };

  await setCache(cacheKey, result, CACHE_TTL_AGGREGATION);
  return result;
}

export async function getReviewedEntities(options: {
  category?: string;
  sort?: "rating" | "reviews" | "smartscore" | "alphabetical";
  minRating?: number;
  limit?: number;
  offset?: number;
}): Promise<{ entities: ReviewedEntity[]; total: number }> {
  const { category, sort = "smartscore", minRating, limit = 20, offset = 0 } = options;
  const cacheKey = `reviewed-entities:${category || "all"}:${sort}:${minRating || 0}:${offset}:${limit}`;

  const cached = await getCache<{ entities: ReviewedEntity[]; total: number }>(cacheKey);
  if (cached) return cached;

  const prisma = getPrisma();
  if (!prisma) {
    let entities = [...MOCK_REVIEWED_ENTITIES];
    if (minRating) {
      entities = entities.filter((e) => (e.reviewAggregation?.averageRating ?? 0) >= minRating);
    }
    return { entities: entities.slice(offset, offset + limit), total: entities.length };
  }

  const orderBy = sort === "rating"
    ? { reviewAggregation: { averageRating: "desc" as const } }
    : sort === "reviews"
    ? { reviewAggregation: { totalReviews: "desc" as const } }
    : sort === "alphabetical"
    ? { name: "asc" as const }
    : { reviewAggregation: { smartScore: "desc" as const } };

  const where = {
    reviewAggregation: minRating
      ? { is: { averageRating: { gte: minRating } } }
      : { isNot: null },
    status: "published" as const,
    ...(category && { entityType: { is: { slug: category } } }),
  };

  const [entities, total] = await Promise.all([
    prisma.entity.findMany({
      where,
      include: {
        entityType: { select: { slug: true, name: true } },
        reviewAggregation: true,
      },
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.entity.count({ where }),
  ]);

  const result = { entities: entities as unknown as ReviewedEntity[], total };
  await setCache(cacheKey, result, CACHE_TTL_AGGREGATION);
  return result;
}

export async function getReviewCategories(): Promise<{ slug: string; name: string; count: number }[]> {
  const cacheKey = "review-categories";
  const cached = await getCache<{ slug: string; name: string; count: number }[]>(cacheKey);
  if (cached) return cached;

  const prisma = getPrisma();
  if (!prisma) {
    return [
      { slug: "technology", name: "Technology", count: 2 },
      { slug: "product", name: "Product", count: 1 },
    ];
  }

  const result = await prisma.$queryRaw<{ slug: string; name: string; count: bigint }[]>`
    SELECT et.slug, et.name, COUNT(ra.id)::bigint as count
    FROM entity_types et
    JOIN entities e ON e.entity_type_id = et.id
    JOIN review_aggregations ra ON ra.entity_id = e.id
    WHERE e.status = 'published'
    GROUP BY et.slug, et.name
    HAVING COUNT(ra.id) > 0
    ORDER BY count DESC
  `;

  const categories = result.map((r) => ({ slug: r.slug, name: r.name, count: Number(r.count) }));
  await setCache(cacheKey, categories, CACHE_TTL_AGGREGATION);
  return categories;
}

// ============================================================
// Aggregation (re-compute from reviews)
// ============================================================

export async function reaggregateEntity(entityId: string): Promise<AggregationData | null> {
  const prisma = getPrisma();
  if (!prisma) return null;

  const reviews = await prisma.productReview.findMany({
    where: { entityId, status: "active" },
  });

  if (reviews.length === 0) return null;

  // Per-source breakdown
  const sourceMap: Record<string, { total: number; count: number }> = {};
  let totalRating = 0;
  let ratedCount = 0;
  let sentimentSum = 0;
  let sentimentCount = 0;
  let positiveCount = 0;
  let negativeCount = 0;
  const allPros: Record<string, number> = {};
  const allCons: Record<string, number> = {};

  for (const r of reviews) {
    if (r.rating != null) {
      totalRating += r.rating;
      ratedCount++;
      if (!sourceMap[r.source]) sourceMap[r.source] = { total: 0, count: 0 };
      sourceMap[r.source].total += r.rating;
      sourceMap[r.source].count++;
    }
    if (r.sentiment != null) {
      sentimentSum += r.sentiment;
      sentimentCount++;
      if (r.sentiment > 0.2) positiveCount++;
      else if (r.sentiment < -0.2) negativeCount++;
    }
    for (const p of r.pros) { allPros[p] = (allPros[p] || 0) + 1; }
    for (const c of r.cons) { allCons[c] = (allCons[c] || 0) + 1; }
  }

  const averageRating = ratedCount > 0 ? totalRating / ratedCount : 0;
  const sourceBreakdown = Object.fromEntries(
    Object.entries(sourceMap).map(([k, v]) => [k, { avg: v.total / v.count, count: v.count }])
  );
  const avgSentiment = sentimentCount > 0 ? sentimentSum / sentimentCount : null;
  const total = reviews.length;
  const positivePct = total > 0 ? (positiveCount / total) * 100 : null;
  const negativePct = total > 0 ? (negativeCount / total) * 100 : null;

  const topPros = Object.entries(allPros).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);
  const topCons = Object.entries(allCons).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k]) => k);

  // SmartScore: weighted composite of rating (60%), volume (20%), sentiment (20%)
  const ratingScore = (averageRating / 5) * 60;
  const volumeScore = Math.min(Math.log10(total + 1) / 3, 1) * 20;
  const sentimentScore = avgSentiment != null ? ((avgSentiment + 1) / 2) * 20 : 10;
  const smartScore = Math.round(ratingScore + volumeScore + sentimentScore);

  const data = {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: total,
    smartScore,
    sourceBreakdown,
    avgSentiment: avgSentiment != null ? Math.round(avgSentiment * 100) / 100 : null,
    positivePct: positivePct != null ? Math.round(positivePct) : null,
    negativePct: negativePct != null ? Math.round(negativePct) : null,
    topPros,
    topCons,
    lastAggregatedAt: new Date(),
  };

  const agg = await prisma.reviewAggregation.upsert({
    where: { entityId },
    update: data,
    create: { entityId, ...data },
  });

  // Invalidate cache
  const redis = getRedis();
  if (redis) {
    const entity = await prisma.entity.findUnique({ where: { id: entityId }, select: { slug: true } });
    if (entity) {
      await redis.del(`review-agg:${entity.slug}`);
    }
  }

  return agg as unknown as AggregationData;
}
