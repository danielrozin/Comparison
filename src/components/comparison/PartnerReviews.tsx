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

  const CARD_GRADIENTS = [
    "from-emerald-400 to-teal-500",
    "from-primary-400 to-indigo-500",
    "from-violet-400 to-purple-500",
  ];

  return (
    <section id="partner-reviews" aria-labelledby="partner-reviews-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <div>
          <h2 id="partner-reviews-heading" className="text-2xl font-display font-bold text-text">In-Depth Reviews</h2>
          <p className="text-xs text-text-secondary mt-0.5">Buyer reviews and SmartScores from our partner SmartReview</p>
        </div>
      </div>

      <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 list-none">
        {reviews.map((review, idx) => {
          const scoreColor = review.smartScore >= 90
            ? "bg-green-100 text-green-700 ring-green-200"
            : review.smartScore >= 75
            ? "bg-emerald-100 text-emerald-700 ring-emerald-200"
            : review.smartScore >= 60
            ? "bg-amber-100 text-amber-700 ring-amber-200"
            : "bg-rose-50 text-rose-700 ring-rose-200";
          return (
          <li key={review.url} className="flex">
          <a
            href={review.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read ${review.productName} review on ${review.source} — SmartScore ${review.smartScore}/100 (opens in new tab)`}
            className="relative flex flex-col p-5 bg-white border border-border rounded-xl hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group overflow-hidden w-full"
          >
            {/* Gradient accent stripe */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${CARD_GRADIENTS[idx % CARD_GRADIENTS.length]}`} />
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center text-lg font-black shrink-0 ring-2 shadow-sm ${scoreColor}`}>
                <span className="leading-none text-sm">{review.smartScore}</span>
                <span className="text-[9px] font-semibold opacity-70 leading-none mt-0.5">/ 100</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-text truncate group-hover:text-primary-700 transition-colors">
                  {review.productName}
                </h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  SmartScore™
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <p className="text-xs text-text-secondary">
                {review.reviewCount.toLocaleString()} verified reviews
              </p>
              <span className="text-xs font-semibold text-primary-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Read review <span aria-hidden="true">→</span>
              </span>
            </div>
          </a>
          </li>
        );
        })}
      </ul>
    </section>
  );
}
