/**
 * Tests for src/lib/seo/meta.ts — template-level CTR title/description
 * normalizers (DAN-1144). Covers the double-brand bug, the redundant
 * `| Comparison` segment, and word-boundary description clamping.
 */
import { describe, it, expect } from "vitest";
import { buildMetaTitle, clampDescription } from "../meta";
import { SITE_NAME } from "@/lib/utils/constants";

const BRAND = ` | ${SITE_NAME}`;

describe("buildMetaTitle", () => {
  it("dedupes a pre-existing brand suffix (Bug 1)", () => {
    expect(buildMetaTitle("Figma vs Canva | A Versus B")).toBe(`Figma vs Canva${BRAND}`);
  });

  it("collapses an already-doubled brand suffix", () => {
    expect(buildMetaTitle("Figma vs Canva | A Versus B | A Versus B")).toBe(`Figma vs Canva${BRAND}`);
  });

  it("drops a redundant `| Comparison` segment (Bug 2)", () => {
    expect(
      buildMetaTitle("PS5 vs Xbox Series X: Complete Comparison (2026) | Comparison"),
    ).toBe(`PS5 vs Xbox Series X: Complete Comparison (2026)${BRAND}`);
  });

  it("appends the brand once when none is present", () => {
    expect(buildMetaTitle("Slack vs Teams")).toBe(`Slack vs Teams${BRAND}`);
  });

  it("is idempotent", () => {
    const once = buildMetaTitle("iPhone 15 vs 16");
    expect(buildMetaTitle(once)).toBe(once);
  });

  it("handles empty/null input without throwing", () => {
    expect(buildMetaTitle("")).toBe(BRAND);
    expect(buildMetaTitle(null)).toBe(BRAND);
  });
});

describe("clampDescription", () => {
  it("returns short descriptions unchanged", () => {
    const d = "Short and sweet.";
    expect(clampDescription(d)).toBe(d);
  });

  it("clamps to <=160 chars on a whole word and appends a period (Bug 3)", () => {
    const long =
      "Compare PlayStation 5 and Xbox Series X across performance, exclusives, value, controller design, storage expansion options, and the all-important Game Pass subscription library";
    const out = clampDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    expect(out.endsWith(".")).toBe(true);
    // No mid-word cut: the clamped text ends on a complete word.
    expect(long.startsWith(out.slice(0, -1))).toBe(true);
    expect(out).not.toMatch(/\s\.$/);
  });

  it("does not cut a word in half", () => {
    const long = "a".repeat(150) + " professionalphotoeditingsuite extra words here to overflow";
    const out = clampDescription(long);
    expect(out.length).toBeLessThanOrEqual(160);
    // The long run of 'a' fits; the partial overflow word is dropped entirely.
    expect(out).toBe("a".repeat(150) + ".");
  });
});
