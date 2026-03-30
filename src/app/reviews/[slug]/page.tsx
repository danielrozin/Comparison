import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/utils/constants";
import { getReviewsByEntity, getEntityAggregation } from "@/lib/services/review-service";
import { aggregateRatingSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { StarRating } from "@/components/ui/StarRating";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ source?: string; page?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const agg = await getEntityAggregation(slug);
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return {
    title: agg
      ? `${name} Review — ${agg.averageRating}/5 from ${agg.totalReviews} reviews`
      : `${name} Review`,
    description: agg
      ? `${name} has a ${agg.averageRating}/5 rating from ${agg.totalReviews} aggregated reviews. SmartScore: ${agg.smartScore}/100.`
      : `Read reviews for ${name} from multiple sources.`,
    alternates: { canonical: `${SITE_URL}/reviews/${slug}` },
  };
}

function SourceBreakdown({ breakdown }: { breakdown: Record<string, { avg: number; count: number }> }) {
  const sources = Object.entries(breakdown).sort((a, b) => b[1].count - a[1].count);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {sources.map(([source, data]) => (
        <div key={source} className="bg-white border border-border rounded-lg p-3">
          <p className="text-sm font-medium text-text capitalize">{source}</p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-lg font-bold text-text">{data.avg.toFixed(1)}</span>
            <span className="text-xs text-text-secondary">/ 5</span>
          </div>
          <p className="text-xs text-text-secondary mt-0.5">{data.count} review{data.count !== 1 ? "s" : ""}</p>
        </div>
      ))}
    </div>
  );
}

function SmartScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? "text-green-600" : score >= 75 ? "text-blue-600" : score >= 60 ? "text-amber-600" : "text-gray-500";
  const bgColor = score >= 90 ? "bg-green-50" : score >= 75 ? "bg-blue-50" : score >= 60 ? "bg-amber-50" : "bg-gray-50";
  return (
    <div className={`flex flex-col items-center justify-center w-24 h-24 rounded-full ${bgColor}`}>
      <span className={`text-3xl font-black ${color}`}>{score}</span>
      <span className="text-xs text-text-secondary font-medium">SmartScore</span>
    </div>
  );
}

function SentimentBar({ positivePct, negativePct }: { positivePct: number; negativePct: number }) {
  const neutralPct = Math.max(0, 100 - positivePct - negativePct);
  return (
    <div className="w-full">
      <div className="flex h-3 rounded-full overflow-hidden">
        <div className="bg-green-400" style={{ width: `${positivePct}%` }} />
        <div className="bg-gray-200" style={{ width: `${neutralPct}%` }} />
        <div className="bg-red-400" style={{ width: `${negativePct}%` }} />
      </div>
      <div className="flex justify-between mt-1 text-xs text-text-secondary">
        <span>{positivePct}% positive</span>
        <span>{negativePct}% negative</span>
      </div>
    </div>
  );
}

