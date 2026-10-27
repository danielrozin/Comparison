import { describe, expect, it, vi } from "vitest";
import {
  dominantSuggestionCategory,
  selectGenerationFallbackSuggestions,
  type FallbackSuggestion,
} from "@/lib/generation/fallback-suggestions";
import {
  inferredComparisonCategory,
  loadGenerationFallbackSuggestions,
} from "@/lib/generation/load-fallback-suggestions";
import { safeGenerationFailureReason } from "@/lib/generation/safe-failure-reason";

const mailchimp: FallbackSuggestion[] = [
  { slug: "mailchimp-vs-constant-contact", title: "Mailchimp vs Constant Contact", category: "software" },
  { slug: "activecampaign-vs-mailchimp", title: "ActiveCampaign vs Mailchimp", category: "software" },
  { slug: "not-a-side-vs-other", title: "Loose slug contains match", category: "software" },
];

const klaviyo: FallbackSuggestion[] = [
  { slug: "klaviyo-vs-omnisend", title: "Klaviyo vs Omnisend", category: "software" },
  { slug: "drip-vs-klaviyo", title: "Drip vs Klaviyo", category: "software" },
  { slug: "klaviyo-vs-mailchimp", title: "Klaviyo vs Mailchimp", category: "software" },
];

describe("safeGenerationFailureReason", () => {
  it("keeps short codes and drops provider text", () => {
    expect(safeGenerationFailureReason("anthropic", "unknown")).toBe("anthropic");
    expect(safeGenerationFailureReason("unknown_entity:Mailchimp", "refused")).toBe("unknown_entity");
    expect(safeGenerationFailureReason("invalid x-api-key", "server_error")).toBe("server_error");
    expect(safeGenerationFailureReason("sk-ant-secret-value", "server_error")).toBe("server_error");
    expect(safeGenerationFailureReason("", "timeout")).toBe("timeout");
    expect(safeGenerationFailureReason(undefined, "not a code")).toBe("unknown");
  });
});

