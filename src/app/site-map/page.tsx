import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, CATEGORIES, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { getRecentSitemapContent } from "@/lib/services/sitemap-service";

const SITEMAP_TITLE = `Site Map — ${SITE_NAME}`;
const SITEMAP_DESC = `Browse all content on ${SITE_NAME} — comparisons, blog articles, reviews, and categories organized by date and topic.`;
const SITEMAP_URL = `${SITE_URL}/site-map`;

export const metadata: Metadata = {
  title: SITEMAP_TITLE,
  description: SITEMAP_DESC,
  alternates: {
    canonical: SITEMAP_URL,
    languages: { "en": SITEMAP_URL, "x-default": SITEMAP_URL },
  },
  openGraph: {
    title: SITEMAP_TITLE,
    description: SITEMAP_DESC,
    url: SITEMAP_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary",
    site: "@aversusb",
    title: SITEMAP_TITLE,
    description: SITEMAP_DESC,
  },
  other: {
    "citation_title": SITEMAP_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": SITEMAP_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": SITEMAP_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": SITEMAP_URL,
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

const siteMapPageSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITEMAP_URL}#webpage`,
      name: SITEMAP_TITLE,
      description: SITEMAP_DESC,
      url: SITEMAP_URL,

      locale: "en_US",      inLanguage: "en-US",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      accessMode: ["textual"],
      accessibilityFeature: ["readingOrder", "structuralNavigation"],
      accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      about: { "@type": "WebSite", name: SITE_NAME, url: SITE_URL },
      potentialAction: { "@type": "ReadAction", target: SITEMAP_URL },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: { "@type": "WebPage", "@id": SITE_URL, name: "Home", url: SITE_URL } },
        { "@type": "ListItem", position: 2, name: "Site Map", item: { "@type": "WebPage", "@id": SITEMAP_URL, name: "Site Map", url: SITEMAP_URL } },
      ],
    },
  ],
};

export default async function SiteMapPage() {
  const { today, yesterday, thisWeek, lastWeek } =
    await getRecentSitemapContent();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(siteMapPageSchema) }}
      />
      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" aria-hidden="true" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Site Map</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-2">
            Site Map
          </h1>
          <p className="text-primary-100 text-sm sm:text-base max-w-xl">
            Browse all recently published content on {SITE_NAME}, organized by date. For the full XML sitemap, see{" "}
            <a href="/sitemap.xml" className="text-primary-200 hover:text-white underline">sitemap.xml</a>.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

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
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Browse by Category</h2>
        </div>
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 list-none">
          {CATEGORIES.map((cat) => {
            const subs = CATEGORY_SUBCATEGORIES[cat.slug] || [];
            return (
              <li key={cat.slug}>
                <h3 className="font-semibold text-text mb-2">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-primary-600 transition-colors"
                  >
                    {cat.name}
                  </Link>
                </h3>
                <ul role="list" className="space-y-1 list-none">
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
              </li>
            );
          })}
        </ul>
      </section>

      {/* Quick links */}
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-border">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <h2 className="text-2xl font-display font-bold text-text">Pages</h2>
        </div>
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
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
            <li key={page.href}>
              <Link
                href={page.href}
                className="text-text-secondary hover:text-primary-600 transition-colors"
              >
                {page.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
    </>
  );
}
