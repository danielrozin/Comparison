/**
 * Sitemap service — fetches recent content grouped by time period
 * for the NYT-style HTML sitemap page.
 */

interface SitemapContentItem {
  slug: string;
  title: string;
  type: "comparison" | "blog" | "entity";
  category?: string;
  publishedAt: string;
}

interface RecentSitemapContent {
  today: SitemapContentItem[];
  yesterday: SitemapContentItem[];
  thisWeek: SitemapContentItem[];
  lastWeek: SitemapContentItem[];
}

function getPrismaClient() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getPrisma } = require("@/lib/db/prisma");
    return getPrisma();
  } catch {
    return null;
  }
}

function getTimeBoundaries() {
  const now = new Date();

  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const yesterdayStart = new Date(todayStart);
  yesterdayStart.setDate(yesterdayStart.getDate() - 1);

  // Start of this week (Monday)
  const thisWeekStart = new Date(todayStart);
  const dayOfWeek = thisWeekStart.getDay();
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  thisWeekStart.setDate(thisWeekStart.getDate() - daysToMonday);

  // Start of last week
  const lastWeekStart = new Date(thisWeekStart);
  lastWeekStart.setDate(lastWeekStart.getDate() - 7);

  return { now, todayStart, yesterdayStart, thisWeekStart, lastWeekStart };
}

function bucketItem(
  item: SitemapContentItem,
  buckets: RecentSitemapContent,
  boundaries: ReturnType<typeof getTimeBoundaries>
) {
  const date = new Date(item.publishedAt);
  const { todayStart, yesterdayStart, thisWeekStart, lastWeekStart } = boundaries;

  if (date >= todayStart) {
    buckets.today.push(item);
  } else if (date >= yesterdayStart) {
    buckets.yesterday.push(item);
  } else if (date >= thisWeekStart) {
    buckets.thisWeek.push(item);
  } else if (date >= lastWeekStart) {
    buckets.lastWeek.push(item);
  }
}

export async function getRecentSitemapContent(): Promise<RecentSitemapContent> {
  const boundaries = getTimeBoundaries();
  const buckets: RecentSitemapContent = {
    today: [],
    yesterday: [],
    thisWeek: [],
    lastWeek: [],
  };

  const prisma = getPrismaClient();
  if (!prisma) return buckets;

  try {
    // Fetch comparisons published in the last 2 weeks
    const comparisons = await prisma.comparison.findMany({
      where: {
        status: "published",
        publishedAt: { gte: boundaries.lastWeekStart },
      },
      select: {
        slug: true,
        title: true,
        category: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    for (const comp of comparisons) {
      if (!comp.publishedAt) continue;
      bucketItem(
        {
          slug: comp.slug,
          title: comp.title,
          type: "comparison",
          category: comp.category || undefined,
          publishedAt: new Date(comp.publishedAt).toISOString(),
        },
        buckets,
        boundaries
      );
    }

    // Fetch blog articles published in the last 2 weeks
    const articles = await prisma.blogArticle.findMany({
      where: {
        status: "published",
        publishedAt: { gte: boundaries.lastWeekStart },
      },
      select: {
        slug: true,
        title: true,
        category: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    for (const article of articles) {
      if (!article.publishedAt) continue;
      bucketItem(
        {
          slug: article.slug,
          title: article.title,
          type: "blog",
          category: article.category || undefined,
          publishedAt: new Date(article.publishedAt).toISOString(),
        },
        buckets,
        boundaries
      );
    }

    // Fetch entities published in the last 2 weeks
    const entities = await prisma.entity.findMany({
      where: {
        status: "published",
        publishedAt: { gte: boundaries.lastWeekStart },
      },
      select: {
        slug: true,
        name: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    for (const entity of entities) {
      if (!entity.publishedAt) continue;
      bucketItem(
        {
          slug: entity.slug,
          title: entity.name,
          type: "entity",
          publishedAt: new Date(entity.publishedAt).toISOString(),
        },
        buckets,
        boundaries
      );
    }
  } catch (e) {
    console.warn("sitemap-service: failed to fetch recent content:", e);
  }

  return buckets;
}
