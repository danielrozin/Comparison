import Link from "next/link";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";

interface ExpertAnalysisProps {
  analysis: string;
  entityAName: string;
  entityBName: string;
  updatedAt: string;
  /** Compare slug. Daniel's byline renders only when this slug is on HUMAN_REVIEWED_SLUGS. */
  slug?: string;
  /** Overrides the default "Analysis: A vs B" heading (used for 3-way pages). */
  heading?: string;
}

export function ExpertAnalysis({ analysis, entityAName, entityBName, updatedAt, slug, heading }: ExpertAnalysisProps) {
  if (!analysis) return null;

  const humanReviewed = isHumanReviewedSlug(slug);
  const paragraphs = analysis.split(/\n\n+/).filter(Boolean);

  return (
    <ScrollReveal delay={60}>
    <section
      id="expert-analysis"
      aria-labelledby="expert-analysis-heading"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 scroll-mt-28"
    >
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-7 py-5 border-b border-border bg-gradient-to-r from-slate-50 to-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 id="expert-analysis-heading" className="text-lg sm:text-xl font-display font-bold text-text">
              {heading ?? `Analysis: ${entityAName} vs ${entityBName}`}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {humanReviewed && (
                <>
                  <Link
                    href="/authors/daniel-rozin"
                    rel="author"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-700 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center ring-1 ring-white shadow-sm flex-shrink-0 group-hover:shadow-md transition-all duration-150" aria-hidden="true">
                      <span className="text-white font-bold text-xs tracking-tight select-none leading-none">DR</span>
                    </div>
                    <span>Daniel Rozin, Editor-in-Chief</span>
                  </Link>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 leading-none">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Human reviewed
                  </span>
                  <span className="text-border text-xs" aria-hidden="true">·</span>
                </>
              )}
              <time
                dateTime={updatedAt}
                className="text-xs text-text-secondary"
              >
                Updated {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>
          </div>
        </div>

        {/* Analysis body — first 3 paragraphs always visible; rest in a <details> fold.
            Using native <details> keeps the full text in SSR HTML (crawlable by AI/SEO)
            while preventing an overwhelming wall of text on first load. */}
        <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
          {paragraphs.slice(0, 3).map((para, i) => (
            <p key={i} className="text-base text-text leading-relaxed">
              {para}
            </p>
          ))}
          {paragraphs.length > 3 && (
            <details className="group">
              <summary className="list-none cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group-open:hidden transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Read {paragraphs.length - 3} more paragraph{paragraphs.length - 3 !== 1 ? "s" : ""}
                </span>
                <span className="hidden group-open:inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text transition-colors">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Show less
                </span>
              </summary>
              <div className="space-y-4 mt-4">
                {paragraphs.slice(3).map((para, i) => (
                  <p key={i + 3} className="text-base text-text leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Footer: who wrote this, and how. Compatible with the methodology link. */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-border bg-slate-50 flex items-center gap-2 text-xs text-text-secondary">
          <span>
            Drafted with AI from web research.{" "}
            <Link href="/how-we-write-verdicts" className="underline hover:text-primary-700 transition-colors">
              How we research
            </Link>
          </span>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
}
