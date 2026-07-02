import type { Metadata } from "next";
import Link from "next/link";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

const blogDescription = "Expert comparison guides, buyer's guides, and in-depth articles to help you make better decisions.";
const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Blog — ${SITE_NAME}`)}&type=blog`;

export const metadata: Metadata = {
  title: `Blog — ${SITE_NAME}`,
  description: blogDescription,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
    languages: { "en": `${SITE_URL}/blog`, "x-default": `${SITE_URL}/blog` },
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
      "application/atom+xml": `${SITE_URL}/feed/atom`,
    },
  },
  openGraph: {
    title: `Blog — ${SITE_NAME}`,
    description: blogDescription,
    url: `${SITE_URL}/blog`,
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
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
    "abstract": blogDescription,
    "citation_publication_date": "2024-01-01",
    "citation_online_date": "2024-01-01",
    "DC.title": `Blog — ${SITE_NAME}`,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.description": blogDescription,
    "DC.subject": "Comparison Guides, Buyer's Guides, Technology Articles, Product Analysis",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.type": "Text",
    "DC.format": "text/html",
    "DC.date": "2024-01-01",
    "DC.identifier": `${SITE_URL}/blog`,
    "news_keywords": "comparison, versus, technology, sports, products, countries, A Versus B",
    "thumbnail": ogImage,
    "twitter:label1": "Content Type",
    "twitter:data1": "Articles & Guides",
    "twitter:label2": "Platform",
    "twitter:data2": "A Versus B",
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

const CATEGORY_GRADIENTS: Record<string, string> = {
  technology: "from-blue-600 to-cyan-600",
  sports: "from-green-600 to-emerald-600",
  entertainment: "from-purple-600 to-violet-600",
  lifestyle: "from-pink-500 to-rose-600",
  science: "from-teal-600 to-cyan-700",
  business: "from-amber-600 to-orange-600",
  education: "from-indigo-600 to-blue-700",
  health: "from-red-500 to-rose-600",
  travel: "from-sky-500 to-blue-600",
  food: "from-orange-500 to-amber-600",
  automotive: "from-slate-600 to-gray-700",
};

function getBlogCardGradient(cat: string | null | undefined): string {
  return CATEGORY_GRADIENTS[cat?.toLowerCase() ?? ""] ?? "from-primary-600 to-indigo-700";
}

function BlogCardIcon({ category }: { category: string | null | undefined }) {
  const cls = "w-7 h-7 text-white";
  switch (category?.toLowerCase()) {
    case "technology":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "sports":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    case "entertainment":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      );
    case "lifestyle":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "science":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "business":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "education":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5" />
        </svg>
      );
    case "health":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "travel":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "food":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "automotive":
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
  }
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
    potentialAction: [
      { "@type": "ReadAction", target: `${SITE_URL}/blog` },
      { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
      // SubscribeAction — signals to AI answer engines (ChatGPT, Perplexity, Google AI Overview)
      // that this blog has a newsletter/subscription CTA, increasing citation selection for
      // queries that trigger "follow for updates" intent patterns.
      { "@type": "SubscribeAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/contact` }, object: { "@type": "Blog", name: "A Versus B Blog", url: `${SITE_URL}/blog` } },
    ],
    alternativeHeadline: "Comparison Articles, Data Studies & Decision Guides — A Versus B Blog",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
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
    // mentions[] — top-10 Article nodes so AI can enumerate featured posts without HTML parsing.
    mentions: articles.slice(0, 10).map((article) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/blog/${article.slug}#article`,
      name: article.title,
      url: `${SITE_URL}/blog/${article.slug}`,
    })),
    // about[] — subject classification for AI topic routing and Google Discover.
    about: [
      { "@type": "Thing", name: "Comparison Guides" },
      { "@type": "Thing", name: "Product Reviews" },
      { "@type": "Thing", name: "Decision Making" },
    ],
    // hasPart[] — ItemList is a formal structural part of this CollectionPage.
    hasPart: [{ "@type": "ItemList", name: "Latest Articles", url: `${SITE_URL}/blog` }],
    locationCreated: { "@type": "Country", name: "United States" },
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
          <nav className="mb-6 flex justify-start" aria-label="Breadcrumb">
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">Blog</li>
            </ol>
          </nav>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm ring-1 ring-white/20 text-sm font-medium text-primary-100 mb-5">
            <svg className="w-4 h-4 text-primary-200 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
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
            <div className="w-16 h-16 bg-surface-alt rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
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
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 list-none">
              {articles.map((article) => (
                <li key={article.slug} className="flex">
                <Link
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col w-full"
                >
                  {/* Card header */}
                  <div className={`h-28 bg-gradient-to-br ${getBlogCardGradient(article.category)} flex items-center justify-center relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" />
                    <div className="relative z-10 w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center ring-1 ring-white/20 shadow-lg group-hover:scale-105 transition-transform duration-200">
                      <BlogCardIcon category={article.category} />
                    </div>
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
                </li>
              ))}
            </ul>

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
