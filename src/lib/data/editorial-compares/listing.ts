import { CATEGORIES } from "@/lib/utils/constants";
import { listEditorialComparisons } from "./index";

/**
 * ROO-453 — crawlable listings of the in-repo editorial compares.
 *
 * Read-only views over the registry in ./index.ts for the /compare hub, the
 * homepage "Latest in-depth comparisons" strip and the sitemap. Nothing here
 * edits the registry; new entries appear automatically.
 */

export type EditorialCompareCard = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  updatedAt: string;
};

export type EditorialCompareGroup = {
  category: string;
  label: string;
  items: EditorialCompareCard[];
};

function toTime(value: string | null | undefined): number {
  const t = value ? Date.parse(value) : NaN;
  return Number.isFinite(t) ? t : 0;
}

export function categoryLabel(slug: string): string {
  const known = CATEGORIES.find((c) => c.slug === slug);
  if (known) return known.name;
  return slug.replace(/-/g, " ").replace(/\b\w/g, (ch) => ch.toUpperCase());
}

/** Every editorial compare as a link card, in registry order. */
export function listEditorialCompareCards(): EditorialCompareCard[] {
  return listEditorialComparisons().map((c) => {
    const updatedAt = c.metadata.updatedAt || c.metadata.publishedAt || "";
    return {
      slug: c.slug,
      title: c.title,
      category: c.category || "technology",
      publishedAt: c.metadata.publishedAt || updatedAt,
      updatedAt,
    };
  });
}

/**
 * Newest first by published date. Ties keep the later registry entry first,
 * since the registry is append-only and later entries shipped later.
 */
export function latestEditorialCompares(limit: number): EditorialCompareCard[] {
  return listEditorialCompareCards()
    .map((card, index) => ({ card, index }))
    .sort((a, b) => toTime(b.card.publishedAt) - toTime(a.card.publishedAt) || b.index - a.index)
    .slice(0, Math.max(0, limit))
    .map(({ card }) => card);
}

/** Groups for the /compare hub: biggest category first, titles A-Z inside. */
export function groupEditorialComparesByCategory(
  cards: EditorialCompareCard[] = listEditorialCompareCards(),
): EditorialCompareGroup[] {
  const byCategory = new Map<string, EditorialCompareCard[]>();
  for (const card of cards) {
    const list = byCategory.get(card.category) ?? [];
    list.push(card);
    byCategory.set(card.category, list);
  }
  return [...byCategory.entries()]
    .map(([category, items]) => ({
      category,
      label: categoryLabel(category),
      items: [...items].sort((a, b) => a.title.localeCompare(b.title, "en")),
    }))
    .sort((a, b) => b.items.length - a.items.length || a.label.localeCompare(b.label, "en"));
}

/** Most recent content date across the registry (ISO), for sitemap lastmod. */
export function latestEditorialUpdatedAt(): string | null {
  let best = 0;
  for (const card of listEditorialCompareCards()) {
    best = Math.max(best, toTime(card.updatedAt), toTime(card.publishedAt));
  }
  return best > 0 ? new Date(best).toISOString() : null;
}
