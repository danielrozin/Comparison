
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getAlternativesForEntity, resolveCanonicalComparisonSlugs } from "@/lib/services/comparison-service";
import { breadcrumbSchema, contentAuthorArray, entityWikipediaSameAs, webPageSchema, teachesDefinedTerm } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { ENTITY_CONTENT } from "@/lib/data/entity-content";
import { humanizeEntityName } from "@/lib/utils/humanize";
import { getPrisma } from "@/lib/db/prisma";
import { isEntityPageIndexable, resolveEntityPageStatuses } from "@/lib/seo/entity-page-indexable";
import { GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG } from "@/lib/data/google-maps-alternatives-blog";
import {
  buildAlternativesList,
  alternativesTitle,
  alternativesDescription,
  type AlternativeRow,
} from "@/lib/seo/alternatives-list";

/** In-repo guides linked from an alternatives page (ROO-183). */
const ALTERNATIVES_GUIDES: Record<string, { href: string; label: string; blurb: string }> = {
  "google-maps": {
    href: `/blog/${GOOGLE_MAPS_ALTERNATIVES_BLOG_SLUG}`,
    label: "Google Maps alternatives that don't use Google",
    blurb: "Organic Maps, CoMaps, OsmAnd, Magic Earth, and HERE WeGo on offline maps, privacy, and public transport. Waze is owned by Google.",
  },
};

export const revalidate = 3600;
export const dynamicParams = true;

export async function generateStaticParams() {
  const staticSlugs = Object.keys(ENTITY_CONTENT).map((slug) => ({ slug }));
  try {
    const prisma = getPrisma();
    if (!prisma) return staticSlugs;
    const entities = await prisma.entity.findMany({
      select: { slug: true },
      orderBy: { id: "asc" },
      take: 500,
    });
    const dbSlugs = entities.map((e) => ({ slug: e.slug }));
    const seen = new Set(staticSlugs.map((s) => s.slug));
    const extra = dbSlugs.filter((d) => !seen.has(d.slug));
    return [...staticSlugs, ...extra];
  } catch {
    return staticSlugs;
  }
}

/**
 * Is this a real alternatives slug? The DB entity status decides when the DB
 * answers; without a DB, curated ENTITY_CONTENT counts. "unknown" means
 * neither could answer.
 */
async function alternativesEntityStatus(slug: string): Promise<"published" | "missing" | "unknown"> {
  const curated = Boolean(ENTITY_CONTENT[slug]);
  try {
    const prisma = getPrisma();
    if (!prisma) return curated ? "published" : "unknown";
    const entityRow = await prisma.entity.findUnique({
      where: { slug },
      select: { status: true },
    });
    return entityRow?.status === "published" ? "published" : "missing";
  } catch {
    return curated ? "published" : "unknown";
  }
}

/**
 * One ranked, de-duplicated list shared by <title>, body, schema and FAQs.
 * Curated picks lead (editorial ranking) and keep their row even without a
 * live comparison; the Compare link only renders when the canonical page
 * exists (DAN-2551: never link crawlers at 404s).
 */
