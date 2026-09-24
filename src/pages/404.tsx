"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

/**
 * Pages Router 404. Unknown /compare/* URLs land here (they are not App
 * Router not-found). A missing matchup is the moment someone wanted a custom
 * comparison — send them to the gated form instead of a blank Next.js 404.
 */
export default function PagesNotFound() {
  const [customHref, setCustomHref] = useState("/custom-compare");

  useEffect(() => {
    const path = window.location.pathname;
    const match = path.match(/^\/compare\/([a-z0-9-]+)\/?$/i);
    if (match) {
      setCustomHref(`/custom-compare?slug=${encodeURIComponent(match[1].toLowerCase())}`);
    }
  }, []);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-primary-600 mb-2">404</p>
      <h1 className="text-3xl font-display font-bold text-text mb-3">We don&apos;t have that page</h1>
      <p className="text-text-secondary mb-6">
        Published comparisons stay free. If this was a matchup we haven&apos;t built, Pro members can request it
        and we publish it within 24 hours. Everyone else gets a clear link to pricing — the request is not dropped quietly.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={customHref}
          className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
        >
          Request this comparison
        </Link>
        <Link
          href="/pricing?src=missing-compare"
          className="inline-flex items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt"
        >
          See Pro pricing
        </Link>
      </div>
    </div>
  );
}
