import type { ComparisonAttribute, ComparisonEntityData, KeyDifference } from "@/types";

function formatValue(attr: ComparisonAttribute, entityIdx: number): string {
  const val = attr.values[entityIdx];
  if (!val) return "N/A";
  if (val.valueBoolean != null) return val.valueBoolean ? "Yes" : "No";
  if (val.valueNumber != null) {
    const num = val.valueNumber;
    const formatted = num >= 1_000_000
      ? `${(num / 1_000_000).toFixed(1)}M`
      : num >= 1_000
      ? `${(num / 1_000).toFixed(1)}K`
      : num % 1 === 0
      ? num.toString()
      : num.toFixed(2);
    return attr.unit ? `${formatted} ${attr.unit}` : formatted;
  }
  if (val.valueText) return val.valueText;
  return "N/A";
}

function buildFacts(
  attributes: ComparisonAttribute[],
  keyDifferences: KeyDifference[],
  entityA: ComparisonEntityData,
  entityB: ComparisonEntityData,
): string[] {
  const facts: string[] = [];

  // Derive facts from key differences (most impactful)
  for (const diff of keyDifferences.slice(0, 4)) {
    if (diff.winner === "a") {
      facts.push(`${entityA.name} leads in ${diff.label} (${diff.entityAValue} vs ${diff.entityBValue}).`);
    } else if (diff.winner === "b") {
      facts.push(`${entityB.name} leads in ${diff.label} (${diff.entityBValue} vs ${diff.entityAValue}).`);
    } else {
      facts.push(`${diff.label}: ${entityA.name} has ${diff.entityAValue}, ${entityB.name} has ${diff.entityBValue}.`);
    }
  }

  // Fill remaining from attributes with winners
  const usedLabels = new Set(keyDifferences.slice(0, 4).map((d) => d.label.toLowerCase()));
  for (const attr of attributes) {
    if (facts.length >= 8) break;
    if (usedLabels.has(attr.name.toLowerCase())) continue;
    const valA = formatValue(attr, 0);
    const valB = formatValue(attr, 1);
    if (valA === "N/A" && valB === "N/A") continue;

    const winnerVal = attr.values.find((v) => v.winner);
    if (winnerVal) {
      const winnerEntity = winnerVal.entityId === entityA.id ? entityA : entityB;
      facts.push(`${winnerEntity.name} wins on ${attr.name} (${valA} vs ${valB}).`);
    } else if (valA !== valB) {
      facts.push(`${attr.name}: ${entityA.name} at ${valA}, ${entityB.name} at ${valB}.`);
    }
    usedLabels.add(attr.name.toLowerCase());
  }

  return facts.slice(0, 8);
}

export function KeyFacts({
  attributes,
  keyDifferences,
  entityA,
  entityB,
}: {
  attributes: ComparisonAttribute[];
  keyDifferences: KeyDifference[];
  entityA: ComparisonEntityData;
  entityB: ComparisonEntityData;
}) {
  const facts = buildFacts(attributes, keyDifferences, entityA, entityB);
  if (facts.length === 0) return null;

  return (
    <section
      id="key-facts"
      className="key-facts max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4"
      itemScope
      itemType="https://schema.org/ItemList"
    >
      <meta itemProp="name" content={`Key Facts: ${entityA.name} vs ${entityB.name}`} />
      <meta itemProp="numberOfItems" content={String(facts.length)} />
      <div className="bg-white border border-border rounded-xl p-4 sm:p-6">
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">
          Key Facts
        </h2>
        <ol className="space-y-2.5 list-none m-0 p-0">
          {facts.map((fact, i) => (
            <li
              key={i}
              className="flex items-start gap-3 text-sm"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              <span
                className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-50 text-primary-700 text-xs font-bold flex items-center justify-center mt-0.5"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="text-text leading-relaxed" itemProp="name">
                {fact}
              </span>
              <meta itemProp="position" content={String(i + 1)} />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
