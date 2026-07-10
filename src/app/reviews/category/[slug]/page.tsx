import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import {
  getReviewedEntities,
  getReviewCategories,
} from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

export const revalidate = 3600; // ISR: 1 hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getReviewCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getReviewCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  const title = `Best ${cat.name} Reviews & SmartScores`;
  const desc = `Compare the best ${cat.name.toLowerCase()} with aggregated SmartScores. Verified reviews, pros & cons, and side-by-side ratings.`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(cat.name + " Reviews")}&type=reviews`;
  return {
    title,
    description: desc,
    robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${SITE_URL}/reviews/category/${slug}`,
    languages: { "en": `${SITE_URL}/reviews/category/${slug}`, "x-default": `${SITE_URL}/reviews/category/${slug}` },
  },
    openGraph: {
      title,
      description: desc,
      url: `${SITE_URL}/reviews/category/${slug}`,

      locale: "en_US",      images: [{ url: ogImage, width: 1200, height: 630, alt: `Best ${cat.name} reviews — A Versus B SmartReview` }],
    },
    twitter: { card: "summary_large_image",
    site: "@aversusb", title, description: desc, images: [{ url: ogImage, alt: `Best ${cat.name} reviews — A Versus B SmartReview` }] },
    other: {
      "citation_title": title,
      "citation_author": SITE_NAME,
      "citation_journal_title": `${SITE_NAME} SmartReview`,
      "citation_language": "en",
      "citation_abstract": desc,
      "abstract": desc,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
      "DC.title": title,
      "DC.creator": SITE_NAME,
      "DC.publisher": SITE_NAME,
      "DC.language": "en",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/reviews/category/${slug}`,
      "thumbnail": ogImage,
    },
  };
}

function SmartScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-emerald-700 bg-emerald-100"
      : score >= 75
        ? "text-blue-700 bg-blue-100"
        : score >= 60
          ? "text-amber-700 bg-amber-100"
          : "text-red-700 bg-red-100";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-lg font-bold ${color}`}
    >
      {score}
    </span>
  );
}

