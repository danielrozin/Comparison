"use client";

import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/utils/analytics";

const CATEGORY_OPTIONS = [
  { value: "technology", label: "Technology" },
  { value: "sports", label: "Sports" },
  { value: "countries", label: "Countries" },
  { value: "products", label: "Products" },
  { value: "health", label: "Health" },
  { value: "companies", label: "Companies" },
  { value: "entertainment", label: "Entertainment" },
  { value: "brands", label: "Brands" },
  { value: "automotive", label: "Automotive" },
];

interface NewsletterSignupProps {
  source: string;
  referrerSlug?: string;
  variant?: "inline" | "card";
  showCategories?: boolean;
  defaultCategory?: string;
}

export function NewsletterSignup({
  source,
  referrerSlug,
  variant = "card",
  showCategories = false,
  defaultCategory,
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    defaultCategory ? [defaultCategory] : []
  );
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "already" | "error">("idle");

  const toggleCategory = (value: string) => {
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source,
          referrerSlug,
          categories: selectedCategories.length > 0 ? selectedCategories : undefined,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.alreadySubscribed ? "already" : "success");
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
    return (
      <div className={variant === "card" ? "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <div className={`${variant === "card" ? "bg-blue-50 border border-blue-200 rounded-xl p-6" : ""} text-center`}>
          <p className={`font-medium ${variant === "card" ? "text-blue-800" : "text-blue-400"}`}>
            Check your email to confirm your subscription!
          </p>
          <p className={`text-sm mt-1 ${variant === "card" ? "text-blue-600" : "text-blue-300"}`}>
            We sent a confirmation link. Click it to start receiving comparisons.
          </p>
        </div>
      </div>
    );
  }

  if (status === "already") {
    return (
      <div className={variant === "card" ? "max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <div className={`${variant === "card" ? "bg-green-50 border border-green-200 rounded-xl p-6" : ""} text-center`}>
          <p className={`font-medium ${variant === "card" ? "text-green-800" : "text-green-400"}`}>
            You&apos;re already subscribed! Preferences updated.
          </p>
        </div>
      </div>
    );
  }

  if (variant === "inline") {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2 max-w-md">
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setStatus("idle"); }}
          placeholder="Your email address"
          required
          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Subscribe"}
        </button>
        {status === "error" && (
          <p className="text-red-400 text-xs mt-1">Something went wrong. Try again.</p>
        )}
      </form>
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

        {showCategories && (
          <div className="flex flex-wrap justify-center gap-2 mb-4 max-w-lg mx-auto">
            {CATEGORY_OPTIONS.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  selectedCategories.includes(cat.value)
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-text-secondary border-gray-300 hover:border-primary-400"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}

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
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : "Subscribe Free"}
          </button>
        </form>
        {status === "error" && (
          <p className="text-red-600 text-xs mt-2">Something went wrong. Please try again.</p>
        )}
        <p className="text-xs text-text-secondary mt-3">
          We&apos;ll send a confirmation email. Unsubscribe anytime.
        </p>
      </div>
    </div>
  );
}
