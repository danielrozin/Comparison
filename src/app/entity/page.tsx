import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, CATEGORIES } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { ENTITY_CONTENT } from "@/lib/data/entity-content";
import { humanizeEntityName } from "@/lib/utils/humanize";

export const revalidate = 3600;

const PAGE_TITLE = `Entity Profiles — Everything We Compare | ${SITE_NAME}`;
const PAGE_DESC = `Browse the people, products, companies and countries compared on ${SITE_NAME}. Each profile links every head-to-head that entity appears in.`;
const PAGE_URL = `${SITE_URL}/entity`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

/**
 * The full entity corpus lives in the DB (3,000+), far too many to list on one
 * page. This hub shows the ~500 curated profiles that have hand-written
 * content, grouped by category — the ones worth a reader's click — and leaves
 * exhaustive discovery to search and the sitemap.
 */
function getCurated(): Map<string, { slug: string; name: string }[]> {
  const byCategory = new Map<string, { slug: string; name: string }[]>();
  for (const [slug, content] of Object.entries(ENTITY_CONTENT)) {
    const cat = content.category || "other";
    if (!byCategory.has(cat)) byCategory.set(cat, []);
    byCategory.get(cat)!.push({ slug, name: humanizeEntityName(slug) });
  }
  for (const list of byCategory.values()) list.sort((a, b) => a.name.localeCompare(b.name));
  return byCategory;
}

const CATEGORY_NAMES: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c.name])
);

export default function EntityIndexPage() {
  const byCategory = getCurated();
  // biggest sections first so the page leads with its depth
  const sections = [...byCategory.entries()].sort((a, b) => b[1].length - a[1].length);
  const total = sections.reduce((n, [, list]) => n + list.length, 0);

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
        { name: "Entity Profiles", url: PAGE_URL },
      ],
      `${PAGE_URL}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      // cap the JSON-LD list — 500 ListItems bloats every response for no
      // ranking benefit; the on-page links carry the full set
      itemListElement: sections.slice(0, 4).flatMap(([, list], si) =>
        list.slice(0, 10).map((e, i) => ({
          "@type": "ListItem",
          position: si * 10 + i + 1,
          name: e.name,
          url: `${SITE_URL}/entity/${e.slug}`,
        }))
      ),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Browse"
        title="Entity Profiles"
        lede={`${total} curated profiles of the products, companies, people and countries we compare — each one linking every head-to-head it appears in.`}
        breadcrumbLabel="Entity Profiles"
      >
        <div className="space-y-12">
          {sections.map(([cat, list]) => (
            <section key={cat} aria-labelledby={`entity-cat-${cat}`}>
              <div className="flex items-baseline justify-between gap-4 mb-4 pb-2 border-b border-border">
                <h2 id={`entity-cat-${cat}`} className="text-xl font-display font-bold text-text">
                  {CATEGORY_NAMES[cat] ?? cat.charAt(0).toUpperCase() + cat.slice(1)}
                </h2>
                <span className="text-xs text-text-secondary font-medium shrink-0">{list.length} profiles</span>
              </div>
              <ul role="list" className="columns-2 sm:columns-3 lg:columns-4 gap-4 list-none">
                {list.map((e) => (
                  <li key={e.slug} className="break-inside-avoid">
                    <Link
                      href={`/entity/${e.slug}`}
                      className="inline-block py-1 text-sm text-text-secondary hover:text-primary-600 hover:underline transition-colors"
                    >
                      {e.name}
                    </Link>
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
