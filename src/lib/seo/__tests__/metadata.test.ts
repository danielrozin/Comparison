/**
 * Tests for src/lib/seo/metadata.ts — the three CTR metadata fixes from the
 * Creative Director CTR audit (DAN-1145, 2026-06-14).
 */
import { describe, it, expect } from "vitest";
import {
  buildPageTitle,
  clampDescription,
  resolveComparisonDescription,
  META_DESCRIPTION_LIMIT,
} from "../metadata";
import { SITE_NAME } from "@/lib/utils/constants";

const BRAND = SITE_NAME; // "A Versus B"

describe("buildPageTitle — Bug 1: single brand suffix", () => {
  it("appends the brand exactly once to a bare title", () => {
    expect(buildPageTitle("Figma vs Canva")).toBe(`Figma vs Canva | ${BRAND}`);
  });

  it("does not double the brand when the title already ends in it", () => {
    expect(buildPageTitle(`Figma vs Canva | ${BRAND}`)).toBe(`Figma vs Canva | ${BRAND}`);
  });

  it("collapses an already-doubled brand suffix", () => {
    expect(buildPageTitle(`Slack vs Teams | ${BRAND} | ${BRAND}`)).toBe(
      `Slack vs Teams | ${BRAND}`,
    );
  });

  it("matches the brand suffix case-insensitively", () => {
    expect(buildPageTitle("iPhone 15 vs 16 | a versus b")).toBe(`iPhone 15 vs 16 | ${BRAND}`);
  });

  it("returns just the brand for an empty/nullish title", () => {
    expect(buildPageTitle("")).toBe(BRAND);
    expect(buildPageTitle(null)).toBe(BRAND);
    expect(buildPageTitle(undefined)).toBe(BRAND);
  });
});

describe("buildPageTitle — Bug 2: redundant '| Comparison'", () => {
  it("drops a redundant Comparison segment when the title already says Comparison", () => {
    expect(buildPageTitle("PS5 vs Xbox Series X: Complete Comparison (2026) | Comparison")).toBe(
      `PS5 vs Xbox Series X: Complete Comparison (2026) | ${BRAND}`,
    );
  });

  it("drops a redundant Comparison segment when the title contains 'vs'", () => {
    expect(buildPageTitle("Notion vs Obsidian | Comparison")).toBe(
      `Notion vs Obsidian | ${BRAND}`,
    );
  });

  it("handles Comparison + doubled brand together", () => {
    expect(
      buildPageTitle(`PS5 vs Xbox: Complete Comparison (2026) | Comparison | ${BRAND}`),
    ).toBe(`PS5 vs Xbox: Complete Comparison (2026) | ${BRAND}`);
  });

  it("keeps a Comparison segment when nothing else conveys comparison", () => {
    expect(buildPageTitle("Gaming Consoles | Comparison")).toBe(
      `Gaming Consoles | Comparison | ${BRAND}`,
    );
  });
});

describe("clampDescription — Bug 3: word-boundary clamp", () => {
  it("leaves short descriptions untouched", () => {
    const short = "Compare Figma and Canva — key differences and verdict.";
    expect(clampDescription(short)).toBe(short);
  });

  it("clamps long descriptions at a word boundary and appends an ellipsis", () => {
    const long =
      "Compare Figma versus Canva across pricing, collaboration features, design power, " +
      "templates, export options, and team workflows to decide which design tool fits your team best today.";
    const out = clampDescription(long);
    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT);
    expect(out.endsWith("…")).toBe(true);
    // No mid-word break: the char before the ellipsis is a word char, and the
    // clamped text (minus ellipsis) is a prefix of the original word stream.
    const body = out.slice(0, -1);
    expect(long.startsWith(body)).toBe(true);
    expect(/\s$/.test(body)).toBe(false);
  });

  it("does not leave dangling punctuation before the ellipsis", () => {
    const long = "First clause, with detail; then a much longer trailing clause — " +
      "that keeps going well past the meta description limit so that truncation must occur here now please.";
    const out = clampDescription(long, 60);
    expect(out.length).toBeLessThanOrEqual(60);
    expect(/[.,;:!?\s–—-]…$/.test(out)).toBe(false);
  });

  it("respects a custom limit", () => {
    const out = clampDescription("one two three four five six seven eight", 20);
    expect(out.length).toBeLessThanOrEqual(20);
    expect(out.endsWith("…")).toBe(true);
  });
});

describe("resolveComparisonDescription — Bug 3: heal persisted raw truncations", () => {
  // Verbatim prod failure: DB stored metaDescription = shortAnswer.slice(0,155).
  const SHORT_ANSWER =
    "The PS5 has faster SSD speeds and superior exclusive games (Spider-Man, God of War). " +
    "The Xbox Series X offers better backwards compatibility, Game Pass subscription value, " +
    "and slightly more raw GPU power (12 vs 10.28 TFLOPS).";
  const STORED_TRUNCATION = SHORT_ANSWER.slice(0, 155); // 155 chars, ends "…Game Pass sub", no ellipsis

  it("re-derives from shortAnswer when the stored value is a raw mid-word slice (the prod defect)", () => {
    const out = resolveComparisonDescription(STORED_TRUNCATION, SHORT_ANSWER);
    expect(out).not.toBe(STORED_TRUNCATION);
    expect(out.endsWith("Game Pass sub")).toBe(false);
    expect(out.endsWith("…")).toBe(true);
    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT);
  });

  it("derives from shortAnswer when stored metaDescription is null/empty", () => {
    expect(resolveComparisonDescription(null, SHORT_ANSWER).endsWith("…")).toBe(true);
    expect(resolveComparisonDescription("", SHORT_ANSWER).endsWith("…")).toBe(true);
  });

  it("keeps a genuine hand-written metaDescription (not a prefix of shortAnswer)", () => {
    const handWritten =
      "Compare PlayStation 5 and Xbox Series X across performance, exclusives, value, and Game Pass.";
    expect(resolveComparisonDescription(handWritten, SHORT_ANSWER)).toBe(handWritten);
  });

  it("keeps a stored value that is already a proper clamp (ends with an ellipsis)", () => {
    const alreadyClamped = clampDescription(SHORT_ANSWER);
    expect(resolveComparisonDescription(alreadyClamped, SHORT_ANSWER)).toBe(alreadyClamped);
  });

  it("clamps an over-long hand-written metaDescription to the limit", () => {
    const longHand =
      "Compare these two platforms across an exhaustive list of dimensions including pricing, " +
      "features, integrations, support, security, and a great many other considerations beyond the limit.";
    const out = resolveComparisonDescription(longHand, "Short canonical answer.");
    expect(out.length).toBeLessThanOrEqual(META_DESCRIPTION_LIMIT);
    expect(out.endsWith("…")).toBe(true);
  });
});
