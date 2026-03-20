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
            className="bg-white border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
          >
            {/* Entity header */}
            <div
              className={`px-5 py-4 flex items-center justify-between ${
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
              <div className="flex gap-2">
                {entity.pros.length > 0 && (
                  <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                    {entity.pros.length} pros
                  </span>
                )}
                {entity.cons.length > 0 && (
                  <span className="text-[10px] font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                    {entity.cons.length} cons
                  </span>
                )}
              </div>
            </div>

            <div className="p-5 space-y-5">
              {/* Pros */}
              {entity.pros.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-win uppercase tracking-wide mb-3">
                    Pros
                  </h4>
                  <ul className="space-y-2">
                    {entity.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Cons */}
              {entity.cons.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-lose uppercase tracking-wide mb-3">
                    Cons
                  </h4>
                  <ul className="space-y-2">
                    {entity.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </span>
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
