import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Costco vs Walmart (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("costco-vs-walmart", {
      category: "companies",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["target-vs-walmart", "kroger-vs-safeway"],
      sourceHosts: /^https:\/\/(customerservice\.costco\.com|investor\.costco\.com|corporate\.walmart\.com)\//,
      facts: ["$65", "$130", "$1,250", "$98", "939 warehouses", "10,900 stores"],
    });
    const text = readerText(page);
    expect(text).not.toMatch(/save \$|savings of|cheaper by/i);
  });
});
