"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_NAME, SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";

const NAV_CATEGORIES = [
  { slug: "software", name: "Software", highlight: true },
  { slug: "sports", name: "Sports" },
  { slug: "countries", name: "Countries" },
  { slug: "technology", name: "Technology" },
  { slug: "products", name: "Products" },
  { slug: "companies", name: "Companies" },
  { slug: "entertainment", name: "Entertainment" },
  { slug: "automotive", name: "Automotive" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [softwareOpen, setSoftwareOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSoftwareOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
        scrolled ? "shadow-md" : "border-b border-gray-200"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">VS</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Desktop nav — single row */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_CATEGORIES.map((cat) =>
              cat.slug === "software" ? (
                <div
                  key="software"
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setSoftwareOpen(true); }}
                  onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setSoftwareOpen(false), 150); }}
                >
                  <Link
                    href="/category/software"
                    className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors"
                  >
                    Software
                    <svg className={`w-3 h-3 transition-transform duration-150 ${softwareOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Dropdown */}
                  <div className={`absolute top-full left-0 mt-1 w-[480px] bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-150 ${
                    softwareOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
                  }`}>
                    <div className="p-3 grid grid-cols-2 gap-0.5">
                      {SOFTWARE_SUBCATEGORIES.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/software/${sub.slug}`}
                          onClick={() => setSoftwareOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-base">{sub.icon}</span>
                          <span className="text-sm text-gray-600 group-hover:text-gray-900">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-3 py-2">
                      <Link href="/category/software" onClick={() => setSoftwareOpen(false)} className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 py-1.5 rounded-lg hover:bg-primary-50 transition-colors">
                        View all software comparisons →
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {cat.name}
                </Link>
              )
            )}

            <div className="w-px h-5 bg-gray-200 mx-1" />

            <Link href="/trending" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              Trending
            </Link>
            <Link href="/blog" className="px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors">
              Blog
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/#search"
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-400 hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline">Search...</span>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      <div className={`lg:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? "max-h-[85vh]" : "max-h-0"}`}>
        <div className="bg-white border-t border-gray-200 overflow-y-auto max-h-[80vh]">
          {/* Software featured */}
          <div className="p-4 pb-2">
            <Link
              href="/category/software"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between px-4 py-3 bg-primary-50 text-primary-700 font-semibold rounded-xl text-[15px] active:bg-primary-100"
            >
              🖥️ Software Comparisons
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Software subcategories */}
          <div className="px-4 pb-3">
            <div className="grid grid-cols-2 gap-1">
              {SOFTWARE_SUBCATEGORIES.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/software/${sub.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-600 rounded-lg active:bg-gray-100"
                >
                  <span>{sub.icon}</span>
                  <span className="truncate">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          {/* Categories */}
          <div className="p-4 pb-3">
            <p className="px-1 pb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
            <div className="grid grid-cols-2 gap-1">
              {NAV_CATEGORIES.filter(c => c.slug !== "software").map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2.5 text-[14px] font-medium text-gray-700 rounded-lg active:bg-gray-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          {/* Bottom links */}
          <div className="p-4 flex gap-2">
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg active:bg-gray-200">
              🔥 Trending
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg active:bg-gray-200">
              📝 Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
