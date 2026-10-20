import { REDIRECTED_COMPARE_SLUGS } from "@/lib/redirects/compare-redirects";

/**
 * Prisma `where` for `/entity/{slug}` URLs we may list in any sitemap.
 *
 * Same rule as sitemap shard 2 (DAN-2551): the entity is `published`
 * (the only status `/entity/[slug]` answers 200 + index for, see
 * `isEntityPageIndexable` / `shouldEntityPage404`, ROO-271 D) AND it has at
 * least one canonical comparison (published, not a redirect source), so the
 * page has content. Shared by `src/app/sitemap.ts` shard 2 and
 * `/sitemap/images.xml` so the two cannot drift again (ROO-271 QA P2: the
 * image sitemap listed ~790 unpublished or unknown entities that 404).
 */
export function sitemapEntityWhere() {
  return {
    status: "published",
    comparisonsA: {
      some: {
        comparison: {
          status: "published",
          slug: { notIn: REDIRECTED_COMPARE_SLUGS },
        },
      },
    },
  };
}
