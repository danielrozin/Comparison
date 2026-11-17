import { describe, it, expect } from "vitest";
import type { ComparisonEntityData } from "@/types";
import {
  applyAffiliateCompareRule,
  classifyAffiliateCompare,
  affiliateCtaLabel,
  shortProductName,
} from "../buyable-compare";

const e = (name: string, entityType: string) => ({ name, entityType });

describe("classifyAffiliateCompare (ROO-411)", () => {
  it.each([
    ["rtx-5070-vs-rtx-5060-ti", "technology", [e("RTX 5070", "product"), e("RTX 5060 Ti", "product")]],
    ["ps5-vs-xbox-series-x", "gaming", [e("PlayStation 5", "product"), e("Xbox Series X", "product")]],
    ["850w-vs-1000w-psu", "technology", [e("850W PSU", "product"), e("1000W PSU", "product")]],
    [
      "dell-xps-13-vs-macbook-air",
      "products",
      [e("MacBook Air 15-inch (M5, 2026)", "products"), e("Dell XPS 13 (2025)", "products")],
    ],
    ["qd-oled-vs-woled", "technology", [e("QD-OLED", "product"), e("WOLED", "product")]],
    ["iphone-17-vs-samsung-s26", "technology", [e("iPhone 17", "product"), e("Samsung Galaxy S26", "product")]],
  ])("treats %s as buyable", (slug, category, entities) => {
    expect(classifyAffiliateCompare({ slug, category, entities })).toEqual({ buyable: true, reason: "buyable" });
  });

  it.each([
    ["slack-vs-microsoft-teams", "software", [e("Slack", "software"), e("Microsoft Teams", "software")], "category-not-buyable"],
    ["brave-vs-chrome", "technology", [e("Brave", "software"), e("Google Chrome", "software")], "entity-not-physical"],
    ["mac-vs-windows", "technology", [e("Mac (macOS)", "technology"), e("Windows", "technology")], "entity-not-physical"],
    ["ikea-vs-wayfair", "products", [e("IKEA", "products"), e("Wayfair", "products")], "entity-not-physical"],
    ["hbo-max-vs-netflix", "entertainment", [e("HBO Max", "streaming"), e("Netflix", "company")], "category-not-buyable"],
    ["nike-vs-adidas", "brands", [e("Nike Inc.", "brand"), e("Adidas AG", "brand")], "category-not-buyable"],
    ["bloomberg-vs-wsj", null, [e("Bloomberg", "publication"), e("The Wall Street Journal", "publication")], "slug-not-hardware"],
    ["toyota-camry-vs-honda-accord", "automotive", [e("Toyota Camry", "vehicle"), e("Honda Accord", "vehicle")], "category-not-buyable"],
    ["apple-vs-samsung", "technology", [e("Apple", "company"), e("Samsung", "company")], "entity-not-physical"],
  ])("treats %s as not buyable", (slug, category, entities, reason) => {
    expect(classifyAffiliateCompare({ slug, category, entities })).toEqual({ buyable: false, reason });
  });

  it("uses slug keywords only when the compare has no category", () => {
    const typeless = [e("RTX 5070", ""), e("RX 9070", "")];
    expect(classifyAffiliateCompare({ slug: "rtx-5070-vs-rx-9070", category: null, entities: typeless }).buyable).toBe(true);
    expect(classifyAffiliateCompare({ slug: "slack-vs-zoom", category: "", entities: typeless }).buyable).toBe(false);
    // A category always wins over the slug keywords.
    expect(classifyAffiliateCompare({ slug: "rtx-5070-vs-rx-9070", category: "software", entities: typeless }).buyable).toBe(false);
  });

  it("needs every entity to be a physical product", () => {
    const mixed = [e("PlayStation 5", "product"), e("PC Gaming", "concept")];
    expect(classifyAffiliateCompare({ slug: "ps5-vs-pc-gaming", category: "gaming", entities: mixed }).buyable).toBe(false);
    expect(classifyAffiliateCompare({ slug: "x", category: "technology", entities: [] }).reason).toBe("no-entities");
  });
});

describe("applyAffiliateCompareRule", () => {
  const link = { url: "https://www.amazon.com/s?k=x&tag=t", partner: "amazon", label: "Shop x" };
  const entities = [{ name: "Slack", affiliateLinks: [link] }] as unknown as ComparisonEntityData[];

  it("strips every shop link on non-buyable compares", () => {
    const out = applyAffiliateCompareRule(entities, { buyable: false, reason: "category-not-buyable" });
    expect(out[0].affiliateLinks).toEqual([]);
  });

  it("keeps links on buyable compares", () => {
    const out = applyAffiliateCompareRule(entities, { buyable: true, reason: "buyable" });
    expect(out[0].affiliateLinks).toEqual([link]);
  });
});

describe("affiliateCtaLabel", () => {
  it("names the product on Amazon CTAs", () => {
    expect(affiliateCtaLabel("RTX 5070", "amazon")).toBe("Check RTX 5070 price on Amazon");
    expect(affiliateCtaLabel("MacBook Air 15-inch (M5, 2026)", "amazon")).toBe("Check MacBook Air 15-inch price on Amazon");
  });

  it("names the product for other partners without claiming Amazon", () => {
    expect(affiliateCtaLabel("Dyson V15", "dyson")).toBe("Check Dyson V15 price");
  });

  it("keeps the name when it is only a parenthetical", () => {
    expect(shortProductName("(Unnamed)")).toBe("(Unnamed)");
  });
});
