import type { ComparisonEntityData } from "@/types";

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0L14.59 8.41L23 11L14.59 13.59L12 22L9.41 13.59L1 11L9.41 8.41L12 0Z" />
    </svg>
  );
}

export function VerdictBlock({
  verdict,
  entities,
}: {
  verdict: string;
  entities: ComparisonEntityData[];
}) {
  return (
    <section data-verdict className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 rounded-xl p-6 sm:p-8 text-white overflow-hidden shadow-lg shadow-purple-900/20 border border-purple-700/30">
        {/* Decorative sparkles */}
        <SparkleIcon className="absolute top-4 right-6 w-4 h-4 text-yellow-400/30" />
        <SparkleIcon className="absolute top-12 right-16 w-3 h-3 text-purple-300/20" />
        <SparkleIcon className="absolute bottom-6 left-8 w-3 h-3 text-indigo-300/20" />
        <SparkleIcon className="absolute bottom-16 right-10 w-2 h-2 text-yellow-400/20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold">Verdict</h2>
          </div>
          <p className="text-gray-200 leading-relaxed text-lg sm:text-xl">{verdict}</p>

          {/* Who should choose cards */}
          {entities.some((e) => e.bestFor) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {entities.map((entity, idx) =>
                entity.bestFor ? (
                  <div
                    key={entity.id}
                    className={`rounded-lg p-4 backdrop-blur-sm ${
                      idx === 0 ? "bg-primary-600/20 border border-primary-500/30" : "bg-accent-500/20 border border-accent-400/30"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                        idx === 0 ? "bg-primary-500/30" : "bg-accent-500/30"
                      }`}>
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-300">
                        Choose {entity.name} if
                      </p>
                    </div>
                    <p className="text-sm text-white leading-relaxed">{entity.bestFor}</p>
                  </div>
                ) : null
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
