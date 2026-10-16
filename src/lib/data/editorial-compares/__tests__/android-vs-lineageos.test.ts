import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Android vs LineageOS (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("android-vs-lineageos", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: [],
      sourceHosts: /^https:\/\/(source\.android\.com|lineageos\.org|wiki\.lineageos\.org)\//,
      facts: ["Android 17", "20 manufacturers", "MicroG", "Play Integrity", "Q4"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
