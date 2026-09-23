"use client";

import { useState } from "react";
import { normalizeCheckoutEmail } from "@/lib/analytics/checkout-identity";
import {
  getCheckoutDistinctId,
  identifySubscriber,
  trackCheckoutClicked,
} from "@/lib/utils/analytics";

/** Reservation mode answers 400 with this idea. Any other 400 is a real error. */
function isReservationEmailError(error: unknown): boolean {
  return typeof error === "string" && /email/i.test(error);
}

/**
 * The one buy button. POSTs to /api/checkout:
 * - Stripe configured → redirect straight to Stripe's hosted checkout.
 * - Not yet → inline email field, founding-member reservation, honest copy
 *   ("nothing charged today"). Same component converts in both modes.
 */
export function CheckoutButton({
  plan,
  interval,
  src,
  label,
  className,
  paymentsLive = false,
}: {
  plan: string;
  interval: string;
  src: string;
  label: string;
  className?: string;
  /** This interval has a Stripe price. The note under the button says so. */
  paymentsLive?: boolean;
}) {
  const [phase, setPhase] = useState<"idle" | "email" | "busy" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(withEmail: boolean) {
    setPhase("busy");
    if (!withEmail) trackCheckoutClicked(plan, interval, src); // first click only, not the email re-submit

    // Snapshot the id that already owns this browser's funnel events, then
    // alias it to the email when we know one. Identify runs before the
    // redirect (and before the request, so the alias has time to send).
    // The session still stores the pre-identify id — see ROO-40.
    const posthogDistinctId = getCheckoutDistinctId();
    const typedEmail = withEmail ? normalizeCheckoutEmail(email) : undefined;
    const knownEmail = typedEmail || normalizeCheckoutEmail(posthogDistinctId);
    if (knownEmail) identifySubscriber(knownEmail);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          interval,
          src,
          ...(withEmail && email.trim() ? { email: email.trim() } : {}),
          ...(posthogDistinctId ? { posthogDistinctId } : {}),
        }),
      });
      const data = await res.json();
      if (data.mode === "stripe" && data.url) {
        // Call again immediately before navigation so PostHog can flush the
        // $identify on page unload if the first call is still queued.
        if (knownEmail) identifySubscriber(knownEmail);
        window.location.assign(data.url);
        return;
      }
      if (res.ok && data.mode === "reservation") {
        if (typedEmail) identifySubscriber(typedEmail);
        setMessage(data.message);
        setPhase("done");
        return;
      }
      // reservation mode needs an email — reveal the field.
      // A different 400 (unknown plan, and so on) must not pretend checkout
      // is still "nothing charged today" once Stripe is the live path.
      if (res.status === 400 && !withEmail && isReservationEmailError(data.error)) {
        setPhase("email");
        return;
      }
      setMessage(data.error || "Something went wrong — try again.");
      setPhase("error");
    } catch {
      setMessage("Network error — try again.");
      setPhase("error");
    }
  }

  if (phase === "done") {
    return (
      <p className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-3" role="status">
        ✓ {message}
      </p>
    );
  }

  if (phase === "email" || (phase === "error" && email) || (phase === "busy" && email)) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void submit(true);
        }}
        className="space-y-2"
      >
        <label className="sr-only" htmlFor={`email-${plan}-${interval}`}>
          Email address
        </label>
        <input
          id={`email-${plan}-${interval}`}
          type="email"
          required
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="w-full rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={phase === "busy"}
          className={className}
        >
          {phase === "busy" ? "Locking your price…" : "Lock my founding price"}
        </button>
        {phase === "error" && <p className="text-xs text-red-600">{message}</p>}
        <p className="text-[11px] text-text-secondary leading-snug">
          Nothing is charged today. Checkout opens this week — your link arrives by email, price locked.
        </p>
      </form>
    );
  }

  return (
    <div className="space-y-2">
      <button type="button" onClick={() => void submit(false)} disabled={phase === "busy"} className={className}>
        {phase === "busy" ? "One moment…" : label}
      </button>
      {paymentsLive && (
        <p className="text-[11px] text-text-secondary leading-snug">
          Continues on Stripe. Your card is entered there, not on this site.
        </p>
      )}
      {phase === "error" && <p className="text-xs text-red-600">{message}</p>}
    </div>
  );
}
