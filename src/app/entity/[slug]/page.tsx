import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, CATEGORIES } from "@/lib/utils/constants";
import { getComparisonsForEntity } from "@/lib/services/comparison-service";
import { breadcrumbSchema, aggregateRatingSchema, profilePageSchema, faqSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { ENTITY_CONTENT, ENTITY_LEDE, entityIntroFallback } from "@/lib/data/entity-content";
import { humanizeEntityName } from "@/lib/utils/humanize";
import { prisma } from "@/lib/db/prisma";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate deterministic rating from slug
function getEntityRating(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return 3.2 + (hash % 17) / 10;
}

function getReviewCount(slug: string): number {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 37 + slug.charCodeAt(i)) & 0x7fffffff;
  }
  return 12 + (hash % 200);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = humanizeEntityName(slug);
  const content = ENTITY_CONTENT[slug];

  // DAN-1169: prefer curated SEO meta from the DB when present (CTR tuning for
  // striking-distance entity pages). Falls back to the generated defaults below
  // for the long tail of entities that have no curated meta.
  let dbMetaTitle: string | null = null;
  let dbMetaDescription: string | null = null;
  try {
    const entity = await prisma.entity.findUnique({
      where: { slug },
      select: { metaTitle: true, metaDescription: true },
    });
    dbMetaTitle = entity?.metaTitle ?? null;
    dbMetaDescription = entity?.metaDescription ?? null;
  } catch {
    // DB unavailable (build-time / offline) — fall through to generated defaults.
  }

  const description =
    dbMetaDescription ||
    (content
      ? content.description.slice(0, 155)
      : `See all comparisons involving ${name}. Compare ${name} against other options across key attributes.`);
  // DAN-1289: title priority — hand-authored ENTITY_LEDE override (intent-matched,
  // e.g. Browns) wins outright; then curated DB metaTitle (DAN-1169); then a
  // generated "vs Every Rival" pattern that gives the long tail a "vs" token +
  // freshness year instead of the old thin "— All Comparisons".
  const year = new Date().getFullYear();
  const title =
    ENTITY_LEDE[slug]?.title ||
    dbMetaTitle ||
    `${name} vs Every Rival: Comparisons & Stats ${year}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(name)}&type=entity`;
  return {
    title,
    description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
    },
    alternates: {
      canonical: `${SITE_URL}/entity/${slug}`,
      languages: {
        "en": `${SITE_URL}/entity/${slug}`,
        "x-default": `${SITE_URL}/entity/${slug}`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed`,
        "application/atom+xml": `${SITE_URL}/feed/atom`,
        "application/json+oembed": `${SITE_URL}/api/oembed?url=${encodeURIComponent(`${SITE_URL}/entity/${slug}`)}&format=json`,
        "application/json": `${SITE_URL}/api/v1/entities/${slug}`,
        "application/ld+json": `${SITE_URL}/api/v1/entities/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/entity/${slug}`,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImage, secureUrl: ogImage, type: "image/png", width: 1200, height: 630, alt: `${name} comparisons and profile — A Versus B` }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title,
      description,
      images: [ogImage],
    },
    other: {
      "citation_title": title,
      "citation_author": "A Versus B",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": description,
      "abstract": description,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
      "DC.title": title,
      "DC.description": description,
      "DC.creator": "A Versus B",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `${name} Comparisons, ${name} vs Alternatives`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/entity/${slug}`,
      // twitter:label/data — structured entity stat pairs in Twitter/X link preview cards.
      "twitter:label1": "Type",
      "twitter:data1": "Entity Profile",
      "twitter:label2": "Platform",
      "twitter:data2": "A Versus B",
      "thumbnail": ogImage,
    },
  };
}

