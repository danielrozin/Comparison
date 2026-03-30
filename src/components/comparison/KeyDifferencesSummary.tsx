import type { KeyDifference, ComparisonEntityData } from "@/types";

const CATEGORY_EMOJIS: Record<string, string> = {
  display: "\ud83d\udcf1",
  screen: "\ud83d\udcf1",
  camera: "\ud83d\udcf7",
  photo: "\ud83d\udcf7",
  battery: "\ud83d\udd0b",
  price: "\ud83d\udcb0",
  cost: "\ud83d\udcb0",
  performance: "\u26a1",
  speed: "\u26a1",
  processor: "\ud83e\udde0",
  ai: "\ud83e\udde0",
  intelligence: "\ud83e\udde0",
  storage: "\ud83d\udcbe",
  memory: "\ud83d\udcbe",
  weight: "\u2696\ufe0f",
  size: "\ud83d\udccf",
  design: "\ud83c\udfa8",
  sound: "\ud83d\udd0a",
  audio: "\ud83d\udd0a",
  population: "\ud83d\udc65",
  area: "\ud83c\udf0d",
  gdp: "\ud83d\udcb5",
  economy: "\ud83d\udcb5",
  goals: "\u26bd",
  trophies: "\ud83c\udfc6",
  height: "\ud83d\udccf",
  age: "\ud83d\udcc5",
};

function getEmoji(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "\ud83d\udd39";
}


export function KeyDifferencesSummary({
  differences,
  entityA,
  entityB,
}: {
  differences: KeyDifference[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const top3 = differences.slice(0, 3);
  if (top3.length === 0) return null;

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="bg-white border border-border rounded-xl p-4 sm:p-5">
        <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">
          Key Differences at a Glance
        </h3>
        <div className="space-y-2.5">
          {top3.map((diff) => {
            const winnerName =
              diff.winner === "a"
                ? entityA.name
                : diff.winner === "b"
                ? entityB.name
                : null;

            return (
              <div
                key={diff.label}
                className="flex items-start gap-3 text-sm"
              >
                <span className="text-base flex-shrink-0 mt-0.5">{getEmoji(diff.label)}</span>
                <div className="min-w-0">
                  <span className="font-semibold text-text">{diff.label}:</span>{" "}
                  {winnerName ? (
                    <span className="text-text-secondary">
                      <span className="text-win font-medium">{winnerName} wins</span>
                      {" "}({diff.winner === "a" ? diff.entityAValue : diff.entityBValue}
                      {" vs "}
                      {diff.winner === "a" ? diff.entityBValue : diff.entityAValue})
                    </span>
                  ) : (
                    <span className="text-text-secondary">
                      {diff.entityAValue} vs {diff.entityBValue}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {differences.length > 3 && (
          <a
            href="#key-differences"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            See all {differences.length} differences
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
