/**
 * Decide whether a generated entity may reuse a row that already has its slug.
 *
 * Slug alone is not identity. `kayak` is Kayak.com, a travel site. A canoe
 * versus kayak page that reuses that row shows the travel site's metrics on
 * a boat. A real repeat of the same thing (iPhone 17) still reuses the row.
 */

import { slugify } from "@/lib/utils/slugify";

/** Plural type slugs that mean the same kind of thing as the singular. */
const TYPE_ALIASES: Record<string, string> = {
  products: "product",
  companies: "company",
  countries: "country",
  brands: "brand",
  people: "person",
  persons: "person",
  teams: "team",
  websites: "website",
};

/**
 * Categories too broad to prove two rows are the same thing. A travel site
 * and a boat can both sit in "products".
 */
const BROAD_CATEGORIES = new Set(["general", "products", "product", "brands", "brand"]);

const STOP_WORDS = new Set([
  "a", "an", "the", "and", "or", "of", "for", "with", "to", "in", "on", "at",
  "by", "from", "its", "is", "are", "as", "via", "per", "vs", "versus",
]);

/** Enough stored metrics that an empty overlap means a different subject. */
const METRIC_MISMATCH_MIN = 8;

export interface EntityIdentity {
  slug: string;
  name: string;
  shortDesc: string | null;
  entityTypeSlug: string;
  /** Categories of comparisons this entity already appears in. */
  categories: string[];
  attributeSlugs: string[];
}

export interface GeneratedEntityIdentity {
  desiredSlug: string;
  name: string;
  shortDesc: string | null;
  entityTypeSlug: string;
  comparisonCategory: string | null;
  attributeSlugs: string[];
}

export interface EntitySlugDecision {
  slug: string;
  /** True when the returned slug is an entity that already exists and matches. */
  reuse: boolean;
}

export function canonicalEntityType(slug: string): string {
  const normalized = slug.toLowerCase().trim();
  return TYPE_ALIASES[normalized] ?? normalized;
}

function typesCompatible(existing: string, generated: string): boolean {
  if (!existing || !generated) return true;
  return canonicalEntityType(existing) === canonicalEntityType(generated);
}

function normalizeCategory(category: string): string {
  return category.toLowerCase().trim();
}

function specificCategories(categories: string[]): string[] {
  return categories
    .map(normalizeCategory)
    .filter((category) => category.length > 0 && !BROAD_CATEGORIES.has(category));
}

function significantTokens(text: string, name: string): string[] {
  const nameTokens = new Set(slugify(name).split("-").filter(Boolean));
  return slugify(text)
    .split("-")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token) && !nameTokens.has(token));
}

function descriptionsClearlyDiffer(existing: EntityIdentity, generated: GeneratedEntityIdentity): boolean {
  const existingTokens = significantTokens(existing.shortDesc ?? "", existing.name);
  const generatedTokens = significantTokens(generated.shortDesc ?? "", generated.name);
  // One thin label ("Smartphone") is not enough to prove a different thing.
  if (existingTokens.length < 2 || generatedTokens.length < 2) return false;
  const existingSet = new Set(existingTokens);
  return generatedTokens.every((token) => !existingSet.has(token));
}

function metricsClearlyDiffer(existing: EntityIdentity, generated: GeneratedEntityIdentity): boolean {
  if (existing.attributeSlugs.length < METRIC_MISMATCH_MIN) return false;
  if (generated.attributeSlugs.length < 1) return false;
  const stored = new Set(existing.attributeSlugs);
  return generated.attributeSlugs.every((slug) => !stored.has(slug));
}

/**
 * True when the stored row is a different kind of thing than the one just
 * generated. Pluralization (`product` / `products`) is not a difference.
 * A travel website versus a boat is.
 */
export function entityIdentityClearlyDiffers(
  existing: EntityIdentity,
  generated: GeneratedEntityIdentity,
): boolean {
  if (!typesCompatible(existing.entityTypeSlug, generated.entityTypeSlug)) return true;

  const generatedCategory = generated.comparisonCategory
    ? normalizeCategory(generated.comparisonCategory)
    : "";
  const existingSpecific = specificCategories(existing.categories);
  const generatedIsSpecific = generatedCategory.length > 0 && !BROAD_CATEGORIES.has(generatedCategory);
  if (generatedIsSpecific && existingSpecific.length > 0 && !existingSpecific.includes(generatedCategory)) {
    return true;
  }
  // Same specific category (technology for iPhone 17, travel for Kayak.com)
  // is a genuine match even when the new blurb uses different words.
  if (generatedIsSpecific && existingSpecific.includes(generatedCategory)) return false;

  // "products" covers both a travel site and a boat. When the category does
  // not settle it, a description that names a different kind of thing — or a
  // large metric table with nothing in common — is a different entity.
  if (descriptionsClearlyDiffer(existing, generated)) return true;
  if (metricsClearlyDiffer(existing, generated)) return true;

  return false;
}

/** Last meaningful word of the short description: "Covered boat" → "boat". */
export function entityKindQualifier(generated: GeneratedEntityIdentity): string {
  const fromDescription = significantTokens(generated.shortDesc ?? "", generated.name);
  const last = fromDescription[fromDescription.length - 1];
  if (last) return last;

  const type = canonicalEntityType(generated.entityTypeSlug);
  if (type && type !== "general" && type !== "product") return type;

  const category = generated.comparisonCategory ? normalizeCategory(generated.comparisonCategory) : "";
  if (category && !BROAD_CATEGORIES.has(category)) return category;
  return "entity";
}

/**
 * Reuse `desiredSlug` when the stored entity is the same thing. Otherwise
 * return a free slug such as `kayak-boat`.
 */
export function resolveGeneratedEntitySlug(
  generated: GeneratedEntityIdentity,
  existingBySlug: ReadonlyMap<string, EntityIdentity>,
): EntitySlugDecision {
  const desired = generated.desiredSlug;
  const existing = existingBySlug.get(desired);
  if (!existing || !entityIdentityClearlyDiffers(existing, generated)) {
    return { slug: desired, reuse: Boolean(existing) };
  }

  const qualifier = entityKindQualifier(generated);
  const base = qualifier && `${desired}-${qualifier}` !== desired
    ? `${desired}-${qualifier}`
    : `${desired}-entity`;

  let candidate = base;
  let suffix = 2;
  while (suffix <= 20) {
    const occupant = existingBySlug.get(candidate);
    if (!occupant || !entityIdentityClearlyDiffers(occupant, generated)) {
      return { slug: candidate, reuse: Boolean(occupant) };
    }
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return { slug: candidate, reuse: false };
}
