import { describe, expect, it } from "vitest";
import { topicBuildSlug, topicSides } from "@/lib/blog/blog-topic-compare";
import { blogCompareFallbackLinks, compareHasSide } from "@/lib/blog/blog-compare-fallback";

// ROO-224: every blog post the 2026-10-14 crawl found linking a 404 compare.
const DEAD_LINK_POSTS = [
  "49ers-vs-rams-2026-rivalry-history-head-to-head-stats",
  "national-guard-vs-active-duty-which-military-path-is-right-for-you-2026",
  "best-macbook-for-college-students-2026-air-vs-pro-buying-guide",
  "argentina-vs-france-world-cup-2026-head-to-head-stats-prediction",
  "brazil-vs-england-world-cup-2026-head-to-head-stats-history-prediction",
  "free-vs-paid-password-managers-guide",
  "steam-vs-gog-where-to-buy-pc-games-2026",
  "x-vs-y-seo-keywords",
  "mastercard-gold-vs-platinum-vs-infinite-2026-which-card-tier-worth-it",
  "visa-vs-mastercard-2026-which-card-network-is-better",
  "tesla-model-y-vs-model-3-for-families-which-tesla-2026",
  "ring-vs-nest-video-doorbell-2026-which-smart-doorbell-to-buy",
  "suv-vs-sedan-total-cost-of-ownership-2026",
  "sp-500-vs-total-stock-market-does-it-matter-for-long-term-investors",
  "rtx-5080-vs-rtx-4090",
  "medicaid-vs-medicare",
];

const noDeps = {
  comparisonsForEntity: async () => [],
  filterLive: async () => [],
  publishedEntities: async () => new Set<string>(),
  entityLabel: (slug: string) => slug,
};

describe("ROO-224 slug parsing keeps whole names", () => {
  it.each([
    ["steam-vs-gog-where-to-buy-pc-games-2026", "gog-vs-steam"],
    ["argentina-vs-france-world-cup-2026-head-to-head-stats-prediction", "argentina-vs-france"],
    ["brazil-vs-england-world-cup-2026-head-to-head-stats-history-prediction", "brazil-vs-england"],
    ["suv-vs-sedan-total-cost-of-ownership-2026", "sedan-vs-suv"],
    ["49ers-vs-rams-2026-rivalry-history-head-to-head-stats", "49ers-vs-rams"],
    ["imax-vs-dolby-cinema-2026-is-the-premium-ticket-worth-it", "dolby-cinema-vs-imax"],
  ])("%s -> %s", (post, expected) => {
    expect(topicBuildSlug(post)).toBe(expected);
  });

  it("does not cut the right side short", () => {
    expect(topicSides("tesla-model-y-vs-model-3-for-families-which-tesla-2026")).toEqual(["tesla-model-y", "model-3"]);
    expect(topicBuildSlug("free-vs-paid-password-managers-guide")).not.toBe("free-vs-paid-password");
  });

  it("treats 'free vs paid password managers' as one topic, not two entities", () => {
    expect(topicSides("free-vs-paid-password-managers-guide")).toBeNull();
  });

  it("carries the brand onto a bare tier", () => {
    expect(topicSides("mastercard-gold-vs-platinum-vs-infinite-2026-which-card-tier-worth-it")).toEqual([
      "mastercard-gold",
      "mastercard-platinum",
    ]);
  });

  it("does not invent a brand for a normal pair", () => {
    expect(topicSides("airpods-pro-vs-sony-wf-1000xm5-review-2026")?.[0]).toBe("airpods-pro");
  });
});

describe("ROO-224 the card never links a missing page", () => {
  it.each(DEAD_LINK_POSTS)("%s: no live page anywhere -> no links", async (post) => {
    expect(await blogCompareFallbackLinks(post, null, noDeps)).toEqual([]);
  });

  it("links only compares the live filter kept, closest first", async () => {
    const links = await blogCompareFallbackLinks("steam-vs-gog-where-to-buy-pc-games-2026", null, {
      ...noDeps,
      comparisonsForEntity: async (name) =>
        name === "steam"
          ? [
              { slug: "epic-games-vs-steam", title: "Epic Games vs Steam" },
              { slug: "gog-vs-steam", title: "GOG vs Steam" },
              { slug: "steam-deck-vs-switch", title: "Steam Deck vs Switch" },
            ]
          : [{ slug: "gog-vs-steam", title: "GOG vs Steam" }],
      filterLive: async (slugs) => slugs.filter((s) => s !== "gog-vs-steam"),
    });
    expect(links.map((l) => l.slug)).toEqual(["epic-games-vs-steam", "steam-deck-vs-switch"]);
    expect(links.every((l) => !l.href)).toBe(true);
  });

  it("falls back to published entity pages", async () => {
    const links = await blogCompareFallbackLinks("medicaid-vs-medicare", null, {
      ...noDeps,
      publishedEntities: async () => new Set(["medicare"]),
    });
    expect(links).toEqual([{ slug: "medicare", title: "medicare", href: "/entity/medicare" }]);
  });

  it("matches sides on whole words only", () => {
    expect(compareHasSide("airpods-vs-galaxy-buds", "air")).toBe(false);
    expect(compareHasSide("epic-games-vs-steam", "steam")).toBe(true);
    expect(compareHasSide("steam-deck-vs-switch", "steam")).toBe(true);
  });
});
