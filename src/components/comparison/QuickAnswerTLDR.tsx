import type { QuickAnswerTLDR as QuickAnswerData, ComparisonEntityData } from "@/types";

interface QuickAnswerTLDRProps {
  quickAnswer: QuickAnswerData;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

export function QuickAnswerTLDR({ quickAnswer, entityA: _entityA, entityB: _entityB }: QuickAnswerTLDRProps) {
  if (!quickAnswer.tldr) return null;

  // FAQPage JSON-LD for the TL;DR Q&A is intentionally NOT emitted here.
  // The canonical FAQPage is built by comparisonPageSchema() in lib/seo/schema.ts
  // from the full comparison.faqs list — Google allows only one FAQPage per URL,
  // and the TL;DR question is already covered there. (DAN-410)
  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl" />

          <div className="ml-2">
            <div className="flex items-center flex-wrap gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                TL;DR
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

            <p className="text-gray-900 leading-relaxed text-sm sm:text-base font-medium">
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
                    <p className="text-xs text-gray-700 leading-relaxed">
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
          </div>
        </div>
      </section>
    </>
  );
}
