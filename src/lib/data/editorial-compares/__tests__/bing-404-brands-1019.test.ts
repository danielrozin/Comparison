import { describe, expect, it } from "vitest";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { decideComparePage } from "@/lib/compare-slug-resolution";
import { getConsolidatedCompareSlug, isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "@/lib/redirects/not-found-cleanup-redirects";
import { isEditorialCompareSlug } from "../index";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

const EXTRA_BANNED = /reddit|\bfps\b|geekbench|antutu|passmark|\bexpert\b|\bfaster than\b|best-selling|#1 /i;
const BARE_PRICE = /\bfrom \$\d|\$\d[\d,.]* at launch/i;

const RELATED: Record<string, string[]> = {
  "gatorade-vs-powerade": ["coca-cola-vs-pepsi", "celsius-vs-red-bull"],
  "mcdonalds-vs-wendys": ["burger-king-vs-mcdonald-s", "chipotle-vs-taco-bell"],
  "nike-vs-under-armour": ["nike-vs-adidas", "nike-vs-reebok"],
};

const HOSTS: Record<string, RegExp> = {
  "gatorade-vs-powerade":
    /^https:\/\/(www\.gatorade\.com|www\.pepsico\.com|www\.powerade\.com|www\.coca-colacompany\.com)\//,
  "mcdonalds-vs-wendys": /^https:\/\/(corporate\.mcdonalds\.com|www\.irwendys\.com)\//,
  "nike-vs-under-armour": /^https:\/\/(investors\.nike\.com|about\.underarmour\.com)\//,
};

const FACTS: Record<string, string[]> = {
  "gatorade-vs-powerade": ["PepsiCo", "The Coca-Cola Company", "240mg", "160mg", "1965", "1988", "Gatorade Zero"],
  "mcdonalds-vs-wendys": ["44,000 locations", "7,000 restaurants", "95%", "fresh beef", "1969", "Frosty"],
  "nike-vs-under-armour": ["$46.4 billion", "$5.0 billion", "Jordan Brand", "Converse", "Baltimore", "1996"],
};

const CATEGORY: Record<string, string> = {
  "gatorade-vs-powerade": "brands",
  "mcdonalds-vs-wendys": "companies",
  "nike-vs-under-armour": "brands",
};

describe("Bing 404 build list: food, drink and apparel brands (2026-10-19)", () => {
  for (const slug of Object.keys(RELATED)) {
    it(`publishes ${slug} with no winner from official sources`, () => {
      const page = expectRoo224Page(slug, {
        category: CATEGORY[slug],
        updatedAt: "2026-10-19T00:00:00Z",
        related: RELATED[slug],
        sourceHosts: HOSTS[slug],
        facts: FACTS[slug],
      });
      const text = readerText(page);
      expect(text.match(EXTRA_BANNED)?.[0] ?? null).toBeNull();
      expect(text).not.toMatch(BARE_PRICE);
      expect(page.schemaMarkup).toBeUndefined();
      expect(isRedirectedCompareSlug(slug)).toBe(false);
      expect(mergeEditorialCategoryComparisons(CATEGORY[slug], []).map((card) => card.slug)).toContain(slug);
    });
  }

  it("credits the electrolyte comparison to Powerade and prints no calorie race for the burger chains", () => {
    const gatorade = readerText(expectRoo224Page("gatorade-vs-powerade", {
      category: "brands",
      updatedAt: "2026-10-19T00:00:00Z",
      related: RELATED["gatorade-vs-powerade"],
      sourceHosts: HOSTS["gatorade-vs-powerade"],
      facts: ["Powerade says"],
    }));
    expect(gatorade).toMatch(/Powerade says (that is |it does)/);
    const burgers = readerText(expectRoo224Page("mcdonalds-vs-wendys", {
      category: "companies",
      updatedAt: "2026-10-19T00:00:00Z",
      related: RELATED["mcdonalds-vs-wendys"],
      sourceHosts: HOSTS["mcdonalds-vs-wendys"],
      facts: [],
    }));
    expect(burgers).not.toMatch(/calorie/i);
  });

  it("301s the mangled McDonald's vs Wendy's slugs to the clean canonical in one hop", () => {
    expect(isEditorialCompareSlug("mcdonalds-vs-wendys")).toBe(true);
    for (const alias of ["mcdonald-s-vs-wendy-s", "wendy-s-vs-mcdonald-s"]) {
      expect(getConsolidatedCompareSlug(alias)).toBe("mcdonalds-vs-wendys");
      expect(NEVER_PUBLISHED_ALIASES.has(alias)).toBe(true);
    }
    expect(getConsolidatedCompareSlug("mcdonalds-vs-wendys")).toBeNull();
    // Plain reverse order resolves at runtime to the live canonical.
    const decision = decideComparePage("wendys-vs-mcdonalds", (candidate) =>
      candidate === "mcdonalds-vs-wendys" ? "live" : "missing",
    );
    expect(decision).toEqual({ action: "redirect", destination: "mcdonalds-vs-wendys" });
  });
});
