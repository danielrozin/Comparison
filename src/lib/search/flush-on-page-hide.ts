/**
 * The dropdown fires `search_results_shown` when the person blurs, submits,
 * clicks, or closes. A tab close skips those, so the same flush also runs
 * on pagehide and when the document becomes hidden.
 */
export function bindFlushOnPageHide(flush: () => void): () => void {
  const onVisibility = () => {
    if (document.visibilityState === "hidden") flush();
  };
  const onPageHide = () => flush();
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", onPageHide);
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", onPageHide);
  };
}
