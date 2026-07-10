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
          "/api/og",
          "/api/v1/",
          "/api/context",
          "/api/blog",
          "/api/openapi",
          "/api/sitemap",
          "/api/answer/",
          "/.well-known/",
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
      { userAgent: "MistralAI-User", allow: "/" },        // Mistral user-facing AI product
      { userAgent: "NeevaBot", allow: "/" },
      { userAgent: "Diffbot", allow: "/" },
      { userAgent: "VelenPublicWebCrawler", allow: "/" },
      { userAgent: "Webzio-Extended", allow: "/" },
      { userAgent: "Amazonbot", allow: "/" },             // Amazon (Alexa, Kendra, Bedrock training)
      { userAgent: "DuckAssistBot", allow: "/" },         // DuckDuckGo AI Answer engine
      { userAgent: "Claude-User", allow: "/" },           // Anthropic Claude user-agent alias
      { userAgent: "Claude-SearchBot", allow: "/" },      // Anthropic Claude search product
      { userAgent: "Google-CloudVertexBot", allow: "/" }, // Google Cloud Vertex AI crawler
      { userAgent: "FriendlyCrawler", allow: "/" },       // FriendlyCrawler (AI research)

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

      // === 2026 additions — major search engines + new AI crawlers ===
      { userAgent: "BraveBot", allow: "/" },            // Brave Search + Leo AI assistant
      { userAgent: "brave-search-bot", allow: "/" },    // Brave Search alternate UA
      { userAgent: "YandexBot", allow: "/" },           // Yandex Search (Russia/Eastern Europe)
      { userAgent: "YaDirectFetcher", allow: "/" },     // Yandex Direct fetcher
      { userAgent: "NaverBot", allow: "/" },            // Naver Search (South Korea)
      { userAgent: "BaiduSpider", allow: "/" },         // Baidu Search (China)
      { userAgent: "QwenBot", allow: "/" },             // Alibaba Qwen AI model crawler
      { userAgent: "TongYiBot", allow: "/" },           // Alibaba Tongyi/Qwen alternate UA
      { userAgent: "Firecrawl", allow: "/" },           // Firecrawl AI scraping tool (RAG pipelines)
      { userAgent: "ExaBot", allow: "/" },              // Exa.ai AI-powered search

      // === RAG / AI-app infrastructure crawlers (2026) — welcomed for citation coverage ===
      { userAgent: "JinaAIBot", allow: "/" },           // Jina AI reader — used in RAG pipelines
      { userAgent: "jina-ai", allow: "/" },             // Jina AI alternate UA
      { userAgent: "ZyteBot", allow: "/" },             // Zyte / Scrapy Cloud crawler
      { userAgent: "ScrapingBee", allow: "/" },         // ScrapingBee (used in many AI apps)
      { userAgent: "MojeekBot", allow: "/" },           // Mojeek privacy search
      { userAgent: "SpiderBot", allow: "/" },           // Spider.cloud RAG web crawler
      { userAgent: "SearchGPT-Bot", allow: "/" },       // OpenAI SearchGPT alternate UA
      { userAgent: "NovaCrawler", allow: "/" },         // Nova AI search

      // === 2026 AI additions — model/product crawlers not previously listed ===
      { userAgent: "AI21Bot", allow: "/" },              // AI21 Labs / Jamba model training
      { userAgent: "CohereBot", allow: "/" },            // Cohere Command R alternate UA
      { userAgent: "AnthropicBot", allow: "/" },         // Anthropic training crawler alternate
      { userAgent: "Runway-Bot", allow: "/" },           // Runway AI media research
      { userAgent: "Glean-Bot", allow: "/" },            // Glean enterprise search
      { userAgent: "NotionBot", allow: "/" },            // Notion AI assistant crawler
      { userAgent: "WriterBot", allow: "/" },            // Writer.com generative AI
      { userAgent: "InflectionAI", allow: "/" },         // Pi AI (Inflection AI)
      { userAgent: "Liner-Bot", allow: "/" },            // Liner AI research assistant
      { userAgent: "PhindBot", allow: "/" },             // Phind developer AI search

      // === SEO crawlers — allowed (third-party index coverage helps discoverability) ===
      { userAgent: "AhrefsBot", allow: "/" },
      { userAgent: "SemrushBot", allow: "/" },
      { userAgent: "DataForSeoBot", allow: "/" },

      // === 2026 additions — AI assistant agents + platform crawlers ===
      { userAgent: "OpenAI-Operator", allow: "/" },       // OpenAI Operator autonomous agent
      { userAgent: "Poe-Bot", allow: "/" },               // Quora Poe AI assistant
      { userAgent: "CharacterAI-Bot", allow: "/" },       // Character.AI crawler
      { userAgent: "CohereForAI", allow: "/" },           // Cohere AI alternate UA
      { userAgent: "NvidiaBot", allow: "/" },             // NVIDIA AI research crawler
      { userAgent: "NevaBot", allow: "/" },               // Neeva search (Snowflake)
      { userAgent: "TavilyBot", allow: "/" },             // Tavily AI search (RAG tool)
      { userAgent: "EZEBot", allow: "/" },                // EZE Bot AI crawler

      // === 2026 additions — LLM infrastructure + agentic AI crawlers ===
      { userAgent: "TogetherBot", allow: "/" },           // Together AI (LLM inference platform, trains on web data)
      { userAgent: "FireworksBot", allow: "/" },          // Fireworks.ai (LLM inference + fine-tuning platform)
      { userAgent: "OpenRouterBot", allow: "/" },         // OpenRouter (LLM routing platform)
      { userAgent: "AnyscaleBot", allow: "/" },           // Anyscale (Ray distributed AI)
      { userAgent: "ReplicateBot", allow: "/" },          // Replicate (AI model hosting, trains on web)
      { userAgent: "GroqBot", allow: "/" },               // Groq (LPU inference, training data crawler)
      { userAgent: "CerebrasBot", allow: "/" },           // Cerebras (AI chip + inference platform)
      { userAgent: "SambanovaBot", allow: "/" },          // SambaNova (enterprise AI platform)
      { userAgent: "LMSYSBot", allow: "/" },              // LMSYS (Chatbot Arena, academic LLM eval)
      { userAgent: "EleutherBot", allow: "/" },           // EleutherAI (open-source LLM research)
      { userAgent: "MosaicBot", allow: "/" },             // MosaicML / Databricks AI (training data)
      { userAgent: "NomicBot", allow: "/" },              // Nomic AI (embedding + atlas mapping)
      { userAgent: "WandBBot", allow: "/" },              // Weights & Biases (MLOps platform)
      { userAgent: "LangChainBot", allow: "/" },          // LangChain (RAG framework, crawls for docs)
      { userAgent: "LlamaIndexBot", allow: "/" },         // LlamaIndex (RAG data framework)
      { userAgent: "AutoGPT-Bot", allow: "/" },           // AutoGPT (autonomous AI agent)
      { userAgent: "AgentGPT-Bot", allow: "/" },          // AgentGPT (web agentic AI)
    ],
    sitemap: [
      "https://www.aversusb.net/api/sitemap",
      "https://www.aversusb.net/api/sitemap?type=blog",
      "https://www.aversusb.net/api/sitemap?type=hubs",
      "https://www.aversusb.net/api/sitemap?type=best",
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
      "https://www.aversusb.net/.well-known/ai.txt",
      "https://www.aversusb.net/feed",
      "https://www.aversusb.net/feed/atom",
      "https://www.aversusb.net/feed/json",
    ],
  };
}
