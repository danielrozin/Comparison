import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Apple M5 Max vs Apple M5 Pro (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("m5-max-vs-m5-pro", {
      category: "technology",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["macbook-air-vs-macbook-pro"],
      sourceHosts: /^https:\/\/(www\.apple\.com)\//,
      facts: ["614GB/s", "307GB/s", "128GB", "40-core", "22 hours"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
