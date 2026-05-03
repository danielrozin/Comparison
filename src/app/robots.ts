import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/_next/", "/embed/"],
      },
      {
        userAgent: "GPTBot",
        allow: "/",
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
      },
      {
        userAgent: "Anthropic-AI",
        allow: "/",
      },
      {
        userAgent: "Google-Extended",
        allow: "/",
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
      },
      {
        userAgent: "Bytespider",
        allow: "/",
      },
      {
        userAgent: "CCBot",
        allow: "/",
      },
      {
        userAgent: "cohere-ai",
        allow: "/",
      },
      {
        userAgent: "CopilotBot",
        allow: "/",
      },
      {
        userAgent: "Microsoft-AI",
        allow: "/",
      },
      {
        userAgent: "YouBot",
        allow: "/",
      },
    ],
    // List both the index and every shard. The index alone is enough for
    // well-behaved crawlers, but advertising the shards is a fallback in case
    // the index handler ever regresses (see DAN-382).
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
