import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { getArchiveMonths, MONTH_NAMES } from "@/lib/services/archive-service";

export const revalidate = 3600;

interface Props {
  params: Promise<{ year: string }>;
}

function parseYear(raw: string): number | null {
  if (!/^20\d{2}$/.test(raw)) return null;
  return Number(raw);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: rawYear } = await params;
  const year = parseYear(rawYear);
  if (!year) return {};
  const url = `${SITE_URL}/archive/${year}`;
  const title = `${year} Archive — ${SITE_NAME}`;
  const description = `Every comparison and article ${SITE_NAME} published in ${year}, month by month.`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    openGraph: { title, description, url, type: "website", locale: "en_US", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ArchiveYearPage({ params }: Props) {
  const { year: rawYear } = await params;
  const year = parseYear(rawYear);
  if (!year) notFound();

  const months = (await getArchiveMonths()).filter((m) => m.year === year);
  if (months.length === 0) notFound();
  const total = months.reduce((n, m) => n + m.count, 0);
  const url = `${SITE_URL}/archive/${year}`;

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collectionpage`,
    name: `${year} Archive — ${SITE_NAME}`,
    url,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(
      [
        { name: "Home", url: SITE_URL },
        { name: "Archive", url: `${SITE_URL}/archive` },
        { name: String(year), url },
      ],
      `${url}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: months.length,
      itemListElement: months.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${MONTH_NAMES[m.month - 1]} ${year}`,
        url: `${url}/${String(m.month).padStart(2, "0")}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Archive"
        title={`Published in ${year}`}
        lede={`${total.toLocaleString("en-US")} comparisons and articles, month by month.`}
        breadcrumbLabel={String(year)}
      >
        <p className="mb-8 text-sm">
          <Link href="/archive" className="text-primary-600 font-medium hover:underline">
            ← All years
          </Link>
        </p>
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 list-none">
          {months.map((m) => (
            <li key={m.month}>
              <Link
                href={`/archive/${year}/${String(m.month).padStart(2, "0")}`}
                className="flex items-baseline justify-between gap-2 rounded-xl border border-border bg-surface-alt px-4 py-4 hover:border-primary-300 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span className="text-sm font-semibold text-text">{MONTH_NAMES[m.month - 1]}</span>
                <span className="text-xs text-text-secondary tabular-nums">{m.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      </HubShell>
    </>
  );
}
