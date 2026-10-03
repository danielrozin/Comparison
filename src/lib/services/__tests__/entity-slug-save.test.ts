import { beforeEach, describe, expect, it, vi } from "vitest";
import type { ComparisonPageData } from "@/types";

const { prisma, entityUpserts, valueEntityIds, reset } = vi.hoisted(() => {
  const entityUpserts: string[] = [];
  const valueEntityIds: string[] = [];
  const stored = new Map<string, {
    id: string;
    slug: string;
    name: string;
    shortDesc: string | null;
    entityType: { slug: string };
    comparisonsA: { comparison: { category: string } }[];
    attributeValues: { attribute: { slug: string } }[];
  }>();

  const travelKayak = {
    id: "ent-kayak-travel",
    slug: "kayak",
    name: "Kayak",
    shortDesc: "Travel search engine for flights and hotels",
    entityType: { slug: "products" },
    comparisonsA: [
      { comparison: { category: "travel" } },
      { comparison: { category: "products" } },
    ],
    attributeValues: Array.from({ length: 71 }, (_, index) => ({
      attribute: { slug: `flight-metric-${index}` },
    })),
  };
  const iphone = {
    id: "ent-iphone-17",
    slug: "iphone-17",
    name: "iPhone 17",
    shortDesc: "Apple's 2025 flagship phone with an A19 chip",
    entityType: { slug: "products" },
    comparisonsA: [{ comparison: { category: "technology" } }],
    attributeValues: [{ attribute: { slug: "display" } }, { attribute: { slug: "price" } }],
  };

  const prisma = {
    entityType: {
      upsert: async ({ where }: { where: { slug: string } }) => ({ id: `type-${where.slug}` }),
    },
    entity: {
      findUnique: async ({ where }: { where: { slug: string } }) => stored.get(where.slug) ?? null,
      upsert: async ({
        where,
        create,
      }: {
        where: { slug: string };
        create: { name: string; shortDesc: string | null };
      }) => {
        entityUpserts.push(where.slug);
        const existing = stored.get(where.slug);
        if (existing) return { id: existing.id };
        const created = {
          id: `ent-${where.slug}`,
          slug: where.slug,
          name: create.name,
          shortDesc: create.shortDesc,
          entityType: { slug: "product" },
          comparisonsA: [],
          attributeValues: [],
        };
        stored.set(where.slug, created);
        return { id: created.id };
      },
    },
    comparison: {
      upsert: async () => ({ id: "cmp-canoe" }),
    },
    comparisonEntity: {
      deleteMany: async () => ({ count: 0 }),
      create: async () => ({ id: "ce" }),
    },
    fAQ: {
      deleteMany: async () => ({ count: 0 }),
      create: async () => ({ id: "faq" }),
    },
    attribute: {
      upsert: async ({ where }: { where: { slug_entityTypeId: { slug: string } } }) => ({
        id: `attr-${where.slug_entityTypeId.slug}`,
      }),
    },
    attributeValue: {
      upsert: async ({ where }: { where: { entityId_attributeId: { entityId: string } } }) => {
        valueEntityIds.push(where.entityId_attributeId.entityId);
        return { id: "av" };
      },
    },
    changeLog: {
      create: async () => ({ id: "log" }),
    },
  };

  function reset() {
    stored.clear();
    stored.set("kayak", travelKayak);
    stored.set("iphone-17", iphone);
    entityUpserts.length = 0;
    valueEntityIds.length = 0;
  }

  return { prisma, entityUpserts, valueEntityIds, reset };
});

vi.mock("@/lib/db/prisma", () => ({ getPrisma: () => prisma }));
vi.mock("@/lib/services/redis", () => ({ getRedis: () => null }));
vi.mock("@/lib/services/internal-linking-engine", () => ({
  getLinkedComparisons: vi.fn(),
  getRelatedBlogPosts: vi.fn(),
}));
vi.mock("@/lib/seo/indexnow", () => ({ submitComparisonToIndexNow: vi.fn() }));

import { saveComparison } from "../comparison-service";

