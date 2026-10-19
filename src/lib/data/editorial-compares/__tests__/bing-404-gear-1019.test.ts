import { describe, expect, it } from "vitest";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

const EXTRA_BANNED = /reddit|\bfps\b|geekbench|antutu|passmark|\bexpert\b|\bfaster than\b|best-selling|#1 /i;
const BARE_PRICE = /\bfrom \$\d|\$\d[\d,.]* at launch/i;

const CATEGORY: Record<string, string> = {
  "mazda-cx-5-vs-toyota-rav4": "automotive",
  "garmin-vs-whoop": "technology",
  "stanley-vs-yeti": "products",
  "coleman-vs-yeti": "products",
};

const RELATED: Record<string, string[]> = {
  "mazda-cx-5-vs-toyota-rav4": ["toyota-rav4-vs-honda-cr-v", "subaru-outback-vs-toyota-rav4"],
  "garmin-vs-whoop": ["apple-watch-series-12-vs-whoop", "oura-ring-vs-whoop"],
  "stanley-vs-yeti": ["coleman-vs-yeti", "patagonia-vs-rei"],
  "coleman-vs-yeti": ["stanley-vs-yeti", "patagonia-vs-rei"],
};

const HOSTS: Record<string, RegExp> = {
  "mazda-cx-5-vs-toyota-rav4": /^https:\/\/(www\.mazdausa\.com|www\.toyota\.com)\//,
  "garmin-vs-whoop": /^https:\/\/(www\.garmin\.com|www\.whoop\.com)\//,
  "stanley-vs-yeti": /^https:\/\/(www\.stanley1913\.com|investors\.yeti\.com|www\.yeti\.com)\//,
  "coleman-vs-yeti": /^https:\/\/(www\.newellbrands\.com|www\.coleman\.com|investors\.yeti\.com|www\.yeti\.com)\//,
};

const FACTS: Record<string, string[]> = {
  "mazda-cx-5-vs-toyota-rav4": [
    "$29,990 starting launch price (MSRP), per Mazda USA, Oct 2026",
    "$31,900 starting launch price (MSRP), per Toyota, Oct 2026",
    "187",
    "47 city/40 highway",
    "2027",
    "See vendor page for current price",
  ],
  "garmin-vs-whoop": [
    "$199.99 launch price (MSRP), per Garmin, July 2026",
    "$199/year, per WHOOP membership page, Oct 2026",
    "no subscription",
    "14+ day",
    "up to 10 days",
    "See vendor page for current price",
  ],
  "stanley-vs-yeti": ["1913", "PMI", "life of the product", "Austin, Texas", "$1,868.5 million", "See vendor page for current price"],
  "coleman-vs-yeti": ["Newell Brands", "Snap 'N Go", "10+ person", "$748.5 million", "See vendor page for current price"],
};

describe("Bing 404 build list: cars, wearables and outdoor gear (2026-10-19)", () => {
  for (const slug of Object.keys(CATEGORY)) {
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

  it("carries every product price in the MSRP or per-vendor format and links the vendor", () => {
    for (const slug of ["mazda-cx-5-vs-toyota-rav4", "garmin-vs-whoop"]) {
      const page = expectRoo224Page(slug, {
        category: CATEGORY[slug],
        updatedAt: "2026-10-19T00:00:00Z",
        related: RELATED[slug],
        sourceHosts: HOSTS[slug],
        facts: [],
      });
      expect(page.resources?.some((resource) => resource.label.startsWith("See vendor page for current price"))).toBe(true);
    }
  });

  it("makes no warranty claim for YETI and no tumbler or cooler prices for the outdoor brands", () => {
    for (const slug of ["stanley-vs-yeti", "coleman-vs-yeti"]) {
      const page = expectRoo224Page(slug, {
        category: "products",
        updatedAt: "2026-10-19T00:00:00Z",
        related: RELATED[slug],
        sourceHosts: HOSTS[slug],
        facts: [],
      });
      const text = readerText(page);
      expect(text).not.toMatch(/YETI[^.\n]*(lifetime|year) warranty/i);
      expect(text).not.toMatch(/\$\d+\.\d\d/);
    }
  });
});
