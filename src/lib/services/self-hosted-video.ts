/**
 * Self-hosted video helpers (DAN-1285).
 *
 * The top-traffic comparison pages play a real <video> on-page when a
 * `public/videos/<slug>.mp4` exists and there is no YouTube upload yet
 * (ComparisonVideoPlayer HEAD-checks the mp4 and self-hosts it client-side).
 * Those pages emitted no VideoObject JSON-LD, so Google Video / AI Overviews
 * could not index a video that was already rendering.
 *
 * SERVER-ONLY: these functions touch `fs` and `process.cwd()`, so they must
 * only ever be called from getStaticProps / build-time code — never imported
 * into a client component.
 */

import fs from "node:fs";
import path from "node:path";

const VIDEOS_DIR = path.join(process.cwd(), "public", "videos");

/** Returns true when `public/videos/<slug>.mp4` exists at render/build time. */
export function selfHostedVideoExists(slug: string): boolean {
  if (!slug || slug.includes("/") || slug.includes("..")) return false;
  try {
    return fs.existsSync(path.join(VIDEOS_DIR, `${slug}.mp4`));
  } catch {
    return false;
  }
}

/**
 * ISO upload date for the self-hosted mp4 — uses the file's mtime so the schema
 * reflects when the video was actually produced. Returns null if the file is
 * missing (callers fall back to the page's publishedAt/updatedAt).
 */
export function selfHostedVideoUploadDate(slug: string): string | null {
  if (!selfHostedVideoExists(slug)) return null;
  try {
    const stat = fs.statSync(path.join(VIDEOS_DIR, `${slug}.mp4`));
    return stat.mtime.toISOString();
  } catch {
    return null;
  }
}
