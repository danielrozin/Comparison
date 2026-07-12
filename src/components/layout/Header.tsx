"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [searchHintIdx, setSearchHintIdx] = useState(0);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLElement>(null);

  const SEARCH_HINTS = [
    "iPhone vs Android…",
    "React vs Vue…",
    "Nike vs Adidas…",
    "Mac vs PC…",
    "Coffee vs Tea…",
    "Netflix vs Disney+…",
    "Tesla vs BMW…",
    "Python vs JavaScript…",
  ];
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setSearchHintIdx((i) => (i + 1) % SEARCH_HINTS.length), 2800);
    return () => clearInterval(id);
  }, [SEARCH_HINTS.length]);

  useEffect(() => {
    const fn = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // Close mobile menu when the route changes (Next.js soft-navigation).
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [pathname]);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDropdown(null);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  // WCAG 2.1 §3.2.5 — Escape closes both the mobile menu and any open dropdown.
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (openDropdown) { setOpenDropdown(null); return; }
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [openDropdown, mobileMenuOpen]);

  // WCAG 2.1 SC 2.1.2 — Focus trap for mobile menu overlay.
  useEffect(() => {
    if (!mobileMenuOpen) return;
    function onTab(e: KeyboardEvent) {
      if (e.key !== "Tab" || !mobileMenuRef.current) return;
      const focusable = Array.from(
        mobileMenuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    document.addEventListener("keydown", onTab);
    return () => document.removeEventListener("keydown", onTab);
  }, [mobileMenuOpen]);

  function handleEnter(slug: string) {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setOpenDropdown(slug);
  }

  function handleLeave() {
    hoverTimeout.current = setTimeout(() => setOpenDropdown(null), 150);
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white border-b border-border"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-600 rounded-xl shadow-sm shadow-primary-400/40 flex items-center justify-center group-hover:shadow-md group-hover:shadow-primary-400/50 transition-all duration-200">
              <span className="text-white font-black text-xs tracking-tight drop-shadow-sm">VS</span>
            </div>
            <span className="text-lg font-bold text-text hidden sm:block group-hover:text-primary-700 transition-colors duration-200">{SITE_NAME}</span>
          </Link>

          {/* Desktop nav */}
          <nav ref={navRef} aria-label="Primary navigation" className="hidden lg:flex items-center">
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
                  onFocus={() => hasSubs && setOpenDropdown(item.slug)}
                  onBlur={(e) => {
                    if (hasSubs && !e.currentTarget.contains(e.relatedTarget as Node)) {
                      setOpenDropdown(null);
                    }
                  }}
                >
                  <Link
                    href={`/category/${item.slug}`}
                    aria-current={pathname?.startsWith(`/category/${item.slug}`) ? "page" : undefined}
                    aria-haspopup={hasSubs ? "menu" : undefined}
                    aria-expanded={hasSubs ? isOpen : undefined}
                    aria-controls={hasSubs ? `dropdown-${item.slug}` : undefined}
                    className={`inline-flex items-center gap-1 px-2.5 py-2 text-[13px] font-medium whitespace-nowrap rounded-lg transition-colors ${
                      isOpen || pathname?.startsWith(`/category/${item.slug}`) ? "text-text bg-surface-alt" : "text-text-secondary hover:text-text hover:bg-surface-alt/60"
                    }`}
                  >
                    {item.name}
                    {hasSubs && (
                      <svg className={`w-3 h-3 flex-shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                  </Link>

                  {/* Dropdown — only mounted when this dropdown is open, removes ~16KB of eager-rendered subcategory HTML from SSR */}
                  {hasSubs && isOpen && (
                    <div id={`dropdown-${item.slug}`} role="menu" aria-label={`${item.name} subcategories`} className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 bg-white rounded-xl shadow-xl border border-border ${
                      subs.length > 6 ? "w-[480px]" : "w-[260px]"
                    }`}>
                      <div className={`p-2 ${subs.length > 6 ? "grid grid-cols-2 gap-0.5" : ""}`}>
                        {subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${item.slug}/${sub.slug}`}
                            role="menuitem"
                            onClick={() => setOpenDropdown(null)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-alt/60 transition-colors group"
                          >
                            <span className="text-base flex-shrink-0" aria-hidden="true">{sub.icon}</span>
                            <span className="text-sm text-text-secondary group-hover:text-text">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-border/50 px-3 py-2">
                        <Link
                          href={`/category/${item.slug}`}
                          role="menuitem"
                          onClick={() => setOpenDropdown(null)}
                          className="flex items-center justify-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          View all {item.name.toLowerCase()} <span aria-hidden="true">→</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            <div className="w-px h-5 bg-border mx-1 flex-shrink-0" />

            <Link href="/trending" aria-current={pathname === "/trending" ? "page" : undefined} className={`flex-shrink-0 px-2.5 py-2 text-[13px] font-medium hover:bg-surface-alt/60 rounded-lg transition-colors whitespace-nowrap ${pathname === "/trending" ? "text-text bg-surface-alt" : "text-text-secondary hover:text-text"}`}>
              Trending
            </Link>
            <Link href="/blog" aria-current={pathname?.startsWith("/blog") ? "page" : undefined} className={`flex-shrink-0 px-2.5 py-2 text-[13px] font-medium hover:bg-surface-alt/60 rounded-lg transition-colors whitespace-nowrap ${pathname?.startsWith("/blog") ? "text-text bg-surface-alt" : "text-text-secondary hover:text-text"}`}>
              Blog
            </Link>
            <Link href="/reviews" aria-current={pathname?.startsWith("/reviews") ? "page" : undefined} className={`flex-shrink-0 px-2.5 py-2 text-[13px] font-medium hover:bg-surface-alt/60 rounded-lg transition-colors whitespace-nowrap ${pathname?.startsWith("/reviews") ? "text-text bg-surface-alt" : "text-text-secondary hover:text-text"}`}>
              Reviews
            </Link>
            <Link href="/requests" aria-current={pathname === "/requests" ? "page" : undefined} className="flex-shrink-0 px-2.5 py-2 text-[13px] font-medium text-accent-600 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors whitespace-nowrap">
              Requests
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-search-overlay"))}
              aria-label="Search (⌘K or /)"
              className="group flex items-center gap-2 px-4 py-2 bg-surface-alt hover:bg-white border border-border hover:border-primary-200 hover:ring-2 hover:ring-primary-100 rounded-full text-sm text-text-secondary/60 hover:text-text-secondary hover:shadow-sm transition-all duration-200"
            >
              <svg className="w-4 h-4 group-hover:text-primary-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="hidden sm:inline overflow-hidden whitespace-nowrap" aria-live="polite" aria-atomic="true">
                {SEARCH_HINTS[searchHintIdx]}
              </span>
              <span className="hidden md:inline-flex items-center gap-1 text-xs text-text-secondary/40 group-hover:text-text-secondary/60 transition-colors">
                <kbd className="inline-flex items-center bg-white border border-border/60 rounded px-1.5 py-0.5 font-mono group-hover:border-primary-200 transition-colors">⌘K</kbd>
                <span className="text-text-secondary/20">/</span>
                <kbd className="inline-flex items-center bg-white border border-border/60 rounded px-1.5 py-0.5 font-mono group-hover:border-primary-200 transition-colors">/</kbd>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex items-center justify-center w-11 h-11 rounded-full hover:bg-surface-alt transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-text" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Mobile menu — only mounted when open, removes ~18KB of subcategory HTML from initial SSR ─── */}
      {mobileMenuOpen && (
      <nav id="mobile-menu" ref={mobileMenuRef} aria-label="Mobile navigation" className="lg:hidden">
        <div className="bg-white border-t border-border overflow-y-auto max-h-[80vh]">
          {/* Search */}
          <div className="p-4 pb-2 sm:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                window.dispatchEvent(new Event("open-search-overlay"));
              }}
              className="flex items-center gap-3 w-full h-11 px-4 bg-surface-alt border border-border rounded-full text-sm text-text-secondary text-left"
            >
              <svg className="w-4 h-4 text-text-secondary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search comparisons...
            </button>
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
                      className="flex-1 px-3 py-3 text-[15px] font-medium text-text active:bg-surface-alt rounded-lg"
                    >
                      {item.name}
                    </Link>
                    {subs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileExpanded(isExpanded ? null : item.slug)}
                        aria-expanded={isExpanded}
                        aria-controls={`mobile-subs-${item.slug}`}
                        aria-label={`${isExpanded ? "Collapse" : "Expand"} ${item.name} subcategories`}
                        className="flex items-center justify-center w-11 h-11 rounded-lg active:bg-surface-alt"
                      >
                        <svg className={`w-4 h-4 text-text-secondary transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Expandable subcategories — grid-rows trick for smooth natural-height animation */}
                  <div id={`mobile-subs-${item.slug}`} aria-hidden={!isExpanded} className={`grid transition-all duration-200 ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <div className="grid grid-cols-2 gap-0.5 pb-2 pl-2">
                        {subs.map((sub) => (
                          <Link
                            key={sub.slug}
                            href={`/category/${item.slug}/${sub.slug}`}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-[13px] text-text-secondary rounded-lg active:bg-surface-alt"
                          >
                            <span aria-hidden="true">{sub.icon}</span>
                            <span className="truncate">{sub.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mx-4 h-px bg-border/50" />

          <div className="p-4 grid grid-cols-4 gap-2">
            <Link href="/trending" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-text bg-surface-alt rounded-xl active:bg-primary-50 transition-colors">
              <svg className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span className="text-xs font-semibold">Trending</span>
            </Link>
            <Link href="/blog" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-text bg-surface-alt rounded-xl active:bg-primary-50 transition-colors">
              <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-xs font-semibold">Blog</span>
            </Link>
            <Link href="/reviews" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-text bg-surface-alt rounded-xl active:bg-primary-50 transition-colors">
              <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-xs font-semibold">Reviews</span>
            </Link>
            <Link href="/requests" onClick={() => setMobileMenuOpen(false)} className="flex flex-col items-center gap-1 py-3 text-accent-600 bg-accent-50 rounded-xl active:bg-accent-100 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="text-xs font-semibold">Requests</span>
            </Link>
          </div>
        </div>
      </nav>
      )}
    </header>
  );
}
