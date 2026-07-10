"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { CategoryIcon } from "@/lib/utils/category-icons";

function parseComparison(input: string): [string, string] | null {
  const patterns = [
    /^(.+?)\s+(?:vs\.?|versus|compared\s+to|against)\s+(.+)$/i,
    /^compare\s+(.+?)\s+(?:to|and|with|vs\.?)\s+(.+)$/i,
    /^differences?\s+between\s+(.+?)\s+and\s+(.+)$/i,
    /^(.+?)\s+compared\s+(?:to|with)\s+(.+)$/i,
    /^(.+?)\s+[-–—]\s+(.+)$/,
  ];
  for (const pattern of patterns) {
    const match = input.trim().match(pattern);
    if (match?.[1]?.trim() && match?.[2]?.trim()) {
      return [match[1].trim(), match[2].trim()];
    }
  }
  return null;
}

interface SearchResult {
  slug: string;
  title: string;
  category: string;
}

export function SearchOverlay() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [popular, setPopular] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const searchTimeout = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setResults([]);
    setActiveIdx(-1);
  }, []);

  // ⌘K / Ctrl+K / forward-slash global shortcut + custom event from Header
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
      // "/" opens overlay unless focus is in an input/textarea/select/contenteditable
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        const editable = (e.target as HTMLElement)?.isContentEditable;
        if (tag === "input" || tag === "textarea" || tag === "select" || editable) return;
        e.preventDefault();
        setOpen(true);
      }
    }
    const onToggle = (_e: Event) => { setOpen((prev) => !prev); };
    document.addEventListener("keydown", onKey);
    window.addEventListener("open-search-overlay", onToggle);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search-overlay", onToggle as EventListener);
    };
  }, []);

  // Focus input when overlay opens
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 60);
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  // Fetch popular on mount
  useEffect(() => {
    fetch("/api/popular")
      .then((r) => r.json())
      .then((d) => setPopular((d.comparisons || []).slice(0, 8)))
      .catch(() => {});
  }, []);

  // Live search
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    searchTimeout.current = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}&limit=8`)
        .then((r) => r.json())
        .then((d) => { setResults(d.results || []); setLoading(false); })
        .catch(() => setLoading(false));
    }, 260);
    return () => { if (searchTimeout.current) clearTimeout(searchTimeout.current); };
  }, [query]);

  useEffect(() => { setActiveIdx(-1); }, [results, query]);

  // Scroll the active result into view when keyboard navigation moves it
  useEffect(() => {
    if (activeIdx < 0 || !listboxRef.current) return;
    const options = listboxRef.current.querySelectorAll('[role="option"]');
    options[activeIdx]?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  const items = query.trim().length >= 2 ? results : popular;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    if (activeIdx >= 0 && items[activeIdx]) {
      router.push(`/compare/${items[activeIdx].slug}`);
      close();
      return;
    }
    const parsed = parseComparison(query);
    if (parsed) {
      router.push(`/compare/${slugify(parsed[0])}-vs-${slugify(parsed[1])}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
    close();
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") { close(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((p) => Math.min(p + 1, items.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((p) => Math.max(p - 1, -1)); }
    if (e.key === "Enter" && activeIdx >= 0 && items[activeIdx]) {
      e.preventDefault();
      router.push(`/compare/${items[activeIdx].slug}`);
      close();
    }
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search comparisons"
      className="fixed inset-0 z-[100] flex flex-col items-center px-4 pt-[12vh] pb-8 animate-fade-in"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-2xl">
        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          role="search"
          className="relative rounded-2xl shadow-2xl shadow-black/40 ring-2 ring-primary-400/40"
        >
          {/* Search icon / spinner */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary/60 pointer-events-none">
            {loading ? (
              <svg className="animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            )}
          </div>

          <input
            ref={inputRef}
            type="text"
            aria-label="Search comparisons"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search anything — e.g. iPhone vs Samsung…"
            className="w-full pl-12 pr-24 py-4 sm:py-5 rounded-2xl bg-white text-text text-base sm:text-lg placeholder:text-text-secondary/50 border-2 border-transparent outline-none transition-all duration-200"
            autoComplete="off"
            spellCheck={false}
            inputMode="search"
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs text-text-secondary bg-surface-alt border border-border rounded-md px-1.5 py-0.5 font-mono">
              Esc
            </kbd>
            <button
              type="submit"
              className="px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
            >
              Compare
            </button>
          </div>
        </form>

        {/* Results dropdown */}
        {items.length > 0 && (
          <div className="mt-2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/15 border border-border/80 overflow-hidden animate-slide-up">
            {/* Header */}
            <div className="px-4 py-2.5 border-b border-border/50 flex items-center justify-between bg-surface-alt/60">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider flex items-center gap-1.5">
                {query.trim().length >= 2 ? (
                  <>
                    <svg className="w-3.5 h-3.5 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Results
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 text-orange-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                    </svg>
                    Trending
                  </>
                )}
              </p>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 text-xs text-text-secondary bg-white border border-border rounded-md px-1.5 py-0.5 font-mono">
                <span aria-hidden="true">↑↓</span> navigate
              </kbd>
            </div>

            <ul ref={listboxRef} role="listbox" aria-label="Search suggestions" className="max-h-72 overflow-y-auto">
              {items.map((item, idx) => {
                const parts = item.title.match(/^(.+?)\s+vs\.?\s+(.+)$/i);
                const isActive = idx === activeIdx;
                const catKey = item.category.toLowerCase();
                const catColors: Record<string, string> = {
                  sports: "bg-green-50 text-green-700 border-green-200",
                  technology: "bg-blue-50 text-blue-700 border-blue-200",
                  countries: "bg-orange-50 text-orange-700 border-orange-200",
                  entertainment: "bg-purple-50 text-purple-700 border-purple-200",
                  health: "bg-rose-50 text-rose-700 border-rose-200",
                  companies: "bg-indigo-50 text-indigo-700 border-indigo-200",
                  automotive: "bg-yellow-50 text-yellow-700 border-yellow-200",
                };
                const catStyle = catColors[catKey] || "bg-surface-alt text-text-secondary border-border";
                return (
                  <li key={item.slug} role="option" aria-selected={isActive}>
                    <Link
                      href={`/compare/${item.slug}`}
                      onClick={close}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={`flex items-center gap-3 px-4 py-3 transition-all duration-100 border-l-2 ${
                        isActive
                          ? "bg-primary-50/80 border-l-primary-500"
                          : "hover:bg-primary-50/30 border-l-transparent"
                      }`}
                    >
                      <span className="flex-shrink-0 w-5 flex items-center justify-center text-text-secondary/70">
                        <CategoryIcon category={catKey} />
                      </span>
                      {parts ? (
                        <span className="text-sm text-text flex-1 min-w-0 flex items-center gap-1.5">
                          <span className={`font-semibold truncate max-w-[calc(50%-20px)] ${isActive ? "text-primary-800" : ""}`}>{parts[1]}</span>
                          <span className="flex-shrink-0 text-[9px] font-black text-white bg-gradient-to-r from-primary-500 to-accent-500 px-1.5 py-0.5 rounded leading-none">VS</span>
                          <span className={`font-semibold truncate max-w-[calc(50%-20px)] ${isActive ? "text-primary-800" : ""}`}>{parts[2]}</span>
                        </span>
                      ) : (
                        <span className={`text-sm flex-1 truncate font-medium ${isActive ? "text-primary-800" : "text-text"}`}>{item.title}</span>
                      )}
                      <span className={`text-xs capitalize flex-shrink-0 border px-2 py-0.5 rounded-full font-medium ${catStyle}`}>
                        {item.category}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="border-t border-border/50 bg-surface-alt/60 px-4 py-2.5 flex items-center gap-4 text-xs text-text-secondary">
              <span><kbd className="font-mono bg-white border border-border rounded px-1">↵</kbd> to go</span>
              <span><kbd className="font-mono bg-white border border-border rounded px-1">↑↓</kbd> to navigate</span>
              <span><kbd className="font-mono bg-white border border-border rounded px-1">Esc</kbd> to close</span>
            </div>
          </div>
        )}

        {/* Empty state */}
        {query.trim().length >= 2 && !loading && results.length === 0 && (
          <div className="mt-2 bg-white rounded-xl shadow-xl border border-border p-6 text-center animate-slide-up">
            <p className="text-sm text-text-secondary mb-1">No results for &ldquo;{query}&rdquo;</p>
            <p className="text-xs text-text-secondary/70">Press Enter to search all comparisons, or try adding &ldquo;vs&rdquo;</p>
          </div>
        )}
      </div>
    </div>
  );
}
