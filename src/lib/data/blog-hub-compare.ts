/**
 * ROO-46 — pick a live /compare target for a blog hub card or lander.
 *
 * Stored related slugs and curated fallbacks are folded onto their canonical
 * survivor, then kept only when that survivor is in the live set from
 * `filterLiveCompareSlugs`. Never emit a slug that was not in that set.
 */
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { BLOG_COMPARE_FALLBACKS } from "@/lib/data/blog-compare-constants";

export function foldCompareSlug(slug: string): string {
  return getConsolidatedCompareSlug(slug) ?? slug;
}

/** Stored related slugs first, then curated fallbacks for thin posts. */
export function articleCompareCandidates(
  blogSlug: string,
  stored: string[] | null | undefined,
): string[] {
  return [...(stored ?? []), ...(BLOG_COMPARE_FALLBACKS[blogSlug] ?? [])];
}

/**
 * First candidate whose canonical slug is live. Returns the canonical slug
 * (the href target), not a retired alias.
 */
export function firstLiveCompareSlug(
  candidates: string[],
  live: ReadonlySet<string>,
): string | null {
  const seen = new Set<string>();
  for (const raw of candidates) {
    if (!raw) continue;
    const folded = foldCompareSlug(raw);
    if (!folded || seen.has(folded)) continue;
    seen.add(folded);
    if (live.has(folded)) return folded;
  }
  return null;
}
