/* GA4 + Google Ads + Meta Pixel Event Tracking */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

function trackEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
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
}

export function trackComparisonVote(entityA: string, entityB: string, choice: string) {
  trackEvent("comparison_vote", { entity_a: entityA, entity_b: entityB, choice });
}

export function trackNewsletterSignup(page: string, placement: string) {
  trackEvent("newsletter_signup", { page, placement });
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
}

export function trackExperimentView(experimentId: string, experimentName: string, variant: string) {
  trackEvent("experiment_view", { experiment_id: experimentId, experiment_name: experimentName, variant });
}

export function trackExitIntentShown(page: string) {
  trackEvent("exit_intent_shown", { page });
}

export function trackExitIntentDismissed(page: string) {
  trackEvent("exit_intent_dismissed", { page });
}

export function trackFunnelStep(step: string, page: string, value?: number) {
  trackEvent("funnel_step", { step, page, ...(value !== undefined ? { value } : {}) });
}

export function trackComparisonSearch(query: string, resultType: string) {
  trackEvent("comparison_search", { search_term: query, result_type: resultType });
  trackMetaEvent("Search", { search_string: query, content_category: resultType });
}

export function trackComparisonView(slug: string, category: string) {
  trackEvent("comparison_view", { comparison_slug: slug, category });
  trackMetaEvent("ViewContent", { content_name: slug, content_category: category });
}

export function trackEmbedCtaClick(comparisonSlug: string, page: string) {
  trackEvent("embed_cta_click", { comparison_slug: comparisonSlug, page });
}

export { trackEvent };
