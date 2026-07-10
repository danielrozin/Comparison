import type React from "react";
import type { ComparisonPageData, ComparisonEntityData } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { AffiliateButton } from "./AffiliateButton";

function WinnerBadge() {
  return (
    <div
      className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-900 shadow-md shadow-amber-400/40 ring-1 ring-amber-300/60 whitespace-nowrap z-10"
      aria-label="Winner"
    >
      <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
      Our Pick
    </div>
  );
}

const AVATAR_PALETTES = [
  { bg: "from-indigo-500 to-blue-400", ring: "ring-indigo-400/50", shadow: "shadow-[0_0_40px_rgba(99,102,241,0.5)]" },
  { bg: "from-violet-500 to-purple-400", ring: "ring-violet-400/50", shadow: "shadow-[0_0_40px_rgba(167,139,250,0.5)]" },
  { bg: "from-emerald-500 to-teal-400", ring: "ring-emerald-400/50", shadow: "shadow-[0_0_40px_rgba(52,211,153,0.5)]" },
  { bg: "from-amber-500 to-orange-400", ring: "ring-amber-400/50", shadow: "shadow-[0_0_40px_rgba(251,191,36,0.5)]" },
  { bg: "from-rose-500 to-pink-400", ring: "ring-rose-400/50", shadow: "shadow-[0_0_40px_rgba(251,113,133,0.5)]" },
];

function pickPalette(name: string, forceIdx?: number) {
  if (forceIdx !== undefined) return AVATAR_PALETTES[forceIdx % AVATAR_PALETTES.length];
  const code = name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return AVATAR_PALETTES[code % AVATAR_PALETTES.length];
}

function EntityAvatar({
  entity,
  variant,
}: {
  entity: ComparisonEntityData;
  variant: "a" | "b";
}) {
  const hasImage =
    entity.imageUrl &&
    !entity.imageUrl.includes("ui-avatars.com");

  const palette = pickPalette(entity.name, variant === "a" ? 0 : 1);
  const isPrimary = variant === "a";

  if (hasImage) {
    return (
      <div className={`relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 sm:mb-4`}>
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${palette.bg} blur-md opacity-50`} />
        <div className={`relative w-full h-full rounded-full overflow-hidden ring-2 ${palette.ring} ${palette.shadow}`}>
          <Image
            src={entity.imageUrl!}
            alt={entity.name}
            width={112}
            height={112}
            sizes="(min-width: 640px) 112px, 80px"
            priority={true}
            fetchPriority="high"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    );
  }

  const initials = entity.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div className={`relative w-20 h-20 sm:w-28 sm:h-28 mx-auto mb-3 sm:mb-4`}>
      {/* Pulsing outer glow ring for fallback avatars */}
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${palette.bg} blur-xl opacity-40 motion-safe:animate-pulse scale-125`} />
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${palette.bg} blur-md opacity-60`} />
      <div
        className={`relative w-full h-full bg-gradient-to-br ${palette.bg} rounded-full flex items-center justify-center ring-2 ${palette.ring} ${palette.shadow}`}
      >
        <span className="text-2xl sm:text-4xl font-black text-white drop-shadow">
          {initials || entity.name.charAt(0)}
        </span>
      </div>
    </div>
  );
}

function ScoreBar({
  entity,
  variant,
}: {
  entity: ComparisonEntityData;
  variant: "a" | "b";
}) {
  const total = (entity.pros?.length ?? 0) + (entity.cons?.length ?? 0);
  if (total === 0) return null;
  const pct = Math.round(((entity.pros?.length ?? 0) / total) * 100);
  const barColor = variant === "a" ? "from-primary-400 to-primary-300" : "from-accent-400 to-purple-300";

  return (
    <div className="mt-3 px-1">
      <div className="flex justify-between items-center mb-1">
        <span className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Score</span>
        <span className="text-[11px] font-bold text-white/80">{pct}%</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${entity.name} pros score`}
          className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EntityCard({
  entity,
  variant,
  isWinner,
}: {
  entity: ComparisonEntityData;
  variant: "a" | "b";
  isWinner?: boolean;
}) {
  const borderClass = isWinner
    ? "border-amber-400/60 ring-1 ring-amber-400/30"
    : variant === "a"
    ? "border-primary-400/30 hover:border-primary-400/60"
    : "border-accent-400/30 hover:border-accent-400/60";
  const pillClass =
    variant === "a"
      ? "text-primary-200 bg-primary-600/30 border border-primary-400/30"
      : "text-accent-200 bg-accent-600/30 border border-accent-400/30";

  return (
    <div
      className={`relative bg-white/10 backdrop-blur-sm border ${borderClass} rounded-2xl p-4 sm:p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all duration-200`}
    >
      {isWinner && <WinnerBadge />}
      <EntityAvatar entity={entity} variant={variant} />
      <h2 className="text-base sm:text-xl font-bold text-white mb-1">
        <Link
          href={`/entity/${entity.slug}`}
          className="hover:text-primary-200 transition-colors duration-150 underline-offset-2 hover:underline decoration-white/30"
          title={`All comparisons featuring ${entity.name}`}
        >
          {entity.name}
        </Link>
      </h2>
      {entity.shortDesc && (
        <p className="text-xs sm:text-sm text-primary-100/80 leading-snug line-clamp-2">{entity.shortDesc}</p>
      )}
      {entity.bestFor && (
        <p className={`mt-3 text-[11px] sm:text-xs font-semibold px-3 py-1.5 rounded-full inline-block ${pillClass}`}>
          {entity.bestFor}
        </p>
      )}
      <ScoreBar entity={entity} variant={variant} />
      {entity.affiliateLinks && entity.affiliateLinks.length > 0 && (
        <div className="mt-3">
          <AffiliateButton link={entity.affiliateLinks[0]} size="sm" />
        </div>
      )}
    </div>
  );
}

function resolveWinner(comparison: ComparisonPageData): "a" | "b" | null {
  const winnerName = comparison.quickAnswer?.winnerName;
  if (!winnerName) return null;
  const a = comparison.entities[0];
  const b = comparison.entities[1];
  if (!a || !b) return null;
  const lc = winnerName.toLowerCase().trim();
  if (a.name.toLowerCase().trim() === lc) return "a";
  if (b.name.toLowerCase().trim() === lc) return "b";
  return null;
}

function AttrIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function DiffIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
  );
}

