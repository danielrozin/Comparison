"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_NAME, CATEGORIES } from "@/lib/utils/constants";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 10);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change (resize as proxy)
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileMenuOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-border transition-shadow duration-300 ${
        scrolled ? "shadow-md" : "shadow-none"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-display">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-600/20">
              <span className="text-white font-black text-sm tracking-tight">VS</span>
            </div>
            <span className="text-xl font-bold text-text hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-shrink min-w-0">
            <Link
              href="/category/software"
              className="px-2.5 py-2 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors whitespace-nowrap"
            >
              <span className="hidden xl:inline">🖥️ </span>Software
            </Link>
            {CATEGORIES.filter((c) => !["software", "celebrities", "travel", "military", "economy", "history", "brands", "finance", "education"].includes(c.slug)).slice(0, 6).map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="px-2.5 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors whitespace-nowrap"
              >
                <span className="hidden xl:inline">{cat.icon} </span>{cat.name}
              </Link>
            ))}
            <Link
              href="/trending"
              className="px-2.5 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors whitespace-nowrap"
            >
              Trending
            </Link>
            <Link
              href="/blog"
              className="px-2.5 py-2 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors whitespace-nowrap"
            >
              Blog
            </Link>
          </nav>

          {/* Right side: search + hamburger */}
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

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-surface-alt transition-colors"
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

      {/* Mobile slide-down menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="bg-white/95 backdrop-blur-xl border-t border-border px-4 py-4 space-y-1">
          <Link
            href="/category/software"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
          >
            <span>🖥️</span>
            Software
          </Link>
          <div className="border-t border-border my-2" />
          {CATEGORIES.filter((c) => !["software", "celebrities", "travel", "military", "economy", "history", "brands", "finance", "education"].includes(c.slug)).slice(0, 6).map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
            >
              <span>{cat.icon}</span>
              {cat.name}
            </Link>
          ))}
          <div className="border-t border-border my-2" />
          <Link
            href="/trending"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
          >
            <span>🔥</span> Trending
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-text-secondary hover:text-text hover:bg-surface-alt rounded-lg transition-colors"
          >
            <span>📝</span> Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
