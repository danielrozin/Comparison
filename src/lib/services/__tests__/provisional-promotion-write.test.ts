import { beforeEach, describe, expect, it, vi } from "vitest";

const updateMany = vi.hoisted(() => vi.fn());
const indexNow = vi.hoisted(() => vi.fn());

vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    comparison: { updateMany },
  }),
}));
vi.mock("@/lib/services/redis", () => ({ getRedis: () => null }));
vi.mock("@/lib/seo/indexnow", () => ({
  notifyIndexNow: (...args: unknown[]) => {
    indexNow(...args);
  },
}));
vi.mock("@/lib/services/internal-linking-engine", () => ({
  getLinkedComparisons: vi.fn(),
  getRelatedBlogPosts: vi.fn(),
}));

import { applyProvisionalPromotion } from "../comparison-service";

describe("applyProvisionalPromotion", () => {
  beforeEach(() => {
    updateMany.mockReset();
    indexNow.mockReset();
  });

  it("updates only a row that is still provisional", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    const saved = await applyProvisionalPromotion({
      slug: "canoe-vs-kayak",
      status: "published",
      contentScore: 70,
      content: { promotion: { attempts: 1, lastAttemptAt: null, lastReasons: [] } },
    });
    expect(saved).toBe(true);
    expect(updateMany).toHaveBeenCalledWith({
      where: { slug: "canoe-vs-kayak", status: "provisional" },
      data: expect.objectContaining({ status: "published", contentScore: 70 }),
    });
    expect(indexNow).toHaveBeenCalledWith("/compare/canoe-vs-kayak", "promote-provisional");
  });

  it("does not queue IndexNow when the recheck leaves the page provisional (noindex)", async () => {
    updateMany.mockResolvedValue({ count: 1 });
    await applyProvisionalPromotion({
      slug: "canoe-vs-kayak",
      status: "provisional",
      contentScore: 40,
      content: {},
    });
    expect(indexNow).not.toHaveBeenCalled();
  });

  it("does not revive a row that left provisional before the write", async () => {
    updateMany.mockResolvedValue({ count: 0 });
    const saved = await applyProvisionalPromotion({
      slug: "canoe-vs-kayak",
      status: "published",
      contentScore: 70,
      content: {},
    });
    expect(saved).toBe(false);
    expect(indexNow).not.toHaveBeenCalled();
  });
});
