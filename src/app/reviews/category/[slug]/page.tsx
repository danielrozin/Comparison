import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/utils/constants";
import {
  getProductsForReviewCategory,
  getReviewCategoryMeta,
  getAllReviewCategorySlugs,
} from "@/lib/services/review-service";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600; // ISR: 1 hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllReviewCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cat = getReviewCategoryMeta(slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `Best ${cat.name} Reviews & SmartScores`,
    description: `Compare the best ${cat.name.toLowerCase()} with aggregated SmartScores. Verified reviews, pros & cons, and side-by-side ratings.`,
    alternates: { canonical: `${SITE_URL}/reviews/category/${slug}` },
  };
}

function getScoreColor(score: number): string {
  if (score >= 85) return "text-emerald-700 bg-emerald-100";
  if (score >= 75) return "text-blue-700 bg-blue-100";
  if (score >= 65) return "text-amber-700 bg-amber-100";
  return "text-red-700 bg-red-100";
}

export default async function ReviewCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const cat = getReviewCategoryMeta(slug);
  if (!cat) notFound();

  const products = await getProductsForReviewCategory(slug);

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
    { name: cat.name, url: `${SITE_URL}/reviews/category/${slug}` },
  ]);

  // Build aggregate rating schema inline if we have products
  let ratingSchema = null;
  if (products.length > 0) {
    const avgScore = products.reduce((sum, p) => sum + p.smartScore, 0) / products.length;
    const totalReviews = products.reduce((sum, p) => sum + p.reviewCount, 0);
    ratingSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `${cat.name} Reviews`,
      url: `${SITE_URL}/reviews/category/${slug}`,
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (avgScore / 20).toFixed(1),
        bestRating: 5,
        worstRating: 1,
        reviewCount: totalReviews,
      },
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      {ratingSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ratingSchema) }}
        />
      )}

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
            <li>
              <Link href="/reviews" className="hover:text-primary-600">
                Reviews
              </Link>
            </li>
            <li>/</li>
            <li className="text-text font-medium">{cat.name}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <span className="text-4xl">{cat.icon}</span>
          <div>
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              Best {cat.name} Reviews
            </h1>
            <p className="text-text-secondary mt-1">
              {products.length} product{products.length !== 1 ? "s" : ""} ranked
              by SmartScore
            </p>
          </div>
        </div>

        {/* Product List */}
        {products.length > 0 ? (
          <div className="flex flex-col gap-4">
            {products.map((product, index) => (
              <div
                key={product.slug}
                className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-200 transition-colors"
              >
                {/* Rank */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <span className="text-2xl font-display font-black text-text-secondary w-8 text-center">
                    {index + 1}
                  </span>
                  <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center text-lg font-bold ${getScoreColor(product.smartScore)}`}
                  >
                    {product.smartScore}
                  </div>
                </div>

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-display font-bold text-text">
                    {product.productName}
                  </h2>
                  <p className="text-sm text-text-secondary mt-0.5">
                    SmartScore {product.smartScore}/100 &middot;{" "}
                    {product.reviewCount.toLocaleString()} verified reviews
                  </p>

                  {/* Pros & Cons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    <div>
                      <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                        Pros
                      </p>
                      <ul className="text-sm text-text-secondary space-y-0.5">
                        {product.pros.map((pro) => (
                          <li key={pro} className="flex items-start gap-1.5">
                            <span className="text-emerald-500 mt-0.5 shrink-0">+</span>
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                        Cons
                      </p>
                      <ul className="text-sm text-text-secondary space-y-0.5">
                        {product.cons.map((con) => (
                          <li key={con} className="flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5 shrink-0">-</span>
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="shrink-0 self-center">
                  <Link
                    href={`/search?q=${encodeURIComponent(product.productName)}`}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                  >
                    Compare
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">
              No products reviewed in this category yet.
            </p>
            <Link
              href="/reviews"
              className="mt-4 inline-block text-primary-600 font-medium hover:underline"
            >
              Browse all categories
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
