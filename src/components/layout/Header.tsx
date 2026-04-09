"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { SITE_NAME, CATEGORY_SUBCATEGORIES } from "@/lib/utils/constants";

const NAV_ITEMS = [
  { slug: "software", name: "Software" },
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
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
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  function handleEnter(slug: string) {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdown(slug);
  }

  function handleLeave() {
    hoverTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  return (
    <header className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${scrolled ? "shadow-md" : "border-b border-gray-200"}`}>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[60] focus:top-2 focus:left-2 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-lg focus:text-sm focus:font-medium">
        Skip to main content
      </a>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-accent-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-xs">VS</span>
            </div>
            <span className="text-lg font-bold text-gray-900 hidden sm:block">{SITE_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} className="hidden lg:flex items-center">
            {NAV_ITEMS.map((item, idx) => {
              const subs = CATEGORY_SUBCATEGORIES[item.slug];
              const hasSubs = subs && subs.length > 0;
              const isOpen = openDropdown === item.slug;
              // Hide last 2 items on lg, show all on xl
              const hideOnLg = idx >= NAV_ITEMS.length - 2;

              return (
                <div
                  key={item.slug}
                  className={`relative flex-shrink-0 ${hideOnLg ? "hidden xl:block" : ""}`}
                  onMouseEnter={() => hasSubs && handleEnter(item.slug)}
                  onMouseLeave={handleLeave}
                >
                  <Link
                    href={`/category/${item.slug}`}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                      isOpen ? "text-gray-900 bg-gray-100" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    {item.name}
                    {hasSubs && (
                      <svg className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown */}
                  {hasSubs && (
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-150 ${
                      subs.length > 6 ? "w-[480px]" : "w-[260px]"
                    } ${isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-1 pointer-events-none"}`}>
                      <div className={`p-2 ${subs.length > 6 ? "grid grid-cols-2 gap-0.5" : ""}`}>
                        {subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${item.slug}/${sub.slug}`}
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                          >
                            <span className="text-base flex-shrink-0">{sub.icon}</span>
                            <span className="text-sm text-gray-600 group-hover:text-gray-900">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-gray-100 px-3 py-2">
                        <Link
                          href={`/category/${item.slug}`}
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          View all {item.name.toLowerCase()} →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="w-px h-5 bg-gray-200 mx-1 flex-shrink-0" />

            <Link href="/trending" className="flex-shrink-0 px-2.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Trending
            </Link>
            <Link href="/blog" className="flex-shrink-0 px-2.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Blog
            </Link>
            <Link href="/reviews" className="flex-shrink-0 px-2.5 py-2 text-[13px] font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors whitespace-nowrap">
              Reviews
            </Link>
            <Link href="/requests" className="flex-shrink-0 px-2.5 py-2 text-[13px] font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors whitespace-nowrap">
              Requests
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

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
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
          {/* Search */}
          <div className="p-4 pb-2 sm:hidden">
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

          {/* Categories with expandable subcategories */}
          <div className="px-3 py-2">
            {NAV_ITEMS.map((item) => {
              const subs = CATEGORY_SUBCATEGORIES[item.slug] || [];
              const isExpanded = mobileExpanded === item.slug;

              return (
                <div key={item.slug}>
                  <div className="flex items-center">
                    <Link
                      href={`/category/${item.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex-1 px-3 py-3 text-[15px] font-medium text-gray-800 active:bg-gray-100 rounded-lg"
                    >
                      {item.name}
                    </Link>
                    {subs.length > 0 && (
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.slug)}
                        className="flex items-center justify-center w-10 h-10 rounded-lg active:bg-gray-100"
                        aria-label={`Expand ${item.name}`}
                      >
                        <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Expandable subcategories */}
                  <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="grid grid-cols-2 gap-0.5 pb-2 pl-2">
                      {subs.map((sub) => (
                        <Link
                          key={sub.slug}
                          href={`/category/${item.slug}/${sub.slug}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-[13px] text-gray-500 rounded-lg active:bg-gray-100"
                        >
                          <span>{sub.icon}</span>
                          <span className="truncate">{sub.name}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-4 h-px bg-gray-100" />

          <div className="p-4 flex gap-2">
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg active:bg-gray-200">
              🔥 Trending
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg active:bg-gray-200">
              📝 Blog
            </Link>
            <Link href="/reviews" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg active:bg-gray-200">
              ⭐ Reviews
            </Link>
            <Link href="/requests" onClick={() => setMobileMenuOpen(false)} className="flex-1 text-center py-2.5 text-sm font-medium text-accent-600 bg-accent-50 rounded-lg active:bg-accent-100">
              💡 Requests
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
