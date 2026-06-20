import { SITE_URL } from "@/lib/utils/constants";

/**
 * IndexNow integration — instantly notify participating search engines
 * (Bing, Yandex, Naver, Seznam, and Google's IndexNow trials) of new or
 * updated URLs so they crawl them in minutes instead of days.
 *
 * IndexNow keys are PUBLIC by design — the key is served openly at
 * `/{key}.txt` so engines can verify ownership. There is no secret here.
 * The matching file lives at `public/${INDEXNOW_KEY}.txt`.
 *
 * Docs: https://www.indexnow.org/documentation
 */
export const INDEXNOW_KEY = "c774592d395cb18932c0cf35c828e1a6";

const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Per-request URL cap enforced by the IndexNow protocol.
const MAX_URLS_PER_REQUEST = 10000;

function getHost(): string {
  try {
    return new URL(SITE_URL).host;
  } catch {
    return "www.aversusb.net";
  }
}

/**
 * Whether IndexNow submissions should actually fire. We only ping for the
 * real production host so local dev and Vercel preview deploys don't submit
 * URLs that engines can't resolve back to the key file.
 */
function isEnabled(): boolean {
  if (process.env.INDEXNOW_DISABLED === "true") return false;
  const host = getHost();
  return host === "www.aversusb.net" || host === "aversusb.net";
}

/**
 * Submit one or more absolute URLs (or site-root-relative paths) to IndexNow.
 * Fire-and-forget safe: never throws, returns a result summary for callers
 * that want to log it. Relative paths are resolved against SITE_URL.
 */
export async function submitToIndexNow(
  urls: string[]
): Promise<{ submitted: number; ok: boolean; status?: number; skipped?: string }> {
  if (!isEnabled()) {
    return { submitted: 0, ok: false, skipped: "disabled-or-non-prod" };
  }

  const host = getHost();
  const normalized = Array.from(
    new Set(
      urls
        .filter((u) => typeof u === "string" && u.length > 0)
        .map((u) => (u.startsWith("http") ? u : `${SITE_URL}${u.startsWith("/") ? "" : "/"}${u}`))
        // Only submit URLs that belong to our verified host.
        .filter((u) => {
          try {
            return new URL(u).host === host;
          } catch {
            return false;
          }
        })
    )
  ).slice(0, MAX_URLS_PER_REQUEST);

  if (normalized.length === 0) {
    return { submitted: 0, ok: false, skipped: "no-valid-urls" };
  }

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: normalized,
      }),
    });
    // 200 = accepted, 202 = accepted (pending verification). Both are success.
    const ok = res.status === 200 || res.status === 202;
    if (!ok) {
      console.warn(`IndexNow submission returned HTTP ${res.status} for ${normalized.length} URLs`);
    }
    return { submitted: normalized.length, ok, status: res.status };
  } catch (e) {
    console.warn("IndexNow submission failed:", e);
    return { submitted: 0, ok: false };
  }
}

/**
 * Convenience helper for a single comparison slug.
 */
export function submitComparisonToIndexNow(slug: string) {
  return submitToIndexNow([`${SITE_URL}/compare/${slug}`]);
}
