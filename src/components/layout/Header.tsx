"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_NAME, SOFTWARE_SUBCATEGORIES } from "@/lib/utils/constants";

const NAV_CATEGORIES = [
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
  const [softwareDropdownOpen, setSoftwareDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setSoftwareDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleDropdownEnter() {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setSoftwareDropdownOpen(true);
  }

  function handleDropdownLeave() {
    dropdownTimeout.current = setTimeout(() => setSoftwareDropdownOpen(false), 200);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-display flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="text-white font-black text-sm tracking-tight">VS</span>
            </div>
            <span className="text-xl font-bold text-text hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Center: Search bar (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-6">
            <Link
              href="/#search"
              className="flex items-center gap-2 w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400 hover:border-primary-300 hover:bg-white transition-all"
            >
              <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search comparisons...
            </Link>
          </div>

          {/* Right side: quick links + hamburger */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Link
              href="/trending"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
            >
              Trending
            </Link>
            <Link
              href="/blog"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
            >
              Blog
            </Link>

            {/* Mobile search */}
            <Link
              href="/#search"
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Search"
            >
              <svg className="w-5 h-5 text-text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category bar (desktop) */}
      <div className="hidden lg:block border-t border-gray-100 bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1 h-11 overflow-x-auto scrollbar-hide">
            {/* Software with mega dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={handleDropdownEnter}
              onMouseLeave={handleDropdownLeave}
            >
              <Link
                href="/category/software"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg transition-colors whitespace-nowrap"
              >
                🖥️ Software
                <svg className={`w-3.5 h-3.5 transition-transform ${softwareDropdownOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Link>

              {/* Mega dropdown */}
              <div
                className={`absolute top-full left-0 mt-1 w-[540px] bg-white rounded-xl shadow-xl border border-gray-200 p-4 transition-all duration-200 ${
                  softwareDropdownOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                }`}
              >
                <div className="grid grid-cols-2 gap-1">
                  {SOFTWARE_SUBCATEGORIES.map((sub) => (
                    <Link
                      key={sub.slug}
                      href={`/category/software/${sub.slug}`}
                      onClick={() => setSoftwareDropdownOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                      <span className="text-lg flex-shrink-0">{sub.icon}</span>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-primary-600 transition-colors">{sub.name}</span>
                    </Link>
                  ))}
                </div>
                <div className="border-t border-gray-100 mt-3 pt-3">
                  <Link
                    href="/category/software"
                    onClick={() => setSoftwareDropdownOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  >
                    View all software comparisons
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-px h-5 bg-gray-200 mx-1" />

            {/* Other categories */}
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span className="text-xs">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile slide-down menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white border-t border-gray-100 px-4 py-3 overflow-y-auto max-h-[70vh]">
          {/* Software section */}
          <div className="mb-3">
            <Link
              href="/category/software"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-3 text-base font-semibold text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
            >
              <span className="text-lg">🖥️</span>
              Software
            </Link>
            <div className="grid grid-cols-2 gap-1 ml-2">
              {SOFTWARE_SUBCATEGORIES.map((sub) => (
                <Link
                  key={sub.slug}
                  href={`/category/software/${sub.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-sm">{sub.icon}</span>
                  {sub.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Other categories */}
          <div className="grid grid-cols-2 gap-1">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
              >
                <span>{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-gray-100 my-2" />

          {/* Quick links */}
          <div className="flex gap-1">
            <Link
              href="/trending"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
            >
              🔥 Trending
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-text hover:bg-gray-50 rounded-lg transition-colors"
            >
              📝 Blog
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
