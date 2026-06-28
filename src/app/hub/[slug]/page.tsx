import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { HUB_CONFIG } from "@/lib/data/hubs";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";
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
  return {
    title: hub.title,
    description: hub.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: hub.title,
      description: hub.description,
      url: canonicalUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: hub.title,
      description: hub.description,
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

  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: hub.h1,
    description: hub.description,
    abstract: hub.description,
    url: hubUrl,
    inLanguage: "en-US",
    creativeWorkStatus: "Published",
    isAccessibleForFree: true,
    lastReviewed: new Date().toISOString().slice(0, 10),
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hub-description"],
    },
    accessMode: ["textual"],
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
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="text-sm text-gray-500 mb-6">
          <ol className="flex items-center gap-1">
            <li><Link href="/" className="hover:underline">Home</Link></li>
            <li aria-hidden="true">/</li>
            <li><span className="text-gray-700">{hub.h1}</span></li>
          </ol>
        </nav>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{hub.h1}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{hub.intro}</p>
        </header>

        {/* Spoke comparison cards */}
        <section aria-labelledby="comparisons-heading" className="mb-12">
          <h2 id="comparisons-heading" className="text-2xl font-semibold text-gray-800 mb-6">
            Featured Comparisons
          </h2>
          {spokes.length === 0 ? (
            <p className="text-gray-500">Comparisons are being generated. Check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hub.comparisonSlugs.map((compSlug) => {
                const comp = spokes.find((s) => s.slug === compSlug);
                if (!comp) return null;
                return (
                  <Link
                    key={compSlug}
                    href={`/compare/${comp.slug}`}
                    className="block p-5 rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all bg-white group"
                  >
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 mb-2 leading-snug">
                      {comp.title}
                    </h3>
                    {comp.shortAnswer && (
                      <p className="text-sm text-gray-500 line-clamp-2">{comp.shortAnswer}</p>
                    )}
                    <span className="mt-3 inline-block text-xs font-medium text-blue-600 uppercase tracking-wide">
                      Compare →
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* FAQ section */}
        <section aria-labelledby="faq-heading" className="mb-8">
          <h2 id="faq-heading" className="text-2xl font-semibold text-gray-800 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {hub.faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Category back-link */}
        {hub.categoryAnchor && (
          <div className="mt-8 pt-6 border-t border-gray-100">
            <Link
              href={`/category/${hub.categoryAnchor}`}
              className="text-blue-600 hover:underline text-sm"
            >
              ← Browse all {hub.h1.replace(" Hub (2026)", "").replace(" Comparison", "")} comparisons
            </Link>
          </div>
        )}
      </main>
    </>
  );
}
