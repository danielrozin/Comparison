import { NextRequest, NextResponse } from "next/server";
import { submitCustomCompare } from "@/lib/monetization/custom-compare";

/**
 * POST /api/custom-compare
 *
 * Body: { entityA, entityB, email, note? }
 *
 * Members (Redis monetization:member:{email}, active) are queued.
 * Everyone else gets upgradeUrl `/pricing?src=custom-compare` — never an
 * empty 200 or a swallowed error.
 */
export async function POST(request: NextRequest) {
  let body: { entityA?: string; entityB?: string; email?: string; note?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid", error: "Invalid request body" },
      { status: 400 }
    );
  }

  const result = await submitCustomCompare({
    entityA: body.entityA ?? "",
    entityB: body.entityB ?? "",
    email: body.email ?? "",
    note: body.note,
  });

  return NextResponse.json(result, { status: result.status });
}
