import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, PRODUCT_SUBCATEGORIES, SITE_URL } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { breadcrumbSchema } from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string; subcategory: string }>;
}

function getSubcategoryComparisons(
  comparisons: { slug: string; title: string; category?: string | null }[],
  subcat: (typeof PRODUCT_SUBCATEGORIES)[number]
) {
  return comparisons.filter((comp) => {
    const lower = comp.title.toLowerCase() + " " + comp.slug.toLowerCase();
    return subcat.keywords.some((kw) => lower.includes(kw));
  });
}

export async function generateStaticParams() {
  // Generate all category + subcategory combos
  return PRODUCT_SUBCATEGORIES.map((sub) => ({
    slug: "products",
    subcategory: sub.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subcategory } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const subcat = PRODUCT_SUBCATEGORIES.find((s) => s.slug === subcategory);
  if (!category || !subcat) return { title: "Not Found" };

  return {
    title: `${subcat.name} Comparisons — Best ${subcat.name} Products Compared`,
    description: `Compare the best ${subcat.name.toLowerCase()} products side by side. Expert comparisons with specs, pros & cons, and verdicts to help you choose.`,
    alternates: { canonical: `${SITE_URL}/category/${slug}/${subcategory}` },
  };
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subcategory } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  const subcat = PRODUCT_SUBCATEGORIES.find((s) => s.slug === subcategory);

  if (!category || !subcat) notFound();

  const { comparisons } = await getComparisonsByCategory(slug, 200);
  const filtered = getSubcategoryComparisons(comparisons, subcat);

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: category.name, url: `${SITE_URL}/category/${slug}` },
    { name: subcat.name, url: `${SITE_URL}/category/${slug}/${subcategory}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href={`/category/${slug}`} className="hover:text-primary-600">{category.name}</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{subcat.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{subcat.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {subcat.name}
            </h1>
            <p className="text-text-secondary mt-1">
              {filtered.length} comparison{filtered.length !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {/* Comparisons Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((comp) => {
              const parts = comp.title.split(/\s+vs\.?\s+/i);
              return (
                <Link
                  key={comp.slug}
                  href={`/compare/${comp.slug}`}
                  className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
                >
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-700 ring-2 ring-white">
                      {(parts[0] || "A").charAt(0)}
                    </div>
                    <div className="w-10 h-10 bg-accent-50 rounded-full flex items-center justify-center text-sm font-bold text-accent-600 ring-2 ring-white">
                      {(parts[1] || "B").charAt(0)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                      {comp.title}
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-text-secondary group-hover:text-primary-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No comparisons in this subcategory yet. Check back soon!
            </p>
            <Link href={`/category/${slug}`} className="mt-4 inline-block text-primary-600 font-medium hover:underline">
              Browse all {category.name}
            </Link>
          </div>
        )}

        {/* Back link */}
        <div className="mt-10 pt-6 border-t border-border">
          <Link href={`/category/${slug}`} className="text-primary-600 hover:underline font-medium">
            View all {category.name} subcategories
          </Link>
        </div>
      </div>
    </>
  );
}
