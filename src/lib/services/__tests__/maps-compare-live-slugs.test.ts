/**
 * ROO-127 — Google Maps editorial compares stay linkable from blog CTAs.
 * An archived DB row must not hide them, and they are not redirect sources.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const findMany = vi.fn();

vi.mock("@/lib/db/prisma", () => ({
  getPrismaClient: () => ({
    comparison: { findMany },
  }),
}));

import { isRedirectedCompareSlug } from "@/lib/redirects/compare-redirects";
import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";

const MAPS_SLUGS = ["google-maps-vs-waze", "google-maps-vs-apple-maps"] as const;

describe("ROO-127 maps compare live slugs", () => {
  beforeEach(() => {
    findMany.mockImplementation(
      async ({ where }: { where?: { status?: string | { not?: string } } }) => {
        const status = where?.status;
        if (status && typeof status === "object" && status.not === "published") {
          return MAPS_SLUGS.map((slug) => ({ slug }));
        }
        if (status === "published") {
          return [{ slug: "android-vs-ios" }];
        }
        return [];
      },
    );
  });

  it("treats both Maps slugs as canonical, not redirect sources", () => {
    for (const slug of MAPS_SLUGS) {
      expect(isRedirectedCompareSlug(slug)).toBe(false);
    }
  });

  it("keeps both editorial slugs when the DB row is not published", async () => {
    const live = await filterLiveCompareSlugs([
      "google-maps-vs-waze",
      "google-maps-vs-apple-maps",
      "android-vs-ios",
    ]);
    expect(live).toEqual([
      "google-maps-vs-waze",
      "google-maps-vs-apple-maps",
      "android-vs-ios",
    ]);
  });
});
