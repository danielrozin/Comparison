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

  if (hasImage) {
    return (
      <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden mx-auto mb-2 sm:mb-4 ring-2 ring-white shadow-md">
        <Image
          src={entity.imageUrl!}
          alt={entity.name}
          width={80}
          height={80}
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
      className={`w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-4`}
    >
      <span className={`text-xl sm:text-3xl font-bold ${textClass}`}>
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

      {/* Short Answer */}
      {comparison.shortAnswer && (
        <div className="bg-primary-50 border border-primary-200 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 max-w-3xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary-600 rounded-full flex items-center justify-center mt-0.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-semibold text-primary-900 mb-1 text-sm uppercase tracking-wide">
                Quick Answer
              </h2>
              <p className="text-primary-800 leading-relaxed text-sm sm:text-base">{comparison.shortAnswer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Entity VS Cards — responsive: stacks on very small, 3-col on larger */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-6 items-start">
        {/* Entity A */}
        <div className="bg-white border border-border rounded-xl p-3 sm:p-6 text-center">
          <EntityAvatar entity={entityA} variant="a" />
          <h3 className="text-sm sm:text-xl font-bold text-text mb-1">{entityA.name}</h3>
          {entityA.shortDesc && (
            <p className="text-xs sm:text-sm text-text-secondary leading-snug hidden sm:block">{entityA.shortDesc}</p>
          )}
          {entityA.bestFor && (
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-primary-700 bg-primary-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block">
              {entityA.bestFor}
            </p>
          )}
        </div>

        {/* VS Badge */}
        <div className="flex items-center justify-center self-center">
          <div className="w-10 h-10 sm:w-16 sm:h-16 bg-surface-dark text-white rounded-full flex items-center justify-center shadow-lg">
            <span className="font-display font-black text-sm sm:text-xl">VS</span>
          </div>
        </div>

        {/* Entity B */}
        <div className="bg-white border border-border rounded-xl p-3 sm:p-6 text-center">
          <EntityAvatar entity={entityB} variant="b" />
          <h3 className="text-sm sm:text-xl font-bold text-text mb-1">{entityB.name}</h3>
          {entityB.shortDesc && (
            <p className="text-xs sm:text-sm text-text-secondary leading-snug hidden sm:block">{entityB.shortDesc}</p>
          )}
          {entityB.bestFor && (
            <p className="mt-2 sm:mt-3 text-[10px] sm:text-xs font-medium text-accent-600 bg-accent-50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full inline-block">
              {entityB.bestFor}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
