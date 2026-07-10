import Link from "next/link";

interface AuthorBylineProps {
  updatedAt: string;
  isHumanReviewed: boolean;
}

export function AuthorByline({ updatedAt, isHumanReviewed }: AuthorBylineProps) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary">
      <Link
        href="/authors/daniel-rozin"
        className="flex items-center gap-1.5 font-medium text-text hover:text-primary-700 transition-colors"
        rel="author"
      >
        <svg className="w-3.5 h-3.5 text-primary-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        Daniel Rozin
      </Link>
      <span className="text-border" aria-hidden="true">·</span>
      <span>Editor-in-Chief, A Versus B</span>
      <span className="text-border" aria-hidden="true">·</span>
      <time dateTime={updatedAt}>
        Updated {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </time>
      {isHumanReviewed && (
        <>
          <span className="text-border" aria-hidden="true">·</span>
          <span className="inline-flex items-center gap-1 text-green-700 font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Human reviewed
          </span>
        </>
      )}
    </div>
  );
}
