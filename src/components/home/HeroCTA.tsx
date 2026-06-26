"use client";

import Link from "next/link";

export function HeroCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
      <button
        type="button"
        onClick={() => {
          const input = document.querySelector<HTMLInputElement>('#search input[type="text"]');
          input?.focus();
        }}
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-white text-primary-700 font-bold rounded-full hover:bg-primary-50 transition-all shadow-lg shadow-black/10 text-base hover:scale-105 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-primary-800"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Start Comparing
      </button>
      <Link
        href="/trending"
        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full border border-white/20 hover:border-white/40 transition-all text-base backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
        </svg>
        Browse Trending
      </Link>
    </div>
  );
}
