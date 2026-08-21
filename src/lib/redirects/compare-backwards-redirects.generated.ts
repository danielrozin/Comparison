/**
 * Redirect rules that point a LIVE page at a DEAD one — excluded, not fixed.
 *
 * The ordering and rivalry generators picked a canonical slug per cluster by
 * search demand or alphabetical order, without checking that the winner
 * actually renders. Where the winner was never published, the result is a live
 * page 301ing into a 404: the good page is unreachable and Google follows the
 * redirect to nothing.
 *
 * ali-vs-tyson is the clearest case. DAN-2078 chose mike-tyson-vs-muhammad-ali
 * because it had 62 GSC clicks against 37 — but only ali-vs-tyson had a page,
 * and it has 412,300 views. The redirect took the site's live boxing page off
 * the map.
 *
 * Auditing all 326 compare redirects found 205 whose destination does not
 * return 200. The other 202 are archived-to-archived: both ends 404 already,
 * so removing those rules would change nothing for a visitor. Only the three
 * below cost a working page, so only these are excluded — a narrow fix beats a
 * broad one against a map this load-bearing.
 *
 * Re-audit with scripts/audit-redirect-targets.mjs.
 */

export const BACKWARDS_REDIRECT_SOURCES: string[] = [
  // Currently empty, and that is the desired state.
  //
  // The three rules that were broken on 2026-08-21 — ali-vs-tyson,
  // wordpress-vs-squarespace and california-population-vs-texas-2026 — were
  // fixed by publishing the archived survivor each pointed at, rather than by
  // dropping the rule. That keeps the consolidation working as designed: the
  // keyword-stuffed or reversed variant still folds into the clean canonical,
  // which is the DAN-346/DAN-1908 spam-recovery rule. Excluding them instead
  // would have left the stuffed slug live and quietly inverted that policy.
  //
  // Add a slug here only when its survivor genuinely should not exist. If the
  // survivor is merely archived, publish the survivor.
];
