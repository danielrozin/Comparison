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

/** `/compare/a-vs-b` (or a bare slug) -> the survivor slug the redirect map folds it into. */
function toCanonicalSlug(href: string): string {
  const slug = href.replace(/^\/compare\//, "").replace(/\/$/, "");
  return getConsolidatedCompareSlug(slug) ?? slug;
}

/**
 * DAN-2567 — hide a "Related comparisons" section that resolves to zero live links.
 *
 * Fallout from DAN-2565: once dead targets stop rendering as anchors, a section whose
 * items are *all* dead degrades into a heading promising comparisons above a list of
 * unlinked plain text. Wrap those sections in this component so they disappear cleanly
 * instead.
 *
 * Only for sections whose items are exclusively `<CompareLink>` — a section that also
 * carries an `/alternatives` link can never resolve to zero and must not be wrapped.
 *
 * `hrefs` must list every `<CompareLink href>` inside `children`; keep the two adjacent.
 */
export async function RelatedComparisons({
  hrefs,
  children,
}: {
  hrefs: string[];
  children: React.ReactNode;
}) {
  const slugs = hrefs.map(toCanonicalSlug);
  const live = await resolveCanonicalComparisonSlugs(slugs);

  if (!slugs.some((slug) => live.has(slug))) return null;

  return <>{children}</>;
}

export async function CompareLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const canonical = toCanonicalSlug(href);

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
