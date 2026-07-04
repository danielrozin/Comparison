import { NextRequest, NextResponse } from "next/server";
import { getPrisma } from "@/lib/db/prisma";
import { BEST_CONFIG } from "@/lib/data/best-entries";
import { SITE_URL, SITE_NAME } from "@/lib/utils/constants";

// GET /api/v1/best/{slug}
//
// Returns a best-of list as structured JSON with ItemList JSON-LD.
// Designed for AI tools doing "best X" intent routing — each ranked item
// includes its position, name, anchor, and a direct comparison URL if available.
//
// Source priority: DB (BestPage) > static BEST_CONFIG fallback.
// Includes ItemList JSON-LD for Google Rich Results + AI ranking citations.

export const dynamic = "force-dynamic";

const HEADERS = {
  "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "X-Robots-Tag": "all",
  "Content-Type": "application/json",
  "Vary": "Accept",
  "X-Source": SITE_NAME,
  "X-License": "CC BY 4.0",
  "X-License-URL": "https://creativecommons.org/licenses/by/4.0/",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: HEADERS });
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const url = `${SITE_URL}/best/${slug}`;
  const apiUrl = `${SITE_URL}/api/v1/best/${slug}`;

  type ListItem = { position: number; name: string; anchor: string };
  type FAQ = { q: string; a: string };

  // Try DB first, fall back to static config
  let title: string | undefined;
  let h1: string | undefined;
  let description: string | undefined;
  let category: string | null | undefined;
  let authorName: string | undefined;
  let publishedAt: Date | string | null | undefined;
  let updatedAt: Date | string | null | undefined;
  let listItems: ListItem[] = [];
  let faqs: FAQ[] = [];

  const prisma = getPrisma();
  if (prisma) {
    const row = await prisma.bestPage.findUnique({
      where: { slug, status: "published" },
      select: {
        title: true,
        h1: true,
        description: true,
        category: true,
        authorName: true,
        publishedAt: true,
        updatedAt: true,
        listItems: true,
        faqs: true,
      },
    });

    if (row) {
      title = row.title;
      h1 = row.h1;
      description = row.description;
      category = row.category;
      authorName = row.authorName;
      publishedAt = row.publishedAt;
      updatedAt = row.updatedAt;
      listItems = (row.listItems as unknown as ListItem[]) ?? [];
      faqs = (row.faqs as unknown as FAQ[]) ?? [];
    }
  }

  // Static fallback
  if (!title) {
    const staticEntry = BEST_CONFIG[slug];
    if (!staticEntry) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: HEADERS });
    }
    title = staticEntry.title;
    h1 = staticEntry.h1;
    description = staticEntry.description;
    category = staticEntry.category ?? null;
    authorName = staticEntry.authorName;
    publishedAt = staticEntry.publishedAt;
    updatedAt = staticEntry.updatedAt;
    listItems = staticEntry.listItems ?? [];
    faqs = staticEntry.faqs ?? [];
  }

  const etag = updatedAt
    ? `"best-${slug}-${new Date(updatedAt).getTime()}"`
    : `"best-${slug}"`;

  const ifNoneMatch = request.headers.get("if-none-match");
  if (ifNoneMatch === etag) {
    return new Response(null, { status: 304, headers: { ETag: etag } });
  }

  // Build ItemList JSON-LD for Rich Results + AI citation
  // ListItem uses item: { WebPage } per spec (bare url on ListItem is non-standard)
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${url}#itemlist`,
    name: h1 ?? title,
    description,
    url,
    inLanguage: "en-US",
    numberOfItems: listItems.length,
    itemListElement: listItems.map((item) => {
      const itemUrl = `${url}#${item.anchor}`;
      return {
        "@type": "ListItem",
        position: item.position,
        name: item.name,
        item: { "@type": "WebPage", "@id": itemUrl, name: item.name, url: itemUrl },
      };
    }),
    author: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: SITE_NAME, url: SITE_URL },
    datePublished: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    dateCreated: publishedAt ? new Date(publishedAt).toISOString() : undefined,
    dateModified: updatedAt ? new Date(updatedAt).toISOString() : undefined,
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return NextResponse.json(
    {
      slug,
      title: h1 ?? title,
      metaTitle: title,
      description,
      category: category ?? undefined,
      author: authorName,
      url,
      publishedAt: publishedAt ? new Date(publishedAt).toISOString() : undefined,
      updatedAt: updatedAt ? new Date(updatedAt).toISOString() : undefined,
      itemCount: listItems.length,
      items: listItems.map((item) => ({
        position: item.position,
        name: item.name,
        url: `${url}#${item.anchor}`,
        anchor: item.anchor,
      })),
      faqs: faqs.map((f) => ({ question: f.q, answer: f.a })),
      itemListSchema,
      links: {
        page: url,
        api: apiUrl,
      },
    },
    {
      headers: {
        ...HEADERS,
        ETag: etag,
        "X-Source-URL": url,
        "X-Attribution": `${SITE_NAME} (${url})`,
        "X-Summary": `${h1 ?? title}: ranked list of ${listItems.length} items.`,
      },
    }
  );
}
