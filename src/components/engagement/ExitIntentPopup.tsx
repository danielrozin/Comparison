"use client";

import { useState, useEffect, useCallback } from "react";
import { trackNewsletterSignup, trackExitIntentShown, trackExitIntentDismissed } from "@/lib/utils/analytics";

const DISMISSED_KEY = "exit_intent_dismissed";
const DISMISS_DAYS = 7;

export function ExitIntentPopup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const dismiss = useCallback(() => {
    setVisible(false);
    localStorage.setItem(DISMISSED_KEY, Date.now().toString());
    trackExitIntentDismissed(typeof window !== "undefined" ? window.location.pathname : "");
  }, []);

  useEffect(() => {
    // Don't show on mobile (no reliable exit intent) or if recently dismissed
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;

    const dismissedAt = localStorage.getItem(DISMISSED_KEY);
    if (dismissedAt) {
      const daysSince = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSince < DISMISS_DAYS) return;
    }

    let triggered = false;
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !triggered) {
        triggered = true;
        setVisible(true);
        trackExitIntentShown(window.location.pathname);
      }
    };

    // Delay attaching listener so it doesn't fire on page load
    const timer = setTimeout(() => {
      document.addEventListener("mouseleave", handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
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
        body: JSON.stringify({ email: email.trim(), source: "exit_intent" }),
      });
      if (res.ok) {
        setStatus("success");
        trackNewsletterSignup(window.location.pathname, "exit_intent");
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={dismiss} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-bold text-text">You&apos;re in!</p>
            <p className="text-sm text-text-secondary mt-1">Check your inbox for the best comparisons.</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-text">Before you go — one quick thing</h2>
              <p className="text-sm text-text-secondary mt-2">
                Join readers who get our top comparisons, buying guides, and expert picks delivered weekly. Always free, unsubscribe anytime.
              </p>
              <p className="text-xs text-primary-600 font-medium mt-1.5">
                Trusted by comparison shoppers everywhere
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
                autoFocus
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {status === "loading" ? "Subscribing..." : "Yes, Send Me the Best Picks"}
              </button>
            </form>

            {status === "error" && (
              <p className="text-red-600 text-xs text-center mt-2">Something went wrong. Please try again.</p>
            )}

            <button
              onClick={dismiss}
              className="w-full text-center text-xs text-text-secondary mt-3 hover:text-text transition-colors"
            >
              No thanks, I&apos;ll pass
            </button>
          </>
        )}
      </div>
    </div>
  );
}
