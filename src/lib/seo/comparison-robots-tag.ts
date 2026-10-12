/** Provisional pages are public but must not be indexed. Published pages stay open. */
export function comparisonRobotsTag(
  status: string | null | undefined,
): "noindex, nofollow" | "all" {
  return status === "provisional" ? "noindex, nofollow" : "all";
}
