/**
 * DAN-2112 — the site must never advertise a corpus larger than it has.
 *
 * The site-wide JSON-LD emitted `numberOfItems: 491` (raw published rows, 22 of them
 * redirect sources) and a hardcoded `500+` on every page that never had a number behind
 * it at all. Both were claims a journalist could disprove by clicking. The live catalog
 * is 454 direct-200 `/compare/` pages, verified against sitemap/1.xml on 2026-07-14 (post-DAN-2078).
 *
 * These tests pin the two rules that keep the number honest:
 *   1. the schema builders default to the canonical count, never an invented literal;
 *   2. no shipped string overstates the corpus.
 */
import { describe, it, expect } from "vitest";
import { organizationSchema, dataCatalogSchema, webSiteSchema } from "../schema";
import { CANONICAL_COMPARISON_COUNT_FALLBACK } from "@/lib/db/canonical-comparisons";
import { REDIRECTED_COMPARE_SLUGS } from "@/lib/redirects/compare-redirects";

/**
 * The live sweep these tests are pinned to: every /compare/ URL in sitemap/1.xml was
 * HTTP-status-checked on 2026-07-14 (post-DAN-2078). 454/454 returned a direct 200 —
 * 0 redirects, 0 404s — and 286 slugs were retired into the consolidation map.
 * Re-run `scripts/dan2067-verify.ts` and move both numbers together after any
 * consolidation batch.
 *
 * DAN-2045 (2026-07-16) lowered the redirect baseline 286 -> 123 without touching the
 * catalog. That is the one legitimate way this number falls: 163 of the 286 redirects
 * pointed at a page that no longer exists (both ends archived by DAN-1890 Phase B), so
 * they 308'd into a 404 and were dropped. Un-retiring an ARCHIVED source cannot grow
 * the catalog — archived rows are excluded by status, not by the redirect map — and
 * the live count was verified unchanged at 457 canonical rows either side of the drop.
 * A drop is only ever safe under that proof; scripts/dan2045-generate-dead-redirects.ts
 * refuses to list a source that is still published, which is what keeps it true.
 */
const CATALOG_AT_LAST_SWEEP = 454;
const REDIRECTS_AT_LAST_SWEEP = 123;
const LIVE_CATALOG_CEILING = CATALOG_AT_LAST_SWEEP;

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
    const catalog = dataCatalogSchema(CATALOG_AT_LAST_SWEEP) as { dataset: { numberOfItems: number } };
    expect(catalog.dataset.numberOfItems).toBe(CATALOG_AT_LAST_SWEEP);
  });

  it("never appends a '+' to the count — it is exact, and '+' reads as 'at least'", () => {
    for (const [, build] of BUILDERS) {
      for (const s of allStrings(build(CATALOG_AT_LAST_SWEEP))) {
        expect(s).not.toContain(`${CATALOG_AT_LAST_SWEEP}+`);
      }
    }
  });
});

describe("CANONICAL_COMPARISON_COUNT_FALLBACK", () => {
  it("is a floor we can defend — never larger than the live catalog", () => {
    // 454 direct-200 /compare/ URLs in sitemap/1.xml, swept 2026-07-14 after DAN-2078.
    // If the catalog shrinks below this, the constant is a lie and must come down with it.
    expect(CANONICAL_COMPARISON_COUNT_FALLBACK).toBeLessThanOrEqual(LIVE_CATALOG_CEILING);
  });

  it("does not exceed the catalog implied by the consolidation map", () => {
    // The failure this pins: DAN-2078 folded 14 duplicate rivalries, adding 14 slugs to
    // REDIRECTED_COMPARE_SLUGS and shrinking the catalog 468 -> 454, but the constant
    // stayed at 468 and shipped an overstated corpus in every page's JSON-LD. The
    // consolidation map is the only static thing that moves in lockstep with the catalog,
    // so tie the ceiling to it: retiring more slugs must lower the number we advertise.
    const retiredSinceSweep = REDIRECTED_COMPARE_SLUGS.length - REDIRECTS_AT_LAST_SWEEP;
    expect(retiredSinceSweep).toBeGreaterThanOrEqual(0); // slugs are retired, never un-retired
    expect(CANONICAL_COMPARISON_COUNT_FALLBACK).toBeLessThanOrEqual(
      CATALOG_AT_LAST_SWEEP - retiredSinceSweep
    );
  });
});
