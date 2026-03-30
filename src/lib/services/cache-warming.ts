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
