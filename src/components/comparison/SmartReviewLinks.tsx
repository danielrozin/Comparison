import Link from "next/link";
import type { AggregationData } from "@/lib/services/review-service";
import { StarRating } from "@/components/ui/StarRating";

const SMARTREVIEW_URL = process.env.NEXT_PUBLIC_SMARTREVIEW_URL || "https://smartreview.com";

// One entity's pre-fetched SmartReview aggregation. Resolved server-side in the
// page's getStaticProps (getEntityAggregation is Prisma/Redis-backed and must not
// run on the client) and passed in as a plain-serializable prop.
export interface SmartReviewEntry {
  name: string;
  slug: string;
  agg: AggregationData;
}

interface SmartReviewLinksProps {
  reviews: SmartReviewEntry[];
}

// DAN-1656: This renders inside the Pages Router /compare/[slug] tree, where every
// component is a Client Component. It MUST stay synchronous — an async component
// here throws React #482 ("async Client Component") on hydration and crashes the
// whole page. The DB aggregation is fetched in getStaticProps and threaded in.
export function SmartReviewLinks({ reviews }: SmartReviewLinksProps) {
  const withReviews = reviews ?? [];

  if (withReviews.length === 0) return null;

  return (
    <section aria-labelledby="smart-review-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h2 id="smart-review-heading" className="text-2xl font-display font-bold text-text">SmartReview Ratings</h2>
      </div>
      <p className="text-sm text-text-secondary mb-6">
        Aggregated ratings from Reddit, G2, Capterra, Trustpilot & more
      </p>

      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 list-none">
        {withReviews.map(({ name, slug, agg }) => {
          const scoreColor = agg.smartScore >= 90
            ? "bg-green-100 text-green-700 ring-green-200"
            : agg.smartScore >= 75
            ? "bg-blue-100 text-blue-700 ring-blue-200"
            : agg.smartScore >= 60
            ? "bg-amber-100 text-amber-700 ring-amber-200"
            : "bg-surface-alt text-text ring-border";

          return (
            <li key={slug} className="flex flex-col gap-2">
              {/* Internal review page link */}
              <Link
                href={`/reviews/${slug}`}
                className="flex items-center gap-4 p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-400 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-lg font-black shrink-0 ring-2 shadow-sm ${scoreColor}`}>
                  <span className="leading-none">{agg.smartScore}</span>
                  <span className="text-[8px] font-semibold opacity-60 leading-none mt-0.5">/ 100</span>
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
            </li>
          );
        })}
      </ul>
    </section>
  );
}
