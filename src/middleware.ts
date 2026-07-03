import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per-instance; works on Edge Runtime)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const RATE_LIMITS: Record<string, { windowMs: number; maxRequests: number }> = {
  "/api/v1/": { windowMs: 60_000, maxRequests: 60 },
  "/api/comparisons/generate": { windowMs: 60_000, maxRequests: 5 },
  "/api/comments": { windowMs: 60_000, maxRequests: 10 },
  "/api/feedback": { windowMs: 60_000, maxRequests: 5 },
  "/api/consent": { windowMs: 60_000, maxRequests: 5 },
  "/api/admin": { windowMs: 60_000, maxRequests: 10 },
};

// EU/EEA country codes for GDPR consent defaults
const EU_COUNTRIES = new Set([
  "AT","BE","BG","HR","CY","CZ","DK","EE","FI","FR",
  "DE","GR","HU","IE","IT","LV","LT","LU","MT","NL",
  "PL","PT","RO","SK","SI","ES","SE",
  "IS","LI","NO", // EEA
  "GB", // UK GDPR
]);

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function getRateLimit(pathname: string): { windowMs: number; maxRequests: number } | null {
  for (const [prefix, config] of Object.entries(RATE_LIMITS)) {
    if (pathname.startsWith(prefix)) return config;
  }
  return null;
}

function checkRateLimit(key: string, windowMs: number, maxRequests: number): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
}

