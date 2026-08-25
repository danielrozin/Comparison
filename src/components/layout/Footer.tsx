import Link from "next/link";
import { SITE_NAME } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";
import { CookiePreferencesButton } from "./CookiePreferencesButton";
import { CategoryIcon } from "@/lib/utils/category-icons";
import { YOUTUBE_CHANNEL_URL } from "@/lib/seo/schema";

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
            <Link href="/" className="inline-flex items-center gap-2.5 min-h-11 mb-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl flex items-center justify-center shadow-md">
                <span className="text-white font-black text-sm">VS</span>
              </div>
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              Unbiased, data-driven comparisons for better decisions. Trusted by millions of curious minds.
            </p>
            {/* Social links — only accounts that actually exist. An icon
                pointing at an unclaimed handle is a dead end for readers and a
                404 in the entity graph. */}
            <div role="group" aria-label="Follow us" className="flex items-center gap-2 mt-4 mb-3">
              <a href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer me" aria-label="A Versus B on YouTube" className="w-11 h-11 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 hover:border-white/30 flex items-center justify-center transition-all duration-200 text-white/60 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
            {/* Google Preferred Sources — the footer is dark, so the dark
                theme; Google localizes the label from the reader's browser.
                The div stays empty until news.google.com's script (loaded in
                the head) hydrates it, so there is no layout shift or dead UI
                if the script is blocked. */}
            <div className="mb-3 min-h-0" aria-hidden="false">
              <div google-add-preferred-source-btn="" data-lang="en" data-theme="dark"></div>
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
          <nav aria-label="Browse categories" className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-0 sm:gap-y-2">
            {FOOTER_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="flex items-center gap-2 min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors group rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
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
            <nav aria-label="Quick links" className="flex flex-wrap gap-x-5 gap-y-0.5 -my-2">
              <Link href="/trending" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Trending</Link>
              <Link href="/studies" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Data Studies</Link>
              <Link href="/reviews" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Reviews</Link>
              <Link href="/blog" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Blog</Link>
              <Link href="/about" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">About</Link>
              <Link href="/pricing?src=footer" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Pricing</Link>
              <Link href="/changelog" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Changelog</Link>
              <Link href="/contact" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Contact</Link>
              <Link href="/partnerships" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Partnerships</Link>
              <Link href="/who-is-this-for" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Who Is This For?</Link>
              <a href="/feed" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">RSS Feed</a>
              <Link href="/site-map" className="inline-flex items-center min-h-11 sm:min-h-0 sm:py-1 text-sm text-white/60 hover:text-white transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Sitemap</Link>
            </nav>
          </div>

          {/* Legal + copyright row */}
          <div className="flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-0 sm:gap-y-2 -my-1 sm:my-0">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60">Legal</span>
              <Link href="/privacy" className="inline-flex items-center min-h-10 sm:min-h-0 text-xs text-white/50 hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Privacy Policy</Link>
              <Link href="/terms" className="inline-flex items-center min-h-10 sm:min-h-0 text-xs text-white/50 hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Terms of Service</Link>
              <Link href="/cookie-policy" className="inline-flex items-center min-h-10 sm:min-h-0 text-xs text-white/50 hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Cookie Policy</Link>
              <Link href="/acceptable-use" className="inline-flex items-center min-h-10 sm:min-h-0 text-xs text-white/50 hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Acceptable Use</Link>
              <Link href="/disclaimer" className="inline-flex items-center min-h-10 sm:min-h-0 text-xs text-white/50 hover:text-white/80 transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">Disclaimer</Link>
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
