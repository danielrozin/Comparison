/**
 * ROO-359 — Growth EXP-5.
 *
 * PostHog project Aversusb (505329), flag key `avb-aff-block-blog`.
 * Multivariate, sticky by person (`distinct_id`, experience continuity on):
 *   control — today's page, no block
 *   test    — one compact disclosed affiliate block
 *
 * The flag is created inactive. Cos/ops turns it on in the PostHog UI after
 * this code is deployed. While it is off, `getFeatureFlag` stays undefined
 * and every visitor sees control. No kill switch lives in this file.
 *
 * https://us.posthog.com/project/505329/feature-flags/1018351
 *
 * Bot / AI-crawler filtering does not belong here. PostHog's test-account
 * filters stay analytics-only. This module never reads a user agent.
 */

import { amazonSearchAffiliateUrl } from "@/lib/services/paid-attribution";

export const AVB_AFF_BLOCK_BLOG_FLAG = "avb-aff-block-blog";

/** `placement` / `position` on the existing `affiliate_link_clicked` event. */
export const AVB_AFF_BLOCK_BLOG_PLACEMENT = "blog_aff_block";

/**
 * Exact paths in the experiment. Anything else — including the singular
 * `/blog/best-cloud-platform-2026` guide — stays out.
 */
export const AVB_AFF_BLOCK_BLOG_PATHS = [
  "/blog",
  "/blog/best-fast-food-burgers-2026-ranked-and-reviewed",
  "/blog/is-wayfair-furniture-better-than-ikea-honest-comparison",
  "/blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide",
  "/blog/best-keurig-pods-2026-ranked-flavor-value-compatibility",
  "/blog/best-cloud-platforms-2026",
  "/blog/best-browser-for-iphone-2026-safari-vs-chrome-vs-firefox",
] as const;

export type AvbAffBlockBlogPath = (typeof AVB_AFF_BLOCK_BLOG_PATHS)[number];

const PATH_SET = new Set<string>(AVB_AFF_BLOCK_BLOG_PATHS);

export interface BlogAffPick {
  product: string;
  blurb: string;
  /** Amazon search URL with the organic Associates tag. */
  url: string;
  partner: "amazon";
  label: string;
}

export interface BlogAffBlock {
  path: AvbAffBlockBlogPath;
  heading: string;
  intro: string;
  picks: BlogAffPick[];
}

interface PickSpec {
  product: string;
  /** Amazon search query. The Associates tag is added at read time. */
  query: string;
  blurb: string;
}

interface BlockSpec {
  path: AvbAffBlockBlogPath;
  heading: string;
  intro: string;
  picks: PickSpec[];
}

