import { describe, expect, it } from "vitest";
import { mergeEditorialCategoryComparisons } from "@/lib/categories/hub-comparisons";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

/** Extra reader-copy bans from the Pixel/AEO playbook pages. */
const EXTRA_BANNED = /reddit|\bfps\b|geekbench|antutu|passmark|\bexpert\b|\bfaster than\b|best-selling|#1 /i;
const BARE_PRICE = /\bfrom \$\d|\$\d[\d,.]* at launch/i;

function expectBingPage(slug: string, category: string) {
  const page = expectRoo224Page(slug, {
    category,
    updatedAt: "2026-10-19T00:00:00Z",
    related: RELATED[slug],
    sourceHosts: HOSTS[slug],
    facts: FACTS[slug],
  });
  const text = readerText(page);
  expect(text.match(EXTRA_BANNED)?.[0] ?? null).toBeNull();
  expect(text).not.toMatch(BARE_PRICE);
  expect(page.schemaMarkup).toBeUndefined();
  expect(mergeEditorialCategoryComparisons(category, []).map((card) => card.slug)).toContain(slug);
  return page;
}

const RELATED: Record<string, string[]> = {
  "chrome-vs-edge": ["chrome-vs-safari", "edge-vs-safari", "chrome-vs-firefox"],
  "epic-games-vs-steam": ["epic-games-vs-gog", "steam-vs-xbox-game-pass"],
  "cronometer-vs-myfitnesspal": ["apple-watch-vs-fitbit", "oura-ring-vs-whoop"],
};

const HOSTS: Record<string, RegExp> = {
  "chrome-vs-edge":
    /^https:\/\/(www\.google\.com|support\.google\.com|www\.microsoft\.com|support\.microsoft\.com|learn\.microsoft\.com)\//,
  "epic-games-vs-steam":
    /^https:\/\/(www\.epicgames\.com|legal\.epicgames\.com|store\.steampowered\.com|partner\.steamgames\.com)\//,
  "cronometer-vs-myfitnesspal": /^https:\/\/(cronometer\.com|www\.myfitnesspal\.com|blog\.myfitnesspal\.com)\//,
};

const FACTS: Record<string, string[]> = {
  "chrome-vs-edge": ["Chromium", "Chrome Web Store", "Gemini", "Copilot", "every four weeks", "version 152"],
  "epic-games-vs-steam": ["free game each week", "5% back", "SteamOS", "nearly 1,000 games", "two hours", "14 days"],
  "cronometer-vs-myfitnesspal": [
    "95 nutrients",
    "20.5 million foods",
    "$10.99/month or $59.99/year, per Cronometer pricing page, Oct 2026",
    "Premium+",
  ],
};

describe("Bing 404 build list: software and apps (2026-10-19)", () => {
  it("publishes Chrome vs Edge with no winner", () => {
    const page = expectBingPage("chrome-vs-edge", "software");
    expect(page.entities.map((entity) => entity.name)).toEqual(["Google Chrome", "Microsoft Edge"]);
  });

  it("publishes Epic Games Store vs Steam without an unpublished Steam revenue split", () => {
    const page = expectBingPage("epic-games-vs-steam", "technology");
    expect(readerText(page)).not.toMatch(/70\/30|30%/);
  });

  it("publishes Cronometer vs MyFitnessPal with a dated Cronometer price and vendor links", () => {
    const page = expectBingPage("cronometer-vs-myfitnesspal", "health");
    const vendor = (page.resources ?? []).filter((r) => r.label.startsWith("See vendor page for current price"));
    expect(vendor.map((r) => r.url)).toEqual(["https://cronometer.com/gold/", "https://www.myfitnesspal.com/premium"]);
    // MyFitnessPal's U.S. price could not be read for October 2026, so none is printed.
    expect(readerText(page)).not.toMatch(/\$19\.99|\$24\.99|\$79\.99|\$99\.99/);
  });
});
