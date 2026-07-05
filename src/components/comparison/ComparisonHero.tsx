import type { ComparisonPageData, ComparisonEntityData } from "@/types";
import Image from "next/image";
import { AffiliateButton } from "./AffiliateButton";

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
}: {
  entity: ComparisonEntityData;
  variant: "a" | "b";
}) {
  const borderClass =
    variant === "a"
      ? "border-primary-400/30 hover:border-primary-400/60"
      : "border-accent-400/30 hover:border-accent-400/60";
  const pillClass =
    variant === "a"
      ? "text-primary-200 bg-primary-600/30 border border-primary-400/30"
      : "text-accent-200 bg-accent-600/30 border border-accent-400/30";

  return (
    <div
      className={`bg-white/10 backdrop-blur-sm border ${borderClass} rounded-2xl p-4 sm:p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all duration-200`}
    >
      <EntityAvatar entity={entity} variant={variant} />
      <h3 className="text-base sm:text-xl font-bold text-white mb-1">{entity.name}</h3>
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

export function ComparisonHero({ comparison }: { comparison: ComparisonPageData }) {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];

  if (!entityA || !entityB) return null;

  return (
    <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-10" aria-hidden="true" />

      {/* Floating blobs */}
      <div className="absolute top-6 left-10 w-56 h-56 bg-primary-400/20 rounded-full blur-3xl" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-accent-500/15 rounded-full blur-3xl" aria-hidden="true" />

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
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-center text-white mb-2 sm:mb-3 leading-tight">
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
              <p className="text-xs sm:text-sm text-primary-100/90 leading-relaxed line-clamp-3">
                {comparison.quickAnswer?.tldr || comparison.shortAnswer}
              </p>
            </div>
          </div>
        )}

        {/* Entity VS Cards */}
        <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-start">
          <EntityCard entity={entityA} variant="a" />

          {/* VS Badge */}
          <div className="flex items-center justify-center self-center">
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 motion-safe:animate-pulse opacity-40 scale-125" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-500 to-accent-500 shadow-lg shadow-accent-500/40" />
              <div className="absolute inset-0 rounded-full ring-2 ring-white/30" />
              <span className="relative font-display font-black text-base sm:text-xl text-white tracking-tight">VS</span>
            </div>
          </div>

          <EntityCard entity={entityB} variant="b" />
        </div>
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
