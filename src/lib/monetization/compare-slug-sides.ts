import { humanizeEntityName } from "@/lib/utils/humanize";

/**
 * Turn a /compare/{slug} into the two names a custom-compare form can prefill.
 * Only the first "-vs-" split is special: "notion-vs-obsidian" → Notion, Obsidian.
 */
export function entitiesFromCompareSlug(slug: string | undefined | null): { a: string; b: string } | null {
  const clean = (slug ?? "").trim().toLowerCase();
  if (!/^[a-z0-9-]+$/.test(clean)) return null;
  const parts = clean.split("-vs-").map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return null;
  return {
    a: humanizeEntityName(parts[0]),
    b: humanizeEntityName(parts.slice(1).join("-")),
  };
}
