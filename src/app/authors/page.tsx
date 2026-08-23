import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { FOUNDERS, founderPersonSchema } from "@/lib/data/founders";

const PAGE_TITLE = `Authors — Who Writes ${SITE_NAME}`;
const PAGE_DESC = `The people behind every comparison and verdict on ${SITE_NAME}: Daniel Rozin and Shai Goldenberg, the founders who write, edit and build the platform.`;
const PAGE_URL = `${SITE_URL}/authors`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "profile", locale: "en_US", siteName: SITE_NAME },
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
      { name: "Authors", url: PAGE_URL },
    ],
    `${PAGE_URL}#breadcrumbs`
  ),
  mainEntity: {
    "@type": "ItemList",
    numberOfItems: FOUNDERS.length,
    itemListElement: FOUNDERS.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: { "@id": f.personId },
    })),
  },
};

export default function AuthorsIndexPage() {
  return (
    <>
      <JsonLd data={[collectionSchema, ...FOUNDERS.map(founderPersonSchema)]} />
      <HubShell
        eyebrow="Editorial"
        title="Who Writes A Versus B"
        lede="Every comparison on this site traces back to two named, reachable people — no anonymous content farm, no outsourced bylines."
        breadcrumbLabel="Authors"
      >
        <ul role="list" className="grid grid-cols-1 sm:grid-cols-2 gap-6 list-none">
          {FOUNDERS.map((f) => {
            const href = f.authorPage ?? `/about#${f.id}`;
            return (
              <li key={f.id}>
                <Link
                  href={href}
                  className="flex flex-col h-full bg-surface-alt border border-border rounded-2xl p-6 hover:border-primary-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Image
                      src={f.image}
                      alt={f.imageAlt}
                      width={640}
                      height={640}
                      sizes="80px"
                      className="w-20 h-20 rounded-full object-cover ring-2 ring-white shadow-sm shrink-0"
                    />
                    <div>
                      <p className="font-display font-bold text-text text-lg leading-tight">{f.name}</p>
                      <p className="text-sm text-primary-600 font-semibold">{f.jobTitle}</p>
                      <p className="text-xs text-text-secondary mt-0.5">{f.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed mb-4">{f.bio}</p>
                  <p className="mt-auto text-sm text-primary-600 font-medium">
                    {f.authorPage ? "View author page →" : "Read their story →"}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>

        <p className="mt-10 text-sm text-text-secondary leading-relaxed max-w-2xl">
          How verdicts get written, sourced and corrected is documented in{" "}
          <Link href="/how-we-write-verdicts" className="text-primary-600 font-medium hover:underline">
            our methodology
          </Link>
          . The story of why the site exists is on{" "}
          <Link href="/about" className="text-primary-600 font-medium hover:underline">
            Our Story
          </Link>
          .
        </p>
      </HubShell>
    </>
  );
}
