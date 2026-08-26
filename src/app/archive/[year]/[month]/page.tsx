import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import {
  getArchiveMonthItems,
  itemHref,
  MONTH_NAMES,
} from "@/lib/services/archive-service";

export const revalidate = 3600;

interface Props {
  params: Promise<{ year: string; month: string }>;
}

function parseParams(rawYear: string, rawMonth: string): { year: number; month: number } | null {
  if (!/^20\d{2}$/.test(rawYear) || !/^(0[1-9]|1[0-2])$/.test(rawMonth)) return null;
  return { year: Number(rawYear), month: Number(rawMonth) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year: ry, month: rm } = await params;
  const parsed = parseParams(ry, rm);
  if (!parsed) return {};
  const monthName = MONTH_NAMES[parsed.month - 1];
  const url = `${SITE_URL}/archive/${parsed.year}/${rm}`;
  const title = `${monthName} ${parsed.year} Archive — ${SITE_NAME}`;
  const description = `Every comparison and article ${SITE_NAME} published in ${monthName} ${parsed.year}, day by day.`;
  return {
    title,
    description,
    alternates: { canonical: url, languages: { en: url, "x-default": url } },
    openGraph: { title, description, url, type: "website", locale: "en_US", siteName: SITE_NAME },
    twitter: { card: "summary_large_image", title, description },
  };
}

const dayLabel = (iso: string) => {
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
};

export default async function ArchiveMonthPage({ params }: Props) {
  const { year: ry, month: rm } = await params;
  const parsed = parseParams(ry, rm);
  if (!parsed) notFound();
  const { year, month } = parsed;

  const byDay = await getArchiveMonthItems(year, month);
  if (byDay.size === 0) notFound();

  const monthName = MONTH_NAMES[month - 1];
  const url = `${SITE_URL}/archive/${year}/${rm}`;
  const total = [...byDay.values()].reduce((n, list) => n + list.length, 0);

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#collectionpage`,
    name: `${monthName} ${year} Archive — ${SITE_NAME}`,
    url,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(
      [
        { name: "Home", url: SITE_URL },
        { name: "Archive", url: `${SITE_URL}/archive` },
        { name: String(year), url: `${SITE_URL}/archive/${year}` },
        { name: monthName, url },
      ],
      `${url}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: total,
      // cap the JSON-LD list; the on-page links carry the full set
      itemListElement: [...byDay.values()].flat().slice(0, 50).map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.title,
        url: `${SITE_URL}${itemHref(it)}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Archive"
        title={`${monthName} ${year}`}
        lede={`${total.toLocaleString("en-US")} comparisons and articles published this month, day by day.`}
        breadcrumbLabel={`${monthName} ${year}`}
      >
        <p className="mb-8 text-sm">
          <Link href={`/archive/${year}`} className="text-primary-600 font-medium hover:underline">
            ← {year}
          </Link>
          <span className="text-text-secondary mx-2" aria-hidden="true">·</span>
          <Link href="/archive" className="text-primary-600 font-medium hover:underline">
            All years
          </Link>
        </p>

        <div className="space-y-10">
          {[...byDay.entries()].map(([day, items]) => (
            <section key={day} aria-labelledby={`day-${day}`}>
              <h2
                id={`day-${day}`}
                className="text-base font-display font-bold text-text mb-3 pb-2 border-b border-border"
              >
                {dayLabel(day)}
                <span className="ml-2 text-xs font-normal text-text-secondary tabular-nums">
                  {items.length}
                </span>
              </h2>
              <ul role="list" className="columns-1 sm:columns-2 gap-8 list-none">
                {items.map((it) => (
                  <li key={`${it.type}-${it.slug}`} className="break-inside-avoid">
                    <Link
                      href={itemHref(it)}
                      className="group inline-flex items-baseline gap-2 py-1 text-sm text-text-secondary hover:text-primary-600 transition-colors"
                    >
                      <span className="group-hover:underline">{it.title}</span>
                      <span className="shrink-0 rounded bg-surface-alt border border-border px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                        {it.type === "comparison" ? "vs" : "blog"}
                      </span>
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
