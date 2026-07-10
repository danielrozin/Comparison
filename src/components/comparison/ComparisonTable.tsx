"use client";

import { useState, useRef, useEffect } from "react";
import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

// Feature flag for A/B testing the redesigned table
const TABLE_REDESIGN =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_TABLE_REDESIGN !== "false"
    : process.env.NEXT_PUBLIC_TABLE_REDESIGN !== "false";

// Cap rendered rows per category. Overflow goes into a real <details>
// element so the content stays in the SSR HTML for SEO crawl, but the
// browser skips painting it until opened (CWV-positive). (DAN-410)
const VISIBLE_ATTRS_PER_CATEGORY = 5;

// --- Icons ---

function TrophyIcon() {
  return (
    <svg className="w-4 h-4 text-win" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  );
}

// --- Helpers ---

type WinnerSide = "a" | "b" | "tie" | null;

function getWinner(attr: ComparisonAttribute): WinnerSide {
  const valA = attr.values[0];
  const valB = attr.values[1];
  if (valA?.winner === true && valB?.winner === true) return "tie";
  if (valA?.winner === true) return "a";
  if (valB?.winner === true) return "b";
  // Neither has winner set — check if both have same text (tie) or neutral
  if (valA?.winner === false && valB?.winner === false) return "tie";
  return null;
}

function buildCategories(attributes: ComparisonAttribute[]) {
  const categories = new Map<string, ComparisonAttribute[]>();
  for (const attr of attributes) {
    const cat = attr.category || "General";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(attr);
  }
  return categories;
}

function getCategoryWinCounts(
  attrs: ComparisonAttribute[]
): { aWins: number; bWins: number; ties: number } {
  let aWins = 0;
  let bWins = 0;
  let ties = 0;
  for (const attr of attrs) {
    const w = getWinner(attr);
    if (w === "a") aWins++;
    else if (w === "b") bWins++;
    else if (w === "tie") ties++;
  }
  return { aWins, bWins, ties };
}

// --- Subcomponents ---

function ValueCell({
  value,
  isWinner,
  isLoser,
  isTie,
}: {
  value: ComparisonAttribute["values"][0] | undefined;
  isWinner: boolean;
  isLoser: boolean;
  isTie: boolean;
}) {
  const bgClass = isWinner
    ? "bg-green-50"
    : isLoser
      ? "bg-red-50/50"
      : "";
  const textClass = isWinner
    ? "text-win font-semibold"
    : isLoser
      ? "text-text-secondary"
      : "text-text";

  return (
    <td className={`px-5 py-3 text-sm text-center font-medium ${bgClass} ${textClass}`}>
      <span className="inline-flex items-center gap-1.5">
        {value?.valueText || "\u2014"}
        {isWinner && <><span className="sr-only">(winner)</span><TrophyIcon /></>}
        {isTie && (
          <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded-full">
            Tie
          </span>
        )}
      </span>
    </td>
  );
}

function MobileValueCell({
  entityName,
  value,
  isWinner,
  isLoser,
  isTie,
}: {
  entityName: string;
  value: ComparisonAttribute["values"][0] | undefined;
  isWinner: boolean;
  isLoser: boolean;
  isTie: boolean;
}) {
  const bgClass = isWinner ? "bg-green-50" : isLoser ? "bg-red-50/30" : "";
  const textClass = isWinner
    ? "text-win"
    : isLoser
      ? "text-text-secondary"
      : "text-text";

  return (
    <div className={`px-3 py-2.5 ${bgClass}`}>
      <p className="text-xs font-semibold text-text-secondary mb-0.5 truncate">
        {entityName}
      </p>
      <p className={`text-sm font-medium break-words ${textClass}`}>
        <span className="inline-flex items-center gap-1">
          {value?.valueText || "\u2014"}
          {isWinner && <TrophyIcon />}
          {isTie && (
            <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-1 py-0.5 rounded-full">
              Tie
            </span>
          )}
        </span>
      </p>
    </div>
  );
}

