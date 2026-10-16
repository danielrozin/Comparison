import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Carnival vs Royal Caribbean (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("carnival-vs-royal-caribbean", {
      category: "travel",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(www\.carnival\.com|royalcaribbeanpresscenter\.com)\//,
      facts: ["29 ships", "30 ships", "1972", "Celebration Key", "Icon of the Seas"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
