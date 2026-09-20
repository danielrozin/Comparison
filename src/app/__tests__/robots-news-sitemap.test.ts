import { describe, it, expect } from "vitest";

import robots from "../robots";

describe("robots.txt sitemap declarations", () => {
  it("does not declare the empty Google News sitemap", () => {
    const result = robots();
    const sitemaps = Array.isArray(result.sitemap)
      ? result.sitemap
      : result.sitemap
        ? [result.sitemap]
        : [];

    expect(sitemaps).toContain("https://www.aversusb.net/sitemap.xml");
    expect(sitemaps.some((s) => s.includes("/sitemap/news.xml"))).toBe(false);
  });
});
