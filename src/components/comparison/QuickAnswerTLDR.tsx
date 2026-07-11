"use client";

import { useState, useCallback } from "react";
import type { QuickAnswerTLDR as QuickAnswerData, ComparisonEntityData } from "@/types";

interface QuickAnswerTLDRProps {
  quickAnswer: QuickAnswerData;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

function CopyTldrButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [text]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy quick answer"}
      title={copied ? "Copied!" : "Copy quick answer"}
      className={`flex-shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold border transition-all duration-150 ${
        copied
          ? "bg-green-50 text-green-700 border-green-200"
          : "bg-white/60 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
      }`}
    >
      {copied ? (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

export function QuickAnswerTLDR({ quickAnswer, entityA: _entityA, entityB: _entityB }: QuickAnswerTLDRProps) {
  if (!quickAnswer.tldr) return null;

  // FAQPage JSON-LD for the TL;DR Q&A is intentionally NOT emitted here.
  // The canonical FAQPage is built by comparisonPageSchema() in lib/seo/schema.ts
  // from the full comparison.faqs list — Google allows only one FAQPage per URL,
  // and the TL;DR question is already covered there. (DAN-410)
  return (
    <>
      <section id="short-answer" aria-label="Quick Answer" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3 scroll-mt-28">
        <div className="bg-gradient-to-br from-blue-50 via-indigo-50/60 to-blue-50 border border-blue-200 rounded-2xl p-4 sm:p-6 max-w-3xl mx-auto relative overflow-hidden">
          {/* Top gradient accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 via-indigo-500 to-violet-400" />
          {/* Left accent bar */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-2xl" />

          <div className="ml-2">
            <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex items-center flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                TL;DR
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold px-1.5 py-0.5 rounded-full bg-blue-100/80 text-blue-700 border border-blue-200/60">
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                Voice-ready
              </span>
              {quickAnswer.winnerName && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400 text-amber-900 border border-amber-300/60">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  {quickAnswer.winnerName} wins
                </span>
              )}
            </div>
            <CopyTldrButton text={quickAnswer.tldr} />
            </div>

            <p className="text-text leading-relaxed text-sm sm:text-base font-medium">
              {quickAnswer.tldr}
            </p>

            {(quickAnswer.keyFact || quickAnswer.winnerReason) && (
              <div className="mt-3 pt-3 border-t border-blue-200/50 flex flex-col gap-2">
                {quickAnswer.winnerReason && (
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 border border-amber-200 mt-0.5">
                      <svg className="w-3 h-3 text-amber-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                      </svg>
                    </span>
                    <p className="text-xs text-text leading-relaxed">
                      <span className="font-semibold text-amber-800">Deciding factor:</span>{" "}
                      {quickAnswer.winnerReason}
                    </p>
                  </div>
                )}
                {quickAnswer.keyFact && (
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 border border-blue-200 mt-0.5">
                      <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </span>
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <span className="font-semibold">Key fact:</span>{" "}
                      {quickAnswer.keyFact}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Jump-to-verdict CTA — helps users who want the full analysis skip past the TLDR */}
            <div className="mt-3 pt-3 border-t border-blue-200/50 flex items-center justify-between gap-3">
              <a
                href="#verdict"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-2 transition-colors"
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
                Jump to full verdict
              </a>
              <a
                href="#comparison-table"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 hover:underline underline-offset-2 transition-colors"
              >
                See all attributes
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
