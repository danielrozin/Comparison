"use client";

import { useState, useEffect, useCallback } from "react";
import { trackNewsletterSignup, trackEvent } from "@/lib/utils/analytics";

const DISMISSED_KEY = "mobile_exit_intent_dismissed";
const DISMISS_DAYS = 7;
const SCROLL_THRESHOLD = 0.4; // trigger after 40% scroll-up from max scroll

export function MobileExitIntent() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
  }, []);

  useEffect(() => {
    // Only show on mobile
    if (window.innerWidth >= 768) return;

    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    let maxScroll = 0;
    let triggered = false;
    let timeOnPage = 0;

    const timer = setInterval(() => { timeOnPage += 1; }, 1000);

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? scrollY / docHeight : 0;

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;
      }

      // Trigger: user has scrolled past 50%, then scrolled back up by 40%+ of their max
      // AND has spent at least 15 seconds on page
      if (
        !triggered &&
        timeOnPage >= 15 &&
        maxScroll > 0.5 &&
        scrollPercent < maxScroll - SCROLL_THRESHOLD
      ) {
        triggered = true;
        setVisible(true);
        trackEvent("exit_intent_shown", { page: window.location.pathname, device: "mobile" });
      }
    };

    // Delay listener to avoid false positives during initial scroll
    const attachTimer = setTimeout(() => {
      window.addEventListener("scroll", handleScroll, { passive: true });
    }, 8000);

    return () => {
      clearTimeout(attachTimer);
      clearInterval(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source: "mobile_exit_intent" }),
      });
      if (res.ok) {
        setStatus("success");
        trackNewsletterSignup(window.location.pathname, "mobile_exit_intent");
        setTimeout(dismiss, 2000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 animate-in slide-in-from-bottom duration-300">
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] rounded-t-2xl px-4 pt-4 pb-6 safe-bottom">
        {/* Handle bar */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 p-1"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-2">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-base font-bold text-text">You&apos;re subscribed!</p>
          </div>
        ) : (
          <>
            <p className="text-sm font-semibold text-text text-center mb-1">
              Get weekly comparison insights
            </p>
            <p className="text-xs text-text-secondary text-center mb-3">
              Trending comparisons & expert picks. Free, no spam.
            </p>

            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="you@example.com"
                required
                className="flex-1 min-w-0 px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg text-sm whitespace-nowrap transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-600 text-xs text-center mt-2">Something went wrong. Try again.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
