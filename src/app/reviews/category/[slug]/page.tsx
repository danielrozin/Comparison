import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/utils/constants";
import {
  getReviewedEntities,
  getReviewCategories,
} from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";
import { breadcrumbSchema } from "@/lib/seo/schema";

export const revalidate = 3600; // ISR: 1 hour

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const categories = await getReviewCategories();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const categories = await getReviewCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Category Not Found" };

  return {
    title: `Best ${cat.name} Reviews & SmartScores`,
    description: `Compare the best ${cat.name.toLowerCase()} with aggregated SmartScores. Verified reviews, pros & cons, and side-by-side ratings.`,
    alternates: { canonical: `${SITE_URL}/reviews/category/${slug}` },
  };
}

function SmartScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90
      ? "text-emerald-700 bg-emerald-100"
      : score >= 75
        ? "text-blue-700 bg-blue-100"
        : score >= 60
          ? "text-amber-700 bg-amber-100"
          : "text-red-700 bg-red-100";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-lg font-bold ${color}`}
    >
      {score}
    </span>
  );
}

export default async function ReviewCategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categories = await getReviewCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const { entities, total } = await getReviewedEntities({
    category: slug,
    sort: "smartscore",
    limit: 50,
  });

  const breadcrumb = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
    { name: cat.name, url: `${SITE_URL}/reviews/category/${slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
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
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
            Best {cat.name} Reviews
          </h1>
          <p className="text-text-secondary mt-1">
            {total} product{total !== 1 ? "s" : ""} ranked by SmartScore
          </p>
        </div>

        {/* Product List */}
        {entities.length > 0 ? (
          <div className="flex flex-col gap-4">
            {entities.map((entity, index) => {
              const agg = entity.reviewAggregation;
              return (
                <div
                  key={entity.id}
                  className="flex flex-col sm:flex-row items-start gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-200 transition-colors"
                >
                  {/* Rank */}
                  <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                    <span className="text-2xl font-display font-black text-text-secondary w-8 text-center">
                      {index + 1}
                    </span>
                    {agg && <SmartScoreBadge score={agg.smartScore} />}
                  </div>

                  {/* Product info */}
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-display font-bold text-text">
                      {entity.name}
                    </h2>
                    {entity.shortDesc && (
                      <p className="text-sm text-text-secondary mt-0.5">
                        {entity.shortDesc}
                      </p>
                    )}
                    {agg && (
                      <div className="mt-2">
                        <StarRating
                          rating={agg.averageRating}
                          size="sm"
                          reviewCount={agg.totalReviews}
                        />
                      </div>
                    )}

                    {/* Pros & Cons */}
                    {agg && (agg.topPros.length > 0 || agg.topCons.length > 0) && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                        {agg.topPros.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
                              Pros
                            </p>
                            <ul className="text-sm text-text-secondary space-y-0.5">
                              {agg.topPros.slice(0, 3).map((pro) => (
                                <li key={pro} className="flex items-start gap-1.5">
                                  <span className="text-emerald-500 mt-0.5 shrink-0">
                                    +
                                  </span>
                                  {pro}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {agg.topCons.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-red-700 uppercase tracking-wide mb-1">
                              Cons
                            </p>
                            <ul className="text-sm text-text-secondary space-y-0.5">
                              {agg.topCons.slice(0, 3).map((con) => (
                                <li key={con} className="flex items-start gap-1.5">
                                  <span className="text-red-400 mt-0.5 shrink-0">
                                    -
                                  </span>
                                  {con}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="shrink-0 self-center">
                    <Link
                      href={`/reviews/${entity.slug}`}
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
                    >
                      Full Review
                    </Link>
                  </div>
                </div>
              );
            })}
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
