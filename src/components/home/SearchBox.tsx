"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";
import { trackComparisonSearch } from "@/lib/utils/analytics";
import Link from "next/link";

interface PopularComparison {
  slug: string;
  title: string;
  category: string;
}

interface SearchResult {
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
  software: "🖥️",
  automotive: "🚗",
};

const TYPING_SUGGESTIONS = [
  "Messi vs Ronaldo",
  "iPhone vs Samsung",
  "Python vs JavaScript",
  "Japan vs China",
  "Tesla vs BMW",
];

function parseComparison(input: string): [string, string] | null {
  const trimmed = input.trim();
  const patterns = [
    /^compare\s+(.+?)\s+(?:to|and|with|vs\.?)\s+(.+)$/i,
    /^differences?\s+between\s+(.+?)\s+and\s+(.+)$/i,
    /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
    /^(.+?)\s+(?:vs\.?|versus|compared\s+to|against)\s+(.+)$/i,
    /^(.+?)\s+[-–—]\s+(.+)$/,
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

function formatTitle(title: string): { a: string; b: string } | null {
  const match = title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
  if (match) return { a: match[1], b: match[2] };
  return null;
}

export function SearchBox() {
  const [query, setQuery] = useState("");
  const [popular, setPopular] = useState<PopularComparison[]>([]);
  const [liveResults, setLiveResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = "search-listbox";
  const router = useRouter();
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

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

  // Live search with debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim() || query.trim().length < 2) {
      setLiveResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    searchTimeout.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`)
        .then((r) => r.json())
        .then((data) => {
          setLiveResults(data.results || []);
          setIsSearching(false);
        })
        .catch(() => setIsSearching(false));
    }, 280);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  // Reset active index when results change
  useEffect(() => {
    setActiveIndex(-1);
  }, [liveResults, query]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const allItems: (PopularComparison | SearchResult)[] = query.trim().length >= 2
    ? liveResults
    : popular.slice(0, 8);

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!query.trim()) return;
      setShowDropdown(false);

      // If an item is keyboard-selected, navigate to it
      if (activeIndex >= 0 && allItems[activeIndex]) {
        router.push(`/compare/${allItems[activeIndex].slug}`);
        return;
      }

      const parsed = parseComparison(query);
      if (parsed) {
        const slug = `${slugify(parsed[0])}-vs-${slugify(parsed[1])}`;
        trackComparisonSearch(query.trim(), "comparison");
        router.push(`/compare/${slug}`);
        return;
      }

      trackComparisonSearch(query.trim(), "general");
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    },
    [query, router, activeIndex, allItems]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || allItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => Math.min(prev + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => Math.max(prev - 1, -1));
    } else if (e.key === "Escape") {
      setShowDropdown(false);
      setActiveIndex(-1);
    } else if (e.key === "Enter" && activeIndex >= 0 && allItems[activeIndex]) {
      e.preventDefault();
      router.push(`/compare/${allItems[activeIndex].slug}`);
      setShowDropdown(false);
    }
  }

  const showingLive = query.trim().length >= 2;
  const hasResults = allItems.length > 0;

  return (
    <div ref={wrapperRef} className="relative">
      <form onSubmit={handleSearch} role="search">
        <div
          className={`relative rounded-2xl transition-all duration-200 ${
            isFocused
              ? "ring-4 ring-primary-400/50 ring-offset-1 ring-offset-transparent shadow-2xl shadow-primary-500/30"
              : "shadow-2xl shadow-black/20"
          }`}
        >
          {/* Search icon or loading spinner */}
          <div className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/60 pointer-events-none">
            {isSearching ? (
              <svg className="animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-label="Search comparisons"
            aria-expanded={showDropdown && hasResults}
            aria-autocomplete="list"
            aria-controls={listboxId}
            aria-activedescendant={activeIndex >= 0 ? `search-option-${activeIndex}` : undefined}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setShowDropdown(true);
              setIsFocused(true);
            }}
            onBlur={() => setIsFocused(false)}
            onKeyDown={handleKeyDown}
            placeholder={`Try "${TYPING_SUGGESTIONS[suggestionIndex]}"`}
            className="w-full pl-12 sm:pl-14 pr-24 sm:pr-32 py-4 sm:py-5 rounded-2xl bg-white text-text text-base sm:text-lg placeholder:text-text-secondary/50 border-2 border-transparent focus:border-primary-300 focus:ring-4 focus:ring-primary-300/20 outline-none transition-all duration-200"
            autoComplete="off"
            inputMode="search"
            spellCheck={false}
          />
          <button
            type="submit"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 active:from-primary-800 active:to-primary-700 text-white font-semibold rounded-xl transition-all duration-150 text-sm sm:text-base shadow-md hover:shadow-lg"
          >
            Compare
          </button>
        </div>
      </form>

      {/* Ghost text suggestion — only when closed and empty */}
      {!query && !showDropdown && (
        <p className="absolute -bottom-7 left-0 right-0 text-center text-xs text-white/50 animate-fade-in">
          Type anything — e.g. &quot;{TYPING_SUGGESTIONS[suggestionIndex]}&quot;
        </p>
      )}

      {/* Dropdown */}
      {showDropdown && hasResults && (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/15 border border-border/80 overflow-hidden z-50 animate-slide-up"
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between bg-surface-alt/60">
            <p className="text-[11px] font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
              {showingLive ? (
                <>
                  <svg className="w-3.5 h-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Results for &ldquo;{query}&rdquo;
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                  </svg>
                  Popular right now
                </>
              )}
            </p>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-text-secondary bg-white border border-border rounded-md px-1.5 py-0.5 font-mono">
              ↑↓ navigate
            </kbd>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {allItems.map((item, idx) => {
              const parts = formatTitle(item.title);
              const isActive = idx === activeIndex;
              const catKey = item.category.toLowerCase();
              const catColors: Record<string, string> = {
                sports: "bg-green-50 text-green-700 border-green-200",
                technology: "bg-blue-50 text-blue-700 border-blue-200",
                countries: "bg-orange-50 text-orange-700 border-orange-200",
                finance: "bg-emerald-50 text-emerald-700 border-emerald-200",
                entertainment: "bg-purple-50 text-purple-700 border-purple-200",
                health: "bg-rose-50 text-rose-700 border-rose-200",
                companies: "bg-indigo-50 text-indigo-700 border-indigo-200",
                automotive: "bg-yellow-50 text-yellow-700 border-yellow-200",
              };
              const catStyle = catColors[catKey] || "bg-surface-alt text-text-secondary border-border";
              return (
                <Link
                  key={item.slug}
                  id={`search-option-${idx}`}
                  role="option"
                  aria-selected={isActive}
                  href={`/compare/${item.slug}`}
                  onClick={() => setShowDropdown(false)}
                  className={`flex items-center gap-3 px-4 py-3 transition-all duration-100 border-l-2 ${
                    isActive
                      ? "bg-primary-50/80 border-l-primary-500"
                      : "hover:bg-primary-50/30 border-l-transparent"
                  }`}
                >
                  <span className="text-base flex-shrink-0 w-5 text-center leading-none" aria-hidden="true">
                    {CATEGORY_ICONS[catKey] || "📊"}
                  </span>
                  {parts ? (
                    <span className="text-sm text-text flex-1 min-w-0 flex items-center gap-1.5">
                      <span className={`font-semibold truncate max-w-[calc(50%-20px)] ${isActive ? "text-primary-800" : ""}`}>{parts.a}</span>
                      <span className="flex-shrink-0 text-[9px] font-black text-white bg-gradient-to-r from-primary-500 to-accent-500 px-1.5 py-0.5 rounded leading-none">VS</span>
                      <span className={`font-semibold truncate max-w-[calc(50%-20px)] ${isActive ? "text-primary-800" : ""}`}>{parts.b}</span>
                    </span>
                  ) : (
                    <span className={`text-sm flex-1 truncate font-medium ${isActive ? "text-primary-800" : "text-text"}`}>{item.title}</span>
                  )}
                  <span className={`text-[10px] capitalize flex-shrink-0 border px-2 py-0.5 rounded-full font-medium ${catStyle}`}>
                    {item.category}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Footer */}
          <div className="border-t border-border/50 bg-surface-alt/60 px-4 py-2 flex items-center justify-between">
            {showingLive ? (
              <>
                <span className="text-[11px] text-text-secondary font-medium">
                  {liveResults.length} result{liveResults.length !== 1 ? "s" : ""}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setShowDropdown(false);
                    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
                  }}
                  className="text-[11px] font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  See all results
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </button>
              </>
            ) : (
              <span className="text-[11px] text-text-secondary/70">Press Enter to search</span>
            )}
          </div>
        </div>
      )}

      {/* Empty state when typing but no results yet */}
      {showDropdown && showingLive && !isSearching && liveResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-border z-50 animate-slide-up">
          <div className="px-4 py-6 text-center">
            <p className="text-sm text-text-secondary mb-1">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-text-secondary/70">
              Press Enter to search, or try &ldquo;{query} vs ...&rdquo;
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
