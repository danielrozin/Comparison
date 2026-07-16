"use client";

import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/utils/analytics";

interface NewsletterSignupProps {
  source: string;
  referrerSlug?: string;
  variant?: "inline" | "card";
}

export function NewsletterSignup({ source, referrerSlug, variant = "card" }: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, referrerSlug }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        trackNewsletterSignup(referrerSlug || source, variant);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    if (variant === "card") {
      return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl overflow-hidden">
            <div className="h-0.5 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-400" />
            <div className="p-6 sm:p-8 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-sm">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p role="status" aria-live="polite" className="text-base font-bold text-emerald-800 mb-1">You&apos;re in!</p>
              <p className="text-sm text-emerald-700/80">We&apos;ll send you the best comparisons weekly. No spam, unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      );
    }
    return (
      <p role="status" aria-live="polite" className="text-sm font-medium text-green-400">
        ✓ Subscribed! Weekly comparisons incoming.
      </p>
    );
  }

  if (variant === "inline") {
    return (
      <div className="max-w-md">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            autoComplete="email"
            enterKeyHint="go"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="Your email address"
            aria-label="Email address"
            aria-describedby={status === "error" ? "nl-inline-error" : undefined}
            aria-invalid={status === "error" ? "true" : undefined}
            required
            className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder:text-white/60 focus:outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-400"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-4 py-2 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-medium rounded-lg transition-all duration-150 disabled:opacity-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
          >
            {status === "loading" ? "…" : "Subscribe"}
          </button>
        </form>
        {status === "error" && (
          <p id="nl-inline-error" role="alert" className="text-red-400 text-xs mt-1.5">Something went wrong. Try again.</p>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl overflow-hidden">
        <div className="h-0.5 bg-gradient-to-r from-primary-400 via-accent-500 to-primary-400" />
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-sm flex-shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-text">
              Get the best comparisons in your inbox
            </h3>
          </div>
          <p className="text-sm text-text-secondary mb-4 text-center">
            Weekly digest of trending comparisons, new categories, and expert insights. No spam.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              autoComplete="email"
              enterKeyHint="go"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
              placeholder="you@example.com"
              aria-label="Email address"
              aria-describedby={status === "error" ? "nl-banner-error" : undefined}
              aria-invalid={status === "error" ? "true" : undefined}
              required
              className="flex-1 px-4 py-2.5 border border-border rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-5 py-2.5 bg-gradient-to-r from-primary-600 to-accent-600 hover:from-primary-700 hover:to-accent-700 text-white text-sm font-semibold rounded-lg transition-all duration-150 hover:shadow-md disabled:opacity-50 whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-700"
            >
              {status === "loading" ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
          {status === "error" && (
            <p id="nl-banner-error" role="alert" className="text-red-600 text-xs mt-2">Something went wrong. Please try again.</p>
          )}
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="flex -space-x-2" aria-hidden="true">
              {["#6366f1", "#8b5cf6", "#ec4899", "#f97316", "#10b981"].map((color, i) => (
                <div
                  key={i}
                  className="w-6 h-6 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: color }}
                >
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-xs text-text-secondary">
              Join <span className="font-semibold text-text">1,000+</span> readers · Unsubscribe anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
