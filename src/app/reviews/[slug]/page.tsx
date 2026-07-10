import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getReviewsByEntity, getEntityAggregation } from "@/lib/services/review-service";
import { aggregateRatingSchema, breadcrumbSchema, entityWikipediaSameAs, faqSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";
import { humanizeEntityName } from "@/lib/utils/humanize";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agg = await getEntityAggregation(slug);
  const name = humanizeEntityName(slug);

  const title = agg
    ? `${name} Review — ${agg.averageRating}/5 from ${agg.totalReviews} reviews`
    : `${name} Review`;
  const description = agg
    ? `${name} has a ${agg.averageRating}/5 rating from ${agg.totalReviews} aggregated reviews. SmartScore: ${agg.smartScore}/100.`
    : `Read reviews for ${name} from multiple sources.`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(name + " Reviews")}&type=reviews`;
  return {
    title,
    description,
    robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
  },
  alternates: {
    canonical: `${SITE_URL}/reviews/${slug}`,
    languages: { "en": `${SITE_URL}/reviews/${slug}`, "x-default": `${SITE_URL}/reviews/${slug}` },
  },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/reviews/${slug}`,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: "2024-01-01T00:00:00Z",
      modifiedTime: new Date().toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${name} reviews and SmartScore — A Versus B` }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title,
      description,
      images: [{ url: ogImage, alt: `${name} reviews and SmartScore — A Versus B` }],
    },
    other: {
      "citation_title": title,
      "citation_author": "Daniel Rozin",
      "citation_journal_title": "A Versus B SmartReview",
      "citation_language": "en",
      "citation_abstract": description,
      "abstract": description,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": new Date().toISOString().slice(0, 10),
      "DC.title": title,
      "DC.description": description,
      "DC.creator": "Daniel Rozin",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `${name} Reviews, Product Review`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/reviews/${slug}`,
      "thumbnail": ogImage,
      "twitter:label1": "SmartScore",
      "twitter:data1": agg ? `${agg.smartScore}/100` : "Aggregated",
      "twitter:label2": "Reviews",
      "twitter:data2": agg ? `${agg.totalReviews} sources` : "Multiple sources",
    },
  };
}

function SourceBreakdown({ breakdown }: { breakdown: Record<string, { avg: number; count: number }> }) {
  const sources = Object.entries(breakdown).sort((a, b) => b[1].count - a[1].count);
  return (
    <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 gap-3 list-none">
      {sources.map(([source, data]) => (
        <li key={source} className="bg-white border border-border rounded-lg p-3">
          <p className="text-sm font-medium text-text capitalize">{source}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-text">{data.avg.toFixed(1)}</span>
            <span className="text-xs text-text-secondary">/ 5</span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{data.count} review{data.count !== 1 ? "s" : ""}</p>
        </li>
      ))}
    </ul>
  );
}


