/**
 * Cache Warming Service
 *
 * Triggers on-demand ISR revalidation after new content is generated.
 * This ensures new comparison pages are pre-rendered and cached at the
 * edge immediately, rather than waiting for the first visitor hit.
 */

const REVALIDATE_ENDPOINT = "/api/revalidate";

/**
 * Warm the ISR cache for a newly generated comparison.
 * Revalidates the comparison page itself plus the home page
 * (which shows latest/trending comparisons).
 */
export async function warmCacheForSlug(slug: string): Promise<void> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;

  const paths = [
    `/compare/${slug}`,
    "/", // home page shows latest comparisons
  ];

  try {
    const res = await fetch(`${baseUrl}${REVALIDATE_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paths,
        secret: process.env.REVALIDATION_SECRET || undefined,
      }),
    });

    if (!res.ok) {
      console.warn(`[cache-warming] Revalidation returned ${res.status} for ${slug}`);
    }
  } catch (err) {
    // Cache warming is best-effort — don't fail the generation
    console.warn(`[cache-warming] Failed for ${slug}:`, err instanceof Error ? err.message : err);
  }
}

/**
 * Warm the ISR cache for multiple paths at once.
 * Used after batch operations (e.g., bulk generation).
 */
export async function warmCacheForPaths(paths: string[]): Promise<void> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;

  // Always include home page when warming multiple paths
  const allPaths = [...new Set([...paths, "/"])];

  try {
    await fetch(`${baseUrl}${REVALIDATE_ENDPOINT}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paths: allPaths,
        secret: process.env.REVALIDATION_SECRET || undefined,
      }),
    });
  } catch {
    // Best-effort
  }
}

/**
 * Warm the Redis cache for the top comparisons by traffic.
 * Fetches top N comparisons from DB and pre-populates the Redis cache.
 * Intended to be called from a cron job or on deploy.
 */
export async function warmRedisCacheForTopComparisons(limit: number = 100): Promise<{ warmed: number; errors: number }> {
  // Dynamic imports to avoid circular deps
  const { getComparisonBySlug } = await import("./comparison-service");

  let prisma;
  try {
    const { getPrisma } = require("@/lib/db/prisma");
    prisma = getPrisma();
  } catch {
    console.warn("[cache-warming] No database connection, skipping Redis warm");
    return { warmed: 0, errors: 0 };
  }

  if (!prisma) {
    return { warmed: 0, errors: 0 };
  }

  let warmed = 0;
  let errors = 0;

  try {
    const topSlugs = await prisma.comparison.findMany({
      where: { status: "published" },
      orderBy: { viewCount: "desc" },
      take: limit,
      select: { slug: true },
    });

    // Warm in batches of 10 to avoid overwhelming Redis
    const batchSize = 10;
    for (let i = 0; i < topSlugs.length; i += batchSize) {
      const batch = topSlugs.slice(i, i + batchSize);
      const results = await Promise.allSettled(
        batch.map((row: { slug: string }) => getComparisonBySlug(row.slug))
      );
      for (const r of results) {
        if (r.status === "fulfilled" && r.value) {
          warmed++;
        } else {
          errors++;
        }
      }
    }

    console.log(`[cache-warming] Redis warm complete: ${warmed} warmed, ${errors} errors out of ${topSlugs.length} total`);
  } catch (e) {
    console.warn("[cache-warming] Redis warm failed:", e instanceof Error ? e.message : e);
  }

  return { warmed, errors };
}

function getBaseUrl(): string | null {
  // In production, use NEXT_PUBLIC_SITE_URL or VERCEL_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // In development
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }
  return null;
}
