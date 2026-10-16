import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Medicaid vs Medicare (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("medicaid-vs-medicare", {
      category: "health",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["delta-dental-ppo-vs-delta-dental-premier"],
      sourceHosts: /^https:\/\/www\.(medicare|cms|medicaid)\.gov\//,
      facts: ["$202.90", "$283", "$1,736", "65 or older", "133%", "Extra Help"],
    });
    const text = readerText(page);
    expect(text).toContain("not medical, legal or financial advice");
  });
});
