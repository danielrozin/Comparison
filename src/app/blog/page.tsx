import type { Metadata } from "next";
import Link from "next/link";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

const blogDescription = "Expert comparison guides, buyer's guides, and in-depth articles to help you make better decisions.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Blog — ${SITE_NAME}`)}&type=blog`;

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description: blogDescription,
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description: blogDescription,
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: SITE_NAME,
    images: [{ url: ogImage, width: 1200, height: 630, alt: `${SITE_NAME} Blog` }],
  },
  twitter: {
    card: "summary_large_image",
      site: "@aversusb",
    title: `Blog — ${SITE_NAME}`,
    description: blogDescription,
    images: [ogImage],
  },
  other: {
    "citation_title": `Blog — ${SITE_NAME}`,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": blogDescription,
    "DC.title": `Blog — ${SITE_NAME}`,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.identifier": `${SITE_URL}/blog`,
  },
};

const CATEGORIES = [
  "all",
  "technology",
  "sports",
  "entertainment",
  "lifestyle",
  "science",
  "business",
  "education",
  "health",
  "travel",
  "food",
  "automotive",
];

function estimateReadTime(content: string): number {
  const words = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function categoryColor(cat: string): string {
  const colors: Record<string, string> = {
    technology: "bg-blue-100 text-blue-700",
    sports: "bg-green-100 text-green-700",
    entertainment: "bg-purple-100 text-purple-700",
    lifestyle: "bg-pink-100 text-pink-700",
    science: "bg-cyan-100 text-cyan-700",
    business: "bg-amber-100 text-amber-700",
    education: "bg-indigo-100 text-indigo-700",
    health: "bg-red-100 text-red-700",
    travel: "bg-teal-100 text-teal-700",
    food: "bg-orange-100 text-orange-700",
    automotive: "bg-slate-100 text-slate-700",
  };
  return colors[cat] || "bg-surface-alt text-text-secondary";
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; page?: string }>;
}) {
  const params = await searchParams;
  const category =
    params.category && params.category !== "all"
      ? params.category
      : undefined;
  const page = Math.max(1, parseInt(params.page || "1", 10));
  const limit = 12;
  const offset = (page - 1) * limit;

  const { articles, total } = await listBlogArticles({
    category,
    limit,
    offset,
    status: "published",
  });

  const totalPages = Math.ceil(total / limit);
  const activeCategory = params.category || "all";

  // CollectionPage + ItemList schema for the blog index.
  // Gives AI crawlers (ChatGPT, Perplexity, Claude) a machine-readable article
  // index so they can cite individual posts in answers about comparison topics.
  const blogToday = new Date().toISOString().slice(0, 10);
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/blog#collectionpage`,
    name: `Blog — ${SITE_NAME}`,
    description: blogDescription,
    abstract: "In-depth articles covering comparison methodology, product reviews, data studies, and decision guides across technology, software, sports, and more.",
    url: `${SITE_URL}/blog`,
    inLanguage: "en-US",
    genre: "Blog Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: blogToday,
    contentReferenceTime: blogToday,
    thumbnailUrl: ogImage,
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/blog#primaryImage`,
      url: ogImage,
      contentUrl: ogImage,
      width: 1200,
      height: 630,
      caption: `${SITE_NAME} Blog — Comparison Articles & Decision Guides`,
    },
    keywords: "comparison articles, product analysis, decision guides, technology reviews, software comparisons blog",
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: `${SITE_URL}/blog` },
    alternativeHeadline: "Comparison Articles, Data Studies & Decision Guides — A Versus B Blog",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students" },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["structuralNavigation", "alternativeText", "readingOrder"],
    educationalLevel: "General",
    teaches: "How to compare anything side by side using expert-written guides",
    educationalUse: "guide",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".blog-hero-description"],
    },
    mainEntity: {
      "@type": "ItemList",
      name: "Latest Articles",
      description: "Recent comparison articles, data studies, and decision guides from A Versus B",
      numberOfItems: total,
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      itemListElement: articles.slice(0, 10).map((article, i) => ({
        "@type": "ListItem",
        position: offset + i + 1,
        url: `${SITE_URL}/blog/${article.slug}`,
        name: article.title,
        item: {
          "@type": "Article",
          "@id": `${SITE_URL}/blog/${article.slug}#article`,
          url: `${SITE_URL}/blog/${article.slug}`,
          name: article.title,
          isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
        },
      })),
    },
    timeRequired: "PT2M",
    wordCount: 400,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
    <main className="min-h-screen bg-surface">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-sm font-medium text-primary-100 mb-5">
            <span>✍️</span>
            <span>Expert Comparison Guides</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black tracking-tight mb-4">
            The Comparison Blog
          </h1>
          <p className="text-lg text-primary-200 max-w-2xl mx-auto">
            Expert guides, in-depth analyses, and data-driven insights to help
            you compare and choose the best options.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* Category Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="bg-white rounded-xl shadow-lg p-2 flex flex-wrap gap-1 justify-center">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={cat === "all" ? "/blog" : `/blog?category=${cat}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
                activeCategory === cat
                  ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm"
                  : "text-text-secondary hover:bg-surface-alt hover:text-text"
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {articles.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-text mb-2">
              No articles yet
            </h2>
            <p className="text-text-secondary">
              {category
                ? `No articles found in the "${category}" category.`
                : "Blog articles are coming soon. Check back later!"}
            </p>
            {category && (
              <Link
                href="/blog"
                className="inline-block mt-4 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg hover:shadow-md transition-all duration-150"
              >
                View all articles
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <Link
                  key={article.slug}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col"
                >
                  {/* Card header */}
                  <div className="h-28 bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
                    <span className="text-5xl relative z-10" aria-hidden="true">
                      {article.category === "technology" ? "💻" :
                       article.category === "sports" ? "⚽" :
                       article.category === "entertainment" ? "🎬" :
                       article.category === "health" ? "💊" :
                       article.category === "automotive" ? "🚗" :
                       article.category === "business" ? "📊" :
                       article.category === "science" ? "🔬" :
                       article.category === "education" ? "🎓" :
                       article.category === "travel" ? "✈️" :
                       article.category === "food" ? "🍽️" : "📝"}
                    </span>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Category & Read Time */}
                    <div className="flex items-center justify-between mb-3">
                      {article.category && (
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${categoryColor(
                            article.category
                          )}`}
                        >
                          {article.category}
                        </span>
                      )}
                      <span className="text-xs text-text-secondary">
                        {estimateReadTime(article.content)} min read
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-lg font-bold text-text group-hover:text-primary-600 transition-colors mb-2 line-clamp-2">
                      {article.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
                      <span>{formatDate(article.publishedAt)}</span>
                      <span className="text-primary-600 font-medium group-hover:underline">
                        Read more &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                {page > 1 && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ""}page=${page - 1}`}
                    className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                  >
                    Previous
                  </Link>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={`/blog?${category ? `category=${category}&` : ""}page=${p}`}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                        p === page
                          ? "bg-gradient-to-br from-primary-600 to-accent-600 text-white shadow-sm"
                          : "border border-border hover:border-primary-300"
                      }`}
                    >
                      {p}
                    </Link>
                  )
                )}
                {page < totalPages && (
                  <Link
                    href={`/blog?${category ? `category=${category}&` : ""}page=${page + 1}`}
                    className="px-4 py-2 rounded-lg border border-border hover:border-primary-300 text-sm font-medium transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </main>
    </>
  );
}
