import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { BLOG_REDIRECTS } from "./src/lib/redirects/blog-redirects";
import { VS_REDIRECTS } from "./src/lib/redirects/vs-redirects";
import { COMPARE_REDIRECTS } from "./src/lib/redirects/compare-redirects";

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
    return [...BLOG_REDIRECTS, ...VS_REDIRECTS, ...COMPARE_REDIRECTS];
  },

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
        source: "/compare/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/knowledge-graph/:slug>; rel=\"describedby\"; type=\"application/ld+json\", </api/comparisons/:slug>; rel=\"alternate\"; type=\"application/json\", </api/faq/:slug>; rel=\"alternate\"; type=\"application/json\", </api/v1/related/:slug>; rel=\"related\"; type=\"application/json\", </api/answer/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"AI Answer\"",
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
        // Entity pages: add Link rel=alternate pointing to entity profile API
        source: "/entity/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/entities/:slug>; rel=\"alternate\"; type=\"application/json\", </api/oembed?url=https://www.aversusb.net/entity/:slug&format=json>; rel=\"alternate\"; type=\"application/json+oembed\"",
          },
        ],
      },
      {
        // Alternatives pages: add Link rel=alternate for alternatives API + entity profile API
        source: "/alternatives/:slug",
        headers: [
          {
            key: "Link",
            value: "</api/v1/alternatives/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"Alternatives API\", </api/v1/entities/:slug>; rel=\"alternate\"; type=\"application/json\"; title=\"Entity Profile API\"",
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
