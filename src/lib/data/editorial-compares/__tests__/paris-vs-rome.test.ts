import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Paris vs Rome (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("paris-vs-rome", {
      category: "travel",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["paris-vs-london-population"],
      sourceHosts: /^https:\/\/(www\.insee\.fr|whc\.unesco\.org)\//,
      facts: ["2,103,778", "1991", "1980", "1,469.7", "538"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
