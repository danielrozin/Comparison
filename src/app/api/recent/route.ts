import { NextRequest, NextResponse } from "next/server";
import { classifyComparison } from "@/lib/services/categorizer";
import { logAdminEvent } from "@/lib/services/admin-logger";

export interface RecentSearch {
  slug: string;
  title: string;
  entityA: string;
  entityB: string;
  category: string;
  subcategory: string;
  tags: string[];
  searchedAt: string;
  generated: boolean;
}

// In-memory store — persists across requests on the same serverless instance
// In production, use a database
const recentSearches: RecentSearch[] = [];
const MAX_RECENT = 100;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, title, entityA, entityB, generated } = body;

    if (!slug || !entityA || !entityB) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const classification = classifyComparison(entityA, entityB);

    const entry: RecentSearch = {
      slug,
      title: title || `${entityA} vs ${entityB}`,
      entityA,
      entityB,
      category: classification.category,
      subcategory: classification.subcategory,
      tags: classification.tags,
      searchedAt: new Date().toISOString(),
      generated: generated || false,
    };

    // Add to front, deduplicate by slug
    const existingIdx = recentSearches.findIndex((s) => s.slug === slug);
    if (existingIdx !== -1) recentSearches.splice(existingIdx, 1);
    recentSearches.unshift(entry);

    // Keep max
    if (recentSearches.length > MAX_RECENT) recentSearches.pop();

    // Log to admin panel
    logAdminEvent(generated ? "generation" : "search", {
      slug,
      title: entry.title,
      category: classification.category,
      subcategory: classification.subcategory,
      tags: classification.tags,
    });

    return NextResponse.json({ success: true, classification });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    count: recentSearches.length,
    searches: recentSearches.slice(0, 20),
  });
}
