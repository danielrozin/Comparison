// AI-assistant referral detection (Nov 2026 AI Mode research: measure AI-sourced
// visits as their own channel — ChatGPT referrals convert ~4x Google's, but are
// invisible when lumped into "referral"/"direct").
//
// Google AI Mode / AI Overviews clicks arrive with a google.com referrer and are
// indistinguishable from organic in the browser; they are measured in Search
// Console instead (see scripts/gsc-ai-mode-prompts.mjs).

export const AI_PLATFORMS = [
  "chatgpt",
  "perplexity",
  "gemini",
  "copilot",
  "claude",
  "deepseek",
  "meta_ai",
  "grok",
  "you",
  "phind",
] as const;
export type AiPlatform = (typeof AI_PLATFORMS)[number];

const HOST_RULES: [RegExp, AiPlatform][] = [
  [/(^|\.)chatgpt\.com$|(^|\.)chat\.openai\.com$/, "chatgpt"],
  [/(^|\.)perplexity\.ai$/, "perplexity"],
  [/^gemini\.google\.com$|^bard\.google\.com$/, "gemini"],
  [/^copilot\.microsoft\.com$|(^|\.)copilot\.cloud\.microsoft$/, "copilot"],
  [/(^|\.)claude\.ai$/, "claude"],
  [/(^|\.)deepseek\.com$/, "deepseek"],
  [/^(www\.)?meta\.ai$/, "meta_ai"],
  [/^(www\.)?grok\.com$/, "grok"],
  [/^(www\.)?you\.com$/, "you"],
  [/(^|\.)phind\.com$/, "phind"],
];

const UTM_RULES: [RegExp, AiPlatform][] = [
  [/^chatgpt(\.com)?$|^openai$/, "chatgpt"],
  [/^perplexity(\.ai)?$/, "perplexity"],
  [/^gemini$/, "gemini"],
  [/^copilot(\.com)?$/, "copilot"],
  [/^claude(\.ai)?$/, "claude"],
];

/** Pure: which AI assistant sent this visit, or null. */
export function classifyAiReferral(search: string, referrer: string): AiPlatform | null {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const utm = params.get("utm_source")?.toLowerCase().trim();
  if (utm) {
    for (const [re, p] of UTM_RULES) if (re.test(utm)) return p;
  }
  if (!referrer) return null;
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return null;
  }
  for (const [re, p] of HOST_RULES) if (re.test(host)) return p;
  return null;
}
