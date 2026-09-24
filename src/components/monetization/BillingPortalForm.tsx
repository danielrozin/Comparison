"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Looks up the paid email and sends the browser to a fresh Stripe Customer
 * Portal session. Unknown emails see a pricing link instead of a blank page.
 */
export function BillingPortalForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgradeUrl, setUpgradeUrl] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setUpgradeUrl(null);

    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) {
        setError(data.error || "Could not open billing.");
        if (typeof data.upgradeUrl === "string") setUpgradeUrl(data.upgradeUrl);
        return;
      }
      window.location.assign(data.url);
    } catch {
      setError("Could not open billing. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="billing-email" className="block text-sm font-medium text-text mb-1">
          Email you paid with
        </label>
        <input
          id="billing-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-2.5 border border-border rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
        />
      </div>
      {error && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          <p>{error}</p>
          {upgradeUrl && (
            <p className="mt-2">
              <Link href={upgradeUrl} className="font-semibold text-primary-700 underline-offset-2 hover:underline">
                See Pro pricing
              </Link>
            </p>
          )}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus:ring-primary-500"
      >
        {loading ? "Opening billing…" : "Manage billing"}
      </button>
    </form>
  );
}
