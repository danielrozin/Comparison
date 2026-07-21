import { getConsolidatedCompareSlug } from "@/lib/redirects/compare-redirects";
import { resolveCanonicalComparisonSlugs } from "@/lib/services/comparison-service";
import { getBlogBySlug } from "@/lib/services/blog-generator";

/**
 * DAN-2581 — the markdown-body counterpart to `<CompareLink>`.
 *
 * `/compare/[slug]` renders only `status = "published"` (the DAN-2065 gate) and the
 * canonical catalog *shrinks* on every consolidation batch. Anything that stores a
 * `/compare/*` target instead of resolving one at render time therefore rots on its
 * own — DAN-2551 hit it on the generated `/alternatives` links, DAN-2565 hit it on
 * the hand-written `/alternatives` prose, and a full-site crawl on 2026-07-21 found
 * the same defect in the markdown bodies: 764 dead links across 379 of 476 `/blog`
 * pages, plus 69 more across `/best`.
 *
 * `<CompareLink>` cannot help here because these bodies are HTML strings injected
 * through `dangerouslySetInnerHTML`, never React children. So apply the identical
 * two rules to the serialized anchors:
 *
 *   1. Fold a retired slug into its survivor (the same map the edge 301s use), so a
 *      link that would have bounced through a redirect points straight at the target.
 *   2. Unwrap the anchor when the target is not canonical — the prose still reads
 *      correctly, we just stop handing crawlers a 404.
 *
 * One batched catalog query per page, regardless of how many links the body carries.
 */

/** Matches a whole `<a …href="/compare/…"…>label</a>`, capturing the slug and label. */
const COMPARE_ANCHOR =
  /<a\b([^>]*?)href="\/compare\/([^"#?]+?)\/?"([^>]*)>([\s\S]*?)<\/a>/gi;

function toCanonicalSlug(slug: string): string {
  return getConsolidatedCompareSlug(slug) ?? slug;
}

/**
 * Rewrite every `/compare/*` anchor in a rendered HTML body so none of them points
 * at a 404 or a redirect source. Returns the body unchanged when it has no such link.
 */
export async function resolveCompareLinksInHtml(html: string): Promise<string> {
  const matches = Array.from(html.matchAll(COMPARE_ANCHOR));
  if (matches.length === 0) return html;

  const canonicalBySource = new Map<string, string>();
  for (const m of matches) {
    const raw = m[2];
    canonicalBySource.set(raw, toCanonicalSlug(raw));
  }

  const live = await resolveCanonicalComparisonSlugs(
    Array.from(new Set(canonicalBySource.values()))
  );

  return html.replace(
    COMPARE_ANCHOR,
    (_full, before: string, raw: string, after: string, label: string) => {
      const canonical = canonicalBySource.get(raw) ?? toCanonicalSlug(raw);
      if (!live.has(canonical)) {
        // Plain text, not a styled-but-inert anchor: it must not read as a broken
        // affordance to a reader or as a link to a crawler.
        return label;
      }
      return `<a${before}href="/compare/${canonical}"${after}>${label}</a>`;
    }
  );
}

/**
 * The list-shaped counterpart: given curated `/compare` slugs, return only the ones
 * that resolve to a live canonical page, already folded onto their survivor slug.
 * Order is preserved and duplicates introduced by folding are dropped.
 *
 * Use this for curated link arrays (`/hub` spokes, `/guides`, `/tools`, `/entity`)
 * where the fix is to *omit* the item rather than to unlink prose.
 */
export async function filterLiveCompareSlugs(slugs: string[]): Promise<string[]> {
  if (slugs.length === 0) return [];

  const canonical = slugs.map(toCanonicalSlug);
  const live = await resolveCanonicalComparisonSlugs(canonical);

  const seen = new Set<string>();
  const kept: string[] = [];
  for (const slug of canonical) {
    if (!live.has(slug) || seen.has(slug)) continue;
    seen.add(slug);
    kept.push(slug);
  }
  return kept;
}

/**
 * Curated `{ href, label }` nav lists (`/tools`, `/guides`) mix `/compare` and `/blog`
 * targets, and the 2026-07-21 crawl found both kinds dead. Drop the dead ones and fold
 * surviving `/compare` hrefs onto their canonical slug; hrefs of any other shape pass
 * through untouched, since nothing else on this site is generated-and-retired.
 */
export async function filterLiveInternalLinks<T extends { href: string }>(
  links: T[]
): Promise<T[]> {
  const compareSlugs = links
    .filter((l) => l.href.startsWith("/compare/"))
    .map((l) => toCanonicalSlug(l.href.replace(/^\/compare\//, "").replace(/\/$/, "")));
  const blogSlugs = links
    .filter((l) => l.href.startsWith("/blog/"))
    .map((l) => l.href.replace(/^\/blog\//, "").replace(/\/$/, ""));

  const [liveCompare, liveBlogEntries] = await Promise.all([
    compareSlugs.length
      ? resolveCanonicalComparisonSlugs(compareSlugs)
      : Promise.resolve(new Set<string>()),
    Promise.all(
      Array.from(new Set(blogSlugs)).map(
        async (slug) => [slug, (await getBlogBySlug(slug).catch(() => null)) !== null] as const
      )
    ),
  ]);
  const liveBlog = new Set(liveBlogEntries.filter(([, ok]) => ok).map(([slug]) => slug));

  return links.flatMap((link) => {
    if (link.href.startsWith("/compare/")) {
      const canonical = toCanonicalSlug(
        link.href.replace(/^\/compare\//, "").replace(/\/$/, "")
      );
      return liveCompare.has(canonical) ? [{ ...link, href: `/compare/${canonical}` }] : [];
    }
    if (link.href.startsWith("/blog/")) {
      const slug = link.href.replace(/^\/blog\//, "").replace(/\/$/, "");
      return liveBlog.has(slug) ? [link] : [];
    }
    return [link];
  });
}
