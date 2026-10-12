import { beforeEach, describe, expect, it, vi } from "vitest";

const getPublishedComparisonBySlug = vi.fn();

vi.mock("@/lib/services/comparison-service", () => ({
  getPublishedComparisonBySlug: (slug: string) => getPublishedComparisonBySlug(slug),
}));

import { GET as answerGet, HEAD as answerHead } from "@/app/api/answer/[slug]/route";
import { GET as faqGet } from "@/app/api/faq/[slug]/route";
import { GET as kgGet } from "@/app/api/knowledge-graph/[slug]/route";

const comparison = (status: string) => ({
  slug: "alpha-vs-beta",
  title: "Alpha vs Beta",
  shortAnswer: "Alpha is ahead.",
  verdict: "Pick alpha.",
  category: "general",
  faqs: [{ question: "Which?", answer: "Alpha." }],
  keyDifferences: [],
  attributes: [],
  relatedComparisons: [],
  entities: [
    { id: "a", name: "Alpha", slug: "alpha", pros: [], cons: [] },
    { id: "b", name: "Beta", slug: "beta", pros: [], cons: [] },
  ],
  metadata: { status, metaTitle: "Alpha vs Beta", metaDescription: "Compared." },
});

const params = { params: Promise.resolve({ slug: "alpha-vs-beta" }) };

beforeEach(() => {
  getPublishedComparisonBySlug.mockReset();
});

describe("provisional read APIs send noindex", () => {
  it.each([
    ["answer", answerGet],
    ["faq", faqGet],
    ["knowledge-graph", kgGet],
  ] as const)("%s GET noindex when provisional and all when published", async (_name, handler) => {
    getPublishedComparisonBySlug.mockResolvedValue(comparison("provisional"));
    const provisional = await handler(
      new Request("https://aversusb.net/api/test/alpha-vs-beta") as never,
      params,
    );
    expect(provisional.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");

    getPublishedComparisonBySlug.mockResolvedValue(comparison("published"));
    const published = await handler(
      new Request("https://aversusb.net/api/test/alpha-vs-beta") as never,
      params,
    );
    expect(published.headers.get("X-Robots-Tag")).toBe("all");
  });

  it("answer GET does not return claimReviewSchema", async () => {
    getPublishedComparisonBySlug.mockResolvedValue(comparison("published"));
    const response = await answerGet(
      new Request("https://aversusb.net/api/answer/alpha-vs-beta") as never,
      params,
    );
    const body = await response.json();
    expect(body.claimReviewSchema).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain("ClaimReview");
    expect(body.answer).toBe("Alpha is ahead.");
    expect(body.winner).toBeNull();
    expect(body.confidence).toBeTruthy();
  });

  it("answer HEAD noindex for a provisional page", async () => {
    getPublishedComparisonBySlug.mockResolvedValue(comparison("provisional"));
    const response = await answerHead(
      new Request("https://aversusb.net/api/answer/alpha-vs-beta") as never,
      params,
    );
    expect(response.headers.get("X-Robots-Tag")).toBe("noindex, nofollow");
  });
});
