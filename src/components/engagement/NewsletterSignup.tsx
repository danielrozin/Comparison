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
  const [marketingConsent, setMarketingConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !marketingConsent) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, referrerSlug, marketingConsent }),
      });
      if (res.ok) {
        setStatus("success");
        trackNewsletterSignup(window.location.pathname, source);
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className={variant === "card" ? "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <div className={`${variant === "card" ? "bg-green-50 border border-green-200 rounded-xl p-6" : ""} text-center`}>
          <p className={`font-medium ${variant === "card" ? "text-green-800" : "text-green-400"}`}>
            Check your email to confirm your subscription!
          </p>
          <p className={`text-sm mt-1 ${variant === "card" ? "text-green-600" : "text-green-500/70"}`}>
            We sent a confirmation link to your inbox.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 bg-surface-alt/50 border border-border rounded-xl p-4 sm:p-5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text">Get weekly comparison picks</p>
            <p className="text-xs text-text-secondary mt-0.5">No spam. Unsubscribe anytime.</p>
          </div>
          <div className="w-full sm:w-auto space-y-2">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
                placeholder="you@example.com"
                required
                className="flex-1 sm:w-56 px-3 py-2 bg-surface border border-border rounded-lg text-sm text-text placeholder-text-secondary focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
              />
              <button
                type="submit"
                disabled={status === "loading" || !marketingConsent}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                {status === "loading" ? "..." : "Subscribe"}
              </button>
            </form>
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-border text-primary-600 focus:ring-primary-500"
              />
              <span className="text-xs text-text-secondary leading-tight">
                I agree to receive marketing emails. View our{" "}
                <a href="/privacy" className="underline hover:text-primary-600">Privacy Policy</a>.
              </span>
            </label>
            {status === "error" && (
              <p className="text-red-500 text-xs">Something went wrong. Try again.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-gradient-to-r from-primary-50 to-blue-50 border border-primary-200 rounded-xl p-6 sm:p-8 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-text mb-2">
          Get the best comparisons in your inbox
        </h3>
        <p className="text-sm text-text-secondary mb-4">
          Weekly digest of trending comparisons, new categories, and expert insights. No spam.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
            placeholder="you@example.com"
            required
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={status === "loading" || !marketingConsent}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
        <label className="flex items-start gap-2 max-w-md mx-auto mt-3 cursor-pointer text-left">
          <input
            type="checkbox"
            checked={marketingConsent}
            onChange={(e) => setMarketingConsent(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-xs text-text-secondary leading-tight">
            I agree to receive marketing emails. View our{" "}
            <a href="/privacy" className="underline hover:text-primary-600">Privacy Policy</a>.
          </span>
        </label>
        {status === "error" && (
          <p className="text-red-600 text-xs mt-2">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs text-text-secondary mt-2">
          Join 1,000+ readers. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
