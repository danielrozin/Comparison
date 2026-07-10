function SkeletonCard() {
  return (
    <div className="bg-white border border-border rounded-2xl p-4 sm:p-5 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="flex -space-x-2 shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-full bg-surface-alt ring-2 ring-white" />
          <div className="w-9 h-9 rounded-full bg-surface-alt ring-2 ring-white" />
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="h-4 bg-surface-alt rounded w-4/5" />
          <div className="h-3 bg-surface-alt rounded w-2/5" />
          <div className="h-3 bg-surface-alt rounded w-3/5" />
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="h-3 bg-surface-alt rounded w-1/4" />
        <div className="h-3 bg-surface-alt rounded w-1/6" />
      </div>
    </div>
  );
}

export default function CategoryLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero skeleton */}
      <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 animate-pulse">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center space-y-4">
          <div className="h-10 sm:h-12 bg-white/10 rounded-xl w-64 sm:w-80 mx-auto" />
          <div className="h-5 bg-white/10 rounded w-48 mx-auto" />
          <div className="flex justify-center gap-2 pt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-20 bg-white/10 rounded-full" />
            ))}
          </div>
        </div>
        <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
          <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" fillOpacity="0.05" />
        </svg>
      </div>

      {/* Grid skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-5 bg-surface-alt rounded w-32 animate-pulse" />
          <div className="h-9 bg-surface-alt rounded-lg w-28 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
          {Array.from({ length: 16 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
        {/* Pagination skeleton */}
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="w-9 h-9 bg-surface-alt rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}
