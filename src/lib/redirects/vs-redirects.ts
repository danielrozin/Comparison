/**
 * /vs/* → canonical-route 301 redirects.
 *
 * Canonical comparison URLs live under /compare/{slug}, and standalone entity
 * profiles live under /entity/{slug}. A handful of /vs/{slug} inbound links
 * exist in byte-frozen editorial copy (the DAN-873 and DAN-864 reader drafts),
 * so we 301 them to the canonical route instead of building a parallel /vs
 * route. The DB/entity slug stays the same; only the path prefix differs.
 *
 * Origin: DAN-879 — DAN-873 draft-v2 wired three two-entity /vs/* links that
 * 404'd without an alias. Extended under DAN-1079 — the DAN-864 draft-v3 buying
 * guide wires single-entity /vs/{claude,gemini} links that resolve to the
 * standalone /entity/{slug} profiles. Add new entries when more /vs/* slugs
 * surface: two-entity comparison slugs go in VS_TO_COMPARE_SLUGS, single-entity
 * profile slugs go in VS_TO_ENTITY_SLUGS.
 */

import type { BlogRedirect } from "./blog-redirects";

// Two-entity comparison slugs: /vs/{slug} → /compare/{slug}
const VS_TO_COMPARE_SLUGS: string[] = [
  "aws-vs-azure",
  "aws-vs-google-cloud",
  "azure-vs-google-cloud",
];

// Single-entity profile slugs: /vs/{slug} → /entity/{slug}
const VS_TO_ENTITY_SLUGS: string[] = [
  "claude",
  "gemini",
];

export const VS_REDIRECTS: BlogRedirect[] = [
  ...VS_TO_COMPARE_SLUGS.map((slug) => ({
    source: `/vs/${slug}`,
    destination: `/compare/${slug}`,
    permanent: true as const,
  })),
  ...VS_TO_ENTITY_SLUGS.map((slug) => ({
    source: `/vs/${slug}`,
    destination: `/entity/${slug}`,
    permanent: true as const,
  })),
];
