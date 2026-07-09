/**
 * DAN-1812 — Deepen the high-traffic thin `/compare/neymar-vs-mbappe` page.
 *
 * DAN-1800 recovery lever #2 (deepen per-page unique value). The thin-page audit
 * flagged neymar-vs-mbappe as the top deepen target: 567,800 lifetime views,
 * isHumanReviewed=true, but only 2 substantive key differences (THIN_HAS_DEMAND).
 *
 * This script is ADDITIVE ONLY (guardrail): it reads the current prod row,
 * preserves every existing field (viewCount, isHumanReviewed, all existing key
 * differences, FAQs, pros/cons/bestFor, and the 34 legacy attribute rows), and
 * APPENDS genuinely differentiated, web-sourced 2026 data:
 *   - 6 new substantive key differences (real contrasting 2026 values)
 *   - 8 new attribute rows (current club/league/age/value/season output/honours)
 *   - 3 new FAQs
 *   - an appended, dated 2026 verdict rationale + freshness signal in shortAnswer
 *
 * Sources (verified 2026-07-09):
 *   - Mbappé 2025-26: 42 G / 6 A in 44 apps (25 La Liga goals); Pichichi 2024-25
 *     & 2025-26 + European Golden Shoe 2025 — sofascore, transfermarkt, realmadrid.com
 *   - Neymar 2025-26 (Santos, Série A): 4 G / 2 A, 686 mins, injury-hit — fotmob, sofascore
 *   - Market value (Transfermarkt): Neymar €8.0M (26 May 2026) vs Mbappé €180M (5 Jun 2026)
 *   - Ages (Jul 2026): Neymar 34 (b. 5 Feb 1992), Mbappé 27 (b. 20 Dec 1998)
 *   - UCL titles: Neymar 1 (2015 Barcelona) vs Mbappé 0 (2020 final loss w/ PSG;
 *     Real Madrid out in QF 2025-26 to Bayern) — wikipedia, uefa.com
 *   - Ballon d'Or: neither has won; Dembélé won 2025; Neymar best = 3rd (2015, 2017)
 *
 * Write path: saveComparison() upsert (/compare/{slug}). Prod DB via env pull.
 * NOT blocked by DAN-1810 (that gates the Vercel *deploy*, not DB writes).
 *
 * Usage: npx tsx scripts/dan1812-deepen-neymar-mbappe.ts [--commit]
 *        (dry-run by default; pass --commit to write to the DB)
 */
import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ override: true, path: path.resolve(__dirname, "../.env.local") });

import { PrismaClient } from "@prisma/client";
import { saveComparison } from "../src/lib/services/comparison-service";
import { assessComparisonQuality } from "../src/lib/services/comparison-quality";
import type { ComparisonPageData } from "../src/lib/types/comparison";

