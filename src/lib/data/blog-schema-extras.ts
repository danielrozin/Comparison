/**
 * Blog post schema extras — slug-keyed FAQPage / ItemList JSON-LD additions
 * for blog posts that need richer structured data than the default Article +
 * BreadcrumbList emitted by /blog/[slug]/page.tsx.
 *
 * DAN-827 / DAN-426: "Best Cloud Platforms 2026" roundup needs
 * Article + BreadcrumbList + FAQPage + ItemList (positions 1–8).
 */

import { IMAX_DOLBY_FAQS } from "@/lib/data/imax-dolby-blog";
import { IPHONE_DUO_FAQS } from "@/lib/data/iphone-duo-blog";
import { CASHIERS_CHECK_FAQS } from "@/lib/data/cashiers-check-blog";
import { TEMU_SHEIN_AMAZON_FAQS } from "@/lib/data/temu-shein-amazon-blog";
import { IPHONE_BROWSER_FAQS } from "@/lib/data/iphone-browser-blog";
import { BEST_CLOUD_PLATFORMS_FAQS } from "@/lib/data/best-cloud-platforms-blog";
import { MACBOOK_PRO_WEIGHT_FAQS } from "@/lib/data/macbook-pro-weight-blog";
import { SHOPIFY_WOO_SQUARESPACE_FAQS } from "@/lib/data/shopify-woocommerce-squarespace-blog";
import { NAVIGATION_APPS_FAQS } from "@/lib/data/navigation-apps-blog";
import { BEST_ACCOUNTING_FREELANCERS_FAQS } from "@/lib/data/best-accounting-freelancers-blog";
import { BEST_PRODUCTIVITY_APPS_FAQS } from "@/lib/data/best-productivity-apps-blog";

export interface BlogFaq {
  question: string;
  answer: string;
}

export interface BlogListItem {
  position: number;
  name: string;
  anchor: string; // in-page anchor (e.g. "aws") — appended after #
}

export interface BlogSchemaExtras {
  /** Override JSON-LD Article.author with a named Person. */
  author?: { name: string; url?: string };
  faqs?: BlogFaq[];
  itemList?: {
    name: string;
    description?: string;
    items: BlogListItem[];
  };
}

export const BLOG_SCHEMA_EXTRAS: Record<string, BlogSchemaExtras> = {
  // ROO-235: FAQs mirror the visible FAQ section of the repo article.
  "imax-vs-dolby-cinema-2026-is-the-premium-ticket-worth-it": { faqs: IMAX_DOLBY_FAQS },
  // ROO-272: FAQs mirror the visible FAQ section of the repo article.
  "iphone-duo-features": { faqs: IPHONE_DUO_FAQS },
  "how-to-get-a-cashiers-check": { faqs: CASHIERS_CHECK_FAQS },
  "temu-vs-shein-vs-amazon-where-to-shop-for-cheap-fashion-in-2026": { faqs: TEMU_SHEIN_AMAZON_FAQS },
  "best-browser-for-iphone-2026-safari-vs-chrome-vs-firefox": { faqs: IPHONE_BROWSER_FAQS },
  // ROO-235: FAQs mirror the visible FAQ section of the repo article; no personal byline.
  "macbook-pro-weight-2025-2026-complete-specs-comparison-guide": { faqs: MACBOOK_PRO_WEIGHT_FAQS },
  "shopify-vs-woocommerce-vs-squarespace-2026": { faqs: SHOPIFY_WOO_SQUARESPACE_FAQS },
  "best-navigation-apps-2026-google-maps-waze-and-apple-maps-compared": { faqs: NAVIGATION_APPS_FAQS },
  "best-accounting-software-freelancers-2026": { faqs: BEST_ACCOUNTING_FREELANCERS_FAQS },
  "best-productivity-apps-2026": { faqs: BEST_PRODUCTIVITY_APPS_FAQS },
  "best-cloud-platforms-2026": {
    faqs: BEST_CLOUD_PLATFORMS_FAQS,
    itemList: {
      name: "Best Cloud Platforms 2026: 8 Top Providers Compared",
      description:
        "Compare the 8 best cloud platforms of 2026 — pricing, free tiers, services, and use cases. AWS, Azure, GCP, Oracle, IBM, DigitalOcean, Linode, Vultr ranked.",
      items: [
        { position: 1, name: "Amazon Web Services (AWS)", anchor: "amazon-web-services-aws" },
        { position: 2, name: "Microsoft Azure", anchor: "microsoft-azure" },
        { position: 3, name: "Google Cloud (GCP)", anchor: "google-cloud-gcp" },
        { position: 4, name: "Oracle Cloud Infrastructure (OCI)", anchor: "oracle-cloud-infrastructure-oci" },
        { position: 5, name: "IBM Cloud", anchor: "ibm-cloud" },
        { position: 6, name: "DigitalOcean", anchor: "digitalocean" },
        { position: 7, name: "Linode (Akamai Cloud)", anchor: "linode-akamai-cloud" },
        { position: 8, name: "Vultr", anchor: "vultr" },
      ],
    },
  },
};

export function getBlogSchemaExtras(slug: string): BlogSchemaExtras | null {
  return BLOG_SCHEMA_EXTRAS[slug] ?? null;
}
