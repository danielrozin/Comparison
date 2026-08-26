import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";

/**
 * Date-based HTML archive (NYT-style): Home → /archive → year → month →
 * article. Guarantees every dated piece of content sits at most 4 clicks from
 * the home page and that new content is grouped in automatically by its
 * publish date — no page is ever orphaned.
 *
 * One deliberate departure from the NYT model: days are headings inside the
 * month page, not their own URLs. At our publishing volume a URL per day
 * would mint hundreds of thin pages, which is crawl waste this domain cannot
 * afford; the month page carries the same day-level grouping without them.
 */

export interface ArchiveItem {
  slug: string;
  title: string;
  /** publish date, ISO */
  date: string;
  type: "comparison" | "blog";
}

export interface ArchiveMonth {
  year: number;
  /** 1-12 */
  month: number;
  count: number;
}

const dateOf = (publishedAt: Date | null, createdAt: Date): Date => publishedAt ?? createdAt;

/** Every published, dated item — the archive's single source of truth. */
export async function getArchiveItems(): Promise<ArchiveItem[]> {
  const prisma = getPrisma();
  if (!prisma) return [];

  const [comparisons, blogs] = await Promise.all([
    prisma.comparison.findMany({
      where: canonicalComparisonWhere(),
      select: { slug: true, title: true, publishedAt: true, createdAt: true },
    }),
    prisma.blogArticle.findMany({
      where: { status: "published" },
      select: { slug: true, title: true, publishedAt: true, createdAt: true },
    }),
  ]);

  const items: ArchiveItem[] = [
    ...comparisons.map((c) => ({
      slug: c.slug,
      title: c.title,
      date: dateOf(c.publishedAt, c.createdAt).toISOString(),
      type: "comparison" as const,
    })),
    ...blogs.map((b) => ({
      slug: b.slug,
      title: b.title,
      date: dateOf(b.publishedAt, b.createdAt).toISOString(),
      type: "blog" as const,
    })),
  ];
  // newest first site-wide; month pages re-sort per day
  return items.sort((a, b) => b.date.localeCompare(a.date));
}

/** Months that actually have content, newest first. */
export async function getArchiveMonths(): Promise<ArchiveMonth[]> {
  const items = await getArchiveItems();
  const counts = new Map<string, number>();
  for (const it of items) {
    const key = it.date.slice(0, 7); // YYYY-MM
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([key, count]) => ({
      year: Number(key.slice(0, 4)),
      month: Number(key.slice(5, 7)),
      count,
    }))
    .sort((a, b) => b.year - a.year || b.month - a.month);
}

/** Items for one month, grouped by day (newest day first). */
export async function getArchiveMonthItems(
  year: number,
  month: number
): Promise<Map<string, ArchiveItem[]>> {
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const items = (await getArchiveItems()).filter((it) => it.date.startsWith(prefix));
  const byDay = new Map<string, ArchiveItem[]>();
  for (const it of items) {
    const day = it.date.slice(0, 10); // YYYY-MM-DD
    if (!byDay.has(day)) byDay.set(day, []);
    byDay.get(day)!.push(it);
  }
  return byDay;
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

export function itemHref(item: ArchiveItem): string {
  return item.type === "comparison" ? `/compare/${item.slug}` : `/blog/${item.slug}`;
}
