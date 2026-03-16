/**
 * AI Comparison Generator
 * Uses Claude API to generate comparison data for new/unknown comparisons
 * Server-side only — never import in client components
 */

import Anthropic from "@anthropic-ai/sdk";
import type { ComparisonPageData } from "@/types";

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error("ANTHROPIC_API_KEY not configured");
  }
  return new Anthropic({ apiKey });
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
  "category": "one of: sports, countries, technology, products, companies, brands, history, economy, military, science, entertainment, general",
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
  "metaTitle": "SEO title under 60 chars with current year",
  "metaDescription": "SEO description under 155 chars"
}

Requirements:
- Include 5-7 key differences
- Include 5-8 attributes with real data
- Include 3-5 FAQs
- Include 3-5 pros and 2-3 cons per entity
- Be factual and balanced
- Use real statistics and data where possible
- Keep the year current (2026)`;

export interface GenerationResult {
  success: boolean;
  comparison: ComparisonPageData | null;
  error?: string;
}

export async function generateComparison(
  entityA: string,
  entityB: string,
  slug: string
): Promise<GenerationResult> {
  try {
    const client = getClient();

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: `${GENERATION_PROMPT}\n\nGenerate a comparison for: "${entityA}" vs "${entityB}"`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      return { success: false, comparison: null, error: "Unexpected response type" };
    }

    // Parse the JSON response
    let data;
    try {
      // Try to extract JSON if wrapped in code blocks
      let jsonText = content.text.trim();
      const jsonMatch = jsonText.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        jsonText = jsonMatch[1].trim();
      }
      data = JSON.parse(jsonText);
    } catch {
      return { success: false, comparison: null, error: "Failed to parse AI response as JSON" };
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
      category: data.category || "general",
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
      metadata: {
        metaTitle: data.metaTitle || `${entityA} vs ${entityB} | Comparison`,
        metaDescription: data.metaDescription || `Compare ${entityA} and ${entityB} across key attributes.`,
        publishedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isAutoGenerated: true,
        isHumanReviewed: false,
        viewCount: 0,
      },
    };

    return { success: true, comparison };
  } catch (error) {
    console.error("AI comparison generation failed:", error);
    return {
      success: false,
      comparison: null,
      error: error instanceof Error ? error.message : "Generation failed",
    };
  }
}
