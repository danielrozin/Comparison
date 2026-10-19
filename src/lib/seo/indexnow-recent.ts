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
  const out = new Set<string>();
  for (const e of entries) {
    if (!e.lastModified) continue;
    const t = new Date(e.lastModified).getTime();
    if (!Number.isFinite(t) || t < cutoff.getTime()) continue;
    const url = normalizeIndexNowUrl(typeof e.url === "string" ? e.url : String(e.url));
    if (url) out.add(url);
  }
  return [...out];
}