function GroupHeader({
  categoryName,
  aWins,
  bWins,
  ties,
  entityAName,
  entityBName,
  isOpen,
  onToggle,
}: {
  categoryName: string;
  aWins: number;
  bWins: number;
  ties: number;
  entityAName: string;
  entityBName: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const leader =
    aWins > bWins ? entityAName : bWins > aWins ? entityBName : null;
  const total = aWins + bWins + ties;
  const aPct = total > 0 ? Math.round((aWins / total) * 100) : 50;
  const bPct = total > 0 ? Math.round((bWins / total) * 100) : 50;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-label={`${isOpen ? "Collapse" : "Expand"} ${categoryName} category`}
      className="w-full flex items-center gap-3 bg-gradient-to-r from-surface-alt to-surface-alt/60 px-5 py-2.5 border-b border-border hover:from-primary-50/60 hover:to-surface-alt transition-colors cursor-pointer group/cat"
    >
      <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-text-secondary flex-shrink-0 group-hover/cat:text-primary-700 transition-colors">
        <span className="w-1.5 h-1.5 rounded-full bg-primary-400 group-hover/cat:bg-primary-600 transition-colors flex-shrink-0" />
        {categoryName}
      </span>

      {total > 0 && (
        <div className="flex-1 flex items-center gap-2 min-w-0">
          {/* Win count pills */}
          {aWins > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-700 border border-primary-200/70 whitespace-nowrap flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 inline-block" />
              {aWins}
            </span>
          )}
          {/* Mini win-rate bar */}
          <div className="flex-1 h-1.5 bg-border rounded-full overflow-hidden flex max-w-[72px]">
            <div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-300 rounded-l-full transition-all duration-500"
              style={{ width: `${aPct}%` }}
            />
            {bPct > 0 && (
              <div
                className="h-full bg-gradient-to-r from-accent-400 to-accent-300 rounded-r-full transition-all duration-500"
                style={{ width: `${bPct}%` }}
              />
            )}
          </div>
          {bWins > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-accent-100 text-accent-700 border border-accent-200/70 whitespace-nowrap flex-shrink-0">
              {bWins}
              <span className="w-1.5 h-1.5 rounded-full bg-accent-500 inline-block" />
            </span>
          )}
          {leader ? (
            <span className="text-[10px] font-medium text-text-secondary whitespace-nowrap hidden sm:block">
              {leader} leads
            </span>
          ) : (
            <span className="text-[10px] font-medium text-tie whitespace-nowrap hidden sm:block">Tied</span>
          )}
        </div>
      )}

      <ChevronIcon open={isOpen} />
    </button>
  );
}

// --- Overflow renderer for capped rows (DAN-410) ---
// Renders attrs past the visible cap in stripped markup inside <details>.
// No winner highlighting, no icons — just attribute name + the two values,
// kept in the SSR HTML so Google still indexes them.

function OverflowRowsDesktop({
  attrs,
}: {
  attrs: ComparisonAttribute[];
}) {
  if (attrs.length === 0) return null;
  return (
    <tr>
      <td colSpan={3} className="p-0">
        <details className="border-t border-border/30">
          <summary className="px-5 py-2.5 text-xs font-medium text-primary-600 hover:bg-primary-50/40 cursor-pointer select-none">
            Show {attrs.length} more attribute{attrs.length === 1 ? "" : "s"}
          </summary>
          <div role="rowgroup">
            {attrs.map((attr) => (
              <div
                key={attr.id}
                className="grid grid-cols-[40%_30%_30%] border-t border-border/20 text-sm"
              >
                <div className="px-5 py-2 text-text">
                  {attr.name}
                  {attr.unit && (
                    <span className="ml-1 text-xs text-text-secondary">
                      ({attr.unit})
                    </span>
                  )}
                </div>
                <div className="px-5 py-2 text-center text-text">
                  {attr.values[0]?.valueText || "—"}
                </div>
                <div className="px-5 py-2 text-center text-text">
                  {attr.values[1]?.valueText || "—"}
                </div>
              </div>
            ))}
          </div>
        </details>
      </td>
    </tr>
  );
}

