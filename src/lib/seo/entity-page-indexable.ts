import { getPrisma } from "@/lib/db/prisma";

/**
 * Whether `/entity/[slug]` allows indexing.
 *
 * This is the robots predicate in `src/app/entity/[slug]/page.tsx`:
 * `published` is index,follow; every other status is noindex,nofollow.
 * Compare pages must use this same function before emitting an `/entity/*`
 * anchor or schema URL, so the two cannot drift.
 */
export function isEntityPageIndexable(status: string | null | undefined): boolean {
  return status === "published";
}

/**
 * Status string the entity page feeds into `isEntityPageIndexable`.
 *
 * - Lookup threw, or there is no database client: `"published"`. The entity
 *   page starts optimistic and only flips to noindex after a successful read.
 * - Row missing: `"draft"` (`entity?.status ?? "draft"` on the entity page).
 * - Otherwise the stored status, unchanged.
 */
export function entityPageRobotsStatus(args: {
  lookupFailed: boolean;
  status: string | null | undefined;
}): string {
  if (args.lookupFailed) return "published";
  return args.status ?? "draft";
}

/**
 * Resolve the robots status for each entity on a compare page.
 * Missing rows are draft (noindex). A failed or missing database matches the
 * entity page and stays optimistic (`published`).
 */
export async function resolveEntityPageStatuses(slugs: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(slugs.filter(Boolean))];
  const optimistic = () => {
    const map = new Map<string, string>();
    for (const slug of unique) {
      map.set(slug, entityPageRobotsStatus({ lookupFailed: true, status: null }));
    }
    return map;
  };

  const prisma = getPrisma();
  if (!prisma) return optimistic();

  try {
    const rows = await prisma.entity.findMany({
      where: { slug: { in: unique } },
      select: { slug: true, status: true },
    });
    const found = new Map(rows.map((row) => [row.slug, row.status]));
    const map = new Map<string, string>();
    for (const slug of unique) {
      map.set(
        slug,
        entityPageRobotsStatus({ lookupFailed: false, status: found.get(slug) ?? null }),
      );
    }
    return map;
  } catch {
    return optimistic();
  }
}
