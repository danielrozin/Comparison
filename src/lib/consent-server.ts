/**
 * Server-side GDPR consent helpers (DAN-376).
 *
 * The client-side consent utilities live in `src/lib/utils/consent.ts`
 * (cookie persistence, gtag wiring). This module is the server-only
 * counterpart: region detection, salted IP hashing, default deny-all
 * for Google Consent Mode v2.
 */
import { createHash } from "crypto";

const EU_EEA_COUNTRIES = new Set([
  // EU
  "AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
  "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL",
  "PL", "PT", "RO", "SK", "SI", "ES", "SE",
  // EEA (non-EU)
  "IS", "LI", "NO",
  // UK GDPR
  "GB",
]);

export interface ServerConsentCategories {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
}

export interface GoogleConsentModeV2 {
  ad_storage: "granted" | "denied";
  analytics_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}

export const CURRENT_POLICY_VERSION = "1.0";
export const CONSENT_RETENTION_YEARS = 3;

export function isEuEea(countryCode: string | null | undefined): boolean {
  if (!countryCode) return false;
  return EU_EEA_COUNTRIES.has(countryCode.toUpperCase());
}

export function getCountryFromHeaders(headers: Headers): string | null {
  return headers.get("x-vercel-ip-country") || null;
}

// sha256(ip + ":" + CONSENT_IP_SALT) truncated to 32 hex chars.
// CONSENT_IP_SALT must be set in env; absent salt still hashes but the
// resulting digest is reversible against a known IP space, so set it.
export function hashIp(ip: string): string {
  const salt = process.env.CONSENT_IP_SALT || "";
  return createHash("sha256").update(`${ip}:${salt}`).digest("hex").slice(0, 32);
}

export function toGoogleConsentMode(categories: ServerConsentCategories): GoogleConsentModeV2 {
  return {
    ad_storage: categories.marketing ? "granted" : "denied",
    analytics_storage: categories.analytics ? "granted" : "denied",
    ad_user_data: categories.marketing ? "granted" : "denied",
    ad_personalization: categories.marketing ? "granted" : "denied",
  };
}

export function defaultConsentForRegion(isEu: boolean): ServerConsentCategories {
  return {
    necessary: true,
    analytics: !isEu,
    marketing: !isEu,
    functional: !isEu,
  };
}
