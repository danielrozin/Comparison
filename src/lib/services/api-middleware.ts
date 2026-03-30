import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit, incrementUsage, ApiTier } from "./api-key-service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key, Authorization",
};

export type AuthenticatedRequest = {
  apiKeyId: string;
  tier: ApiTier;
  remaining: number;
  limit: number;
};

function extractApiKey(request: NextRequest): string | null {
  // Check X-API-Key header first
  const headerKey = request.headers.get("x-api-key");
  if (headerKey) return headerKey;

  // Check Authorization: Bearer <key>
  const auth = request.headers.get("authorization");
  if (auth?.startsWith("Bearer ")) return auth.slice(7);

  // Check query param
  return request.nextUrl.searchParams.get("api_key");
}

export async function withApiKey(
  request: NextRequest,
  handler: (req: NextRequest, auth: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const startTime = Date.now();
  const rawKey = extractApiKey(request);

  if (!rawKey) {
    return NextResponse.json(
      {
        error: "API key required",
        message: "Include your API key via X-API-Key header, Authorization: Bearer <key>, or ?api_key= query param.",
        docs: "https://www.aversusb.net/developers",
      },
      { status: 401, headers: corsHeaders }
    );
  }

  const rateCheck = await checkRateLimit(rawKey);

  if (!rateCheck.allowed) {
    const statusCode = rateCheck.error?.includes("rate limit") ? 429 : 401;

    if (rateCheck.apiKeyId) {
      incrementUsage(
        rateCheck.apiKeyId,
        request.nextUrl.pathname,
        statusCode,
        Date.now() - startTime,
        request.headers.get("x-forwarded-for") || undefined,
        request.headers.get("user-agent") || undefined
      ).catch(() => {});
    }

    return NextResponse.json(
      { error: rateCheck.error },
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          ...(rateCheck.limit !== undefined && {
            "X-RateLimit-Limit": String(rateCheck.limit),
            "X-RateLimit-Remaining": "0",
          }),
        },
      }
    );
  }

  const auth: AuthenticatedRequest = {
    apiKeyId: rateCheck.apiKeyId!,
    tier: rateCheck.tier!,
    remaining: rateCheck.remaining!,
    limit: rateCheck.limit!,
  };

  const response = await handler(request, auth);

  // Add rate limit headers
  const headers = new Headers(response.headers);
  if (auth.limit !== -1) {
    headers.set("X-RateLimit-Limit", String(auth.limit));
    headers.set("X-RateLimit-Remaining", String(Math.max(0, auth.remaining - 1)));
  }
  Object.entries(corsHeaders).forEach(([k, v]) => headers.set(k, v));

  // Log usage (fire and forget)
  incrementUsage(
    auth.apiKeyId,
    request.nextUrl.pathname,
    response.status,
    Date.now() - startTime,
    request.headers.get("x-forwarded-for") || undefined,
    request.headers.get("user-agent") || undefined
  ).catch(() => {});

  return new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
