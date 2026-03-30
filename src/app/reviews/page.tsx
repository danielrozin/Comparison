import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SITE_URL } from "@/lib/utils/constants";
import { getReviewedEntities, getReviewCategories } from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";
import { Pagination } from "@/components/ui/Pagination";
import { breadcrumbSchema } from "@/lib/seo/schema";

const ITEMS_PER_PAGE = 16;

interface PageProps {
  searchParams: Promise<{ page?: string; sort?: string; category?: string; rating?: string }>;
}

export const metadata: Metadata = {
  title: "SmartReview — Product Reviews & Ratings",
  description: "Expert product reviews with aggregated ratings from Reddit, G2, Capterra, Trustpilot, and more. Find the best products with SmartScore ratings.",
  alternates: { canonical: `${SITE_URL}/reviews` },
};

function SmartScoreBadge({ score }: { score: number }) {
  const color = score >= 90 ? "bg-green-100 text-green-800" : score >= 75 ? "bg-blue-100 text-blue-800" : score >= 60 ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${color}`}>
      {score}
    </span>
  );
}

export default async function ReviewsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const sort = (sp.sort as "rating" | "reviews" | "smartscore" | "alphabetical") || "smartscore";
  const category = sp.category || undefined;
  const minRating = sp.rating === "4+" ? 4 : sp.rating === "3+" ? 3 : undefined;

  const [{ entities, total }, categories] = await Promise.all([
    getReviewedEntities({
      category,
      sort,
      minRating,
      limit: ITEMS_PER_PAGE,
      offset: (page - 1) * ITEMS_PER_PAGE,
    }),
    getReviewCategories(),
  ]);

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
  const basePath = "/reviews";

  const schemaData = breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Reviews", url: `${SITE_URL}/reviews` },
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
            <li className="text-text font-medium">Reviews</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
            SmartReview
          </h1>
          <p className="text-text-secondary mt-1">
            Aggregated reviews from Reddit, G2, Capterra, Trustpilot & more.
            {total > 0 && ` ${total} product${total !== 1 ? "s" : ""} reviewed.`}
          </p>
        </div>

        {/* Category Navigation */}
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <Link
              href="/reviews"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!category ? "bg-primary-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
            >
              All ({categories.reduce((s, c) => s + c.count, 0)})
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/reviews?category=${cat.slug}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.slug ? "bg-primary-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
              >
                {cat.name} ({cat.count})
              </Link>
            ))}
          </div>
        )}

        {/* Sort & Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <span className="text-text-secondary">Sort by:</span>
          {(["smartscore", "rating", "reviews", "alphabetical"] as const).map((s) => (
            <Link
              key={s}
              href={`/reviews?sort=${s}${category ? `&category=${category}` : ""}${sp.rating ? `&rating=${sp.rating}` : ""}`}
              className={`font-medium ${sort === s ? "text-primary-600 underline" : "text-text-secondary hover:text-text"}`}
            >
              {s === "smartscore" ? "SmartScore" : s === "rating" ? "Rating" : s === "reviews" ? "Most Reviewed" : "A-Z"}
            </Link>
          ))}
          <span className="mx-2 text-border">|</span>
          <span className="text-text-secondary">Min rating:</span>
          {(["all", "3+", "4+"] as const).map((r) => (
            <Link
              key={r}
              href={`/reviews?sort=${sort}${category ? `&category=${category}` : ""}${r !== "all" ? `&rating=${r}` : ""}`}
              className={`font-medium ${(sp.rating || "all") === r ? "text-primary-600 underline" : "text-text-secondary hover:text-text"}`}
            >
              {r === "all" ? "All" : r}
            </Link>
          ))}
        </div>

        {/* Product Grid */}
        {entities.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {entities.map((entity) => {
                const agg = entity.reviewAggregation;
                return (
                  <Link
                    key={entity.id}
                    href={`/reviews/${entity.slug}`}
                    className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-lg font-bold text-primary-700">
                        {entity.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                          {entity.name}
                        </p>
                        <p className="text-xs text-text-secondary truncate">
                          {entity.entityType.name}
                        </p>
                      </div>
                      {agg && <SmartScoreBadge score={agg.smartScore} />}
                    </div>
                    {entity.shortDesc && (
                      <p className="text-sm text-text-secondary mb-3 line-clamp-2">{entity.shortDesc}</p>
                    )}
                    <div className="mt-auto">
                      {agg && (
                        <StarRating rating={agg.averageRating} size="sm" reviewCount={agg.totalReviews} />
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>

            <Pagination currentPage={page} totalPages={totalPages} basePath={basePath} />
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-text-secondary text-lg">No reviewed products found.</p>
            {category && (
              <Link href="/reviews" className="mt-4 inline-block text-primary-600 font-medium hover:underline">
                View all reviews
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  );
}
