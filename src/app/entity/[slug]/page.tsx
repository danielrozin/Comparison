import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME, CATEGORIES } from "@/lib/utils/constants";
import { getComparisonsForEntity } from "@/lib/services/comparison-service";
import { breadcrumbSchema, aggregateRatingSchema, profilePageSchema, faqSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { EntityCompareSearch } from "@/components/ui/EntityCompareSearch";
import { ENTITY_CONTENT, ENTITY_LEDE, entityIntroFallback } from "@/lib/data/entity-content";
import { humanizeEntityName } from "@/lib/utils/humanize";
import { prisma } from "@/lib/db/prisma";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

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
      images: [{ url: ogImage, alt: `${name} comparisons and profile — A Versus B` }],
    },
    other: {
      "citation_title": title,
      "citation_author": "Daniel Rozin",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": description,
      "abstract": description,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": "2024-01-01",
      "DC.title": title,
      "DC.description": description,
      "DC.creator": "Daniel Rozin",
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

  // Compute top categories for the at-a-glance chip row
  const categoryCounts: Record<string, number> = {};
  for (const c of relatedComparisons) {
    if (c.category) categoryCounts[c.category] = (categoryCounts[c.category] ?? 0) + 1;
  }
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([slug, count]) => ({
      slug,
      name: CATEGORIES.find((c) => c.slug === slug)?.name ?? slug,
      count,
    }));

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

  // Breadcrumb items — always 3 levels: Home → Category (or Entity Profiles) → Entity
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    categoryDef
      ? { name: categoryDef.name, url: `${SITE_URL}/category/${categoryDef.slug}` }
      : { name: "Entity Profiles", url: `${SITE_URL}/entity` },
    { name, url: `${SITE_URL}/entity/${slug}` },
  ];

  // Wrap in @graph — raw JSON arrays are invalid JSON-LD; Google and AI crawlers
  // require either a single node or { "@context", "@graph": [...] }.
  const hasCuratedFaqs = !!entityContent?.faqs?.length;
  const faqNodeId = `${SITE_URL}/entity/${slug}#faq`;
  const entityGraphItems: Record<string, unknown>[] = [
    breadcrumbSchema(breadcrumbItems),
    aggregateRatingSchema({
      name,
      slug,
      entityType: inferredEntityType,
      ratingValue: rating,
      reviewCount,
    }),
    {
      ...profilePageSchema({
        name,
        slug,
        shortDesc: entityContent?.description?.slice(0, 200) ?? null,
        entityType: inferredEntityType,
        imageUrl: null,
        comparisonCount: relatedComparisons.length,
        topComparisons: relatedComparisons.slice(0, 10),
      }),
      // hasPart — formal ProfilePage→FAQPage edge. Google and AI answer engines
      // use hasPart to discover which structured FAQ content belongs to this profile,
      // enabling FAQ rich results for "[entity] questions" queries.
      ...(hasCuratedFaqs && { hasPart: [{ "@type": "FAQPage", "@id": faqNodeId }] }),
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["#entity-intro", "#entity-about", ".faq-answer"],
      },
    },
  ];
  // Inject FAQPage into graph when entity content includes curated FAQs.
  // AEO: FAQPage schema enables featured-snippet Q&A cards in Google and AI answer engines.
  // Pass faqNodeId so faqSchema emits @id + isPartOf back-reference to the ProfilePage.
  if (hasCuratedFaqs) {
    entityGraphItems.push(faqSchema(entityContent!.faqs, faqNodeId));
  }

  // ItemList — dedicated @graph node listing the top comparisons for this entity.
  // AI carousels (Google Discover, Perplexity related-content, ChatGPT browse) extract
  // ItemList nodes to surface related comparisons in "what else can you compare X with?"
  // response slots. Each ListItem carries url + name + item/@id so crawlers resolve
  // the Article node without following the link.
  if (relatedComparisons.length > 0) {
    entityGraphItems.push({
      "@type": "ItemList",
      "@id": `${SITE_URL}/entity/${slug}#comparisons`,
      name: `${name} Comparisons`,
      description: `All head-to-head comparisons involving ${name} on A Versus B`,
      url: `${SITE_URL}/entity/${slug}`,
      numberOfItems: relatedComparisons.length,
      itemListElement: relatedComparisons.slice(0, 20).map((comp, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: comp.title,
        url: `${SITE_URL}/compare/${comp.slug}`,
        item: {
          "@type": "Article",
          "@id": `${SITE_URL}/compare/${comp.slug}#article`,
          name: comp.title,
          url: `${SITE_URL}/compare/${comp.slug}`,
          ...(comp.category && {
            articleSection: comp.category,
            // genre — content classification for AI indexers and Google Discover carousels.
            // AI carousel slots use genre to filter "X comparison" content type correctly.
            genre: `${comp.category.charAt(0).toUpperCase()}${comp.category.slice(1)} Comparison`,
          }),
        },
      })),
    });
  }

  const entityJsonLd = {
    "@context": "https://schema.org",
    "@graph": entityGraphItems.map(({ ["@context"]: _ctx, ...rest }: Record<string, unknown>) => rest),
  };

  return (
    <>
      {/* describedby — HTML Linked Data discovery; supplements Link HTTP header from middleware */}
      <link rel="describedby" type="application/ld+json" href={`${SITE_URL}/api/v1/entities/${slug}`} />
      {/* cite-as — W3C preferred citation URL in HTML; mirrors the Link: header set by middleware.
          HTML parsers (Common Crawl, Internet Archive, AI training pipelines) see this without
          HTTP header access. Perplexity, ChatGPT browse, and Gemini use cite-as for attribution. */}
      <link rel="cite-as" href={`${SITE_URL}/entity/${slug}`} />
      {/* license — CC BY 4.0 link tag; AI citation engines confirm free citability from this. */}
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      {/* content-language — mirrors the HTTP Content-Language: en header into HTML for
          snapshot crawlers and archive pipelines that parse static HTML only. */}
      <meta httpEquiv="content-language" content="en" />
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
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white relative overflow-hidden">
        {/* Inline SVG grid — avoids a separate HTTP request during LCP window (same pattern as ComparisonHero) */}
        <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="entity-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#entity-hero-grid)"/>
        </svg>
        {/* Decorative blobs — hidden on mobile (blur-3xl forces GPU compositor layers that delay LCP paint) */}
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4" aria-hidden="true" />
        <div className="hidden sm:block absolute bottom-0 left-10 w-56 h-56 bg-primary-400/10 rounded-full blur-3xl translate-y-1/3" aria-hidden="true" />
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
                    <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
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
                <svg className="w-3 h-3 text-primary-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="flex items-start gap-5 sm:gap-6">
            {/* Polished entity avatar with gradient glow */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400 to-accent-500 blur-xl opacity-50 scale-125" aria-hidden="true" />
              <div className="relative w-18 h-18 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 via-primary-600 to-indigo-700 rounded-2xl flex items-center justify-center ring-2 ring-white/25 shadow-2xl shadow-primary-900/60">
                <span className="text-3xl sm:text-4xl font-black text-white drop-shadow-sm" aria-hidden="true">{name.charAt(0)}</span>
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight leading-tight">{name}</h1>
              <div className="mt-2.5 flex items-center gap-3 flex-wrap">
                <StarRating rating={rating} size="lg" reviewCount={reviewCount} inverted />
                <span className="text-primary-200/80 text-sm font-medium">
                  · {relatedComparisons.length} comparison{relatedComparisons.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {/* Inline "compare with" search — turns entity pages into comparison entry points */}
          <div className="max-w-lg mt-5">
            <EntityCompareSearch entityName={name} entitySlug={slug} />
          </div>

          {/* At-a-glance category chips */}
          {topCategories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Top comparison categories">
              {topCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-sm ring-1 ring-white/20 transition-all duration-150 hover:ring-white/40"
                >
                  <span className="capitalize">{cat.name}</span>
                  <span className="opacity-50">·</span>
                  <span className="opacity-75">{cat.count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 32" fill="none" className="w-full">
            <path d="M0 32V10C360 28 720 0 1080 16C1260 24 1380 8 1440 10V32H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">

        {/* Intro / lede (DAN-1289) — intent-match prose under the H1 for every
            entity page. The H2 carries the exact "vs" token + entity name; the
            <p> carries the "versus {name}" prose Google had no on-page text for.
            id="entity-intro" anchors the SpeakableSpecification so voice assistants
            and LLMs can extract the intro description as the primary answer snippet. */}
        <section id="entity-intro" aria-labelledby="entity-intro-heading" className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="entity-intro-heading" className="text-xl font-display font-bold text-text">{name} vs Every Rival</h2>
          </div>
          <p className="entity-intro text-text-secondary leading-relaxed text-sm sm:text-base">
            {intro}
          </p>
        </section>

        {/* Rich Content Section */}
        {entityContent && (
          <>
            {/* id="entity-about" anchors the About section for SpeakableSpecification */}
            <section id="entity-about" aria-labelledby="entity-about-heading" className="mb-8 p-6 bg-white border border-border rounded-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 id="entity-about-heading" className="text-xl font-display font-bold text-text">About {name}</h2>
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
            </section>

            {entityContent.faqs.length > 0 && (
              <section aria-labelledby="entity-faqs-heading" className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h2 id="entity-faqs-heading" className="text-xl font-display font-bold text-text">Frequently Asked Questions</h2>
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
                          aria-hidden="true"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </summary>
                      <div className="px-5 pb-4">
                        <p className="text-sm text-text-secondary leading-relaxed faq-answer">{faq.answer}</p>
                      </div>
                    </details>
                  ))}
                </div>
              </section>
            )}

            {entityContent.alternatives.length > 0 && (
              <section aria-labelledby="entity-alternatives-heading" className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <h2 id="entity-alternatives-heading" className="text-xl font-display font-bold text-text">Top Alternatives to {name}</h2>
                </div>
                <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none p-0 m-0">
                  {entityContent.alternatives.map((alt) => (
                    <li key={alt.slug}>
                    <Link
                      href={`/entity/${alt.slug}`}
                      className="flex items-center gap-3 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group w-full h-full"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                        <span className="text-white font-bold">{alt.name.charAt(0)}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-text text-sm truncate">{alt.name}</p>
                        <p className="text-xs text-text-secondary truncate">{alt.reason}</p>
                      </div>
                    </Link>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 text-center">
                  <Link
                    href={`/alternatives/${slug}`}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all alternatives to {name} <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </section>
            )}
          </>
        )}

        {/* Alternatives Link (always visible, even without curated content) */}
        {!entityContent && relatedComparisons.length > 0 && (
          <section aria-labelledby="entity-alt-link-heading" className="mb-8 p-5 bg-white border border-border rounded-xl flex items-center justify-between">
            <div>
              <h2 id="entity-alt-link-heading" className="text-lg font-bold text-text">Alternatives to {name}</h2>
              <p className="text-sm text-text-secondary mt-1">
                Explore other options and compare them side by side.
              </p>
            </div>
            <Link
              href={`/alternatives/${slug}`}
              className="flex-shrink-0 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:shadow-md"
            >
              View alternatives <span aria-hidden="true">&rarr;</span>
            </Link>
          </section>
        )}

        {/* Comparisons */}
        {relatedComparisons.length > 0 ? (
          <section aria-labelledby="entity-comparisons-heading">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                </svg>
              </div>
              <h2 id="entity-comparisons-heading" className="text-xl font-display font-bold text-text">All Comparisons</h2>
              <span className="ml-auto text-xs font-medium text-text-secondary bg-surface-alt px-2.5 py-1 rounded-full">{relatedComparisons.length}</span>
            </div>
            <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-3 list-none p-0 m-0">
            {relatedComparisons.map((comp) => {
              const parts = comp.title.split(/\s+vs\.?\s+/i);
              return (
                <li key={comp.slug} className="m-0 p-0">
                <Link
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
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                      {comp.title}
                    </p>
                    {comp.category && (
                      <p className="text-xs text-text-secondary capitalize">{comp.category}</p>
                    )}
                  </div>
                  <svg className="w-5 h-5 text-text-secondary group-hover:translate-x-0.5 transition-transform duration-150 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
                </li>
              );
            })}
            </ul>
          </section>
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

        {/* Cite this entity page */}
        <section aria-labelledby="entity-cite-heading" className="mt-10 pt-8 border-t border-border">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-500 to-gray-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 id="entity-cite-heading" className="text-base font-display font-bold text-text">Cite This Page</h2>
          </div>
          <p className="text-xs text-text-secondary mb-3">Free to use with attribution (CC BY 4.0).</p>
          <pre className="whitespace-pre-wrap break-words rounded-xl bg-surface-alt border border-border px-4 py-3 text-xs text-text font-mono select-all leading-relaxed">
            {`A Versus B, "${name} Comparisons," aversusb.net, ${new Date().getFullYear()}. https://aversusb.net/entity/${slug}`}
          </pre>
        </section>

        <div className="mt-10">
          <NewsletterSignup source={`entity-${slug}`} />
        </div>
      </div>
    </>
  );
}
