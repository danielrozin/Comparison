"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type SortOption = "rating" | "alphabetical" | "trending";
export type RatingFilter = "all" | "4+" | "3+";

interface CategoryFiltersProps {
  basePath: string;
  currentSort: SortOption;
  currentRating: RatingFilter;
  totalResults: number;
}

export function CategoryFilters({
  basePath,
  currentSort,
  currentRating,
  totalResults,
}: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "trending" && key === "sort") {
        params.delete("sort");
      } else if (value === "all" && key === "rating") {
        params.delete("rating");
      } else {
        params.set(key, value);
      }
      // Reset to page 1 when filters change
      params.delete("page");
      const qs = params.toString();
      router.push(qs ? `${basePath}?${qs}` : basePath);
    },
    [router, searchParams, basePath]
  );

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-surface-alt rounded-xl border border-border">
      <p className="text-sm text-text-secondary">
        {totalResults} result{totalResults !== 1 ? "s" : ""}
      </p>

      <div className="flex flex-wrap items-center gap-3">
        {/* Sort */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort" className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Sort
          </label>
          <select
            id="sort"
            value={currentSort}
            onChange={(e) => updateParams("sort", e.target.value)}
            className="text-sm px-3 py-1.5 bg-white border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="trending">Trending</option>
            <option value="rating">Highest Rated</option>
            <option value="alphabetical">A-Z</option>
          </select>
        </div>

        {/* Rating filter */}
        <div className="flex items-center gap-2">
          <label htmlFor="rating" className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            Rating
          </label>
          <select
            id="rating"
            value={currentRating}
            onChange={(e) => updateParams("rating", e.target.value)}
            className="text-sm px-3 py-1.5 bg-white border border-border rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Ratings</option>
            <option value="4+">4+ Stars</option>
            <option value="3+">3+ Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
}
