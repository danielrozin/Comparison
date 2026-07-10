/**
 * AI Comparison Generator
 * Uses Claude API to generate comparison data for new/unknown comparisons
 * Server-side only — never import in client components
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ComparisonPageData, CitationStats, QuickAnswerTLDR } from "@/types";
import { enrichComparisonData, type TavilyResult } from "./tavily-service";
import { fetchEntityImages } from "@/lib/services/image-service";
import { setPostHogDistinctId } from "@/lib/posthog-otel";
import { COMPARISON_CATEGORIES, validateComparisonCategory } from "@/lib/utils/categories";
import { assessComparisonQuality } from "@/lib/services/comparison-quality";

// Cap each Claude call at 45s so a slow upstream can't blow past the
// 60s Vercel function budget and leave the user-facing route hanging
// (DAN-596). The SDK's default is 10 minutes, which is wildly larger
// than our serverless budget.
const ANTHROPIC_TIMEOUT_MS = 45000;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  return new Anthropic({ apiKey, timeout: ANTHROPIC_TIMEOUT_MS, maxRetries: 1 });
}

const GENERATION_PROMPT = `You are a comparison data expert. Generate a structured comparison between the two entities provided.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "Entity A vs Entity B",
  "shortAnswer": "2-3 sentence factual summary of the key difference",
  "keyDifferences": [
    {"label": "Attribute Name", "entityAValue": "value", "entityBValue": "value", "winner": "a" or "b" or "tie"}
  ],
  "verdict": "2-3 sentence balanced conclusion",
  "category": "one of: ${COMPARISON_CATEGORIES.join(", ")}. IMPORTANT: Use 'software' for any software tools, SaaS, apps, platforms, VPNs, antivirus, hosting, CRM, project management tools, AI tools, email marketing, password managers, website builders, cloud services, design tools, or dev tools. Use 'automotive' for cars, vehicles, EVs. Do NOT use 'technology' for software or car content.",
  "entities": [
    {
      "name": "Entity A Full Name",
      "shortDesc": "One-line description",
      "entityType": "person/country/product/team/company/brand/technology/event/software/place",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this option"
    },
    {
      "name": "Entity B Full Name",
      "shortDesc": "One-line description",
      "entityType": "person/country/product/team/company/brand/technology/event/software/place",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this option"
    }
  ],
  "attributes": [
    {
      "name": "Attribute Name",
      "unit": "unit or null",
      "category": "Category Group",
      "dataType": "number or text",
      "higherIsBetter": true/false/null,
      "entityAValue": "display value",
      "entityANumber": number_or_null,
      "entityBValue": "display value",
      "entityBNumber": number_or_null,
      "winner": "a" or "b" or "tie" or null
    }
  ],
  "faqs": [
    {"question": "Common question?", "answer": "Detailed answer."}
  ],
  "quickAnswer": {
    "tldr": "One-sentence TL;DR that directly answers which is better and why (e.g., 'iPhone 16 wins for most users thanks to its superior camera and 20% longer battery life.')",
    "winnerName": "Entity name or null if truly tied",
    "winnerReason": "Single most decisive factor (e.g., '20% longer battery life')",
    "keyFact": "Most compelling statistic from the comparison (e.g., 'Based on analysis of 1,200+ reviews, 78% of users prefer Entity A')"
  },
  "citationStats": {
    "dataPointCount": 15,
    "reviewsAnalyzed": 1200,
    "preferencePercent": 78,
    "preferenceEntity": "Entity A name"
  },
  "metaTitle": "SEO title under 60 chars with current year",
  "metaDescription": "SEO description under 155 chars"
}

Requirements:
- Include 5-7 key differences with specific, verifiable data points (not generic statements)
- Include 5-8 attributes with real data — use correct units (GB, MHz, USD, cm, etc.). Never use vague values like "Good" or "Very Good"
- Include 3-5 FAQs that answer questions users actually search for
- Include 3-5 pros and 2-3 cons per entity — be specific (e.g., "48MP main camera with OIS" not "good camera"). Avoid generic pros like "popular" or "well-known"
- Cons must be honest weaknesses, not hedged non-answers like "has a learning curve"
- The shortAnswer must state the core factual difference, never just "it depends"
- The verdict must include "Choose X if... Choose Y if..." guidance
- The quickAnswer.tldr must be a single decisive sentence — never "it depends"
- The quickAnswer.keyFact MUST include specific numbers (e.g., "Based on analysis of X reviews, Y% prefer...")
- citationStats.dataPointCount = total number of factual data points in the comparison
- citationStats.reviewsAnalyzed = estimate of reviews/sources analyzed (use null if unknown)
- citationStats.preferencePercent = if data suggests a preference, include % (null otherwise)
- Be factual and balanced — present both sides fairly
- Use real statistics and data where possible — every claim should cite a number
- Keep the year current (2026)`;

export type GenerationErrorStage =
  | "tavily"
  | "anthropic"
  | "parse"
  | "save"
  | "timeout"
  | "quality"
  | "unknown";

export interface GenerationResult {
  success: boolean;
  comparison: ComparisonPageData | null;
  error?: string;
  errorStage?: GenerationErrorStage;
}

/**
 * Extract the JSON object from an AI text response. Handles three shapes:
 *   1. raw JSON
 *   2. JSON wrapped in ```json … ``` code fences
 *   3. JSON preceded/followed by stray prose ("Here is the comparison: {…}")
 * by falling back to the first `{` … last `}` slice. Throws on no object.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseGeneratedJson(text: string): Record<string, any> {
  let jsonText = text.trim();
  const fenceMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonText = fenceMatch[1].trim();
  }
  try {
    return JSON.parse(jsonText);
  } catch {
    // Fall back to the outermost object braces in case the model wrapped the
    // JSON in prose despite the "ONLY valid JSON" instruction.
    const start = jsonText.indexOf("{");
    const end = jsonText.lastIndexOf("}");
    if (start !== -1 && end > start) {
      return JSON.parse(jsonText.slice(start, end + 1));
    }
    throw new Error("No JSON object found in response");
  }
}

export async function generateComparison(
  entityA: string,
  entityB: string,
  slug: string,
  options?: { skipEnrichment?: boolean }
): Promise<GenerationResult> {
  try {
    const client = getClient();

    // Fetch real-time web data via Tavily (graceful — skipped on failure)
    let tavilyContext = "";
    let tavilySources: { name: string; url?: string }[] = [];
    if (!options?.skipEnrichment) {
      try {
        const enrichment = await enrichComparisonData(entityA, entityB, true);
        tavilyContext = enrichment.context;
        tavilySources = enrichment.sources.map((s) => {
          try {
            return { name: new URL(s.url).hostname.replace(/^www\./, ""), url: s.url };
          } catch {
            return { name: s.title || "web source", url: s.url };
          }
        });
      } catch (err) {
        console.warn("Tavily enrichment failed, proceeding without:", err);
      }
    }

    let userMessage = `${GENERATION_PROMPT}\n\nGenerate a comparison for: "${entityA}" vs "${entityB}"`;
    if (tavilyContext) {
      userMessage += `\n\nHere is current real-world data to incorporate into your comparison:\n${tavilyContext}`;
    }

    // Stamp the comparison slug as the PostHog distinct ID so this generation
    // is linked to the correct comparison in AI Observability.
    setPostHogDistinctId(`comparison:${slug}`);

    let message;
    try {
      message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        // DAN-1196: 3000 truncated the JSON for spec-rich pairings (e.g. two
        // flagship phones with 5-8 attributes + key differences + FAQs +
        // pros/cons), producing an unclosed object that failed JSON.parse with
        // errorStage "parse". Match the multi-entity path's headroom.
        max_tokens: 6000,
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      });
    } catch (err) {
      const isTimeout =
        err instanceof Error &&
        (err.name === "APIConnectionTimeoutError" ||
          /timeout|timed out/i.test(err.message));
      return {
        success: false,
        comparison: null,
        error: err instanceof Error ? err.message : "Anthropic call failed",
        errorStage: isTimeout ? "timeout" : "anthropic",
      };
    }

    const content = message.content[0];
    if (content.type !== "text") {
      return { success: false, comparison: null, error: "Unexpected response type", errorStage: "anthropic" };
    }

    // Parse the JSON response
    let data;
    try {
      data = parseGeneratedJson(content.text);
    } catch {
      return { success: false, comparison: null, error: "Failed to parse AI response as JSON", errorStage: "parse" };
    }

    // Transform into ComparisonPageData
    const comparison: ComparisonPageData = {
      id: `gen-${Date.now()}`,
      slug,
      title: data.title || `${entityA} vs ${entityB}`,
      shortAnswer: data.shortAnswer || null,
      keyDifferences: (data.keyDifferences || []).map((kd: Record<string, string>) => ({
        label: kd.label,
        entityAValue: kd.entityAValue,
        entityBValue: kd.entityBValue,
        winner: kd.winner as "a" | "b" | "tie" | undefined,
      })),
      verdict: data.verdict || null,
      category: validateComparisonCategory(data.category || "", data.title || `${entityA} vs ${entityB}`, entityA, entityB),
      entities: (data.entities || []).map((e: Record<string, unknown>, idx: number) => ({
        id: `gen-ent-${idx}-${Date.now()}`,
        slug: String(e.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-+$/g, ""),
        name: String(e.name || ""),
        shortDesc: String(e.shortDesc || ""),
        imageUrl: null,
        entityType: String(e.entityType || "general"),
        position: idx,
        pros: Array.isArray(e.pros) ? e.pros.map(String) : [],
        cons: Array.isArray(e.cons) ? e.cons.map(String) : [],
        bestFor: e.bestFor ? String(e.bestFor) : null,
      })),
      attributes: (data.attributes || []).map((attr: Record<string, unknown>, idx: number) => ({
        id: `gen-attr-${idx}-${Date.now()}`,
        slug: String(attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        name: String(attr.name || ""),
        unit: attr.unit ? String(attr.unit) : null,
        category: attr.category ? String(attr.category) : null,
        dataType: String(attr.dataType || "text"),
        higherIsBetter: typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null,
        values: [
          {
            entityId: `gen-ent-0-${Date.now()}`,
            valueText: attr.entityAValue ? String(attr.entityAValue) : null,
            valueNumber: typeof attr.entityANumber === "number" ? attr.entityANumber : null,
            valueBoolean: null,
            winner: attr.winner === "a" ? true : attr.winner === "b" ? false : undefined,
          },
          {
            entityId: `gen-ent-1-${Date.now()}`,
            valueText: attr.entityBValue ? String(attr.entityBValue) : null,
            valueNumber: typeof attr.entityBNumber === "number" ? attr.entityBNumber : null,
            valueBoolean: null,
            winner: attr.winner === "b" ? true : attr.winner === "a" ? false : undefined,
          },
        ],
      })),
      faqs: (data.faqs || []).map((faq: Record<string, string>) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      relatedComparisons: [],
      relatedBlogPosts: [],
      metadata: {
        metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison`,
        metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} across key attributes.`,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAutoGenerated: true,
        isHumanReviewed: false,
        viewCount: 0,
      },
      citationStats: buildCitationStats(data, tavilySources),
      quickAnswer: buildQuickAnswer(data),
    };

    // Auto-fetch images for entities (non-critical)
    try {
      const images = await fetchEntityImages(
        comparison.entities.map((e) => ({
          name: e.name,
          type: e.entityType,
          slug: e.slug,
        }))
      );
      comparison.entities.forEach((e) => {
        const img = images.get(e.slug);
        if (img) e.imageUrl = img;
      });
    } catch {
      // Images are non-critical — don't break comparison generation
    }

    if (comparison.entities.length < 2) {
      return {
        success: false,
        comparison: null,
        error: "Generation produced fewer than 2 entities",
        errorStage: "parse",
      };
    }

    // DAN-1800 quality gate: reject thin/filler generations so scaled
    // low-value pages stop being minted (spam-update recovery, lever #3).
    const quality = assessComparisonQuality(comparison);
    if (!quality.pass) {
      console.warn(
        `Quality gate rejected ${slug} (score ${quality.score}): ${quality.reasons.join("; ")}`
      );
      return {
        success: false,
        comparison: null,
        error: `Generation failed quality gate: ${quality.reasons.join("; ")}`,
        errorStage: "quality",
      };
    }

    return { success: true, comparison };
  } catch (error) {
    console.error("AI comparison generation failed:", error);
    return {
      success: false,
      comparison: null,
      error: error instanceof Error ? error.message : "Generation failed",
      errorStage: "unknown",
    };
  }
}

function buildCitationStats(
  data: Record<string, unknown>,
  tavilySources: { name: string; url?: string }[]
): CitationStats {
  const aiStats = (data.citationStats || {}) as Record<string, unknown>;
  // Deduplicate sources by hostname
  const seen = new Set<string>();
  const uniqueSources = tavilySources.filter((s) => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
  });

  return {
    sourceCount: uniqueSources.length,
    dataPointCount: typeof aiStats.dataPointCount === "number" ? aiStats.dataPointCount : (data.attributes as unknown[] || []).length + (data.keyDifferences as unknown[] || []).length,
    reviewsAnalyzed: typeof aiStats.reviewsAnalyzed === "number" ? aiStats.reviewsAnalyzed : null,
    preferencePercent: typeof aiStats.preferencePercent === "number" ? aiStats.preferencePercent : null,
    preferenceEntity: typeof aiStats.preferenceEntity === "string" ? aiStats.preferenceEntity : null,
    lastResearched: new Date().toISOString(),
    sources: uniqueSources,
  };
}

function buildQuickAnswer(data: Record<string, unknown>): QuickAnswerTLDR {
  const qa = (data.quickAnswer || {}) as Record<string, unknown>;
  return {
    tldr: typeof qa.tldr === "string" ? qa.tldr : (typeof data.shortAnswer === "string" ? data.shortAnswer : ""),
    winnerName: typeof qa.winnerName === "string" ? qa.winnerName : null,
    winnerReason: typeof qa.winnerReason === "string" ? qa.winnerReason : null,
    keyFact: typeof qa.keyFact === "string" ? qa.keyFact : "",
  };
}

// ============================================================
// N-entity (3+) comparison generation — DAN-387 Phase 1
// ============================================================

function buildMultiPrompt(names: string[]): string {
  const n = names.length;
  return `You are a comparison data expert. Generate a structured comparison between the ${n} entities provided: ${names.map((s) => `"${s}"`).join(", ")}.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "${names.join(" vs ")}",
  "shortAnswer": "2-3 sentence factual summary of the key differences across all ${n} options",
  "keyDifferences": [
    {"label": "Attribute Name", "values": [${names.map(() => '"value"').join(", ")}], "winnerIndex": 0_to_${n - 1}_or_"tie"}
  ],
  "verdict": "3-4 sentence balanced conclusion that includes 'Choose X if... Choose Y if... Choose Z if...' guidance covering every option",
  "category": "one of: ${COMPARISON_CATEGORIES.join(", ")}. Use 'software' for SaaS/apps/AI tools/cloud/dev tools. Use 'automotive' for cars/EVs.",
  "entities": [
${names
  .map(
    (entityName) => `    {
      "name": "${entityName} Full Name",
      "shortDesc": "One-line description",
      "entityType": "person/country/product/team/company/brand/technology/event/software/place",
      "pros": ["pro1", "pro2", "pro3"],
      "cons": ["con1", "con2"],
      "bestFor": "Who should choose this option"
    }`
  )
  .join(",\n")}
  ],
  "attributes": [
    {
      "name": "Attribute Name",
      "unit": "unit or null",
      "category": "Category Group",
      "dataType": "number or text",
      "higherIsBetter": true/false/null,
      "values": [${names.map(() => '"display value"').join(", ")}],
      "numbers": [${names.map(() => "number_or_null").join(", ")}],
      "winnerIndex": 0_to_${n - 1}_or_"tie"
    }
  ],
  "faqs": [
    {"question": "Common question?", "answer": "Detailed answer."}
  ],
  "quickAnswer": {
    "tldr": "Single decisive sentence naming the overall winner across all ${n} options and the deciding factor",
    "winnerName": "One of the ${n} entity names or null if truly tied",
    "winnerReason": "Single most decisive factor",
    "keyFact": "Most compelling statistic"
  },
  "citationStats": {
    "dataPointCount": 20,
    "reviewsAnalyzed": null_or_number,
    "preferencePercent": null_or_number,
    "preferenceEntity": null_or_winning_entity_name
  },
  "metaTitle": "SEO title under 60 chars with 2026",
  "metaDescription": "SEO description under 155 chars"
}

Critical requirements:
- entities[], and every values[] / numbers[] array, MUST have exactly ${n} entries in the same order as listed above.
- Include 5-7 key differences and 6-10 attributes with specific, real data — never vague values like "Good".
- 3-5 pros and 2-3 cons per entity. Be specific and honest.
- Verdict must give a per-entity recommendation covering all ${n} options.
- Keep the year current (2026).`;
}

/**
 * Generate a comparison for N entities (N >= 2). For N=2 this delegates to
 * the legacy generateComparison() to preserve exact behavior on existing 2-way pages.
 * For N>2 it uses a multi-entity prompt that returns position-indexed values[].
 */
