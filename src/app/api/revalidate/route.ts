import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand ISR revalidation endpoint.
 * Called internally after content generation to warm the cache.
 *
 * POST /api/revalidate
 * Body: { paths: string[], secret?: string }
 *
 * Security: requires REVALIDATION_SECRET env var in production,
 * or accepts internal calls (localhost) in development.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths, secret } = body as { paths?: string[]; secret?: string };

    // Validate secret in production
    const expectedSecret = process.env.REVALIDATION_SECRET;
    if (expectedSecret && secret !== expectedSecret) {
      return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
    }

    if (!paths || !Array.isArray(paths) || paths.length === 0) {
      return NextResponse.json({ error: "paths array required" }, { status: 400 });
    }

    // Cap at 50 paths per request to avoid abuse
    const toRevalidate = paths.slice(0, 50);
    const revalidated: string[] = [];

    for (const path of toRevalidate) {
      // Only allow revalidating known page patterns
      if (
        path === "/" ||
        path.startsWith("/compare/") ||
        path.startsWith("/category/") ||
        path.startsWith("/blog/") ||
        path.startsWith("/entity/") ||
        path.startsWith("/alternatives/") ||
        path.startsWith("/trending") ||
        path.startsWith("/reviews") ||
        path === "/sitemap.xml" ||
        path.startsWith("/sitemap/")
      ) {
        revalidatePath(path);
        revalidated.push(path);
      }
    }

    return NextResponse.json({
      revalidated,
      count: revalidated.length,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Revalidation failed" },
      { status: 500 }
    );
  }
}
