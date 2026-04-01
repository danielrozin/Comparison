export default function CategoryLoading() {
  return (
    <div className="animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-surface-alt rounded" />
          <div className="h-4 w-3 bg-surface-alt rounded" />
          <div className="h-4 w-24 bg-surface-alt rounded" />
        </div>

        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-surface-alt rounded" />
          <div>
            <div className="h-9 w-64 bg-surface-alt rounded-lg mb-2" />
            <div className="h-4 w-40 bg-surface-alt rounded" />
          </div>
        </div>

        {/* Top comparisons skeleton */}
        <div className="mb-10">
          <div className="h-6 w-56 bg-surface-alt rounded mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-surface-alt rounded-xl" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white border border-border rounded-xl p-5">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex -space-x-3">
                  <div className="w-10 h-10 bg-surface-alt rounded-full" />
                  <div className="w-10 h-10 bg-surface-alt rounded-full" />
                </div>
                <div className="h-5 flex-1 bg-surface-alt rounded" />
              </div>
              <div className="h-4 w-24 bg-surface-alt rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
