import { NextRequest, NextResponse } from "next/server";
import { createApiKey, getApiKeysByEmail, revokeApiKey, API_TIERS } from "@/lib/services/api-key-service";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-API-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

// POST /api/v1/keys — Generate a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email || !name) {
      return NextResponse.json(
        { error: "email and name are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400, headers: corsHeaders }
      );
    }

    const result = await createApiKey({ email, name, tier: "free" });

    return NextResponse.json(
      {
        message: "API key created successfully. Store this key securely — it won't be shown again.",
        apiKey: result.rawKey,
        keyId: result.apiKey.id,
        prefix: result.apiKey.keyPrefix,
        tier: result.apiKey.tier,
        limits: API_TIERS.free,
      },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("API key creation error:", error);
    return NextResponse.json(
      { error: "Failed to create API key" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// GET /api/v1/keys?email=... — List keys for an email
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "email query parameter is required" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const keys = await getApiKeysByEmail(email);
    return NextResponse.json({ keys }, { headers: corsHeaders });
  } catch (error) {
    console.error("API key list error:", error);
    return NextResponse.json(
      { error: "Failed to list API keys" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE /api/v1/keys — Revoke an API key
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyId, email } = body;

    if (!keyId || !email) {
      return NextResponse.json(
        { error: "keyId and email are required" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify ownership by email before revoking
    const keys = await getApiKeysByEmail(email);
    const ownsKey = keys.some((k) => k.id === keyId);

    if (!ownsKey) {
      return NextResponse.json(
        { error: "Key not found or not owned by this email" },
        { status: 404, headers: corsHeaders }
      );
    }

    await revokeApiKey(keyId);

    return NextResponse.json(
      { message: "API key revoked successfully" },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("API key revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke API key" },
      { status: 500, headers: corsHeaders }
    );
  }
}