// Clean up stale entries periodically (every 5 minutes)
let lastCleanup = Date.now();
function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < 300_000) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Content-serving API endpoints that AI crawlers and indexers should be allowed to index.
  // These endpoints serve structured data (JSON-LD, JSON) referenced from HTML pages and llms.txt.
  const CONTENT_API_PATHS = [
    "/api/knowledge-graph/",
    "/api/comparisons/",
    "/api/faq/",
    "/api/blog",
    "/api/openapi",
    "/api/sitemap",
    "/api/answer/",
    "/api/context",
    "/api/llms",
    "/api/llms-full",
    "/api/oembed",
    "/api/og",
    "/api/v1/",
    "/.well-known/",
  ];
  const isContentApi = CONTENT_API_PATHS.some((p) => pathname === p || pathname.startsWith(p));

  // HTTP content negotiation — Linked Data clients that send Accept: application/ld+json
  // (e.g. Semantic Web tools, some AI crawlers) should receive the JSON-LD graph directly
  // rather than the HTML page. Redirect to the spec-compliant describedby endpoint per
  // RFC 7231 §6.4.4 (303 See Other).
  // /compare/{slug} → /api/v1/schema/{slug} (spec-compliant @graph, Content-Type: application/ld+json)
  // /entity/{slug} → /api/v1/entities/{slug} (handles Accept: application/ld+json internally)
  // /blog/{slug} → /api/blog/{slug} (Article JSON-LD)
  if (!pathname.startsWith("/api/")) {
    const accept = request.headers.get("accept") ?? "";
    const primaryAccept = accept.split(",")[0]?.trim().split(";")[0]?.trim() ?? "";
    if (primaryAccept === "application/ld+json") {
      const SITE = "https://www.aversusb.net";
      if (pathname.startsWith("/compare/")) {
        const slug = pathname.replace("/compare/", "").replace(/\/$/, "");
        if (slug) {
          return NextResponse.redirect(`${SITE}/api/v1/schema/${slug}`, { status: 303 });
        }
      } else if (pathname.startsWith("/entity/")) {
        const slug = pathname.replace("/entity/", "").replace(/\/$/, "");
        if (slug) {
          return NextResponse.redirect(`${SITE}/api/v1/entities/${slug}`, { status: 303 });
        }
      } else if (pathname.startsWith("/blog/")) {
        const slug = pathname.replace("/blog/", "").replace(/\/$/, "");
        if (slug) {
          return NextResponse.redirect(`${SITE}/api/blog/${slug}`, { status: 303 });
        }
      }
    }
  }

  // For non-API routes, set geo cookie + security headers
  if (!pathname.startsWith("/api/")) {
    const response = NextResponse.next();
    const country = request.headers.get("x-vercel-ip-country") || "";
    const isEU = EU_COUNTRIES.has(country);
    response.cookies.set("consent_region", isEU ? "eu" : "other", {
      path: "/",
      maxAge: 86400,
      sameSite: "lax",
      httpOnly: false,
    });
    // Security + SEO headers — E-E-A-T trust signals and browser safety.
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "origin-when-cross-origin");
    response.headers.set("X-DNS-Prefetch-Control", "on");
    // Content-Language — explicit English declaration for AI language classifiers
    // and international search engines (Bing, Yandex, Baidu).
    response.headers.set("Content-Language", "en");
    // X-Pingback — machine-readable pingback discovery for WordPress/Ghost CMS platforms.
    // When they link to aversusb.net they auto-POST to this endpoint; accelerates
    // backlink discovery before Googlebot crawls the referring page.
    if (
      pathname.startsWith("/compare/") ||
      pathname.startsWith("/blog/") ||
      pathname.startsWith("/entity/") ||
      pathname.startsWith("/hub/") ||
      pathname.startsWith("/alternatives/") ||
      pathname.startsWith("/best/")
    ) {
      response.headers.set("X-Pingback", "https://www.aversusb.net/api/pingback");
    }

    const SITE = "https://www.aversusb.net";

    // Link: HTTP headers — AI crawlers and semantic web agents use these to discover
    // structured-data alternatives without parsing HTML. Having JSON-LD reachable via
    // Link header is the fastest path for LLM crawlers (Perplexity, ChatGPT-User,
    // ClaudeBot) to find citation-ready data in a single HEAD request.
    if (pathname.startsWith("/compare/")) {
      const slug = pathname.replace("/compare/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/schema/${slug}>; rel="describedby"; type="application/ld+json"; title="Schema.org JSON-LD"`,
            `<${SITE}/api/v1/schema/${slug}>; rel="alternate"; type="application/ld+json"; title="Schema.org JSON-LD"`,
            `<${SITE}/api/knowledge-graph/${slug}>; rel="alternate"; type="application/ld+json"; title="Knowledge Graph"`,
            `<${SITE}/api/comparisons/${slug}>; rel="alternate"; type="application/json"; title="Comparison JSON"`,
            `<${SITE}/api/answer/${slug}>; rel="alternate"; type="application/json"; title="AI Answer"`,
            `<${SITE}/api/faq/${slug}>; rel="alternate"; type="application/json"; title="FAQ Pairs"`,
            `<${SITE}/compare/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/blog/")) {
      const slug = pathname.replace("/blog/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/blog/${slug}>; rel="describedby"; type="application/ld+json"; title="Article JSON-LD"`,
            `<${SITE}/api/blog/${slug}>; rel="alternate"; type="application/json"; title="Article JSON"`,
            `<${SITE}/blog/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/entity/")) {
      const slug = pathname.replace("/entity/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/entities/${slug}>; rel="describedby"; type="application/ld+json"; title="Entity Profile JSON-LD"`,
            `<${SITE}/api/v1/entities/${slug}>; rel="alternate"; type="application/json"; title="Entity Profile JSON"`,
            `<${SITE}/entity/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/category/")) {
      // Strip trailing slash and extract category (and optional subcategory)
      const catPath = pathname.replace(/\/$/, "").replace("/category/", "");
      const slug = catPath.split("/")[0];
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/comparisons?category=${slug}&limit=100>; rel="describedby"; type="application/json"; title="Category Comparisons JSON"`,
            `<${SITE}/category/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/alternatives/")) {
      const slug = pathname.replace("/alternatives/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/alternatives/${slug}>; rel="describedby"; type="application/json"; title="Alternatives JSON"`,
            `<${SITE}/api/v1/alternatives/${slug}>; rel="alternate"; type="application/json"; title="Alternatives JSON"`,
            `<${SITE}/alternatives/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/best/")) {
      const slug = pathname.replace("/best/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/best/${slug}>; rel="describedby"; type="application/json"; title="Best-of Guide JSON"`,
            `<${SITE}/api/v1/best/${slug}>; rel="alternate"; type="application/json"; title="Best-of Guide JSON"`,
            `<${SITE}/best/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    } else if (pathname.startsWith("/hub/")) {
      const slug = pathname.replace("/hub/", "").replace(/\/$/, "");
      if (slug) {
        response.headers.set(
          "Link",
          [
            `<${SITE}/api/v1/hub/${slug}>; rel="describedby"; type="application/json"; title="Hub JSON"`,
            `<${SITE}/api/v1/hub/${slug}>; rel="alternate"; type="application/json"; title="Hub JSON"`,
            `<${SITE}/hub/${slug}>; rel="cite-as"`,
          ].join(", ")
        );
      }
    }

    return response;
  }

  // API routes: set X-Robots-Tag based on whether it's a content endpoint
  const apiResponse = NextResponse.next();
  // Content-serving endpoints: allow AI crawlers and indexers
  // Operational endpoints: noindex to save crawl budget on JSON that robots.txt already blocks
  apiResponse.headers.set("X-Robots-Tag", isContentApi ? "all" : "noindex");

  // Rate limiting
  const limit = getRateLimit(pathname);
  if (limit) {
    cleanupStaleEntries();
    const ip = getClientIp(request);
    const key = `${ip}:${pathname}`;
    const result = checkRateLimit(key, limit.windowMs, limit.maxRequests);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((result.resetAt - Date.now()) / 1000)),
            "X-RateLimit-Limit": String(limit.maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-Robots-Tag": "noindex",
          },
        }
      );
    }

    apiResponse.headers.set("X-RateLimit-Limit", String(limit.maxRequests));
    apiResponse.headers.set("X-RateLimit-Remaining", String(result.remaining));
    return apiResponse;
  }

  return apiResponse;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
