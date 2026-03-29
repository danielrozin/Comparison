import type { ComparisonEntityData, ComparisonAttribute } from "@/types";

export function VerdictCard({
  verdict,
  shortAnswer,
  entities,
}: {
  verdict: string;
  shortAnswer?: string | null;
  entities: ComparisonEntityData[];
  attributes: ComparisonAttribute[];
}) {
  const displayText = shortAnswer || verdict;

  return (
    <section data-verdict className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <div className="bg-gradient-to-r from-primary-50 to-indigo-50 border border-primary-200 rounded-xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <svg className="w-4 h-4 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary-800 uppercase tracking-wider mb-1">Quick Answer</h2>
            <p className="text-text leading-relaxed">{displayText}</p>
            {entities.some((e) => e.bestFor) && (
              <div className="flex flex-wrap gap-3 mt-3">
                {entities.map((entity, idx) =>
                  entity.bestFor ? (
                    <span
                      key={entity.id}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                        idx === 0
                          ? "bg-primary-100 text-primary-700"
                          : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {entity.name}: {entity.bestFor}
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
