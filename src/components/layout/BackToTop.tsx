"use client";

import { useState, useEffect } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
      }}
      aria-label="Back to top"
      className="fixed bottom-20 right-4 sm:bottom-8 sm:right-6 z-40 group w-11 h-11 bg-gradient-to-br from-primary-500 to-accent-600 rounded-full shadow-lg shadow-primary-500/30 flex items-center justify-center text-white hover:shadow-xl hover:shadow-primary-500/40 hover:scale-110 active:scale-95 transition-all duration-200 animate-fade-in"
    >
      <div className="absolute inset-0 rounded-full ring-2 ring-primary-400/30 ring-offset-1 ring-offset-white group-hover:ring-primary-400/60 transition-all duration-200" />
      <svg className="w-4 h-4 relative" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
