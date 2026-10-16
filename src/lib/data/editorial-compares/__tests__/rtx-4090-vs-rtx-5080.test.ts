import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("RTX 4090 vs RTX 5080 (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("rtx-4090-vs-rtx-5080", {
      category: "technology",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["rx-9070-xt-vs-rtx-5080", "nvidia-vs-amd"],
      sourceHosts: /^https:\/\/(www\.nvidia\.com|nvidianews\.nvidia\.com)\//,
      facts: ["$1,599", "$999", "16,384", "10,752", "GDDR7", "360 W"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
