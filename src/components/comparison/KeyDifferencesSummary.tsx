import type { KeyDifference, ComparisonEntityData } from "@/types";

const CATEGORY_EMOJIS: Record<string, string> = {
  display: "📱",
  screen: "📱",
  camera: "📷",
  photo: "📷",
  battery: "🔋",
  price: "💰",
  cost: "💰",
  performance: "⚡",
  speed: "⚡",
  processor: "🧠",
  ai: "🧠",
  intelligence: "🧠",
  storage: "💾",
  memory: "💾",
  weight: "⚖️",
  size: "📏",
  design: "🎨",
  sound: "🔊",
  audio: "🔊",
  population: "👥",
  area: "🌍",
  gdp: "💵",
  economy: "💵",
  goals: "⚽",
  trophies: "🏆",
  height: "📏",
  age: "📅",
};

function getEmoji(label: string): string {
  const lower = label.toLowerCase();
  for (const [key, emoji] of Object.entries(CATEGORY_EMOJIS)) {
    if (lower.includes(key)) return emoji;
  }
  return "🔹";
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
    <section aria-labelledby="key-diff-summary-heading" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <div className="relative bg-gradient-to-br from-indigo-50 via-white to-purple-50 border border-indigo-100 rounded-xl p-4 sm:p-5 overflow-hidden">
        {/* Top accent stripe */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400" />

        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 id="key-diff-summary-heading" className="text-xs font-bold text-indigo-700 uppercase tracking-widest">
            Key Differences at a Glance
          </h3>
        </div>

        <ul role="list" className="space-y-2 list-none">
          {top3.map((diff) => {
            const winnerName =
              diff.winner === "a"
                ? entityA.name
                : diff.winner === "b"
                ? entityB.name
                : null;
            const winnerVal = diff.winner === "a" ? diff.entityAValue : diff.entityBValue;
            const loserVal = diff.winner === "a" ? diff.entityBValue : diff.entityAValue;

            return (
              <li key={diff.label} className="flex items-center gap-2.5 text-sm">
                <span className="w-7 h-7 flex-shrink-0 bg-white border border-indigo-100 rounded-lg flex items-center justify-center text-sm shadow-sm" aria-hidden="true">
                  {getEmoji(diff.label)}
                </span>
                <div className="min-w-0 flex-1 flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-text">{diff.label}:</span>
                  {winnerName ? (
                    <>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200/60">
                        ✓ {winnerName} wins
                      </span>
                      <span className="text-text-secondary text-xs">({winnerVal} vs {loserVal})</span>
                    </>
                  ) : (
                    <span className="text-text-secondary">{diff.entityAValue} vs {diff.entityBValue}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ul>

        {differences.length > 3 && (
          <a
            href="#key-differences"
            className="inline-flex items-center gap-1 mt-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            See all {differences.length} differences
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        )}
      </div>
    </section>
  );
}
