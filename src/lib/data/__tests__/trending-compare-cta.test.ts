/**
 * ROO-47 — /trending hero targets a live compare, not the lander itself.
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { buildTrendingCompareCta } from "../trending-compare-cta";

describe("buildTrendingCompareCta", () => {
  const items = [
    { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo" },
    { slug: "japan-vs-china", title: "Japan vs China" },
    { slug: "chatgpt-vs-gemini", title: "ChatGPT vs Gemini" },
  ];

  it("uses the first ranked comparison as the primary CTA", () => {
    expect(buildTrendingCompareCta(items)).toMatchObject({
      primarySlug: "messi-vs-ronaldo",
      primaryTitle: "Messi vs Ronaldo",
    });
  });

  it("puts the following comparisons on chips and does not repeat the primary", () => {
    const cta = buildTrendingCompareCta(items);
    expect(cta.chips.map((chip) => chip.slug)).toEqual([
      "japan-vs-china",
      "chatgpt-vs-gemini",
    ]);
    expect(cta.chips.some((chip) => chip.slug === cta.primarySlug)).toBe(false);
  });

  it("drops blank and duplicate slugs before choosing a target", () => {
    const cta = buildTrendingCompareCta([
      { slug: "  ", title: "Blank" },
      { slug: "figma-vs-sketch", title: "Figma vs Sketch" },
      { slug: "figma-vs-sketch", title: "Figma vs Sketch again" },
      { slug: "canva-vs-photoshop", title: "" },
    ]);

    expect(cta.primarySlug).toBe("figma-vs-sketch");
    expect(cta.chips).toEqual([
      { slug: "canva-vs-photoshop", label: "canva vs photoshop" },
    ]);
  });

  it("returns an empty CTA when nothing is live", () => {
    expect(buildTrendingCompareCta([])).toEqual({
      primarySlug: null,
      primaryTitle: null,
      chips: [],
    });
  });

  it("respects the chip limit", () => {
    const cta = buildTrendingCompareCta(items, { chipLimit: 1 });
    expect(cta.chips).toHaveLength(1);
    expect(cta.chips[0]?.slug).toBe("japan-vs-china");
  });
});

describe("/trending page wiring (ROO-47)", () => {
  const source = readFileSync(
    path.resolve(process.cwd(), "src/app/trending/page.tsx"),
    "utf8",
  );

  it("renders the shared compare CTA in the hero with the trending source", () => {
    expect(source).toContain("<HomeCompareCTA");
    expect(source).toContain("source={TRENDING_COMPARE_SOURCE}");
    expect(source).toContain("showTrending={false}");
    expect(source).toContain("buildTrendingCompareCta");
    expect(source).toContain('trackSource={TRENDING_COMPARE_SOURCE}');
    expect(source).toContain("emphasizeCta");
  });

  it("keeps the pricing link below the list, not in the hero", () => {
    const heroEnd = source.indexOf("Category filter chips");
    const pricingAt = source.indexOf('href="/pricing?src=trending"');
    expect(heroEnd).toBeGreaterThan(-1);
    expect(pricingAt).toBeGreaterThan(heroEnd);
  });
});