function page(overrides: Partial<ComparisonPageData> = {}): ComparisonPageData {
  return {
    id: "gen-1",
    slug: "canoe-vs-kayak",
    title: "Canoe vs Kayak",
    shortAnswer: "Canoes carry more. Kayaks are faster.",
    keyDifferences: [],
    verdict: "Pick the boat that fits the trip.",
    category: "general",
    entities: [
      {
        id: "gen-canoe",
        slug: "canoe",
        name: "Canoe",
        shortDesc: "Open boat",
        imageUrl: null,
        entityType: "product",
        position: 0,
        pros: [],
        cons: [],
        bestFor: null,
      },
      {
        id: "gen-kayak",
        slug: "kayak",
        name: "Kayak",
        shortDesc: "Covered boat",
        imageUrl: null,
        entityType: "product",
        position: 1,
        pros: [],
        cons: [],
        bestFor: null,
      },
    ],
    attributes: [
      {
        id: "gen-length",
        slug: "length",
        name: "Length",
        unit: "ft",
        category: "Size",
        dataType: "number",
        higherIsBetter: null,
        values: [
          { entityId: "gen-canoe", valueText: "16 ft", valueNumber: 16, valueBoolean: null },
          { entityId: "gen-kayak", valueText: "12 ft", valueNumber: 12, valueBoolean: null },
        ],
      },
    ],
    faqs: [],
    relatedComparisons: [],
    relatedBlogPosts: [],
    metadata: {
      metaTitle: "Canoe vs Kayak",
      metaDescription: "Compare canoe and kayak.",
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isAutoGenerated: true,
      isHumanReviewed: false,
      viewCount: 0,
    },
    ...overrides,
  };
}

describe("saveComparison entity slug collision", () => {
  beforeEach(() => {
    reset();
  });

  it("saves the canoe-vs-kayak boat as kayak-boat and does not write metrics onto Kayak.com", async () => {
    const saved = await saveComparison(page(), { origin: "user" });
    expect(saved).not.toBeNull();
    expect(entityUpserts).toEqual(["canoe", "kayak-boat"]);
    expect(entityUpserts).not.toContain("kayak");
    expect(valueEntityIds).toEqual(["ent-canoe", "ent-kayak-boat"]);
    expect(valueEntityIds).not.toContain("ent-kayak-travel");
  });

  it("reuses the iphone-17 entity when the generated phone matches", async () => {
    const data = page({
      slug: "iphone-17-vs-pixel-10",
      title: "iPhone 17 vs Pixel 10",
      category: "technology",
      entities: [
        {
          id: "gen-iphone",
          slug: "iphone-17",
          name: "iPhone 17",
          shortDesc: "Apple flagship phone",
          imageUrl: null,
          entityType: "product",
          position: 0,
          pros: [],
          cons: [],
          bestFor: null,
        },
        {
          id: "gen-pixel",
          slug: "pixel-10",
          name: "Pixel 10",
          shortDesc: "Google flagship phone",
          imageUrl: null,
          entityType: "product",
          position: 1,
          pros: [],
          cons: [],
          bestFor: null,
        },
      ],
      attributes: [
        {
          id: "gen-display",
          slug: "display",
          name: "Display",
          unit: "in",
          category: "Hardware",
          dataType: "number",
          higherIsBetter: null,
          values: [
            { entityId: "gen-iphone", valueText: "6.3 in", valueNumber: 6.3, valueBoolean: null },
            { entityId: "gen-pixel", valueText: "6.2 in", valueNumber: 6.2, valueBoolean: null },
          ],
        },
      ],
    });
    await saveComparison(data, { origin: "user" });
    expect(entityUpserts).toContain("iphone-17");
    expect(entityUpserts).not.toContain("iphone-17-phone");
    expect(valueEntityIds).toContain("ent-iphone-17");
  });

  it("does not disambiguate a batch or content-refresh save", async () => {
    await saveComparison(page());
    expect(entityUpserts).toEqual(["canoe", "kayak"]);
    expect(valueEntityIds).toContain("ent-kayak-travel");
  });
});
