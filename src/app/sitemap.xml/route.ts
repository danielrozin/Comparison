import { generateSitemaps } from "../sitemap";

const SITE_URL = "https://www.aversusb.net";

// Re-build the sitemap index hourly so newly added shards (or shape changes)
// reach crawlers without a redeploy.
export const revalidate = 3600;

/**
 * Sitemap index handler — Next.js's `generateSitemaps` only emits the shard
 * routes at `/sitemap/[id].xml`; it does not emit `/sitemap.xml` itself.
 * `robots.txt` advertises `/sitemap.xml`, so we serve a sitemap index here
 * that points at every shard returned by `generateSitemaps`.
 */
export async function GET() {
  const shards = await generateSitemaps();
  const lastmod = new Date().toISOString();

  const entries = shards
    .map(
      (s) =>
        `  <sitemap>\n    <loc>${SITE_URL}/sitemap/${s.id}.xml</loc>\n    <lastmod>${lastmod}</lastmod>\n  </sitemap>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries}\n</sitemapindex>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
