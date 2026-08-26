import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getArchiveMonths, MONTH_NAMES } from "@/lib/services/archive-service";

export const revalidate = 3600;

const PAGE_TITLE = `Archive — Everything We've Published | ${SITE_NAME}`;
const PAGE_DESC = `Every comparison and article on ${SITE_NAME}, organized by publication date. Browse by year and month — nothing we've published is more than four clicks away.`;
const PAGE_URL = `${SITE_URL}/archive`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

export default async function ArchiveRootPage() {
  const months = await getArchiveMonths();
  const total = months.reduce((n, m) => n + m.count, 0);

  // group months under their year, newest year first
  const byYear = new Map<number, typeof months>();
  for (const m of months) {
    if (!byYear.has(m.year)) byYear.set(m.year, []);
    byYear.get(m.year)!.push(m);
  }

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
        { name: "Archive", url: PAGE_URL },
      ],
      `${PAGE_URL}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: [...byYear.keys()].length,
      itemListElement: [...byYear.keys()].map((year, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${year} archive`,
        url: `${PAGE_URL}/${year}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Archive"
        title="Everything, by date"
        lede={`All ${total.toLocaleString("en-US")} comparisons and articles we've published, grouped by month. New content files itself here automatically — nothing is ever orphaned.`}
        breadcrumbLabel="Archive"
      >
        <div className="space-y-12">
          {[...byYear.entries()].map(([year, yearMonths]) => (
            <section key={year} aria-labelledby={`archive-${year}`}>
              <div className="flex items-baseline justify-between gap-4 mb-4 pb-2 border-b border-border">
                <h2 id={`archive-${year}`} className="text-2xl font-display font-bold text-text">
                  <Link href={`/archive/${year}`} className="hover:text-primary-600 transition-colors">
                    {year}
                  </Link>
                </h2>
                <span className="text-xs text-text-secondary font-medium shrink-0">
                  {yearMonths.reduce((n, m) => n + m.count, 0).toLocaleString("en-US")} published
                </span>
              </div>
              <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none">
                {yearMonths.map((m) => (
                  <li key={`${m.year}-${m.month}`}>
                    <Link
                      href={`/archive/${m.year}/${String(m.month).padStart(2, "0")}`}
                      className="flex items-baseline justify-between gap-2 rounded-xl border border-border bg-surface-alt px-4 py-3 hover:border-primary-300 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                    >
                      <span className="text-sm font-semibold text-text">{MONTH_NAMES[m.month - 1]}</span>
                      <span className="text-xs text-text-secondary font-variant-numeric tabular-nums">{m.count}</span>
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
