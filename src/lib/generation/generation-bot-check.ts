/**
 * Generation may start only from a real browser after the page loads.
 * Crawlers that fetch a missing /compare URL, and headless clients, never
 * reach the model. Vercel BotID is the production check; the user-agent
 * list is the backstop when BotID is unavailable outside production.
 */

import type { NextRequest } from "next/server";
import { isKnownCrawlerUserAgent } from "@/lib/generation/crawler-ua";

export { isKnownCrawlerUserAgent };

export async function assertBrowserGenerationRequest(
  request: NextRequest,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const userAgent = request.headers.get("user-agent");
  if (isKnownCrawlerUserAgent(userAgent)) {
    return { ok: false, reason: "bot_ua" };
  }
  // Set only by the on-demand page's client script. A bare HTTP client that
  // copies a browser user agent still fails this.
  if (request.headers.get("x-generation-client") !== "browser") {
    return { ok: false, reason: "not_browser" };
  }

  try {
    const { checkBotId } = await import("botid/server");
    const verification = await checkBotId();
    if (verification.isBot || verification.isVerifiedBot || !verification.isHuman) {
      return { ok: false, reason: "botid" };
    }
    return { ok: true };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("[botid] check failed; refusing generation", error);
      return { ok: false, reason: "botid_unavailable" };
    }
    return { ok: true };
  }
}
