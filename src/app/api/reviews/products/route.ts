import { NextRequest, NextResponse } from "next/server";
import { getAllMockSlugs, getMockComparison } from "@/lib/services/mock-data";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.toLowerCase().trim();
  if (!query || query.length < 2) {
    return NextResponse.json({ products: [] });
  }

  // Build a unique set of entity names/slugs from comparisons
  const seen = new Set<string>();
  const products: { slug: string; name: string }[] = [];

  const allSlugs = getAllMockSlugs();
  for (const compSlug of allSlugs) {
    const comp = getMockComparison(compSlug);
    if (!comp) continue;
    for (const entity of comp.entities) {
      if (!seen.has(entity.slug) && entity.name.toLowerCase().includes(query)) {
        seen.add(entity.slug);
        products.push({ slug: entity.slug, name: entity.name });
      }
    }
    if (products.length >= 10) break;
  }

  return NextResponse.json({ products });
}
