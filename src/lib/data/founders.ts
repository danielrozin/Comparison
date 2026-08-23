import { SITE_URL } from "@/lib/utils/constants";

/**
 * The two founders, as a single source of truth.
 *
 * The About page copy, the Person JSON-LD and the author pages all read from
 * here, so a name or a title can never be right in the visible page and stale
 * in the structured data — which is exactly the mismatch that stops Google and
 * the AI crawlers resolving a byline to a real person.
 */
export interface Founder {
  /** Slug used for the in-page anchor (#daniel-rozin) */
  id: string;
  /**
   * Canonical @id for this human across the whole graph. Daniel already has
   * one asserted by 20+ article/byline nodes — reusing it merges those into a
   * single entity instead of minting a second, competing person.
   */
  personId: string;
  name: string;
  jobTitle: string;
  /**
   * Other titles the same person holds and is bylined under elsewhere on the
   * site. Emitted alongside jobTitle so the About page and the article
   * bylines corroborate each other instead of looking like two people.
   */
  alsoKnownAsTitles?: string[];
  /** What they own day to day — one line, used in the card */
  role: string;
  bio: string;
  image: string;
  imageAlt: string;
  /** E.164 without the +, for wa.me links */
  whatsapp: string;
  /** Human-readable form of the same number */
  whatsappDisplay: string;
  email?: string;
  facebook: string;
  linkedin?: string;
  authorPage?: string;
  /** Topics the person is a credible source on — feeds Person.knowsAbout */
  knowsAbout: string[];
}

/** Both founders also run Scan2Remember; cross-linking the two identities is
 *  the strongest sameAs signal either site has. */
export const SCAN2REMEMBER_URL = "https://scan2remember.com";
export const SCAN2REMEMBER_ABOUT = "https://scan2remember.com/pages/about";

export const FOUNDERS: Founder[] = [
  {
    id: "daniel-rozin",
    personId: `${SITE_URL}/authors/daniel-rozin#person`,
    name: "Daniel Rozin",
    jobTitle: "Founder & CMO",
    alsoKnownAsTitles: ["Editor-in-Chief"],
    role: "Editorial, SEO and growth",
    bio:
      "Daniel has been settling arguments with data since long before it was a business — economies, empires, athletes, phones. He owns how comparisons on A Versus B get written, published and found.",
    image: "/images/team/daniel-rozin-founder-cmo.webp",
    imageAlt: "Daniel Rozin, founder and CMO of A Versus B, smiling outdoors",
    whatsapp: "972503733010",
    whatsappDisplay: "+972 50 373 3010",
    facebook: "https://www.facebook.com/daniel.rozin.94",
    linkedin: "https://www.linkedin.com/in/daniel-rozin-56a066b0/",
    authorPage: "/authors/daniel-rozin",
    knowsAbout: [
      "Comparison research",
      "Search engine optimization",
      "Consumer product research",
      "Content strategy",
    ],
  },
  {
    id: "shai-goldenberg",
    // No author page yet, so the About page section is his canonical location.
    personId: `${SITE_URL}/about#shai-goldenberg`,
    name: "Shai Goldenberg",
    jobTitle: "Founder & CTO",
    role: "Platform, data pipeline and infrastructure",
    bio:
      "Shai builds the machinery that turns an argument into a structured answer — the comparison engine, the data pipeline that keeps every attribute current, and the infrastructure the whole site runs on.",
    image: "/images/team/shai-goldenberg-founder-cto.webp",
    imageAlt: "Shai Goldenberg, founder and CTO of A Versus B, photographed outdoors",
    whatsapp: "972526600813",
    whatsappDisplay: "+972 52 660 0813",
    email: "Shai.and1@gmail.com",
    facebook: "https://www.facebook.com/shai.and1",
    knowsAbout: [
      "Software engineering",
      "Data pipelines",
      "Structured data",
      "Web performance",
    ],
  },
];

/** wa.me deep link that opens a chat with a prefilled first message. */
export function whatsappLink(founder: Founder): string {
  const text = encodeURIComponent(`Hi ${founder.name.split(" ")[0]}, I found you through A Versus B.`);
  return `https://wa.me/${founder.whatsapp}?text=${text}`;
}

/**
 * Fully-typed Person node for a founder.
 *
 * `sameAs` deliberately includes the Scan2Remember about page: the same two
 * people are named there with the same photos, so the two sites corroborate
 * each other's authorship claims instead of each asserting them alone.
 */
export function founderPersonSchema(founder: Founder) {
  return {
    "@type": "Person",
    "@id": founder.personId,
    name: founder.name,
    givenName: founder.name.split(" ")[0],
    familyName: founder.name.split(" ").slice(1).join(" "),
    jobTitle: founder.alsoKnownAsTitles?.length
      ? [founder.jobTitle, ...founder.alsoKnownAsTitles]
      : founder.jobTitle,
    description: founder.bio,
    url: founder.authorPage ? `${SITE_URL}${founder.authorPage}` : `${SITE_URL}/about#${founder.id}`,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}${founder.image}`,
      contentUrl: `${SITE_URL}${founder.image}`,
      caption: founder.imageAlt,
      width: 640,
      height: 640,
    },
    knowsAbout: founder.knowsAbout,
    worksFor: { "@id": `${SITE_URL}/#organization` },
    // Both point at nodes declared elsewhere in the graph, so a crawler
    // traverses to the full Organization rather than reading a stub.
    founderOf: [
      { "@id": `${SITE_URL}/#organization` },
      { "@id": `${SCAN2REMEMBER_URL}/#organization` },
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "founder",
      telephone: `+${founder.whatsapp}`,
      url: `https://wa.me/${founder.whatsapp}`,
      availableLanguage: ["en", "he"],
    },
    sameAs: [
      founder.facebook,
      ...(founder.linkedin ? [founder.linkedin] : []),
      SCAN2REMEMBER_ABOUT,
    ],
  };
}
