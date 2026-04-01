export default function SearchLoading() {
  return (
    <div className="animate-pulse">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title skeleton */}
        <div className="h-9 w-56 bg-surface-alt rounded-lg mb-6" />

        {/* Search bar skeleton */}
        <div className="h-14 w-full bg-surface-alt rounded-xl mb-8" />

        {/* Results skeleton */}
        <div className="space-y-3">
          <div className="h-4 w-40 bg-surface-alt rounded mb-4" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-white border border-border rounded-xl">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 bg-surface-alt rounded-full" />
                <div className="w-10 h-10 bg-surface-alt rounded-full" />
              </div>
              <div className="flex-1">
                <div className="h-5 w-48 bg-surface-alt rounded mb-1" />
                <div className="h-3 w-20 bg-surface-alt rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
