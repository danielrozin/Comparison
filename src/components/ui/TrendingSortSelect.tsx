"use client";

import { useRouter, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "views", label: "Most Views" },
  { value: "newest", label: "Newest" },
  { value: "alpha", label: "A → Z" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function TrendingSortSelect({ activeSort }: { activeSort: SortValue }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("sort", e.target.value);
    params.delete("page");
    router.push(`/trending?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="trending-sort" className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
        Sort
      </label>
      <div className="relative">
        <svg
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-secondary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
        <select
          id="trending-sort"
          defaultValue={activeSort}
          onChange={handleChange}
          className="appearance-none pl-3 pr-8 py-1.5 text-sm font-medium border border-border rounded-lg bg-white text-text hover:border-primary-300 focus:outline-none focus-visible:border-primary-400 focus-visible:ring-2 focus-visible:ring-primary-200 transition-colors cursor-pointer"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
