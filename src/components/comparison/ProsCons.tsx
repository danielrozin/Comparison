import type { ComparisonEntityData } from "@/types";

export function ProsConsBlock({ entities }: { entities: ComparisonEntityData[] }) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-sm">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
        </div>
        <h2 className="text-2xl font-display font-bold text-text">Pros &amp; Cons</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {entities.map((entity, idx) => {
          const total = entity.pros.length + entity.cons.length;
          const prosPercent = total > 0 ? Math.round((entity.pros.length / total) * 100) : 50;
          return (
            <div
              key={entity.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              {/* Entity header */}
              <div
                className={`px-5 pt-5 pb-4 ${
                  idx === 0
                    ? "bg-gradient-to-br from-primary-50 via-primary-50 to-white"
                    : "bg-gradient-to-br from-accent-50 via-accent-50 to-white"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    className={`font-bold text-lg leading-tight ${
                      idx === 0 ? "text-primary-800" : "text-accent-700"
                    }`}
                  >
                    {entity.name}
                  </h3>
                  <div className="flex gap-1.5 ml-2 mt-0.5">
                    {entity.pros.length > 0 && (
                      <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full whitespace-nowrap">
                        +{entity.pros.length}
                      </span>
                    )}
                    {entity.cons.length > 0 && (
                      <span className="text-[10px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full whitespace-nowrap">
                        -{entity.cons.length}
                      </span>
                    )}
                  </div>
                </div>

                {/* Score bar */}
                {total > 0 && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-red-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-500"
                        style={{ width: `${prosPercent}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-semibold text-text-secondary tabular-nums">{prosPercent}% positive</span>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-5">
                {/* Pros */}
                {entity.pros.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <h4 className="text-xs font-bold text-green-700 uppercase tracking-widest">Pros</h4>
                    </div>
                    <ul className="space-y-2">
                      {entity.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text group/item">
                          <span className="flex-shrink-0 w-4 h-4 rounded bg-green-50 border border-green-200 flex items-center justify-center mt-0.5">
                            <svg className="w-2.5 h-2.5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="leading-relaxed">{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entity.pros.length > 0 && entity.cons.length > 0 && (
                  <div className="border-t border-dashed border-border" />
                )}

                {/* Cons */}
                {entity.cons.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <h4 className="text-xs font-bold text-red-600 uppercase tracking-widest">Cons</h4>
                    </div>
                    <ul className="space-y-2">
                      {entity.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-text">
                          <span className="flex-shrink-0 w-4 h-4 rounded bg-red-50 border border-red-200 flex items-center justify-center mt-0.5">
                            <svg className="w-2.5 h-2.5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </span>
                          <span className="leading-relaxed">{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
