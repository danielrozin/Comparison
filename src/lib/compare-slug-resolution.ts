/**
 * Which URL a two-entity /compare request should render.
 *
 * A published slug stays where it is, even when it is not alphabetical.
 * Alias, reverse-order, and keyword-suffix forms redirect only to a row
 * that is actually live. A pair with no live row shows the building shell
 * at the canonical slug. An archived, draft, or review row stays a 404.
 */

import { canonicalSlug, ENTITY_ALIASES } from "@/lib/services/entity-aliases";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { canonicalRequestedComparisonSlug } from "@/lib/parse-comparison-query";
import {
  isDegenerateComparisonSlug,
  parseComparisonSlug,
  stripKeywordSuffixSlug,
} from "@/lib/utils/slugify";

export type SlugRowState = "live" | "hidden" | "missing";

export type ComparePageDecision =
  | { action: "render" }
  | { action: "redirect"; destination: string }
  | { action: "shell"; slug: string }
  | { action: "not_found" };

const HIDDEN_STATUSES = new Set(["archived", "draft", "review"]);

const INVERSE_ALIASES: ReadonlyMap<string, readonly string[]> = (() => {
  const map = new Map<string, string[]>();
  for (const [alias, target] of Object.entries(ENTITY_ALIASES)) {
    const list = map.get(target) ?? [];
    list.push(alias);
    map.set(target, list);
  }
  return map;
})();

/** Canonical entity slug plus every curated alias that points at it. */
export function entitySlugVariants(entity: string): string[] {
  const canonical = canonicalSlug(entity);
  const variants = new Set<string>([entity, canonical]);
  for (const alias of INVERSE_ALIASES.get(canonical) ?? []) variants.add(alias);
  for (const alias of INVERSE_ALIASES.get(entity) ?? []) variants.add(alias);
  return [...variants];
}

function addSlug(into: string[], seen: Set<string>, value: string | null | undefined) {
  if (!value || seen.has(value)) return;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(value)) return;
  if (isDegenerateComparisonSlug(value)) return;
  seen.add(value);
  into.push(value);
}

/**
 * Slugs that name the same two-entity matchup: the request itself, the
 * reverse order, the alias-resolved slug, the suffix-stripped slug, and
 * the curated alias spellings of each side (usa ↔ united-states).
 */
export function relatedComparisonSlugs(slug: string): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();
  const add = (value: string | null | undefined) => addSlug(ordered, seen, value);

  add(slug);
  const parsed = parseComparisonSlug(slug);
  if (!parsed || parsed.entities.length !== 2) return ordered;

  const [left, right] = parsed.entities;
  add(`${right}-vs-${left}`);

  const canonical = canonicalRequestedComparisonSlug(slug);
  add(canonical);
  const canonicalParts = canonical ? parseComparisonSlug(canonical) : null;
  if (canonicalParts && canonicalParts.entities.length === 2) {
    add(`${canonicalParts.entities[1]}-vs-${canonicalParts.entities[0]}`);
  }

  const stripped = stripKeywordSuffixSlug(slug);
  add(stripped);
  if (stripped) {
    const strippedParts = parseComparisonSlug(stripped);
    if (strippedParts && strippedParts.entities.length === 2) {
      add(`${strippedParts.entities[1]}-vs-${strippedParts.entities[0]}`);
    }
  }
  if (canonical) add(stripKeywordSuffixSlug(canonical));

  for (const a of entitySlugVariants(left)) {
    for (const b of entitySlugVariants(right)) {
      if (a === b) continue;
      add(`${a}-vs-${b}`);
      add(`${b}-vs-${a}`);
      add(stripKeywordSuffixSlug(`${a}-vs-${b}`));
      add(stripKeywordSuffixSlug(`${b}-vs-${a}`));
    }
  }

  return ordered;
}

export function isHiddenComparisonStatus(status: string | null | undefined): boolean {
  return typeof status === "string" && HIDDEN_STATUSES.has(status);
}

/**
 * Page decision for a two-entity slug.
 *
 * `stateOf` is the database. A live requested slug always renders. Any other
 * redirect destination is a related slug that `stateOf` reports as live.
 * When nothing is live and nothing is hidden, `shell` names the canonical
 * URL where the building shell belongs (it may differ from `slug`).
 */
export function decideComparePage(
  slug: string,
  stateOf: (candidate: string) => SlugRowState,
): ComparePageDecision {
  if (stateOf(slug) === "live") return { action: "render" };

  const related = relatedComparisonSlugs(slug);
  for (const candidate of related) {
    if (candidate === slug) continue;
    // An edge-map source would 301 again. Only a slug that can render is safe.
    if (getConsolidatedCompareSlug(candidate) !== null) continue;
    if (stateOf(candidate) === "live") {
      return { action: "redirect", destination: candidate };
    }
  }

  if (related.some((candidate) => stateOf(candidate) === "hidden")) {
    return { action: "not_found" };
  }

  const canonical = canonicalRequestedComparisonSlug(slug);
  const shell =
    canonical && getConsolidatedCompareSlug(canonical) === null ? canonical : null;
  if (!shell) return { action: "not_found" };
  return { action: "shell", slug: shell };
}
