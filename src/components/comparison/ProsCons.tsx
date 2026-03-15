import type { ComparisonEntityData } from "@/types";

export function ProsConsBlock({ entities }: { entities: ComparisonEntityData[] }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-display font-bold text-text mb-6">
        Pros & Cons
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entities.map((entity, idx) => (
          <div
            key={entity.id}
            className="bg-white border border-border rounded-xl overflow-hidden"
          >
            {/* Entity header */}
            <div
              className={`px-5 py-4 ${
                idx === 0
                  ? "bg-gradient-to-r from-primary-50 to-primary-100/50"
                  : "bg-gradient-to-r from-accent-50 to-accent-400/10"
              }`}
            >
              <h3
                className={`font-bold text-lg ${
                  idx === 0 ? "text-primary-800" : "text-accent-700"
                }`}
              >
                {entity.name}
              </h3>
            </div>

            <div className="p-5 space-y-4">
              {/* Pros */}
              {entity.pros.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-win uppercase tracking-wide mb-2">
                    Pros
                  </h4>
                  <ul className="space-y-1.5">
                    {entity.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <svg className="w-4 h-4 text-win flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {entity.cons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-lose uppercase tracking-wide mb-2">
                    Cons
                  </h4>
                  <ul className="space-y-1.5">
                    {entity.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-text">
                        <svg className="w-4 h-4 text-lose flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" className="rotate-45 origin-center" />
                        </svg>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
