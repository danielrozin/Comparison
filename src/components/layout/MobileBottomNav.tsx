"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function MobileBottomNav() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      if (y < 60) {
        setHidden(false);
        lastY.current = y;
        return;
      }
      setHidden(y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const isHome = pathname === "/";
  const isTrending = pathname === "/trending";
  const isBlog = pathname?.startsWith("/blog") ?? false;
  const isReviews = pathname?.startsWith("/reviews") ?? false;
  const isComparePage = pathname?.startsWith("/compare/") ?? false;

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className={`md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/96 backdrop-blur-lg border-t border-border shadow-[0_-2px_20px_rgba(0,0,0,0.07)] transition-transform duration-300 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4 h-14">
        {/* Home */}
        <Link
          href="/"
          aria-current={isHome ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-lg ${
            isHome ? "text-primary-600" : "text-text-secondary/70"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-150 ${isHome ? "bg-primary-100" : ""}`}>
            <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill={isHome ? "currentColor" : "none"} stroke={isHome ? "none" : "currentColor"} strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </div>
          <span className={`text-xs font-semibold tracking-tight ${isHome ? "text-primary-600" : "text-text-secondary/60"}`}>Home</span>
        </Link>

        {/* Search — opens the global search overlay */}
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event("open-search-overlay"))}
          aria-label={isComparePage ? "Open compare search" : "Open search"}
          className="flex flex-col items-center justify-center gap-0.5 text-text-secondary/70 transition-colors duration-150 active:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-lg"
        >
          <div className="p-1.5 rounded-xl">
            <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-tight text-text-secondary/60" aria-hidden="true">{isComparePage ? "Compare" : "Search"}</span>
        </button>

        {/* Trending */}
        <Link
          href="/trending"
          aria-current={isTrending ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-lg ${
            isTrending ? "text-orange-500" : "text-text-secondary/70"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-150 ${isTrending ? "bg-orange-100" : ""}`}>
            <svg className="w-[19px] h-[19px]" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
            </svg>
          </div>
          <span className={`text-xs font-semibold tracking-tight ${isTrending ? "text-orange-500" : "text-text-secondary/60"}`}>Trending</span>
        </Link>

        {/* Blog / Reviews — active on either */}
        <Link
          href="/blog"
          aria-current={isBlog || isReviews ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset rounded-lg ${
            isBlog || isReviews ? "text-violet-600" : "text-text-secondary/70"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-150 ${isBlog || isReviews ? "bg-violet-100" : ""}`}>
            <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill={isBlog || isReviews ? "currentColor" : "none"} stroke={isBlog || isReviews ? "none" : "currentColor"} strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </div>
          <span className={`text-xs font-semibold tracking-tight ${isBlog || isReviews ? "text-violet-600" : "text-text-secondary/60"}`}>Blog</span>
        </Link>
      </div>
    </nav>
  );
}
