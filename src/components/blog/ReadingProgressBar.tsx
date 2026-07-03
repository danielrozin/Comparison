"use client";

import { useState, useEffect, useRef } from "react";

export function ReadingProgressBar({ articleId }: { articleId?: string }) {
  const [progress, setProgress] = useState(0);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function update() {
      const el = articleId ? document.getElementById(articleId) : document.documentElement;
      if (!el) return;

      if (articleId) {
        const rect = el.getBoundingClientRect();
        const articleTop = rect.top + window.scrollY;
        const articleHeight = el.offsetHeight;
        const scrolled = window.scrollY - articleTop;
        const pct = Math.min(100, Math.max(0, (scrolled / (articleHeight - window.innerHeight)) * 100));
        setProgress(pct);
      } else {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? (window.scrollY / docHeight) * 100 : 0);
      }
    }

    function onScroll() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [articleId]);

  if (progress <= 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-0.5 bg-transparent"
      aria-hidden="true"
      role="presentation"
    >
      <div
        className="h-full bg-gradient-to-r from-primary-500 via-accent-500 to-primary-400 transition-[width] duration-75 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
