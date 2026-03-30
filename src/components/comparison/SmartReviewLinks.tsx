import Link from "next/link";
import { getEntityAggregation } from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";

const SMARTREVIEW_URL = process.env.NEXT_PUBLIC_SMARTREVIEW_URL || "https://smartreview.com";

interface SmartReviewLinksProps {
  entities: { name: string; slug: string }[];
}

export async function SmartReviewLinks({ entities }: SmartReviewLinksProps) {
  const aggregations = await Promise.all(
    entities.map(async (entity) => {
      const agg = await getEntityAggregation(entity.slug);
      return agg ? { ...entity, agg } : null;
    })
  );

  const withReviews = aggregations.filter(Boolean) as {
    name: string;
    slug: string;
    agg: NonNullable<Awaited<ReturnType<typeof getEntityAggregation>>>;
  }[];

  if (withReviews.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-2">
        SmartReview Ratings
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Aggregated ratings from Reddit, G2, Capterra, Trustpilot & more
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {withReviews.map(({ name, slug, agg }) => {
          const scoreColor = agg.smartScore >= 90
            ? "bg-green-100 text-green-700"
            : agg.smartScore >= 75
            ? "bg-blue-100 text-blue-700"
            : agg.smartScore >= 60
            ? "bg-amber-100 text-amber-700"
            : "bg-gray-100 text-gray-700";

          return (
            <div key={slug} className="flex flex-col gap-2">
              {/* Internal review page link */}
              <Link
                href={`/reviews/${slug}`}
                className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-lg font-bold shrink-0 ${scoreColor}`}>
                  {agg.smartScore}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text group-hover:text-primary-700 transition-colors truncate">
                    {name}
                  </p>
                  <StarRating rating={agg.averageRating} size="sm" reviewCount={agg.totalReviews} />
                  {agg.topPros.length > 0 && (
                    <p className="text-xs text-text-secondary mt-1 truncate">
                      Top: {agg.topPros.slice(0, 2).join(", ")}
                    </p>
                  )}
                </div>
                <span className="text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  Full review &rarr;
                </span>
              </Link>
              {/* Cross-site SmartReview deep link */}
              <a
                href={`${SMARTREVIEW_URL}/search?q=${encodeURIComponent(name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 text-xs text-purple-600 hover:text-purple-700 hover:underline"
              >
                <span className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center text-[10px] font-bold shrink-0">SR</span>
                Read {name} reviews on SmartReview &rarr;
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
