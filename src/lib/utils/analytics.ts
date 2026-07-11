/* GA4 + Google Ads + Meta Pixel + Clarity + PostHog Event Tracking */

import {
  tagComparisonView as clarityTagComparison,
  tagSearchQuery as clarityTagSearch,
  tagExperimentVariant as clarityTagExperiment,
  tagUserAction as clarityTagAction,
  tagEngagement as clarityTagEngagement,
} from "@/lib/services/clarity-service";
import posthog from "posthog-js";

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
  posthog.capture("affiliate_link_clicked", { product, position, page });
}

export function trackComparisonVote(entityA: string, entityB: string, choice: string) {
  trackEvent("comparison_vote", { entity_a: entityA, entity_b: entityB, choice });
  clarityTagAction("vote");
  clarityTagEngagement("engaged");
  posthog.capture("comparison_poll_voted", { entity_a: entityA, entity_b: entityB, choice });
}

export function trackNewsletterSignup(page: string, placement: string) {
  trackEvent("newsletter_signup", { page, placement });
  trackEvent("generate_lead", { lead_source: "newsletter", page, placement });
  trackMetaEvent("Lead", { content_name: "newsletter", content_category: placement });
  posthog.capture("newsletter_subscribed", { page, placement });
}

/**
 * Highest-intent lead event — contact form submission.
 * Fires GA4 `generate_lead` (importable as a Google Ads conversion) and Meta `Lead`.
 * Also fires a dedicated Google Ads conversion when a conversion label is configured;
 * no-ops until NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL is set (e.g. 'AW-XXXXXXXXX/abc123'),
 * so this is fully credential-free until the ad account goes live.
 */
export function trackContactFormSubmit(subject: string) {
  trackEvent("contact_form_submit", { subject });
  trackEvent("generate_lead", { lead_source: "contact_form", subject });
  trackMetaEvent("Lead", { content_name: "contact_form", content_category: subject });

  const adsLabel = process.env.NEXT_PUBLIC_GOOGLE_ADS_CONTACT_LABEL;
  if (adsLabel) {
    trackGoogleAdsConversion(adsLabel);
  }
}

export function trackShareClick(platform: string, page: string) {
  trackEvent("share_click", { platform, page });
  posthog.capture("share_clicked", { platform, page });
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
  posthog.capture("comparison_search_performed", { search_term: query, result_type: resultType, result_count: resultCount ?? 0 });
}

export function trackComparisonView(slug: string, category: string) {
  trackEvent("comparison_view", { comparison_slug: slug, category });
  trackMetaEvent("ViewContent", { content_name: slug, content_category: category });
  clarityTagComparison(slug, category);
  posthog.capture("comparison_viewed", { comparison_slug: slug, category });
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
  posthog.capture("comment_submitted", { comparison_id: comparisonId, page });
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

export function trackComparisonTrackerImpression(slug: string) {
  trackEvent("track_comparison_impression", { comparison_slug: slug });
}

export function trackComparisonTrackerClick(slug: string, mode: "logged_in" | "logged_out") {
  trackEvent("track_comparison_click_track", { comparison_slug: slug, mode });
}

export function trackComparisonTrackerSubmit(slug: string, mode: "logged_in" | "logged_out") {
  trackEvent("track_comparison_submit", { comparison_slug: slug, mode });
  trackEvent("generate_lead", { lead_source: "comparison_tracker", comparison_slug: slug });
  trackMetaEvent("Lead", { content_name: "comparison_tracker", content_category: slug });
  posthog.capture("comparison_tracker_submitted", { comparison_slug: slug, mode });
}

export function trackComparisonTrackerConfirmed(slug: string) {
  trackEvent("track_comparison_confirmed", { comparison_slug: slug });
  trackMetaEvent("CompleteRegistration", {
    content_name: "comparison_tracker",
    content_category: slug,
  });
}


export function trackVerdictFeedbackImpression(slug: string) {
  trackEvent("verdict_feedback_impression", { comparison_slug: slug });
}

export function trackVerdictFeedbackVote(slug: string, vote: "up" | "down") {
  const eventName = vote === "up" ? "verdict_feedback_vote_up" : "verdict_feedback_vote_down";
  trackEvent(eventName, { comparison_slug: slug });
  clarityTagAction(eventName);
  clarityTagEngagement("engaged");
  posthog.capture("verdict_feedback_voted", { comparison_slug: slug, vote });
}

export function trackVerdictFeedbackReasonSubmit(slug: string, vote: "up" | "down") {
  trackEvent("verdict_feedback_reason_submit", { comparison_slug: slug, vote });
}

/* UX study recruitment banner (DAN-1980) — recruit n=5 usability-study participants */
export function trackUxStudyBannerShown(page: string) {
  trackEvent("ux_study_banner_shown", { page });
  posthog.capture("ux_study_banner_shown", { page });
}

export function trackUxStudyBannerClick(page: string) {
  trackEvent("ux_study_banner_click", { page });
  trackEvent("generate_lead", { lead_source: "ux_study", page });
  posthog.capture("ux_study_banner_clicked", { page });
}

export function trackUxStudyBannerDismiss(page: string) {
  trackEvent("ux_study_banner_dismiss", { page });
  posthog.capture("ux_study_banner_dismissed", { page });
}

export { trackEvent };
