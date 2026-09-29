/**
 * Shared crawler check. Safe to import from client components.
 * A missing or tiny user agent is treated as a crawler so generation
 * never starts from a request that does not look like a browser.
 */

const CRAWLER_UA =
  /googlebot|bingbot|duckduckbot|baiduspider|yandexbot|sogou|exabot|applebot|twitterbot|facebookexternalhit|linkedinbot|slackbot|telegrambot|discordbot|pinterestbot|redditbot|embedly|whatsapp|gptbot|claudebot|amazonbot|perplexitybot|bytespider|petalbot|semrushbot|ahrefsbot|mj12bot|dotbot|rogerbot|screaming frog|wget\/|curl\/|python-requests|go-http-client|headlesschrome|phantomjs|puppeteer|playwright|lighthouse/i;

export function isKnownCrawlerUserAgent(userAgent: string | null | undefined): boolean {
  if (!userAgent || userAgent.trim().length < 8) return true;
  return CRAWLER_UA.test(userAgent);
}
