import videoUploads from "@/data/video-uploads.json";
import { selfHostedVideoExists, selfHostedVideoUploadDate } from "@/lib/services/self-hosted-video";
import { getPrisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere } from "@/lib/db/canonical-comparisons";

const SITE_URL = "https://www.aversusb.net";

// Rebuild hourly so newly rendered/uploaded videos reach crawlers without a
// redeploy. The build-time render (and ISR revalidation) runs server-side where
// `selfHostedVideoExists` can stat `public/videos/<slug>.mp4`.
export const revalidate = 3600;

interface VideoUpload {
  slug: string;
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  videoFile: string;
  youtubeTitle: string;
  youtubeDescription: string;
  youtubeVideoId: string | null;
  youtubeUrl: string | null;
  uploadedAt: string;
}

const uploads = (videoUploads as { uploads: VideoUpload[] }).uploads;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Per-page OG image — mirrors the comparison page's ogImage URL (DAN-1285). */
function ogImageUrl(u: VideoUpload): string {
  return `${SITE_URL}/api/og?title=${encodeURIComponent(u.title)}&a=${encodeURIComponent(
    u.entityA
  )}&b=${encodeURIComponent(u.entityB)}&cat=${encodeURIComponent(u.category || "")}&type=comparison`;
}

interface VideoSitemapEntry {
  slug: string;
  title: string;
  description: string;
  thumbnailLoc: string;
  playerLoc?: string;
  contentLoc?: string;
  publicationDate?: string;
  category?: string;
  tags?: string[];
}

/**
 * Union of rendered comparison videos, de-duped by slug:
 *  - YouTube uploads (`youtubeVideoId`) → `player_loc` (youtube-nocookie embed),
 *    thumbnail from img.youtube.com.
 *  - Self-hosted mp4s (`public/videos/<slug>.mp4` present) → `content_loc`,
 *    thumbnail from the per-page OG image.
 * When both exist for a slug, the same `<video:video>` carries both locs.
 */
function buildVideoEntries(): VideoSitemapEntry[] {
  // Most-recent record per slug wins for title/description/entity fields.
  const latestBySlug = new Map<string, VideoUpload>();
  for (const u of uploads) {
    const prev = latestBySlug.get(u.slug);
    if (!prev || new Date(u.uploadedAt).getTime() > new Date(prev.uploadedAt).getTime()) {
      latestBySlug.set(u.slug, u);
    }
  }

  // Most-recent record that actually carries a youtubeVideoId, per slug.
  const youtubeBySlug = new Map<string, VideoUpload>();
  for (const u of uploads) {
    if (!u.youtubeVideoId) continue;
    const prev = youtubeBySlug.get(u.slug);
    if (!prev || new Date(u.uploadedAt).getTime() > new Date(prev.uploadedAt).getTime()) {
      youtubeBySlug.set(u.slug, u);
    }
  }

  const entries: VideoSitemapEntry[] = [];

  for (const [slug, rec] of latestBySlug) {
    const yt = youtubeBySlug.get(slug);
    const hasMp4 = selfHostedVideoExists(slug);

    // Skip slugs that have neither a YouTube upload nor a self-hosted mp4.
    if (!yt && !hasMp4) continue;

    const title = (yt?.youtubeTitle || rec.youtubeTitle || rec.title || slug).slice(0, 100);
    const description = (yt?.youtubeDescription || rec.youtubeDescription || rec.title || title).slice(
      0,
      2048
    );

    const entry: VideoSitemapEntry = {
      slug,
      title,
      description,
      // YouTube thumbnail when available, otherwise the per-page OG image.
      thumbnailLoc: yt?.youtubeVideoId
        ? `https://img.youtube.com/vi/${yt.youtubeVideoId}/hqdefault.jpg`
        : ogImageUrl(rec),
      category: rec.category || undefined,
      tags: [rec.entityA, rec.entityB, rec.category, "comparison", "vs"]
        .filter((t): t is string => Boolean(t))
        .slice(0, 32),
    };

    if (yt?.youtubeVideoId) {
      entry.playerLoc = `https://www.youtube-nocookie.com/embed/${yt.youtubeVideoId}`;
      entry.publicationDate = yt.uploadedAt;
    }

    if (hasMp4) {
      entry.contentLoc = `${SITE_URL}/videos/${slug}.mp4`;
      // Prefer the mp4 mtime; fall back to the upload record timestamp.
      entry.publicationDate =
        entry.publicationDate || selfHostedVideoUploadDate(slug) || rec.uploadedAt;
    }

    entries.push(entry);
  }

  // Stable, deterministic ordering.
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return entries;
}

