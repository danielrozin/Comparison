/**
 * ROO-224: what the blog compare card links to when the post's own pair has
 * no live /compare page.
 *
 * The card used to link the missing pair so the on-demand builder (ROO-193)
 * could make it on first visit. A crawl on 2026-10-14 found 78 of 243 blog
 * compare targets were 404s, a dozen of them mangled slugs. The card now only
 * links pages that exist, in this order:
 *   1. live compares that share a side with the post's pair (closest first:
 *      both sides, then either side);
 *   2. the published entity pages for the two sides;
 *   3. nothing, so the caller keeps its popular-compares fallback.
 *
 * Every lookup is injected, so this file never talks to the database.
 */

import { topicSides } from "@/lib/blog/blog-topic-compare";

export interface BlogCompareFallbackLink {
  slug: string;
  title: string;
  /** Set for entity pages. Compare links use /compare/{slug}. */
  href?: string;
}

export interface BlogCompareFallbackDeps {
  /** Live compares for an entity slug: { slug, title }, most viewed first. */
  comparisonsForEntity: (entitySlug: string) => Promise<{ slug: string; title: string }[]>;
  /** Keeps only compare slugs that render 200, folded onto their canonical slug. */
  filterLive: (slugs: string[]) => Promise<string[]>;
  /** The subset of entity slugs whose /entity page is published. */
  publishedEntities: (slugs: string[]) => Promise<Set<string>>;
  /** "Steam" style label for an entity slug. */
  entityLabel: (slug: string) => string;
}

const MAX_LINKS = 3;

/** Does this compare slug have `side` as one of its two sides? */
export function compareHasSide(compareSlug: string, side: string): boolean {
  const parts = compareSlug.split("-vs-");
  if (parts.length !== 2) return false;
  return parts.some((part) => part === side || part.startsWith(`${side}-`) || part.endsWith(`-${side}`));
}

/** Side names to look up, most specific first. Very short or generic words are skipped. */
export function sideLookupNames(side: string): string[] {
  const words = side.split("-");
  const out = [side];
  if (words.length > 1 && words[0].length >= 4) out.push(words[0]);
  return out.filter((value) => value.length >= 3);
}

export async function blogCompareFallbackLinks(
  blogSlug: string,
  title: string | null | undefined,
  deps: BlogCompareFallbackDeps,
): Promise<BlogCompareFallbackLink[]> {
  const sides = topicSides(blogSlug, title);
  if (!sides) return [];
  const [a, b] = sides;

  const lookups = Array.from(new Set([...sideLookupNames(a), ...sideLookupNames(b)]));
  const rows = (
    await Promise.all(lookups.map((name) => deps.comparisonsForEntity(name).catch(() => [])))
  ).flat();

  const titles = new Map<string, string>();
  for (const row of rows) if (!titles.has(row.slug)) titles.set(row.slug, row.title);

  const sideNames = (side: string) => sideLookupNames(side);
  const hits = (slug: string, side: string) => sideNames(side).some((name) => compareHasSide(slug, name));
  const scored = Array.from(titles.keys())
    .map((slug) => ({ slug, score: (hits(slug, a) ? 1 : 0) + (hits(slug, b) ? 1 : 0) }))
    .filter((item) => item.score > 0)
    .sort((x, y) => y.score - x.score);

  const live = await deps.filterLive(scored.map((item) => item.slug)).catch(() => [] as string[]);
  const liveSet = new Set(live);
  const compares = scored
    .filter((item) => liveSet.has(item.slug))
    .slice(0, MAX_LINKS)
    .map((item) => ({ slug: item.slug, title: titles.get(item.slug) || item.slug.replace(/-/g, " ") }));
  if (compares.length > 0) return compares;

  const published = await deps.publishedEntities([a, b]).catch(() => new Set<string>());
  return [a, b]
    .filter((side) => published.has(side))
    .map((side) => ({ slug: side, title: deps.entityLabel(side), href: `/entity/${side}` }));
}
