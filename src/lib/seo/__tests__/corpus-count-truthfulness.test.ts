/**
 * DAN-2112 — the site must never advertise a corpus larger than it has.
 *
 * The site-wide JSON-LD emitted `numberOfItems: 491` (raw published rows, 22 of them
 * redirect sources) and a hardcoded `500+` on every page that never had a number behind
 * it at all. Both were claims a journalist could disprove by clicking. The live catalog
 * is 468 direct-200 `/compare/` pages, verified against sitemap/1.xml on 2026-07-14.
 *
 * These tests pin the two rules that keep the number honest:
 *   1. the schema builders default to the canonical count, never an invented literal;
 *   2. no shipped string overstates the corpus.
 */
import { describe, it, expect } from "vitest";
import { organizationSchema, dataCatalogSchema, webSiteSchema } from "../schema";
import { CANONICAL_COMPARISON_COUNT_FALLBACK } from "@/lib/db/canonical-comparisons";

// Every string in a schema object, however deeply nested.
function allStrings(node: unknown, out: string[] = []): string[] {
  if (typeof node === "string") out.push(node);
  else if (Array.isArray(node)) node.forEach((n) => allStrings(n, out));
  else if (node && typeof node === "object") Object.values(node).forEach((n) => allStrings(n, out));
  return out;
}

const BUILDERS = [
  ["organizationSchema", organizationSchema],
  ["dataCatalogSchema", dataCatalogSchema],
  ["webSiteSchema", webSiteSchema],
] as const;

describe("corpus count in site-wide JSON-LD", () => {
  it.each(BUILDERS)("%s defaults to the canonical count, not an invented literal", (_name, build) => {
    const strings = allStrings(build());
    // The two numbers the site used to claim. Neither was ever true.
    expect(strings.some((s) => s.includes("491"))).toBe(false);
    expect(strings.some((s) => s.includes("500+"))).toBe(false);
    expect(strings.some((s) => s.includes(String(CANONICAL_COMPARISON_COUNT_FALLBACK)))).toBe(true);
  });

  it.each(BUILDERS)("%s reports the count it is given, so a live DB count wins", (_name, build) => {
    const strings = allStrings(build(1234));
    expect(strings.some((s) => s.includes("1234"))).toBe(true);
    expect(strings.some((s) => s.includes(String(CANONICAL_COMPARISON_COUNT_FALLBACK)))).toBe(false);
  });

  it("states numberOfItems as an exact machine-readable count for Google Dataset Search", () => {
    const catalog = dataCatalogSchema(468) as { dataset: { numberOfItems: number } };
    expect(catalog.dataset.numberOfItems).toBe(468);
  });

  it("never appends a '+' to the count — it is exact, and '+' reads as 'at least'", () => {
    for (const [, build] of BUILDERS) {
      for (const s of allStrings(build(468))) {
        expect(s).not.toContain("468+");
      }
    }
  });
});

describe("CANONICAL_COMPARISON_COUNT_FALLBACK", () => {
  it("is a floor we can defend — never larger than the live catalog", () => {
    // 468 direct-200 /compare/ URLs in sitemap/1.xml, swept 2026-07-14. If the catalog
    // shrinks below this, the constant is now a lie and must come down with it.
    expect(CANONICAL_COMPARISON_COUNT_FALLBACK).toBeLessThanOrEqual(468);
  });
});
