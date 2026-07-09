"use client";

import { useEffect, useState } from "react";

export function ReadingProgressBar() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      setPct(Math.min(100, Math.round((scrollTop / docHeight) * 100)));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Reading progress"
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] pointer-events-none"
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-violet-500 transition-[width] duration-100 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
