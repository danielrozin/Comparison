import type { Metadata } from "next";
import { CATEGORIES, SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import {
  groupEditorialComparesByCategory,
  latestEditorialCompares,
  listEditorialCompareCards,
  type EditorialCompareCard,
} from "@/lib/data/editorial-compares/listing";

/**
 * ROO-453 — /compare hub.
 *
 * Breadcrumbs on every compare page point at /compare, but it used to 404,
 * and 10 of 18 new answer pages had no inbound link at all (ROO-406
 * indexability check). This server-rendered hub lists every in-repo
 * editorial compare with a plain <a href>, grouped by category, so crawlers
 * reach each one in one hop from the footer.
 */

export const revalidate = 3600;

const PAGE_URL = `${SITE_URL}/compare`;
const PAGE_TITLE = `All Comparisons — In-Depth A vs B Analysis | ${SITE_NAME}`;
const PAGE_DESC = `Every in-depth comparison on ${SITE_NAME}, grouped by category: GPUs, CPUs, monitors, phones, software, finance and more. Each page has sourced specs, a choose-if verdict and an FAQ.`;
const LATEST_COUNT = 12;
const CATEGORY_SLUGS = new Set<string>(CATEGORIES.map((c) => c.slug));

function countLabel(n: number): string {
  return `${n} ${n === 1 ? "comparison" : "comparisons"}`;
}

export const metadata: Metadata = {
  // ROO-241: title already carries the brand; skip the layout template.
  title: { absolute: PAGE_TITLE },
  description: PAGE_DESC,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1, "max-image-preview": "large" as const, "max-video-preview": -1 },
  },
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

/** Drop anything the live-slug gate would not link (redirect sources etc.). */
async function liveCards(): Promise<EditorialCompareCard[]> {
  const cards = listEditorialCompareCards();
  try {
    const live = new Set(await filterLiveCompareSlugs(cards.map((c) => c.slug)));
    return cards.filter((c) => live.has(c.slug));
  } catch {
    return cards;
  }
}

function formatDate(iso: string): string | null {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return null;
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

const linkClass =
  "block rounded-xl border border-border bg-surface-alt px-4 py-3 text-sm font-semibold text-text hover:border-primary-300 hover:text-primary-700 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

export default async function CompareHubPage() {
  const cards = await liveCards();
  const liveSlugs = new Set(cards.map((c) => c.slug));
  const groups = groupEditorialComparesByCategory(cards);
  const latest = latestEditorialCompares(LATEST_COUNT * 2).filter((c) => liveSlugs.has(c.slug)).slice(0, LATEST_COUNT);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${PAGE_URL}#collectionpage`,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(
      [
        { name: "Home", url: SITE_URL },
        { name: "Compare", url: PAGE_URL },
      ],
      `${PAGE_URL}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: cards.length,
      itemListElement: latest.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: c.title,
        url: `${SITE_URL}/compare/${c.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Compare"
        title="All in-depth comparisons"
        lede={`${cards.length.toLocaleString("en-US")} researched A vs B pages, grouped by category. Newest first below, then every page by topic.`}
        breadcrumbLabel="Compare"
      >
        <div className="space-y-12">
          {latest.length > 0 && (
            <section aria-labelledby="compare-latest">
              <h2 id="compare-latest" className="text-2xl font-display font-bold text-text mb-4 pb-2 border-b border-border">
                Latest comparisons
              </h2>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none">
                {latest.map((c) => {
                  const date = formatDate(c.publishedAt);
                  return (
                    <li key={c.slug}>
                      <a href={`/compare/${c.slug}`} className={linkClass}>
                        <span className="block">{c.title}</span>
                        {date && (
                          <time dateTime={c.publishedAt} className="block mt-1 text-xs font-normal text-text-secondary">
                            {date}
                          </time>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}

          {groups.map((group) => (
            <section key={group.category} aria-labelledby={`compare-cat-${group.category}`}>
              <div className="flex items-baseline justify-between gap-4 mb-4 pb-2 border-b border-border">
                <h2 id={`compare-cat-${group.category}`} className="text-2xl font-display font-bold text-text">
                  {group.label}
                </h2>
                {CATEGORY_SLUGS.has(group.category) ? (
                  <a
                    href={`/category/${group.category}`}
                    className="text-xs text-text-secondary font-medium shrink-0 hover:text-primary-600"
                  >
                    {countLabel(group.items.length)} · more in {group.label}
                  </a>
                ) : (
                  <span className="text-xs text-text-secondary font-medium shrink-0">{countLabel(group.items.length)}</span>
                )}
              </div>
              <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 list-none">
                {group.items.map((c) => (
                  <li key={c.slug}>
                    <a href={`/compare/${c.slug}`} className={linkClass}>
                      {c.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </HubShell>
    </>
  );
}
