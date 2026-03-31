import type { QuickAnswerTLDR as QuickAnswerData, ComparisonEntityData } from "@/types";

interface QuickAnswerTLDRProps {
  quickAnswer: QuickAnswerData;
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}

export function QuickAnswerTLDR({ quickAnswer, entityA, entityB }: QuickAnswerTLDRProps) {
  if (!quickAnswer.tldr) return null;

  const question = `What is the difference between ${entityA.name} and ${entityB.name}?`;

  return (
    <>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-3">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 max-w-3xl mx-auto relative overflow-hidden">
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-indigo-500 rounded-l-xl" />

          <div className="ml-2">
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white uppercase tracking-wider">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                TL;DR
              </span>
              {quickAnswer.winnerName && (
                <span className="text-xs text-blue-700 font-medium">
                  Winner: {quickAnswer.winnerName}
                </span>
              )}
            </div>

            <p className="text-gray-900 leading-relaxed text-sm sm:text-base font-medium">
              {quickAnswer.tldr}
            </p>

            {quickAnswer.keyFact && (
              <p className="mt-2 text-xs sm:text-sm text-blue-800 bg-blue-100/60 rounded-lg px-3 py-1.5 inline-block">
                <svg className="w-3.5 h-3.5 inline mr-1 -mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {quickAnswer.keyFact}
              </p>
            )}

            {quickAnswer.winnerReason && (
              <p className="mt-2 text-xs text-gray-600">
                Deciding factor: {quickAnswer.winnerReason}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FAQ JSON-LD for the TL;DR — targets featured snippets */}
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
                  text: quickAnswer.tldr,
                },
              },
            ],
          }),
        }}
      />
    </>
  );
}
