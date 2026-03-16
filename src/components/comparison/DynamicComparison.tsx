"use client";

import { useState, useEffect, useCallback } from "react";
import type { ComparisonPageData } from "@/types";
import { ComparisonHero } from "./ComparisonHero";
import { KeyDifferencesBlock } from "./KeyDifferences";
import { ComparisonTable } from "./ComparisonTable";
import { ProsConsBlock } from "./ProsCons";
import { VerdictBlock } from "./Verdict";
import { FAQBlock } from "./FAQ";
import { ShareBar } from "@/components/engagement/ShareBar";
import { LikeButton } from "@/components/engagement/LikeButton";
import { CommentSection } from "@/components/engagement/CommentSection";

function formatSlugToTitle(slug: string): string {
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return slug.replace(/-/g, " ");
  const a = parts[0].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  const b = parts[1].replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
  return `${a} vs ${b}`;
}

export function DynamicComparison({ slug }: { slug: string }) {
  const [status, setStatus] = useState<"idle" | "generating" | "ready" | "error">("idle");
  const [comparison, setComparison] = useState<ComparisonPageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const title = formatSlugToTitle(slug);

  const startGeneration = useCallback(async () => {
    setStatus("generating");
    setError(null);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch("/api/comparisons/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const text = await res.text();
        let errorMsg = "Generation failed";
        try { errorMsg = JSON.parse(text).error || errorMsg; } catch {}
        setError(errorMsg);
        setStatus("error");
        return;
      }

      const data = await res.json();

      if (data.status === "ready" && data.comparison) {
        setComparison(data.comparison);
        setStatus("ready");
      } else {
        setError(data.error || "Generation failed. Please try again.");
        setStatus("error");
      }
    } catch (err) {
      clearTimeout(timeout);
      if (err instanceof DOMException && err.name === "AbortError") {
        setError("Request timed out. The server may be busy. Please try again.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to generate comparison");
      }
      setStatus("error");
    }
  }, [slug]);

  // Auto-start generation on mount
  useEffect(() => {
    if (status === "idle") {
      startGeneration();
    }
  }, [status, startGeneration]);

  // Generating state
  if (status === "generating" || status === "idle") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-lg">
          <div className="relative w-24 h-24 mx-auto mb-8">
            {/* Animated VS badge */}
            <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-30" />
            <div className="relative w-24 h-24 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center shadow-xl">
              <span className="text-white font-display font-black text-2xl">VS</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-display font-bold text-text mb-3">
            {title}
          </h1>
          <p className="text-text-secondary mb-6">
            We&apos;re generating this comparison for you right now. This usually takes 10-20 seconds.
          </p>

          {/* Loading animation */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary-500 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
            <span className="text-sm text-text-secondary ml-2">Analyzing data...</span>
          </div>

          <div className="bg-surface-alt rounded-xl p-4 text-left text-sm text-text-secondary space-y-2">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Researching entities...
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-500 animate-pulse" fill="currentColor" viewBox="0 0 20 20" style={{ animationDelay: "0.3s" }}>
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Comparing attributes...
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
              Generating comparison...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-display font-bold text-text mb-3">{title}</h1>
          <p className="text-text-secondary mb-4">
            {error || "We couldn't generate this comparison. Please try again."}
          </p>
          <button
            onClick={() => { setStatus("idle"); setError(null); }}
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Ready state — render the full comparison
  if (!comparison) return null;

  return (
    <>
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <ol className="flex items-center gap-2 text-sm text-text-secondary">
          <li><a href="/" className="hover:text-primary-600 transition-colors">Home</a></li>
          {comparison.category && (
            <>
              <li>/</li>
              <li>
                <a href={`/category/${comparison.category}`} className="hover:text-primary-600 transition-colors capitalize">
                  {comparison.category}
                </a>
              </li>
            </>
          )}
          <li>/</li>
          <li className="text-text font-medium truncate">{comparison.title}</li>
        </ol>
      </nav>

      {/* AI Generated banner */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-amber-800">
          <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
          This comparison was just generated by AI. Data may not be fully verified.
        </div>
      </div>

      {/* Share + Like */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <ShareBar title={comparison.title} slug={comparison.slug} />
        <LikeButton comparisonId={comparison.id} />
      </div>

      <ComparisonHero comparison={comparison} />

      {comparison.keyDifferences.length > 0 && (
        <KeyDifferencesBlock
          differences={comparison.keyDifferences}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      {comparison.attributes.length > 0 && (
        <ComparisonTable
          attributes={comparison.attributes}
          entityA={comparison.entities[0]}
          entityB={comparison.entities[1]}
        />
      )}

      <ProsConsBlock entities={comparison.entities} />

      {comparison.verdict && (
        <VerdictBlock verdict={comparison.verdict} entities={comparison.entities} />
      )}

      {comparison.faqs.length > 0 && <FAQBlock faqs={comparison.faqs} />}

      <CommentSection comparisonId={comparison.id} comparisonTitle={comparison.title} />
    </>
  );
}
