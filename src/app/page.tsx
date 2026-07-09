export const revalidate = 300; // ISR: revalidate home page every 5 minutes

import type { Metadata } from "next";
import Link from "next/link";
import { CATEGORIES, SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getTrendingComparisons, getLatestComparisons, getTotalComparisonsCount } from "@/lib/services/comparison-service";
import { listBlogArticles } from "@/lib/services/blog-generator";
import { webApplicationSchema, organizationSchema, dataCatalogSchema, webSiteSchema, faqSchema } from "@/lib/seo/schema";
import { SearchBox } from "@/components/home/SearchBox";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { FeaturedComparisons } from "@/components/home/FeaturedComparisons";
import { FEATURED_COMPARISONS } from "@/lib/data/featured-comparisons";
import { TrendingCard } from "@/components/home/TrendingCard";
import { CategoryCard } from "@/components/home/CategoryCard";
import { RecentSearches } from "@/components/home/RecentSearches";
import { RecentlyViewed } from "@/components/home/RecentlyViewed";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { AnimatedStats } from "@/components/home/AnimatedStats";

const HOME_TITLE = `${SITE_NAME} — Compare Anything`;
const HOME_DESC = "The internet's most comprehensive comparison platform. Side-by-side comparisons across sports, technology, products, countries, software, and more — data-driven, free, and instant.";

export const metadata: Metadata = {
  other: {
    "citation_title": HOME_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": HOME_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": HOME_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.description": HOME_DESC,
    "DC.subject": "Product Comparison, Sports Statistics, Technology Reviews, Country Data, Software Analysis",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": SITE_URL,
    "abstract": HOME_DESC,
    "thumbnail": `${SITE_URL}/api/og?title=${encodeURIComponent("Compare Anything")}&type=home`,
    "twitter:label1": "Content Type",
    "twitter:data1": "Comparison Platform",
    "twitter:label2": "Coverage",
    "twitter:data2": "17+ Categories",
  },
};

