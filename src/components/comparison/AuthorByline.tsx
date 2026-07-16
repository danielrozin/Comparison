import Link from "next/link";

interface AuthorBylineProps {
  updatedAt: string;
  isHumanReviewed: boolean;
  wordCount?: number;
}

function readingTime(wordCount?: number): number | null {
  if (!wordCount || wordCount < 50) return null;
  return Math.max(1, Math.round(wordCount / 200));
}

export function AuthorByline({ updatedAt, isHumanReviewed, wordCount }: AuthorBylineProps) {
  const mins = readingTime(wordCount);
  const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div className="flex items-center gap-3 flex-wrap">
        {/* Avatar */}
        <Link
          href="/authors/daniel-rozin"
          rel="author"
          aria-label="Author: Daniel Rozin"
          className="flex-shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded-full"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center ring-2 ring-white shadow-sm hover:shadow-md hover:ring-primary-200 transition-all duration-200">
            <span className="text-white font-bold text-xs tracking-tight select-none">DR</span>
          </div>
        </Link>

        {/* Name + credentials + date row */}
        <div className="flex flex-col gap-0.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/authors/daniel-rozin"
              rel="author"
              className="text-sm font-semibold text-text hover:text-primary-700 transition-colors leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
            >
              Daniel Rozin
            </Link>
            <span className="text-xs text-text-secondary/50" aria-hidden="true">·</span>
            <span className="text-xs text-text-secondary leading-none">Editor-in-Chief</span>
            {isHumanReviewed && (
              <>
                <span className="text-xs text-text-secondary/50" aria-hidden="true">·</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 leading-none">
                  <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Human reviewed
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <time dateTime={updatedAt} className="text-xs text-text-secondary leading-none flex items-center gap-1">
              <svg className="w-3 h-3 flex-shrink-0 text-text-secondary/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 9v7.5" />
              </svg>
              Updated {formattedDate}
            </time>
            {mins && (
              <>
                <span className="text-xs text-text-secondary/50" aria-hidden="true">·</span>
                <span className="text-xs text-text-secondary leading-none flex items-center gap-1">
                  <svg className="w-3 h-3 flex-shrink-0 text-text-secondary/60" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {mins} min read
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
