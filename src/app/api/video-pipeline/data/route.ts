import { NextRequest, NextResponse } from "next/server";
import { getMockComparison } from "@/lib/services/mock-data";

/**
 * GET /api/video-pipeline/data?slug=<slug>
 *
 * Returns one comparison in the flat shape the video pipeline renders from.
 *
 * Exists because the pipeline previously read `remotion/data/<slug>.json` and
 * nothing else: only 64 of the 141 slugs that /slugs advertises had such a
 * file, so 55% of the catalogue failed with "No comparison data" the moment
 * the pipeline reached them. Serving the same source /slugs is derived from
 * keeps the two endpoints from disagreeing about what exists.
 *
 * Public, same as /slugs — it returns nothing that is not already on the
 * public comparison page.
 */
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const comparison = getMockComparison(slug);
    if (!comparison) {
      return NextResponse.json({ error: `No comparison for "${slug}"` }, { status: 404 });
    }

    const [a, b] = comparison.entities ?? [];
    if (!a || !b) {
      return NextResponse.json(
        { error: `"${slug}" does not have two entities` },
        { status: 422 }
      );
    }

    // Flattened to match remotion/data/<slug>.json so the pipeline treats a
    // fetched comparison and a local fixture identically.
    const stats = (comparison.keyDifferences ?? []).map((d) => ({
      label: d.label,
      valueA: d.entityAValue,
      valueB: d.entityBValue,
      winner: d.winner ?? null,
    }));

    return NextResponse.json(
      {
        slug: comparison.slug,
        title: comparison.title,
        entityA: a.name,
        entityB: b.name,
        category: comparison.category ?? "",
        shortAnswer: comparison.shortAnswer ?? "",
        verdict: comparison.verdict ?? "",
        keyDifferences: comparison.keyDifferences ?? [],
        stats,
        prosA: a.pros ?? [],
        consA: a.cons ?? [],
        prosB: b.pros ?? [],
        consB: b.cons ?? [],
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("[video-pipeline/data] Error:", error);
    return NextResponse.json({ error: "Failed to load comparison" }, { status: 500 });
  }
}