const BLOCKS: BlockSpec[] = [
  {
    path: "/blog",
    heading: "Related picks",
    intro: "A few products from guides on this blog.",
    picks: [
      {
        product: "Keurig K-Cup pods",
        query: "Keurig K-Cup pods variety pack",
        blurb: "Mixed coffee pods",
      },
      {
        product: "Smash burger press",
        query: "smash burger press",
        blurb: "Press for a diner-style crust",
      },
      {
        product: "MacBook Pro sleeve",
        query: "MacBook Pro sleeve",
        blurb: "Padded sleeve for the laptop",
      },
    ],
  },
  {
    path: "/blog/best-fast-food-burgers-2026-ranked-and-reviewed",
    heading: "Cook a contender at home",
    intro: "Tools for the burger style this ranking is about.",
    picks: [
      {
        product: "Smash burger press",
        query: "smash burger press",
        blurb: "Heavy press for a crust",
      },
      {
        product: "Cast iron griddle",
        query: "cast iron griddle",
        blurb: "Flat top for smash burgers",
      },
    ],
  },
  {
    path: "/blog/is-wayfair-furniture-better-than-ikea-honest-comparison",
    heading: "Related furniture picks",
    intro: "Amazon searches for the same kinds of pieces.",
    picks: [
      {
        product: "Bookshelf",
        query: "bookshelf bookcase",
        blurb: "Freestanding bookcase",
      },
      {
        product: "Storage ottoman",
        query: "storage ottoman",
        blurb: "Seat with hidden storage",
      },
    ],
  },
  {
    path: "/blog/macbook-pro-weight-2025-2026-complete-specs-comparison-guide",
    heading: "Gear for a lighter carry",
    intro: "Accessories for the laptop this weight guide compares.",
    picks: [
      {
        product: "MacBook Pro sleeve",
        query: "MacBook Pro sleeve",
        blurb: "Slim padded sleeve",
      },
      {
        product: "USB-C hub",
        query: "USB-C hub for MacBook Pro",
        blurb: "Ports the laptop leaves off",
      },
    ],
  },
  {
    path: "/blog/best-keurig-pods-2026-ranked-flavor-value-compatibility",
    heading: "Shop pod picks",
    intro: "Pods and a fill-your-own filter from this guide.",
    picks: [
      {
        product: "Keurig K-Cup variety pack",
        query: "Keurig K-Cup pods variety pack",
        blurb: "Mixed flavors in one box",
      },
      {
        product: "Reusable K-Cup",
        query: "reusable K-Cup filter",
        blurb: "Fill-your-own pod",
      },
    ],
  },
  {
    // AWS, Azure, and GCP have no tracked affiliate URL (affiliate.ts sends
    // those names to brand homepages). A homepage click would not be an
    // affiliate link, so the test arm shows disclosed Amazon study guides
    // instead of an empty block.
    path: "/blog/best-cloud-platforms-2026",
    heading: "Related picks",
    intro: "Exam guides for the cloud platforms in this article.",
    picks: [
      {
        product: "AWS Cloud Practitioner study guide",
        query: "AWS Certified Cloud Practitioner study guide",
        blurb: "Entry-level AWS exam book",
      },
      {
        product: "Azure fundamentals study guide",
        query: "AZ-900 Azure fundamentals study guide",
        blurb: "Entry-level Azure exam book",
      },
    ],
  },
  {
    // Safari, Chrome, and Firefox are free and have no affiliate program
    // configured. Show disclosed iPhone gear rather than untagged browser
    // homepages, which would not earn a commission.
    path: "/blog/best-browser-for-iphone-2026-safari-vs-chrome-vs-firefox",
    heading: "Related picks",
    intro: "Add-ons for the iPhone this browser guide is about.",
    picks: [
      {
        product: "iPhone privacy screen protector",
        query: "iPhone privacy screen protector",
        blurb: "Privacy glass for the phone",
      },
      {
        product: "MagSafe charger",
        query: "MagSafe charger",
        blurb: "Charger for the same iPhone",
      },
    ],
  },
];

const BLOCK_BY_PATH = new Map<string, BlockSpec>(BLOCKS.map((block) => [block.path, block]));

/** Drop a trailing slash and any query or hash so `/blog/` still matches. */
export function normalizeBlogPath(path: string): string {
  const bare = path.split("?")[0]?.split("#")[0] ?? "";
  if (bare.length > 1 && bare.endsWith("/")) return bare.slice(0, -1);
  return bare;
}

export function isAvbAffBlockBlogPath(path: string): path is AvbAffBlockBlogPath {
  return PATH_SET.has(normalizeBlogPath(path));
}

export function isAvbAffBlockBlogSlug(slug: string): boolean {
  return isAvbAffBlockBlogPath(`/blog/${slug}`);
}

/**
 * Boolean `true` is accepted so a later flip from multivariate to a boolean
 * flag still means "show the block". Anything else, including `control` and
 * a flag that has not loaded, is control.
 */
export function isAffBlockTestVariant(value: string | boolean | null | undefined): boolean {
  return value === "test" || value === true;
}

export function getBlogAffBlock(path: string): BlogAffBlock | null {
  const spec = BLOCK_BY_PATH.get(normalizeBlogPath(path));
  if (!spec) return null;
  return {
    path: spec.path,
    heading: spec.heading,
    intro: spec.intro,
    picks: spec.picks.map((pick) => ({
      product: pick.product,
      blurb: pick.blurb,
      partner: "amazon",
      label: `Shop ${pick.product} on Amazon`,
      url: amazonSearchAffiliateUrl(pick.query),
    })),
  };
}
