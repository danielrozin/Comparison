/**
 * Tests for humanizeEntityName (DAN-1141).
 * Covers the acceptance-criteria slugs plus the four token rules: acronym set,
 * brand map, particle lowercasing, and model-number preservation.
 */
import { describe, it, expect } from "vitest";
import { humanizeEntityName } from "../humanize";

describe("humanizeEntityName — acceptance criteria (DAN-1141)", () => {
  const cases: [string, string][] = [
    ["ios", "iOS"],
    ["us-economy", "US Economy"],
    ["bmw-i4", "BMW i4"],
    ["apple-ipad", "Apple iPad"],
    ["youtube-tv", "YouTube TV"],
    ["proton-vpn", "Proton VPN"],
    ["perplexity-ai", "Perplexity AI"],
    ["iphone-17-pro", "iPhone 17 Pro"],
    ["suv", "SUV"],
    ["united-states-gdp-2026", "United States GDP 2026"],
    ["2026-bmw-330i", "2026 BMW 330i"],
    ["smart-tv-2026-models", "Smart TV 2026 Models"],
  ];

  it.each(cases)("humanizeEntityName(%j) -> %j", (slug, expected) => {
    expect(humanizeEntityName(slug)).toBe(expected);
  });
});

describe("humanizeEntityName — acronym set", () => {
  it("uppercases standalone acronyms", () => {
    expect(humanizeEntityName("us")).toBe("US");
    expect(humanizeEntityName("uk")).toBe("UK");
    expect(humanizeEntityName("eu")).toBe("EU");
    expect(humanizeEntityName("gpu")).toBe("GPU");
    expect(humanizeEntityName("cpu")).toBe("CPU");
    expect(humanizeEntityName("hbo")).toBe("HBO");
    expect(humanizeEntityName("nasa")).toBe("NASA");
  });

  it("handles intercaps OS acronyms", () => {
    expect(humanizeEntityName("ios")).toBe("iOS");
    expect(humanizeEntityName("macos")).toBe("macOS");
    expect(humanizeEntityName("ipados")).toBe("iPadOS");
  });

  it("keeps acronyms within multi-word names", () => {
    expect(humanizeEntityName("us-economy")).toBe("US Economy");
    expect(humanizeEntityName("nvidia-gpu")).toBe("Nvidia GPU");
    expect(humanizeEntityName("4k-tv")).toBe("4K TV");
  });
});

describe("humanizeEntityName — brand map", () => {
  it("restores brand intercaps", () => {
    expect(humanizeEntityName("iphone")).toBe("iPhone");
    expect(humanizeEntityName("ipad")).toBe("iPad");
    expect(humanizeEntityName("airpods")).toBe("AirPods");
    expect(humanizeEntityName("youtube")).toBe("YouTube");
    expect(humanizeEntityName("nordvpn")).toBe("NordVPN");
    expect(humanizeEntityName("expressvpn")).toBe("ExpressVPN");
    expect(humanizeEntityName("chatgpt")).toBe("ChatGPT");
    expect(humanizeEntityName("openai")).toBe("OpenAI");
    expect(humanizeEntityName("github")).toBe("GitHub");
  });

  it("handles brands inside multi-word slugs", () => {
    expect(humanizeEntityName("apple-iphone")).toBe("Apple iPhone");
    // "vs" lowercased as a particle; both brands restored from the brand map.
    expect(humanizeEntityName("nordvpn-vs-expressvpn")).toBe("NordVPN vs ExpressVPN");
  });
});

describe("humanizeEntityName — particle lowercasing", () => {
  it("lowercases particles except when leading", () => {
    expect(humanizeEntityName("lord-of-the-rings")).toBe("Lord of the Rings");
    expect(humanizeEntityName("game-of-thrones")).toBe("Game of Thrones");
    expect(humanizeEntityName("the-office")).toBe("The Office");
    expect(humanizeEntityName("call-of-duty")).toBe("Call of Duty");
  });

  it("capitalizes a particle when it is the first word", () => {
    expect(humanizeEntityName("the-witcher")).toBe("The Witcher");
    expect(humanizeEntityName("for-honor")).toBe("For Honor");
  });
});

describe("humanizeEntityName — model-number preservation", () => {
  it("keeps alphanumeric model tokens verbatim", () => {
    expect(humanizeEntityName("bmw-i4")).toBe("BMW i4");
    expect(humanizeEntityName("2026-bmw-330i")).toBe("2026 BMW 330i");
    expect(humanizeEntityName("iphone-17-pro")).toBe("iPhone 17 Pro");
    expect(humanizeEntityName("a19-chip")).toBe("a19 Chip");
  });

  it("prefers acronym overrides over the digit rule (4k, ps5, 5g)", () => {
    expect(humanizeEntityName("4k")).toBe("4K");
    expect(humanizeEntityName("ps5")).toBe("PS5");
    expect(humanizeEntityName("5g-network")).toBe("5G Network");
  });
});

describe("humanizeEntityName — edge cases", () => {
  it("returns empty string for empty input", () => {
    expect(humanizeEntityName("")).toBe("");
  });

  it("collapses extra hyphens and trims", () => {
    expect(humanizeEntityName("--proton--vpn--")).toBe("Proton VPN");
    expect(humanizeEntityName("  proton-vpn  ")).toBe("Proton VPN");
  });

  it("capitalizes plain words", () => {
    expect(humanizeEntityName("samsung-galaxy")).toBe("Samsung Galaxy");
    expect(humanizeEntityName("lionel-messi")).toBe("Lionel Messi");
  });
});
