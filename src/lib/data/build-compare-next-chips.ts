/**
 * ROO-29 — server-side builder for live next-step compare chips.
 *
 * Merges page related comparisons + cluster curated fallbacks + defaults,
 * then DAN-2581 live-filters so we never emit a /compare 404.
 */

import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import {
  COMPARE_NEXT_CLUSTER_FALLBACKS,
  COMPARE_NEXT_DEFAULT_CANDIDATES,
  COMPARE_NEXT_MAX_CHIPS,
  type CompareNextChipCandidate,
} from "@/lib/data/compare-next-constants";

export type CompareNextChip = {
  slug: string;
  label: string;
};

function labelFromTitle(title: string): string {
  const beforeColon = title.split(":")[0]?.trim() || title;
  if (beforeColon.length <= 42) return beforeColon;
  return `${beforeColon.slice(0, 39).trimEnd()}…`;
}

/**
 * Build up to COMPARE_NEXT_MAX_CHIPS live next-step chips for a compare lander.
 * Prefer related → cluster → defaults; never include the current slug.
 */
export async function buildCompareNextChips(
  currentSlug: string,
  related: ReadonlyArray<{ slug: string; title: string }>
): Promise<CompareNextChip[]> {
  const cluster = COMPARE_NEXT_CLUSTER_FALLBACKS[currentSlug] ?? [];

  const candidates: CompareNextChipCandidate[] = [];
  const seen = new Set<string>();

  const push = (slug: string, label: string) => {
    if (!slug || slug === currentSlug || seen.has(slug)) return;
    seen.add(slug);
    candidates.push({ slug, label });
  };

  for (const r of related) {
    push(r.slug, labelFromTitle(r.title));
  }
  for (const c of cluster) {
    push(c.slug, c.label);
  }
  for (const c of COMPARE_NEXT_DEFAULT_CANDIDATES) {
    push(c.slug, c.label);
  }

  if (candidates.length === 0) return [];

  const live = await filterLiveCompareSlugs(candidates.map((c) => c.slug));
  const labelBySlug = new Map(candidates.map((c) => [c.slug, c.label] as const));

  const chips: CompareNextChip[] = [];
  for (const slug of live) {
    if (slug === currentSlug) continue;
    chips.push({
      slug,
      label: labelBySlug.get(slug) || slug.replace(/-/g, " "),
    });
    if (chips.length >= COMPARE_NEXT_MAX_CHIPS) break;
  }
  return chips;
}
