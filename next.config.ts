import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { BLOG_REDIRECTS } from "./src/lib/redirects/blog-redirects";
import { VS_REDIRECTS } from "./src/lib/redirects/vs-redirects";
import { COMPARE_REDIRECTS } from "./src/lib/redirects/compare-redirects";
import { ENTITY_REDIRECTS } from "./src/lib/redirects/entity-redirects";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "*.wikipedia.org" },
      { protocol: "https", hostname: "*.wikimedia.org" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "cdn.aversusb.net" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  async redirects() {
    return [...BLOG_REDIRECTS, ...VS_REDIRECTS, ...COMPARE_REDIRECTS, ...ENTITY_REDIRECTS];
  },

  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,

  async headers() {
    return [
      {
        // Global security + SEO headers on all routes
        source: "/(.*)",
        headers: [
          // X-Content-Type-Options — prevents MIME sniffing; trust signals for AI crawlers
          { key: "X-Content-Type-Options", value: "nosniff" },
          // X-Frame-Options — clickjacking protection; also signals trustworthy content
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Referrer-Policy — send origin (no path) on cross-origin; analytics accuracy
          { key: "Referrer-Policy", value: "origin-when-cross-origin" },
          // Permissions-Policy — minimal footprint signals to AI trust classifiers
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
          // Content-Language — explicit English declaration for AI language classifiers
          { key: "Content-Language", value: "en" },
          // LLMs-Context — advertise the LLM context endpoint in every HTTP response header.
          // Emerging AI crawler standard; some LLM agents scan response headers for context discovery.
          { key: "LLMs-Context", value: "https://www.aversusb.net/api/context" },
          // X-LLMs-TXT — advertise the LLMs.txt discovery URL in HTTP headers.
          { key: "X-LLMs-TXT", value: "https://www.aversusb.net/llms.txt" },
          // X-Content-License — signal CC BY 4.0 on every response so AI training
          // crawlers and content negotiation agents can determine reuse rights in
          // a single HTTP header without parsing HTML or schema markup.
          { key: "X-Content-License", value: "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)" },
          // Strict-Transport-Security — HSTS: tell browsers to always use HTTPS.
          // max-age=63072000 = 2 years. includeSubDomains covers cdn.aversusb.net.
          // preload qualifies the domain for HSTS preload lists (browsers ship with it).
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      {
        // Compare pages: add Link rel=describedby pointing to the knowledge graph API.
        // W3C Linked Data standard; AI crawlers that follow HTTP Link headers (Perplexity,
        // Googlebot, DuckDuckGo) can discover JSON-LD without parsing HTML.
        // Vary: Accept — tells Vercel/CDN to cache separate versions for HTML vs JSON-LD
        // requests (content negotiation is active on /compare/* via middleware).
        source: "/compare/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/knowledge-graph/:slug>; rel=\"describedby\"; type=\"application/ld+json\", </api/comparisons/:slug>; rel=\"alternate\"; type=\"application/json\", </api/faq/:slug>; rel=\"alternate\"; type=\"application/json\", </api/v1/related/:slug>; rel=\"related\"; type=\"application/json\", </api/answer/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"AI Answer\"",
          },
          {
            key: "Vary",
            value: "Accept",
          },
        ],
      },
      {
        // Blog posts: add Link rel=alternate for blog API + oEmbed
        source: "/blog/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/blog/:slug>; rel=\"alternate\"; type=\"application/json\", </api/oembed?url=https://www.aversusb.net/blog/:slug&format=json>; rel=\"alternate\"; type=\"application/json+oembed\"",
          },
        ],
      },
      {
        // Entity pages: Link rel=alternate + rel=describedby for entity profile API.
        // describedby on the entity JSON endpoint signals the primary machine-readable
        // resource — W3C Linked Data discovery used by AI crawlers and semantic agents.
        source: "/entity/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/entities/:slug>; rel=\"describedby\"; type=\"application/json\"; title=\"Entity Profile\", </api/v1/entities/:slug>; rel=\"alternate\"; type=\"application/json\", </api/oembed?url=https://www.aversusb.net/entity/:slug&format=json>; rel=\"alternate\"; type=\"application/json+oembed\"",
          },
        ],
      },
      {
        // Alternatives pages: Link rel=alternate for alternatives API + entity profile API.
        // rel=describedby on the entity profile API signals the primary Linked Data
        // resource for this page — AI crawlers (Perplexity, ClaudeBot) resolve the
        // entity identity from the describedby target before extracting page content.
        source: "/alternatives/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/alternatives/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"Alternatives API\", </api/v1/entities/:slug>; rel=\"describedby\"; type=\"application/json\"; title=\"Entity Profile\", </api/v1/entities/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"Entity Profile API\"",
          },
        ],
      },
      {
        // Best-of list pages: Link rel=alternate pointing to structured ItemList JSON API
        source: "/best/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/best/:slug>; rel=\"alternate\"; type=\"application/json\"",
          },
        ],
      },
      {
        // Category pages: Link rel=alternate pointing to the categories API with category filter
        // AI crawlers can navigate from category HTML pages to structured JSON category data.
        source: "/category/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/categories>; rel=\"alternate\"; type=\"application/json\"; title=\"Category Index API\", </api/sitemap?category=:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"Category JSON Sitemap\"",
          },
        ],
      },
      {
        // Search page: Link rel=alternate pointing to unified search API for AI crawlers
        source: "/search",
        headers: [
          {
            key: "Link",
            value: "</api/v1/search>; rel=\"alternate\"; type=\"application/json\"; title=\"Unified Search API\", </opensearch.xml>; rel=\"search\"; type=\"application/opensearchdescription+xml\"; title=\"A Versus B Search\"",
          },
        ],
      },
      {
        // Trending page: Link rel=alternate pointing to trending API
        source: "/trending",
        headers: [
          {
            key: "Link",
            value: "</api/v1/trending>; rel=\"alternate\"; type=\"application/json\"; title=\"Trending Comparisons API\"",
          },
        ],
      },
    ];
  },
};

const sentryEnabled = !!(process.env.SENTRY_ORG && process.env.SENTRY_PROJECT);

export default sentryEnabled
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      silent: !process.env.CI,
      widenClientFileUpload: true,
    })
  : nextConfig;
