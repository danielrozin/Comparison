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
import { EmbedButton } from "@/components/comparison/EmbedButton";
import { CommentSection } from "@/components/engagement/CommentSection";

const FUN_FACTS = [
  "Did you know? We\u2019ve compared 107+ topics!",
  "Our AI analyzes dozens of data points for each comparison.",
  "Every comparison is unique and generated in real-time.",
  "We compare everything from tech to food to travel destinations.",
];

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
  const [progress, setProgress] = useState(0);
  const [funFact] = useState(() => FUN_FACTS[Math.floor(Math.random() * FUN_FACTS.length)]);
  const title = formatSlugToTitle(slug);

  // Animate progress bar during generation
  useEffect(() => {
    if (status !== "generating") return;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 8 + 2;
      });
    }, 800);
    return () => clearInterval(interval);
  }, [status]);

  const startGeneration = useCallback(async () => {
    setStatus("generating");
    setError(null);
    setProgress(5);

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
        setProgress(100);
        setComparison(data.comparison);
        setStatus("ready");

        // Log to recent searches
        const parts = slug.split("-vs-");
        fetch("/api/recent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            title: data.comparison.title,
            entityA: parts[0]?.replace(/-/g, " ") || "",
            entityB: parts[1]?.replace(/-/g, " ") || "",
            generated: true,
          }),
        }).catch(() => {});
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

  // Generating state — skeleton UI mimicking actual comparison layout
  if (status === "generating" || status === "idle") {
    const entityNames = slug.split("-vs-");
    const entityA = entityNames[0]?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Entity A";
    const entityB = entityNames[1]?.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) || "Entity B";

    return (
      <div className="animate-in fade-in duration-300">
        {/* Progress overlay banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
          <div className="bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-200/50 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-sm font-medium text-primary-700">
                Generating comparison... This usually takes 10-20 seconds.
              </p>
            </div>
            <div className="w-full bg-primary-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-500 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <p className="text-xs text-primary-600 mt-1.5">{Math.round(Math.min(progress, 100))}% complete &middot; {funFact}</p>
          </div>
        </div>

        {/* Skeleton Hero — two entity cards with VS badge */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mx-auto mb-3" />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-text">{title}</h1>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-8">
            {/* Entity A skeleton card */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full mx-auto mb-3 sm:mb-4 animate-pulse" />
              <p className="font-display font-bold text-lg sm:text-xl text-text">{entityA}</p>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto mt-1.5" />
            </div>

            {/* VS badge */}
            <div className="relative">
              <div className="absolute inset-0 bg-primary-100 rounded-full animate-ping opacity-20" />
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-600 to-accent-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-display font-black text-lg sm:text-xl">VS</span>
              </div>
            </div>

            {/* Entity B skeleton card */}
            <div className="text-center">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-accent-50 to-accent-400/30 rounded-full mx-auto mb-3 sm:mb-4 animate-pulse" />
              <p className="font-display font-bold text-lg sm:text-xl text-text">{entityB}</p>
              <div className="h-3 w-24 bg-gray-200 rounded animate-pulse mx-auto mt-2" />
              <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mx-auto mt-1.5" />
            </div>
          </div>
        </section>

        {/* Skeleton Key Differences */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`grid grid-cols-[1fr_auto_1fr] gap-4 px-4 py-4 ${i < 3 ? "border-b border-border/50" : ""}`}>
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                </div>
                <div className="h-4 w-24 bg-gray-100 rounded animate-pulse self-center" style={{ animationDelay: `${i * 150 + 50}ms` }} />
                <div className="flex flex-col gap-1.5 items-center">
                  <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" style={{ animationDelay: `${i * 150 + 100}ms` }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Comparison Table */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-7 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white border border-border rounded-xl overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-3 bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-900 px-5 py-3.5">
              <div className="h-4 w-20 bg-white/20 rounded" />
              <div className="h-4 w-24 bg-white/20 rounded mx-auto" />
              <div className="h-4 w-24 bg-white/20 rounded ml-auto" />
            </div>
            {/* Table rows */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`grid grid-cols-3 px-5 py-3.5 ${i < 5 ? "border-b border-border/50" : ""}`}>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse mx-auto" style={{ animationDelay: `${i * 100 + 50}ms` }} />
                <div className="h-3 w-20 bg-gray-200 rounded animate-pulse ml-auto" style={{ animationDelay: `${i * 100 + 100}ms` }} />
              </div>
            ))}
          </div>
        </section>

        {/* Skeleton Verdict */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-7 w-28 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse mb-3" />
            <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
          </div>
        </section>
      </div>
    );
  }

  // Error state
  if (status === "error") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">&#x1F614;</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-text mb-3">{title}</h1>
          <p className="text-text-secondary mb-2">
            Oops! Something didn&apos;t go as planned.
          </p>
          <p className="text-sm text-text-secondary mb-6">
            {error || "We couldn't generate this comparison. Please try again."}
          </p>
          <button
            onClick={() => { setStatus("idle"); setError(null); setProgress(0); }}
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-accent-500 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-accent-600 transition-all shadow-md"
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

      {/* Share + Like + Embed */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex items-center justify-between">
        <ShareBar title={comparison.title} slug={comparison.slug} />
        <div className="flex items-center gap-2">
          <EmbedButton slug={comparison.slug} title={comparison.title} />
          <LikeButton comparisonId={comparison.id} />
        </div>
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
