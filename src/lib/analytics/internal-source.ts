/**
 * ROO-453 — internal-link attribution without `?source_page=` in hrefs.
 *
 * Internal compare links used to carry `?source_page=<placement>` so the
 * landing page could attribute `comparison_viewed` and search events. That
 * gave crawlers several URL variants per compare page (ROO-406 indexability
 * check). Links now render a clean href plus `data-source-page`. A single
 * delegated click listener stores the source for the clicked path in
 * sessionStorage, and the landing page reads it back.
 *
 * The URL param still wins when present, so old links, bookmarks and
 * external campaigns keep working.
 */

export const SOURCE_PAGE_ATTR = "data-source-page";
const STORAGE_KEY = "avb_internal_source";
/** A stored source only counts for a landing that happens soon after the click. */
export const INTERNAL_SOURCE_TTL_MS = 30_000;

type StoredSource = { source: string; path: string; at: number };

function storage(): Storage | null {
  try {
    return typeof window !== "undefined" ? window.sessionStorage : null;
  } catch {
    return null;
  }
}

function pathOf(href: string, base?: string): string | null {
  try {
    const origin = base ?? (typeof window !== "undefined" ? window.location.origin : "https://www.aversusb.net");
    const url = new URL(href, origin);
    if (typeof window !== "undefined" && url.origin !== window.location.origin) return null;
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return null;
  }
}

/** Remember that the next landing on `href` came from `source`. */
export function rememberInternalSource(source: string, href: string, now: number = Date.now()): void {
  const trimmed = source.trim();
  const path = pathOf(href);
  const store = storage();
  if (!trimmed || !path || !store) return;
  try {
    const value: StoredSource = { source: trimmed, path, at: now };
    store.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Storage full or blocked: attribution is best-effort.
  }
}

/**
 * Source page for the current landing: `?source_page=` first, else the value
 * stored by the last internal click on this same path within the TTL.
 */
export function landingSourcePage(
  loc?: { pathname: string; search: string },
  now: number = Date.now(),
): string | undefined {
  const location = loc ?? (typeof window !== "undefined" ? window.location : undefined);
  if (!location) return undefined;
  const fromUrl = new URLSearchParams(location.search).get("source_page")?.trim();
  if (fromUrl) return fromUrl;
  const store = storage();
  if (!store) return undefined;
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return undefined;
    const stored = JSON.parse(raw) as Partial<StoredSource>;
    if (typeof stored.source !== "string" || typeof stored.path !== "string" || typeof stored.at !== "number") {
      return undefined;
    }
    const path = location.pathname.replace(/\/+$/, "") || "/";
    if (stored.path !== path) return undefined;
    if (now - stored.at > INTERNAL_SOURCE_TTL_MS || now < stored.at) return undefined;
    return stored.source;
  } catch {
    return undefined;
  }
}

let installed = false;

/** One capture-phase listener for every `<a data-source-page>` on the site. */
export function installInternalSourceTracking(doc: Document | undefined = typeof document !== "undefined" ? document : undefined): void {
  if (!doc || installed) return;
  installed = true;
  doc.addEventListener(
    "click",
    (event) => {
      const target = event.target as Element | null;
      const anchor = target?.closest?.(`a[${SOURCE_PAGE_ATTR}]`) as HTMLAnchorElement | null;
      if (!anchor) return;
      const source = anchor.getAttribute(SOURCE_PAGE_ATTR);
      const href = anchor.getAttribute("href");
      if (source && href) rememberInternalSource(source, href);
    },
    { capture: true },
  );
}

export function resetInternalSourceTrackingForTests(): void {
  installed = false;
}