async function loadAlternatives(slug: string, name: string): Promise<AlternativeRow[]> {
  const compared = await getAlternativesForEntity(slug);
  const curated = ENTITY_CONTENT[slug]?.alternatives ?? [];
  let liveSlugs = new Set<string>();
  if (curated.length > 0) {
    liveSlugs = await resolveCanonicalComparisonSlugs(
      curated.flatMap((c) => [`${slug}-vs-${c.slug}`, `${c.slug}-vs-${slug}`]),
    );
  }
  const curatedWithLive = curated.map((c) => ({
    ...c,
    live: [`${slug}-vs-${c.slug}`, `${c.slug}-vs-${slug}`].find((cand) => liveSlugs.has(cand)) ?? null,
  }));
  const rows = buildAlternativesList(
    { slug, name },
    [
      ...compared.map((c) => ({ name: c.name, slug: c.slug, comparisonSlug: c.comparisonSlug })),
      ...curatedWithLive
        .filter((c) => c.live)
        .map((c) => ({ name: c.name, slug: c.slug, comparisonSlug: c.live as string })),
    ],
    curated,
  );
  return rows;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = humanizeEntityName(slug);
  // Unknown slugs 404 in the page below; keep them out of the index and do
  // not emit invented publish/modified dates for them.
  const status = await alternativesEntityStatus(slug);
  const rows = status === "missing" ? [] : await loadAlternatives(slug, name);
  if (status === "missing" || (status === "unknown" && rows.length === 0)) {
    return {
      title: `Alternatives to ${name}`,
      robots: { index: false, follow: false },
    };
  }
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Alternatives to ${name}`)}&type=alternatives`;
  const metaTitle = alternativesTitle(name, rows, new Date().getFullYear());
  const metaDesc = alternativesDescription(name, rows);
  return {
    title: metaTitle,
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
      title: metaTitle,
      description: metaDesc,
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
      title: metaTitle,
      description: metaDesc,
      images: [{ url: ogImage, alt: `Alternatives to ${name} — comparison guide` }],
    },
    other: {
      "citation_title": `Best Alternatives to ${name} in 2026`,
      "citation_author": SITE_NAME,
      "citation_journal_title": "A Versus B",
      "citation_language": "en",
      "citation_abstract": metaDesc,
      "abstract": metaDesc,
      "citation_publication_date": "2024-01-01",
      "citation_online_date": new Date().toISOString().slice(0, 10),
      "DC.title": `Best Alternatives to ${name} in 2026`,
      "DC.description": metaDesc,
      "DC.creator": SITE_NAME,
      "DC.publisher": "A Versus B",
      "DC.language": "en",
      "DC.subject": `Best ${name} Alternatives, ${name} Competitors`,
      "DC.rights": "https://creativecommons.org/licenses/by/4.0/",
      "DC.coverage": "Worldwide",
      "DC.type": "Text",
      "DC.format": "text/html",
      "DC.date": "2024-01-01",
      "DC.identifier": `${SITE_URL}/alternatives/${slug}`,
      "thumbnail": ogImage,
      "twitter:label1": "Content Type",
      "twitter:data1": "Alternatives Guide",
      "twitter:label2": "Platform",
      "twitter:data2": "A Versus B",
    },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const name = humanizeEntityName(slug);

  // DAN-2551: gate on entity status. Draft/archived entities are not canonical
  // pages — same reasoning as the /entity gate added in the same PR.
  const status = await alternativesEntityStatus(slug);
  if (status === "missing") notFound();

  const rows = await loadAlternatives(slug, name);

  // DB unavailable and nothing curated or comparison-backed: this is not a
  // real entity (e.g. /alternatives/zzz-not-a-thing). Return a real 404
  // instead of a 200 shell.
  if (status === "unknown" && rows.length === 0) notFound();
  const entityContent = ENTITY_CONTENT[slug];
  // Rows with a live comparison — the only ones schema/significantLink may cite.
  const alternatives = rows
    .filter((r): r is AlternativeRow & { comparisonSlug: string } => Boolean(r.comparisonSlug))
    .map((r) => ({ ...r, comparisonSlug: r.comparisonSlug, comparisonTitle: `${name} vs ${r.name}` }));

  // /entity/X and /alternatives/X both 404 unless X has a published entity
  // row. Many alternatives come from comparison titles with no such row, so
  // "Learn more" and the related chips linked to 404s. Link the live ones only.
  const altStatuses = await resolveEntityPageStatuses(rows.map((a) => a.slug));
  const altPageLive = (altSlug: string) => isEntityPageIndexable(altStatuses.get(altSlug));

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
    numberOfItems: rows.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: rows.map((alt, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: alt.name,
      ...(alt.comparisonSlug
        ? {
            url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
            item: {
              "@type": "Article",
              "@id": `${SITE_URL}/compare/${alt.comparisonSlug}#article`,
              url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
              name: `${name} vs ${alt.name}`,
              isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
            },
          }
        : {}),
    })),
  };

  const faqs: { q: string; a: string }[] =
    rows.length > 0
      ? [
          {
            q: `What are the best alternatives to ${name}?`,
            a: `Our top alternatives to ${name} are ${rows
              .slice(0, 5)
              .map((r) => r.name)
              .join(", ")}. The table above ranks each one and says who it suits best.`,
          },
          {
            q: `What is the closest alternative to ${name}?`,
            a: rows[0].reason
              ? `${rows[0].name}: ${rows[0].reason.replace(/\.$/, "")}.`
              : `${rows[0].name} is the alternative most often weighed against ${name}.`,
          },
          {
            q: `How do I choose between ${name} and its alternatives?`,
            a: `Decide what matters most to you (price, features, reliability or ecosystem), then open the side-by-side comparison for each shortlisted option to see the attribute data and our verdict.`,
          },
        ]
      : [];

  const today = new Date().toISOString().slice(0, 10);
  const altPageUrl = `${SITE_URL}/alternatives/${slug}`;
  const altOgImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Alternatives to ${name}`)}&type=alternatives`;
  const alternativesArticleSchema = {
    "@context": "https://schema.org",
    "@type": ["Article", "TechArticle"],
    // LearningResource — alternatives guides help users make informed software/product choices.
    // Signals Google Education carousel eligibility + AI educational intent routing.
    additionalType: ["https://schema.org/LearningResource", "https://schema.org/InDepthArticle"],
    learningResourceType: "Comparison Guide",
    "@id": `${altPageUrl}#article`,
    headline: `Alternatives to ${name}`,
    description: `${rows.length} alternatives to ${name} — compare side-by-side and find the best option for 2026.`,
    abstract: `${rows.length} alternatives to ${name} — compare side-by-side and find the best option for 2026.`,
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
    author: contentAuthorArray(),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL, logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` } },
    reviewedBy: [{ "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL }],
    mainEntityOfPage: { "@type": "WebPage", "@id": altPageUrl },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", "#alternatives-intro", ".faq-answer"],
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
    accessibilitySummary: "Structured comparison content with table of contents, heading navigation, alternative text for images, and logical reading order. All data tables include captions and row/column headers.",
    educationalLevel: "General",
    // teaches + educationalUse — maps this guide to the decision skill it develops
    // for LLM educational classifiers (Perplexity, ChatGPT "which is better" queries).
    teaches: teachesDefinedTerm(`How to find the best alternatives to ${name}`, altPageUrl),
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
    mentions: rows.map((alt) => ({
      "@type": "Thing",
      "@id": `${SITE_URL}/entity/${alt.slug}`,
      name: alt.name,
      url: `${SITE_URL}/entity/${alt.slug}`,
      sameAs: entityWikipediaSameAs(alt.name),
    })),
    timeRequired: "PT4M",
    wordCount: 800,
    // Stable baseline — alternatives pages have been live since 2024-01-01.
    // Using today as datePublished was wrong: it changed on every ISR revalidation,
    // making the page appear newly published on every crawl (confuses freshness signals).
    datePublished: "2024-01-01",
    dateCreated: "2024-01-01",
    copyrightYear: new Date().getFullYear(),
    // discussionUrl — Reddit search for community discussions on alternatives to this entity.
    // Google E-E-A-T evaluators and AI crawlers use discussionUrl as an engagement signal.
    discussionUrl: `https://www.reddit.com/search/?q=${encodeURIComponent(name + " alternatives")}+OR+${encodeURIComponent(name + " competitors")}&type=link&sort=relevance`,
    // citation — formal attribution chain from this alternatives guide to the comparison pages.
    // AI answer engines (ChatGPT, Perplexity) use citation to build knowledge graph edges from
    // alternatives guides to specific comparison pages, boosting authority when answering
    // "best alternatives to X" queries. Each citation links the comparison Article @id directly.
    citation: alternatives.slice(0, 8).map((alt) => ({
      "@type": "WebPage",
      "@id": `${SITE_URL}/compare/${alt.comparisonSlug}#webpage`,
      name: alt.comparisonTitle ?? `${name} vs ${alt.name}`,
      url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
      publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME },
    })),
    // hasPart[] — ItemList is a formal structural part of this Article/CollectionPage.
    hasPart: [{ "@type": "ItemList", "@id": `${SITE_URL}/alternatives/${slug}#list`, name: `Alternatives to ${name}` }],
  };

  return (
    <>
      <link rel="up" href={`${SITE_URL}/entity/${slug}`} title={`${name} profile`} />
      <link rel="cite-as" href={`${SITE_URL}/alternatives/${slug}`} />
      <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
      <meta httpEquiv="content-language" content="en" />
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(webPageSchema({
            title: `Alternatives to ${name}`,
            description: `${rows.length} alternatives to ${name} — compare side-by-side and find the best option for ${new Date().getFullYear()}.`,
            url: altPageUrl,
            dateModified: today,
            keywords: `${name} alternatives, ${name} competitors, best ${name} alternatives ${new Date().getFullYear()}`,
            mainEntity: { "@type": "Article", "@id": `${altPageUrl}#article` },
            speakableCssSelector: ["h1", "h2", "#alternatives-intro"],
          })),
        }}
      />
      {faqs.length > 0 && <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "@id": `${altPageUrl}#faqpage`,
            name: `Alternatives to ${name} — FAQ`,
            url: altPageUrl,
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />}
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-indigo-900 via-primary-800 to-primary-700 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="alternatives-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#alternatives-hero-grid)"/>
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-64 h-64 bg-accent-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-indigo-200 flex-wrap">
              <li>
                <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="sr-only sm:not-sr-only">Home</span>
                </Link>
              </li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-indigo-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li><Link href={`/entity/${slug}`} className="hover:text-white transition-colors">{name}</Link></li>
              <li aria-hidden="true"><svg className="w-3 h-3 text-indigo-400/60 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg></li>
              <li className="text-white font-medium" aria-current="page">Alternatives</li>
            </ol>
          </nav>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm ring-1 ring-white/20 shadow-xl">
              <span className="text-3xl sm:text-4xl font-bold text-white" aria-hidden="true">{name.charAt(0)}</span>
            </div>
            <div>
              <h1 id="alternatives-heading" className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight">
                Best {name} Alternatives ({new Date().getFullYear()})
              </h1>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-indigo-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h7a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  {rows.length} ranked alternative{rows.length !== 1 ? "s" : ""}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 border border-white/15 rounded-full text-xs font-semibold text-white backdrop-blur-sm">
                  <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Side-by-side comparison
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

    <section aria-labelledby="alternatives-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Entity intro card */}
      <div className="mb-8 p-5 bg-primary-50 border border-primary-200 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-xl font-bold text-white">{name.charAt(0)}</span>
        </div>
        <div className="flex-1">
          <p id="alternatives-intro" className="text-sm text-text-secondary leading-relaxed">
            {entityContent
              ? `${entityContent.description.split(". ").slice(0, 2).join(". ")}.`
              : `Looking for alternatives to ${name}? Compare the top competitors below.`}
          </p>
        </div>
        <Link
          href={`/entity/${slug}`}
          className="flex-shrink-0 px-4 py-2 bg-white text-primary-700 text-sm font-semibold rounded-lg border border-primary-300 hover:bg-primary-50 transition-colors"
        >
          About {name} <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="overflow-x-auto rounded-xl border border-border bg-white">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Ranked alternatives to {name}</caption>
            <thead className="bg-surface-alt text-xs uppercase tracking-wide text-text-secondary">
              <tr>
                <th scope="col" className="px-4 py-3 w-12">#</th>
                <th scope="col" className="px-4 py-3">Alternative</th>
                <th scope="col" className="px-4 py-3">Best for</th>
                <th scope="col" className="px-4 py-3 text-right"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((alt, idx) => (
                <tr key={alt.slug} className="border-t border-border align-top">
                  <td className="px-4 py-4 font-bold text-text-secondary">{idx + 1}</td>
                  <th scope="row" className="px-4 py-4 font-bold text-text">
                    {altPageLive(alt.slug) ? (
                      <Link href={`/entity/${alt.slug}`} className="hover:text-primary-700 hover:underline">{alt.name}</Link>
                    ) : (
                      alt.name
                    )}
                  </th>
                  <td className="px-4 py-4 text-text-secondary">{alt.reason || `Head-to-head rival to ${name}`}</td>
                  <td className="px-4 py-4 text-right whitespace-nowrap">
                    {alt.comparisonSlug && (
                      <Link
                        href={`/compare/${alt.comparisonSlug}`}
                        className="inline-flex min-h-[44px] items-center rounded-lg bg-gradient-to-r from-primary-600 to-accent-600 px-4 text-sm font-semibold text-white hover:from-primary-700 hover:to-accent-700"
                      >
                        {name} vs {alt.name}
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

      {ALTERNATIVES_GUIDES[slug] && (
        <div className="mt-10 rounded-lg border border-border bg-white p-5">
          <h2 className="text-xl font-bold text-text mb-2">Alternatives that don&apos;t use Google</h2>
          <p className="text-sm text-text-secondary mb-3">{ALTERNATIVES_GUIDES[slug].blurb}</p>
          <Link href={ALTERNATIVES_GUIDES[slug].href} className="text-primary-600 font-semibold hover:underline">
            {ALTERNATIVES_GUIDES[slug].label}
          </Link>
        </div>
      )}

      {/* Related Alternatives — cross-link to alternatives pages for each alternative entity */}
      {rows.some((alt) => altPageLive(alt.slug)) && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-text mb-4">Related Alternatives</h2>
          <p className="text-sm text-text-secondary mb-4">
            Explore alternatives pages for entities compared with {name}.
          </p>
          <div className="flex flex-wrap gap-2">
            {rows.filter((alt) => altPageLive(alt.slug)).slice(0, 12).map((alt) => (
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

      {/* FAQ section — AEO / FAQPage structured answer blocks */}
      {faqs.length > 0 && <section aria-labelledby="alternatives-faq-heading" className="mt-12 border-t border-border pt-10">
        <h2 id="alternatives-faq-heading" className="text-2xl font-display font-bold text-text mb-6">Frequently Asked Questions</h2>
        <dl className="space-y-5">
          {faqs.map((f) => (
            <div key={f.q} className="bg-surface-alt rounded-xl p-5 border border-border">
              <dt className="font-semibold text-text mb-2">{f.q}</dt>
              <dd className="faq-answer text-sm text-text-secondary leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>}

      {/* Newsletter Signup */}
      <div className="mt-12">
        <NewsletterSignup source="alternatives" referrerSlug={slug} />
      </div>
    </section>
    </>
  );
}
