/**
 * ROO-193: `missing_comparison_landing` replaces `comparison_viewed` on
 * /compare URLs that have no live page (404 shell or the on-demand builder).
 */

export type MissingLandingReferrerType =
  | "internal_search"
  | "internal"
  | "search_engine"
  | "ai_assistant"
  | "external"
  | "direct";

export type MissingLandingMode = "build" | "request" | "plain";

const SEARCH_ENGINES =
  /(^|\.)(google\.[a-z.]+|bing\.com|duckduckgo\.com|yahoo\.com|yandex\.[a-z]+|baidu\.com|ecosia\.org|search\.brave\.com|startpage\.com|qwant\.com|naver\.com)$/i;
const AI_ASSISTANTS =
  /(^|\.)(chatgpt\.com|chat\.openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com|you\.com|phind\.com)$/i;

export function classifyMissingLandingReferrer(
  referrer: string | null | undefined,
  ownHost: string,
  fromSearch: boolean,
): MissingLandingReferrerType {
  if (fromSearch) return "internal_search";
  if (!referrer) return "direct";
  let host = "";
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return "direct";
  }
  const own = ownHost.toLowerCase().replace(/^www\./, "");
  if (host === own || host.endsWith(`.${own}`)) return "internal";
  // AI check first: gemini.google.com would otherwise match google.*
  if (AI_ASSISTANTS.test(host)) return "ai_assistant";
  if (SEARCH_ENGINES.test(host)) return "search_engine";
  return "external";
}
