import Link from "next/link";
import { SITE_URL } from "@/lib/utils/constants";

interface ExpertAnalysisProps {
  analysis: string;
  entityAName: string;
  entityBName: string;
  updatedAt: string;
}

export function ExpertAnalysis({ analysis, entityAName, entityBName, updatedAt }: ExpertAnalysisProps) {
  if (!analysis) return null;

  const paragraphs = analysis.split(/\n\n+/).filter(Boolean);

  return (
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
              Expert Analysis: {entityAName} vs {entityBName}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <Link
                href="/authors/daniel-rozin"
                className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-700 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                <span>Daniel Rozin, Editor-in-Chief</span>
              </Link>
              <span className="text-border text-xs" aria-hidden="true">·</span>
              <time
                dateTime={updatedAt}
                className="text-xs text-text-secondary"
              >
                Updated {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </time>
            </div>
          </div>
        </div>

        {/* Analysis body */}
        <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
          {paragraphs.map((para, i) => (
            <p key={i} className="text-base text-text leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Footer: E-E-A-T badge */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-border bg-slate-50 flex items-center gap-2 text-xs text-text-secondary">
          <svg className="w-3.5 h-3.5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span>
            Human-reviewed analysis based on primary sources including official product pages, third-party benchmarks, and consumer reviews.{" "}
            <Link href={`${SITE_URL}/how-we-write-verdicts`} className="underline hover:text-primary-700 transition-colors">
              How we research
            </Link>
          </span>
        </div>
      </div>
    </section>
  );
}
