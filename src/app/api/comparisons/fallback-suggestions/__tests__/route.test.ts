import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/services/comparison-service", () => ({
  getComparisonsForEntity: vi.fn(),
  searchComparisons: vi.fn(async () => []),
  getComparisonsByCategory: vi.fn(async () => ({ comparisons: [], total: 0 })),
  getTrendingComparisons: vi.fn(async () => []),
}));

import { GET } from "../route";
import {
  getComparisonsByCategory,
  getComparisonsForEntity,
  getTrendingComparisons,
} from "@/lib/services/comparison-service";

describe("GET /api/comparisons/fallback-suggestions", () => {
  beforeEach(() => {
    vi.mocked(getComparisonsForEntity).mockReset();
    vi.mocked(getComparisonsByCategory).mockReset();
    vi.mocked(getTrendingComparisons).mockReset();
    vi.mocked(getTrendingComparisons).mockResolvedValue([]);
    vi.mocked(getComparisonsByCategory).mockResolvedValue({ comparisons: [], total: 0 });
  });

  it("returns entity comparisons for the requested pair", async () => {
    vi.mocked(getComparisonsForEntity).mockImplementation(async (entity: string) => {
      if (entity === "mailchimp") {
        return [
          { slug: "mailchimp-vs-constant-contact", title: "Mailchimp vs Constant Contact", category: "software" },
          { slug: "activecampaign-vs-mailchimp", title: "ActiveCampaign vs Mailchimp", category: "software" },
        ];
      }
      if (entity === "klaviyo") {
        return [
          { slug: "klaviyo-vs-omnisend", title: "Klaviyo vs Omnisend", category: "software" },
          { slug: "drip-vs-klaviyo", title: "Drip vs Klaviyo", category: "software" },
        ];
      }
      return [];
    });

    const response = await GET(
      new NextRequest("http://localhost/api/comparisons/fallback-suggestions?slug=mailchimp-vs-klaviyo"),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex");
    expect(body.source).toBe("entity");
    expect(body.suggestions).toHaveLength(4);
    expect(body.suggestions.map((item: { slug: string }) => item.slug)).toEqual(
      expect.arrayContaining(["klaviyo-vs-omnisend", "mailchimp-vs-constant-contact"]),
    );
  });

  it("rejects a slug that is not a comparison", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/comparisons/fallback-suggestions?slug=not-a-pair"),
    );
    expect(response.status).toBe(400);
    expect(getComparisonsForEntity).not.toHaveBeenCalled();
  });
});