function renderEntry(e: VideoSitemapEntry): string {
  const pageLoc = `${SITE_URL}/compare/${e.slug}`;
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(pageLoc)}</loc>`,
    "    <video:video>",
    `      <video:thumbnail_loc>${escapeXml(e.thumbnailLoc)}</video:thumbnail_loc>`,
    `      <video:title>${escapeXml(e.title)}</video:title>`,
    `      <video:description>${escapeXml(e.description)}</video:description>`,
  ];
  if (e.contentLoc) lines.push(`      <video:content_loc>${escapeXml(e.contentLoc)}</video:content_loc>`);
  if (e.playerLoc) lines.push(`      <video:player_loc>${escapeXml(e.playerLoc)}</video:player_loc>`);
  if (e.publicationDate)
    lines.push(`      <video:publication_date>${escapeXml(e.publicationDate)}</video:publication_date>`);
  if (e.category) lines.push(`      <video:category>${escapeXml(e.category)}</video:category>`);
  if (e.tags) {
    for (const tag of e.tags) {
      lines.push(`      <video:tag>${escapeXml(tag)}</video:tag>`);
    }
  }
  lines.push("      <video:family_friendly>yes</video:family_friendly>");
  // requires_subscription — tells Google this video is freely accessible (no paywall).
  // Free videos are preferred for Google Video Search and YouTube recommendations.
  lines.push("      <video:requires_subscription>no</video:requires_subscription>");
  // uploader — publisher identity for Google Video Search attribution and KG merging.
  lines.push(`      <video:uploader info="${SITE_URL}">A Versus B</video:uploader>`);
  lines.push("    </video:video>");
  lines.push("  </url>");
  return lines.join("\n");
}

/**
 * Video sitemap (DAN-1367). Next.js `MetadataRoute.Sitemap` cannot emit the
 * `video:video` extension namespace, so this hand-rolled route mirrors the
 * `sitemap.xml/route.ts` pattern. Referenced from the sitemap index in
 * `sitemap.xml/route.ts`. Served at `/sitemap/video.xml`.
 */
/**
 * DAN-2045: `video-uploads.json` is an append-only render log, not a page index —
 * a slug keeps its record after the page behind it is archived or consolidated
 * away, so 24 of the 63 `<loc>`s here pointed at a 404 (38%). Restrict the set to
 * slugs that are canonical comparison pages today.
 *
 * A DB blip must not empty the sitemap, so an unreachable/empty lookup falls back
 * to the unfiltered set (same reasoning as the getStaticProps guard in
 * src/pages/compare/[slug].tsx — stale is recoverable, deleted is not).
 */
async function canonicalSlugSet(): Promise<Set<string> | null> {
  const prisma = getPrisma();
  if (!prisma) return null;
  try {
    const rows = await prisma.comparison.findMany({
      where: canonicalComparisonWhere(),
      select: { slug: true },
    });
    if (rows.length === 0) return null;
    return new Set(rows.map((r: { slug: string }) => r.slug));
  } catch {
    return null;
  }
}

export async function GET() {
  const canonical = await canonicalSlugSet();
  const entries = buildVideoEntries().filter((e) => !canonical || canonical.has(e.slug));
  const body = entries.map(renderEntry).join("\n");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ` +
    `xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">\n` +
    `${body}\n` +
    `</urlset>\n`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