export default async function ReviewCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getReviewCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const { entities, total } = await getReviewedEntities({
    category: slug,
    sort: "smartscore",
    limit: 50,
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
    { name: cat.name, url: `${SITE_URL}/reviews/category/${slug}` },
  ]);
  const reviewCatUrl = `${SITE_URL}/reviews/category/${slug}`;
  const reviewCatOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`${cat.name} Reviews`)}&type=reviews`;
  const reviewCatToday = new Date().toISOString().slice(0, 10);
  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${reviewCatUrl}#collectionpage`,
    name: `Best ${cat.name} Reviews & SmartScores`,
    alternativeHeadline: `Top ${cat.name} ${new Date().getFullYear()} — Aggregated SmartScore Rankings`,
    description: `Compare the best ${cat.name.toLowerCase()} with aggregated SmartScores from Reddit, G2, Capterra, Trustpilot, and more.`,
    abstract: `Aggregated ${cat.name} reviews with SmartScores from multiple platforms.`,
    url: reviewCatUrl,
    inLanguage: "en-US",
    genre: "Review Category Index",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    datePublished: "2024-01-01",
    dateModified: reviewCatToday,
    lastReviewed: reviewCatToday,
    contentReferenceTime: reviewCatToday,
    numberOfItems: total,
    thumbnailUrl: reviewCatOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${reviewCatUrl}#primaryImage`,
      url: reviewCatOgImage,
      contentUrl: reviewCatOgImage,
      width: 1200,
      height: 630,
      caption: `${cat.name} Reviews — A Versus B SmartReview`,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    usageInfo: `${SITE_URL}/terms`,
    copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
    copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    acquireLicensePage: `${SITE_URL}/terms`,
    audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Software Buyers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
    accessMode: ["textual"],
    accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
    accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
    keywords: `${cat.name} reviews, best ${cat.name.toLowerCase()} ${new Date().getFullYear()}, SmartScore ${cat.name.toLowerCase()}`,
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: [
      { "@type": "ReadAction", target: reviewCatUrl },
      { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}+${encodeURIComponent(cat.name.toLowerCase())}` }, "query-input": "required name=search_term_string" },
    ],
    speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".category-description", "#page-description"] },
    // mentions[] — top-10 products for AI crawlers that enumerate category members without HTML parsing.
    ...(entities.length > 0 && {
      mentions: entities.slice(0, 10).map((e) => ({
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/entity/${e.slug}`,
        name: e.name,
        url: `${SITE_URL}/reviews/${e.slug}`,
        ...(e.reviewAggregation?.smartScore && { aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: e.reviewAggregation.averageRating?.toFixed(1) ?? "0",
          reviewCount: e.reviewAggregation.totalReviews ?? 0,
          bestRating: 5,
          worstRating: 1,
          ratingExplanation: `SmartScore ${e.reviewAggregation.smartScore}/100`,
        }}),
      })),
    }),
  };

  // ItemList — ranked product list with AggregateRating per entry.
  // Google uses ItemList + AggregateRating to surface category carousels in search
  // and AI answer engines (Perplexity, ChatGPT) use it to rank and enumerate products.
  const itemListSchema = entities.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${reviewCatUrl}#list`,
    name: `Best ${cat.name} — Ranked by SmartScore`,
    description: `Top ${cat.name} products ranked by aggregated SmartScore from Reddit, G2, Capterra, Trustpilot, and more.`,
    url: reviewCatUrl,
    numberOfItems: Math.min(entities.length, 10),
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: entities.slice(0, 10).map((e, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: e.name,
      url: `${SITE_URL}/reviews/${e.slug}`,
      item: {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/entity/${e.slug}`,
        name: e.name,
        url: `${SITE_URL}/reviews/${e.slug}`,
        applicationCategory: cat.name,
        ...(e.reviewAggregation && {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: e.reviewAggregation.averageRating?.toFixed(1) ?? "0",
            reviewCount: e.reviewAggregation.totalReviews ?? 0,
            bestRating: 5,
            worstRating: 1,
          },
        }),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
      },
    })),
  } : null;

  return (
    <>
      <link rel="up" href={`${SITE_URL}/reviews`} title="All Reviews" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />
      {itemListSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
        />
      )}

      {/* Gradient Hero */}
      <section aria-labelledby="review-category-heading" className="bg-gradient-to-br from-primary-900 via-primary-800 to-violet-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="review-cat-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#review-cat-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">{cat.name}</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              {cat.name.charAt(0)}
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">SmartReview</span>
              <h1 id="review-category-heading" className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                Best {cat.name} Reviews
              </h1>
              <p className="text-primary-200 mt-1">
                {total} product{total !== 1 ? "s" : ""} ranked by SmartScore
              </p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Product List */}
        {entities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {entities.map((entity, index) => {
              const agg = entity.reviewAggregation;
              return (
                <div
                  key={entity.id}
                  className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-200 transition-colors"
                >
                  {/* Rank */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="text-2xl font-display font-black text-text-secondary w-8 text-center">
                      {index + 1}
                    </span>
                    {agg && <SmartScoreBadge score={agg.smartScore} />}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-display font-bold text-text">
                      {entity.name}
                    </h2>
                    {entity.shortDesc && (
                      <p className="text-sm text-text-secondary mt-0.5">
                        {entity.shortDesc}
                      </p>
                    )}
                    {agg && (
                      <div className="mt-2">
                        <StarRating
                          rating={agg.averageRating}
                          size="sm"
                          reviewCount={agg.totalReviews}
                        />
                      </div>
                    )}

                    {/* Pros & Cons */}
                    {agg && (agg.topPros.length > 0 || agg.topCons.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {agg.topPros.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                              Pros
                            </p>
                            <ul className="text-sm text-text-secondary space-y-0.5">
                              {agg.topPros.slice(0, 3).map((pro) => (
                                <li key={pro} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 mt-0.5 shrink-0">
                                    +
                                  </span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {agg.topCons.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                              Cons
                            </p>
                            <ul className="text-sm text-text-secondary space-y-0.5">
                              {agg.topCons.slice(0, 3).map((con) => (
                                <li key={con} className="flex items-start gap-1.5">
                                  <span className="text-red-400 mt-0.5 shrink-0">
                                    -
                                  </span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 self-center">
                    <Link
                      href={`/reviews/${entity.slug}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      Full Review
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No products reviewed in this category yet.
            </p>
            <Link
              href="/reviews"
              className="mt-4 inline-block text-primary-600 font-medium hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        )}

        <div className="mt-16">
          <NewsletterSignup source={`review-category-${slug}`} />
        </div>
      </div>
    </>
  );
}
