import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Serena Williams vs Venus Williams (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("serena-vs-venus-williams", {
      category: "sports",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(www\.wtatennis\.com)\//,
      facts: ["23 Grand Slam", "73", "49", "319 weeks", "14 Grand Slam doubles"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
