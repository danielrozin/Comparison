/**
 * Turn Tavily hits into the citation list the promotion gate counts.
 *
 * A source is one website, not one search result. `www.rei.com/a` and
 * `rei.com/b` are the same source. Results with no usable URL are dropped
 * instead of being collapsed into a single "web source" row.
 */

export interface CitationSource {
  name: string;
  url?: string;
}

export function citationSourcesFromResults(
  results: { url?: string; title?: string }[],
): CitationSource[] {
  const mapped: CitationSource[] = [];
  for (const result of results) {
    const url = result.url?.trim();
    if (!url) continue;
    try {
      mapped.push({
        name: new URL(url).hostname.replace(/^www\./, ""),
        url,
      });
    } catch {
      const name = result.title?.trim();
      if (name) mapped.push({ name, url });
    }
  }
  return distinctSources(mapped);
}

/** Distinct websites already stored on a comparison. */
export function distinctSources(sources: CitationSource[]): CitationSource[] {
  const seen = new Set<string>();
  const unique: CitationSource[] = [];
  for (const source of sources) {
    const key = sourceKey(source);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    unique.push(source);
  }
  return unique;
}

function sourceKey(source: CitationSource): string | null {
  const url = source.url?.trim();
  if (url) {
    try {
      return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    } catch {
      return url.toLowerCase();
    }
  }
  const name = source.name?.trim().toLowerCase();
  return name || null;
}
