import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("AirPods 4 vs AirPods Pro 3 (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("airpods-4-vs-airpods-pro", {
      category: "technology",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(www\.apple\.com)\//,
      facts: ["IP54", "IP57", "8 hours", "30 hours", "Hearing Aid"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
