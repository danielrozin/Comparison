import { beforeEach, describe, expect, it, vi } from "vitest";

const payload = {
  title: "Canoe vs Kayak",
  shortAnswer:
    "Canoes seat 2-3 people and carry more gear. Kayaks are faster and suit one or two paddlers on open water.",
  verdict:
    "Choose a canoe if you want cargo space and easy entry for a family trip. Choose a kayak if you want speed and a covered cockpit for longer paddles.",
  category: "outdoors",
  entities: [
    { name: "Canoe", shortDesc: "Open boat", entityType: "product", pros: ["More cargo", "Easier entry"], cons: ["Slower on flat water"], bestFor: "Families" },
    { name: "Kayak", shortDesc: "Covered boat", entityType: "product", pros: ["Higher speed", "Straighter tracking"], cons: ["Less cargo room"], bestFor: "Solo paddlers" },
  ],
  keyDifferences: [
    { label: "Seats", entityAValue: "2-3 people", entityBValue: "1-2 people", winner: "a" },
    { label: "Cargo", entityAValue: "40-80 lbs", entityBValue: "25-50 lbs", winner: "a" },
    { label: "Speed", entityAValue: "3-4 mph", entityBValue: "4-6 mph", winner: "b" },
  ],
  attributes: [
    { name: "Length", unit: "ft", dataType: "number", entityAValue: "16 ft", entityANumber: 16, entityBValue: "12 ft", entityBNumber: 12, winner: "a" },
    { name: "Cargo", unit: "lbs", dataType: "number", entityAValue: "60 lbs", entityANumber: 60, entityBValue: "35 lbs", entityBNumber: 35, winner: "a" },
    { name: "Speed", unit: "mph", dataType: "number", entityAValue: "3.5 mph", entityANumber: 3.5, entityBValue: "5 mph", entityBNumber: 5, winner: "b" },
    { name: "Seats", unit: "people", dataType: "number", entityAValue: "3 people", entityANumber: 3, entityBValue: "2 people", entityBNumber: 2, winner: "a" },
  ],
  faqs: [],
  quickAnswer: { tldr: "Kayaks are the faster boat.", winnerName: "Kayak", winnerReason: "Speed", keyFact: "About 5 mph versus 3.5 mph" },
  citationStats: { dataPointCount: 8 },
};

vi.mock("@anthropic-ai/sdk", () => {
  class Anthropic {
    messages = {
      create: async () => ({ content: [{ type: "text", text: JSON.stringify(payload) }] }),
    };
  }
  return { default: Anthropic };
});

vi.mock("@/lib/services/tavily-service", () => ({
  enrichComparisonData: vi.fn(async () => ({
    context: "Canoes are open. Kayaks are covered.",
    sources: [
      { url: "https://www.rei.com/learn/expert-advice/canoe.html", title: "REI", content: "canoe", score: 1 },
      { url: "https://rei.com/kayak", title: "REI again", content: "kayak", score: 1 },
      { url: "https://en.wikipedia.org/wiki/Kayak", title: "Wikipedia", content: "kayak", score: 1 },
    ],
  })),
}));

vi.mock("@/lib/services/image-service", () => ({
  fetchEntityImages: vi.fn(async () => new Map()),
}));

vi.mock("@/lib/posthog-otel", () => ({
  setPostHogDistinctId: vi.fn(),
}));

import { generateComparison } from "@/lib/services/ai-comparison-generator";

describe("generateComparison ids and sources", () => {
  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
    let clock = 1_700_000_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => {
      clock += 5;
      return clock;
    });
  });

  it("links every attribute value to an entity id from the same stamp and counts distinct hosts", async () => {
    const result = await generateComparison("Canoe", "Kayak", "canoe-vs-kayak");
    expect(result.success).toBe(true);
    const comparison = result.comparison!;
    const entityIds = new Set(comparison.entities.map((entity) => entity.id));
    expect(entityIds.size).toBe(2);
    for (const attribute of comparison.attributes) {
      expect(attribute.values.map((value) => value.entityId).every((id) => entityIds.has(id))).toBe(true);
    }
    const suffixes = [...entityIds].map((id) => id.split("-").pop());
    expect(new Set(suffixes).size).toBe(1);
    expect(comparison.citationStats?.sourceCount).toBe(2);
    expect(comparison.citationStats?.sources.map((source) => source.name)).toEqual([
      "rei.com",
      "en.wikipedia.org",
    ]);
  });
});
