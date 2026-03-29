import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL, CATEGORIES } from "@/lib/utils/constants";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";
import { breadcrumbSchema, aggregateRatingSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";

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
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `${name} — All Comparisons`,
    description: `See all comparisons involving ${name}. Compare ${name} against other options across key attributes.`,
    alternates: { canonical: `${SITE_URL}/entity/${slug}` },
  };
}

export default async function EntityPage({ params }: PageProps) {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const rating = getEntityRating(slug);
  const reviewCount = getReviewCount(slug);

  // Find all comparisons that include this entity
  const allSlugs = getAllMockSlugs();
  const relatedComparisons: { slug: string; title: string; category: string | null }[] = [];

  for (const compSlug of allSlugs) {
    const comp = getMockComparison(compSlug);
    if (!comp) continue;
    if (
      comp.entities.some((e) => e.slug === slug) ||
      compSlug.includes(slug)
    ) {
      relatedComparisons.push({
        slug: comp.slug,
        title: comp.title,
        category: comp.category,
      });
    }
  }

  // Determine category from the first comparison
  const primaryCategory = relatedComparisons[0]?.category || null;
  const categoryDef = primaryCategory
    ? CATEGORIES.find((c) => c.slug === primaryCategory)
    : null;

  // Breadcrumb items
  const breadcrumbItems = [
    { name: "Home", url: SITE_URL },
    ...(categoryDef
      ? [{ name: categoryDef.name, url: `${SITE_URL}/category/${categoryDef.slug}` }]
      : []),
    { name, url: `${SITE_URL}/entity/${slug}` },
  ];

  const schemas = [
    breadcrumbSchema(breadcrumbItems),
    aggregateRatingSchema({
      name,
      slug,
      entityType: "product",
      ratingValue: rating,
      reviewCount,
    }),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            {categoryDef && (
              <>
                <li>/</li>
                <li>
                  <Link href={`/category/${categoryDef.slug}`} className="hover:text-primary-600">
                    {categoryDef.name}
                  </Link>
                </li>
              </>
            )}
            <li>/</li>
            <li className="text-text font-medium">{name}</li>
          </ol>
        </nav>

        {/* Hero with Star Rating */}
        <div className="flex items-start gap-4 mb-8 p-6 bg-white border border-border rounded-2xl">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-bold text-primary-700">{name.charAt(0)}</span>
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">{name}</h1>
            <div className="mt-2">
              <StarRating rating={rating} size="lg" reviewCount={reviewCount} />
            </div>
            <p className="text-text-secondary mt-2">
              {relatedComparisons.length} comparison{relatedComparisons.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* Comparisons */}
        {relatedComparisons.length > 0 ? (
          <div className="space-y-3">
            <h2 className="text-xl font-bold text-text mb-4">All Comparisons</h2>
            {relatedComparisons.map((comp) => {
              const parts = comp.title.split(/\s+vs\.?\s+/i);
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
                >
                  <div className="flex -space-x-2">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                      {(parts[0] || "A").charAt(0)}
                    </div>
                    <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
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
                  <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="inline-block px-5 py-2.5 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Search for a comparison
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
