import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { breadcrumbSchema, faqSchema, entitySchemaType } from "@/lib/seo/schema";
import type { ComparisonPageData } from "@/types";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 3600;
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(HUB_CONFIG).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const hub = HUB_CONFIG[slug];
  if (!hub) return { title: "Not Found" };

  const canonicalUrl = `${SITE_URL}/hub/${hub.slug}`;
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(hub.h1)}&type=hub`;
  return {
    title: hub.title,
    description: hub.description,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const , "max-video-preview": -1 },
    },
    alternates: {
      canonical: canonicalUrl,
      languages: { "en": canonicalUrl, "x-default": canonicalUrl },
    },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url: canonicalUrl,
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${hub.h1} — A Versus B comparison hub` }],
    },
    twitter: {
      card: "summary_large_image",
    site: "@aversusb",
      title: hub.title,
      description: hub.description,
      images: [ogImage],
    },
    other: {
      "citation_title": hub.title,
      "citation_author": "A Versus B",
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": hub.description,
      "abstract": hub.description,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": new Date().toISOString().slice(0, 10),
      "DC.title": hub.title,
      "DC.creator": "A Versus B",
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `${hub.h1}, Comparison Hub`,
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": canonicalUrl,
      "thumbnail": ogImage,
      "twitter:label1": "Content Type",
      "twitter:data1": "Topic Hub",
      "twitter:label2": "Platform",
      "twitter:data2": "A Versus B",
    },
  };
}

function hubSchemas(hub: (typeof HUB_CONFIG)[string], spokes: ComparisonPageData[]) {
  const hubUrl = `${SITE_URL}/hub/${hub.slug}`;

  const breadcrumbs = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Hubs", url: `${SITE_URL}/hub` },
    { name: hub.h1, url: hubUrl },
  ]);

  const hubOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(hub.h1)}&type=hub`;
  const hubToday = new Date().toISOString().slice(0, 10);
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${hubUrl}#collectionpage`,
    name: hub.h1,
    description: hub.description,
    abstract: hub.description,
    url: hubUrl,
    inLanguage: "en-US",
    locationCreated: { "@type": "Country", name: "United States" },
    genre: "Topic Hub",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    conditionsOfAccess: "Free",
    interactivityType: "expositive",
    lastReviewed: hubToday,
    contentReferenceTime: hubToday,
    thumbnailUrl: hubOgImage,
    image: {
      "@type": "ImageObject",
      "@id": `${hubUrl}#primaryImage`,
      url: hubOgImage,
      contentUrl: hubOgImage,
      width: 1200,
      height: 630,
      caption: `${hub.h1} — Topic Hub on A Versus B`,
    },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    potentialAction: [
      { "@type": "ReadAction", target: hubUrl },
      {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    ],
    mentions: spokes.slice(0, 10).map((s) => ({
      "@type": "Article",
      "@id": `${SITE_URL}/compare/${s.slug}#article`,
      headline: s.title,
      url: `${SITE_URL}/compare/${s.slug}`,
    })),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "#page-intro", "#top-comparisons", ".hub-description"],
    },
    alternativeHeadline: `${hub.h1} — Expert Comparisons & Analysis`,
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
    teaches: `How to compare and choose between ${hub.h1.toLowerCase().replace(/^[^:]+:\s*/, "")}`,
    educationalUse: "comparison",
    keywords: `${hub.h1.toLowerCase()} comparison, ${hub.slug.replace(/-/g, " ")} vs, best ${hub.slug.replace(/-/g, " ")}`,
    // about[] — typed entity references extracted from hub spokes; creates direct
    // hub→entity ProfilePage edges in AI knowledge graphs so crawlers can traverse
    // from topic hub to entity profiles without requiring spoke-level page visits.
    about: spokes
      .flatMap((s) => s.entities.map((e) => ({
        "@type": entitySchemaType(e.entityType),
        "@id": `${SITE_URL}/entity/${e.slug}`,
        name: e.name,
        url: `${SITE_URL}/entity/${e.slug}`,
        ...(e.shortDesc && { description: e.shortDesc }),
      })))
      .filter((v, i, arr) => arr.findIndex((x) => x["@id"] === v["@id"]) === i)
      .slice(0, 15),
    // significantLink — top comparison pages + entity ProfilePages for AI graph traversal.
    significantLink: [
      ...spokes.slice(0, 6).map((s) => `${SITE_URL}/compare/${s.slug}`),
      ...spokes.slice(0, 3).flatMap((s) => s.entities.map((e) => `${SITE_URL}/entity/${e.slug}`)),
    ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 15),
    mainEntity: {
      "@type": "ItemList",
      name: `${hub.h1} Comparisons`,
      numberOfItems: spokes.length,
      itemListElement: spokes.map((s, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: s.title,
        url: `${SITE_URL}/compare/${s.slug}`,
      })),
    },
    publishingPrinciples: `${SITE_URL}/how-we-write-verdicts`,
    ethicsPolicy: `${SITE_URL}/disclaimer`,
    correctionsPolicy: `${SITE_URL}/how-we-write-verdicts`,
    timeRequired: "PT3M",
    wordCount: 600,
    datePublished: hubToday,
    dateModified: hubToday,
    copyrightYear: new Date().getFullYear(),
    // discussionUrl — Reddit search for community discussions on this hub topic.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(hub.h1.replace(/^[^:]+:\s*/, ""))}+comparison&type=link&sort=relevance`,
    // hasPart[] — structural sub-documents: ItemList, FAQPage, DefinedTermSet.
    // AI crawlers follow hasPart edges to resolve sub-schemas without re-crawling the full page.
    hasPart: [
      { "@type": "ItemList", name: `${hub.h1} Comparisons`, url: hubUrl },
      ...(hub.faqs.length > 0 ? [{ "@type": "FAQPage", "@id": `${hubUrl}#faq` }] : []),
      { "@type": "DefinedTermSet", "@id": `${hubUrl}#terms`, name: `${hub.h1} Key Terms` },
    ],
  };

  const faqs = faqSchema(hub.faqs.map((f) => ({ question: f.q, answer: f.a })));

  // DefinedTermSet — signals this hub is a topical glossary/directory for the domain.
  // AI models (ChatGPT, Perplexity) use DefinedTerm nodes for entity disambiguation
  // when building knowledge graphs from crawled content.
  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${hubUrl}#terms`,
    name: `${hub.h1} Key Terms`,
    description: `Glossary of key terms and entities covered in the ${hub.h1} comparison hub.`,
    url: hubUrl,
    // Each compared product/service in the hub is a DefinedTerm so AI crawlers
    // can resolve the hub's subject matter to named entities in their knowledge graphs.
    hasDefinedTerm: spokes.slice(0, 10).flatMap((s) =>
      s.entities.map((e) => ({
        "@type": "DefinedTerm",
        name: e.name,
        url: `${SITE_URL}/entity/${e.slug}`,
        ...(e.shortDesc && { description: e.shortDesc }),
        inDefinedTermSet: { "@id": `${hubUrl}#terms` },
      }))
    ).filter((v, i, arr) => arr.findIndex((x) => x.name === v.name) === i).slice(0, 20),
  };

  return [breadcrumbs, collection, faqs, definedTermSet];
}

