"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Notification {
  slug: string;
  title: string;
}

const VIEWS_EMOJIS = ["👀", "🔍", "⚡", "🔥"];

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function LiveActivityToast({ items }: { items: Notification[] }) {
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const [animate, setAnimate] = useState(false);

  const next = useCallback(() => {
    setAnimate(false);
    setTimeout(() => {
      setCurrent((c) => (c + 1) % items.length);
      setAnimate(true);
    }, 300);
  }, [items.length]);

  // Show after 4s, rotate every 6s
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setVisible(true);
      setAnimate(true);
    }, 4000);
    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [visible, next]);

  if (!items.length || !visible) return null;

  const item = items[current];
  if (!item) return null;

  const parts = item.title.split(/\s+vs\.?\s+/i);
  const a = parts[0] || item.title;
  const b = parts[1] || "";
  const emoji = VIEWS_EMOJIS[current % VIEWS_EMOJIS.length];
  // Simulate a "just now" count between 1-12 people
  const people = randomBetween(2, 14);

  return (
    <div
      className={`absolute bottom-14 left-4 sm:bottom-10 sm:left-6 z-20 transition-all duration-300 motion-reduce:transition-none ${
        animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      }`}
      aria-live="polite"
      aria-atomic="true"
    >
      <Link
        href={`/compare/${item.slug}`}
        aria-label={`${people} people comparing ${a} vs ${b} now — view comparison`}
        className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 hover:border-white/30 rounded-xl px-3 py-2.5 max-w-[280px] sm:max-w-[320px] transition-all duration-200 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/50"
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-base" aria-hidden="true">
          {emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-white/60 leading-none mb-0.5">
            <span className="font-semibold text-white/80">{people} people</span> comparing now
          </p>
          <p className="text-xs font-semibold text-white truncate group-hover:text-white/90">
            {a}
            <span className="mx-1 text-white/60 font-normal">vs</span>
            {b}
          </p>
        </div>
        <svg className="w-3.5 h-3.5 text-white/30 flex-shrink-0 group-hover:text-white/60 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
