
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getAlternativesForEntity } from "@/lib/services/comparison-service";
import { breadcrumbSchema, entityWikipediaSameAs } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { ENTITY_CONTENT } from "@/lib/data/entity-content";
import { humanizeEntityName } from "@/lib/utils/humanize";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = humanizeEntityName(slug);
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Alternatives to ${name}`)}&type=alternatives`;
  const content = ENTITY_CONTENT[slug];
  const altNames = content?.alternatives.slice(0, 3).map((a) => a.name).join(", ");
  const metaDesc = altNames
    ? `Best alternatives to ${name} in 2026: ${altNames}, and more. Compare side-by-side and find the right option for you.`
    : `Discover the best alternatives to ${name}. Compare ${name} against top competitors and find the best option for you.`;
  return {
    title: `Alternatives to ${name}`,
    description: metaDesc,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
    },
    alternates: {
      canonical: `${SITE_URL}/alternatives/${slug}`,
      languages: {
        "en": `${SITE_URL}/alternatives/${slug}`,
        "x-default": `${SITE_URL}/alternatives/${slug}`,
      },
      types: {
        "application/rss+xml": `${SITE_URL}/feed`,
        "application/atom+xml": `${SITE_URL}/feed/atom`,
        "application/json+oembed": `${SITE_URL}/api/oembed?url=${encodeURIComponent(`${SITE_URL}/alternatives/${slug}`)}&format=json`,
        "application/json": `${SITE_URL}/api/v1/entities/${slug}`,
      },
    },
    openGraph: {
      title: `Alternatives to ${name}`,
      description: `Compare ${name} against top competitors and find the best option.`,
      url: `${SITE_URL}/alternatives/${slug}`,
      type: "article",
      siteName: SITE_NAME,
      locale: "en_US",
      publishedTime: "2024-01-01T00:00:00Z",
      modifiedTime: new Date().toISOString(),
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Alternatives to ${name} — comparison guide` }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title: `Alternatives to ${name}`,
      description: `Compare ${name} against top competitors.`,
      images: [ogImage],
    },
    other: {
      "citation_title": `Best Alternatives to ${name} in 2026`,
      "citation_author": "A Versus B",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": metaDesc,
      "abstract": metaDesc,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": new Date().toISOString().slice(0, 10),
      "DC.title": `Best Alternatives to ${name} in 2026`,
      "DC.creator": "A Versus B",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/alternatives/${slug}`,
      "thumbnail": ogImage,
    },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const name = humanizeEntityName(slug);

  // Find all comparisons that include this entity (DB + mock)
  const alternatives = await getAlternativesForEntity(slug);

  // Merge curated alternatives (from entity-content) with comparison-derived ones
  const entityContent = ENTITY_CONTENT[slug];
  if (entityContent) {
    const existingSlugs = new Set(alternatives.map((a) => a.slug));
    for (const curated of entityContent.alternatives) {
      if (!existingSlugs.has(curated.slug)) {
        alternatives.push({
          name: curated.name,
          slug: curated.slug,
          comparisonSlug: `${slug}-vs-${curated.slug}`,
          comparisonTitle: `${name} vs ${curated.name}`,
        });
        existingSlugs.add(curated.slug);
      }
    }
  }

  const breadcrumbs = [
    { name: "Home", url: SITE_URL },
    { name, url: `${SITE_URL}/entity/${slug}` },
    { name: "Alternatives", url: `${SITE_URL}/alternatives/${slug}` },
  ];

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${SITE_URL}/alternatives/${slug}#list`,
    name: `Alternatives to ${name}`,
    description: `Top alternatives to ${name} — each alternative has a full side-by-side comparison with verdict, attribute data, and FAQs on A Versus B.`,
    numberOfItems: alternatives.length,
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    itemListElement: alternatives.slice(0, 10).map((alt, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: alt.name,
      url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
      item: {
        "@type": "Article",
        "@id": `${SITE_URL}/compare/${alt.comparisonSlug}#article`,
        url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
        name: `${name} vs ${alt.name}`,
        isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
      },
    })),
  };

  const today = new Date().toISOString().slice(0, 10);
  const altPageUrl = `${SITE_URL}/alternatives/${slug}`;
  const altOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Alternatives to ${name}`)}&type=alternatives`;
  const alternativesArticleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle"],
    "@id": `${altPageUrl}#article`,
    headline: `Alternatives to ${name}`,
    description: `${alternatives.length} alternatives to ${name} — compare side-by-side and find the best option for 2026.`,
    abstract: `${alternatives.length} alternatives to ${name} — compare side-by-side and find the best option for 2026.`,
    url: altPageUrl,
    inLanguage: "en-US",
    locationCreated: { "@type": "Country", name: "United States" },
    genre: "Alternatives Guide",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    dateModified: today,
    lastReviewed: today,
    contentReferenceTime: today,
    thumbnailUrl: altOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${altPageUrl}#primaryImage`,
      url: altOgImage,
      contentUrl: altOgImage,
      width: 1200,
      height: 630,
      caption: `Alternatives to ${name} — comparison guide`,
    },
    keywords: `${name} alternatives, ${name} competitors, best ${name} alternatives ${new Date().getFullYear()}`,
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    mainEntityOfPage: { "@type": "WebPage", "@id": altPageUrl },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1"],
    },
    alternativeHeadline: `Best ${name} Alternatives in ${new Date().getFullYear()}`,
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
    // teaches + educationalUse — maps this guide to the decision skill it develops
    // for LLM educational classifiers (Perplexity, ChatGPT "which is better" queries).
    teaches: `How to find the best alternatives to ${name}`,
    educationalUse: "comparison",
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: [
      { "@type": "ReadAction", target: altPageUrl },
      { "@type": "SearchAction", target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}+alternatives` }, "query-input": "required name=search_term_string" },
    ],
    // significantLink — entity ProfilePage and top comparison pages for AI graph traversal.
    significantLink: [
      `${SITE_URL}/entity/${slug}`,
      ...alternatives.slice(0, 5).map((alt) => `${SITE_URL}/compare/${alt.comparisonSlug}`),
    ],
    // @id on about matches ProfilePage mainEntity @id for cross-document graph merging.
    about: {
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${slug}`,
      name,
      url: `${SITE_URL}/entity/${slug}`,
    },
    // @id on each mentions entry matches ProfilePage mainEntity for knowledge graph cohesion.
    // sameAs Wikipedia+DBpedia strengthens entity merging in AI Knowledge Graphs.
    mentions: alternatives.slice(0, 10).map((alt) => ({
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${alt.slug}`,
      name: alt.name,
      url: `${SITE_URL}/entity/${alt.slug}`,
      sameAs: entityWikipediaSameAs(alt.name),
    })),
    timeRequired: "PT4M",
    wordCount: 800,
    datePublished: today,
    copyrightYear: new Date().getFullYear(),
    // discussionUrl — Reddit search for community discussions on alternatives to this entity.
    // Google E-E-A-T evaluators and AI crawlers use discussionUrl as an engagement signal.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(name + " alternatives")}+OR+${encodeURIComponent(name + " competitors")}&type=link&sort=relevance`,
    // hasPart[] — ItemList is a formal structural part of this Article/CollectionPage.
    hasPart: [{ "@type": "ItemList", "@id": `${SITE_URL}/alternatives/${slug}#list`, name: `Alternatives to ${name}` }],
  };

  return (
    <>
      <link rel="up" href={`${SITE_URL}/entity/${slug}`} title={`${name} profile`} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(alternativesArticleSchema) }}
      />
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Breadcrumbs */}
      <nav className="mb-6">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
          <li>/</li>
          <li><Link href={`/entity/${slug}`} className="hover:text-primary-600">{name}</Link></li>
          <li>/</li>
          <li className="text-text font-medium">Alternatives</li>
        </ol>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-display font-black text-text mb-2">
        Alternatives to {name}
      </h1>
      <p className="text-text-secondary mb-4">
        {alternatives.length} alternative{alternatives.length !== 1 ? "s" : ""} found
      </p>

      {/* Entity hub link */}
      <div className="mb-6 p-5 bg-primary-50 border border-primary-200 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p className="text-sm text-text-secondary leading-relaxed">
            {entityContent
              ? `${entityContent.description.split(". ").slice(0, 2).join(". ")}.`
              : `Looking for alternatives to ${name}? Compare the top competitors below.`}
          </p>
        </div>
        <Link
          href={`/entity/${slug}`}
          className="flex-shrink-0 px-4 py-2 bg-white text-primary-700 text-sm font-semibold rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors"
        >
          About {name} &rarr;
        </Link>
      </div>

      {alternatives.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {alternatives.map((alt) => (
            <div key={alt.comparisonSlug} className="bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-white font-bold text-lg">{alt.name.charAt(0)}</span>
                </div>
                <div>
                  <h3 className="font-bold text-text">{alt.name}</h3>
                  <p className="text-xs text-text-secondary">
                    {entityContent?.alternatives.find((a) => a.slug === alt.slug)?.reason || `Alternative to ${name}`}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/compare/${alt.comparisonSlug}`}
                  className="flex-1 text-center py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg hover:shadow-md transition-all duration-150"
                >
                  Compare
                </Link>
                <Link
                  href={`/entity/${alt.slug}`}
                  className="flex-1 text-center py-2 bg-surface-alt text-text text-sm font-semibold rounded-lg hover:bg-primary-50 transition-colors border border-border"
                >
                  Learn more
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-surface-alt rounded-xl">
          <p className="text-text-secondary mb-4">No alternatives found for {name} yet.</p>
          <Link
            href="/#search"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg hover:shadow-md transition-all duration-150"
          >
            Search for a comparison
          </Link>
        </div>
      )}

      {/* Related Alternatives — cross-link to alternatives pages for each alternative entity */}
      {alternatives.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-text mb-4">Related Alternatives</h2>
          <p className="text-sm text-text-secondary mb-4">
            Explore alternatives pages for entities compared with {name}.
          </p>
          <div className="flex flex-wrap gap-2">
            {alternatives.slice(0, 12).map((alt) => (
              <Link
                key={`related-alt-${alt.slug}`}
                href={`/alternatives/${alt.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-border rounded-full text-sm text-primary-600 hover:border-primary-300 hover:bg-primary-50 transition-all"
              >
                <span className="w-5 h-5 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-sm">
                  {alt.name.charAt(0)}
                </span>
                Alternatives to {alt.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Signup */}
      <div className="mt-12">
        <NewsletterSignup source="alternatives" referrerSlug={slug} />
      </div>
    </div>
    </>
  );
}
