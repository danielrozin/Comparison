import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-primary-600">?</span>
        </div>
        <h1 className="text-3xl font-display font-bold text-text mb-3">
          Comparison Not Found
        </h1>
        <p className="text-text-secondary mb-6">
          We couldn&apos;t find the comparison you&apos;re looking for.
          Try searching for something else.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-colors"
          >
            Go Home
          </Link>
          <Link
            href="/trending"
            className="px-6 py-3 bg-surface-alt text-text font-semibold rounded-xl hover:bg-gray-100 transition-colors border border-border"
          >
            Browse Trending
          </Link>
        </div>
      </div>
    </div>
  );
}
