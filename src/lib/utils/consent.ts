/**
 * Cookie consent utilities — manages consent state, cookie persistence,
 * and Google Consent Mode v2 integration.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing" | "functional";

export interface ConsentState {
  necessary: true; // always on
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  timestamp: string;
  version: number;
}

const CONSENT_COOKIE = "cookie_consent";
const CONSENT_VERSION = 1;
const CONSENT_MAX_AGE_DAYS = 365;

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  functional: false,
  timestamp: "",
  version: CONSENT_VERSION,
};

export function getConsentFromCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE}=([^;]*)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (parsed.version !== CONSENT_VERSION) return null;
    return { ...parsed, necessary: true };
  } catch {
    return null;
  }
}

export function setConsentCookie(state: ConsentState): void {
  const expires = new Date(Date.now() + CONSENT_MAX_AGE_DAYS * 864e5).toUTCString();
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${CONSENT_COOKIE}=${value}; expires=${expires}; path=/; SameSite=Lax`;
}

export function hasConsentBeenGiven(): boolean {
  return getConsentFromCookie() !== null;
}

export function acceptAll(): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: true,
    marketing: true,
    functional: true,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  setConsentCookie(state);
  updateGoogleConsent(state);
  return state;
}

export function rejectAll(): ConsentState {
  const state: ConsentState = {
    ...DEFAULT_CONSENT,
    timestamp: new Date().toISOString(),
  };
  setConsentCookie(state);
  updateGoogleConsent(state);
  return state;
}

export function savePreferences(prefs: Pick<ConsentState, "analytics" | "marketing" | "functional">): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: prefs.analytics,
    marketing: prefs.marketing,
    functional: prefs.functional,
    timestamp: new Date().toISOString(),
    version: CONSENT_VERSION,
  };
  setConsentCookie(state);
  updateGoogleConsent(state);
  return state;
}

/** Update Google Consent Mode v2 */
export function updateGoogleConsent(state: ConsentState): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("consent", "update", {
    analytics_storage: state.analytics ? "granted" : "denied",
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    functionality_storage: state.functional ? "granted" : "denied",
    personalization_storage: state.functional ? "granted" : "denied",
    security_storage: "granted",
  });
}

/** Set Google Consent Mode v2 defaults (called before gtag config) */
export function setGoogleConsentDefaults(isEU: boolean): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  const existing = getConsentFromCookie();
  if (existing) {
    // Restore previous choices
    updateGoogleConsent(existing);
    return;
  }

  // Default: denied for EU, granted for non-EU
  const defaultValue = isEU ? "denied" : "granted";
  window.gtag("consent", "default", {
    analytics_storage: defaultValue,
    ad_storage: defaultValue,
    ad_user_data: defaultValue,
    ad_personalization: defaultValue,
    functionality_storage: defaultValue,
    personalization_storage: defaultValue,
    security_storage: "granted",
    wait_for_update: 500,
  });
}

/** Persist consent to backend */
export async function persistConsentToBackend(state: ConsentState): Promise<void> {
  try {
    await fetch("/api/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
  } catch {
    // Consent should work even if backend is unavailable
  }
}