function OverflowRowsMobile({
  attrs,
}: {
  attrs: ComparisonAttribute[];
}) {
  if (attrs.length === 0) return null;
  return (
    <details className="border-t border-border/30">
      <summary className="px-3 py-2 text-xs font-medium text-primary-600 cursor-pointer select-none bg-surface-alt/80">
        Show {attrs.length} more attribute{attrs.length === 1 ? "" : "s"}
      </summary>
      <div className="divide-y divide-border/30">
        {attrs.map((attr) => (
          <div key={attr.id} className="bg-white">
            <div className="px-3 py-1.5 bg-surface-alt/40">
              <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                {attr.name}
                {attr.unit && (
                  <span className="font-normal ml-0.5">({attr.unit})</span>
                )}
              </span>
            </div>
            <div className="grid grid-cols-2 divide-x divide-border/30 text-sm">
              <div className="px-3 py-2 text-center text-text">
                {attr.values[0]?.valueText || "—"}
              </div>
              <div className="px-3 py-2 text-center text-text">
                {attr.values[1]?.valueText || "—"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </details>
  );
}

// --- Legacy table (pre-redesign, for A/B fallback) ---

function LegacyTable({
  attributes,
  entityA,
  entityB,
}: {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const categories = buildCategories(attributes);

  return (
    <section id="comparison-table" aria-labelledby="full-comparison-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18M10 3v18M14 3v18" />
          </svg>
        </div>
        <h2 id="full-comparison-heading" className="text-2xl font-display font-bold text-text">Full Comparison</h2>
      </div>
      <div className="hidden sm:block bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[80vh] overflow-y-auto" tabIndex={0} role="region" aria-label="Comparison table — scroll to see all columns">
        <table className="w-full border-collapse">
          <caption className="sr-only">{entityA.name} vs {entityB.name} — attribute comparison table</caption>
          <thead className="sticky top-0 z-10">
            <tr className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
              <th scope="col" className="px-5 py-3.5 text-left text-sm font-semibold w-[40%]">Attribute</th>
              <th scope="col" className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">{entityA.name}</th>
              <th scope="col" className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">{entityB.name}</th>
            </tr>
          </thead>
          <tbody>
            {Array.from(categories.entries()).map(([categoryName, attrs]) => (
              <Fragment key={`cat-${categoryName}`}>
                <tr>
                  <td colSpan={3} className="bg-surface-alt px-5 py-2 border-b border-border">
                    <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                      {categoryName}
                    </span>
                  </td>
                </tr>
                {attrs.map((attr, i) => {
                  const valA = attr.values[0];
                  const valB = attr.values[1];
                  return (
                    <tr
                      key={attr.id}
                      className={`${
                        i !== attrs.length - 1 ? "border-b border-border/30" : "border-b border-border"
                      } ${i % 2 === 0 ? "bg-surface-alt/50" : ""} hover:bg-primary-50/40 hover:shadow-[inset_2px_0_0_0_#6366f1] transition-all duration-150`}
                    >
                      <th scope="row" className="px-5 py-3 text-sm font-medium text-text text-left">
                        {attr.name}
                        {attr.unit && <span className="ml-1 text-xs text-text-secondary">({attr.unit})</span>}
                      </th>
                      <td className={`px-5 py-3 text-sm text-center font-medium ${
                        valA?.winner === true ? "text-win bg-green-50/50" : valA?.winner === false ? "text-text-secondary" : "text-text"
                      }`}>
                        {valA?.valueText || "\u2014"}
                        {valA?.winner === true && (
                          <span className="ml-1.5 inline-flex items-center">
                            <span className="sr-only">(winner)</span>
                            <svg className="w-4 h-4 text-win" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </td>
                      <td className={`px-5 py-3 text-sm text-center font-medium ${
                        valB?.winner === true ? "text-win bg-green-50/50" : valB?.winner === false ? "text-text-secondary" : "text-text"
                      }`}>
                        {valB?.valueText || "\u2014"}
                        {valB?.winner === true && (
                          <span className="ml-1.5 inline-flex items-center">
                            <span className="sr-only">(winner)</span>
                            <svg className="w-4 h-4 text-win" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <div className="sm:hidden space-y-2">
        {Array.from(categories.entries()).map(([categoryName, attrs]) => (
          <div key={categoryName}>
            <div className="bg-surface-alt px-3 py-2 rounded-lg mb-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                {categoryName}
              </span>
            </div>
            <div className="space-y-2">
              {attrs.map((attr) => {
                const valA = attr.values[0];
                const valB = attr.values[1];
                return (
                  <div key={attr.id} className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
                    <div className="px-3 py-2 border-b border-border/50 bg-gradient-to-r from-surface-alt to-white">
                      <span className="text-xs font-bold text-text">
                        {attr.name}
                        {attr.unit && <span className="ml-1 text-text-secondary font-normal">({attr.unit})</span>}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 divide-x divide-border/50">
                      <div className={`px-3 py-2.5 ${valA?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-semibold text-text-secondary mb-0.5 truncate">{entityA.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valA?.winner === true ? "text-win" : valA?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valA?.valueText || "\u2014"}
                        </p>
                      </div>
                      <div className={`px-3 py-2.5 ${valB?.winner === true ? "bg-green-50" : ""}`}>
                        <p className="text-[10px] font-semibold text-text-secondary mb-0.5 truncate">{entityB.name}</p>
                        <p className={`text-sm font-medium break-words ${
                          valB?.winner === true ? "text-win" : valB?.winner === false ? "text-text-secondary" : "text-text"
                        }`}>
                          {valB?.valueText || "\u2014"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Need Fragment for legacy table
import { Fragment } from "react";

// --- Redesigned Table ---

function RedesignedTable({
  attributes,
  entityA,
  entityB,
}: {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const categories = buildCategories(attributes);
  const categoryEntries = Array.from(categories.entries());

  // Track which groups are open (all open by default)
  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(categoryEntries.map(([name]) => name))
  );
  const [winnersOnly, setWinnersOnly] = useState(false);
  const [filterQuery, setFilterQuery] = useState("");

  const headerRef = useRef<HTMLTableSectionElement>(null);

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () =>
    setOpenGroups(new Set(categoryEntries.map(([name]) => name)));
  const collapseAll = () => setOpenGroups(new Set());

  const allOpen = openGroups.size === categoryEntries.length;

  const filterNormalized = filterQuery.trim().toLowerCase();

  // When a filter is active, auto-expand all groups so results are visible
  useEffect(() => {
    if (filterNormalized) {
      setOpenGroups(new Set(categoryEntries.map(([name]) => name)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterNormalized]);

  // Filter attributes per category when winnersOnly or filterQuery is active
  const visibleCategories = categoryEntries.map(([name, attrs]) => {
    let filtered = winnersOnly ? attrs.filter((a) => getWinner(a) !== null && getWinner(a) !== "tie") : attrs;
    if (filterNormalized) {
      filtered = filtered.filter((a) => {
        const inName = a.name.toLowerCase().includes(filterNormalized);
        const inValA = a.values[0]?.valueText?.toLowerCase().includes(filterNormalized) ?? false;
        const inValB = a.values[1]?.valueText?.toLowerCase().includes(filterNormalized) ?? false;
        return inName || inValA || inValB;
      });
    }
    return [name, filtered] as [string, ComparisonAttribute[]];
  }).filter(([, attrs]) => attrs.length > 0);

  return (
    <section id="comparison-table" aria-labelledby="full-comparison-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 scroll-mt-28">
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18M10 3v18M14 3v18" />
            </svg>
          </div>
          <h2 id="full-comparison-heading" className="text-2xl font-display font-bold text-text">Full Comparison</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWinnersOnly((v) => !v)}
            aria-pressed={winnersOnly}
            className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-all px-3 py-1.5 rounded-lg border ${
              winnersOnly
                ? "bg-win/10 text-win border-win/30 hover:bg-win/20"
                : "text-text-secondary hover:text-text bg-surface-alt hover:bg-border border-transparent"
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Winners only
          </button>
          <button
            type="button"
            onClick={allOpen ? collapseAll : expandAll}
            aria-pressed={allOpen}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 hover:text-primary-700 transition-all bg-primary-50 hover:bg-primary-100 border border-transparent hover:border-primary-200 px-3 py-1.5 rounded-lg"
          >
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${allOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            {allOpen ? "Collapse all" : "Expand all"}
          </button>
        </div>
      </div>

      {/* Live attribute filter — only shown when table has enough rows to warrant it */}
      {attributes.length > 6 && (
        <div className="relative mb-4">
          <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter attributes…"
            aria-label="Filter comparison attributes"
            className="w-full pl-9 pr-9 py-2 text-sm bg-surface-alt border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-400 placeholder:text-text-secondary/50 transition-all"
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery("")}
              aria-label="Clear filter"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full hover:bg-border text-text-secondary/60 hover:text-text transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* Empty state when filter matches nothing */}
      {filterNormalized && visibleCategories.length === 0 && (
        <div className="py-12 flex flex-col items-center gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-surface-alt flex items-center justify-center">
            <svg className="w-6 h-6 text-text-secondary/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-text-secondary">No attributes match <span className="font-semibold text-text">&ldquo;{filterQuery}&rdquo;</span></p>
          <button type="button" onClick={() => setFilterQuery("")} className="text-xs text-primary-600 hover:text-primary-700 font-semibold underline underline-offset-2">
            Clear filter
          </button>
        </div>
      )}

      {/* Desktop: Table layout with sticky header */}
      <div className={`hidden md:block bg-white border border-border rounded-xl overflow-hidden ${filterNormalized && visibleCategories.length === 0 ? "hidden" : ""}`}>
        <div className="overflow-x-auto max-h-[80vh] overflow-y-auto" tabIndex={0} role="region" aria-label="Comparison table — scroll to see all columns">
          <table className="w-full border-collapse">
            <caption className="sr-only">{entityA.name} vs {entityB.name} — attribute comparison table</caption>
            <thead
              ref={headerRef}
              className="sticky top-0 z-10"
            >
              <tr className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
                <th scope="col" className="px-5 py-3.5 text-left text-sm font-semibold w-[40%]">
                  Attribute
                </th>
                <th scope="col" className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">
                  <div className="flex items-center justify-center gap-2">
                    {entityA.imageUrl && (
                      <img
                        src={entityA.imageUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover border border-white/30"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span>{entityA.name}</span>
                  </div>
                </th>
                <th scope="col" className="px-5 py-3.5 text-center text-sm font-semibold w-[30%]">
                  <div className="flex items-center justify-center gap-2">
                    {entityB.imageUrl && (
                      <img
                        src={entityB.imageUrl}
                        alt=""
                        width={24}
                        height={24}
                        className="w-6 h-6 rounded-full object-cover border border-white/30"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    <span>{entityB.name}</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {visibleCategories.map(([categoryName, attrs]) => {
                const { aWins, bWins, ties } = getCategoryWinCounts(attrs);
                const isOpen = openGroups.has(categoryName);

                return (
                  <Fragment key={`cat-${categoryName}`}>
                    <tr>
                      <td colSpan={3} className="p-0">
                        <GroupHeader
                          categoryName={categoryName}
                          aWins={aWins}
                          bWins={bWins}
                          ties={ties}
                          entityAName={entityA.name}
                          entityBName={entityB.name}
                          isOpen={isOpen}
                          onToggle={() => toggleGroup(categoryName)}
                        />
                      </td>
                    </tr>
                    {isOpen && (() => {
                      const visible = attrs.slice(0, VISIBLE_ATTRS_PER_CATEGORY);
                      const overflow = attrs.slice(VISIBLE_ATTRS_PER_CATEGORY);
                      return (
                        <>
                          {visible.map((attr, i) => {
                            const valA = attr.values[0];
                            const valB = attr.values[1];
                            const winner = getWinner(attr);
                            const isLastVisible =
                              i === visible.length - 1 && overflow.length === 0;

                            return (
                              <tr
                                key={attr.id}
                                className={`${
                                  isLastVisible
                                    ? "border-b border-border"
                                    : "border-b border-border/30"
                                } ${i % 2 === 0 ? "bg-surface-alt/40" : "bg-white"} hover:bg-primary-50/40 transition-colors`}
                              >
                                <th scope="row" className="px-5 py-3 text-sm font-medium text-text text-left">
                                  {attr.name}
                                  {attr.unit && (
                                    <span className="ml-1 text-xs text-text-secondary">
                                      ({attr.unit})
                                    </span>
                                  )}
                                </th>
                                <ValueCell
                                  value={valA}
                                  isWinner={winner === "a"}
                                  isLoser={winner === "b"}
                                  isTie={winner === "tie"}
                                />
                                <ValueCell
                                  value={valB}
                                  isWinner={winner === "b"}
                                  isLoser={winner === "a"}
                                  isTie={winner === "tie"}
                                />
                              </tr>
                            );
                          })}
                          <OverflowRowsDesktop attrs={overflow} />
                        </>
                      );
                    })()}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: Sticky entity header + compact rows for density */}
      <div className={`md:hidden ${filterNormalized && visibleCategories.length === 0 ? "hidden" : ""}`}>
        {/* Sticky entity names header */}
        <div className="sticky top-0 z-20 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 rounded-t-xl grid grid-cols-[1fr_1fr] text-white shadow-lg shadow-indigo-900/30">
          {[entityA, entityB].map((entity, idx) => (
            <div
              key={entity.id}
              className={`px-3 py-3 text-center ${idx === 0 ? "border-r border-white/10" : ""}`}
            >
              <div className="flex items-center justify-center gap-1.5">
                {entity.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={entity.imageUrl} alt="" width={20} height={20} className="w-5 h-5 rounded-full object-cover border border-white/30 flex-shrink-0" loading="lazy" decoding="async" />
                ) : (
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black flex-shrink-0 ${idx === 0 ? "bg-blue-400/40" : "bg-purple-400/40"}`}>
                    {entity.name.charAt(0).toUpperCase()}
                  </span>
                )}
                <span className="text-xs font-semibold truncate max-w-[80px]">{entity.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Category groups */}
        <div className="space-y-0 border border-border rounded-b-xl overflow-hidden">
          {visibleCategories.map(([categoryName, attrs]) => {
            const { aWins, bWins, ties } = getCategoryWinCounts(attrs);
            const isOpen = openGroups.has(categoryName);

            return (
              <div key={categoryName}>
                <GroupHeader
                  categoryName={categoryName}
                  aWins={aWins}
                  bWins={bWins}
                  ties={ties}
                  entityAName={entityA.name}
                  entityBName={entityB.name}
                  isOpen={isOpen}
                  onToggle={() => toggleGroup(categoryName)}
                />
                {isOpen && (() => {
                  const visible = attrs.slice(0, VISIBLE_ATTRS_PER_CATEGORY);
                  const overflow = attrs.slice(VISIBLE_ATTRS_PER_CATEGORY);
                  return (
                  <>
                  <div className="divide-y divide-border/40">
                    {visible.map((attr) => {
                      const valA = attr.values[0];
                      const valB = attr.values[1];
                      const winner = getWinner(attr);

                      const winnerIndicator =
                        winner === "a"
                          ? "border-l-[3px] border-l-win"
                          : winner === "b"
                            ? "border-r-[3px] border-r-win"
                            : winner === "tie"
                              ? "border-l-2 border-l-tie border-r-2 border-r-tie"
                              : "";

                      return (
                        <div key={attr.id} className={`bg-white ${winnerIndicator}`}>
                          {/* Attribute label row */}
                          <div className="px-3 py-1.5 bg-surface-alt/80">
                            <span className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide">
                              {attr.name}
                              {attr.unit && (
                                <span className="font-normal ml-0.5">({attr.unit})</span>
                              )}
                            </span>
                          </div>
                          {/* Side-by-side values — no entity name repeat (sticky header handles it) */}
                          <div className="grid grid-cols-2 divide-x divide-border/30">
                            <div className={`px-3 py-2.5 text-center ${winner === "a" ? "bg-green-50/70" : winner === "b" ? "bg-red-50/30" : ""}`}>
                              <span className={`text-sm font-medium inline-flex items-center gap-1 ${
                                winner === "a" ? "text-win" : winner === "b" ? "text-text-secondary" : "text-text"
                              }`}>
                                {valA?.valueText || "\u2014"}
                                {winner === "a" && <TrophyIcon />}
                                {winner === "tie" && (
                                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-1 py-0.5 rounded-full">Tie</span>
                                )}
                              </span>
                            </div>
                            <div className={`px-3 py-2.5 text-center ${winner === "b" ? "bg-green-50/70" : winner === "a" ? "bg-red-50/30" : ""}`}>
                              <span className={`text-sm font-medium inline-flex items-center gap-1 ${
                                winner === "b" ? "text-win" : winner === "a" ? "text-text-secondary" : "text-text"
                              }`}>
                                {valB?.valueText || "\u2014"}
                                {winner === "b" && <TrophyIcon />}
                                {winner === "tie" && (
                                  <span className="text-[10px] font-semibold bg-amber-50 text-amber-600 px-1 py-0.5 rounded-full">Tie</span>
                                )}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <OverflowRowsMobile attrs={overflow} />
                  </>
                  );
                })()}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// --- Main Export ---

export function ComparisonTable({
  attributes,
  entityA,
  entityB,
}: {
  attributes: ComparisonAttribute[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  if (!TABLE_REDESIGN) {
    return (
      <LegacyTable
        attributes={attributes}
        entityA={entityA}
        entityB={entityB}
      />
    );
  }

  return (
    <RedesignedTable
      attributes={attributes}
      entityA={entityA}
      entityB={entityB}
    />
  );
}
