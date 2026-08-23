import Link from "next/link";

/**
 * Shared shell for the top-level index pages (/category, /entity, /best,
 * /authors).
 *
 * These four URLs were asserted in breadcrumb JSON-LD across the site but had
 * no page behind them, so every one returned 404. They now exist as real hubs;
 * this shell keeps their chrome identical instead of four near-copies of the
 * same hero.
 */
export function HubShell({
  eyebrow,
  title,
  lede,
  breadcrumbLabel,
  children,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  breadcrumbLabel: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="bg-gradient-to-br from-slate-900 via-primary-900 to-indigo-900 text-white relative overflow-hidden">
        <svg className="absolute inset-0 w-full h-full opacity-5 pointer-events-none" aria-hidden="true">
          <defs>
            <pattern id="hub-hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4" />
              <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hub-hero-grid)" />
        </svg>
        <div className="hidden sm:block absolute top-0 right-0 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" aria-hidden="true" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 relative">
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center gap-1.5 text-sm text-primary-200">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li aria-hidden="true">
                <svg className="w-3 h-3 text-primary-400/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </li>
              <li className="text-white font-medium" aria-current="page">
                {breadcrumbLabel}
              </li>
            </ol>
          </nav>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-300 mb-1.5">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-black tracking-tight mb-4">{title}</h1>
          <p className="text-primary-100 text-base sm:text-lg leading-relaxed max-w-2xl">{lede}</p>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 24" fill="none" className="w-full" aria-hidden="true">
            <path d="M0 24V8C360 20 720 0 1080 12C1260 18 1380 6 1440 8V24H0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">{children}</div>
    </>
  );
}
