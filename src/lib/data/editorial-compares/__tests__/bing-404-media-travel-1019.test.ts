import { describe, expect, it } from "vitest";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { decideComparePage } from "@/lib/compare-slug-resolution";
import { getConsolidatedCompareSlug, isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { NEVER_PUBLISHED_ALIASES } from "@/lib/redirects/not-found-cleanup-redirects";
import { isEditorialCompareSlug } from "../index";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

const EXTRA_BANNED = /reddit|\bfps\b|geekbench|antutu|passmark|\bexpert\b|\bfaster than\b|best-selling|#1 |most[- ]watched|most honored|number one/i;
const BARE_PRICE = /\bfrom \$\d|\$\d[\d,.]* at launch/i;

const CATEGORY: Record<string, string> = {
  "apple-tv-plus-vs-disney-plus": "entertainment",
  "cnn-vs-fox-news": "entertainment",
  "apple-music-vs-youtube-music": "entertainment",
  "google-flights-vs-skyscanner": "travel",
};

const RELATED: Record<string, string[]> = {
  "apple-tv-plus-vs-disney-plus": ["disney-plus-vs-hulu", "disney-vs-netflix", "disney-plus-vs-peacock"],
  "cnn-vs-fox-news": ["disney-vs-hbo-max", "disney-plus-vs-peacock"],
  "apple-music-vs-youtube-music": ["apple-music-vs-spotify", "spotify-vs-youtube-music", "spotify-vs-apple-music-vs-youtube-music"],
  "google-flights-vs-skyscanner": ["google-flights-vs-kayak", "expedia-vs-kayak"],
};

const HOSTS: Record<string, RegExp> = {
  "apple-tv-plus-vs-disney-plus": /^https:\/\/(www\.apple\.com|help\.disneyplus\.com|www\.disneyplus\.com)\//,
  "cnn-vs-fox-news": /^https:\/\/(www\.cnn\.com|www\.foxnews\.com|www\.foxcorporation\.com|www\.foxone\.com)\//,
  "apple-music-vs-youtube-music": /^https:\/\/(www\.apple\.com|support\.google\.com|www\.youtube\.com)\//,
  "google-flights-vs-skyscanner": /^https:\/\/(support\.google\.com|www\.partners\.skyscanner\.net)\//,
};

const FACTS: Record<string, string[]> = {
  "apple-tv-plus-vs-disney-plus": [
    "$14.99/month, per Apple pricing page, Oct 2026",
    "$12.49/month, per Disney+ pricing page, Oct 2026",
    "$21.49/month or $214.99/year, per Disney+ pricing page, Oct 2026",
    "Apple TV+ is now called Apple TV",
    "Junior Mode",
  ],
  "cnn-vs-fox-news": ["Skydance Corporation", "Fox Corporation", "CNN en Español", "FOX Business Network", "$19.99/month, per FOX One pricing page, Oct 2026"],
  "apple-music-vs-youtube-music": [
    "$11.99/month, per Apple Music pricing page, Oct 2026",
    "100 million songs",
    "192kHz",
    "Smart Downloads",
    "See vendor page for current price",
  ],
  "google-flights-vs-skyscanner": ["more than 300", "Best and Cheapest", "2003", "160 million", "1,200+", "20%"],
};

describe("Bing 404 build list: streaming, news and travel (2026-10-19)", () => {
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

  it("prints no YouTube Music dollar price and no CNN subscription price", () => {
    const ytm = readerText(expectRoo224Page("apple-music-vs-youtube-music", {
      category: "entertainment",
      updatedAt: "2026-10-19T00:00:00Z",
      related: RELATED["apple-music-vs-youtube-music"],
      sourceHosts: HOSTS["apple-music-vs-youtube-music"],
      facts: [],
    }));
    // Only Apple Music prices appear; YouTube Music readers get the vendor link.
    expect(new Set(ytm.match(/\$\d[\d,.]*\d/g) ?? [])).toEqual(new Set(["$11.99", "$19.99", "$6.99"]));
    const page = expectRoo224Page("cnn-vs-fox-news", {
      category: "entertainment",
      updatedAt: "2026-10-19T00:00:00Z",
      related: RELATED["cnn-vs-fox-news"],
      sourceHosts: HOSTS["cnn-vs-fox-news"],
      facts: [],
    });
    const cnnPrices = readerText(page).match(/\$\d[\d,.]*\d/g) ?? [];
    expect(new Set(cnnPrices)).toEqual(new Set(["$19.99"]));
    expect(readerText(page)).not.toMatch(/liberal|conservative|bias|left-leaning|right-leaning/i);
  });

  it("301s the Apple TV vs Disney variants to the apple-tv-plus-vs-disney-plus canonical in one hop", () => {
    expect(isEditorialCompareSlug("apple-tv-plus-vs-disney-plus")).toBe(true);
    for (const alias of ["apple-tv-vs-disney", "disney-vs-apple-tv", "apple-tv-vs-disney-plus", "disney-plus-vs-apple-tv"]) {
      expect(getConsolidatedCompareSlug(alias)).toBe("apple-tv-plus-vs-disney-plus");
      expect(NEVER_PUBLISHED_ALIASES.has(alias)).toBe(true);
    }
    expect(getConsolidatedCompareSlug("apple-tv-plus-vs-disney-plus")).toBeNull();
    // The plain reverse order resolves at runtime to the live canonical.
    const decision = decideComparePage("disney-plus-vs-apple-tv-plus", (candidate) =>
      candidate === "apple-tv-plus-vs-disney-plus" ? "live" : candidate === "disney-plus-vs-apple-tv-plus" ? "hidden" : "missing",
    );
    expect(decision).toEqual({ action: "redirect", destination: "apple-tv-plus-vs-disney-plus" });
  });

  it("makes the existing youtube-music-vs-apple-music alias land on a live page", () => {
    expect(getConsolidatedCompareSlug("youtube-music-vs-apple-music")).toBe("apple-music-vs-youtube-music");
    expect(isEditorialCompareSlug("apple-music-vs-youtube-music")).toBe(true);
  });
});
