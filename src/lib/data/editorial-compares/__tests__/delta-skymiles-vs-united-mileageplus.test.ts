import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Delta SkyMiles vs United MileagePlus (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("delta-skymiles-vs-united-mileageplus", {
      category: "travel",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["delta-vs-united"],
      sourceHosts: /^https:\/\/(www\.delta\.com|www\.united\.com)\//,
      facts: ["$28,000", "6,000 PQP", "January 1, 2027", "$2,500", "4 United"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
