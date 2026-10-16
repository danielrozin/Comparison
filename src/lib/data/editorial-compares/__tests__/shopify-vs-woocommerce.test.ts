import { describe, expect, it } from "vitest";
import { expectRoo224Page, readerText } from "./roo224-page-checks";

describe("Shopify vs WooCommerce (ROO-224)", () => {
  it("publishes a no-winner compare from official sources", () => {
    const page = expectRoo224Page("shopify-vs-woocommerce", {
      category: "software",
      updatedAt: "2026-10-16T00:00:00Z",
      related: ["squarespace-vs-wix", "wordpress-vs-wix"],
      sourceHosts: /^https:\/\/(www\.shopify\.com|woocommerce\.com|wordpress\.org)\//,
      facts: ["$39", "$35", "$2,300", "0.6%", "7 million", "PHP 7.4"],
    });
    expect(readerText(page)).not.toMatch(/\bfps\b|\bfaster than\b|best-selling|#1 /i);
  });
});
