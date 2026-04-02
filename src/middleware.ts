import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// In-memory sliding-window rate limiter (Edge Runtime compatible)
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60_000;

function cleanupStaleEntries() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;
  for (const [key, entry] of rateLimitMap) {
    if (now > entry.resetAt) rateLimitMap.delete(key);
  }
}

function checkRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; retryAfter?: number } {
  cleanupStaleEntries();
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  entry.count++;
  if (entry.count > maxRequests) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, remaining: maxRequests - entry.count };
}

// ---------------------------------------------------------------------------
// Route → rate-limit tier mapping
// ---------------------------------------------------------------------------
type RateTier = { limit: number; windowMs: number; tier: string };

function getRouteTier(pathname: string): RateTier | null {
  // Generation / expensive endpoints — strict
  if (
    pathname.includes("/generate") ||
    pathname === "/api/enrich" ||
    pathname === "/api/pipeline/run"
  ) {
    return { tier: "generate", limit: 5, windowMs: 60_000 };
  }

  // Cron routes — auth-protected, moderate limit
  if (pathname.startsWith("/api/cron/")) {
    return { tier: "cron", limit: 30, windowMs: 60_000 };
  }

  // Admin routes
  if (pathname.startsWith("/api/admin")) {
    return { tier: "admin", limit: 20, windowMs: 60_000 };
  }

  // Write / mutation endpoints
  if (
    pathname === "/api/newsletter" ||
    pathname === "/api/newsletter/confirm" ||
    pathname === "/api/newsletter/unsubscribe" ||
    pathname === "/api/feedback" ||
    pathname === "/api/comments" ||
    pathname === "/api/reviews" ||
    pathname === "/api/comparisons/like" ||
    pathname === "/api/comparisons/poll" ||
    pathname === "/api/surveys/intercept" ||
    pathname === "/api/surveys/smartreview" ||
    pathname === "/api/affiliate/click"
  ) {
    return { tier: "write", limit: 10, windowMs: 60_000 };
  }

  // Public v1 API — handled by its own API-key rate limiter in api-middleware
  if (pathname.startsWith("/api/v1/")) {
    return null;
  }

  // All other /api/ routes — read tier
  if (pathname.startsWith("/api/")) {
    return { tier: "read", limit: 60, windowMs: 60_000 };
  }

  return null;
}

// ---------------------------------------------------------------------------
// CORS
// ---------------------------------------------------------------------------
const ALLOWED_ORIGINS = [
  "https://www.aversusb.net",
  "https://aversusb.net",
];

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // same-origin (no Origin header)
  if (process.env.NODE_ENV !== "production") return true;
  return ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.endsWith(".aversusb.net")
  );
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  const origin = request.headers.get("origin");
  const isV1 = pathname.startsWith("/api/v1/");

  // --- CORS preflight ---
  if (request.method === "OPTIONS") {
    const effectiveOrigin = isV1
      ? "*"
      : isAllowedOrigin(origin)
        ? origin || ALLOWED_ORIGINS[0]
        : ALLOWED_ORIGINS[0];

    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": effectiveOrigin,
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-API-Key",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // --- CORS enforcement (non-v1 routes in production) ---
  if (
    !isV1 &&
    process.env.NODE_ENV === "production" &&
    !isAllowedOrigin(origin)
  ) {
    return NextResponse.json(
      { error: "Origin not allowed" },
      { status: 403 }
    );
  }

  // --- Rate limiting ---
  const tier = getRouteTier(pathname);
  if (tier) {
    const ip = getClientIp(request);
    const key = `${ip}:${tier.tier}`;
    const result = checkRateLimit(key, tier.limit, tier.windowMs);

    if (!result.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(result.retryAfter || 60),
            "X-RateLimit-Limit": String(tier.limit),
            "X-RateLimit-Remaining": "0",
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(tier.limit));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));

    // CORS response headers
    if (isV1) {
      response.headers.set("Access-Control-Allow-Origin", "*");
    } else if (origin && isAllowedOrigin(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin);
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"],
};
