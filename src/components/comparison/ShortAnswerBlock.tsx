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
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-2">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-7 h-7 bg-amber-500 rounded-full flex items-center justify-center mt-0.5">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.998 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.986z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-amber-900 mb-1 text-sm uppercase tracking-wide">
                Short Answer
              </h2>
              <p className="text-amber-900 leading-relaxed text-sm sm:text-base">
                {text}
              </p>
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
