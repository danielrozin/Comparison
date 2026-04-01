"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { saveSearchContext } from "@/components/navigation/BackToResults";
import { trackSearch } from "@/lib/utils/analytics";
import Link from "next/link";

interface PopularComparison {
  slug: string;
  title: string;
  category: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  sports: "⚽",
  countries: "🌍",
  technology: "💻",
  products: "📦",
  health: "💊",
  finance: "💰",
  education: "🎓",
  entertainment: "🎬",
  history: "📜",
  military: "🎖️",
  economy: "📈",
  companies: "🏢",
  brands: "🏷️",
  celebrities: "⭐",
};

const TYPING_SUGGESTIONS = [
  "Messi vs Ronaldo",
  "iPhone vs Samsung",
  "Python vs JavaScript",
  "Japan vs China",
  "Tesla vs BMW",
];

// Parse user input into two entities, supporting many formats
function parseComparison(input: string): [string, string] | null {
  const trimmed = input.trim();

  // Pattern priority order — most specific first
  const patterns = [
    // "compare A to/and/with/vs B"
    /^compare\s+(.+?)\s+(?:to|and|with|vs\.?)\s+(.+)$/i,
    // "difference(s) between A and B"
    /^differences?\s+between\s+(.+?)\s+and\s+(.+)$/i,
    // "A compared to/with B"
    /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
    // "A vs/versus/vs./or/against B"
    /^(.+?)\s+(?:vs\.?|versus|compared\s+to|against)\s+(.+)$/i,
    // "A - B" or "A – B" or "A — B" (dash separators)
    /^(.+?)\s+[-–—]\s+(.+)$/,
    // "A or B" (only if both sides are short — likely a comparison)
    /^(.{2,40}?)\s+or\s+(.{2,40})$/i,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match && match[1].trim() && match[2].trim()) {
      return [match[1].trim(), match[2].trim()];
    }
  }

  return null;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [popular, setPopular] = useState<PopularComparison[]>([]);
  const [searchResults, setSearchResults] = useState<PopularComparison[]>([]);
  const [showPopular, setShowPopular] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  // Cycle typing suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % TYPING_SUGGESTIONS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Fetch popular comparisons on mount
  useEffect(() => {
    fetch("/api/popular")
      .then((r) => r.json())
      .then((data) => setPopular(data.comparisons || []))
      .catch(() => {});
  }, []);

  // Debounced search for single-entity / partial queries
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2 || parseComparison(trimmed)) {
      setSearchResults([]);
      return;
    }
    searchTimerRef.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=6`)
        .then((r) => r.json())
        .then((data) => setSearchResults(data.results || []))
        .catch(() => setSearchResults([]));
    }, 300);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowPopular(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      setShowPopular(false);
      trackSearch(query.trim());

      const parsed = parseComparison(query);
      if (parsed) {
        const slug = `${slugify(parsed[0])}-vs-${slugify(parsed[1])}`;
        router.push(`/compare/${slug}`);
        return;
      }

      // Otherwise, go to search
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [query, router]
  );

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSearch} className="relative">
        <div
          className={`relative rounded-2xl transition-all duration-300 ${
            isFocused
              ? "ring-4 ring-primary-400/30 shadow-2xl shadow-primary-500/20"
              : "shadow-2xl shadow-black/20"
          }`}
        >
          <svg
            className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
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
            onFocus={() => {
              setShowPopular(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={`Try "${TYPING_SUGGESTIONS[suggestionIndex]}"`}
            className="w-full pl-12 sm:pl-14 pr-24 sm:pr-32 py-4 sm:py-5 rounded-2xl bg-white text-gray-900 text-base sm:text-lg placeholder:text-gray-400 border-2 border-transparent focus:border-primary-400/50 outline-none transition-all duration-300"
            autoComplete="off"
          />
          <button
            type="submit"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all text-sm sm:text-base animate-pulse-subtle hover:animate-none"
          >
            Compare
          </button>
        </div>
      </form>

      {/* Ghost text suggestion */}
      {!query && !showPopular && (
        <p className="absolute -bottom-7 left-0 right-0 text-center text-xs text-white/50 animate-fade-in">
          Type anything — e.g. &quot;{TYPING_SUGGESTIONS[suggestionIndex]}&quot;
        </p>
      )}

      {/* Search results dropdown (single-entity / partial queries) */}
      {isFocused && query.trim().length >= 2 && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-slide-up">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Matching comparisons
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {searchResults.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                onClick={() => {
                  setShowPopular(false);
                  saveSearchContext(query, `/search?q=${encodeURIComponent(query)}`);
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base flex-shrink-0">
                  {CATEGORY_ICONS[item.category.toLowerCase()] || "📊"}
                </span>
                <span className="text-sm text-gray-700 flex-1 truncate">{item.title}</span>
                <span className="text-[10px] text-gray-400 capitalize flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Popular comparisons dropdown */}
      {showPopular && popular.length > 0 && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-slide-up">
          <div className="px-4 py-2.5 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              Popular right now
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {popular.slice(0, 8).map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                onClick={() => setShowPopular(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-base flex-shrink-0">
                  {CATEGORY_ICONS[item.category.toLowerCase()] || "📊"}
                </span>
                <span className="text-sm text-gray-700 flex-1 truncate">{item.title}</span>
                <span className="text-[10px] text-gray-400 capitalize flex-shrink-0 bg-gray-100 px-2 py-0.5 rounded-full">
                  {item.category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
