import { describe, it, expect } from "vitest";

import { COMPARE_REDIRECTS, getConsolidatedCompareSlug } from "../compare-redirects";
import {
  US_CHINA_GDP_CANONICAL,
  US_CHINA_GDP_LIVE_RELATED,
  US_CHINA_GDP_SOFT_404_ALIASES,
  getExplicitUsChinaGdpRedirect,
  matchesUsChinaGdpAliasPattern,
  resolveUsChinaGdpRedirect,
} from "../us-china-gdp-cluster";

const PRODUCT_SAMPLES = [
  "china-vs-united-states-gdp-comparison-2026",
  "current-nominal-gdp-us-vs-china-2026",
  "china-vs-us-gdp-nominal-2026",
  "american-economy-vs-china",
] as const;

describe("ROO-24 US↔China GDP cluster", () => {
  it("301s every Product soft-404 sample to the locked canonical", () => {
    for (const from of PRODUCT_SAMPLES) {
      expect(getExplicitUsChinaGdpRedirect(from)).toBe(US_CHINA_GDP_CANONICAL);
      expect(getConsolidatedCompareSlug(from)).toBe(US_CHINA_GDP_CANONICAL);

      const hit = COMPARE_REDIRECTS.find((r) => r.source === `/compare/${from}`);
      expect(hit, `missing edge redirect for /compare/${from}`).toBeDefined();
      expect(hit?.destination).toBe(`/compare/${US_CHINA_GDP_CANONICAL}`);
      expect(hit?.statusCode).toBe(301);
    }
  });

  it("never redirects the canonical or Product-locked live related pages", () => {
    expect(getConsolidatedCompareSlug(US_CHINA_GDP_CANONICAL)).toBeNull();
    expect(resolveUsChinaGdpRedirect(US_CHINA_GDP_CANONICAL)).toBeNull();
    expect(matchesUsChinaGdpAliasPattern(US_CHINA_GDP_CANONICAL)).toBe(false);

    for (const live of US_CHINA_GDP_LIVE_RELATED) {
      expect(getConsolidatedCompareSlug(live), live).toBeNull();
      expect(resolveUsChinaGdpRedirect(live), live).toBeNull();
      expect(matchesUsChinaGdpAliasPattern(live), live).toBe(false);
      expect(
        COMPARE_REDIRECTS.some((r) => r.source === `/compare/${live}`),
        `${live} is a live related page and must not redirect`,
      ).toBe(false);
    }
  });

  it("does not put live related pages in the alias list", () => {
    const aliases = new Set<string>(US_CHINA_GDP_SOFT_404_ALIASES);
    expect(aliases.has(US_CHINA_GDP_CANONICAL)).toBe(false);
    for (const live of US_CHINA_GDP_LIVE_RELATED) {
      expect(aliases.has(live)).toBe(false);
    }
  });

  it("matches unpublished US+China+GDP phrasing and excludes sibling facets", () => {
    expect(matchesUsChinaGdpAliasPattern("china-vs-us-gdp-2026")).toBe(true);
    expect(resolveUsChinaGdpRedirect("china-vs-us-gdp-2026")).toBe(
      US_CHINA_GDP_CANONICAL,
    );

    expect(
      matchesUsChinaGdpAliasPattern("usa-vs-china-vs-india-gdp-2026"),
    ).toBe(false);
    expect(
      matchesUsChinaGdpAliasPattern(
        "china-vs-us-gdp-military-tech-comparison-2026",
      ),
    ).toBe(false);
    expect(matchesUsChinaGdpAliasPattern("us-vs-china-gdp-per-capita-2026")).toBe(
      false,
    );
    expect(matchesUsChinaGdpAliasPattern("japan-vs-china")).toBe(false);
    expect(matchesUsChinaGdpAliasPattern("signal-vs-whatsapp")).toBe(false);
  });

  it("lands every cluster redirect on the canonical in one hop", () => {
    for (const from of US_CHINA_GDP_SOFT_404_ALIASES) {
      const dest = getConsolidatedCompareSlug(from);
      expect(dest).toBe(US_CHINA_GDP_CANONICAL);
      expect(getConsolidatedCompareSlug(dest as string)).toBeNull();
    }
  });
});