export default async function HubPage({ params }: PageProps) {
  const { slug } = await params;
  const hub = HUB_CONFIG[slug];
  if (!hub) notFound();

  // Fetch spoke comparisons, soft-failing missing slugs
  const spokeResults = await Promise.allSettled(
    hub.comparisonSlugs.map((s) => getComparisonBySlug(s))
  );
  const spokes = spokeResults
    .map((r) => (r.status === "fulfilled" ? r.value : null))
    .filter((c): c is ComparisonPageData => c !== null);

  const schemas = hubSchemas(hub, spokes);

  return (
    <>
      {hub.categoryAnchor && (
        <link rel="up" href={`${SITE_URL}/category/${hub.categoryAnchor}`} title={`${hub.h1} category`} />
      )}
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Hub Hero */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav aria-label="breadcrumb" className="text-sm text-primary-200 mb-5">
            <ol className="flex items-center gap-2 flex-wrap">
              <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
              <li aria-hidden="true" className="text-primary-400">/</li>
              <li className="text-white font-medium">{hub.h1}</li>
            </ol>
          </nav>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-3">{hub.h1}</h1>
          <p id="page-intro" className="text-primary-200 text-sm sm:text-base max-w-2xl">{hub.intro}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
        {/* Spoke comparison cards */}
        <section aria-labelledby="comparisons-heading" className="mb-12">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </div>
            <h2 id="comparisons-heading" className="text-xl font-display font-bold text-text">Featured Comparisons</h2>
          </div>
          {spokes.length === 0 ? (
            <p className="text-text-secondary">Comparisons are being generated. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hub.comparisonSlugs.map((compSlug) => {
                const comp = spokes.find((s) => s.slug === compSlug);
                if (!comp) return null;
                const parts = comp.title.split(/\s+vs\.?\s+/i);
                return (
                  <Link
                    key={compSlug}
                    href={`/compare/${comp.slug}`}
                    className="flex items-start gap-4 p-5 rounded-xl border border-border hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 bg-white group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
                    <div className="flex -space-x-2 flex-shrink-0 mt-0.5">
                      <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                        {(parts[0] || "A").charAt(0)}
                      </div>
                      <div className="w-9 h-9 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-white shadow-sm">
                        {(parts[1] || "B").charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-text group-hover:text-primary-700 mb-1 leading-snug transition-colors">
                        {comp.title}
                      </h3>
                      {comp.shortAnswer && (
                        <p className="text-sm text-text-secondary line-clamp-2">{comp.shortAnswer}</p>
                      )}
                      <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary-600 group-hover:text-primary-700 transition-colors">
                        Compare
                        <svg className="w-3 h-3 group-hover:translate-x-0.5 transition-transform duration-150" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* FAQ section */}
        <section aria-labelledby="faq-heading" className="mb-8">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 id="faq-heading" className="text-xl font-display font-bold text-text">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-5">
            {hub.faqs.map((faq, i) => (
              <div key={i} className="border-b border-border pb-5 last:border-0">
                <h3 className="font-semibold text-text mb-2">{faq.q}</h3>
                <p className="text-text-secondary leading-relaxed text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category back-link */}
        {hub.categoryAnchor && (
          <div className="mt-8 pt-6 border-t border-border">
            <Link
              href={`/category/${hub.categoryAnchor}`}
              className="text-primary-600 hover:text-primary-700 hover:underline text-sm font-medium transition-colors"
            >
              ← Browse all {hub.h1.replace(" Hub (2026)", "").replace(" Comparison", "")} comparisons
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
