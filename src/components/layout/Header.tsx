"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_NAME, SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";

const NAV_CATEGORIES = [
  { slug: "software", name: "Software", icon: "🖥️", highlight: true },
  { slug: "sports", name: "Sports", icon: "⚽" },
  { slug: "countries", name: "Countries", icon: "🌍" },
  { slug: "technology", name: "Technology", icon: "💻" },
  { slug: "products", name: "Products", icon: "📦" },
  { slug: "companies", name: "Companies", icon: "🏢" },
  { slug: "entertainment", name: "Entertainment", icon: "🎬" },
  { slug: "automotive", name: "Automotive", icon: "🚗" },
  { slug: "health", name: "Health", icon: "💊" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [softwareOpen, setSoftwareOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setSoftwareOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-gray-200 transition-shadow duration-200 ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      {/* ─── Row 1: Logo + Search + Actions ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">VS</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Search — Google style centered bar */}
          <div className="flex-1 max-w-xl mx-auto hidden sm:block">
            <Link
              href="/#search"
              className="flex items-center gap-3 w-full h-10 px-4 bg-gray-100 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 rounded-full text-sm text-gray-500 hover:shadow-sm transition-all"
            >
              <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search comparisons...
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Mobile search */}
            <Link
              href="/#search"
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            <Link
              href="/trending"
              className="hidden lg:inline-flex items-center h-9 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/blog"
              className="hidden lg:inline-flex items-center h-9 px-3 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              Blog
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

      {/* ─── Row 2: Category tabs — Google style horizontal scroll ─── */}
      <div className="hidden lg:block border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-12 -mb-px overflow-x-auto scrollbar-hide">
            {NAV_CATEGORIES.map((cat) => (
              cat.slug === "software" ? (
                /* Software with dropdown */
                <div
                  key="software"
                  ref={dropdownRef}
                  className="relative flex-shrink-0"
                  onMouseEnter={() => { if (hoverTimeout.current) clearTimeout(hoverTimeout.current); setSoftwareOpen(true); }}
                  onMouseLeave={() => { hoverTimeout.current = setTimeout(() => setSoftwareOpen(false), 150); }}
                >
                  <Link
                    href="/category/software"
                    className="inline-flex items-center gap-1.5 h-12 px-4 text-sm font-medium text-primary-600 border-b-2 border-primary-500 hover:bg-primary-50/50 transition-colors whitespace-nowrap"
                  >
                    🖥️ Software
                    <svg className={`w-3 h-3 ml-0.5 transition-transform duration-200 ${softwareOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Link>

                  {/* Dropdown panel */}
                  <div
                    className={`absolute top-full left-0 mt-0 w-[520px] bg-white rounded-b-xl rounded-tr-xl shadow-lg border border-gray-200 border-t-0 transition-all duration-150 ${
                      softwareOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"
                    }`}
                  >
                    <div className="p-3 grid grid-cols-2 gap-0.5">
                      {SOFTWARE_SUBCATEGORIES.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/software/${sub.slug}`}
                          onClick={() => setSoftwareOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <span className="text-base flex-shrink-0">{sub.icon}</span>
                          <span className="text-[13px] font-medium text-gray-600 group-hover:text-gray-900 transition-colors">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-100 px-3 py-2.5">
                      <Link
                        href="/category/software"
                        onClick={() => setSoftwareOpen(false)}
                        className="flex items-center justify-center gap-1 text-[13px] font-medium text-primary-600 hover:text-primary-700 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                      >
                        View all software comparisons
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="inline-flex items-center gap-1.5 h-12 px-4 text-sm font-medium text-gray-600 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
                >
                  <span className="text-sm">{cat.icon}</span>
                  {cat.name}
                </Link>
              )
            ))}

            {/* Divider + extra links */}
            <div className="w-px h-5 bg-gray-200 mx-2 flex-shrink-0" />
            <Link
              href="/trending"
              className="inline-flex items-center h-12 px-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
            >
              🔥 Trending
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center h-12 px-4 text-sm font-medium text-gray-500 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-colors whitespace-nowrap flex-shrink-0"
            >
              📝 Blog
            </Link>
          </div>
        </div>
      </div>

      {/* ─── Mobile menu ─── */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[85vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 overflow-y-auto max-h-[75vh]">
          {/* Search bar — mobile */}
          <div className="px-4 pt-3 pb-2 sm:hidden">
            <Link
              href="/#search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 w-full h-11 px-4 bg-gray-100 border border-gray-200 rounded-full text-sm text-gray-500"
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search comparisons...
            </Link>
          </div>

          {/* Software featured section */}
          <div className="px-3 py-2">
            <Link
              href="/category/software"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 text-[15px] font-semibold text-primary-600 bg-primary-50 rounded-xl transition-colors active:bg-primary-100"
            >
              🖥️ Software Comparisons
              <svg className="w-4 h-4 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Software subcategories — 2-col grid */}
          <div className="px-3 pb-2">
            <div className="grid grid-cols-2 gap-0.5">
              {SOFTWARE_SUBCATEGORIES.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/software/${sub.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[13px] text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors active:bg-gray-100"
                >
                  <span className="text-sm flex-shrink-0">{sub.icon}</span>
                  <span className="truncate">{sub.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-4 border-t border-gray-100" />

          {/* Other categories — 2-col grid */}
          <div className="px-3 py-2">
            <p className="px-3 py-1.5 text-xs font-semibold text-gray-400 uppercase tracking-wider">Categories</p>
            <div className="grid grid-cols-2 gap-0.5">
              {NAV_CATEGORIES.filter(c => c.slug !== "software").map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 text-[14px] font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors active:bg-gray-100"
                >
                  <span className="text-base">{cat.icon}</span>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="mx-4 border-t border-gray-100" />

          {/* Quick links */}
          <div className="px-3 py-2 pb-4 flex gap-2">
            <Link
              href="/trending"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            >
              🔥 Trending
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-1.5 h-10 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors active:bg-gray-200"
            >
              📝 Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