describe("selectGenerationFallbackSuggestions", () => {
  it("prefers live comparisons of either entity and drops the requested pair", () => {
    const result = selectGenerationFallbackSuggestions({
      requestedSlug: "mailchimp-vs-klaviyo",
      entitySlugs: ["mailchimp", "klaviyo"],
      byEntity: [mailchimp, klaviyo],
      categoryComparisons: [{ slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "software" }],
      popularComparisons: [{ slug: "usa-vs-china", title: "USA vs China", category: "countries" }],
    });

    expect(result.source).toBe("entity");
    expect(result.suggestions.map((item) => item.slug)).toEqual([
      "klaviyo-vs-mailchimp",
      "mailchimp-vs-constant-contact",
      "klaviyo-vs-omnisend",
      "activecampaign-vs-mailchimp",
    ]);
    expect(result.suggestions.some((item) => item.slug === "not-a-side-vs-other")).toBe(false);
    expect(result.suggestions.some((item) => item.slug === "usa-vs-china")).toBe(false);
  });

  it("fills from the same category when fewer than three entity pages exist", () => {
    const result = selectGenerationFallbackSuggestions({
      requestedSlug: "mailchimp-vs-klaviyo",
      entitySlugs: ["mailchimp", "klaviyo"],
      byEntity: [mailchimp.slice(0, 1), []],
      categoryComparisons: [
        { slug: "hubspot-vs-salesforce", title: "HubSpot vs Salesforce", category: "software" },
        { slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "software" },
        { slug: "figma-vs-sketch", title: "Figma vs Sketch", category: "software" },
      ],
      popularComparisons: [{ slug: "usa-vs-china", title: "USA vs China", category: "countries" }],
    });

    expect(result.source).toBe("mixed");
    expect(result.suggestions).toHaveLength(4);
    expect(result.suggestions[0].slug).toBe("mailchimp-vs-constant-contact");
    expect(result.suggestions.map((item) => item.slug)).not.toContain("usa-vs-china");
  });

  it("uses category pages when neither entity has a live comparison", () => {
    const result = selectGenerationFallbackSuggestions({
      requestedSlug: "mailchimp-vs-klaviyo",
      entitySlugs: ["mailchimp", "klaviyo"],
      byEntity: [[], []],
      categoryComparisons: [
        { slug: "hubspot-vs-salesforce", title: "HubSpot vs Salesforce", category: "software" },
        { slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "software" },
        { slug: "figma-vs-sketch", title: "Figma vs Sketch", category: "software" },
      ],
      popularComparisons: [{ slug: "usa-vs-china", title: "USA vs China", category: "countries" }],
    });

    expect(result.source).toBe("category");
    expect(result.suggestions).toHaveLength(3);
    expect(result.suggestions.map((item) => item.slug)).not.toContain("usa-vs-china");
  });

  it("uses popular pages only when entity and category lists are short", () => {
    const result = selectGenerationFallbackSuggestions({
      requestedSlug: "mailchimp-vs-klaviyo",
      entitySlugs: ["mailchimp", "klaviyo"],
      byEntity: [[], []],
      categoryComparisons: [],
      popularComparisons: [
        { slug: "usa-vs-china", title: "USA vs China", category: "countries" },
        { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo", category: "sports" },
        { slug: "iphone-17-vs-samsung-s26", title: "iPhone 17 vs Samsung Galaxy S26", category: "technology" },
      ],
    });

    expect(result.source).toBe("popular");
    expect(result.suggestions).toHaveLength(3);
  });

  it("does not pad a full entity list with popular pages", () => {
    const result = selectGenerationFallbackSuggestions({
      requestedSlug: "deel-vs-remote",
      entitySlugs: ["deel", "remote"],
      byEntity: [
        [
          { slug: "deel-vs-rippling", title: "Deel vs Rippling", category: "software" },
          { slug: "deel-vs-gusto", title: "Deel vs Gusto", category: "software" },
          { slug: "oyster-vs-deel", title: "Oyster vs Deel", category: "software" },
        ],
        [],
      ],
      categoryComparisons: [],
      popularComparisons: [{ slug: "usa-vs-china", title: "USA vs China", category: "countries" }],
    });

    expect(result.source).toBe("entity");
    expect(result.suggestions).toHaveLength(3);
  });
});

describe("dominantSuggestionCategory", () => {
  it("picks the category that appears most and skips general", () => {
    expect(
      dominantSuggestionCategory([
        { slug: "a-vs-b", title: "A vs B", category: "general" },
        { slug: "c-vs-d", title: "C vs D", category: "Software" },
        { slug: "e-vs-f", title: "E vs F", category: "software" },
      ]),
    ).toBe("Software");
    expect(dominantSuggestionCategory([])).toBeNull();
  });
});

describe("loadGenerationFallbackSuggestions", () => {
  it("does not ask for category or popular rows when either entity has three live pages", async () => {
    const comparisonsByCategory = vi.fn(async () => []);
    const popularComparisons = vi.fn(async () => []);
    const result = await loadGenerationFallbackSuggestions("mailchimp-vs-klaviyo", {
      comparisonsForEntity: async (entity) => (entity === "mailchimp" ? mailchimp : klaviyo),
      comparisonsByCategory,
      popularComparisons,
    });

    expect(result.source).toBe("entity");
    expect(result.suggestions.length).toBeGreaterThanOrEqual(3);
    expect(comparisonsByCategory).not.toHaveBeenCalled();
    expect(popularComparisons).not.toHaveBeenCalled();
  });

  it("asks the category of the entity matches when those matches are thin", async () => {
    const comparisonsByCategory = vi.fn(async () => [
      { slug: "hubspot-vs-salesforce", title: "HubSpot vs Salesforce", category: "software" },
      { slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "software" },
    ]);
    const result = await loadGenerationFallbackSuggestions("mailchimp-vs-klaviyo", {
      comparisonsForEntity: async (entity) => (entity === "mailchimp" ? mailchimp.slice(0, 1) : []),
      comparisonsByCategory,
      popularComparisons: async () => [],
    });

    expect(comparisonsByCategory).toHaveBeenCalledWith("software", 8);
    expect(result.suggestions.map((item) => item.slug)).toContain("hubspot-vs-salesforce");
    expect(result.source).toBe("mixed");
  });

  it("falls back to popular pages when the names do not map to a category", async () => {
    expect(inferredComparisonCategory("mailchimp", "klaviyo")).toBeNull();
    const popularComparisons = vi.fn(async () => [
      { slug: "usa-vs-china", title: "USA vs China", category: "countries" },
      { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo", category: "sports" },
      { slug: "chatgpt-vs-claude", title: "ChatGPT vs Claude", category: "technology" },
    ]);
    const result = await loadGenerationFallbackSuggestions("mailchimp-vs-klaviyo", {
      comparisonsForEntity: async () => [],
      comparisonsByCategory: vi.fn(async () => []),
      popularComparisons,
    });

    expect(popularComparisons).toHaveBeenCalled();
    expect(result.source).toBe("popular");
    expect(result.suggestions).toHaveLength(3);
  });

  it("uses a known category when neither entity has a page", async () => {
    expect(inferredComparisonCategory("chatgpt", "claude")).toBe("technology");
    const comparisonsByCategory = vi.fn(async () => [
      { slug: "gemini-vs-copilot", title: "Gemini vs Copilot", category: "technology" },
      { slug: "midjourney-vs-dalle", title: "Midjourney vs DALL-E", category: "technology" },
      { slug: "notion-vs-obsidian", title: "Notion vs Obsidian", category: "technology" },
    ]);
    const result = await loadGenerationFallbackSuggestions("chatgpt-vs-claude", {
      comparisonsForEntity: async () => [],
      comparisonsByCategory,
      popularComparisons: vi.fn(async () => [{ slug: "usa-vs-china", title: "USA vs China" }]),
    });

    expect(comparisonsByCategory).toHaveBeenCalledWith("technology", 8);
    expect(result.source).toBe("category");
    expect(result.suggestions.map((item) => item.slug)).not.toContain("usa-vs-china");
  });

  it("still returns popular pages when a lookup throws", async () => {
    const result = await loadGenerationFallbackSuggestions("mailchimp-vs-klaviyo", {
      comparisonsForEntity: async () => {
        throw new Error("db down");
      },
      comparisonsByCategory: async () => {
        throw new Error("db down");
      },
      popularComparisons: async () => [
        { slug: "usa-vs-china", title: "USA vs China" },
        { slug: "messi-vs-ronaldo", title: "Messi vs Ronaldo" },
        { slug: "chatgpt-vs-claude", title: "ChatGPT vs Claude" },
      ],
    });

    expect(result.source).toBe("popular");
    expect(result.suggestions).toHaveLength(3);
  });
});
