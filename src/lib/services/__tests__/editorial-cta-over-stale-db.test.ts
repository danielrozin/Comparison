/**
 * Blog compare CTAs go through filterLiveCompareSlugs. An unpublished or
 * stale database row used to put the slug in the unlinkable set, which hid
 * the CTA even when the editorial compare page is the page that renders.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  findMany: vi.fn(),
}));

vi.mock("@/lib/services/redis", () => ({ getRedis: () => null }));
vi.mock("@/lib/services/internal-linking-engine", () => ({
  getLinkedComparisons: vi.fn().mockResolvedValue([]),
  getRelatedBlogPosts: vi.fn().mockResolvedValue([]),
}));
vi.mock("@/lib/seo/indexnow", () => ({
  submitComparisonToIndexNow: vi.fn(() => Promise.resolve({ submitted: 0, ok: true })),
}));
vi.mock("@/lib/db/prisma", () => ({
  getPrisma: () => ({
    comparison: {
      findMany: mocks.findMany,
    },
  }),
}));

import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";

describe("editorial compare CTA over a stale database row", () => {
  beforeEach(() => {
    mocks.findMany.mockReset();
    mocks.findMany.mockImplementation(async (args: { where?: { status?: { not?: string } } }) => {
      if (args.where?.status?.not === "published") {
        return [{ slug: "lakers-vs-celtics" }, { slug: "draft-only-slug" }];
      }
      return [];
    });
  });

  it("keeps the CTA when the database row is unpublished and the editorial page exists", async () => {
    const live = await filterLiveCompareSlugs([
      "lakers-vs-celtics",
      "draft-only-slug",
      "celtics-vs-lakers",
    ]);

    expect(live).toEqual(["lakers-vs-celtics"]);
    expect(mocks.findMany).toHaveBeenCalled();
  });
});
