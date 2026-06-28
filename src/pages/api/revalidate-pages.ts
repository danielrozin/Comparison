import type { NextApiRequest, NextApiResponse } from "next";

/**
 * On-demand ISR revalidation for **Pages Router** routes (DAN-1201).
 *
 * WHY a second endpoint: `/compare/[slug]` was moved to the Pages Router
 * (DAN-432 Phase C). The App Router `/api/revalidate` route uses
 * `revalidatePath()` from `next/cache`, which does NOT invalidate Pages
 * Router ISR pages — so freshly generated comparisons stayed frozen as the
 * client-only `<DynamicComparison>` shell until their natural 3600s window
 * expired (thin SSR + $0 monetization for crawlers). Pages Router on-demand
 * ISR requires `res.revalidate(urlPath)`, which this route provides.
 *
 * App Router paths (e.g. "/") should still go through `/api/revalidate`.
 *
 * POST /api/revalidate-pages
 * Body: { paths: string[], secret?: string }
 * Security: requires REVALIDATION_SECRET in production (same as /api/revalidate).
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { paths, secret } = (req.body ?? {}) as {
    paths?: string[];
    secret?: string;
  };

  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (expectedSecret && secret !== expectedSecret) {
    return res.status(401).json({ error: "Invalid secret" });
  }

  if (!paths || !Array.isArray(paths) || paths.length === 0) {
    return res.status(400).json({ error: "paths array required" });
  }

  // Only Pages Router page patterns are valid here (compare pages live here).
  const isAllowed = (path: string) =>
    path.startsWith("/compare/") ||
    path.startsWith("/category/") ||
    path.startsWith("/entity/") ||
    path.startsWith("/alternatives/");

  const revalidated: string[] = [];
  const failed: string[] = [];

  for (const path of paths.slice(0, 50)) {
    if (!isAllowed(path)) continue;
    try {
      await res.revalidate(path);
      revalidated.push(path);
    } catch (err) {
      console.warn(
        `[revalidate-pages] failed for ${path}:`,
        err instanceof Error ? err.message : err
      );
      failed.push(path);
    }
  }

  return res.status(200).json({
    revalidated,
    failed,
    count: revalidated.length,
    timestamp: new Date().toISOString(),
  });
}