export async function generateMultiComparison(
  entityNames: string[],
  slug: string,
  options?: { skipEnrichment?: boolean }
): Promise<GenerationResult> {
  const names = entityNames.map((n) => n.trim()).filter((n) => n.length > 0);
  if (names.length < 2) {
    return { success: false, comparison: null, error: "At least 2 entities required", errorStage: "unknown" };
  }
  if (names.length === 2) {
    return generateComparison(names[0], names[1], slug, options);
  }

  try {
    const client = getClient();

    // Enrich with the first 2 entities (Tavily helper is 2-arg). Better than nothing.
    let tavilyContext = "";
    let tavilySources: { name: string; url?: string }[] = [];
    if (!options?.skipEnrichment) {
      try {
        const enrichment = await enrichComparisonData(names[0], names[1], true);
        tavilyContext = enrichment.context;
        tavilySources = enrichment.sources.map((s) => {
          try {
            return { name: new URL(s.url).hostname.replace(/^www\./, ""), url: s.url };
          } catch {
            return { name: s.title || "web source", url: s.url };
          }
        });
      } catch (err) {
        console.warn("Tavily enrichment failed, proceeding without:", err);
      }
    }

    const promptText = buildMultiPrompt(names);
    let userMessage = `${promptText}\n\nGenerate a comparison for: ${names.map((n) => `"${n}"`).join(" vs ")}`;
    if (tavilyContext) {
      userMessage += `\n\nHere is current real-world data to incorporate into your comparison:\n${tavilyContext}`;
    }

    setPostHogDistinctId(`comparison:${slug}`);

    let message;
    try {
      message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4500,
        messages: [{ role: "user", content: userMessage }],
      });
    } catch (err) {
      const isTimeout =
        err instanceof Error &&
        (err.name === "APIConnectionTimeoutError" || /timeout|timed out/i.test(err.message));
      return {
        success: false,
        comparison: null,
        error: err instanceof Error ? err.message : "Anthropic call failed",
        errorStage: isTimeout ? "timeout" : "anthropic",
      };
    }

    const content = message.content[0];
    if (content.type !== "text") {
      return { success: false, comparison: null, error: "Unexpected response type", errorStage: "anthropic" };
    }

    let data;
    try {
      data = parseGeneratedJson(content.text);
    } catch {
      return { success: false, comparison: null, error: "Failed to parse AI response as JSON", errorStage: "parse" };
    }

    const ts = Date.now();
    const fallbackTitle = names.join(" vs ");

    const transformedEntities = (data.entities || []).slice(0, names.length).map(
      (e: Record<string, unknown>, idx: number) => ({
        id: `gen-ent-${idx}-${ts}`,
        slug: String(e.name || names[idx] || "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/-+$/g, ""),
        name: String(e.name || names[idx] || ""),
        shortDesc: String(e.shortDesc || ""),
        imageUrl: null as string | null,
        entityType: String(e.entityType || "general"),
        position: idx,
        pros: Array.isArray(e.pros) ? e.pros.map(String) : [],
        cons: Array.isArray(e.cons) ? e.cons.map(String) : [],
        bestFor: e.bestFor ? String(e.bestFor) : null,
      })
    );

    const transformedAttributes = (data.attributes || []).map(
      (attr: Record<string, unknown>, idx: number) => {
        const valuesArr = Array.isArray(attr.values) ? (attr.values as unknown[]) : [];
        const numbersArr = Array.isArray(attr.numbers) ? (attr.numbers as unknown[]) : [];
        const winnerIndex = attr.winnerIndex;
        const perEntityValues = transformedEntities.map((ent: { id: string }, eIdx: number) => ({
          entityId: ent.id,
          valueText: valuesArr[eIdx] != null ? String(valuesArr[eIdx]) : null,
          valueNumber:
            typeof numbersArr[eIdx] === "number" ? (numbersArr[eIdx] as number) : null,
          valueBoolean: null,
          winner:
            typeof winnerIndex === "number" && winnerIndex === eIdx
              ? true
              : typeof winnerIndex === "number"
                ? false
                : undefined,
        }));
        return {
          id: `gen-attr-${idx}-${ts}`,
          slug: String(attr.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          name: String(attr.name || ""),
          unit: attr.unit ? String(attr.unit) : null,
          category: attr.category ? String(attr.category) : null,
          dataType: String(attr.dataType || "text"),
          higherIsBetter:
            typeof attr.higherIsBetter === "boolean" ? attr.higherIsBetter : null,
          values: perEntityValues,
        };
      }
    );

    const transformedKeyDifferences = (data.keyDifferences || []).map(
      (kd: Record<string, unknown>) => {
        const valuesArr = Array.isArray(kd.values) ? (kd.values as unknown[]) : [];
        const rawW = kd.winnerIndex;
        const wIdx: number | "tie" | undefined =
          typeof rawW === "number" ? rawW : rawW === "tie" ? "tie" : undefined;
        return {
          label: String(kd.label || ""),
          entityAValue: valuesArr[0] != null ? String(valuesArr[0]) : "",
          entityBValue: valuesArr[1] != null ? String(valuesArr[1]) : "",
          values: valuesArr.map((v) => (v != null ? String(v) : "")),
          winnerIndex: wIdx,
          winner: wIdx === 0 ? "a" : wIdx === 1 ? "b" : wIdx === "tie" ? "tie" : undefined,
        };
      }
    );

    const comparison: ComparisonPageData = {
      id: `gen-${ts}`,
      slug,
      title: data.title || fallbackTitle,
      shortAnswer: data.shortAnswer || null,
      keyDifferences: transformedKeyDifferences,
      verdict: data.verdict || null,
      category: validateComparisonCategory(
        data.category || "",
        data.title || fallbackTitle,
        names[0],
        names[1] || ""
      ),
      entities: transformedEntities,
      attributes: transformedAttributes,
      faqs: (data.faqs || []).map((faq: Record<string, string>) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      relatedComparisons: [],
      relatedBlogPosts: [],
      metadata: {
        metaTitle: data.metaTitle || `${fallbackTitle} | Comparison`,
        metaDescription:
          data.metaDescription || `Compare ${names.join(", ")} across key attributes.`,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAutoGenerated: true,
        isHumanReviewed: false,
        viewCount: 0,
      },
      citationStats: buildCitationStats(data, tavilySources),
      quickAnswer: buildQuickAnswer(data),
    };

    try {
      const images = await fetchEntityImages(
        comparison.entities.map((e) => ({ name: e.name, type: e.entityType, slug: e.slug }))
      );
      comparison.entities.forEach((e) => {
        const img = images.get(e.slug);
        if (img) e.imageUrl = img;
      });
    } catch {
      // Images are non-critical
    }

    if (comparison.entities.length < 2) {
      return {
        success: false,
        comparison: null,
        error: "Generation produced fewer than 2 entities",
        errorStage: "parse",
      };
    }

    // DAN-1800 quality gate (see generateComparison) — applies to N-way too.
    const quality = assessComparisonQuality(comparison);
    if (!quality.pass) {
      console.warn(
        `Quality gate rejected ${slug} (score ${quality.score}): ${quality.reasons.join("; ")}`
      );
      return {
        success: false,
        comparison: null,
        error: `Generation failed quality gate: ${quality.reasons.join("; ")}`,
        errorStage: "quality",
      };
    }

    return { success: true, comparison };
  } catch (error) {
    console.error("AI multi-comparison generation failed:", error);
    return {
      success: false,
      comparison: null,
      error: error instanceof Error ? error.message : "Generation failed",
      errorStage: "unknown",
    };
  }
}
