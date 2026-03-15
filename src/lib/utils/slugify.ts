export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
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
