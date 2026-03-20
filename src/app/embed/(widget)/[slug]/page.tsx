import { notFound } from "next/navigation";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  return {
    title: comparison ? `${comparison.title} | A Versus B` : "Comparison | A Versus B",
    robots: { index: false, follow: false },
  };
}

export default async function EmbedPage({ params }: PageProps) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  const fullUrl = `${SITE_URL}/compare/${slug}`;

  return (
    <div className="min-h-screen bg-white p-4 font-sans antialiased">
      <div className="mx-auto max-w-xl">
        {/* Card */}
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 text-center text-white">
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
              <div className="mb-6 rounded-lg border-l-4 border-indigo-500 bg-gray-50 p-4 text-sm leading-relaxed text-gray-700">
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
                            className={`py-2.5 ${
                              diff.winner === "a"
                                ? "font-bold text-indigo-600"
                                : "text-gray-700"
                            }`}
                          >
                            {diff.entityAValue}
                          </td>
                          <td className="py-2.5 text-center text-xs text-gray-400">
                            {diff.label}
                          </td>
                          <td
                            className={`py-2.5 text-right ${
                              diff.winner === "b"
                                ? "font-bold text-purple-600"
                                : "text-gray-700"
                            }`}
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
                      className={`mb-2 text-sm font-bold ${
                        idx === 0 ? "text-indigo-600" : "text-purple-600"
                      }`}
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
              <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4">
                <h3 className="mb-1 text-sm font-semibold text-indigo-600">
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
              href={fullUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View full comparison on A Versus B &rarr;
            </a>
            <p className="mt-1 text-xs text-gray-400">Powered by A Versus B</p>
          </div>
        </div>
      </div>
    </div>
  );
}
