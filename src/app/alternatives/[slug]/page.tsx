
import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { ENTITY_CONTENT } from "@/lib/data/entity-content";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(`Alternatives to ${name}`)}&type=alternatives`;
  const content = ENTITY_CONTENT[slug];
  const altNames = content?.alternatives.slice(0, 3).map((a) => a.name).join(", ");
  const metaDesc = altNames
    ? `Best alternatives to ${name} in 2026: ${altNames}, and more. Compare side-by-side and find the right option for you.`
    : `Discover the best alternatives to ${name}. Compare ${name} against top competitors and find the best option for you.`;
  return {
    title: `Alternatives to ${name}`,
    description: metaDesc,
    alternates: { canonical: `${SITE_URL}/alternatives/${slug}` },
    openGraph: {
      title: `Alternatives to ${name}`,
      description: `Compare ${name} against top competitors and find the best option.`,
      url: `${SITE_URL}/alternatives/${slug}`,
      type: "website",
      siteName: SITE_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: `Alternatives to ${name}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `Alternatives to ${name}`,
      description: `Compare ${name} against top competitors.`,
      images: [ogImage],
    },
  };
}

export default async function AlternativesPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  // Find all comparisons that include this entity and extract alternatives
  const allSlugs = getAllMockSlugs();
  const alternatives: { name: string; slug: string; comparisonSlug: string; comparisonTitle: string }[] = [];

  for (const compSlug of allSlugs) {
    const comp = getMockComparison(compSlug);
    if (!comp) continue;

    const matchEntity = comp.entities.find((e) => e.slug === slug || compSlug.includes(slug));
    if (matchEntity) {
      const otherEntity = comp.entities.find((e) => e.slug !== matchEntity.slug);
      if (otherEntity) {
        alternatives.push({
          name: otherEntity.name,
          slug: otherEntity.slug,
          comparisonSlug: comp.slug,
          comparisonTitle: comp.title,
        });
      }
    }
  }

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
    name: `Alternatives to ${name}`,
    numberOfItems: alternatives.length,
    itemListElement: alternatives.slice(0, 10).map((alt, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: alt.name,
      url: `${SITE_URL}/compare/${alt.comparisonSlug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema(breadcrumbs)) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
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
        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl font-bold text-primary-700">{name.charAt(0)}</span>
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
            <div key={alt.comparisonSlug} className="bg-white border border-border rounded-xl p-5 hover:border-primary-300 hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center">
                  <span className="text-accent-600 font-bold text-lg">{alt.name.charAt(0)}</span>
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
                  className="flex-1 text-center py-2 bg-primary-600 text-white text-sm font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Compare
                </Link>
                <Link
                  href={`/entity/${alt.slug}`}
                  className="flex-1 text-center py-2 bg-surface-alt text-text text-sm font-semibold rounded-lg hover:bg-gray-100 transition-colors border border-border"
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
            className="inline-block px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
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
                <span className="w-5 h-5 bg-accent-50 rounded-full flex items-center justify-center text-xs font-bold text-accent-600 flex-shrink-0">
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
