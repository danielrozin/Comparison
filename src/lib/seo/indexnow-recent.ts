import { normalizeIndexNowUrl } from "@/lib/seo/indexnow";

/**
 * Pick sitemap entries whose lastModified falls inside the window.
 * The sitemap only lists canonical, indexable pages (published compares and
 * blog posts, best pages, and code-backed hubs such as
 * /browser-comparison-2026 whose LAST_UPDATED moves when a PR changes them),
 * so this never submits archived, provisional or noindex rows.
 */
export function recentSitemapUrls(
  entries: { url: string | URL; lastModified?: string | Date }[],
  cutoff: Date
): string[] {
  // Newest first, so the daily cap spends itself on the freshest changes.
  const latest = new Map<string, number>();
  for (const e of entries) {
    if (!e.lastModified) continue;
    const t = new Date(e.lastModified).getTime();
    if (!Number.isFinite(t) || t < cutoff.getTime()) continue;
    const url = normalizeIndexNowUrl(typeof e.url === "string" ? e.url : String(e.url));
    if (url) latest.set(url, Math.max(t, latest.get(url) ?? 0));
  }
  return [...latest.entries()].sort((a, b) => b[1] - a[1]).map(([url]) => url);
}
