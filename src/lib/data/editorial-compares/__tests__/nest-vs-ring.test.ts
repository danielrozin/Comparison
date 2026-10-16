import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Google Nest vs Ring (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("nest-vs-ring", {
      category: "products",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(store\.google\.com|support\.google\.com|ring\.com)\//,
      facts: ["$10 a month", "$4.99", "180 days", "10 days of 24/7", "professional monitoring"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
