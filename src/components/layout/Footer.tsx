import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { CookiePreferencesButton } from "./CookiePreferencesButton";
import { CategoryIcon } from "@/lib/utils/category-icons";

const FOOTER_CATEGORIES = [
  { slug: "software", name: "Software" },
  { slug: "sports", name: "Sports" },
  { slug: "countries", name: "Countries" },
  { slug: "technology", name: "Technology" },
  { slug: "products", name: "Products" },
  { slug: "companies", name: "Companies" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "automotive", name: "Automotive" },
];

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white mt-20 overflow-hidden">
      {/* Top gradient accent strip */}
      <div className="h-px bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500 opacity-40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">

        {/* ─── Top row: brand + newsletter ─── */}
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 pb-10 border-b border-white/10">
          {/* Brand block */}
          <div className="flex-shrink-0 max-w-xs">
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">VS</span>
              </div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Unbiased, data-driven comparisons for better decisions. Trusted by millions of curious minds.
            </p>
            {/* Social links */}
            <div role="group" aria-label="Follow us on social media" className="flex items-center gap-2 mt-4 mb-3">
              <a href="https://x.com/aversusb" target="_blank" rel="noopener noreferrer" aria-label="Follow A Versus B on X" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 flex items-center justify-center transition-all duration-200 text-white/60 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.713 5.895L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/aversusb" target="_blank" rel="noopener noreferrer" aria-label="Follow A Versus B on LinkedIn" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 flex items-center justify-center transition-all duration-200 text-white/60 hover:text-blue-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a href="https://reddit.com/r/aversusb" target="_blank" rel="noopener noreferrer" aria-label="A Versus B Reddit community" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 flex items-center justify-center transition-all duration-200 text-white/60 hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
                </svg>
              </a>
            </div>
            {/* Trust badges */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 text-green-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs font-semibold text-white/70">Data-backed</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
                <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-xs font-semibold text-white/70">Research-first</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-white mb-1">Stay in the loop</h3>
            <p className="text-xs text-white/60 mb-3">Weekly trending comparisons delivered to your inbox.</p>
            <NewsletterSignup source="footer" variant="inline" />
          </div>
        </div>

        {/* ─── Category links — top-level only; full subcategory tree is reachable via /category/{slug} ─── */}
        <div className="py-8 border-b border-white/10">
          <p className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Browse Categories</p>
          <nav aria-label="Browse categories" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-2">
            {FOOTER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-dark rounded"
              >
                <CategoryIcon category={cat.slug} className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity text-text-secondary" />
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* ─── Bottom section ─── */}
        <div className="pt-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            {/* Quick links */}
            <nav aria-label="Quick links" className="flex flex-wrap gap-x-5 gap-y-2">
              <Link href="/trending" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Trending</Link>
              <Link href="/studies" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Data Studies</Link>
              <Link href="/reviews" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Reviews</Link>
              <Link href="/blog" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Blog</Link>
              <Link href="/about" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">About</Link>
              <Link href="/changelog" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Changelog</Link>
              <Link href="/contact" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Contact</Link>
              <Link href="/partnerships" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Partnerships</Link>
              <Link href="/who-is-this-for" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Who Is This For?</Link>
              <a href="/feed" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">RSS Feed</a>
              <Link href="/site-map" className="text-sm text-white/60 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Sitemap</Link>
            </nav>
          </div>

          {/* Legal + copyright row */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Legal</span>
              <Link href="/privacy" className="text-xs text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Privacy Policy</Link>
              <Link href="/terms" className="text-xs text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Terms of Service</Link>
              <Link href="/cookie-policy" className="text-xs text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Cookie Policy</Link>
              <Link href="/acceptable-use" className="text-xs text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Acceptable Use</Link>
              <Link href="/disclaimer" className="text-xs text-white/50 hover:text-white/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-1 focus-visible:ring-offset-surface-dark rounded">Disclaimer</Link>
              <CookiePreferencesButton />
            </div>
            <p className="text-xs text-white/60">
              {/* suppressHydrationWarning: getFullYear() differs server vs client at year boundary */}
              &copy; <span suppressHydrationWarning>{new Date().getFullYear()}</span> {SITE_NAME}. All rights reserved. Data is for informational purposes only.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
