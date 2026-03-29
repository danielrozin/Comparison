import type { ComparisonPageData, ComparisonEntityData } from "@/types";
import Image from "next/image";

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

  const gradientClass =
    variant === "a"
      ? "from-primary-100 to-primary-200"
      : "from-accent-50 to-accent-400/30";
  const textClass =
    variant === "a" ? "text-primary-700" : "text-accent-600";
  const glowClass =
    variant === "a"
      ? "shadow-[0_0_30px_rgba(99,102,241,0.3)]"
      : "shadow-[0_0_30px_rgba(168,85,247,0.3)]";

  if (hasImage) {
    return (
      <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden mx-auto mb-3 sm:mb-4 ring-2 ring-white ${glowClass}`}>
        <Image
          src={entity.imageUrl!}
          alt={entity.name}
          width={112}
          height={112}
          className="w-full h-full object-cover"
          unoptimized
        />
      </div>
    );
  }

  // Fallback: show initials
  const initials = entity.name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0))
    .join("")
    .toUpperCase();

  return (
    <div
      className={`w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4 ${glowClass}`}
    >
      <span className={`text-2xl sm:text-4xl font-bold ${textClass}`}>
        {initials || entity.name.charAt(0)}
      </span>
    </div>
  );
}

export function ComparisonHero({ comparison }: { comparison: ComparisonPageData }) {
  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];

  if (!entityA || !entityB) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-12">
      {/* Title */}
      <h1 className="text-2xl sm:text-4xl lg:text-5xl font-display font-black text-center text-text mb-4 sm:mb-6">
        {comparison.title}
      </h1>

      {/* Entity VS Cards */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-3 sm:gap-6 items-start">
        {/* Entity A */}
        <div className="bg-white border border-border rounded-xl p-4 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
          <EntityAvatar entity={entityA} variant="a" />
          <h3 className="text-base sm:text-xl font-bold text-text mb-1">{entityA.name}</h3>
          {entityA.shortDesc && (
            <p className="text-xs sm:text-sm text-text-secondary leading-snug line-clamp-2">{entityA.shortDesc}</p>
          )}
          {entityA.bestFor && (
            <p className="mt-3 text-[11px] sm:text-xs font-semibold text-primary-700 bg-gradient-to-r from-primary-50 to-primary-100 px-3 py-1.5 rounded-full inline-block border border-primary-200/50">
              {entityA.bestFor}
            </p>
          )}
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center self-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-600 to-accent-500 text-white rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <span className="font-display font-black text-base sm:text-xl">VS</span>
          </div>
        </div>

        {/* Entity B */}
        <div className="bg-white border border-border rounded-xl p-4 sm:p-6 text-center hover:shadow-md transition-shadow duration-200">
          <EntityAvatar entity={entityB} variant="b" />
          <h3 className="text-base sm:text-xl font-bold text-text mb-1">{entityB.name}</h3>
          {entityB.shortDesc && (
            <p className="text-xs sm:text-sm text-text-secondary leading-snug line-clamp-2">{entityB.shortDesc}</p>
          )}
          {entityB.bestFor && (
            <p className="mt-3 text-[11px] sm:text-xs font-semibold text-accent-600 bg-gradient-to-r from-accent-50 to-purple-100 px-3 py-1.5 rounded-full inline-block border border-accent-200/50">
              {entityB.bestFor}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
