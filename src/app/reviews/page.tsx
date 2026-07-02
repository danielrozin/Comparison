import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getReviewedEntities, getReviewCategories } from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { breadcrumbSchema } from "@/lib/seo/schema";

const ITEMS_PER_PAGE = 16;

interface PageProps {
  searchParams: Promise<{ page?: string; sort?: string; category?: string; rating?: string }>;
}

const REVIEWS_TITLE = "SmartReview — Product Reviews & Ratings";
const REVIEWS_DESC = "Expert product reviews with aggregated ratings from Reddit, G2, Capterra, Trustpilot, and more. Find the best products with SmartScore ratings.";
const REVIEWS_URL = `${SITE_URL}/reviews`;

export const metadata: Metadata = {
  title: REVIEWS_TITLE,
  description: REVIEWS_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: REVIEWS_URL,
    languages: { "en": REVIEWS_URL, "x-default": REVIEWS_URL },
  },
  openGraph: {
    title: REVIEWS_TITLE,
    description: REVIEWS_DESC,
    url: REVIEWS_URL,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/api/og?title=${encodeURIComponent("SmartReview — Product Reviews")}&type=reviews`, width: 1200, height: 630, alt: REVIEWS_TITLE }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: REVIEWS_TITLE,
    description: REVIEWS_DESC,
    images: [`${SITE_URL}/api/og?title=${encodeURIComponent("SmartReview — Product Reviews")}&type=reviews`],
  },
  other: {
    "citation_title": REVIEWS_TITLE,
    "citation_author": "A Versus B",
    "citation_journal_title": "A Versus B",
    "citation_language": "en",
    "citation_abstract": REVIEWS_DESC,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
    "DC.title": REVIEWS_TITLE,
    "DC.creator": "A Versus B",
    "DC.publisher": "A Versus B",
    "DC.language": "en",
    "DC.description": REVIEWS_DESC,
    "DC.subject": "Product Reviews, SmartScore Ratings, Aggregated Consumer Reviews",
    "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
    "DC.coverage": "Worldwide",
    "DC.type": "Text",
    "DC.format": "text/html",
      "DC.date": "2024-01-01",
    "DC.identifier": REVIEWS_URL,
    "abstract": REVIEWS_DESC,
    "thumbnail": `${SITE_URL}/api/og?title=${encodeURIComponent("SmartReview — Product Reviews")}&type=reviews`,
    "twitter:label1": "Content Type",
    "twitter:data1": "SmartReviews",
    "twitter:label2": "Rating System",
    "twitter:data2": "SmartScore 0–100",
  },
};

function SmartScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "bg-green-100 text-green-800" : score >= 75 ? "bg-blue-100 text-blue-800" : score >= 60 ? "bg-amber-100 text-amber-800" : "bg-surface-alt text-text-secondary";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const sort = (sp.sort as "rating" | "reviews" | "smartscore" | "alphabetical") || "smartscore";
  const category = sp.category || undefined;
  const minRating = sp.rating === "4+" ? 4 : sp.rating === "3+" ? 3 : undefined;

  const [{ entities, total }, categories] = await Promise.all([
    getReviewedEntities({
      category,
      sort,
      minRating,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    }),
    getReviewCategories(),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const basePath = "/reviews";

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
  ]);

  const reviewsOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent("SmartReview — Product Reviews")}&type=reviews`;
  const reviewsToday = new Date().toISOString().slice(0, 10);
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${REVIEWS_URL}#collectionpage`,
    name: "SmartReview — Product Reviews & Ratings",
    description: "Expert product reviews with aggregated ratings from Reddit, G2, Capterra, Trustpilot, and more.",
    abstract: "Expert product reviews with aggregated ratings from Reddit, G2, Capterra, Trustpilot, and more.",
    url: REVIEWS_URL,
    inLanguage: "en-US",
    genre: "Review Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    // dateCreated + datePublished — stable baseline so ISR revalidation does not
    // reset content age. dateModified updates on each revalidation (correct).
    dateCreated: "2024-01-01",
    datePublished: "2024-01-01",
    dateModified: reviewsToday,
    lastReviewed: reviewsToday,
    contentReferenceTime: reviewsToday,
    thumbnailUrl: reviewsOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${REVIEWS_URL}#primaryImage`,
      url: reviewsOgImage,
      contentUrl: reviewsOgImage,
      width: 1200,
      height: 630,
      caption: "SmartReview — Product Reviews & Ratings by A Versus B",
    },
    keywords: `product reviews, software reviews, SmartScore, review aggregator, best software ${new Date().getFullYear()}`,
    alternativeHeadline: "Product & Software Review Aggregator — SmartScore by A Versus B",
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Software Buyers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "#reviews-description", ".reviews-intro"] },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    potentialAction: [
      { "@type": "ReadAction", target: REVIEWS_URL },
      { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` }, "query-input": "required name=search_term_string" },
    ],
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization` },
    ...(total > 0 && {
      numberOfItems: total,
      itemListElement: entities.slice(0, 10).map((entity, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE_URL}/reviews/${entity.slug}`,
        name: entity.name,
        ...(entity.reviewAggregation?.averageRating && {
          item: {
            "@type": "Product",
            name: entity.name,
            url: `${SITE_URL}/reviews/${entity.slug}`,
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: entity.reviewAggregation.averageRating.toFixed(1),
              reviewCount: entity.reviewAggregation.totalReviews,
              bestRating: 5,
              worstRating: 1,
            },
          },
        }),
      })),
    }),
    timeRequired: "PT2M",
    wordCount: 400,
    // mentions[] — top-10 reviewed entities so AI can enumerate without HTML parsing.
    mentions: entities.slice(0, 10).map((entity) => ({
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/entity/${entity.slug}`,
      name: entity.name,
      url: `${SITE_URL}/reviews/${entity.slug}`,
    })),
    // about[] — subject classification for AI topic routing.
    about: [
      { "@type": "Thing", name: "Software Reviews" },
      { "@type": "Thing", name: "Product Ratings" },
      { "@type": "Thing", name: "Consumer Software Comparisons" },
    ],
    locationCreated: { "@type": "Country", name: "United States" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema) }}
      />

      {/* Gradient Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-700 to-accent-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
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
              <li className="text-white font-medium" aria-current="page">SmartReview</li>
            </ol>
          </nav>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-1">
                SmartReview
              </h1>
              <p className="text-primary-100 text-sm sm:text-base">
                Aggregated reviews from Reddit, G2, Capterra, Trustpilot & more.
                {total > 0 && ` ${total} product${total !== 1 ? "s" : ""} reviewed.`}
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/reviews"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
            >
              All ({categories.reduce((s, c) => s + c.count, 0)})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/reviews?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white shadow-sm" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        )}

        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <span className="text-text-secondary">Sort by:</span>
          {(["smartscore", "rating", "reviews", "alphabetical"] as const).map((s) => (
            <Link
              key={s}
              href={`/reviews?sort=${s}${category ? `&category=${category}` : ""}${sp.rating ? `&rating=${sp.rating}` : ""}`}
              className={`font-medium ${sort === s ? "text-primary-600 underline" : "text-text-secondary hover:text-text"}`}
            >
              {s === "smartscore" ? "SmartScore" : s === "rating" ? "Rating" : s === "reviews" ? "Most Reviewed" : "A-Z"}
            </Link>
          ))}
          <span className="mx-2 text-border">|</span>
          <span className="text-text-secondary">Min rating:</span>
          {(["all", "3+", "4+"] as const).map((r) => (
            <Link
              key={r}
              href={`/reviews?sort=${sort}${category ? `&category=${category}` : ""}${r !== "all" ? `&rating=${r}` : ""}`}
              className={`font-medium ${(sp.rating || "all") === r ? "text-primary-600 underline" : "text-text-secondary hover:text-text"}`}
            >
              {r === "all" ? "All" : r}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {entities.length > 0 ? (
          <>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 list-none">
              {entities.map((entity) => {
                const agg = entity.reviewAggregation;
                return (
                  <li key={entity.id} className="flex">
                  <Link
                    href={`/reviews/${entity.slug}`}
                    className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group w-full"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-lg font-bold text-primary-700">
                        {entity.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                          {entity.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {entity.entityType.name}
                        </p>
                      </div>
                      {agg && <SmartScoreBadge score={agg.smartScore} />}
                    </div>
                    {entity.shortDesc && (
                      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{entity.shortDesc}</p>
                    )}
                    <div className="mt-auto">
                      {agg && (
                        <StarRating rating={agg.averageRating} size="sm" reviewCount={agg.totalReviews} />
                      )}
                    </div>
                  </Link>
                  </li>
                );
              })}
            </ul>

            <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No reviewed products found.</p>
            {category && (
              <Link href="/reviews" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
                View all reviews
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
