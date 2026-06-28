import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/embed/",
          "/developers/dashboard",
          "/survey",
          "/password-manager-comparison/",
          "/*?*sort=",
          "/*?*page=",
          "/*?*ref=",
          "/*?*utm_",
          "/*?*fbclid=",
          "/*?*gclid=",
        ],
      },

      // === LLM / AI Training Crawlers — explicitly welcomed ===
      // These bots power AI assistants that cite our comparison data.
      // Granting explicit access improves citation likelihood in ChatGPT,
      // Claude, Perplexity, Copilot, Gemini, and other AI answer engines.

      { userAgent: "GPTBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },

      { userAgent: "Claude-Web", allow: "/" },
      { userAgent: "ClaudeBot", allow: "/" },
      { userAgent: "anthropic-ai", allow: "/" },
      { userAgent: "Anthropic-AI", allow: "/" },

      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },

      { userAgent: "Google-Extended", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
      { userAgent: "Googlebot-Image", allow: "/" },
      { userAgent: "Googlebot-News", allow: "/" },

      { userAgent: "CopilotBot", allow: "/" },
      { userAgent: "Microsoft-AI", allow: "/" },
      { userAgent: "bingbot", allow: "/" },
      { userAgent: "BingPreview", allow: "/" },
      { userAgent: "MicrosoftPreview", allow: "/" },

      { userAgent: "YouBot", allow: "/" },
      { userAgent: "You.com", allow: "/" },

      { userAgent: "Bytespider", allow: "/" },
      { userAgent: "CCBot", allow: "/" },
      { userAgent: "cohere-ai", allow: "/" },
      { userAgent: "Meta-ExternalAgent", allow: "/" },
      { userAgent: "Meta-ExternalFetcher", allow: "/" },
      { userAgent: "Applebot", allow: "/" },
      { userAgent: "Applebot-Extended", allow: "/" },
      { userAgent: "AwsBot", allow: "/" },
      { userAgent: "DuckDuckBot", allow: "/" },
      { userAgent: "FacebookBot", allow: "/" },
      { userAgent: "iaskSpider", allow: "/" },
      { userAgent: "Kangaroo Bot", allow: "/" },
      { userAgent: "Liner", allow: "/" },
      { userAgent: "magpie-crawler", allow: "/" },
      { userAgent: "omgili", allow: "/" },
      { userAgent: "omgilibot", allow: "/" },
      { userAgent: "peer39_crawler", allow: "/" },
      { userAgent: "Quora-Bot", allow: "/" },
      { userAgent: "Scrapy", allow: "/" },
      { userAgent: "Timpibot", allow: "/" },

      // === Emerging AI crawlers (2025–2026) — explicitly welcomed ===
      { userAgent: "DeepSeekBot", allow: "/" },
      { userAgent: "Grok", allow: "/" },
      { userAgent: "xAI-Bot", allow: "/" },
      { userAgent: "MistralBot", allow: "/" },
      { userAgent: "NeevaBot", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "VelenPublicWebCrawler", allow: "/" },
      { userAgent: "Webzio-Extended", allow: "/" },

      // === SEO crawlers — allowed (third-party index coverage helps discoverability) ===
      { userAgent: "AhrefsBot", allow: "/" },
      { userAgent: "SemrushBot", allow: "/" },
      { userAgent: "DataForSeoBot", allow: "/" },
    ],
    sitemap: [
      "https://www.aversusb.net/sitemap.xml",
      "https://www.aversusb.net/sitemap/0.xml",
      "https://www.aversusb.net/sitemap/1.xml",
      "https://www.aversusb.net/sitemap/2.xml",
      "https://www.aversusb.net/sitemap/3.xml",
      "https://www.aversusb.net/sitemap/4.xml",
    ],
  };
}
