import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { Prisma } from "@prisma/client";

const db = vi.hoisted(() => ({
  findEntity: vi.fn(),
  findRating: vi.fn(),
}));

vi.mock("@/lib/db/prisma", () => ({
  prisma: {
    entity: { findUnique: (...args: unknown[]) => db.findEntity(...args) },
    reviewAggregation: { findUnique: (...args: unknown[]) => db.findRating(...args) },
  },
}));

vi.mock("@/lib/services/comparison-service", () => ({
  getComparisonsForEntity: vi.fn(async () => [
    { slug: "nike-vs-adidas", title: "Nike vs Adidas", category: "fashion" },
  ]),
}));

import { GET } from "../route";

const updatedAt = new Date("2026-06-01T00:00:00.000Z");

const nike = {
  id: "ent_nike",
  slug: "nike",
  name: "Nike",
  shortDesc: "Sportswear brand",
  description: "Nike designs shoes and apparel.",
  imageUrl: null,
  thumbnailUrl: null,
  metaTitle: null,
  metaDescription: null,
  entityType: { name: "Brand" },
  faqs: [{ question: "Who owns Nike?", answer: "Nike, Inc." }],
  metadata: {},
  updatedAt,
};

function call(slug: string, headers?: Record<string, string>) {
  return GET(new NextRequest(`http://localhost/api/v1/entities/${slug}`, { headers }), {
    params: Promise.resolve({ slug }),
  });
}

function missingReviewAggregationsTable() {
  return new Prisma.PrismaClientKnownRequestError(
    "Invalid `prisma.reviewAggregation.findUnique()` invocation:\nThe table `public.review_aggregations` does not exist in the current database.",
    { code: "P2021", clientVersion: "5.22.0" },
  );
}

describe("GET /api/v1/entities/[slug]", () => {
  beforeEach(() => {
    db.findEntity.mockReset();
    db.findRating.mockReset();
    db.findEntity.mockResolvedValue(nike);
    db.findRating.mockRejectedValue(missingReviewAggregationsTable());
  });

  it("returns the entity profile with a null rating when review_aggregations is missing", async () => {
    const res = await call("nike");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toMatchObject({
      slug: "nike",
      name: "Nike",
      type: "Brand",
      description: "Nike designs shoes and apparel.",
      faqs: [{ question: "Who owns Nike?", answer: "Nike, Inc." }],
      rating: null,
      comparisonCount: 1,
      comparisons: [
        {
          slug: "nike-vs-adidas",
          title: "Nike vs Adidas",
          url: "https://www.aversusb.net/compare/nike-vs-adidas",
          category: "fashion",
        },
      ],
    });

    const entityQuery = db.findEntity.mock.calls[0][0];
    expect(entityQuery.select).not.toHaveProperty("reviewAggregation");
    expect(db.findRating).toHaveBeenCalledWith({
      where: { entityId: "ent_nike" },
      select: {
        averageRating: true,
        totalReviews: true,
        smartScore: true,
        positivePct: true,
        negativePct: true,
      },
    });
  });

  it("returns 404 for an unknown slug without reading review_aggregations", async () => {
    db.findEntity.mockResolvedValue(null);

    const res = await call("nike-air-max");

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Not found" });
    expect(db.findRating).not.toHaveBeenCalled();
  });

  it("includes the stored rating when the aggregation row exists", async () => {
    db.findRating.mockResolvedValue({
      averageRating: 4.4,
      totalReviews: 120,
      smartScore: 81,
      positivePct: 76,
      negativePct: 9,
    });

    const res = await call("nike");
    expect(res.status).toBe(200);
    expect((await res.json()).rating).toEqual({
      averageRating: 4.4,
      totalReviews: 120,
      smartScore: 81,
      positivePct: 76,
      negativePct: 9,
    });
  });

  it("still returns JSON-LD when the aggregation table is missing", async () => {
    const res = await call("nike", { accept: "application/ld+json" });
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/ld+json");
    const body = await res.json();
    expect(body["@context"]).toBe("https://schema.org");
    expect(body["@graph"].some((node: { "@type"?: string }) => node["@type"] === "FAQPage")).toBe(true);
  });

  it("does not read ratings on a matching conditional request", async () => {
    const etag = `"entity-nike-${updatedAt.getTime()}"`;
    const res = await call("nike", { "if-none-match": etag });
    expect(res.status).toBe(304);
    expect(db.findRating).not.toHaveBeenCalled();
  });

  it("still fails when a different table is missing", async () => {
    db.findRating.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "The table `public.something_else` does not exist in the current database.",
        { code: "P2021", clientVersion: "5.22.0", meta: { table: "public.something_else" } },
      ),
    );

    await expect(call("nike")).rejects.toMatchObject({ code: "P2021" });
  });
});
