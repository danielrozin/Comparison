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

  // For non-API routes, set geo cookie for consent banner EU detection
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
    return response;
  }

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
          },
        }
      );
    }

    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", String(limit.maxRequests));
    response.headers.set("X-RateLimit-Remaining", String(result.remaining));
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