const SLUG = "neymar-vs-mbappe";
const COMMIT = process.argv.includes("--commit");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function attrValues(av: any) {
  return { entityId: av.entityId, valueText: av.valueText, valueNumber: av.valueNumber, valueBoolean: av.valueBoolean };
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const row = await prisma.comparison.findUnique({
      where: { slug: SLUG },
      include: {
        entities: {
          include: {
            entity: {
              include: { entityType: true, attributeValues: { include: { attribute: true } } },
            },
          },
        },
        faqs: true,
      },
    });
    if (!row) throw new Error(`${SLUG} not found`);

    const sorted = [...row.entities].sort((a, b) => a.position - b.position);
    const neymarCe = sorted.find((ce) => ce.entity.slug === "neymar")!;
    const mbappeCe = sorted.find((ce) => ce.entity.slug === "kylian-mbappe")!;
    const NEY = neymarCe.entity.id; // db entity id
    const MBA = mbappeCe.entity.id;

    // --- Rebuild entities (preserve pros/cons/bestFor/desc/image verbatim) ------
    const entities = sorted.map((ce) => ({
      id: ce.entity.id,
      slug: ce.entity.slug,
      name: ce.entity.name,
      shortDesc: ce.entity.shortDesc,
      imageUrl: ce.entity.imageUrl,
      entityType: ce.entity.entityType.slug,
      position: ce.position,
      pros: ce.pros,
      cons: ce.cons,
      bestFor: ce.bestFor,
    }));

    // --- Rebuild existing attributes (preserve all 34 legacy rows verbatim) -----
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const attrMap = new Map<string, any>();
    for (const ce of sorted) {
      for (const av of ce.entity.attributeValues) {
        if (!attrMap.has(av.attribute.id)) {
          attrMap.set(av.attribute.id, {
            slug: av.attribute.slug,
            name: av.attribute.name,
            unit: av.attribute.unit,
            category: av.attribute.category,
            dataType: av.attribute.dataType,
            higherIsBetter: av.attribute.higherIsBetter,
            values: [],
          });
        }
        attrMap.get(av.attribute.id).values.push(attrValues(av));
      }
    }
    const attributes = Array.from(attrMap.values());

    // --- NEW attributes: sourced 2026 stats (distinct slugs — no overwrite) -----
    const t = (entityId: string, valueText: string) => ({ entityId, valueText, valueNumber: null, valueBoolean: null });
    const newAttrs = [
      { slug: "current-club-2026", name: "Current Club (2026)", values: [t(NEY, "Santos FC"), t(MBA, "Real Madrid")] },
      { slug: "current-league-2026", name: "Current League (2026)", values: [t(NEY, "Brazil Série A"), t(MBA, "Spain La Liga")] },
      { slug: "age-2026", name: "Age (July 2026)", values: [t(NEY, "34 (b. 5 Feb 1992)"), t(MBA, "27 (b. 20 Dec 1998)")] },
      { slug: "market-value-2026", name: "Market Value 2026 (Transfermarkt)", values: [t(NEY, "€8.0M"), t(MBA, "€180M")] },
      { slug: "season-2025-26-goals", name: "2025-26 Goals (all competitions)", values: [t(NEY, "4 (686 mins, injury-hit)"), t(MBA, "42 in 44 apps")] },
      { slug: "season-2025-26-assists", name: "2025-26 Assists (all competitions)", values: [t(NEY, "2"), t(MBA, "6")] },
      { slug: "champions-league-titles-won", name: "Champions League Titles Won", values: [t(NEY, "1 (2015, Barcelona)"), t(MBA, "0 (2020 final loss)")] },
      { slug: "recent-individual-honours-2024-26", name: "Recent Individual Honours (2024-26)", values: [t(NEY, "None (injury-limited)"), t(MBA, "Pichichi 2025 & 2026; European Golden Shoe 2025")] },
    ].map((a) => ({ ...a, unit: null, category: "2026 Snapshot", dataType: "text", higherIsBetter: null }));
    for (const a of newAttrs) attributes.push(a);

    // --- Key differences: existing + 6 new substantive rows (append) ------------
    const existingKD = Array.isArray(row.keyDifferences) ? (row.keyDifferences as unknown[]) : [];
    const newKD = [
      { label: "Current Club (2026)", winner: "tie", entityAValue: "Santos FC (Brazil Série A)", entityBValue: "Real Madrid (La Liga)" },
      { label: "Current Age (2026)", winner: "b", entityAValue: "34 years old", entityBValue: "27 years old" },
      { label: "2025-26 Goals (all comps)", winner: "b", entityAValue: "4 goals (686 mins, injury-hit)", entityBValue: "42 goals in 44 apps" },
      { label: "Market Value 2026 (Transfermarkt)", winner: "b", entityAValue: "€8.0M", entityBValue: "€180M" },
      { label: "Champions League Titles", winner: "a", entityAValue: "1 (2015, Barcelona treble)", entityBValue: "0 (2020 final loss with PSG)" },
      { label: "Recent Individual Honours (2024-26)", winner: "b", entityAValue: "None — injury-limited", entityBValue: "Pichichi 2025 & 2026, Golden Shoe 2025" },
    ];
    const keyDifferences = [...existingKD, ...newKD] as ComparisonPageData["keyDifferences"];

    // --- FAQs: existing + 3 new (append) ---------------------------------------
    const faqs = [
      ...row.faqs.map((f) => ({ question: f.question, answer: f.answer })),
      {
        question: "What clubs do Neymar and Mbappé play for in 2026?",
        answer: "As of 2026, Neymar plays for Santos FC in Brazil's Série A — he returned to his boyhood club in January 2025 and wears the captain's armband, with his contract extended to December 2026. Kylian Mbappé plays for Real Madrid in La Liga, having joined from Paris Saint-Germain in the summer of 2024.",
      },
      {
        question: "Who is better in 2026, Neymar or Mbappé?",
        answer: "On current form, Mbappé is clearly the more productive player in 2026. In 2025-26 he scored 42 goals in 44 appearances for Real Madrid, won back-to-back Pichichi trophies (2024-25 and 2025-26) and the 2025 European Golden Shoe. Neymar, now 34 and back at Santos, managed just 4 goals across a season disrupted by recurring muscle injuries. Neymar remains the more gifted dribbler and creator at his peak, but Mbappé's age, fitness and output make him the better player right now.",
      },
      {
        question: "How much are Neymar and Mbappé worth in 2026?",
        answer: "According to Transfermarkt, Neymar's market value has fallen to about €8.0M as of May 2026 — a steep drop driven by his age (34) and injury record. Mbappé's value is around €180M as of June 2026, among the highest in world football, reflecting his elite output at Real Madrid at age 27.",
      },
    ];

    // --- Verdict: keep original, append dated 2026 rationale (freshness signal) --
    const verdictBase = (row.verdict || "").trim();
    const verdictAppend =
      "\n\n**2026 update (July 2026):** The gap has widened since this pairing was at its peak. Mbappé, now 27 at Real Madrid, is producing at a historic clip — 42 goals in 44 games across 2025-26, plus back-to-back Pichichi trophies and the 2025 European Golden Shoe — while still chasing his first Champions League. Neymar, 34 and back at his boyhood club Santos, has been limited to 4 goals in an injury-wrecked campaign, and Transfermarkt has cut his value to roughly €8M against Mbappé's €180M. One thing Neymar still holds over Mbappé: a Champions League winner's medal (2015, with Barcelona's treble). But on 2026 form, fitness and trajectory, Mbappé is comfortably the better player today, and the comparison is now less 'who is better' than 'peak Neymar vs prime Mbappé'.";
    const verdict = verdictBase.includes("2026 update") ? verdictBase : verdictBase + verdictAppend;

    // --- shortAnswer: append a freshness sentence (additive) --------------------
    const shortBase = (row.shortAnswer || "").trim();
    const freshSentence =
      " (2026 update: Mbappé, 27, scored 42 goals in 2025-26 for Real Madrid, while a 34-year-old Neymar returned to Santos and was limited by injuries to 4.)";
    const shortAnswer = shortBase.includes("2026 update") ? shortBase : shortBase + freshSentence;

    const data: ComparisonPageData = {
      id: row.id,
      slug: row.slug,
      title: row.title,
      shortAnswer,
      keyDifferences,
      verdict,
      category: row.category,
      entities,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      attributes: attributes as any,
      faqs,
      relatedComparisons: [],
      relatedBlogPosts: [],
      metadata: {
        metaTitle: row.metaTitle || `${row.title}: Complete Comparison | Comparison`,
        metaDescription: row.metaDescription || shortAnswer.slice(0, 155),
        publishedAt: row.publishedAt?.toISOString() ?? null,
        updatedAt: new Date().toISOString(),
        isAutoGenerated: row.isAutoGenerated, // false — preserve
        isHumanReviewed: row.isHumanReviewed, // true — preserve
        viewCount: row.viewCount, // 567,800 — preserve
      },
    };

    // --- Quality gate (informational) ------------------------------------------
    const q = assessComparisonQuality(data);
    console.log("=== DAN-1812 deepen: neymar-vs-mbappe ===");
    console.log(`mode: ${COMMIT ? "COMMIT" : "DRY-RUN"}`);
    console.log(`preserved viewCount: ${data.metadata.viewCount}  isHumanReviewed: ${data.metadata.isHumanReviewed}  isAutoGenerated: ${data.metadata.isAutoGenerated}`);
    console.log(`keyDifferences: ${existingKD.length} existing + ${newKD.length} new = ${keyDifferences.length}`);
    console.log(`attributes: ${attrMap.size} existing + ${newAttrs.length} new = ${attributes.length}`);
    console.log(`faqs: ${row.faqs.length} existing + 3 new = ${faqs.length}`);
    console.log(`quality: score=${q.score.toFixed(1)} pass=${q.pass} substantiveKD=${q.metrics.substantiveKeyDifferences} substantiveAttrs=${q.metrics.substantiveAttributes} verdictLen=${q.metrics.verdictLength}`);
    if (q.reasons.length) console.log("quality reasons:", q.reasons.join("; "));

    if (!COMMIT) {
      console.log("\nDRY-RUN — no DB write. Re-run with --commit to persist.");
      console.log("\nNew key differences preview:");
      for (const k of newKD) console.log(`  • ${k.label}: ${k.entityAValue}  vs  ${k.entityBValue}  [win=${k.winner}]`);
      return;
    }

    const res = await saveComparison(data);
    if (!res) throw new Error("saveComparison returned null — NOT persisted");
    console.log(`\n✅ Persisted comparison id=${res.id} → /compare/${SLUG}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
