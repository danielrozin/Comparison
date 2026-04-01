/* GA4 Custom Event Tracking with DataLayer Integration */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Record<string, unknown>[];
  }
}

function getDataLayer(): Record<string, unknown>[] {
  if (typeof window === "undefined") return [];
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
}

function trackEvent(eventName: string, params: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;

  // Push to dataLayer for GTM compatibility
  getDataLayer().push({
    event: eventName,
    ...params,
  });

  // Also fire via gtag for direct GA4 integration
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
}

/**
 * Track a conversion event — pushes both the custom event
 * and the GA4 recommended event name for proper conversion mapping.
 */
function trackConversion(
  customEventName: string,
  recommendedEventName: string,
  params: Record<string, string | number | boolean>
) {
  // Fire custom event
  trackEvent(customEventName, params);
  // Fire GA4 recommended event for automatic conversion recognition
  if (recommendedEventName !== customEventName) {
    trackEvent(recommendedEventName, params);
  }
}

export function trackAffiliateClick(product: string, position: string, page: string) {
  trackConversion("affiliate_click", "select_promotion", {
    product,
    position,
    page,
    promotion_name: product,
    creative_slot: position,
  });
}

export function trackComparisonVote(entityA: string, entityB: string, choice: string) {
  trackEvent("comparison_vote", { entity_a: entityA, entity_b: entityB, choice });
}

export function trackNewsletterSignup(page: string, placement: string) {
  trackConversion("newsletter_signup", "generate_lead", {
    page,
    placement,
    currency: "USD",
    value: 0,
  });
}

export function trackShareClick(platform: string, page: string) {
  trackEvent("share_click", { platform, page, method: platform, content_type: "comparison" });
}

export function trackRelatedComparisonClick(sourcePage: string, targetPage: string) {
  trackEvent("related_comparison_click", { source_page: sourcePage, target_page: targetPage });
}

export function trackReviewSubmission(product: string, rating: number) {
  trackConversion("review_submission", "generate_lead", {
    product,
    rating,
    currency: "USD",
    value: 0,
  });
}

export function trackCommentSubmitted(comparisonId: string, comparisonTitle: string) {
  trackEvent("comment_submitted", { comparison_id: comparisonId, comparison_title: comparisonTitle });
}

export function trackSearch(query: string) {
  trackEvent("search", { search_term: query });
}

export function trackComparisonView(slug: string, entityA: string, entityB: string, category: string) {
  trackEvent("view_item", {
    item_id: slug,
    item_name: `${entityA} vs ${entityB}`,
    item_category: category,
  });
}

export { trackEvent };
