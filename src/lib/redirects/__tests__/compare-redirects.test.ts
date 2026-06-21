import { describe, it, expect } from "vitest";

import {
  COMPARE_REDIRECTS,
  RETIRED_COMPARE_SLUGS,
  resolveCanonicalCompareSlug,
  isCanonicalCompareSurvivor,
} from "../compare-redirects";

describe("COMPARE_REDIRECTS dual-ordering consolidation", () => {
  it("never chains: no redirect destination is itself a redirect source", () => {
    const sources = new Set(COMPARE_REDIRECTS.map((r) => r.source));
    const chained = COMPARE_REDIRECTS.filter((r) =>
      sources.has(r.destination),
    ).map((r) => r.source);
    expect(chained, `chained redirects: ${chained.join(", ")}`).toEqual([]);
  });

  it("every entry is a permanent /compare → /compare redirect", () => {
    for (const r of COMPARE_REDIRECTS) {
      expect(r.source.startsWith("/compare/")).toBe(true);
      expect(r.destination.startsWith("/compare/")).toBe(true);
      expect(r.source).not.toBe(r.destination);
      expect(r.permanent).toBe(true);
    }
  });

  it("RETIRED_COMPARE_SLUGS matches the redirect sources", () => {
    expect(RETIRED_COMPARE_SLUGS.size).toBe(COMPARE_REDIRECTS.length);
    for (const r of COMPARE_REDIRECTS) {
      const slug = r.source.replace("/compare/", "");
      expect(RETIRED_COMPARE_SLUGS.has(slug)).toBe(true);
    }
  });

  it("folds retired orderings to their canonical survivor", () => {
    // Default alphabetical survivor
    expect(resolveCanonicalCompareSlug("azure-vs-aws")).toBe("aws-vs-azure");
    expect(resolveCanonicalCompareSlug("roomba-vs-roborock")).toBe(
      "roborock-vs-roomba",
    );
    // Footprint exception — non-alphabetical survivor kept for keyword footprint
    expect(resolveCanonicalCompareSlug("china-vs-usa")).toBe("usa-vs-china");
    expect(resolveCanonicalCompareSlug("microsoft-teams-vs-zoom")).toBe(
      "zoom-vs-microsoft-teams",
    );
    // Health exception — alphabetical side 500s, point at healthy reverse
    expect(resolveCanonicalCompareSlug("mongodb-vs-postgresql")).toBe(
      "postgresql-vs-mongodb",
    );
    expect(resolveCanonicalCompareSlug("cursor-vs-github-copilot")).toBe(
      "github-copilot-vs-cursor",
    );
  });

  it("leaves survivors and unknown slugs unchanged", () => {
    expect(resolveCanonicalCompareSlug("usa-vs-china")).toBe("usa-vs-china");
    expect(isCanonicalCompareSurvivor("usa-vs-china")).toBe(true);
    expect(isCanonicalCompareSurvivor("china-vs-usa")).toBe(false);
    expect(resolveCanonicalCompareSlug("some-brand-new-pair")).toBe(
      "some-brand-new-pair",
    );
  });
});