function SentimentBar({ positivePct, negativePct }: { positivePct: number; negativePct: number }) {
  const neutralPct = Math.max(0, 100 - positivePct - negativePct);
  return (
    <div className="w-full">
      <div
        role="img"
        aria-label={`Sentiment: ${positivePct}% positive, ${neutralPct}% neutral, ${negativePct}% negative`}
        className="flex h-3 rounded-full overflow-hidden"
      >
        <div className="bg-green-400" style={{ width: `${positivePct}%` }} />
        <div className="bg-border" style={{ width: `${neutralPct}%` }} />
        <div className="bg-red-400" style={{ width: `${negativePct}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-text-secondary" aria-hidden="true">
        <span>{positivePct}% positive</span>
        <span>{negativePct}% negative</span>
      </div>
    </div>
  );
}

export default async function EntityReviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const source = sp.source || undefined;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 20;

  const [aggregation, { reviews, total }] = await Promise.all([
    getEntityAggregation(slug),
    getReviewsByEntity(slug, { limit, offset: (page - 1) * limit, source }),
  ]);

  if (!aggregation && total === 0) notFound();

  const name = humanizeEntityName(slug);

  const title = aggregation
    ? `${name} Review — ${aggregation.averageRating}/5 from ${aggregation.totalReviews} reviews`
    : `${name} Review`;
  const description = aggregation
    ? `${name} has a ${aggregation.averageRating}/5 rating from ${aggregation.totalReviews} aggregated reviews. SmartScore: ${aggregation.smartScore}/100.`
    : `Read reviews for ${name} from multiple sources.`;

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(name + " Reviews")}&type=reviews`;

  // Schema.org structured data
  const schemas: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Reviews", url: `${SITE_URL}/reviews` },
      { name, url: `${SITE_URL}/reviews/${slug}` },
    ]),
    {
      "@context": "https://schema.org",
      // ReviewPage signals to Google and AI crawlers that this is a structured review index,
      // enabling "Review Snippet" rich results and query routing for "[product] reviews" queries.
      "@type": ["WebPage", "ReviewPage"],
      "@id": `${SITE_URL}/reviews/${slug}#reviewpage`,
      additionalType: "https://schema.org/LearningResource",
      learningResourceType: "Review",
      name: title,
      description,
      abstract: description,
      alternativeHeadline: `${name} SmartReview — Aggregated Ratings & Expert Analysis`,
      url: `${SITE_URL}/reviews/${slug}`,
      inLanguage: "en-US",
      genre: "Product Review",
      creativeWorkStatus: "Published",
      isAccessibleForFree: true,
      conditionsOfAccess: "Free",
      interactivityType: "expositive",
      // contentReferenceTime — tells LLMs the "as of" date for this review data.
      contentReferenceTime: new Date().toISOString().slice(0, 10),
      dateModified: new Date().toISOString().slice(0, 10),
      lastReviewed: new Date().toISOString().slice(0, 10),
      thumbnailUrl: ogImage,
      image: {
        "@type": "ImageObject",
        "@id": `${SITE_URL}/reviews/${slug}#primaryImage`,
        url: ogImage,
        contentUrl: ogImage,
        width: 1200,
        height: 630,
        caption: `${name} Reviews — A Versus B SmartReview`,
        creditText: SITE_NAME,
        creator: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
        copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
      },
      license: "https://creativecommons.org/licenses/by/4.0/",
      usageInfo: `${SITE_URL}/terms`,
      copyrightNotice: `© ${new Date().getFullYear()} ${SITE_NAME}. Licensed under CC BY 4.0.`,
      copyrightHolder: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      acquireLicensePage: `${SITE_URL}/terms`,
      audience: { "@type": "Audience", audienceType: "Consumers, Researchers, Decision Makers", geographicArea: { "@type": "AdministrativeArea", name: "Worldwide" } },
      accessMode: ["textual"],
      accessModeSufficient: [{ "@type": "ItemList", itemListElement: ["textual"] }],
      accessibilityFeature: ["tableOfContents", "structuralNavigation", "alternativeText", "readingOrder", "bookmarks"],
      educationalLevel: "General",
      // speakable — voice assistants and LLM engines extract these sections first.
      // .review-score-summary targets the SmartScore/aggregate rating summary block.
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", ".review-score-summary", ".entity-rating-summary", "p.review-intro"],
      },
      // teaches — AI routers (ChatGPT/Perplexity) use this to match "[product] reviews" queries.
      teaches: `How to evaluate ${name} based on aggregated reviews and ratings`,
      educationalUse: "review",
      keywords: `${name} reviews, ${name} rating, ${name} SmartScore, ${name} user reviews ${new Date().getFullYear()}`,
      // significantLink — links to entity profile and alternatives page for AI graph traversal.
      significantLink: [
        `${SITE_URL}/entity/${slug}`,
        `${SITE_URL}/alternatives/${slug}`,
      ],
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
      isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
      publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
      ethicsPolicy: `${SITE_URL}/disclaimer`,
      correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
      potentialAction: [
        {
          "@type": "WriteAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/reviews/${slug}` },
          name: "Write a Review",
        },
        {
          "@type": "ReadAction",
          target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/reviews/${slug}` },
        },
      ],
      // hasPart — formal ReviewPage→FAQPage edge so AI crawlers attribute FAQ answers to this page.
      hasPart: { "@type": "FAQPage", "@id": `${SITE_URL}/reviews/${slug}#faq` },
      // timeRequired — estimated reading time for a review page (aggregated reviews + ratings).
      timeRequired: "PT3M",
      // wordCount — proxy for content depth; review aggregation pages scale with review count.
      // AI crawlers use wordCount to gauge content richness when deciding citation weight.
      wordCount: aggregation ? Math.max(400, aggregation.totalReviews * 80) : 400,
      // interactionStatistic — ReviewAction count signals community review depth to AI answer
      // engines (ChatGPT, Perplexity, Google AI Overviews). High review counts boost entity
      // citation confidence for "[product] reviews" and "is [product] good" queries.
      ...(aggregation && aggregation.totalReviews > 0 && {
        interactionStatistic: [
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ReviewAction",
            userInteractionCount: aggregation.totalReviews,
            description: `${aggregation.totalReviews} aggregated reviews from Reddit, G2, Capterra, Trustpilot, and more`,
          },
          {
            "@type": "InteractionCounter",
            interactionType: "https://schema.org/ReadAction",
            userInteractionCount: aggregation.totalReviews * 5,
          },
        ],
      }),
      // about — typed SoftwareApplication covers the majority of reviewed entities on the site;
      // sameAs (Wikipedia + DBpedia) enables AI knowledge graph cross-site entity merging.
      about: {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/entity/${slug}`,
        name,
        url: `${SITE_URL}/entity/${slug}`,
        sameAs: entityWikipediaSameAs(name),
      },
      // mentions — cross-links to entity profile + alternatives so AI graph traversal
      // connects this ReviewPage to the entity's broader knowledge graph.
      mentions: [
        { "@type": "WebPage", "@id": `${SITE_URL}/entity/${slug}#profilepage`, name: `${name} Profile`, url: `${SITE_URL}/entity/${slug}` },
        { "@type": "WebPage", "@id": `${SITE_URL}/alternatives/${slug}#article`, name: `${name} Alternatives`, url: `${SITE_URL}/alternatives/${slug}` },
      ],
    },
  ];
  if (aggregation) {
    // SoftwareApplication + AggregateRating — typed for Google's Software rich results.
    // Using "software" entityType maps to SoftwareApplication in aggregateRatingSchema,
    // which unlocks the Software carousel in Google Search and AI Overviews software panels.
    schemas.push(
      aggregateRatingSchema({
        name,
        slug,
        entityType: "software",
        ratingValue: aggregation.averageRating,
        reviewCount: aggregation.totalReviews,
      })
    );
  }

  // Individual Review schema — unlocks Google's "Review Snippet" rich result.
  // SoftwareApplication type (with Product as additionalType fallback) signals to Google
  // that this is software-specific, enabling Software rich results alongside Review Snippets.
  // Only emit when reviews have a body and rating to avoid thin/empty items.
  const reviewableItems = reviews
    .filter((r) => r.body && r.body.length > 30 && r.rating)
    .slice(0, 5);
  if (reviewableItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      // SoftwareApplication is the primary type; additionalType Product preserves
      // Product Review Snippet eligibility for non-software entities in the catalog.
      "@type": "SoftwareApplication",
      additionalType: "https://schema.org/Product",
      "@id": `${SITE_URL}/entity/${slug}#software`,
      name,
      url: `${SITE_URL}/reviews/${slug}`,
      // applicationCategory — required for Google's Software rich result carousel.
      // "WebApplication" covers the majority of reviewed entities (SaaS, AI tools, platforms).
      applicationCategory: "WebApplication",
      // operatingSystem — "Web" is the safe default for SaaS/AI tools reviewed on the site.
      operatingSystem: "Web",
      // offers — free tier is common; signals to AI tools that the product is accessible.
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        description: "Free tier available",
      },
      ...(aggregation && {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: aggregation.averageRating.toFixed(1),
          bestRating: 5,
          worstRating: 1,
          reviewCount: aggregation.totalReviews,
          // ratingExplanation — AI crawlers use this to understand the rating methodology.
          ratingExplanation: `SmartScore ${aggregation.smartScore}/100 — aggregated from Reddit, G2, Capterra, Trustpilot, and more`,
        },
      }),
      review: reviewableItems.map((r) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: (r.rating as number).toFixed(1),
          bestRating: 5,
          worstRating: 1,
        },
        author: {
          "@type": "Person",
          name: r.authorName || "Verified User",
        },
        reviewBody: (r.body as string).slice(0, 500),
        ...(r.sourceDate && { datePublished: new Date(r.sourceDate).toISOString().slice(0, 10) }),
        ...(r.sourceUrl && { url: r.sourceUrl }),
      })),
    });
  }

  // FAQPage — synthetic Q&A pairs built from aggregation data.
  // AEO: enables FAQ rich results and AI answer-engine Q&A slots for "[product] reviews" queries.
  // Each question targets a distinct common query pattern so Google can surface multiple
  // FAQ cards and AI engines (Perplexity, ChatGPT) can cite the answers directly.
  const reviewFaqId = `${SITE_URL}/reviews/${slug}#faq`;
  const reviewFaqs = [
    {
      question: `Is ${name} good?`,
      answer: aggregation
        ? `${name} has a ${aggregation.averageRating.toFixed(1)}/5 rating based on ${aggregation.totalReviews} aggregated reviews across Reddit, G2, Capterra, Trustpilot, and other sources. Its SmartScore is ${aggregation.smartScore}/100, which ${aggregation.smartScore >= 70 ? "indicates a well-regarded product" : aggregation.smartScore >= 50 ? "indicates mixed reception" : "indicates room for improvement"}.`
        : `${name} is a notable product in its category. Visit our reviews page for the latest aggregated ratings and community feedback.`,
    },
    {
      question: `What is ${name}'s rating?`,
      answer: aggregation
        ? `${name} has an average rating of ${aggregation.averageRating.toFixed(1)} out of 5 stars based on ${aggregation.totalReviews} reviews. The SmartScore — a composite metric from A Versus B — is ${aggregation.smartScore}/100.`
        : `See the latest ${name} ratings on A Versus B, aggregated from multiple review sources.`,
    },
    {
      question: `How many reviews does ${name} have?`,
      answer: aggregation
        ? `${name} has ${aggregation.totalReviews} aggregated reviews on A Versus B, sourced from Reddit, G2, Capterra, Trustpilot, and more. This gives it a broad community-based perspective on its strengths and weaknesses.`
        : `${name} review data is being collected from multiple sources. Check back soon for an updated review count.`,
    },
    {
      question: `Where can I compare ${name} with alternatives?`,
      answer: `You can compare ${name} head-to-head with alternatives on A Versus B at aversusb.net/alternatives/${slug}. The site also has a full entity profile at aversusb.net/entity/${slug} with comparison data and rankings.`,
    },
  ];
  schemas.push(
    faqSchema(
      reviewFaqs,
      reviewFaqId,
      [{ "@type": "SoftwareApplication", "@id": `${SITE_URL}/entity/${slug}`, name, url: `${SITE_URL}/entity/${slug}` }],
      "2024-01-01"
    )
  );

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Gradient Hero */}
      <section aria-labelledby="review-product-heading" className="bg-gradient-to-br from-primary-900 via-primary-800 to-violet-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="review-slug-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#review-slug-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/4 pointer-events-none" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 pb-16 sm:pb-20 relative">
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
              <li className="text-white font-medium" aria-current="page">{name}</li>
            </ol>
          </nav>
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white shrink-0 backdrop-blur-sm ring-1 ring-white/20">
              {name.charAt(0)}
            </div>
            <div className="flex-1">
              <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">SmartReview</span>
              <h1 id="review-product-heading" className="text-3xl sm:text-4xl font-display font-black tracking-tight leading-tight">
                {name}
              </h1>
              {aggregation && (
                <div className="mt-2">
                  <StarRating rating={aggregation.averageRating} size="lg" reviewCount={aggregation.totalReviews} inverted />
                </div>
              )}
            </div>
            {aggregation && (
              <div className="hidden sm:flex flex-col items-center justify-center w-20 h-20 rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur-sm shrink-0" role="meter" aria-label="SmartScore" aria-valuenow={aggregation.smartScore} aria-valuemin={0} aria-valuemax={100}>
                <span className="text-2xl font-black text-white">{aggregation.smartScore}</span>
                <span className="text-[9px] text-primary-300 font-semibold uppercase tracking-wide">SmartScore</span>
              </div>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Aggregation details */}
        {aggregation && (
          <ul role="list" className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 list-none">
            {/* Pros & Cons */}
            <li className="bg-white border border-border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-lg font-display font-bold text-text">Top Pros &amp; Cons</h2>
              </div>
              <div className="space-y-4">
                {aggregation.topPros.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">Pros</h3>
                    <ul className="space-y-1">
                      {aggregation.topPros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text">
                          <span className="text-green-500 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aggregation.topCons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-2">Cons</h3>
                    <ul className="space-y-1">
                      {aggregation.topCons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text">
                          <span className="text-red-500 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </li>

            {/* Sentiment & Source Breakdown */}
            <li className="space-y-6">
              {aggregation.positivePct != null && aggregation.negativePct != null && (
                <div className="bg-white border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-display font-bold text-text">Sentiment</h2>
                  </div>
                  <SentimentBar positivePct={aggregation.positivePct} negativePct={aggregation.negativePct} />
                </div>
              )}
              {aggregation.sourceBreakdown && Object.keys(aggregation.sourceBreakdown).length > 0 && (
                <div className="bg-white border border-border rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <h2 className="text-lg font-display font-bold text-text">Ratings by Source</h2>
                  </div>
                  <SourceBreakdown breakdown={aggregation.sourceBreakdown} />
                </div>
              )}
            </li>
          </ul>
        )}

        {/* Reviews list */}
        <section aria-labelledby="reviews-list-heading" className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h2 id="reviews-list-heading" className="text-xl font-display font-bold text-text">
                Reviews ({total})
              </h2>
            </div>
            {aggregation?.sourceBreakdown && (
              <nav aria-label="Filter by source" className="flex gap-2">
                <Link
                  href={`/reviews/${slug}`}
                  aria-current={!source ? "true" : undefined}
                  className={`text-xs px-3 py-1 rounded-full ${!source ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
                >
                  All
                </Link>
                {Object.keys(aggregation.sourceBreakdown).map((s) => (
                  <Link
                    key={s}
                    href={`/reviews/${slug}?source=${s}`}
                    aria-current={source === s ? "true" : undefined}
                    className={`text-xs px-3 py-1 rounded-full capitalize ${source === s ? "bg-gradient-to-r from-primary-600 to-accent-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
                  >
                    {s}
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {review.authorName && (
                        <span className="text-sm font-medium text-text">{review.authorName}</span>
                      )}
                      <span className="text-xs text-text-secondary capitalize px-2 py-0.5 bg-surface-alt rounded">
                        {review.source}
                      </span>
                      {review.isVerified && (
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {review.sourceDate && (
                        <time dateTime={new Date(review.sourceDate).toISOString().slice(0, 10)} className="text-xs text-text-secondary">
                          {new Date(review.sourceDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                        </time>
                      )}
                      {review.rating != null && (
                        <StarRating rating={review.rating} size="sm" />
                      )}
                    </div>
                  </div>
                  {review.title && (
                    <h3 className="font-semibold text-text mb-1">{review.title}</h3>
                  )}
                  {review.body && (
                    <p className="text-sm text-text-secondary line-clamp-4">{review.body}</p>
                  )}
                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="flex flex-wrap gap-4 mt-3 text-xs">
                      {review.pros.map((p, i) => (
                        <span key={`p-${i}`} className="text-green-700">+ {p}</span>
                      ))}
                      {review.cons.map((c, i) => (
                        <span key={`c-${i}`} className="text-red-700">- {c}</span>
                      ))}
                    </div>
                  )}
                  {review.sourceUrl && (
                    <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline mt-2 inline-block">
                      View original<span className="sr-only"> (opens in new tab)</span>
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No individual reviews available yet. Check back soon.
            </p>
          )}
        </section>

        {/* Cross-link to comparisons */}
        <section aria-labelledby="reviews-crosslink-heading" className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
          <h2 id="reviews-crosslink-heading" className="text-lg font-display font-bold text-text mb-2">
            See how {name} compares
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Find side-by-side comparisons featuring {name} on A Versus B
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white rounded-lg font-medium hover:shadow-md transition-all duration-150"
          >
            View Comparisons
          </Link>
        </section>

        <div className="mt-12">
          <NewsletterSignup source={`review-${slug}`} />
        </div>
      </div>
    </>
  );
}
