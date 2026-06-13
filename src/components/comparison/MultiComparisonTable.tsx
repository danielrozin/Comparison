"use client";

import { Fragment, useState } from "react";
import type { ComparisonAttribute, ComparisonEntityData } from "@/types";

function TrophyIcon() {
  return (
    <svg className="w-4 h-4 text-win inline-block" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
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

function buildCategories(attributes: ComparisonAttribute[]) {
  const categories = new Map<string, ComparisonAttribute[]>();
  for (const attr of attributes) {
    const cat = attr.category || "General";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(attr);
  }
  return categories;
}

/** Returns the index of the winning entity for an attribute, or -1 if none/tie. */
function getWinnerIndex(attr: ComparisonAttribute): number {
  let firstWinner = -1;
  let winnerCount = 0;
  for (let i = 0; i < attr.values.length; i++) {
    if (attr.values[i]?.winner === true) {
      if (firstWinner === -1) firstWinner = i;
      winnerCount++;
    }
  }
  // Multiple winners flagged → treat as tie (no highlight)
  if (winnerCount !== 1) return -1;
  return firstWinner;
}

/**
 * MultiComparisonTable
 * Renders an attribute-by-entity grid for N entities (N >= 2). Works for any N,
 * but optimized for 3–5 entities. For very large N (6+) the table scrolls horizontally.
 */
export function MultiComparisonTable({
  attributes,
  entities,
}: {
  attributes: ComparisonAttribute[];
  entities: ComparisonEntityData[];
}) {
  const categories = buildCategories(attributes);
  const categoryEntries = Array.from(categories.entries());

  const [openGroups, setOpenGroups] = useState<Set<string>>(
    () => new Set(categoryEntries.map(([name]) => name))
  );

  const toggleGroup = (name: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const expandAll = () => setOpenGroups(new Set(categoryEntries.map(([name]) => name)));
  const collapseAll = () => setOpenGroups(new Set());
  const allOpen = openGroups.size === categoryEntries.length;

  const n = entities.length;
  // Tailwind needs the grid-cols-N class to be statically known at build time.
  // We render via inline style instead so the class set is bounded.
  const valueColTemplate = `repeat(${n}, minmax(0, 1fr))`;
  const attrColWidth = n >= 5 ? "30%" : n === 4 ? "32%" : "36%";

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold text-text">Full Comparison</h2>
        <button
          type="button"
          onClick={allOpen ? collapseAll : expandAll}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
        >
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>

      {/* Desktop: full table */}
      <div className="hidden md:block bg-white border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto max-h-[80vh] overflow-y-auto">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr className="bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 text-white">
                <th className="px-5 py-3.5 text-left text-sm font-semibold" style={{ width: attrColWidth }}>
                  Attribute
                </th>
                {entities.map((ent) => (
                  <th
                    key={ent.id}
                    className="px-3 py-3.5 text-center text-sm font-semibold"
                    style={{ width: `calc((100% - ${attrColWidth}) / ${n})` }}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {ent.imageUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={ent.imageUrl}
                          alt=""
                          className="w-6 h-6 rounded-full object-cover border border-white/30 flex-shrink-0"
                        />
                      )}
                      <span className="truncate" title={ent.name}>
                        {ent.name}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categoryEntries.map(([categoryName, attrs]) => {
                const isOpen = openGroups.has(categoryName);
                return (
                  <Fragment key={`cat-${categoryName}`}>
                    <tr>
                      <td colSpan={n + 1} className="p-0">
                        <button
                          type="button"
                          onClick={() => toggleGroup(categoryName)}
                          className="w-full flex items-center justify-between bg-surface-alt px-5 py-2.5 border-b border-border hover:bg-gray-100/80 transition-colors cursor-pointer"
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                            {categoryName}
                          </span>
                          <ChevronIcon open={isOpen} />
                        </button>
                      </td>
                    </tr>
                    {isOpen &&
                      attrs.map((attr, i) => {
                        const winnerIdx = getWinnerIndex(attr);
                        return (
                          <tr
                            key={attr.id}
                            className={`${
                              i !== attrs.length - 1 ? "border-b border-border/30" : "border-b border-border"
                            } hover:bg-primary-50/30 transition-colors`}
                          >
                            <td className="px-5 py-3 text-sm font-medium text-text">
                              {attr.name}
                              {attr.unit && (
                                <span className="ml-1 text-xs text-text-secondary">({attr.unit})</span>
                              )}
                            </td>
                            {entities.map((_ent, eIdx) => {
                              const v = attr.values[eIdx];
                              const isWinner = winnerIdx === eIdx;
                              const isLoser = winnerIdx !== -1 && winnerIdx !== eIdx;
                              const bg = isWinner ? "bg-green-50" : isLoser ? "bg-red-50/40" : "";
                              const fg = isWinner ? "text-win font-semibold" : isLoser ? "text-text-secondary" : "text-text";
                              return (
                                <td
                                  key={`${attr.id}-${eIdx}`}
                                  className={`px-3 py-3 text-sm text-center font-medium ${bg} ${fg}`}
                                >
                                  <span className="inline-flex items-center gap-1.5">
                                    {v?.valueText || "—"}
                                    {isWinner && <TrophyIcon />}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked per-attribute card with horizontal value grid */}
      <div className="md:hidden space-y-3">
        {categoryEntries.map(([categoryName, attrs]) => {
          const isOpen = openGroups.has(categoryName);
          return (
            <div key={categoryName} className="bg-white border border-border rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleGroup(categoryName)}
                className="w-full flex items-center justify-between bg-surface-alt px-3 py-2.5 border-b border-border hover:bg-gray-100/80 transition-colors cursor-pointer"
              >
                <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {categoryName}
                </span>
                <ChevronIcon open={isOpen} />
              </button>
              {isOpen && (
                <div className="divide-y divide-border/40">
                  {attrs.map((attr) => {
                    const winnerIdx = getWinnerIndex(attr);
                    return (
                      <div key={attr.id} className="p-3">
                        <p className="text-[11px] font-semibold text-text-secondary uppercase tracking-wide mb-2">
                          {attr.name}
                          {attr.unit && <span className="font-normal ml-1">({attr.unit})</span>}
                        </p>
                        <div
                          className="grid gap-2"
                          style={{ gridTemplateColumns: valueColTemplate }}
                        >
                          {entities.map((ent, eIdx) => {
                            const v = attr.values[eIdx];
                            const isWinner = winnerIdx === eIdx;
                            const bg = isWinner ? "bg-green-50 border-win/30" : "bg-gray-50 border-border";
                            const fg = isWinner ? "text-win font-semibold" : "text-text";
                            return (
                              <div
                                key={`${attr.id}-${eIdx}`}
                                className={`text-center px-2 py-1.5 rounded border ${bg}`}
                              >
                                <p className="text-[10px] text-text-secondary truncate mb-0.5" title={ent.name}>
                                  {ent.name}
                                </p>
                                <p className={`text-sm break-words ${fg}`}>
                                  {v?.valueText || "—"}
                                  {isWinner && (
                                    <span className="ml-1 inline-block align-middle">
                                      <TrophyIcon />
                                    </span>
                                  )}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
