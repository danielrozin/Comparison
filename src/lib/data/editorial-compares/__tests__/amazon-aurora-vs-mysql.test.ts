import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Amazon Aurora vs MySQL (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("amazon-aurora-vs-mysql", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["mysql-vs-postgresql"],
      sourceHosts: /^https:\/\/(aws\.amazon\.com|docs\.aws\.amazon\.com|dev\.mysql\.com)\//,
      facts: ["256 TiB", "99.99%", "GPL", "Oracle", "PostgreSQL"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
