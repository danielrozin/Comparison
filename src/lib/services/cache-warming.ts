/**
 * Cache Warming Service
 *
 * Triggers on-demand ISR revalidation after new content is generated.
 * This ensures new comparison pages are pre-rendered and cached at the
 * edge immediately, rather than waiting for the first visitor hit.
 */

// App Router revalidation (revalidatePath) — correct for App Router pages like "/".
const REVALIDATE_ENDPOINT = "/api/revalidate";
// Pages Router revalidation (res.revalidate) — required for /compare/[slug],
// which moved to the Pages Router (DAN-432). revalidatePath does NOT invalidate
// Pages Router ISR pages, so compare paths must go through this endpoint
// (DAN-1201).
const REVALIDATE_PAGES_ENDPOINT = "/api/revalidate-pages";

async function postRevalidate(
  baseUrl: string,
  endpoint: string,
  paths: string[]
): Promise<void> {
  if (paths.length === 0) return;
  try {
    const res = await fetch(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paths,
        secret: process.env.REVALIDATION_SECRET || undefined,
      }),
    });
    if (!res.ok) {
      console.warn(`[cache-warming] ${endpoint} returned ${res.status} for ${paths.join(",")}`);
    }
  } catch (err) {
    // Cache warming is best-effort — don't fail the generation
    console.warn(`[cache-warming] ${endpoint} failed:`, err instanceof Error ? err.message : err);
  }
}

// Split paths by which router owns them so each gets the revalidation API that
// actually busts its ISR cache.
function isPagesRouterPath(path: string): boolean {
  return (
    path.startsWith("/compare/") ||
    path.startsWith("/category/") ||
    path.startsWith("/entity/") ||
    path.startsWith("/alternatives/")
  );
}

/**
 * Warm the ISR cache for a newly generated comparison.
 * Revalidates the comparison page itself (Pages Router) plus the home page
 * (App Router, shows latest/trending comparisons).
 */
export async function warmCacheForSlug(slug: string): Promise<void> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;

  await Promise.all([
    postRevalidate(baseUrl, REVALIDATE_PAGES_ENDPOINT, [`/compare/${slug}`]),
    postRevalidate(baseUrl, REVALIDATE_ENDPOINT, ["/"]),
  ]);
}

/**
 * Warm the ISR cache for multiple paths at once.
 * Used after batch operations (e.g., bulk generation).
 */
export async function warmCacheForPaths(paths: string[]): Promise<void> {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return;

  const unique = [...new Set(paths)];
  const pagesPaths = unique.filter(isPagesRouterPath);
  // App Router endpoint always includes the home page (latest comparisons).
  const appPaths = [...new Set([...unique.filter((p) => !isPagesRouterPath(p)), "/"])];

  await Promise.all([
    postRevalidate(baseUrl, REVALIDATE_PAGES_ENDPOINT, pagesPaths),
    postRevalidate(baseUrl, REVALIDATE_ENDPOINT, appPaths),
  ]);
}

function getBaseUrl(): string | null {
  // In production, use NEXT_PUBLIC_SITE_URL or VERCEL_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    // Strip whitespace first (DAN-1033: env var has shipped with a trailing
    // space), then any trailing slash.
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\s+/g, "").replace(/\/+$/, "");
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
