export default function ComparisonLoading() {
  return (
    <div className="animate-pulse">
      {/* Breadcrumbs skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex items-center gap-2">
          <div className="h-4 w-12 bg-surface-alt rounded" />
          <div className="h-4 w-4 bg-surface-alt rounded" />
          <div className="h-4 w-20 bg-surface-alt rounded" />
          <div className="h-4 w-4 bg-surface-alt rounded" />
          <div className="h-4 w-32 bg-surface-alt rounded" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-10 w-3/4 bg-surface-alt rounded-lg mx-auto mb-4" />
        <div className="h-5 w-1/2 bg-surface-alt rounded mx-auto mb-8" />

        {/* Entity cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-16 h-16 bg-surface-alt rounded-full mx-auto mb-4" />
            <div className="h-5 w-24 bg-surface-alt rounded mx-auto mb-2" />
            <div className="h-4 w-32 bg-surface-alt rounded mx-auto" />
          </div>
          <div className="bg-white border border-border rounded-xl p-6">
            <div className="w-16 h-16 bg-surface-alt rounded-full mx-auto mb-4" />
            <div className="h-5 w-24 bg-surface-alt rounded mx-auto mb-2" />
            <div className="h-4 w-32 bg-surface-alt rounded mx-auto" />
          </div>
        </div>
      </div>

      {/* Key Differences skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-7 w-48 bg-surface-alt rounded mb-6" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-surface-alt rounded-xl" />
          ))}
        </div>
      </div>

      {/* Comparison Table skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-7 w-40 bg-surface-alt rounded mb-6" />
        <div className="h-64 bg-surface-alt rounded-xl" />
      </div>

      {/* Pros & Cons skeleton */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="h-7 w-36 bg-surface-alt rounded mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="h-40 bg-surface-alt rounded-xl" />
          <div className="h-40 bg-surface-alt rounded-xl" />
        </div>
      </div>
    </div>
  );
}
