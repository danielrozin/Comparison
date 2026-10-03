/**
 * Server-side lifecycle events for visitor-generated comparisons.
 * distinctId is the fixed "system" id — never a visitor id (ROO-97).
 */

import * as Sentry from "@sentry/nextjs";
import { flushPostHog, getPostHogClient } from "@/lib/posthog-server";

export type GenerationLifecycleEvent = "generation_promoted" | "generation_promotion_failed";

export async function captureGenerationLifecycle(
  event: GenerationLifecycleEvent,
  properties: { slug: string; reasons: string[]; attempt: number },
): Promise<void> {
  const payload = {
    slug: properties.slug,
    reason: properties.reasons.join("; ") || (event === "generation_promoted" ? "quality_pass" : "unknown"),
    reasons: properties.reasons,
    attempt: properties.attempt,
  };

  try {
    getPostHogClient().capture({
      distinctId: "system",
      event,
      properties: payload,
    });
    await flushPostHog();
  } catch (err) {
    console.error(`[posthog] ${event} capture failed:`, err);
  }

  if (event !== "generation_promotion_failed") return;
  try {
    Sentry.captureMessage("generation_promotion_failed", {
      level: "warning",
      extra: payload,
    });
  } catch (err) {
    console.error("[sentry] generation_promotion_failed capture failed:", err);
  }
}
