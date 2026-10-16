import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Mastercard vs Visa (ROO-224)", () => {
  it("publishes a no-winner network compare from Visa and Mastercard sources", () => {
    const page = expectRoo224Page("mastercard-vs-visa", {
      category: "finance",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["american-express-vs-mastercard", "credit-card-vs-debit-card"],
      sourceHosts: /^https:\/\/(www\.mastercard\.(com|us)|usa\.visa\.com|www\.visa\.com)\//,
      facts: ["more than 210 countries", "more than 200 countries", "five business days", "World Elite", "Visa Infinite", "159.4 billion", "329 billion"],
    });
    const text = readerText(page);
    expect(text).toContain("not financial advice");
    expect(text).not.toMatch(/\bAPR of\b|\d+(\.\d+)?% APR|annual fee of \$/i);
  });
});
