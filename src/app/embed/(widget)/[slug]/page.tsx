import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { getEmbedPartnerByKey, type EmbedPartnerConfig } from "@/lib/services/embed-partner-service";
import { SITE_URL } from "@/lib/utils/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ partner?: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  return {
    title: comparison ? `${comparison.title} | Comparison` : "Comparison",
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { partner: partnerKey } = await searchParams;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  let partner: EmbedPartnerConfig | null = null;
  if (partnerKey) {
    partner = await getEmbedPartnerByKey(partnerKey);
  }

  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  const fullUrl = `${SITE_URL}/compare/${slug}`;

  const primaryColor = partner?.primaryColor || "#4f46e5";
  const accentColor = partner?.accentColor || "#7c3aed";
  const brandName = partner?.brandName || "A Versus B";
  const hideBranding = partner?.hideBranding || false;
  const footerText = partner?.customFooterText || `View full comparison on ${brandName}`;
  const footerUrl = partner?.customFooterUrl || fullUrl;

  return (
    <div className="min-h-screen bg-white p-4 font-sans antialiased">
      <div className="mx-auto max-w-xl">
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {/* Header */}
          <div
            className="px-6 py-5 text-center text-white"
            style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}
          >
            {partner?.logoUrl && (
              <img
                src={partner.logoUrl}
                alt={brandName}
                className="mx-auto mb-2"
                style={{ maxHeight: 28 }}
              />
            )}
            <h1 className="text-xl font-bold">{comparison.title}</h1>
            {entityA && entityB && (
              <p className="mt-1 text-sm text-white/90">
                {entityA.name} vs {entityB.name}
              </p>
            )}
          </div>

          <div className="p-6">
            {/* Short Answer */}
            {comparison.shortAnswer && (
              <div
                className="mb-6 rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-700"
                style={{ borderLeft: `4px solid ${primaryColor}` }}
              >
                {comparison.shortAnswer}
              </div>
            )}

            {/* Key Differences Table */}
            {comparison.keyDifferences.length > 0 && (
              <div className="mb-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                  Key Differences
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="pb-2 text-left font-semibold text-gray-700">
                          {entityA?.name || "A"}
                        </th>
                        <th className="pb-2 text-center font-semibold text-gray-500">
                          Category
                        </th>
                        <th className="pb-2 text-right font-semibold text-gray-700">
                          {entityB?.name || "B"}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.keyDifferences.map((diff, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td
                            className="py-2.5 text-gray-700"
                            style={diff.winner === "a" ? { fontWeight: 700, color: primaryColor } : undefined}
                          >
                            {diff.entityAValue}
                          </td>
                          <td className="py-2.5 text-center text-xs text-gray-400">
                            {diff.label}
                          </td>
                          <td
                            className="py-2.5 text-right text-gray-700"
                            style={diff.winner === "b" ? { fontWeight: 700, color: accentColor } : undefined}
                          >
                            {diff.entityBValue}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Entity Cards with Pros */}
            {entityA && entityB && (
              <div className="mb-6 grid grid-cols-2 gap-3">
                {[entityA, entityB].map((entity, idx) => (
                  <div
                    key={entity.id}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <h3
                      className="mb-2 text-sm font-bold"
                      style={{ color: idx === 0 ? primaryColor : accentColor }}
                    >
                      {entity.name}
                    </h3>
                    {entity.pros.length > 0 && (
                      <ul className="space-y-1">
                        {entity.pros.slice(0, 3).map((pro, j) => (
                          <li
                            key={j}
                            className="flex items-start gap-1 text-xs text-gray-600"
                          >
                            <span className="mt-0.5 text-green-500">+</span>
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Verdict */}
            {comparison.verdict && (
              <div
                className="rounded-lg p-4"
                style={{ background: `linear-gradient(135deg, ${primaryColor}10, ${accentColor}10)` }}
              >
                <h3 className="mb-1 text-sm font-semibold" style={{ color: primaryColor }}>
                  Verdict
                </h3>
                <p className="text-sm leading-relaxed text-gray-700">
                  {comparison.verdict}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 text-center">
            <a
              href={footerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:underline"
              style={{ color: primaryColor }}
            >
              {footerText} &rarr;
            </a>
            {!hideBranding && (
              <p className="mt-1 text-xs text-gray-400">Powered by {brandName}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
