/* GA4 + Google Ads + Meta Pixel + Clarity Event Tracking */

import {
  tagComparisonView as clarityTagComparison,
  tagSearchQuery as clarityTagSearch,
  tagExperimentVariant as clarityTagExperiment,
  tagUserAction as clarityTagAction,
  tagEngagement as clarityTagEngagement,
} from "@/lib/services/clarity-service";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  if (!Array.isArray(window.dataLayer)) {
    window.dataLayer = [];
  }
  return window.dataLayer;
}

function trackEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    // gtag.js mode: gtag() pushes to dataLayer internally
    window.gtag("event", eventName, params);
  } else {
    // GTM mode or pre-load: push to dataLayer (queued until GTM/gtag.js loads)
    getDataLayer().push({ event: eventName, ...params });
  }
}

/** Track a Google Ads conversion (e.g. 'AW-XXXXXXX/YYYYYY') */
export function trackGoogleAdsConversion(conversionLabel: string, value?: number, currency?: string) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: conversionLabel,
      ...(value !== undefined ? { value, currency: currency || "USD" } : {}),
    });
  }
}

/** Track a Meta Pixel standard event */
export function trackMetaEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("track", eventName, params);
    } else {
      window.fbq("track", eventName);
    }
  }
}

/** Track a Meta Pixel custom event */
export function trackMetaCustomEvent(eventName: string, params?: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (params) {
      window.fbq("trackCustom", eventName, params);
    } else {
      window.fbq("trackCustom", eventName);
    }
  }
}

export function trackAffiliateClick(product: string, position: string, page: string) {
  trackEvent("affiliate_click", { product, position, page });
  clarityTagAction("affiliate_click");
  clarityTagEngagement("converted");
}

export function trackComparisonVote(entityA: string, entityB: string, choice: string) {
  trackEvent("comparison_vote", { entity_a: entityA, entity_b: entityB, choice });
  clarityTagAction("vote");
  clarityTagEngagement("engaged");
}

export function trackNewsletterSignup(page: string, placement: string) {
  trackEvent("newsletter_signup", { page, placement });
  trackEvent("generate_lead", { lead_source: "newsletter", page, placement });
  trackMetaEvent("Lead", { content_name: "newsletter", content_category: placement });
}

export function trackShareClick(platform: string, page: string) {
  trackEvent("share_click", { platform, page });
}

export function trackRelatedComparisonClick(sourcePage: string, targetPage: string) {
  trackEvent("related_comparison_click", { source_page: sourcePage, target_page: targetPage });
}

export function trackReviewSubmission(product: string, rating: number) {
  trackEvent("review_submission", { product, rating });
  trackEvent("generate_lead", { lead_source: "review", product, value: rating });
}

export function trackExperimentView(experimentId: string, experimentName: string, variant: string) {
  trackEvent("experiment_view", { experiment_id: experimentId, experiment_name: experimentName, variant });
  clarityTagExperiment(experimentId, variant);
}


export function trackFunnelStep(step: string, page: string, value?: number) {
  trackEvent("funnel_step", { step, page, ...(value !== undefined ? { value } : {}) });
}

export function trackComparisonSearch(query: string, resultType: string, resultCount?: number) {
  trackEvent("comparison_search", { search_term: query, result_type: resultType });
  trackMetaEvent("Search", { search_string: query, content_category: resultType });
  clarityTagSearch(query, resultCount ?? 0);
}

export function trackComparisonView(slug: string, category: string) {
  trackEvent("comparison_view", { comparison_slug: slug, category });
  trackMetaEvent("ViewContent", { content_name: slug, content_category: category });
  clarityTagComparison(slug, category);
}

export function trackPollEmailCapture(page: string) {
  trackEvent("poll_email_capture", { page, placement: "post_poll" });
  trackEvent("generate_lead", { lead_source: "poll_capture", page });
  trackMetaEvent("Lead", { content_name: "newsletter", content_category: "poll_capture" });
}

export function trackEmbedCtaClick(comparisonSlug: string, page: string) {
  trackEvent("embed_cta_click", { comparison_slug: comparisonSlug, page });
}

export function trackCommentSubmission(comparisonId: string, page: string) {
  trackEvent("comment_submission", { comparison_id: comparisonId, page });
}

export function trackEmbedKeyRegistration(tier: string) {
  trackEvent("embed_key_registration", { tier });
  trackEvent("generate_lead", { lead_source: "embed_registration", tier });
  trackMetaEvent("CompleteRegistration", { content_name: "embed_partner", content_category: tier });
}

export function trackEmbedKeyEmailed(tier: string) {
  trackEvent("embed_key_emailed", { tier });
}

export function trackApiKeyGeneration(keyName: string) {
  trackEvent("api_key_generation", { key_name: keyName });
}

export type FunnelStep =
  | "page_view"
  | "scroll_depth_25"
  | "scroll_depth_50"
  | "scroll_depth_75"
  | "scroll_depth_100"
  | "engagement"
  | "newsletter_shown"
  | "newsletter_signup"
  | "affiliate_shown"
  | "affiliate_click"
  | "conversion";

export function trackConversionFunnel(step: FunnelStep, page: string, meta?: Record<string, string | number>) {
  trackEvent("conversion_funnel", { funnel_step: step, page, ...meta });
}

export function trackExitIntentShown(page: string, type?: string) {
  trackEvent("exit_intent_shown", { page, type: type || "desktop" });
}

export function trackExitIntentDismissed(page: string, type?: string) {
  trackEvent("exit_intent_dismissed", { page, type: type || "desktop" });
}

export function trackExitIntentMobile(page: string, type?: string) {
  trackEvent("exit_intent_mobile", { page, type: type || "mobile" });
}

export { trackEvent };
