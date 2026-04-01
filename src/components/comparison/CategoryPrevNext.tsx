import Link from "next/link";

interface AdjacentComparison {
  slug: string;
  title: string;
}

interface CategoryPrevNextProps {
  category: string | null;
  prev: AdjacentComparison | null;
  next: AdjacentComparison | null;
}

export function CategoryPrevNext({ category, prev, next }: CategoryPrevNextProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="Category navigation"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
    >
      {category && (
        <p className="text-xs text-text-secondary mb-3 text-center capitalize">
          More in {category}
        </p>
      )}
      <div className="flex items-stretch gap-4">
        {prev ? (
          <Link
            href={`/compare/${prev.slug}`}
            className="flex-1 group flex items-center gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all"
          >
            <svg
              className="w-5 h-5 text-text-secondary group-hover:text-primary-600 flex-shrink-0 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <div className="min-w-0">
              <span className="text-xs text-text-secondary">Previous</span>
              <p className="text-sm font-medium text-text group-hover:text-primary-600 truncate transition-colors">
                {prev.title}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <Link
            href={`/compare/${next.slug}`}
            className="flex-1 group flex items-center justify-end gap-3 bg-white border border-border rounded-xl p-4 hover:border-primary-300 hover:shadow-md transition-all text-right"
          >
            <div className="min-w-0">
              <span className="text-xs text-text-secondary">Next</span>
              <p className="text-sm font-medium text-text group-hover:text-primary-600 truncate transition-colors">
                {next.title}
              </p>
            </div>
            <svg
              className="w-5 h-5 text-text-secondary group-hover:text-primary-600 flex-shrink-0 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </nav>
  );
}
