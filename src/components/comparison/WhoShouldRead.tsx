import type { ComparisonPageData } from "@/types";

const CATEGORY_PERSONA_MAP: Record<string, { who: string; useCase: string }> = {
  sports: { who: "sports fans and analysts", useCase: "settle debates or research player/team performance" },
  countries: { who: "students, researchers, and travelers", useCase: "compare economies, cultures, or living conditions" },
  technology: { who: "tech professionals and buyers", useCase: "evaluate hardware or software before purchasing" },
  products: { who: "consumers comparing before purchase", useCase: "find the best option for their needs and budget" },
  companies: { who: "investors, job seekers, and business analysts", useCase: "evaluate business performance and culture" },
  health: { who: "patients, caregivers, and health enthusiasts", useCase: "understand medical options or health metrics" },
  automotive: { who: "car buyers and enthusiasts", useCase: "compare vehicles by features, price, and reliability" },
  history: { who: "students and history enthusiasts", useCase: "understand historical events, figures, and periods" },
  entertainment: { who: "pop culture fans and critics", useCase: "compare movies, shows, artists, or games" },
  brands: { who: "consumers and brand analysts", useCase: "evaluate brand reputation, quality, and value" },
  software: { who: "developers and business teams", useCase: "choose the right tool or platform for their workflow" },
};

function inferPersona(comparison: ComparisonPageData): { who: string; useCase: string } {
  const cat = (comparison.category || "").toLowerCase();
  return (
    CATEGORY_PERSONA_MAP[cat] ||
    { who: "anyone making a side-by-side decision", useCase: "find clear differences and make an informed choice" }
  );
}

export function WhoShouldRead({ comparison }: { comparison: ComparisonPageData }) {
  const entityA = comparison.entities[0]?.name || "";
  const entityB = comparison.entities[1]?.name || "";
  const { who, useCase } = inferPersona(comparison);

  const speakableText = `This comparison of ${entityA} vs ${entityB} is for ${who} who want to ${useCase}.`;

  return (
    <div
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-4"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <div className="bg-primary-50 border border-primary-100 rounded-xl px-5 py-3 flex items-start gap-3">
        <svg
          className="w-4 h-4 text-primary-500 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
        </svg>
        <p
          className="text-sm text-primary-700 leading-relaxed"
          itemProp="description"
          speakable-selector="true"
        >
          <span className="font-semibold">Who this is for:</span>{" "}
          <span itemProp="text">{speakableText}</span>
        </p>
      </div>

      {/* SpeakableSpecification for AI voice / GEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SpeakableSpecification",
            cssSelector: "[speakable-selector]",
          }),
        }}
      />
    </div>
  );
}
