import type { ComparisonEntityData } from "@/types";

interface ShortAnswerBlockProps {
  shortAnswer: string;
  verdict: string | null;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
  attributeCount?: number;
  factCount?: number;
}

/**
 * Prominent short-answer callout for AEO/featured snippets.
 * Renders between page title and verdict card.
 * Uses <p> for snippet extraction — not <div>.
 * Includes citation stat badges for GEO (generative engine optimization).
 */
export function ShortAnswerBlock({
  shortAnswer,
  verdict,
  entityA,
  entityB,
  attributeCount,
  factCount,
}: ShortAnswerBlockProps) {
  // Primary: shortAnswer field. Fallback: first 2 sentences of verdict.
  const text = shortAnswer || extractFirstSentences(verdict, 2);
  if (!text) return null;

  const question = `What is the difference between ${entityA.name} and ${entityB.name}?`;

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
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="font-semibold text-amber-900 text-sm uppercase tracking-wide">
                  Short Answer
                </h2>
                {(attributeCount || factCount) && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-700">
                    {attributeCount != null && attributeCount > 0 && (
                      <span className="bg-amber-100 px-1.5 py-0.5 rounded font-medium">{attributeCount} attributes</span>
                    )}
                    {factCount != null && factCount > 0 && (
                      <span className="bg-amber-100 px-1.5 py-0.5 rounded font-medium">{factCount} facts</span>
                    )}
                  </div>
                )}
              </div>
              <p className="text-amber-900 leading-relaxed text-sm sm:text-base">
                {text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD for implicit question — targets featured snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: text,
                },
              },
            ],
          }),
        }}
      />
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
