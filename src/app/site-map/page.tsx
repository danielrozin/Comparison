import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getRecentSitemapContent } from "@/lib/services/sitemap-service";

export const metadata: Metadata = {
  title: "Site Map",
  description: `Browse all content on ${SITE_NAME} — comparisons, blog articles, reviews, and categories organized by date and topic.`,
  alternates: { canonical: `${SITE_URL}/site-map` },
  openGraph: {
    title: `Site Map — ${SITE_NAME}`,
    description: `Browse all content on ${SITE_NAME} organized by date and topic.`,
    url: `${SITE_URL}/site-map`,
  },
};

export const revalidate = 3600; // revalidate every hour

interface ContentItem {
  slug: string;
  title: string;
  type: "comparison" | "blog" | "entity";
  category?: string;
  publishedAt: string;
}

function ContentSection({
  title,
  items,
}: {
  title: string;
  items: ContentItem[];
}) {
  if (items.length === 0) return null;

  // Group by type
  const comparisons = items.filter((i) => i.type === "comparison");
  const blogs = items.filter((i) => i.type === "blog");
  const entities = items.filter((i) => i.type === "entity");

  return (
    <section className="mb-10">
      <h2 className="text-2xl font-display font-bold text-text mb-4 pb-2 border-b border-border">
        {title}
      </h2>

      {comparisons.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text mb-3">Comparisons</h3>
          <ul className="space-y-1.5">
            {comparisons.map((item) => (
              <li key={item.slug} className="border-b border-border/50 pb-1.5">
                <Link
                  href={`/compare/${item.slug}`}
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {blogs.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text mb-3">Articles</h3>
          <ul className="space-y-1.5">
            {blogs.map((item) => (
              <li key={item.slug} className="border-b border-border/50 pb-1.5">
                <Link
                  href={`/blog/${item.slug}`}
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {entities.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-text mb-3">Entities</h3>
          <ul className="space-y-1.5">
            {entities.map((item) => (
              <li key={item.slug} className="border-b border-border/50 pb-1.5">
                <Link
                  href={`/entity/${item.slug}`}
                  className="text-text-secondary hover:text-primary-600 transition-colors"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default async function SiteMapPage() {
  const { today, yesterday, thisWeek, lastWeek } =
    await getRecentSitemapContent();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li>
            <Link
              href="/"
              className="hover:text-primary-600 transition-colors"
            >
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-text font-medium">Site Map</li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl sm:text-5xl font-display font-black text-text mb-4">
          Site Map
        </h1>
        <p className="text-lg text-text-secondary leading-relaxed">
          Browse all recently published content on {SITE_NAME}, organized by
          date. For the full XML sitemap, see{" "}
          <a
            href="/sitemap.xml"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            sitemap.xml
          </a>
          .
        </p>
      </div>

      {/* Time-based content sections (NYT-style) */}
      <ContentSection title="Today" items={today} />
      <ContentSection title="Yesterday" items={yesterday} />
      <ContentSection title="This Week" items={thisWeek} />
      <ContentSection title="Last Week" items={lastWeek} />

      {today.length === 0 &&
        yesterday.length === 0 &&
        thisWeek.length === 0 &&
        lastWeek.length === 0 && (
          <p className="text-text-secondary italic mb-10">
            No recently published content. Browse by category below.
          </p>
        )}

      {/* All Categories (permanent browse section) */}
      <section className="mb-10">
        <h2 className="text-2xl font-display font-bold text-text mb-4 pb-2 border-b border-border">
          Browse by Category
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => {
            const subs = CATEGORY_SUBCATEGORIES[cat.slug] || [];
            return (
              <div key={cat.slug}>
                <h3 className="font-semibold text-text mb-2">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </h3>
                <ul className="space-y-1">
                  {subs.map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="text-sm text-text-secondary hover:text-primary-600 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* Quick links */}
      <section className="mb-10">
        <h2 className="text-2xl font-display font-bold text-text mb-4 pb-2 border-b border-border">
          Pages
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { href: "/", label: "Home" },
            { href: "/trending", label: "Trending Comparisons" },
            { href: "/blog", label: "Blog" },
            { href: "/reviews", label: "Reviews" },
            { href: "/search", label: "Search" },
            { href: "/requests", label: "Comparison Requests" },
            { href: "/developers", label: "Developers" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/partnerships", label: "Partnerships" },
            { href: "/changelog", label: "Changelog" },
            { href: "/feed", label: "RSS Feed" },
          ].map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="text-text-secondary hover:text-primary-600 transition-colors"
            >
              {page.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
