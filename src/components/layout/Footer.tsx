import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { CookiePreferencesButton } from "./CookiePreferencesButton";

const FOOTER_CATEGORIES = [
  { slug: "software", name: "Software", icon: "💻" },
  { slug: "sports", name: "Sports", icon: "⚽" },
  { slug: "countries", name: "Countries", icon: "🌍" },
  { slug: "technology", name: "Technology", icon: "🔧" },
  { slug: "products", name: "Products", icon: "📦" },
  { slug: "companies", name: "Companies", icon: "🏢" },
  { slug: "entertainment", name: "Entertainment", icon: "🎬" },
  { slug: "automotive", name: "Automotive", icon: "🚗" },
];

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white mt-20 overflow-hidden">
      {/* Top gradient accent strip */}
      <div className="h-px bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ─── Top row: brand + newsletter ─── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 pb-10 border-b border-gray-800">
          {/* Brand block */}
          <div className="flex-shrink-0 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">VS</span>
              </div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unbiased, data-driven comparisons for better decisions. Trusted by millions of curious minds.
            </p>
            {/* Trust badges */}
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-300">Data-backed</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-[10px] font-semibold text-gray-300">Research-first</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">Stay in the loop</h3>
            <p className="text-xs text-gray-400 mb-3">Weekly trending comparisons delivered to your inbox.</p>
            <NewsletterSignup source="footer" variant="inline" />
          </div>
        </div>

        {/* ─── Category links — top-level only; full subcategory tree is reachable via /category/{slug} ─── */}
        <div className="py-8 border-b border-gray-800">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-4">Browse Categories</p>
          <nav aria-label="Browse categories" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
            {FOOTER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <span className="text-base opacity-70 group-hover:opacity-100 transition-opacity" aria-hidden="true">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ─── Bottom section ─── */}
        <div className="pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Quick links */}
            <nav className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">Trending</Link>
              <Link href="/studies" className="text-sm text-gray-400 hover:text-white transition-colors">Data Studies</Link>
              <Link href="/reviews" className="text-sm text-gray-400 hover:text-white transition-colors">Reviews</Link>
              <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/changelog" className="text-sm text-gray-400 hover:text-white transition-colors">Changelog</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/partnerships" className="text-sm text-gray-400 hover:text-white transition-colors">Partnerships</Link>
              <Link href="/who-is-this-for" className="text-sm text-gray-400 hover:text-white transition-colors">Who Is This For?</Link>
              <a href="/feed" className="text-sm text-gray-400 hover:text-white transition-colors">RSS Feed</a>
              <Link href="/site-map" className="text-sm text-gray-400 hover:text-white transition-colors">Sitemap</Link>
            </nav>
          </div>

          {/* Legal + copyright row */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Legal</span>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Cookie Policy</Link>
              <Link href="/acceptable-use" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Acceptable Use</Link>
              <Link href="/disclaimer" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">Disclaimer</Link>
              <CookiePreferencesButton />
            </div>
            <p className="text-xs text-gray-600">
              &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Data is for informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
