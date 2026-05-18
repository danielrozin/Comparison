import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock external services so the sitemap function only depends on synchronous
// in-process logic (the routing/coercion check we care about).
vi.mock("@/lib/services/comparison-service", () => ({
  getAllSitemapData: vi.fn(async () => ({
    comparisons: [
      { slug: "messi-vs-ronaldo", updatedAt: "2026-04-01T00:00:00.000Z" },
      { slug: "japan-vs-china", updatedAt: "2026-04-02T00:00:00.000Z" },
    ],
    entities: new Map<string, string>([
      ["messi", "2026-04-01T00:00:00.000Z"],
      ["ronaldo", "2026-04-01T00:00:00.000Z"],
    ]),
  })),
}));

vi.mock("@/lib/services/blog-generator", () => ({
  listBlogArticles: vi.fn(async () => ({
    articles: [
      { slug: "best-vs-comparisons-2026", updatedAt: "2026-04-15T00:00:00.000Z" },
    ],
    total: 1,
  })),
}));

vi.mock("@/lib/services/review-service", () => ({
  getReviewCategories: vi.fn(async () => [
    { slug: "technology", name: "Technology", count: 5 },
  ]),
  getReviewedEntities: vi.fn(async () => ({
    entities: [
      {
        slug: "iphone-17",
        reviewAggregation: { lastAggregatedAt: new Date("2026-04-10T00:00:00.000Z") },
      },
    ],
    total: 1,
  })),
}));

import sitemap, { generateSitemaps } from "../sitemap";
import { GET as sitemapIndex } from "../sitemap.xml/route";

describe("sitemap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("declares all five shards via generateSitemaps", async () => {
    const shards = await generateSitemaps();
    expect(shards).toEqual([{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
  });

  // Regression for DAN-382: Next.js passes the URL segment as a string when
  // resolving `/sitemap/0.xml`, so a strict `id === 0` check fell through to
  // the empty default. Each shard must populate for both numeric and string ids.
  describe.each([
    [0, "static + category"],
    [1, "comparison"],
    [2, "entity + alternatives"],
    [3, "blog"],
    [4, "review"],
  ])("shard %i (%s)", (id, _label) => {
    it("returns URLs when id is a number", async () => {
      const result = await sitemap({ id });
      expect(result.length).toBeGreaterThan(0);
      for (const entry of result) {
        expect(entry.url).toMatch(/^https:\/\/www\.aversusb\.net(\/|$)/);
      }
    });

    it("returns URLs when id is a string (Next.js URL-segment case)", async () => {
      const result = await sitemap({ id: String(id) as unknown as number });
      expect(result.length).toBeGreaterThan(0);
    });

    it("returns the same content for numeric and string ids", async () => {
      const numeric = await sitemap({ id });
      const stringy = await sitemap({ id: String(id) as unknown as number });
      expect(stringy.map((e) => e.url)).toEqual(numeric.map((e) => e.url));
    });
  });

  it("shard 0 always contains the homepage even with no DB", async () => {
    const result = await sitemap({ id: 0 });
    const urls = result.map((e) => e.url);
    expect(urls).toContain("https://www.aversusb.net");
  });

  it("returns an empty array for unknown shard ids", async () => {
    const result = await sitemap({ id: 99 });
    expect(result).toEqual([]);
  });
});

describe("sitemap.xml index route", () => {
  it("returns a sitemap index XML pointing at every shard", async () => {
    const res = await sitemapIndex();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/xml");
    const body = await res.text();
    expect(body).toContain("<sitemapindex");
    expect(body).toContain("https://www.aversusb.net/sitemap/0.xml");
    expect(body).toContain("https://www.aversusb.net/sitemap/1.xml");
    expect(body).toContain("https://www.aversusb.net/sitemap/2.xml");
    expect(body).toContain("https://www.aversusb.net/sitemap/3.xml");
    expect(body).toContain("https://www.aversusb.net/sitemap/4.xml");
  });
});
