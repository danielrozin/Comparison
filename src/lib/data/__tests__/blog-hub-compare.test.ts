/**
 * ROO-46 — hub cards and lander fallbacks only link a canonical live slug.
 */
import { describe, it, expect } from "vitest";
import {
  articleCompareCandidates,
  firstLiveCompareSlug,
} from "../blog-hub-compare";

describe("firstLiveCompareSlug", () => {
  const live = new Set([
    "bank-of-america-vs-chase",
    "macbook-air-vs-macbook-pro",
    "us-military-vs-china-military",
    "slack-vs-microsoft-teams",
  ]);

  it("skips dead stored slugs and returns the first live canonical", () => {
    expect(
      firstLiveCompareSlug(
        ["m1-abrams-vs-t-90", "us-military-vs-china-military"],
        live,
      ),
    ).toBe("us-military-vs-china-military");
  });

  it("returns null when nothing in the candidate list is live", () => {
    expect(firstLiveCompareSlug(["m1-abrams-vs-t-90", "abrams-tank-vs-leopard-2"], live)).toBeNull();
    expect(firstLiveCompareSlug([], live)).toBeNull();
  });

  it("prefers a stored slug over a later fallback", () => {
    expect(
      firstLiveCompareSlug(
        ["macbook-air-vs-macbook-pro", "slack-vs-microsoft-teams"],
        live,
      ),
    ).toBe("macbook-air-vs-macbook-pro");
  });
});

describe("articleCompareCandidates", () => {
  it("appends curated fallbacks for top landers that have no stored slug", () => {
    const candidates = articleCompareCandidates(
      "best-tanks-world-2026-abrams-vs-t-90-vs-leopard",
      [],
    );
    expect(candidates).toContain("us-military-vs-china-military");

    const air = articleCompareCandidates(
      "macbook-air-weight-comparison-2025-2026-which-model-is-right-for-you",
      ["retired-macbook-slug"],
    );
    expect(air[0]).toBe("retired-macbook-slug");
    expect(air).toContain("macbook-air-vs-macbook-pro");
  });
});
