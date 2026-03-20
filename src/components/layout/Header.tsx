import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/utils/constants";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">VS</span>
            </div>
            <span className="text-xl font-bold text-text hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-3 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
              >
                {cat.icon} {cat.name}
              </Link>
            ))}
            <Link
              href="/trending"
              className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            >
              Blog
            </Link>
          </nav>

          {/* Search trigger */}
          <div className="flex items-center gap-3">
            <Link
              href="/#search"
              className="flex items-center gap-2 px-4 py-2 bg-surface-alt border border-border rounded-full text-sm text-text-secondary hover:border-primary-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search comparisons...</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