function ProsIcon() {
  return (
    <svg className="w-3 h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ComparisonStats({ comparison }: { comparison: ComparisonPageData }) {
  const attrCount = comparison.attributes?.length ?? 0;
  const diffCount = comparison.keyDifferences?.length ?? 0;
  const totalPros = comparison.entities.reduce((s, e) => s + (e.pros?.length ?? 0), 0);
  const totalCons = comparison.entities.reduce((s, e) => s + (e.cons?.length ?? 0), 0);

  const stats = [
    attrCount > 0 && { label: `${attrCount} attributes`, icon: <AttrIcon /> },
    diffCount > 0 && { label: `${diffCount} differences`, icon: <DiffIcon /> },
    (totalPros + totalCons) > 0 && { label: `${totalPros + totalCons} pros/cons`, icon: <ProsIcon /> },
  ].filter(Boolean) as { label: string; icon: React.ReactNode }[];

  if (stats.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap mt-2">
      {stats.map((s) => (
        <span
          key={s.label}
          className="inline-flex items-center gap-1 text-[10px] font-semibold text-white/70 bg-white/10 border border-white/15 rounded-full px-2 py-0.5"
        >
          {s.icon}
          {s.label}
        </span>
      ))}
    </div>
  );
}

export function ComparisonHero({ comparison }: { comparison: ComparisonPageData }) {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];

  if (!entityA || !entityB) return null;

  const winner = resolveWinner(comparison);

  return (
    <section aria-labelledby="comparison-hero-heading" className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
      {/* Background grid — inline SVG pattern avoids a separate HTTP request during the LCP window */}
      <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" aria-hidden="true">
        <defs>
          <pattern id="hero-grid" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
            <path d="M0 0h32v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".4"/>
            <path d="M0 16h32M16 0v32" fill="none" stroke="#888" strokeWidth=".5" strokeOpacity=".2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hero-grid)"/>
      </svg>

      {/* Floating blobs — hidden on mobile to avoid GPU compositing overhead (blur-3xl forces
          a compositor layer; on mobile GPU this delays first paint and hurts mobile LCP). */}
      <div className="hidden sm:block absolute top-6 left-10 w-56 h-56 bg-primary-400/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="hidden sm:block absolute bottom-10 right-10 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" aria-hidden="true" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16 sm:pb-20">
        {/* Breadcrumb category pill */}
        {comparison.category && (
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-primary-100 uppercase tracking-wider">
              {comparison.category}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 id="comparison-hero-heading" className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-center text-white mb-2 sm:mb-3 leading-tight">
          {comparison.metadata?.metaTitle || comparison.title}
        </h1>

        {/* Last Updated */}
        {comparison.metadata?.updatedAt && (
          <p className="text-center text-xs sm:text-sm text-primary-200/80 mb-6 sm:mb-8 flex items-center justify-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            <time dateTime={comparison.metadata.updatedAt}>
              Updated {new Date(comparison.metadata.updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
            </time>
          </p>
        )}

        {/* Short Answer preview badge — AEO/GEO snippet signal */}
        {(comparison.quickAnswer?.tldr || comparison.shortAnswer) && (
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="inline-flex items-start gap-2.5 max-w-2xl bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 text-left">
              <div className="flex-shrink-0 w-5 h-5 bg-yellow-400/20 rounded-full flex items-center justify-center mt-0.5">
                <svg className="w-3 h-3 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p id="hero-tldr" className="text-xs sm:text-sm text-primary-100/90 leading-relaxed line-clamp-3">
                {comparison.quickAnswer?.tldr || comparison.shortAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Entity VS Cards */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-start">
          <EntityCard entity={entityA} variant="a" isWinner={winner === "a"} />

          {/* VS Badge */}
          <div className="flex flex-col items-center justify-center self-center gap-2">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 motion-safe:animate-pulse opacity-40 scale-125" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-accent-500/40" />
              <div className="absolute inset-0 rounded-full ring-2 ring-white/30" />
              <span className="relative font-display font-black text-base sm:text-xl text-white tracking-tight">VS</span>
            </div>
          </div>

          <EntityCard entity={entityB} variant="b" isWinner={winner === "b"} />
        </div>

        {/* Comparison stats row */}
        <ComparisonStats comparison={comparison} />

        {/* Jump to verdict CTA — only when there's verdict content */}
        {(comparison.verdict || comparison.quickAnswer?.tldr || comparison.shortAnswer) && (
          <div className="flex items-center justify-center gap-3 mt-5">
            <a
              href="#verdict"
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold text-white/80 bg-white/15 hover:bg-white/25 border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-200 group"
            >
              <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              Skip to verdict
              <svg className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
            <a
              href="#key-differences"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white/60 hover:text-white/80 border border-white/10 hover:border-white/25 transition-all duration-200"
            >
              See differences
            </a>
          </div>
        )}
      </div>

      {/* Wave divider */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg viewBox="0 0 1440 64" fill="none" className="w-full">
          <path d="M0 64V16C240 48 480 0 720 16C960 32 1200 0 1440 16V64H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
