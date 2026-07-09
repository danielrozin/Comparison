import { describe, it, expect } from "vitest";

import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "../compare-ordering-redirects.dan1800.generated";

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

  describe("DAN-1800 ordering sweep (84 clusters)", () => {
    it("folds every DAN-1800 retired ordering into its survivor (one hop, permanent)", () => {
      for (const [from, to] of Object.entries(ORDERING_CONSOLIDATIONS_DAN1800)) {
        expect(getConsolidatedCompareSlug(from), `${from} should fold`).toBe(to);
        // survivor must not itself be a source — that would chain/loop
        expect(getConsolidatedCompareSlug(to), `${to} is a survivor`).toBeNull();
      }
    });

    it("every DAN-1800 entry is a genuine A-vs-B / B-vs-A ordering pair (same sorted key)", () => {
      const key = (s: string) =>
        s.split("-vs-").map((t) => t.trim()).sort().join("|");
      for (const [from, to] of Object.entries(ORDERING_CONSOLIDATIONS_DAN1800)) {
        expect(key(from), `${from} vs ${to} not the same pair`).toBe(key(to));
        expect(from, "self-redirect").not.toBe(to);
      }
    });
  });
});
