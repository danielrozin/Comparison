/**
 * Bring a pill into view inside a horizontally-scrolling nav — and nothing else.
 *
 * The scroll-spy navs previously did this with
 * `pill.scrollIntoView({ block: "nearest", inline: "nearest" })`. That scrolls
 * *every* scrollable ancestor, the document included. So as soon as a reader
 * scrolled far enough to activate the next section, the nav yanked the page
 * vertically to satisfy `block: "nearest"` on a sticky element — the page
 * appeared to jump back up on its own, and it fired again on every section
 * boundary, which made long comparison pages effectively unreadable.
 *
 * Setting `scrollLeft` on the container touches one axis of one element, so
 * the page cannot move.
 */
export function scrollPillIntoView(
  container: HTMLElement | null | undefined,
  pill: HTMLElement | null | undefined,
  { padding = 16 }: { padding?: number } = {}
): void {
  if (!container || !pill) return;

  const c = container.getBoundingClientRect();
  const p = pill.getBoundingClientRect();

  let delta = 0;
  if (p.left < c.left + padding) {
    delta = p.left - c.left - padding;
  } else if (p.right > c.right - padding) {
    delta = p.right - c.right + padding;
  }
  if (delta === 0) return;

  const reduceMotion =
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  container.scrollTo({
    left: container.scrollLeft + delta,
    behavior: reduceMotion ? "auto" : "smooth",
  });
}
