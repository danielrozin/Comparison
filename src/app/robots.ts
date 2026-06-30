import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default rule for all crawlers.
      // Allow rules take precedence over disallow when both match the same path
      // (robots.txt spec: longest matching path wins — but Next.js renders them
      // in declaration order, so specific allows must come before broad disallows).
      {
        userAgent: "*",
        // Allow public content + specific API endpoints used by AI crawlers and indexers.
        allow: [
          "/",
          "/api/knowledge-graph/",
          "/api/llms",
          "/api/llms-full",
          "/api/oembed",
          "/feed",
          "/feed/atom",
          "/api/comparisons/",
          "/api/faq/",
          "/api/popular",
          "/api/recent",
          "/api/search",
          "/api/og",
          "/api/v1/",
          "/api/context",
          "/api/blog",
          "/api/openapi",
          "/api/sitemap",
          "/api/answer/",
        ],
        disallow: [
          "/api/",
          "/admin/",
          "/_next/",
          "/embed/",
          "/developers/dashboard",
          "/survey",
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

      // === Additional AI/research crawlers (2026) ===
      { userAgent: "Ai2Bot", allow: "/" },             // Allen Institute for AI
      { userAgent: "ChatGLM-Spider", allow: "/" },     // Zhipu AI / GLM models
      { userAgent: "PanguBot", allow: "/" },           // Huawei PanGu model
      { userAgent: "Meltwater", allow: "/" },          // Meltwater media intelligence
      { userAgent: "KagiBot", allow: "/" },            // Kagi search engine crawler
      { userAgent: "AwarioSmartBot", allow: "/" },     // Awario brand monitoring
      { userAgent: "img2dataset", allow: "/" },        // Common Crawl image dataset
      { userAgent: "GeminiBot", allow: "/" },          // Google Gemini crawler
      { userAgent: "Gemini-Web", allow: "/" },         // Google Gemini web access
      { userAgent: "PetalBot", allow: "/" },           // Huawei Petal Search
      { userAgent: "SemrushSiteAudit", allow: "/" },   // Semrush technical audit
      { userAgent: "TurnitinBot", allow: "/" },        // Academic citation indexer
      { userAgent: "HuggingFaceBot", allow: "/" },     // HuggingFace dataset crawler
      { userAgent: "OpenAI-SearchBot", allow: "/" },   // OpenAI search product

      // === SEO crawlers — allowed (third-party index coverage helps discoverability) ===
      { userAgent: "AhrefsBot", allow: "/" },
      { userAgent: "SemrushBot", allow: "/" },
      { userAgent: "DataForSeoBot", allow: "/" },
    ],
    sitemap: [
      "https://www.aversusb.net/api/sitemap",
      "https://www.aversusb.net/sitemap.xml",
      "https://www.aversusb.net/sitemap/0.xml",
      "https://www.aversusb.net/sitemap/1.xml",
      "https://www.aversusb.net/sitemap/2.xml",
      "https://www.aversusb.net/sitemap/3.xml",
      "https://www.aversusb.net/sitemap/4.xml",
      "https://www.aversusb.net/sitemap/images.xml",
      "https://www.aversusb.net/sitemap/video.xml",
      "https://www.aversusb.net/sitemap/news.xml",
      "https://www.aversusb.net/llms.txt",
      "https://www.aversusb.net/feed",
      "https://www.aversusb.net/feed/atom",
    ],
  };
}
