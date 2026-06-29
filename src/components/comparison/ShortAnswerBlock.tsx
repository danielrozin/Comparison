import type { ComparisonEntityData } from "@/types";

interface ShortAnswerBlockProps {
  shortAnswer: string;
  verdict: string | null;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

/**
 * Prominent short-answer callout for AEO/featured snippets.
 * Renders between page title and verdict card.
 * Uses <p> for snippet extraction — not <div>.
 */
export function ShortAnswerBlock({
  shortAnswer,
  verdict,
  entityA: _entityA,
  entityB: _entityB,
}: ShortAnswerBlockProps) {
  // Primary: shortAnswer field. Fallback: first 2 sentences of verdict.
  const text = shortAnswer || extractFirstSentences(verdict, 2);
  if (!text) return null;

  // FAQPage JSON-LD for the implicit "What is the difference" Q&A is intentionally
  // NOT emitted here. The canonical FAQPage is built by comparisonPageSchema()
  // in lib/seo/schema.ts from comparison.faqs — Google allows only one FAQPage
  // per URL, and a near-duplicate single-Q schema can dilute the indexed one. (DAN-410)
  return (
    <>
      <section id="short-answer" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <div className="relative max-w-3xl mx-auto overflow-hidden">
          {/* Gradient border via wrapper */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 rounded-2xl" />
          <div className="relative m-[1.5px] bg-gradient-to-br from-amber-50 to-orange-50 rounded-[14px] p-4 sm:p-6">

            {/* Large decorative quote mark */}
            <div className="absolute top-3 right-4 text-7xl font-serif text-amber-200/60 leading-none select-none" aria-hidden="true">&ldquo;</div>

            <div className="flex items-start gap-3 relative">
              {/* Icon badge */}
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-sm shadow-amber-400/40 mt-0.5">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <h2 className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                    Quick Answer
                  </h2>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200/60 text-amber-700 border border-amber-300/50">
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
                    AI Summary
                  </span>
                </div>
                <p className="text-amber-900 leading-relaxed text-sm sm:text-base font-medium">
                  {text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function extractFirstSentences(
  text: string | null | undefined,
  count: number
): string | null {
  if (!text) return null;
  const sentences = text.match(/[^.!?]+[.!?]+/g);
  if (!sentences || sentences.length === 0) return null;
  return sentences.slice(0, count).join(" ").trim();
}
