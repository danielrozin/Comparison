import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, SITE_URL, PRODUCT_SUBCATEGORIES } from "@/lib/utils/constants";
import { getComparisonsByCategory } from "@/lib/services/comparison-service";
import { breadcrumbSchema, categoryPageSchema } from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ slug: cat.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);
  if (!category) return { title: "Category Not Found" };

  const ogImage = `${SITE_URL}/api/og?title=${encodeURIComponent(category.name + " Comparisons")}&cat=${encodeURIComponent(category.name)}&type=category`;
  return {
    title: `${category.name} Comparisons`,
    description: `Browse the best ${category.name.toLowerCase()} comparisons. Compare players, teams, countries, products, and more.`,
    alternates: { canonical: `${SITE_URL}/category/${slug}` },
    openGraph: { images: [{ url: ogImage, width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = CATEGORIES.find((c) => c.slug === slug);

  if (!category) notFound();

  const { comparisons, total } = await getComparisonsByCategory(slug, 200);

  // For products category, group by subcategory
  const isProducts = slug === "products";
  const subcategoryGroups: { name: string; icon: string; items: typeof comparisons }[] = [];
  const ungrouped: typeof comparisons = [];

  if (isProducts && comparisons.length > 0) {
    for (const subcat of PRODUCT_SUBCATEGORIES) {
      const items = comparisons.filter((comp) => {
        const lower = comp.title.toLowerCase() + " " + comp.slug.toLowerCase();
        return subcat.keywords.some((kw) => lower.includes(kw));
      });
      if (items.length > 0) {
        subcategoryGroups.push({ name: subcat.name, icon: subcat.icon, items });
      }
    }
    // Collect ungrouped items
    const grouped = new Set(subcategoryGroups.flatMap((g) => g.items.map((i) => i.slug)));
    ungrouped.push(...comparisons.filter((c) => !grouped.has(c.slug)));
    if (ungrouped.length > 0) {
      subcategoryGroups.push({ name: "Other Products", icon: "📦", items: ungrouped });
    }
  }

  const renderComparisonCard = (comp: { slug: string; title: string }) => {
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
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", url: SITE_URL },
              { name: category.name, url: `${SITE_URL}/category/${slug}` },
            ])
          ),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{category.name}</li>
          </ol>
        </nav>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{category.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {category.name} Comparisons
            </h1>
            <p className="text-text-secondary mt-1">
              {total} comparison{total !== 1 ? "s" : ""} available
            </p>
          </div>
        </div>

        {isProducts && subcategoryGroups.length > 0 ? (
          <div className="space-y-10">
            {subcategoryGroups.map((group) => (
              <section key={group.name}>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{group.icon}</span>
                  <h2 className="text-xl font-display font-bold text-text">{group.name}</h2>
                  <span className="text-sm text-text-secondary ml-1">({group.items.length})</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {group.items.map(renderComparisonCard)}
                </div>
              </section>
            ))}
          </div>
        ) : comparisons.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {comparisons.map(renderComparisonCard)}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No comparisons available in this category yet.
            </p>
            <Link href="/" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
              Browse all comparisons
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
