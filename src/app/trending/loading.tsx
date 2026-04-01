export default function TrendingLoading() {
  return (
    <div className="animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-surface-alt rounded" />
          <div className="h-4 w-3 bg-surface-alt rounded" />
          <div className="h-4 w-20 bg-surface-alt rounded" />
        </div>

        {/* Title skeleton */}
        <div className="h-10 w-72 bg-surface-alt rounded-lg mb-2" />
        <div className="h-4 w-80 bg-surface-alt rounded mb-8" />

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-surface-alt rounded-full" />
                <div className="flex -space-x-2 flex-1">
                  <div className="w-10 h-10 bg-surface-alt rounded-full" />
                  <div className="w-10 h-10 bg-surface-alt rounded-full" />
                </div>
              </div>
              <div className="h-5 w-full bg-surface-alt rounded mb-2" />
              <div className="h-3 w-20 bg-surface-alt rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
