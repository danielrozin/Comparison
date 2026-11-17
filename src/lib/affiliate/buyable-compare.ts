import type { ComparisonEntityData } from "@/types";
import { isDigitalEntity, isNonBuyableEntity, isVehicleEntity } from "@/lib/services/affiliate";

/**
 * ROO-411 — which compares may show a shop (affiliate) CTA.
 *
 * Over 7 days the affiliate CTA was seen 483 times and clicked twice, and
 * ~80% of the views were on software, service, store and media compares
 * (brave-vs-chrome, slack-vs-microsoft-teams, ikea-vs-wayfair, mac-vs-windows,
 * bloomberg-vs-wsj) where there is nothing specific to buy.
 *
 * Rule (page level, all of these must hold):
 *  1. Category: the compare's category is a physical-goods category
 *     (BUYABLE_CATEGORIES). Only when the compare has no category at all does
 *     the slug-keyword fallback (HARDWARE_SLUG_PATTERN) decide this step.
 *  2. Entities: every entity is a physical product. Its entityType is a
 *     product type (PHYSICAL_PRODUCT_TYPES), and it is not digital (software,
 *     OS, browser, streaming), not an organisation/place/person/concept, not a
 *     vehicle, and not a store or publication by name. An entity with no
 *     entityType at all falls back to the slug keywords.
 *
 * Buyable compares get a product-named CTA ("Check RTX 5070 price on
 * Amazon"). Non-buyable compares get no affiliate block at all.
 */

export const BUYABLE_CATEGORIES: ReadonlySet<string> = new Set([
  "technology",
  "products",
  "gaming",
  "electronics",
  "appliances",
  "audio-wearables",
  "smart-home",
  "fitness-equipment",
  "home-kitchen",
  "ereaders",
]);

export const PHYSICAL_PRODUCT_TYPES: ReadonlySet<string> = new Set([
  "product",
  "products",
  "technology",
  "device",
  "gadget",
  "appliance",
  "smartphone",
  "phone",
  "laptop",
  "console",
  "gaming",
  "audio",
  "hardware",
  "electronics",
  "monitor",
  "gpu",
  "cpu",
  "component",
]);

/** Hardware / device keywords, used only when the data has no category or type. */
export const HARDWARE_SLUG_PATTERN =
  /(^|-)(rtx|gtx|rx|radeon|geforce|ryzen|core-ultra|core-i[3579]|threadripper|gpu|cpu|psu|\d{3,4}w|ram|ddr[345]|\d+gb|\d+tb|ssd|nvme|hdd|monitor|oled|qd-oled|woled|qled|mini-led|ips|va|tn|1080p|1440p|4k|ultrawide|iphone|galaxy|pixel|oneplus|ipad|macbook|laptop|chromebook|ps5|ps4|xbox|switch|steam-deck|airpods|earbuds|headphones|kindle|kobo|apple-watch|smartwatch|garmin|fitbit|camera|instax|polaroid|gopro|drone|tv|soundbar|router|keyboard|mouse|motherboard|b650|b850|x670|x870|z790|am4|am5|cooler|thermal-paste|printer|vacuum|blender|air-fryer)(-|$)/i;

/** Stores, marketplaces and publications that pass type gates as "products". */
const STORE_OR_MEDIA_NAME_PATTERN = new RegExp(
  [
    "^amazon$|amazon\\.com",
    "\\bikea\\b|\\bwayfair\\b|\\bwalmart\\b|^target$|\\bcostco\\b|best\\s*buy|\\bebay\\b|\\betsy\\b|\\btemu\\b|\\bshein\\b|aliexpress|\\bchewy\\b|home\\s*depot|\\blowe'?s\\b|\\bkohl'?s\\b|\\bmacy'?s\\b|nordstrom|\\bsephora\\b|\\bulta\\b|\\bzara\\b|\\bh&m\\b|uniqlo|newegg|b&h",
    "bloomberg|wall\\s*street\\s*journal|\\bwsj\\b|new\\s*york\\s*times|\\bnyt\\b|\\bcnn\\b|fox\\s*news|\\bbbc\\b|reuters|washington\\s*post|the\\s*economist|\\bforbes\\b",
  ].join("|"),
  "i",
);

export type AffiliateCompareClass = {
  buyable: boolean;
  /** Short machine-readable reason, for tests and debugging. */
  reason:
    | "buyable"
    | "no-entities"
    | "category-not-buyable"
    | "slug-not-hardware"
    | "entity-not-physical";
};

type EntityLike = Pick<ComparisonEntityData, "name" | "entityType">;

function entityIsPhysicalProduct(entity: EntityLike, category: string | null, slugLooksHardware: boolean): boolean {
  const full = entity as ComparisonEntityData;
  if (STORE_OR_MEDIA_NAME_PATTERN.test(entity.name)) return false;
  if (isDigitalEntity(full)) return false;
  if (isNonBuyableEntity(full)) return false;
  if (isVehicleEntity(full, category)) return false;
  const type = entity.entityType?.toLowerCase?.().trim() ?? "";
  if (!type) return slugLooksHardware;
  return PHYSICAL_PRODUCT_TYPES.has(type);
}

export function classifyAffiliateCompare({
  slug,
  category,
  entities,
}: {
  slug: string;
  category: string | null | undefined;
  entities: EntityLike[];
}): AffiliateCompareClass {
  if (!entities || entities.length === 0) return { buyable: false, reason: "no-entities" };
  const cat = category?.toLowerCase().trim() || "";
  const slugLooksHardware = HARDWARE_SLUG_PATTERN.test(slug);
  if (cat) {
    if (!BUYABLE_CATEGORIES.has(cat)) return { buyable: false, reason: "category-not-buyable" };
  } else if (!slugLooksHardware) {
    return { buyable: false, reason: "slug-not-hardware" };
  }
  const allPhysical = entities.every((e) => entityIsPhysicalProduct(e, cat || null, slugLooksHardware));
  return allPhysical ? { buyable: true, reason: "buyable" } : { buyable: false, reason: "entity-not-physical" };
}

/**
 * Non-buyable compares lose every shop link (Amazon, brand homepage, generic
 * "Learn more"), so the hero button, sticky bar, under-verdict row and
 * Where-to-buy list all render nothing and fire no affiliate events.
 */
export function applyAffiliateCompareRule<T extends ComparisonEntityData>(
  entities: T[],
  classification: AffiliateCompareClass,
): T[] {
  if (classification.buyable) return entities;
  return entities.map((entity) => ({ ...entity, affiliateLinks: [] }));
}

export { affiliateCtaLabel, shortProductName } from "./affiliate-cta-label";
