import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { getLinkedComparisons } from "@/lib/services/internal-linking-engine";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const limit = Number(request.nextUrl.searchParams.get("limit")) || 12;

  const comparison = await getComparisonBySlug(slug);
  if (!comparison) {
    return NextResponse.json({ error: "Comparison not found" }, { status: 404 });
  }

  const links = await getLinkedComparisons(
    {
      comparisonId: comparison.id,
      slug: comparison.slug,
      category: comparison.category,
      entitySlugs: comparison.entities.map((e) => e.slug),
    },
    Math.min(limit, 30)
  );

  return NextResponse.json({ links });
}
