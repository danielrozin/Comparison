/**
 * ROO-264 follow-up — entity-matched picks for the "Compare next" row under
 * the verdict.
 *
 * The first version of the row reused the ROO-29 chips, which fill up with
 * trending and default compares. On mobile that showed picks like
 * "Bitcoin vs Ethereum" under Amex vs Mastercard, the reverse of the page
 * itself ("Korean War vs Vietnam War"), or the same label twice. The row got
 * 0 clicks in a week. This builder only keeps compares that share an entity
 * with the current page, drops the reversed pair and duplicate labels, and
 * live-filters so nothing 404s. With fewer than two matches the row hides.
 */

import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import { getComparisonsForEntity } from "@/lib/services/comparison-service";

export const UNDER_VERDICT_MAX_CHIPS = 3;
const PER_ENTITY_POOL = 8;

export type UnderVerdictChip = { slug: string; label: string };

type Candidate = { slug: string; title: string };

function labelFromTitle(title: string): string {
  const beforeColon = title.split(":")[0]?.trim() || title;
  if (beforeColon.length <= 42) return beforeColon;
  return `${beforeColon.slice(0, 39).trimEnd()}…`;
}

/** "a-vs-b" and "b-vs-a" (any order, any count) are the same matchup. */
export function matchupKey(slug: string): string {
  return slug
    .toLowerCase()
    .split("-vs-")
    .map((s) => s.trim())
    .filter(Boolean)
    .sort()
    .join("|");
}

const CORPORATE_SUFFIX = /-(corporation|corp|inc|company|co|group|holdings|worldwide|benefits|international|plc|ltd|llc)$/;

function slugify(v: string): string {
  return v
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Entity keys for the page: its own slug sides ("amex", "master-card") plus
 * entity slugs and names with corporate suffixes stripped ("kohl-s-corporation"
 * -> "kohl-s", "Target Corporation" -> "target").
 */
export function entityKeys(
  currentSlug: string,
  entities: ReadonlyArray<{ slug: string; name: string }>
): string[] {
  const keys = new Set<string>();
  const add = (v: string) => {
    let k = slugify(v);
    for (let i = 0; i < 2; i++) k = k.replace(CORPORATE_SUFFIX, "");
    if (k.length >= 2) keys.add(k);
  };
  for (const side of currentSlug.split("-vs-")) add(side);
  for (const e of entities) {
    if (e.slug) add(e.slug);
    if (e.name) add(e.name);
  }
  return [...keys];
}

/** True when one side of the candidate compare is (or starts/ends with) a page entity. */
export function sharesEntity(candidateSlug: string, keys: ReadonlyArray<string>): boolean {
  const sides = candidateSlug.toLowerCase().split("-vs-");
  return sides.some((side) => {
    const flat = side.replace(/-/g, "");
    return keys.some(
      (k) =>
        side === k ||
        flat === k.replace(/-/g, "") ||
        side.startsWith(`${k}-`) ||
        side.endsWith(`-${k}`)
    );
  });
}

/** Pure ranking step (exported for tests): entity-matched, no reverse, no dup labels. */
export function pickUnderVerdictCandidates(
  currentSlug: string,
  entities: ReadonlyArray<{ slug: string; name: string }>,
  pools: ReadonlyArray<ReadonlyArray<Candidate>>
): Candidate[] {
  const selfKey = matchupKey(currentSlug);
  const keys = entityKeys(currentSlug, entities);
  const seenSlugs = new Set<string>([currentSlug]);
  const seenKeys = new Set<string>([selfKey]);
  const seenLabels = new Set<string>();
  const out: Candidate[] = [];
  // Interleave the pools so both entities get a pick before either gets two.
  const longest = Math.max(0, ...pools.map((p) => p.length));
  for (let i = 0; i < longest; i++) {
    for (const pool of pools) {
      const c = pool[i];
      if (!c || !c.slug || seenSlugs.has(c.slug)) continue;
      seenSlugs.add(c.slug);
      const key = matchupKey(c.slug);
      if (seenKeys.has(key)) continue;
      if (!sharesEntity(c.slug, keys)) continue;
      const label = labelFromTitle(c.title || c.slug.replace(/-/g, " "));
      const labelKey = label.toLowerCase();
      if (seenLabels.has(labelKey)) continue;
      seenKeys.add(key);
      seenLabels.add(labelKey);
      out.push({ slug: c.slug, title: label });
    }
  }
  return out;
}

export async function buildUnderVerdictChips(
  currentSlug: string,
  entities: ReadonlyArray<{ slug: string; name: string }>,
  related: ReadonlyArray<Candidate>
): Promise<UnderVerdictChip[]> {
  // Look up by the page's own slug sides first ("target", "amex"): entity
  // slugs are often long-form ("target-corporation") and match few compares.
  const lookups = [
    ...new Set([...currentSlug.split("-vs-"), ...entities.map((e) => e.slug)].filter(Boolean)),
  ].slice(0, 4);
  const entityPools = await Promise.all(
    lookups.map(async (key) => {
      if (key.length < 2) return [] as Candidate[];
      try {
        return (await getComparisonsForEntity(key)).slice(0, PER_ENTITY_POOL);
      } catch {
        return [] as Candidate[];
      }
    })
  );
  // Page-curated related compares first, then the per-entity pools.
  const ranked = pickUnderVerdictCandidates(currentSlug, entities, [related, ...entityPools]);
  if (ranked.length < 2) return [];

  const labelBySlug = new Map(ranked.map((c) => [c.slug, c.title] as const));
  const live = await filterLiveCompareSlugs(ranked.map((c) => c.slug));
  const chips: UnderVerdictChip[] = [];
  const keys = new Set<string>([matchupKey(currentSlug)]);
  for (const slug of live) {
    const key = matchupKey(slug);
    if (slug === currentSlug || keys.has(key)) continue;
    keys.add(key);
    chips.push({ slug, label: labelBySlug.get(slug) || slug.replace(/-/g, " ") });
    if (chips.length >= UNDER_VERDICT_MAX_CHIPS) break;
  }
  return chips.length >= 2 ? chips : [];
}
