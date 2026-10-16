import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("GEICO vs State Farm (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("geico-vs-state-farm", {
      category: "finance",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["allstate-vs-geico", "farmers-insurance-vs-state-farm", "geico-vs-usaa"],
      sourceHosts: /^https:\/\/(www\.geico\.com|www\.statefarm\.com|newsroom\.statefarm\.com)\//,
      facts: ["1936", "June 7, 1922", "Berkshire Hathaway", "mutual company", "$5 billion"],
    });
    const text = readerText(page);
    expect(text).not.toMatch(/\$\d+ (a|per) (month|year)|average premium|J\.D\. Power|AM Best/i);
  });
});
