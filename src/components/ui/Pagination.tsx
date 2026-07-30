import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  extraParams?: Record<string, string>;
}

export function Pagination({ currentPage, totalPages, basePath, extraParams }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  function pageUrl(page: number) {
    const params = new URLSearchParams(extraParams ?? {});
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1 mt-10">
      {/* Prev */}
      {currentPage > 1 ? (
        <Link
          href={pageUrl(currentPage - 1)}
          aria-label="Previous page"
          className="flex items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          rel="prev"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </Link>
      ) : (
        <span aria-hidden="true" className="flex items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 text-sm font-medium text-text-secondary/40 cursor-not-allowed select-none">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Prev</span>
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, idx) =>
        page === null ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-2 text-sm text-text-secondary" aria-hidden="true">
            &hellip;
          </span>
        ) : page === currentPage ? (
          <span
            key={page}
            className="flex items-center justify-center w-11 h-11 text-sm font-bold text-white bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg shadow-sm"
            aria-current="page"
            aria-label={`Page ${page}, current`}
          >
            {page}
          </span>
        ) : (
          <Link
            key={page}
            href={pageUrl(page)}
            aria-label={`Page ${page}`}
            className="flex items-center justify-center w-11 h-11 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            {page}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          href={pageUrl(currentPage + 1)}
          aria-label="Next page"
          className="flex items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          rel="next"
        >
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <span aria-hidden="true" className="flex items-center justify-center gap-1 min-h-11 min-w-11 px-3 py-2 text-sm font-medium text-text-secondary/40 cursor-not-allowed select-none">
          <span className="hidden sm:inline">Next</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </span>
      )}
    </nav>
  );
}

function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | null)[] = [1];

  if (current > 3) pages.push(null);

  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) pages.push(null);

  pages.push(total);

  return pages;
}
