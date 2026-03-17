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

export function parseComparisonSlug(slug: string): { entityA: string; entityB: string } | null {
  const match = slug.match(/^(.+)-vs-(.+)$/);
  if (!match) return null;
  return { entityA: match[1], entityB: match[2] };
}
