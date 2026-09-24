/**
 * ROO-53 — compact above-fold compare destinations for /blog and /trending.
 *
 * The hubs already know which compares are live (featured list, home chips,
 * trending ranks). This only orders and dedupes those slugs. It never invents
 * a slug, and it stays free of server-only imports so client code and tests
 * can call it.
 */

export interface PopularCompareDestination {
  slug: string;
  label: string;
}

export function buildPopularCompareDestinations(
  primarySlug: string | null | undefined,
  primaryTitle: string | null | undefined,
  chips: readonly { slug: string; label: string }[],
  limit = 2,
): PopularCompareDestination[] {
  const items: PopularCompareDestination[] = [];
  const seen = new Set<string>();
  const cap = Math.max(0, limit);

  function push(slug: string | null | undefined, label: string | null | undefined) {
    const clean = slug?.trim();
    if (!clean || seen.has(clean) || items.length >= cap) return;
    seen.add(clean);
    const text = label?.trim();
    items.push({
      slug: clean,
      label: text || clean.replace(/-/g, " "),
    });
  }

  push(primarySlug, primaryTitle);
  for (const chip of chips) push(chip.slug, chip.label);
  return items;
}
