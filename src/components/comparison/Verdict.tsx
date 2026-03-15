import type { ComparisonEntityData } from "@/types";

export function VerdictBlock({
  verdict,
  entities,
}: {
  verdict: string;
  entities: ComparisonEntityData[];
}) {
  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-br from-surface-dark to-gray-800 rounded-xl p-6 sm:p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold">Verdict</h2>
        </div>
        <p className="text-gray-200 leading-relaxed text-sm sm:text-base">{verdict}</p>

        {/* Who should choose cards */}
        {entities.some((e) => e.bestFor) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {entities.map((entity, idx) =>
              entity.bestFor ? (
                <div
                  key={entity.id}
                  className={`rounded-lg p-4 ${
                    idx === 0 ? "bg-primary-600/20 border border-primary-500/30" : "bg-accent-500/20 border border-accent-400/30"
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
                    Choose {entity.name} if
                  </p>
                  <p className="text-sm text-white">{entity.bestFor}</p>
                </div>
              ) : null
            )}
          </div>
        )}
      </div>
    </section>
  );
}
