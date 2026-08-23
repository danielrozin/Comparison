import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { BEST_CONFIG } from "@/lib/data/best-entries";
import { getPrisma } from "@/lib/db/prisma";

// DB-published best pages appear alongside the static config; refresh hourly.
export const revalidate = 3600;

const PAGE_TITLE = `Best-Of Lists — Ranked & Compared | ${SITE_NAME}`;
const PAGE_DESC = `Every best-of list on ${SITE_NAME}: top tools, platforms and products ranked with the reasoning shown — cloud platforms, CRMs, AI assistants and more.`;
const PAGE_URL = `${SITE_URL}/best`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

interface BestListing {
  slug: string;
  h1: string;
  description: string;
  updatedAt: string;
  itemCount: number;
}

async function getListings(): Promise<BestListing[]> {
  const listings = new Map<string, BestListing>();
  for (const entry of Object.values(BEST_CONFIG)) {
    listings.set(entry.slug, {
      slug: entry.slug,
      h1: entry.h1,
      description: entry.description,
      updatedAt: entry.updatedAt,
      itemCount: entry.listItems.length,
    });
  }
  try {
    const prisma = getPrisma();
    if (prisma) {
      const dbPages = await prisma.bestPage.findMany({
        where: { status: "published" },
        select: { slug: true, title: true, description: true, updatedAt: true },
      });
      for (const p of dbPages) {
        if (!listings.has(p.slug)) {
          listings.set(p.slug, {
            slug: p.slug,
            h1: p.title,
            description: p.description ?? "",
            updatedAt: p.updatedAt.toISOString().slice(0, 10),
            itemCount: 0,
          });
        }
      }
    }
  } catch {
    // static config alone is a complete page
  }
  return [...listings.values()].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export default async function BestIndexPage() {
  const listings = await getListings();

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
        { name: "Best Lists", url: PAGE_URL },
      ],
      `${PAGE_URL}#breadcrumbs`
    ),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: listings.length,
      itemListElement: listings.map((l, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: l.h1,
        url: `${SITE_URL}/best/${l.slug}`,
      })),
    },
  };

  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Ranked"
        title="Best-Of Lists"
        lede="Not just a winner — a ranked field with the reasoning shown, pricing verified against vendor rate sheets, and a clear pick for each use case."
        breadcrumbLabel="Best Lists"
      >
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-5 list-none">
          {listings.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/best/${l.slug}`}
                className="flex flex-col h-full bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <h2 className="font-display font-bold text-text text-lg leading-snug mb-2">{l.h1}</h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-3">{l.description}</p>
                <p className="mt-auto text-xs text-text-secondary font-medium">
                  {l.itemCount > 0 ? `${l.itemCount} ranked · ` : ""}Updated {l.updatedAt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </HubShell>
    </>
  );
}
