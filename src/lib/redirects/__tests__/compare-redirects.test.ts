import { describe, it, expect } from "vitest";

import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import { ORDERING_CONSOLIDATIONS_DAN1800 } from "../compare-ordering-redirects.dan1800.generated";
import { RIVALRY_CONSOLIDATIONS_DAN2078 } from "../compare-rivalry-redirects.dan2078.generated";
import { DEAD_REDIRECT_SOURCES_DAN2045 } from "../compare-dead-redirects.dan2045.generated";

describe("COMPARE_REDIRECTS", () => {
  it("301s the DAN-1281 shared-model-number legacy stub straight to the sitemap canonical", () => {
    const hit = COMPARE_REDIRECTS.find(
      (r) => r.source === "/compare/iphone-15-vs-16",
    );
    expect(hit, "missing redirect for /compare/iphone-15-vs-16").toBeDefined();
    // One hop to the REAL canonical — never to the mangled `16-vs-iphone-15`.
    expect(hit?.destination).toBe("/compare/iphone-15-vs-iphone-16");
    // DAN-2518: the compare layer emits an explicit 301 (was `permanent: true`,
    // which Next serves as 308).
    expect(hit?.statusCode).toBe(301);
  });

  describe("DAN-1908 PS5 Pro vs Xbox Series X cluster", () => {
    const CANONICAL = "ps5-pro-vs-xbox-series-x";
    const VARIANTS = [
      "xbox-series-x-vs-ps5-pro",
      "ps5-pro-vs-xbox-series-x-performance-comparison-2026",
      "ps5-pro-vs-xbox-series-x-performance-comparison-2026-keyword-suffix",
      "ps5-pro-vs-xbox-series-x-performance",
      "ps5-pro-vs-xbox-series-x-specs",
      "xbox-series-x-vs-ps5-pro-specs",
    ];

    it("folds every variant into the live clean canonical (never the archived keyword slug)", () => {
      for (const from of VARIANTS) {
        expect(getConsolidatedCompareSlug(from), `${from} should fold`).toBe(
          CANONICAL,
        );
      }
    });

    it("never redirects the clean canonical away (it is a live 200 survivor)", () => {
      expect(getConsolidatedCompareSlug(CANONICAL)).toBeNull();
      expect(
        COMPARE_REDIRECTS.some((r) => r.source === `/compare/${CANONICAL}`),
        "clean canonical must not be a redirect source",
      ).toBe(false);
    });

    it("no variant still points at the archived …-performance-comparison-2026 slug", () => {
      for (const r of COMPARE_REDIRECTS) {
        expect(r.destination).not.toBe(
          "/compare/ps5-pro-vs-xbox-series-x-performance-comparison-2026",
        );
      }
    });
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

  describe("DAN-2115 title-derived slugs", () => {
    // The URL a reader/journalist/LLM builds from the title we printed on the
    // SaaS study, mapped to the slug that actually serves it. Both DAN-2112 and
    // DAN-2115 were filed on 404s reached exactly this way.
    const TITLE_ALIASES: Record<string, string> = {
      "freshbooks-vs-quickbooks-online": "freshbooks-vs-quickbooks",
      "quickbooks-online-vs-freshbooks": "freshbooks-vs-quickbooks",
      "amazon-web-services-vs-microsoft-azure": "aws-vs-azure",
      "aws-vs-microsoft-azure": "aws-vs-azure",
      "microsoft-copilot-vs-chatgpt": "chatgpt-vs-copilot",
      "zoom-vs-google-meet-vs-microsoft-teams": "zoom-vs-google-meet-vs-teams",
    };

    it("folds each title-derived slug onto the canonical page in one hop", () => {
      for (const [from, to] of Object.entries(TITLE_ALIASES)) {
        expect(getConsolidatedCompareSlug(from), `${from} should fold`).toBe(to);
        // the page we send them to must be a real page, not another redirect
        expect(getConsolidatedCompareSlug(to), `${to} must be a live page`).toBeNull();
      }
    });

    it("never makes a live page a redirect source", () => {
      // Each canonical below is a verified live 200. Aliasing must add routes for
      // dead slugs only — a source that is also a live page would shadow it.
      for (const to of new Set(Object.values(TITLE_ALIASES))) {
        expect(
          COMPARE_REDIRECTS.some((r) => r.source === `/compare/${to}`),
          `${to} is a live page and must not redirect`,
        ).toBe(false);
      }
    });
  });

  describe("DAN-2323 cron-drift keyword-suffixed near-duplicates", () => {
    // Post-2026-07-14 enrichment-cron drift: keyword-suffixed variants of matchups
    // that already have a clean canonical 200. Each folds into the clean canonical
    // (never the keyword-stuffed slug), per the DAN-346/DAN-1908 spam-recovery rule.
    const CLUSTERS: Record<string, string> = {
      "california-population-vs-texas-2026": "california-vs-texas",
      "japan-vs-china-economic-comparison-2026": "japan-vs-china",
      "disney-vs-netflix-2026": "disney-vs-netflix",
      "nfl-vs-nba-revenue-comparison-2026": "nfl-vs-nba-revenue",
    };

    it("folds each keyword-suffixed variant into its clean canonical in one hop", () => {
      for (const [from, to] of Object.entries(CLUSTERS)) {
        expect(getConsolidatedCompareSlug(from), `${from} should fold`).toBe(to);
        // Destination must be a real page, not another redirect.
        expect(
          getConsolidatedCompareSlug(to),
          `${to} must be a live page`,
        ).toBeNull();
      }
    });

    it("never makes the clean canonical a redirect source (it is a live 200)", () => {
      for (const to of new Set(Object.values(CLUSTERS))) {
        expect(
          COMPARE_REDIRECTS.some((r) => r.source === `/compare/${to}`),
          `${to} is a live page and must not redirect`,
        ).toBe(false);
      }
    });
  });

  describe("DAN-1800 ordering sweep (84 clusters)", () => {
    it("folds every DAN-1800 retired ordering into a terminal survivor (one hop, permanent)", () => {
      for (const [from, to] of Object.entries(ORDERING_CONSOLIDATIONS_DAN1800)) {
        // DAN-2045: a cluster whose survivor was later archived has no page left to
        // fold into, so the redirect is dropped and the slug 404s directly rather
        // than 308ing onto a 404. Those are asserted in compare-dead-redirects.test.ts.
        if (DEAD_REDIRECT_SOURCES_DAN2045.includes(from)) continue;

        const resolved = getConsolidatedCompareSlug(from);
        expect(resolved, `${from} should fold`).not.toBeNull();

        // NOT `.toBe(to)`. DAN-2078 supersedes some DAN-1800 survivors: this layer
        // picked survivors by seed `viewCount` (DAN-2037), DAN-2078 re-picked them by
        // real GSC impressions, and where they disagree the later, better-informed
        // layer wins and the chain collapses through it. `burger-king-vs-mcdonalds`
        // is a live example: DAN-1800 sent it to `mcdonalds-vs-burger-king`, which
        // DAN-2078 then retired, so it now resolves past it to `burger-king-vs-mcdonald-s`.
        //
        // What must hold in every case is the invariant the original assertion was
        // really protecting: the destination is a REAL PAGE, reached in ONE hop.
        expect(
          getConsolidatedCompareSlug(resolved as string),
          `${from} -> ${resolved} must land on a page, not another redirect`,
        ).toBeNull();
        expect(resolved, "self-redirect").not.toBe(from);
      }
    });

    it("DAN-2078: every rivalry consolidation actually applies (not silently dropped)", () => {
      // The bug this locks down: the old loop guard DROPPED any source that was also
      // a survivor of another layer. Three of DAN-2078's 14 consolidations collided
      // that way, so they vanished from the edge map while the ticket was marked done
      // — the duplicate stayed live and the ordering layer kept 308ing INTO it.
      for (const [from, survivor] of Object.entries(RIVALRY_CONSOLIDATIONS_DAN2078)) {
        expect(
          getConsolidatedCompareSlug(from),
          `${from} must 308 to ${survivor} — a dropped entry leaves the duplicate live`,
        ).toBe(survivor);
        expect(
          getConsolidatedCompareSlug(survivor),
          `${survivor} is the survivor and must stay a live page`,
        ).toBeNull();
      }
    });

    it("DAN-2078: no redirect lands on a slug that is itself retired (chains collapse)", () => {
      // Every destination must be terminal. If `a -> b` and `b -> c` both ship, `a`
      // spends a hop of link equity landing on a page we retired — and if `b` is ever
      // archived, `a` 308s into a 404 (DAN-1908 / DAN-2065, three times over).
      for (const r of COMPARE_REDIRECTS) {
        const dest = r.destination.replace("/compare/", "");
        expect(
          getConsolidatedCompareSlug(dest),
          `${r.source} -> ${r.destination}, but ${dest} is itself a redirect source`,
        ).toBeNull();
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
