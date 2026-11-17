/**
 * ROO-411 — product-named affiliate CTA labels. Client-safe (no server imports).
 */

/** "MacBook Air 15-inch (M5, 2026)" → "MacBook Air 15-inch". */
export function shortProductName(name: string): string {
  const stripped = name.replace(/\s*\([^)]*\)/g, "").replace(/\s+/g, " ").trim();
  return stripped || name.trim();
}

/** Product-named CTA label, e.g. "Check RTX 5070 price on Amazon". */
export function affiliateCtaLabel(entityName: string, partner: string): string {
  const product = shortProductName(entityName);
  if (partner === "amazon") return `Check ${product} price on Amazon`;
  return `Check ${product} price`;
}
