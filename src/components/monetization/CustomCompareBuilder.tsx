"use client";

import { useState } from "react";
import { canonicalComparisonSlug } from "@/lib/parse-comparison-query";
import { trackCustomCompareBuildStarted } from "@/lib/utils/analytics";

/**
 * ROO-132 — free path on /custom-compare. Two names go straight to
 * /compare/<a>-vs-<b>. A published page opens. A missing one opens the
 * on-demand builder on the 404 (only rendered when generation is on).
 * The Pro request form stays below as the secondary option.
 */
export function CustomCompareBuilder({
  initialA = "",
  initialB = "",
}: {
  initialA?: string;
  initialB?: string;
}) {
  const [a, setA] = useState(initialA);
  const [b, setB] = useState(initialB);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      data-testid="custom-compare-builder"
      className="bg-white border border-primary-200 rounded-xl p-5 shadow-sm space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const slug = canonicalComparisonSlug(a.trim(), b.trim());
        if (!slug) {
          setError("Enter two different things to compare.");
          return;
        }
        setError(null);
        trackCustomCompareBuildStarted(slug);
        window.location.assign(`/compare/${slug}`);
      }}
    >
      <p className="text-base font-bold text-text m-0">Compare any two things, free</p>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        <label htmlFor="ccb-a" className="sr-only">First item</label>
        <input
          id="ccb-a"
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="e.g. Keurig"
          maxLength={200}
          className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <span className="text-sm font-semibold text-text-secondary text-center">vs</span>
        <label htmlFor="ccb-b" className="sr-only">Second item</label>
        <input
          id="ccb-b"
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="e.g. Nespresso"
          maxLength={200}
          className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-lg bg-primary-600 px-4 py-2 text-sm font-bold text-white hover:bg-primary-700"
        >
          Compare
        </button>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-600 m-0">
          {error}
        </p>
      )}
    </form>
  );
}
