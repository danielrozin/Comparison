"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";

export function SearchBox() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;

      // Try to parse as "A vs B"
      const vsMatch = query.match(/^(.+?)\s+(?:vs\.?|versus|compared to|or)\s+(.+)$/i);
      if (vsMatch) {
        const slug = `${slugify(vsMatch[1].trim())}-vs-${slugify(vsMatch[2].trim())}`;
        router.push(`/compare/${slug}`);
        return;
      }

      // Otherwise, go to search
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [query, router]
  );

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="relative">
        <svg
          className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder='Try "Messi vs Ronaldo" or "Japan vs China"'
          className="w-full pl-14 pr-32 py-5 rounded-2xl bg-white text-gray-900 text-lg placeholder:text-gray-400 shadow-2xl shadow-black/20 border-0 focus:ring-4 focus:ring-primary-400/30 outline-none transition-shadow"
          autoComplete="off"
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-colors"
        >
          Compare
        </button>
      </div>
    </form>
  );
}
