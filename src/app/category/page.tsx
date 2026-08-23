import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL, CATEGORIES } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { CategoryIcon } from "@/lib/utils/category-icons";

const PAGE_TITLE = `Comparison Categories — Browse Every Topic | ${SITE_NAME}`;
const PAGE_DESC = `All ${CATEGORIES.length} comparison categories on ${SITE_NAME} — technology, sports, countries, products, software, health, finance and more.`;
const PAGE_URL = `${SITE_URL}/category`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

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
      { name: "Categories", url: PAGE_URL },
    ],
    `${PAGE_URL}#breadcrumbs`
  ),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: CATEGORIES.length,
    itemListElement: CATEGORIES.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      url: `${SITE_URL}/category/${c.slug}`,
    })),
  },
};

export default function CategoryIndexPage() {
  return (
    <>
      <JsonLd data={collectionSchema} />
      <HubShell
        eyebrow="Browse"
        title="Every Comparison Category"
        lede="Pick a topic and see every head-to-head we cover in it — from smartphones and software to countries, athletes and economies."
        breadcrumbLabel="Categories"
      >
        <ul role="list" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 list-none">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/category/${c.slug}`}
                className="flex flex-col items-center gap-3 bg-surface-alt border border-border rounded-2xl p-6 text-center hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <span className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
                  <CategoryIcon category={c.slug} className="w-6 h-6 text-primary-600" />
                </span>
                <span className="font-semibold text-text">{c.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </HubShell>
    </>
  );
}
