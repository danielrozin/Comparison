import { describe, it, expect } from "vitest";

import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";

describe("COMPARE_REDIRECTS", () => {
  it("308s the DAN-1281 shared-model-number legacy stub straight to the sitemap canonical", () => {
    const hit = COMPARE_REDIRECTS.find(
      (r) => r.source === "/compare/iphone-15-vs-16",
    );
    expect(hit, "missing redirect for /compare/iphone-15-vs-16").toBeDefined();
    // One hop to the REAL canonical — never to the mangled `16-vs-iphone-15`.
    expect(hit?.destination).toBe("/compare/iphone-15-vs-iphone-16");
    expect(hit?.permanent).toBe(true);
  });

  it("never chains: no redirect destination is itself a redirect source (one hop)", () => {
    const sources = new Set(COMPARE_REDIRECTS.map((r) => r.source));
    for (const r of COMPARE_REDIRECTS) {
      expect(
        sources.has(r.destination),
        `chain: ${r.source} -> ${r.destination} -> ...`,
      ).toBe(false);
    }
  });

  it("exposes the consolidation map at runtime for source-prevention", () => {
    expect(getConsolidatedCompareSlug("iphone-15-vs-16")).toBe(
      "iphone-15-vs-iphone-16",
    );
    expect(getConsolidatedCompareSlug("iphone-15-vs-iphone-16")).toBeNull();
  });
});
