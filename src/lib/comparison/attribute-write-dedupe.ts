/**
 * ROO-154: stop new duplicate Key Facts rows at write time.
 *
 * Duplicate rows came from enrichment runs that saved a metric under a new
 * attribute slug ("total-gdp-2024", "gdp-nominal") instead of updating the
 * attribute that already held it. Each slug got its own AttributeValue, so
 * every run added another row to the page.
 *
 * planAttributeWrites maps each incoming attribute to the slug it should be
 * written under. An existing attribute of the same entity type with the same
 * canonical metric name wins, so the value is updated in place. A second
 * incoming attribute with the same canonical name in one batch is skipped.
 */
import { canonicalizeMetricName } from "./metric-table-guard";

export interface IncomingAttribute {
  slug: string;
  name: string;
  unit?: string | null;
}

export interface ExistingAttribute {
  slug: string;
  name: string;
  unit?: string | null;
}

export interface AttributeWritePlan<T extends IncomingAttribute> {
  /** Attributes to write, with slug replaced by the canonical existing slug. */
  writes: Array<T & { originalSlug: string }>;
  /** Incoming attributes dropped because the batch already has that metric. */
  skipped: T[];
}

export function canonicalMetricKey(
  attr: { slug: string; name: string; unit?: string | null },
  entityLabels: string[] = [],
): string {
  const fromName = canonicalizeMetricName(attr.name, attr.unit ?? null, entityLabels);
  if (fromName) return fromName;
  return canonicalizeMetricName(attr.slug.replace(/-/g, " "), attr.unit ?? null, entityLabels);
}

/**
 * existing should be ordered oldest first; the first attribute seen for a
 * canonical key is the one reused.
 */
export function planAttributeWrites<T extends IncomingAttribute>(
  incoming: T[],
  existing: ExistingAttribute[],
  entityLabels: string[] = [],
): AttributeWritePlan<T> {
  const existingByKey = new Map<string, string>();
  const existingSlugs = new Set<string>();
  for (const attr of existing) {
    existingSlugs.add(attr.slug);
    const key = canonicalMetricKey(attr, entityLabels);
    if (key && !existingByKey.has(key)) existingByKey.set(key, attr.slug);
  }

  const seenKeys = new Set<string>();
  const seenSlugs = new Set<string>();
  const writes: Array<T & { originalSlug: string }> = [];
  const skipped: T[] = [];

  for (const attr of incoming) {
    const key = canonicalMetricKey(attr, entityLabels);
    // An exact slug match always keeps its own slug.
    let slug = attr.slug;
    if (!existingSlugs.has(attr.slug) && key && existingByKey.has(key)) {
      slug = existingByKey.get(key)!;
    }
    if ((key && seenKeys.has(key)) || seenSlugs.has(slug)) {
      skipped.push(attr);
      continue;
    }
    if (key) seenKeys.add(key);
    seenSlugs.add(slug);
    writes.push({ ...attr, slug, originalSlug: attr.slug });
  }

  return { writes, skipped };
}
