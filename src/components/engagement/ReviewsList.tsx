"use client";

import { useState, useEffect, useCallback } from "react";
import { StarRating } from "@/components/ui/StarRating";

interface Review {
  id: string;
  productName: string;
  rating: number;
  text: string;
  pros: string;
  cons: string;
  authorName: string;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
  averageRating: number;
  totalReviews: number;
}

export function ReviewsList({
  entitySlug,
  refreshKey,
}: {
  entitySlug: string;
  refreshKey?: number;
}) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [averageRating, setAverageRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const loadReviews = useCallback(
    async (pageNum: number) => {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/reviews?entitySlug=${encodeURIComponent(entitySlug)}&page=${pageNum}`
        );
        if (!res.ok) throw new Error("Failed to load");
        const data: ReviewsResponse = await res.json();
        setReviews(data.reviews);
        setTotal(data.total);
        setPage(data.page);
        setTotalPages(data.totalPages);
        setAverageRating(data.averageRating);
      } catch {
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
    },
    [entitySlug]
  );

  useEffect(() => {
    loadReviews(1);
  }, [loadReviews, refreshKey]);

  const goToPage = (p: number) => {
    if (p >= 1 && p <= totalPages) {
      loadReviews(p);
    }
  };

  return (
    <div>
      {/* Summary */}
      {total > 0 && (
        <div className="flex items-center gap-3 mb-4 p-4 bg-surface-alt rounded-xl">
          <StarRating rating={averageRating} size="lg" />
          <span className="text-sm text-text-secondary">
            Based on {total} review{total !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Reviews list */}
      {isLoading && reviews.length === 0 ? (
        <div className="text-center py-8 bg-surface-alt rounded-xl">
          <p className="text-text-secondary text-sm">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 bg-surface-alt rounded-xl">
          <p className="text-text-secondary text-sm">
            No reviews yet. Be the first to share your experience!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-700 font-bold text-xs">
                      {review.authorName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">{review.authorName}</p>
                    <p className="text-xs text-text-secondary">
                      {new Date(review.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <StarRating rating={review.rating} size="sm" showValue={false} />
              </div>

              <p className="text-sm text-text leading-relaxed mb-3">{review.text}</p>

              {/* Pros and Cons */}
              {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-border">
                  {review.pros && (
                    <div>
                      <p className="text-xs font-semibold text-green-700 mb-1">Pros</p>
                      <p className="text-xs text-text-secondary">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div>
                      <p className="text-xs font-semibold text-red-700 mb-1">Cons</p>
                      <p className="text-xs text-text-secondary">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-text-secondary px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1.5 text-sm border border-border rounded-lg hover:bg-surface-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