export default async function HomePage() {
  const [trending, latest, totalCount, blogResult] = await Promise.all([
    getTrendingComparisons(10),
    getLatestComparisons(8),
    getTotalComparisonsCount(),
    listBlogArticles({ limit: 3, status: "published" }),
  ]);
  const blogArticles = blogResult.articles;

  const homeOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent("Compare Anything")}&type=home`;
  const homeToday = new Date().toISOString().slice(0, 10);
  // CollectionPage schema — tells AI crawlers this is the root collection of all comparisons.
  // `about` enumerates every category so entity-disambiguation can map queries to sections.
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/#homepage`,
    name: `${SITE_NAME} — Compare Anything`,
    description: `The internet's most comprehensive comparison platform with ${totalCount.toLocaleString()}+ side-by-side comparisons across sports, technology, products, software, automotive, health, finance, countries, and more.`,
    abstract: "Data-driven side-by-side comparisons across 17+ categories with structured attributes, verdicts, community votes, and expert-reviewed analysis.",
    url: SITE_URL,
    inLanguage: "en-US",
    genre: "Comparison Platform",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    dateCreated: "2024-01-01",
    datePublished: "2024-01-01",
    dateModified: homeToday,
    lastReviewed: homeToday,
    contentReferenceTime: homeToday,
    thumbnailUrl: homeOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${SITE_URL}/#homeImage`,
      url: homeOgImage,
      contentUrl: homeOgImage,
      width: 1200,
      height: 630,
      caption: "A Versus B — Compare Anything Side-by-Side",
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: { "@type": "ReadAction", target: SITE_URL },
    about: CATEGORIES.map((c) => ({
      "@type": "Thing",
      name: c.name,
      url: `${SITE_URL}/category/${c.slug}`,
    })),
    significantLink: [
      `${SITE_URL}/trending`,
      `${SITE_URL}/blog`,
      `${SITE_URL}/entity`,
      `${SITE_URL}/developers`,
    ],
    hasPart: trending.slice(0, 5).map((t) => ({
      "@type": "Article",
      name: t.title,
      url: `${SITE_URL}/compare/${t.slug}`,
    })),
    // speakable — marks the hero headline and description for voice assistants and AEO.
    // Google Assistant and AI answer engines read these CSS selectors to extract the
    // page's primary answer when responding to conversational queries.
    alternativeHeadline: "Side-by-Side Comparisons for Sports, Tech, Products, Countries & More",
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers, Students", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "readingOrder", "structuralNavigation", "alternativeText"],
    educationalLevel: "General",
    teaches: "How to compare any two things side-by-side using structured data, expert-reviewed verdicts, and visual attribute tables",
    educationalUse: "reference",
    keywords: "compare anything, side-by-side comparison, product comparison, technology comparison, country comparison, sports comparison",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-description"],
    },
    timeRequired: "PT2M",
    wordCount: 400,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(dataCatalogSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema([
          { question: "What is A Versus B?", answer: "A Versus B (aversusb.net) is a free comparison platform with 3,000+ side-by-side comparisons across technology, sports, countries, products, software, and more. Each comparison includes a short answer, attribute table, verdict, FAQs, and community votes." },
          { question: "How do I compare two things on A Versus B?", answer: "Search for any two entities in the search bar (e.g., 'iPhone vs Samsung') or navigate directly to aversusb.net/compare/{entity-a}-vs-{entity-b}. The comparison page shows you side-by-side attributes, a winner verdict, and community vote results." },
          { question: "Is A Versus B free to use?", answer: "Yes, A Versus B is completely free. All comparison data is accessible without registration, and content is licensed under CC BY 4.0 — free to cite with attribution." },
          { question: "How accurate are the comparisons on A Versus B?", answer: "Each comparison is researched from multiple sources and reviewed editorially. We cite our sources and publish our methodology at aversusb.net/how-we-write-verdicts. Data is updated regularly as products and information change." },
          { question: "What categories does A Versus B cover?", answer: "A Versus B covers 17+ categories including technology, software, sports, countries, automotive, companies, health, finance, entertainment, gaming, products, and brands — with more being added regularly." },
        ])) }}
      />
      {/* Hero Section */}
      <section aria-labelledby="hero-heading" className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white overflow-hidden">
        {/* Grid pattern — inline SVG avoids a separate HTTP request during LCP */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="home-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#home-grid)"/>
        </svg>

        {/* Floating gradient blobs — hidden on mobile; blur-3xl forces compositor layers
            that delay first paint on mobile GPU. Animation is suppressed via motion-safe
            (prefers-reduced-motion), but mobile still pays the compositing cost. */}
        <div className="hidden sm:block absolute top-10 left-10 w-72 h-72 bg-accent-500/20 rounded-full blur-3xl motion-safe:animate-float" />
        <div className="hidden sm:block absolute bottom-20 right-10 w-96 h-96 bg-primary-400/15 rounded-full blur-3xl motion-safe:animate-float" style={{ animationDelay: "2s" }} />
        <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent-400/10 rounded-full blur-3xl motion-safe:animate-float" style={{ animationDelay: "4s" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 lg:py-28">
          <div className="text-center max-w-4xl mx-auto">
            <h1 id="hero-heading" className="text-4xl sm:text-5xl lg:text-7xl font-display font-black tracking-tight mb-4 animate-slide-up">
              Compare{" "}
              <span className="bg-gradient-to-r from-accent-400 to-primary-300 bg-clip-text text-transparent">
                Anything
              </span>
            </h1>
            <p className="hero-description text-lg sm:text-xl text-primary-100 max-w-2xl mx-auto mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Sports players, countries, products, technology, history — get clear,
              visual, data-driven comparisons in seconds.
            </p>

            {/* Search Box — primary CTA */}
            <div id="search" className="max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <SearchBox />
            </div>

            {/* Social-proof stats row */}
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-7 animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <div className="flex items-center gap-1.5 text-primary-100">
                <svg className="w-4 h-4 text-primary-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-semibold text-white">{totalCount.toLocaleString()}+</span>
                <span className="text-xs text-primary-200">comparisons</span>
              </div>
              <div className="w-px h-4 bg-white/15" aria-hidden="true" />
              <div className="flex items-center gap-1.5 text-primary-100">
                <svg className="w-4 h-4 text-primary-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span className="text-sm font-semibold text-white">{CATEGORIES.length}</span>
                <span className="text-xs text-primary-200">categories</span>
              </div>
              <div className="w-px h-4 bg-white/15" aria-hidden="true" />
              <div className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-primary-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-primary-200">Always free · Data-backed</span>
              </div>
            </div>

            {/* Quick example chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-5 animate-fade-in" style={{ animationDelay: "0.4s" }}>
              {[
                { label: "Messi vs Ronaldo", href: "/compare/messi-vs-ronaldo" },
                { label: "Japan vs China", href: "/compare/japan-vs-china" },
                { label: "iPhone vs Samsung", href: "/compare/iphone-17-vs-samsung-s26" },
                { label: "WW1 vs WW2", href: "/compare/ww1-vs-ww2" },
              ].map((example) => (
                <Link
                  key={example.href}
                  href={example.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-full text-xs font-medium text-white/80 hover:text-white transition-all backdrop-blur-sm"
                >
                  <span className="text-[10px] text-white/40" aria-hidden="true">↗</span>
                  {example.label}
                </Link>
              ))}
            </div>

            {/* Category pill links */}
            <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.5s" }}>
              <p className="text-[11px] font-semibold text-primary-300 uppercase tracking-wider mb-3">Browse by category</p>
              <div className="flex flex-wrap justify-center gap-2">
                {CATEGORIES.slice(0, 10).map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/category/${cat.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 rounded-full text-xs font-semibold text-white/70 hover:text-white transition-all backdrop-blur-sm group"
                  >
                    <span className="text-sm leading-none group-hover:scale-110 transition-transform inline-block" aria-hidden="true">{cat.icon}</span>
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" className="w-full" aria-hidden="true">
            <path
              d="M0 80V20C240 60 480 0 720 20C960 40 1200 0 1440 20V80H0Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* Your Recently Viewed (localStorage-based, personal) */}
      <RecentlyViewed />

      {/* Recent Searches */}
      <RecentSearches />

      {/* Featured Comparisons — curated editor's picks, independent of viewCount (DAN-1020) */}
      <FeaturedComparisons items={FEATURED_COMPARISONS} />

      {/* Trending Comparisons */}
      <ScrollReveal>
      <section aria-labelledby="trending-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            </div>
            <div>
              <h2 id="trending-heading" className="text-2xl sm:text-3xl font-display font-bold text-text">
                Trending Comparisons
              </h2>
              <p className="text-text-secondary mt-1">Most popular comparisons right now</p>
            </div>
          </div>
          <Link
            href="/trending"
            className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            View all <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none">
          {trending.map((item, index) => (
            <li key={item.slug}>
              <TrendingCard comparison={item} rank={index + 1} />
            </li>
          ))}
        </ul>
      </section>
      </ScrollReveal>

      {/* Latest Comparisons */}
      <ScrollReveal delay={100}>
      <section aria-labelledby="latest-heading" className="bg-surface-alt py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 id="latest-heading" className="text-2xl sm:text-3xl font-display font-bold text-text">
                  Latest Comparisons
                </h2>
                <p className="text-text-secondary mt-1">Recently added and updated comparisons</p>
              </div>
            </div>
            <Link
              href="/trending"
              className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 list-none">
            {latest.map((item) => {
              const vsParts = item.title.split(/\s+vs\.?\s+/i);
              const latestEntityA = vsParts[0] || item.title;
              const latestEntityB = vsParts[1] || "";
              return (
                <li key={item.slug} className="flex">
                <Link
                  href={`/compare/${item.slug}`}
                  className="group bg-white rounded-xl border border-border hover:border-primary-300 hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden w-full"
                >
                  {/* Mini gradient header */}
                  <div className="h-1.5 w-full bg-gradient-to-r from-primary-500 to-accent-500" />

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 capitalize">
                        {item.category}
                      </span>
                      {item.updatedAt && (
                        <time dateTime={new Date(item.updatedAt).toISOString()} className="text-xs text-text-secondary">
                          {new Date(item.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        </time>
                      )}
                    </div>

                    {/* Entity A vs B visual */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 min-w-0 space-y-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                          <span className="text-sm font-semibold text-text truncate group-hover:text-primary-700 transition-colors">{latestEntityA}</span>
                        </div>
                        {latestEntityB && (
                          <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-accent-500 flex-shrink-0" />
                            <span className="text-sm font-semibold text-text truncate group-hover:text-primary-700 transition-colors">{latestEntityB}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-primary-600 to-accent-500 flex items-center justify-center">
                        <span className="text-[8px] font-black text-white">VS</span>
                      </div>
                    </div>

                    <div className="mt-auto flex items-center gap-1 text-xs text-text-secondary">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      {item.viewCount.toLocaleString()} views
                    </div>
                  </div>
                </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      </ScrollReveal>

      {/* Categories */}
      <ScrollReveal delay={100}>
      <section aria-labelledby="browse-category-heading" className="bg-surface py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </div>
              <div>
                <h2 id="browse-category-heading" className="text-2xl sm:text-3xl font-display font-bold text-text">Browse by Category</h2>
                <p className="text-text-secondary text-sm mt-0.5">Explore comparisons across every topic</p>
              </div>
            </div>
            <Link
              href="/trending"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View trending
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 list-none">
            {CATEGORIES.map((cat) => (
              <li key={cat.slug}>
                <CategoryCard category={cat} />
              </li>
            ))}
          </ul>
        </div>
      </section>
      </ScrollReveal>

      {/* How It Works */}
      <ScrollReveal delay={150}>
      <section aria-labelledby="how-it-works-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 id="how-it-works-heading" className="text-2xl sm:text-3xl font-display font-bold text-text text-center mb-16">
          How It Works
        </h2>
        <ol role="list" className="relative grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto list-none">
          {/* Connecting line (desktop only) */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-0.5 bg-gradient-to-r from-primary-200 via-primary-400 to-primary-200" />

          {[
            {
              step: "1",
              title: "Search or Browse",
              desc: "Type any two things you want to compare, or browse our categories.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
            },
            {
              step: "2",
              title: "Get Instant Answers",
              desc: "See key differences, structured tables, and visual comparisons at a glance.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
            },
            {
              step: "3",
              title: "Explore & Discover",
              desc: "Find related comparisons, alternatives, and deeper analysis.",
              icon: (
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            },
          ].map((item) => (
            <li key={item.step} className="relative text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-primary-200/50 relative z-10">
                {item.icon}
                <span className="absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                  {item.step}
                </span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xs mx-auto">{item.desc}</p>
            </li>
          ))}
        </ol>
      </section>
      </ScrollReveal>

      {/* Trust Section */}
      <section aria-labelledby="trust-heading" className="bg-surface-alt py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 id="trust-heading" className="text-2xl sm:text-3xl font-display font-bold text-text mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-text-secondary mb-10 max-w-2xl mx-auto">
            Join thousands of users making informed decisions with clear, side-by-side comparisons across {CATEGORIES.length} categories.
          </p>
          <AnimatedStats totalCount={totalCount} categoryCount={CATEGORIES.length} />
        </div>
      </section>

      {/* From the Blog */}
      {blogArticles.length > 0 && (
        <section aria-labelledby="blog-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h2 id="blog-heading" className="text-2xl sm:text-3xl font-display font-bold text-text">From the Blog</h2>
                <p className="text-text-secondary text-sm mt-0.5">Expert guides and in-depth analyses</p>
              </div>
            </div>
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all articles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>

          <ul role="list" className="grid grid-cols-1 md:grid-cols-3 gap-6 list-none">
            {blogArticles.map((article, idx) => {
              const gradients = [
                "from-violet-500 to-purple-600",
                "from-primary-500 to-indigo-600",
                "from-rose-500 to-pink-600",
              ];
              const grad = gradients[idx % gradients.length];
              const readMins = Math.max(1, Math.ceil(article.content.split(/\s+/).length / 200));
              return (
                <li key={article.slug} className="flex">
                <Link
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-2xl border border-border hover:border-primary-200 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col w-full"
                >
                  {/* Colour-accent header block */}
                  <div className={`h-28 bg-gradient-to-br ${grad} relative overflow-hidden flex-shrink-0`}>
                    <div className="absolute inset-0 opacity-10">
                      <svg viewBox="0 0 200 80" className="w-full h-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                        <circle cx="160" cy="10" r="60" fill="white" />
                        <circle cx="30" cy="70" r="40" fill="white" />
                      </svg>
                    </div>
                    <div className="absolute bottom-3 left-4 flex items-center gap-2">
                      {article.category && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20 capitalize">
                          {article.category}
                        </span>
                      )}
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/20 text-white/90 backdrop-blur-sm flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {readMins} min
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-bold text-text group-hover:text-primary-600 transition-colors mb-2 line-clamp-2 text-base leading-snug">
                      {article.title}
                    </h3>
                    <p className="text-sm text-text-secondary flex-1 line-clamp-3 mb-4 leading-relaxed">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-xs text-text-secondary pt-3 border-t border-border">
                      {article.publishedAt ? (
                        <time dateTime={new Date(article.publishedAt).toISOString()}>
                          {new Date(article.publishedAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </time>
                      ) : (
                        <span />
                      )}
                      <span className="flex items-center gap-1 text-primary-600 font-semibold group-hover:gap-2 transition-all duration-200">
                        Read more
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex justify-center mt-8 sm:hidden">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
            >
              View all articles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* Request a Comparison CTA */}
      <section aria-labelledby="request-heading" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-200 rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex-1 text-center sm:text-left">
            <h2 id="request-heading" className="text-xl sm:text-2xl font-display font-bold text-text mb-2">
              Can&apos;t find what you&apos;re looking for?
            </h2>
            <p className="text-text-secondary text-sm sm:text-base">
              Suggest a comparison and vote on community requests. Top-voted ideas get built first!
            </p>
          </div>
          <Link
            href="/requests"
            className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-150 shadow-md"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Suggest a Comparison
          </Link>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup source="homepage" />

      {/* CTA */}
      <section aria-labelledby="cta-heading" className="bg-gradient-to-br from-primary-700 via-primary-600 to-accent-700 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 id="cta-heading" className="text-2xl sm:text-3xl font-display font-bold mb-4">
            Ready to Compare?
          </h2>
          <p className="text-primary-100 mb-8">
            Start with any comparison — sports, countries, products, or anything else.
          </p>
          <Link
            href="/#search"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-colors shadow-lg"
          >
            Start Comparing
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