export default async function EntityReviewPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = await searchParams;
  const source = sp.source || undefined;
  const page = Math.max(1, parseInt(sp.page || "1", 10) || 1);
  const limit = 20;

  const [aggregation, { reviews, total }] = await Promise.all([
    getEntityAggregation(slug),
    getReviewsByEntity(slug, { limit, offset: (page - 1) * limit, source }),
  ]);

  if (!aggregation && total === 0) notFound();

  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Schema.org structured data
  const schemas: Record<string, unknown>[] = [
    breadcrumbSchema([
      { name: "Home", url: SITE_URL },
      { name: "Reviews", url: `${SITE_URL}/reviews` },
      { name, url: `${SITE_URL}/reviews/${slug}` },
    ]),
  ];
  if (aggregation) {
    schemas.push(
      aggregateRatingSchema({
        name,
        slug,
        entityType: "product",
        ratingValue: aggregation.averageRating,
        reviewCount: aggregation.totalReviews,
      })
    );
  }

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center gap-2 text-sm text-text-secondary">
            <li><Link href="/" className="hover:text-primary-600">Home</Link></li>
            <li>/</li>
            <li><Link href="/reviews" className="hover:text-primary-600">Reviews</Link></li>
            <li>/</li>
            <li className="text-text font-medium">{name}</li>
          </ol>
        </nav>

        {/* Hero section */}
        <div className="flex flex-col sm:flex-row items-start gap-6 mb-10">
          <div className="w-20 h-20 bg-primary-50 rounded-2xl flex items-center justify-center text-3xl font-bold text-primary-700 shrink-0">
            {name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl font-display font-black text-text">
              {name}
            </h1>
            {aggregation && (
              <div className="flex items-center gap-4 mt-2">
                <StarRating rating={aggregation.averageRating} size="lg" reviewCount={aggregation.totalReviews} />
              </div>
            )}
          </div>
          {aggregation && <SmartScoreRing score={aggregation.smartScore} />}
        </div>

        {/* Aggregation details */}
        {aggregation && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Pros & Cons */}
            <div className="bg-white border border-border rounded-xl p-6">
              <h2 className="text-lg font-display font-bold text-text mb-4">Top Pros & Cons</h2>
              <div className="space-y-4">
                {aggregation.topPros.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-green-700 mb-2">Pros</h3>
                    <ul className="space-y-1">
                      {aggregation.topPros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text">
                          <span className="text-green-500 mt-0.5">+</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {aggregation.topCons.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-red-700 mb-2">Cons</h3>
                    <ul className="space-y-1">
                      {aggregation.topCons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text">
                          <span className="text-red-500 mt-0.5">-</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sentiment & Source Breakdown */}
            <div className="space-y-6">
              {aggregation.positivePct != null && aggregation.negativePct != null && (
                <div className="bg-white border border-border rounded-xl p-6">
                  <h2 className="text-lg font-display font-bold text-text mb-4">Sentiment</h2>
                  <SentimentBar positivePct={aggregation.positivePct} negativePct={aggregation.negativePct} />
                </div>
              )}
              {aggregation.sourceBreakdown && Object.keys(aggregation.sourceBreakdown).length > 0 && (
                <div className="bg-white border border-border rounded-xl p-6">
                  <h2 className="text-lg font-display font-bold text-text mb-4">Ratings by Source</h2>
                  <SourceBreakdown breakdown={aggregation.sourceBreakdown} />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Reviews list */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-bold text-text">
              Reviews ({total})
            </h2>
            {aggregation?.sourceBreakdown && (
              <div className="flex gap-2">
                <Link
                  href={`/reviews/${slug}`}
                  className={`text-xs px-3 py-1 rounded-full ${!source ? "bg-primary-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
                >
                  All
                </Link>
                {Object.keys(aggregation.sourceBreakdown).map((s) => (
                  <Link
                    key={s}
                    href={`/reviews/${slug}?source=${s}`}
                    className={`text-xs px-3 py-1 rounded-full capitalize ${source === s ? "bg-primary-600 text-white" : "bg-white border border-border text-text-secondary hover:border-primary-300"}`}
                  >
                    {s}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="bg-white border border-border rounded-xl p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {review.authorName && (
                        <span className="text-sm font-medium text-text">{review.authorName}</span>
                      )}
                      <span className="text-xs text-text-secondary capitalize px-2 py-0.5 bg-gray-100 rounded">
                        {review.source}
                      </span>
                      {review.isVerified && (
                        <span className="text-xs text-green-600 font-medium">Verified</span>
                      )}
                    </div>
                    {review.rating != null && (
                      <StarRating rating={review.rating} size="sm" />
                    )}
                  </div>
                  {review.title && (
                    <h3 className="font-semibold text-text mb-1">{review.title}</h3>
                  )}
                  {review.body && (
                    <p className="text-sm text-text-secondary line-clamp-4">{review.body}</p>
                  )}
                  {(review.pros.length > 0 || review.cons.length > 0) && (
                    <div className="flex flex-wrap gap-4 mt-3 text-xs">
                      {review.pros.map((p, i) => (
                        <span key={`p-${i}`} className="text-green-700">+ {p}</span>
                      ))}
                      {review.cons.map((c, i) => (
                        <span key={`c-${i}`} className="text-red-700">- {c}</span>
                      ))}
                    </div>
                  )}
                  {review.sourceUrl && (
                    <a href={review.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline mt-2 inline-block">
                      View original
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-secondary text-center py-8">
              No individual reviews available yet. Check back soon.
            </p>
          )}
        </div>

        {/* Cross-link to comparisons */}
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-6 text-center">
          <h2 className="text-lg font-display font-bold text-text mb-2">
            See how {name} compares
          </h2>
          <p className="text-sm text-text-secondary mb-4">
            Find side-by-side comparisons featuring {name} on A Versus B
          </p>
          <Link
            href={`/search?q=${encodeURIComponent(name)}`}
            className="inline-flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
          >
            View Comparisons
          </Link>
        </div>
      </div>
    </>
  );
}
