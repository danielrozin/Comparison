import Link from "next/link";

/**
 * Pro upsell for comparison pages. Pure presentational — this renders inside
 * the Pages Router /compare tree, where an async component crashes every page
 * (React #482 / DAN-1656), so keep it a plain sync component forever.
 */
export function ProUpsellCard({ slug }: { slug: string }) {
  return (
    <aside
      aria-label="A Versus B Pro"
      className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-indigo-50 p-6 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary-600 mb-2">
        A Versus B Pro
      </p>
      <h2 className="text-lg sm:text-xl font-display font-bold text-text mb-2">
        Comparing something we haven&apos;t covered?
      </h2>
      <p className="text-sm text-text-secondary leading-relaxed mb-4 max-w-xl">
        Pro members request any matchup — we research it and publish the full side-by-side,
        verdict included, within 24 hours. Founding price locked at $49/year.
      </p>
      <Link
        href={`/pricing?src=compare-${slug}`}
        className="inline-flex items-center rounded-xl bg-primary-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-primary-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
      >
        Get your comparison built →
      </Link>
    </aside>
  );
}
