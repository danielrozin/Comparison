export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Transliterate common non-Latin characters to ASCII equivalents
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    // Keep Unicode letters, digits, spaces, and hyphens (supports Hebrew, Arabic, CJK, etc.)
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function comparisonSlug(entityA: string, entityB: string): string {
  const a = slugify(entityA);
  const b = slugify(entityB);
  // Always sort alphabetically for canonical consistency
  return a < b ? `${a}-vs-${b}` : `${b}-vs-${a}`;
}

/**
 * N-entity canonical slug builder. Sorts alphabetically and joins with -vs-.
 * For N=2 produces the same result as comparisonSlug().
 */
export function comparisonSlugN(entities: string[]): string {
  return entities
    .map(slugify)
    .filter((s) => s.length > 0)
    .sort()
    .join("-vs-");
}

/**
 * Parses a comparison slug into N entity slugs.
 *
 * For backward compatibility, returns entityA/entityB (first two entries)
 * alongside the full entities array. Callers that need N-entity support
 * should read `entities`.
 *
 * Returns null when the slug does not contain `-vs-` or any segment is empty.
 */
export function parseComparisonSlug(
  slug: string
): { entityA: string; entityB: string; entities: string[] } | null {
  if (!slug.includes("-vs-")) return null;
  const parts = slug.split("-vs-").map((p) => p.trim()).filter((p) => p.length > 0);
  if (parts.length < 2) return null;
  return { entityA: parts[0], entityB: parts[1], entities: parts };
}
