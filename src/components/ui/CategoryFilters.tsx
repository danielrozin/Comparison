"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export type SortOption = "alphabetical" | "trending";

interface CategoryFiltersProps {
  basePath: string;
  currentSort: SortOption;
  totalResults: number;
}

export function CategoryFilters({
  basePath,
  currentSort,
  totalResults,
}: CategoryFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === "trending" && key === "sort") {
        params.delete("sort");
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
            <option value="alphabetical">A-Z</option>
          </select>
        </div>
      </div>
    </div>
  );
}
