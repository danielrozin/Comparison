import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { getReviewCategories } from "@/lib/services/review-service";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600; // ISR: 1 hour

export const metadata: Metadata = {
  title: "Product Reviews & SmartScores",
  description: `Browse in-depth product reviews with SmartScores on ${SITE_NAME}. Aggregated ratings from verified sources across dozens of categories.`,
  alternates: { canonical: `${SITE_URL}/reviews` },
};

export default async function ReviewsPage() {
  const categories = await getReviewCategories();

  const totalProducts = categories.reduce((sum, c) => sum + c.productCount, 0);

  const schema = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li>
              <Link href="/" className="hover:text-primary-600">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-text font-medium">Reviews</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
            Product Reviews & SmartScores
          </h1>
          <p className="text-text-secondary mt-2 max-w-2xl">
            Aggregated reviews from verified sources. Each product gets a SmartScore
            (0-100) combining ratings, sentiment analysis, and expert opinions across{" "}
            {categories.length} categories and {totalProducts} products.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/reviews/category/${cat.slug}`}
              className="flex flex-col p-6 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <h2 className="text-lg font-display font-bold text-text group-hover:text-primary-700 transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-sm text-text-secondary">
                    {cat.productCount} product{cat.productCount !== 1 ? "s" : ""} reviewed
                  </p>
                </div>
              </div>

              {/* Average SmartScore badge */}
              <div className="flex items-center gap-2 mb-4">
                <div className="px-2.5 py-1 bg-emerald-100 rounded-md text-sm font-bold text-emerald-700">
                  {cat.averageScore}
                </div>
                <span className="text-xs text-text-secondary">avg SmartScore</span>
              </div>

              {/* Top 3 products preview */}
              <div className="flex flex-col gap-1.5 mt-auto">
                {cat.topProducts.slice(0, 3).map((product) => (
                  <div
                    key={product.slug}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-text-secondary truncate mr-2">
                      {product.productName}
                    </span>
                    <span className="text-xs font-medium text-emerald-600 shrink-0">
                      {product.smartScore}/100
                    </span>
                  </div>
                ))}
              </div>

              <span className="mt-4 text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                View all reviews &rarr;
              </span>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No review categories available yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
