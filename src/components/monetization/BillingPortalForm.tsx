"use client";

import { useState } from "react";

/**
 * Asks for the paid email. The server always answers with the same sentence
 * so the form cannot be used to find which emails are members. When the
 * email is an active AversusB member, the server emails a one-time link.
 */
export function BillingPortalForm({ linkInvalid = false }: { linkInvalid?: boolean }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const res = await fetch("/api/billing-portal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Could not send a billing link. Please try again.");
        return;
      }
      setMessage(
        typeof data.message === "string"
          ? data.message
          : "If that email has an active membership, we sent a one-time link to manage billing."
      );
    } catch {
      setError("Could not send a billing link. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {linkInvalid && (
        <div role="alert" className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          That billing link is invalid or has expired. Enter your email to get a new one.
        </div>
      )}
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
        </div>
      )}
      {message && (
        <div role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-950">
          <p>{message}</p>
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus:ring-primary-500"
      >
        {loading ? "Sending link…" : "Email me a billing link"}
      </button>
    </form>
  );
}
