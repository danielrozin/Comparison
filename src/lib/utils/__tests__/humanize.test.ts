import { describe, it, expect } from "vitest";
import { caseSlug, humanizeEntityName } from "@/lib/utils/humanize";

describe("caseSlug — acronyms", () => {
  it.each([
    ["ios", "iOS"],
    ["us-economy", "US Economy"],
    ["united-states-gdp-2026", "United States GDP 2026"],
    ["suv", "SUV"],
    ["proton-vpn", "Proton VPN"],
    ["youtube-tv", "YouTube TV"],
    ["perplexity-ai", "Perplexity AI"],
  ])("%s -> %s", (slug, expected) => {
    expect(caseSlug(slug)).toBe(expected);
  });
});

describe("caseSlug — brands", () => {
  it.each([
    ["iphone-17-pro", "iPhone 17 Pro"],
    ["apple-ipad", "Apple iPad"],
    ["macbook-air", "MacBook Air"],
    ["nordvpn", "NordVPN"],
    ["chatgpt", "ChatGPT"],
  ])("%s -> %s", (slug, expected) => {
    expect(caseSlug(slug)).toBe(expected);
  });
});

describe("caseSlug — model numbers preserved", () => {
  it.each([
    ["bmw-i4", "BMW i4"],
    ["2026-bmw-330i", "2026 BMW 330i"],
    ["iphone-17-pro", "iPhone 17 Pro"],
  ])("%s -> %s", (slug, expected) => {
    expect(caseSlug(slug)).toBe(expected);
  });
});

describe("caseSlug — particle lowercasing", () => {
  it("lowercases minor words except when first", () => {
    expect(caseSlug("game-of-thrones")).toBe("Game of Thrones");
    expect(caseSlug("the-office")).toBe("The Office");
    expect(caseSlug("of-mice-and-men")).toBe("Of Mice and Men");
  });
});

describe("caseSlug — edge cases", () => {
  it("handles empty and single-token slugs", () => {
    expect(caseSlug("")).toBe("");
    expect(caseSlug("slack")).toBe("Slack");
    expect(caseSlug("notion")).toBe("Notion");
  });
});

describe("humanizeEntityName", () => {
  it("prefers a curated display name when available", () => {
    // samsung-galaxy-s26 appears as a curated alternative under iphone-17
    expect(humanizeEntityName("samsung-galaxy-s26")).toBe("Samsung Galaxy S26");
  });

  it("falls back to the smart caser for uncurated slugs", () => {
    expect(humanizeEntityName("proton-vpn")).toBe("Proton VPN");
    expect(humanizeEntityName("united-states-gdp-2026")).toBe(
      "United States GDP 2026"
    );
  });
});
