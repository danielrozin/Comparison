import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Active Duty vs Army National Guard (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("active-duty-vs-national-guard", {
      category: "military",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(www\.goarmy\.com)\//,
      facts: ["one weekend a month", "two weeks a year", "all 50 states", "three to six years", "10 weeks"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
