import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { withTiming } from "@/lib/utils/api-timing";
import { sanitizeSlug } from "@/lib/utils/sanitize";

export const GET = withTiming(async function GET(
  _request: NextRequest,
  context?: unknown
) {
  const { slug: rawSlug } = await (context as { params: Promise<{ slug: string }> }).params;
  const slug = sanitizeSlug(rawSlug);
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(comparison);
});
