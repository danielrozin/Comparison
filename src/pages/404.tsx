import Link from "next/link";
import { useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { OnDemandComparison } from "@/components/comparison/OnDemandComparison";
import { isUserGenerationEnabled } from "@/lib/generation/user-generation-guard";
import {
  canRequestComparisonSlug,
  canonicalRequestedComparisonSlug,
  entityLabelFromSlug,
} from "@/lib/parse-comparison-query";
import { parseComparisonSlug } from "@/lib/utils/slugify";

/**
 * Pages Router 404. A missing two-entity /compare URL can show the on-demand
 * builder when USER_GENERATION_ENABLED is on. The HTTP status stays 404, and
 * _document already sends X-Robots-Tag: noindex. Generation starts in that
 * component after load, never while this HTML is rendered.
 *
 * The flag off, and archived / draft / review slugs, keep the previous
 * request copy. They must not promise a page we will not build.
 *
 * Other 404s keep the Pro custom-compare link. That product flow is unchanged.
 */

type Mode =
  | { kind: "pending" }
  | { kind: "plain"; compareSlug: string | null }
  | { kind: "request"; compareSlug: string | null }
  | { kind: "build"; slug: string };

export default function PagesNotFound({
  generationEnabled = false,
}: {
  generationEnabled?: boolean;
}) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>({ kind: "pending" });

  useLayoutEffect(() => {
    let cancelled = false;

    async function resolve() {
      const path = window.location.pathname;
      const match = path.match(/^\/compare\/([a-z0-9-]+)\/?$/i);
      if (!match) {
        if (!cancelled) setMode({ kind: "plain", compareSlug: null });
        return;
      }
      const slug = match[1].toLowerCase();

      // Flag off: same request page as before this feature. No building copy.
      if (!generationEnabled) {
        if (!cancelled) setMode({ kind: "request", compareSlug: slug });
        return;
      }

      const parts = parseComparisonSlug(slug);
      if (!parts || parts.entities.length !== 2) {
        if (!cancelled) setMode({ kind: "plain", compareSlug: slug });
        return;
      }

      // A hidden row (archived, draft, review) 404s. Do not open the builder
      // and do not follow a canonical URL that would then 409.
      if (await pairIsHidden(slug)) {
        if (!cancelled) setMode({ kind: "request", compareSlug: slug });
        return;
      }
      if (cancelled) return;

      const canonical = canonicalRequestedComparisonSlug(slug);
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

    void resolve();
    router.events.on("routeChangeComplete", resolve);
    return () => {
      cancelled = true;
      router.events.off("routeChangeComplete", resolve);
    };
  }, [router, generationEnabled]);

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

  if (mode.kind === "request") {
    return <RequestComparison slug={mode.compareSlug} />;
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

  return <RequestComparison slug={null} />;
}

function RequestComparison({ slug }: { slug: string | null }) {
  const href = slug
    ? `/custom-compare?slug=${encodeURIComponent(slug)}`
    : "/custom-compare";
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
          href={href}
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

async function pairIsHidden(slug: string): Promise<boolean> {
  try {
    const response = await fetch(
      `/api/comparisons/${encodeURIComponent(slug)}?lookup=availability`,
    );
    if (response.ok) return false;
    const body = await response.json().catch(() => ({}));
    return body?.unavailable === true;
  } catch {
    // If we cannot tell, do not promise a build that would come back 409.
    return true;
  }
}

export function getStaticProps() {
  return {
    props: {
      generationEnabled: isUserGenerationEnabled(),
    },
  };
}
