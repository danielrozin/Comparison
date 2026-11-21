import { CPGSITE_URL, FOUNDERS, GOLDENROZ_URL, SCAN2REMEMBER_ABOUT, SCAN2REMEMBER_URL } from "@/lib/data/founders";

/**
 * The other companies the A Versus B founders run — one source of truth for
 * the About page, the author page, /facts and their JSON-LD.
 *
 * Why: answer engines decide how far to trust a source partly by who stands
 * behind it. Declaring each project as an Organization whose `founder` points
 * at the same Person @id lets a crawler connect four sites to one known team,
 * instead of seeing four unrelated domains. Links are editorial and use the
 * brand name as anchor text, never a keyword phrase.
 *
 * Every claim here must match what the project's own site says about itself.
 */
export interface SisterProject {
  key: "scan2remember" | "goldenroz" | "cpgsite";
  name: string;
  url: string;
  /** The project's own About page, used as sameAs. */
  aboutUrl?: string;
  /** One plain sentence; used on /facts and as the Organization description. */
  summary: string;
  /** Short fragment after "Name —" in link lists. */
  blurb: string;
}

export const SISTER_PROJECTS: SisterProject[] = [
  {
    key: "goldenroz",
    name: "Goldenroz",
    url: GOLDENROZ_URL,
    aboutUrl: `${GOLDENROZ_URL}/about`,
    summary:
      "Goldenroz is the founders' software and marketing studio: custom business software, AI agents, cloud and IT services, and paid media management. It also builds A Versus B.",
    blurb: "software, AI and marketing studio; it also builds A Versus B",
  },
  {
    key: "scan2remember",
    name: "Scan2Remember",
    url: SCAN2REMEMBER_URL,
    aboutUrl: SCAN2REMEMBER_ABOUT,
    summary:
      "Scan2Remember gives families a free digital memorial page and a QR memorial plaque for a headstone or urn.",
    blurb: "free digital memorial pages and QR memorial plaques",
  },
  {
    key: "cpgsite",
    name: "Free Coloring Pages",
    url: CPGSITE_URL,
    aboutUrl: `${CPGSITE_URL}/about`,
    summary:
      "Free Coloring Pages (cpgsite.com) is a library of more than 1,000 free printable coloring pages for kids and adults, with an AI coloring page generator.",
    blurb: "1,000+ free printable coloring pages for kids and adults",
  },
];

export const sisterOrgId = (p: SisterProject) => `${p.url}/#organization`;

/** Organization node per project, each founded by the same two Person @ids. */
export function sisterOrganizationSchemas() {
  return SISTER_PROJECTS.map((p) => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": sisterOrgId(p),
    name: p.name,
    url: p.url,
    description: p.summary,
    founder: FOUNDERS.map((f) => ({ "@id": f.personId })),
    ...(p.aboutUrl ? { sameAs: [p.aboutUrl] } : {}),
  }));
}
