"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { slugify } from "@/lib/utils/slugify";

export function EntityCompareSearch({ entityName, entitySlug }: { entityName: string; entitySlug: string }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<{ slug: string; title: string }[]>([]);
  const [focused, setFocused] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const listboxId = "entity-compare-listbox";

  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        if (!res.ok) return;
        const data = await res.json();
        // Filter out comparisons that don't feature the entity
        const raw = (data.results || []) as { slug: string; title: string }[];
        // Extract unique opponent names from results
        const opponents: { slug: string; title: string }[] = [];
        const seen = new Set<string>();
        for (const r of raw) {
          const parts = r.title.split(/\s+vs\.?\s+/i);
          const a = parts[0]?.trim();
          const b = parts[1]?.trim();
          if (!a || !b) continue;
          const aSlug = slugify(a);
          const bSlug = slugify(b);
          const isEntityA = aSlug === entitySlug || a.toLowerCase().includes(entityName.toLowerCase().slice(0, 5));
          const isEntityB = bSlug === entitySlug || b.toLowerCase().includes(entityName.toLowerCase().slice(0, 5));
          const opponentName = isEntityA ? b : isEntityB ? a : null;
          if (opponentName && !seen.has(opponentName.toLowerCase())) {
            seen.add(opponentName.toLowerCase());
            opponents.push({ slug: r.slug, title: opponentName });
          }
        }
        // Also add raw search results as direct targets
        for (const r of raw) {
          if (opponents.length >= 5) break;
          if (!seen.has(r.title.toLowerCase())) {
            seen.add(r.title.toLowerCase());
            opponents.push({ slug: `${entitySlug}-vs-${slugify(r.title)}`, title: r.title });
          }
        }
        setSuggestions(opponents.slice(0, 5));
        setActiveIdx(-1);
      } catch {
        // ignore
      }
    }, 250);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, entitySlug, entityName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const opponentSlug = slugify(query.trim());
    router.push(`/compare/${entitySlug}-vs-${opponentSlug}`);
  };

  const handleSelect = (slug: string) => {
    router.push(`/compare/${slug}`);
  };

  return (
    <div className="mt-5 relative">
      <p className="text-xs font-semibold text-primary-200 uppercase tracking-widest mb-2">
        Compare {entityName} with…
      </p>
      <form onSubmit={handleSubmit} role="search">
        <div className="relative">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            inputMode="search"
            enterKeyHint="go"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setTimeout(() => { setFocused(false); setActiveIdx(-1); }, 150)}
            onKeyDown={(e) => {
              const len = suggestions.length;
              if (!len) return;
              if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, len - 1)); }
              else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
              else if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); handleSelect(suggestions[activeIdx]!.slug); }
              else if (e.key === "Escape") { setFocused(false); setActiveIdx(-1); }
            }}
            placeholder={`e.g. ${entityName === "iPhone" ? "Samsung" : "Android"}, Tesla, Germany…`}
            aria-label={`Compare ${entityName} with`}
            role="combobox"
            aria-haspopup="listbox"
            aria-expanded={focused && suggestions.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIdx >= 0 ? `entity-compare-option-${activeIdx}` : undefined}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl text-sm bg-white text-text placeholder:text-text-secondary/40 focus:ring-2 focus:ring-primary-400/50 outline-none border border-border focus:border-primary-400 transition-all"
          />
          <button
            type="submit"
            aria-label={query.trim() ? `Compare ${entityName} vs ${query.trim()}` : `Compare ${entityName} with another`}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-2 min-h-[36px] bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white font-semibold rounded-lg text-xs transition-all shadow-sm"
          >
            Compare
          </button>
        </div>
      </form>

      {/* Suggestions dropdown */}
      {focused && suggestions.length > 0 && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={`Compare ${entityName} with suggestions`}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden list-none"
        >
          {suggestions.map((s, idx) => (
            <li
              key={s.slug}
              id={`entity-compare-option-${idx}`}
              role="option"
              aria-selected={activeIdx === idx}
            >
              <button
                type="button"
                onMouseDown={() => handleSelect(s.slug)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors text-sm ${activeIdx === idx ? "bg-primary-50" : "hover:bg-primary-50"}`}
              >
                <div aria-hidden="true" className="flex -space-x-1.5 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white">
                    {entityName.charAt(0)}
                  </div>
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center text-xs font-bold text-white ring-1 ring-white">
                    {s.title.charAt(0)}
                  </div>
                </div>
                <span className="font-medium text-text">
                  {entityName} <span className="text-text-secondary font-normal">vs</span> {s.title}
                </span>
                <svg className="w-3.5 h-3.5 text-text-secondary ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
