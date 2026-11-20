import { describe, it, expect } from "vitest";
import { buildAlternativesList, alternativesTitle, alternativeKey } from "@/lib/seo/alternatives-list";
import { buildPageTitle } from "@/lib/seo/metadata";

describe("buildAlternativesList", () => {
  const subject = { slug: "xbox-series-x", name: "Xbox Series X" };
  // Shape of the live /alternatives/xbox-series-x list in Nov 2026.
  const compared = [
    { name: "PlayStation 5", slug: "playstation-5", comparisonSlug: "ps5-vs-xbox-series-x" },
    { name: "PlayStation 6 (PS6)", slug: "ps6", comparisonSlug: "ps6-vs-xbox-series-x" },
    { name: "PlayStation 5 Pro", slug: "playstation-5-pro", comparisonSlug: "ps5-pro-vs-xbox-series-x" },
    { name: "PC Gaming", slug: "pc-gaming", comparisonSlug: "pc-gaming-vs-xbox-series-x" },
    { name: "PS5 Pro", slug: "ps5-pro", comparisonSlug: "xbox-series-x-vs-ps5-pro" },
    { name: "Xbox Series X", slug: "xbox", comparisonSlug: "xbox-vs-xbox-series-x" },
    { name: "PlayStation 5", slug: "ps5", comparisonSlug: "xbox-series-x-vs-ps5" },
  ];
  const curated = [
    { name: "PlayStation 5", slug: "ps5", reason: "Primary console competitor" },
    { name: "Nintendo Switch 2", slug: "nintendo-switch-2", reason: "Portable gaming alternative" },
    { name: "Gaming PC", slug: "gaming-pc", reason: "Higher-end gaming option" },
  ];

  it("removes duplicates, the subject itself and unreleased products", () => {
    const rows = buildAlternativesList(subject, compared, curated);
    expect(rows.map((r) => r.name)).toEqual(["PlayStation 5", "Nintendo Switch 2", "Gaming PC", "PlayStation 5 Pro"]);
  });

  it("attaches live comparisons to curated picks and keeps curated picks without one", () => {
    const rows = buildAlternativesList(subject, compared, curated);
    expect(rows[0]).toMatchObject({ reason: "Primary console competitor", comparisonSlug: "ps5-vs-xbox-series-x" });
    expect(rows[1].comparisonSlug).toBeNull();
    expect(rows[2].comparisonSlug).toBe("pc-gaming-vs-xbox-series-x");
  });

  it("caps the list", () => {
    const many = Array.from({ length: 20 }, (_, i) => ({ name: `Brand ${i}`, slug: `brand-${i}`, comparisonSlug: `x-vs-brand-${i}` }));
    expect(buildAlternativesList({ slug: "x", name: "X" }, many)).toHaveLength(8);
  });

  it("normalises aliases order-insensitively", () => {
    expect(alternativeKey("PS5 Pro")).toBe(alternativeKey("PlayStation 5 Pro"));
    expect(alternativeKey("pc-gaming")).toBe(alternativeKey("Gaming PC"));
  });
});

describe("alternativesTitle", () => {
  it("stays within 50 chars and names real rows", () => {
    const rows = buildAlternativesList({ slug: "nike", name: "Nike" }, [], [
      { name: "Adidas", slug: "adidas", reason: "" },
      { name: "New Balance", slug: "new-balance", reason: "" },
      { name: "Puma", slug: "puma", reason: "" },
    ]);
    const t = alternativesTitle("Nike", rows, 2026);
    expect(t).toBe("Nike Alternatives 2026: Adidas, New Balance & Puma");
    expect(t.length).toBeLessThanOrEqual(50);
    expect(alternativesTitle("Xbox Series X", rows, 2026).length).toBeLessThanOrEqual(50);
  });
});

describe("buildPageTitle legacy brand suffix", () => {
  it("strips '| aversusb' before appending the brand once", () => {
    expect(buildPageTitle("Chick-fil-A Breakfast Menu | aversusb")).toBe("Chick-fil-A Breakfast Menu | A Versus B");
    expect(buildPageTitle("Bloomberg vs WSJ | aversusb | A Versus B")).toBe("Bloomberg vs WSJ | A Versus B");
    expect(buildPageTitle("X vs Y — aversusb.net")).toBe("X vs Y | A Versus B");
  });
});
