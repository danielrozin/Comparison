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
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 ${
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
          aria-label="Open search"
          className="flex flex-col items-center justify-center gap-0.5 text-text-secondary/70 transition-colors duration-150 active:text-primary-600"
        >
          <div className="p-1.5 rounded-xl">
            <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </div>
          <span className="text-xs font-semibold tracking-tight text-text-secondary/60">Search</span>
        </button>

        {/* Trending */}
        <Link
          href="/trending"
          aria-current={isTrending ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 ${
            isTrending ? "text-orange-500" : "text-text-secondary/70"
          }`}
        >
          <div className={`p-1.5 rounded-xl transition-all duration-150 ${isTrending ? "bg-orange-100" : ""}`}>
            <svg className="w-[19px] h-[19px]" viewBox="0 0 24 24" fill={isTrending ? "currentColor" : "none"} stroke={isTrending ? "none" : "currentColor"} strokeWidth={1.75} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
          </div>
          <span className={`text-xs font-semibold tracking-tight ${isTrending ? "text-orange-500" : "text-text-secondary/60"}`}>Trending</span>
        </Link>

        {/* Blog / Reviews — active on either */}
        <Link
          href="/blog"
          aria-current={isBlog || isReviews ? "page" : undefined}
          className={`flex flex-col items-center justify-center gap-0.5 transition-colors duration-150 ${
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
