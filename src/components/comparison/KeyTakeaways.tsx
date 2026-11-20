import { buildKeyTakeaways } from "@/lib/seo/key-takeaways";
import type { KeyDifference } from "@/types";

interface KeyTakeawaysProps {
  differences: KeyDifference[];
  nameA: string;
  nameB: string;
}

/**
 * Server-rendered list of standalone factual sentences placed in the top third
 * of /compare pages, where AI Mode and other answer engines pick quotes from.
 * Plain synchronous component: /compare is Pages Router (no async components).
 */
export function KeyTakeaways({ differences, nameA, nameB }: KeyTakeawaysProps) {
  const items = buildKeyTakeaways(differences, nameA, nameB);
  if (items.length === 0) return null;
  return (
    <section
      id="key-takeaways"
      aria-labelledby="key-takeaways-heading"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 scroll-mt-28"
      data-testid="key-takeaways"
    >
      <div className="max-w-3xl mx-auto rounded-xl border border-border bg-white p-4 sm:p-5">
        <h2 id="key-takeaways-heading" className="text-base font-bold text-text mb-2">
          {nameA} vs {nameB}: key takeaways
        </h2>
        <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-text-secondary">
          {items.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
