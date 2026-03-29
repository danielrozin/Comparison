import { NextRequest, NextResponse } from "next/server";
import { getApiKeyUsageStats, getApiKeysByEmail } from "@/lib/services/api-key-service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// GET /api/v1/keys/usage?email=...&keyId=...&days=30
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  const keyId = request.nextUrl.searchParams.get("keyId");
  const days = parseInt(request.nextUrl.searchParams.get("days") || "30", 10);

  if (!email || !keyId) {
    return NextResponse.json(
      { error: "email and keyId query parameters are required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    // Verify ownership
    const keys = await getApiKeysByEmail(email);
    const key = keys.find((k) => k.id === keyId);

    if (!key) {
      return NextResponse.json(
        { error: "Key not found or not owned by this email" },
        { status: 404, headers: corsHeaders }
      );
    }

    const stats = await getApiKeyUsageStats(keyId, days);

    return NextResponse.json(
      {
        key: {
          id: key.id,
          prefix: key.keyPrefix,
          name: key.name,
          tier: key.tier,
          requestsToday: key.requestsToday,
          requestsTotal: key.requestsTotal,
          dailyLimit: key.dailyLimit,
        },
        usage: stats,
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("Usage stats error:", error);
    return NextResponse.json(
      { error: "Failed to get usage stats" },
      { status: 500, headers: corsHeaders }
    );
  }
}
