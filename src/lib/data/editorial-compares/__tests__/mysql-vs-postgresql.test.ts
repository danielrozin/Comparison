import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("MySQL vs PostgreSQL (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("mysql-vs-postgresql", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["aws-vs-azure", "docker-vs-kubernetes"],
      sourceHosts: /^https:\/\/(dev\.mysql\.com|www\.postgresql\.org)\//,
      facts: ["GNU General Public License", "PostgreSQL License", "InnoDB", "November 14, 2030", "3 years of extended support"],
    });
    const text = readerText(page);
    expect(text).not.toMatch(/\bfaster\b|\bslower\b|\bfps\b|\bqps\b|transactions per second/i);
  });
});
