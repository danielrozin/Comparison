"use client";

import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { OnDemandComparison } from "@/components/comparison/OnDemandComparison";
import {
  canRequestComparisonSlug,
  canonicalRequestedComparisonSlug,
  entityLabelFromSlug,
} from "@/lib/parse-comparison-query";
import { parseComparisonSlug } from "@/lib/utils/slugify";

/**
 * Pages Router 404. A missing two-entity /compare URL is not a dead end:
 * visitors see the on-demand builder (the HTTP status stays 404, and
 * _document already sends X-Robots-Tag: noindex). Generation starts in that
 * component after load, never while this HTML is rendered.
 *
 * Other 404s keep the Pro custom-compare link. That product flow is unchanged.
 */

type Mode =
  | { kind: "pending" }
  | { kind: "plain"; compareSlug: string | null }
  | { kind: "build"; slug: string };

export default function PagesNotFound() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>({ kind: "pending" });

  useLayoutEffect(() => {
    function resolve() {
      const path = window.location.pathname;
      const match = path.match(/^\/compare\/([a-z0-9-]+)\/?$/i);
      if (!match) {
        setMode({ kind: "plain", compareSlug: null });
        return;
      }
      const slug = match[1].toLowerCase();
      const canonical = canonicalRequestedComparisonSlug(slug);
      // Reverse order and alias slugs share one page. Stay on "looking up"
      // until the address bar matches that page, so this effect runs again.
      if (canonical && canonical !== slug) {
        void router.replace(`/compare/${canonical}`);
        return;
      }
      if (canRequestComparisonSlug(slug)) {
        setMode({ kind: "build", slug });
        return;
      }
      setMode({ kind: "plain", compareSlug: slug });
    }

    resolve();
    router.events.on("routeChangeComplete", resolve);
    return () => {
      router.events.off("routeChangeComplete", resolve);
    };
  }, [router]);

  if (mode.kind === "pending") {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-text-secondary">Looking up this page…</p>
      </div>
    );
  }

  if (mode.kind === "build") {
    const parts = parseComparisonSlug(mode.slug);
    return (
      <OnDemandComparison
        slug={mode.slug}
        entityA={entityLabelFromSlug(parts?.entityA || "A")}
        entityB={entityLabelFromSlug(parts?.entityB || "B")}
      />
    );
  }

  // A compare-shaped URL we will not generate (self-compare, 3-way, junk)
  // used to send people to the Pro custom-compare form. Point them at search
  // and contact instead. Unrelated 404s keep the Pro links.
  if (mode.compareSlug) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-600 mb-2">404</p>
        <h1 className="text-3xl font-display font-bold text-text mb-3">We don&apos;t have that page</h1>
        <p className="text-text-secondary mb-6">
          That address isn&apos;t a comparison we can build. Try a search like &ldquo;Thailand vs Vietnam&rdquo;.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/search"
            className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Search comparisons
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt"
          >
            Contact us
          </Link>
        </div>
      </div>
    );
  }

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
          href="/custom-compare"
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
