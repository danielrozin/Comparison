import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import { latestEditorialCompares, type EditorialCompareCard } from "./listing";

/** ROO-453 — newest editorial compares that pass the live-slug link gate. */
export async function liveLatestEditorialCompares(limit: number): Promise<EditorialCompareCard[]> {
  const candidates = latestEditorialCompares(limit * 2);
  try {
    const live = new Set(await filterLiveCompareSlugs(candidates.map((c) => c.slug)));
    return candidates.filter((c) => live.has(c.slug)).slice(0, limit);
  } catch {
    return candidates.slice(0, limit);
  }
}
