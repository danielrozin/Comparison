import Link from "next/link";
import { cache } from "react";
import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { resolveCanonicalComparisonSlugs } from "@/lib/services/comparison-service";

/**
 * DAN-2565 — a /compare link that refuses to point at a dead page.
 *
 * The eleven hand-written /alternatives/{saas} routes (slack, notion, figma, …)
 * hardcode their `/compare/*` link targets in editorial prose. DAN-2551 fixed the
 * two *generated* link paths on /alternatives/[slug] but never touched these, so
 * they kept shipping the exact defect that ticket closed: on 2026-07-20, 33 of the
 * 53 unique hardcoded slugs were hard 404s and 9 more were 301 sources.
 *
 * Hardcoding the surviving slugs instead would rot again — the canonical catalog
 * shrinks on every consolidation batch, which is what broke these pages in the
 * first place. So resolve at render:
 *
 *   1. Fold a retired slug into its survivor (same map the edge 301s use), so a
 *      link that would have bounced through a redirect points straight at the target.
 *   2. Drop the anchor entirely when the target is not canonical — the prose still
 *      reads correctly, we just stop handing crawlers a 404.
 */
const resolveOne = cache(async (slug: string): Promise<boolean> => {
  const live = await resolveCanonicalComparisonSlugs([slug]);
  return live.has(slug);
});

export async function CompareLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const slug = href.replace(/^\/compare\//, "").replace(/\/$/, "");
  const canonical = getConsolidatedCompareSlug(slug) ?? slug;

  if (!(await resolveOne(canonical))) {
    // Keep the label as plain text — no link styling, so it does not read as a
    // broken affordance.
    return <span>{children}</span>;
  }

  return (
    <Link href={`/compare/${canonical}`} className={className}>
      {children}
    </Link>
  );
}
