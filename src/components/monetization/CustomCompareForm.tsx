"use client";

import { useState } from "react";
import Link from "next/link";
import { CustomCompareEscapes } from "@/components/monetization/CustomCompareEscapes";
import type { CustomCompareEscape } from "@/lib/data/custom-compare-escapes";
import { canonicalComparisonSlug } from "@/lib/parse-comparison-query";
import { lastSearchAttachment } from "@/lib/search/search-session";
import {
  trackCustomCompareError,
  trackCustomCompareGated,
  trackMatchupRequested,
} from "@/lib/utils/analytics";

/**
 * Asks for the two sides plus the checkout email, then posts to the gate.
 * A refusal or a backend failure keeps the request unsent and shows the
 * same live comparisons and pricing link as the top of the page.
 */
export function CustomCompareForm({
  initialA = "",
  initialB = "",
  requestSlug = "",
  escapes = [],
}: {
  initialA?: string;
  initialB?: string;
  /** Slug from /custom-compare?slug=, when the visitor came from a missing page. */
  requestSlug?: string;
  /** Live published comparisons and the pricing CTA, repeated when submit fails. */
  escapes?: readonly CustomCompareEscape[];
}) {
  const [entityA, setEntityA] = useState(initialA);
  const [entityB, setEntityB] = useState(initialB);
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [billingUrl, setBillingUrl] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setBillingUrl(null);
    setSuccess(null);

    const attachment = lastSearchAttachment();
    trackMatchupRequested({
      slug: requestSlug || canonicalComparisonSlug(entityA, entityB) || "",
      cta: "request_form",
      from_search: attachment.from_search,
      search_id: attachment.search_id,
      query_raw: attachment.query_raw,
    });

    try {
      const res = await fetch("/api/custom-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityA: entityA.trim(),
          entityB: entityB.trim(),
          email: email.trim(),
          note: note.trim() || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.ok === false) {
        const code =
          typeof data.code === "string" && data.code
            ? data.code
            : res.status === 503
              ? "unavailable"
              : "request_failed";
        if (code === "upgrade_required") trackCustomCompareGated(code);
        else trackCustomCompareError(code);
        setError(
          data.error ||
            (code === "unavailable"
              ? "We could not check membership just now. Nothing was submitted. Please try again in a minute."
              : "Something went wrong. Nothing was submitted. Please try again."),
        );
        if (typeof data.billingUrl === "string") setBillingUrl(data.billingUrl);
        return;
      }

      setSuccess(data.message || "Request received.");
    } catch {
      trackCustomCompareError("network");
      setError("Failed to submit. Nothing was sent. Please try again in a minute.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div role="status" aria-live="polite" className="bg-green-50 border border-green-200 rounded-xl p-6">
        <h2 className="text-lg font-bold text-green-800 mb-2">Request received</h2>
        <p className="text-sm text-green-700">{success}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="custom-entity-a" className="block text-sm font-medium text-text mb-1">
            First side
          </label>
          <input
            id="custom-entity-a"
            value={entityA}
            onChange={(e) => setEntityA(e.target.value)}
            required
            maxLength={200}
            autoComplete="off"
            placeholder="e.g. Notion"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
        <div>
          <label htmlFor="custom-entity-b" className="block text-sm font-medium text-text mb-1">
            Second side
          </label>
          <input
            id="custom-entity-b"
            value={entityB}
            onChange={(e) => setEntityB(e.target.value)}
            required
            maxLength={200}
            autoComplete="off"
            placeholder="e.g. Obsidian"
            className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label htmlFor="custom-email" className="block text-sm font-medium text-text mb-1">
          Email you paid with
        </label>
        <input
          id="custom-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>

      <div>
        <label htmlFor="custom-note" className="block text-sm font-medium text-text mb-1">
          Anything we should focus on <span className="text-text-secondary font-normal">(optional)</span>
        </label>
        <textarea
          id="custom-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={500}
          rows={3}
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950 space-y-3">
          <p>{error}</p>
          {billingUrl && (
            <p>
              <Link href={billingUrl} className="font-semibold text-primary-700 underline-offset-2 hover:underline">
                Manage billing
              </Link>
            </p>
          )}
          <CustomCompareEscapes links={escapes} tone="light" />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        {loading ? "Checking membership…" : "Request this comparison"}
      </button>
    </form>
  );
}
