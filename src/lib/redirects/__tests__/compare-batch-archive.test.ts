/**
 * DAN-2518 — guards for the batch-archive consolidation tooling.
 *
 * Two things here are easy to break silently and expensive to notice:
 *   1. the status code the compare layer emits (301, not Next's 308 default), and
 *   2. whether the batch layer is actually merged into COMPARE_CONSOLIDATIONS —
 *      a generated file that is written but never imported produces a green run
 *      and zero redirects in prod.
 */
import { describe, it, expect } from "vitest";
import {
  COMPARE_REDIRECTS,
  getConsolidatedCompareSlug,
  isRedirectedCompareSlug,
} from "@/lib/redirects/compare-redirects";
import { BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518 } from "@/lib/redirects/compare-batch-archive-redirects.generated";

describe("DAN-2518 compare redirect status code", () => {
  it("emits 301 on every compare redirect, never 308", () => {
    expect(COMPARE_REDIRECTS.length).toBeGreaterThan(100);
    for (const r of COMPARE_REDIRECTS) {
      expect(r.statusCode).toBe(301);
      // `permanent` and `statusCode` are mutually exclusive in a Next redirect
      // entry — shipping both throws at config load, taking the whole site down.
      expect("permanent" in r).toBe(false);
    }
  });
});

describe("DAN-2518 batch archive layer", () => {
  it("is merged into the live consolidation map", () => {
    for (const [from, to] of Object.entries(BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518)) {
      expect(isRedirectedCompareSlug(from)).toBe(true);
      expect(getConsolidatedCompareSlug(from)).toBe(to);
    }
  });

  it("never self-redirects or points at another batch source", () => {
    const sources = new Set(Object.keys(BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518));
    for (const [from, to] of Object.entries(BATCH_ARCHIVE_CONSOLIDATIONS_DAN2518)) {
      expect(to).not.toBe(from);
      // A target that is itself retired costs a hop of link equity and can
      // ping-pong against an older layer (DAN-2065).
      expect(sources.has(to)).toBe(false);
    }
  });
});
