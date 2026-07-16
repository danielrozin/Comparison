// DAN-2045 — the consolidation map must never 308 onto a page that does not exist.
//
// The ordering layers (DAN-1265 / DAN-1800) paired A-vs-B with B-vs-A while both
// rows were published. DAN-1890 Phase B then archived pages by viewCount and, for
// 163 clusters, archived BOTH members — so the redirect outlived the pages at both
// ends and the source 308'd straight into a 404. Verified in prod 2026-07-16:
// /compare/verizon-vs-att -> 308 -> /compare/att-vs-verizon -> 404, and all 163
// destinations returned 404 on a live sweep.
//
// This is the same failure family as DAN-2065 (a redirect eating a live page); here
// the redirect eats a hop of crawl budget to reach a dead end instead.

import { describe, it, expect } from "vitest";
import { COMPARE_REDIRECTS, isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { DEAD_REDIRECT_SOURCES_DAN2045 } from "@/lib/redirects/compare-dead-redirects.dan2045.generated";

describe("DAN-2045 dead redirect sources", () => {
  it("emits no redirect whose source is known to land on a 404", () => {
    const emitted = COMPARE_REDIRECTS.map((r) => r.source.replace("/compare/", ""));
    const leaked = emitted.filter((s) => DEAD_REDIRECT_SOURCES_DAN2045.includes(s));
    expect(leaked, `these 308 onto a 404 and must be dropped: ${leaked.join(", ")}`).toEqual([]);
  });

  it("does not emit a redirect whose destination is itself a dropped dead source", () => {
    // A surviving redirect must terminate on a real page, so its destination may not
    // be a slug we just established is dead.
    const dead = new Set(DEAD_REDIRECT_SOURCES_DAN2045);
    const badDests = COMPARE_REDIRECTS.filter((r) =>
      dead.has(r.destination.replace("/compare/", ""))
    ).map((r) => `${r.source} -> ${r.destination}`);
    expect(badDests, `redirects pointing at a dead slug: ${badDests.join(", ")}`).toEqual([]);
  });

  it("reports a dropped source as not-redirected, so it 404s directly", () => {
    // isRedirectedCompareSlug drives canonicalComparisonWhere()'s exclusion list.
    // A dropped source is archived, so it is excluded by status anyway — but it must
    // no longer claim to be a redirect, or the edge would keep bouncing it.
    for (const slug of DEAD_REDIRECT_SOURCES_DAN2045.slice(0, 25)) {
      expect(isRedirectedCompareSlug(slug), `${slug} should no longer 308`).toBe(false);
    }
  });

  it("keeps the redirects that still point at live pages", () => {
    // Guard against a regression that drops the whole map rather than just the dead
    // entries. 123 survived the 2026-07-16 sweep of 286.
    expect(COMPARE_REDIRECTS.length).toBeGreaterThan(100);
  });

  it("still folds the DAN-1908 PS5 cluster (a live destination must survive the drop)", () => {
    const hit = COMPARE_REDIRECTS.find((r) => r.source === "/compare/xbox-series-x-vs-ps5-pro");
    expect(hit?.destination).toBe("/compare/ps5-pro-vs-xbox-series-x");
  });
});
