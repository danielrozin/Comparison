/**
 * /vs/* → /compare/* 301 redirects.
 *
 * Canonical comparison URLs live under /compare/{slug}. A handful of /vs/{slug}
 * inbound links exist in editorial copy (e.g. the byte-frozen DAN-873 reader
 * draft), so we 301 them to the canonical /compare/{slug} instead of building
 * a parallel route. The DB slug stays the same; only the path prefix differs.
 *
 * Origin: DAN-879 — DAN-873 draft-v2 wired three /vs/* internal links that
 * 404'd without an alias. Add new entries here when more /vs/* slugs surface.
 */

import type { BlogRedirect } from "./blog-redirects";

const VS_TO_COMPARE_SLUGS: string[] = [
  "aws-vs-azure",
  "aws-vs-google-cloud",
  "azure-vs-google-cloud",
];

export const VS_REDIRECTS: BlogRedirect[] = VS_TO_COMPARE_SLUGS.map((slug) => ({
  source: `/vs/${slug}`,
  destination: `/compare/${slug}`,
  permanent: true,
}));
