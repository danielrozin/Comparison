import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Microsoft Edge vs Safari (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("edge-vs-safari", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["chrome-vs-safari", "firefox-vs-safari"],
      sourceHosts: /^https:\/\/(www\.microsoft\.com|www\.apple\.com)\//,
      facts: ["Linux", "Copilot", "Intelligent Tracking Prevention", "InPrivate", "Apple devices"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
