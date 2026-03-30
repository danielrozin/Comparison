/* GA4 Custom Event Tracking */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function trackEvent(eventName: string, params: Record<string, string | number>) {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
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

export { trackEvent };
