import Link from "next/link";
import { SITE_NAME, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";
import { NewsletterSignup } from "@/components/engagement/NewsletterSignup";

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">

        {/* ─── Category sections with subcategories ─── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 lg:gap-10">
          {FOOTER_CATEGORIES.map((cat) => {
            const subs = CATEGORY_SUBCATEGORIES[cat.slug] || [];
            return (
              <div key={cat.slug}>
                <h3 className="mb-3">
                  <Link
                    href={`/category/${cat.slug}`}
                    className="font-semibold text-sm uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </h3>
                <ul className="space-y-2">
                  {subs.slice(0, 5).map((sub) => (
                    <li key={sub.slug}>
                      <Link
                        href={`/category/${cat.slug}/${sub.slug}`}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {sub.name}
                      </Link>
                    </li>
                  ))}
                  {subs.length > 5 && (
                    <li>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors"
                      >
                        View all →
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        {/* ─── Newsletter ─── */}
        <div className="border-t border-gray-800 mt-10 pt-8 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-white">Stay in the loop</h3>
              <p className="text-xs text-gray-400 mt-1">Weekly trending comparisons delivered to your inbox.</p>
            </div>
            <NewsletterSignup source="footer" variant="inline" />
          </div>
        </div>

        {/* ─── Bottom section ─── */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">VS</span>
              </div>
              <span className="text-base font-bold">{SITE_NAME}</span>
            </div>

            {/* Quick links */}
            <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2">
              <Link href="/trending" className="text-sm text-gray-400 hover:text-white transition-colors">Trending</Link>
              <Link href="/reviews" className="text-sm text-gray-400 hover:text-white transition-colors">Reviews</Link>
              <Link href="/blog" className="text-sm text-gray-400 hover:text-white transition-colors">Blog</Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">About</Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/partnerships" className="text-sm text-gray-400 hover:text-white transition-colors">Partnerships</Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/disclaimer" className="text-sm text-gray-400 hover:text-white transition-colors">Disclaimer</Link>
              <a href="/feed" className="text-sm text-gray-400 hover:text-white transition-colors">RSS Feed</a>
              <a href="/sitemap.xml" className="text-sm text-gray-400 hover:text-white transition-colors">Sitemap</a>
            </nav>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Data is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
