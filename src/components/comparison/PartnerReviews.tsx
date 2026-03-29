interface PartnerReview {
  productName: string;
  url: string;
  smartScore: number;
  reviewCount: number;
  source: string;
}

interface PartnerReviewsProps {
  reviews: PartnerReview[];
}

export function PartnerReviews({ reviews }: PartnerReviewsProps) {
  if (reviews.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-2">
        In-Depth Reviews
      </h2>
      <p className="text-sm text-text-secondary mb-6">
        Detailed buyer reviews and SmartScores from our partner SmartReview
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((review) => (
          <a
            key={review.url}
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-sm transition-all group"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700 text-sm font-bold">
                {review.smartScore}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate group-hover:text-primary-700 transition-colors">
                  {review.productName}
                </p>
                <p className="text-xs text-text-secondary">
                  SmartScore {review.smartScore}/100
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xs text-text-secondary">
                {review.reviewCount.toLocaleString()} verified reviews
              </p>
              <span className="text-xs font-medium text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Read review &rarr;
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