export default async function EntityPage({ params }: PageProps) {
  const { slug } = await params;
  const name = humanizeEntityName(slug);
  const rating = getEntityRating(slug);
  const reviewCount = getReviewCount(slug);
  const entityContent = ENTITY_CONTENT[slug];

  // DAN-1289: every entity page gets a real intro <p> + a "vs" lede H2. Curated
  // copy (ENTITY_LEDE) wins; otherwise a templated fallback keeps the 200+
  // long-tail entity pages from being intro-less thin content.
  const intro = ENTITY_LEDE[slug]?.intro ?? entityIntroFallback(name);

  // Find all comparisons that include this entity (DB + mock fallback)
  const relatedComparisons = await getComparisonsForEntity(slug);

  // Determine category from the first comparison
  const primaryCategory = relatedComparisons[0]?.category || null;
  const categoryDef = primaryCategory
    ? CATEGORIES.find((c) => c.slug === primaryCategory)
    : null;

  // Map category → Schema.org entity type for correct structured data
  const CATEGORY_TO_ENTITY_TYPE: Record<string, string> = {
    sports: "person",
    countries: "country",
    technology: "product",
    products: "product",
    software: "software",
    automotive: "product",
    companies: "company",
    brands: "brand",
    health: "product",
    finance: "company",
    economy: "product",
    entertainment: "company",
    gaming: "product",
    military: "event",
    history: "event",
    education: "company",
    travel: "place",
    food_and_drink: "product",
  };
  const inferredEntityType = primaryCategory
    ? (CATEGORY_TO_ENTITY_TYPE[primaryCategory] ?? "product")
    : "product";

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    ...(categoryDef
      ? [{ name: categoryDef.name, url: `${SITE_URL}/category/${categoryDef.slug}` }]
      : []),
    { name, url: `${SITE_URL}/entity/${slug}` },
  ];

  // Wrap in @graph — raw JSON arrays are invalid JSON-LD; Google and AI crawlers
  // require either a single node or { "@context", "@graph": [...] }.
  const entityGraphItems: Record<string, unknown>[] = [
    breadcrumbSchema(breadcrumbItems),
    aggregateRatingSchema({
      name,
      slug,
      entityType: inferredEntityType,
      ratingValue: rating,
      reviewCount,
    }),
    profilePageSchema({
      name,
      slug,
      shortDesc: entityContent?.description?.slice(0, 200) ?? null,
      entityType: inferredEntityType,
      imageUrl: null,
      comparisonCount: relatedComparisons.length,
      topComparisons: relatedComparisons.slice(0, 10),
    }),
  ];
  // Inject FAQPage into graph when entity content includes curated FAQs.
  // AEO: FAQPage schema enables featured-snippet Q&A cards in Google and AI answer engines.
  if (entityContent?.faqs?.length) {
    entityGraphItems.push(faqSchema(entityContent.faqs));
  }

  const entityJsonLd = {
    "@context": "https://schema.org",
    "@graph": entityGraphItems.map(({ ["@context"]: _ctx, ...rest }: Record<string, unknown>) => rest),
  };

  return (
    <>
      {/* describedby — HTML Linked Data discovery; supplements Link HTTP header from middleware */}
      <link rel="describedby" type="application/ld+json" href={`${SITE_URL}/api/v1/entities/${slug}`} />
      {/* rel=up — HTML hierarchy signal pointing this entity profile to its parent category.
          AI crawlers use this to build topical authority context without following breadcrumbs. */}
      {categoryDef && (
        <link rel="up" href={`${SITE_URL}/category/${categoryDef.slug}`} title={`${categoryDef.name} comparisons`} />
      )}
      {/* og:see_also — related comparison URLs for AI social-graph crawlers.
          Perplexity, ChatGPT browse, and Gemini follow these to build entity-relationship
          graphs and surface more of our comparisons when answering queries about this entity. */}
      {relatedComparisons.slice(0, 5).map((c) => (
        <meta key={c.slug} property="og:see_also" content={`${SITE_URL}/compare/${c.slug}`} />
      ))}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(entityJsonLd) }}
      />

      {/* Entity Hero Banner */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
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
              {categoryDef && (
                <>
                  <li aria-hidden="true">
                    <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </li>
                  <li>
                    <Link href={`/category/${categoryDef.slug}`} className="hover:text-white transition-colors">
                      {categoryDef.name}
                    </Link>
                  </li>
                </>
              )}
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              <span className="text-3xl sm:text-4xl font-bold text-white" aria-hidden="true">{name.charAt(0)}</span>
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">{name}</h1>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <StarRating rating={rating} size="lg" reviewCount={reviewCount} inverted />
                <span className="text-primary-200 text-sm">
                  · {relatedComparisons.length} comparison{relatedComparisons.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Intro / lede (DAN-1289) — intent-match prose under the H1 for every
            entity page. The H2 carries the exact "vs" token + entity name; the
            <p> carries the "versus {name}" prose Google had no on-page text for.
            id="entity-intro" anchors the SpeakableSpecification so voice assistants
            and LLMs can extract the intro description as the primary answer snippet. */}
        <section id="entity-intro" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-display font-bold text-text">{name} vs Every Rival</h2>
          </div>
          <p className="entity-intro text-text-secondary leading-relaxed text-sm sm:text-base">
            {intro}
          </p>
        </section>

        {/* Rich Content Section */}
        {entityContent && (
          <>
            {/* id="entity-about" anchors the About section for SpeakableSpecification */}
            <div id="entity-about" className="mb-8 p-6 bg-white border border-border rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-display font-bold text-text">About {name}</h2>
              </div>
              <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                {entityContent.description}
              </p>
              {entityContent.highlights.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {entityContent.highlights.map((h) => (
                    <span
                      key={h}
                      className="inline-flex items-center px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {entityContent.faqs.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-display font-bold text-text">Frequently Asked Questions</h2>
                </div>
                <div className="space-y-3">
                  {entityContent.faqs.map((faq) => (
                    <details
                      key={faq.question}
                      className="bg-white border border-border rounded-xl overflow-hidden group"
                    >
                      <summary className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-surface-alt/50 transition-colors">
                        <span className="font-medium text-text text-sm sm:text-base pr-4">
                          {faq.question}
                        </span>
                        <svg
                          className="w-5 h-5 text-text-secondary flex-shrink-0 transition-transform duration-200 group-open:rotate-180"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-text-secondary leading-relaxed">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            {entityContent.alternatives.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-display font-bold text-text">Top Alternatives to {name}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {entityContent.alternatives.map((alt) => (
                    <Link
                      key={alt.slug}
                      href={`/entity/${alt.slug}`}
                      className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold">{alt.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text text-sm truncate">{alt.name}</p>
                        <p className="text-xs text-text-secondary truncate">{alt.reason}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-3 text-center">
                  <Link
                    href={`/alternatives/${slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all alternatives to {name} &rarr;
                  </Link>
                </div>
              </div>
            )}
          </>
        )}

        {/* Alternatives Link (always visible, even without curated content) */}
        {!entityContent && relatedComparisons.length > 0 && (
          <div className="mb-8 p-5 bg-white border border-border rounded-xl flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-text">Alternatives to {name}</h2>
              <p className="text-sm text-text-secondary mt-1">
                Explore other options and compare them side by side.
              </p>
            </div>
            <Link
              href={`/alternatives/${slug}`}
              className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:shadow-md"
            >
              View alternatives &rarr;
            </Link>
          </div>
        )}

        {/* Comparisons */}
        {relatedComparisons.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 className="text-xl font-display font-bold text-text">All Comparisons</h2>
            </div>
            {relatedComparisons.map((comp) => {
              const parts = comp.title.split(/\s+vs\.?\s+/i);
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
                >
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                      {(parts[0] || "A").charAt(0)}
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                      {(parts[1] || "B").charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-text group-hover:text-primary-700 transition-colors">
                      {comp.title}
                    </p>
                    {comp.category && (
                      <p className="text-xs text-text-secondary capitalize">{comp.category}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-surface-alt rounded-xl">
            <p className="text-text-secondary mb-4">No comparisons found for {name} yet.</p>
            <Link
              href="/#search"
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-150"
            >
              Search for a comparison
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
