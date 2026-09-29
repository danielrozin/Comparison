"use client";

/**
 * Shown when /compare/<slug> does not exist yet.
 * The page around this component is an HTTP 404 with robots noindex.
 * Generation starts here, after load, and only in a real browser.
 */

import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { isAutomatedClient } from "@/lib/analytics/automated-client";
import { isKnownCrawlerUserAgent } from "@/lib/generation/crawler-ua";
import {
  trackCompareNotFound,
  trackGenerationRequested,
} from "@/lib/utils/analytics";

type Phase = "building" | "fallback" | "saved";

type Related = { slug: string; title: string };

const STEPS = [
  { id: "research", label: "Researching both sides" },
  { id: "compare", label: "Comparing the differences" },
  { id: "verdict", label: "Writing the verdict" },
] as const;

function stepIndex(elapsedMs: number): number {
  if (elapsedMs < 8000) return 0;
  if (elapsedMs < 20000) return 1;
  return 2;
}

export function OnDemandComparison({
  slug,
  entityA,
  entityB,
}: {
  slug: string;
  entityA: string;
  entityB: string;
}) {
  const [phase, setPhase] = useState<Phase>("building");
  const [elapsed, setElapsed] = useState(0);
  const [related, setRelated] = useState<Related[]>([]);
  const title = `We're building your comparison of ${entityA} vs ${entityB}`;

  useEffect(() => {
    trackCompareNotFound(slug, "compare_page");
  }, [slug]);

  useEffect(() => {
    if (phase !== "building") return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed(Date.now() - started), 500);
    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (isAutomatedClient() || isKnownCrawlerUserAgent(navigator.userAgent)) return;

    let cancelled = false;
    const reloadKey = `avb-built:${slug}`;

    async function loadRelated() {
      try {
        const response = await fetch("/api/v1/trending?limit=4");
        const data = await response.json();
        const items = Array.isArray(data?.comparisons) ? data.comparisons : [];
        if (!cancelled) {
          setRelated(
            items
              .filter((item: { slug?: string; title?: string }) => item.slug && item.slug !== slug)
              .slice(0, 4)
              .map((item: { slug: string; title?: string }) => ({
                slug: item.slug,
                title: item.title || item.slug,
              })),
          );
        }
      } catch {
        // Related links are optional. The fallback still has search and contact.
      }
    }

    async function generate() {
      const started = Date.now();
      trackGenerationRequested(slug, "compare_page", 0);
      const deadline = started + 70000;

      while (!cancelled && Date.now() < deadline) {
        let response: Response;
        try {
          response = await fetch("/api/comparisons/generate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-generation-client": "browser",
            },
            body: JSON.stringify({ slug }),
          });
        } catch {
          break;
        }
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;

        if (response.status === 202) {
          await new Promise((resolve) => setTimeout(resolve, 4000));
          continue;
        }

        if (response.ok && data?.status === "ready") {
          const canonical = typeof data.canonicalSlug === "string" ? data.canonicalSlug : slug;
          const reloads = Number(sessionStorage.getItem(reloadKey) || "0");
          if (reloads >= 2) {
            setPhase("saved");
            return;
          }
          sessionStorage.setItem(reloadKey, String(reloads + 1));
          window.location.assign(`/compare/${canonical}`);
          return;
        }

        break;
      }

      if (!cancelled) {
        setPhase("fallback");
        void loadRelated();
      }
    }

    void generate();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const active = stepIndex(elapsed);

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <Head>
        <title>{title} | A Versus B</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <p className="text-sm font-bold uppercase tracking-wide text-primary-600 mb-2">Comparison</p>
      <h1 className="text-3xl font-display font-bold text-text mb-3">{title}</h1>

      {phase === "building" && (
        <>
          <p className="text-text-secondary mb-6">
            This usually takes 20–40 seconds. The finished page stays at this address for everyone.
          </p>
          <ol className="text-left max-w-sm mx-auto space-y-3 mb-6" aria-live="polite">
            {STEPS.map((step, index) => {
              const state = index < active ? "done" : index === active ? "current" : "waiting";
              return (
                <li key={step.id} className="flex items-center gap-3 text-sm">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      state === "waiting"
                        ? "bg-surface-alt text-text-secondary"
                        : "bg-primary-600 text-white"
                    }`}
                    aria-hidden="true"
                  >
                    {state === "done" ? "✓" : index + 1}
                  </span>
                  <span className={state === "current" ? "font-semibold text-text" : "text-text-secondary"}>
                    {step.label}
                    {state === "current" ? "…" : ""}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mx-auto h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-surface-alt" aria-hidden="true">
            <div
              className="h-full bg-primary-600 transition-all duration-500"
              style={{ width: `${Math.min(95, 15 + elapsed / 400)}%` }}
            />
          </div>
        </>
      )}

      {phase === "saved" && (
        <div className="space-y-4">
          <p className="text-text-secondary">
            We saved {entityA} vs {entityB}. It can take a minute to appear at this address.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
          >
            Refresh this page
          </button>
        </div>
      )}

      {phase === "fallback" && (
        <Fallback entityA={entityA} entityB={entityB} slug={slug} related={related} />
      )}
    </div>
  );
}

function Fallback({
  entityA,
  entityB,
  slug,
  related,
}: {
  entityA: string;
  entityB: string;
  slug: string;
  related: Related[];
}) {
  return (
    <div className="space-y-6">
      <p className="text-text-secondary">
        We couldn&apos;t finish {entityA} vs {entityB} just now. You can search for a similar comparison, or ask us to look at this one.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href="/search"
          className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700"
        >
          Search comparisons
        </Link>
        <Link
          href={`/contact?subject=${encodeURIComponent(`Comparison request: ${slug}`)}`}
          className="inline-flex items-center rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-text hover:bg-surface-alt"
        >
          Request this comparison
        </Link>
      </div>
      {related.length > 0 && (
        <div className="text-left">
          <p className="text-sm font-semibold text-text mb-2">Related comparisons</p>
          <ul className="space-y-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link href={`/compare/${item.slug}`} className="text-sm text-primary-700 hover:underline">
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
