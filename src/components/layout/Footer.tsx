import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/utils/constants";

export function Footer() {
  return (
    <footer className="bg-surface-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VS</span>
              </div>
              <span className="text-xl font-bold">{SITE_NAME}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              The internet&apos;s best destination for comparing anything. Fast, visual, and data-driven.
            </p>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Categories
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Popular
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/compare/messi-vs-ronaldo" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Messi vs Ronaldo
                </Link>
              </li>
              <li>
                <Link href="/compare/japan-vs-china" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Japan vs China
                </Link>
              </li>
              <li>
                <Link href="/compare/iphone-16-vs-samsung-s25" className="text-sm text-gray-300 hover:text-white transition-colors">
                  iPhone 16 vs Samsung S25
                </Link>
              </li>
              <li>
                <Link href="/trending" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Trending Comparisons
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="font-semibold text-sm uppercase tracking-wider text-gray-400 mb-4">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-sm text-gray-300 hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-300 hover:text-white transition-colors">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved. Data is for informational purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
