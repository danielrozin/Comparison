import Link from "next/link";
import { ScrollReveal } from "@/components/layout/ScrollReveal";
import { isHumanReviewedSlug } from "@/lib/editorial/human-reviewed";
import { SITE_URL } from "@/lib/utils/constants";

interface ExpertAnalysisProps {
  analysis: string;
  entityAName: string;
  entityBName: string;
  updatedAt: string;
  /** Compare slug. Daniel's byline renders only when this slug is on HUMAN_REVIEWED_SLUGS. */
  slug?: string;
  /** Overrides the default "Analysis: A vs B" heading (used for 3-way pages). */
  heading?: string;
}

export function ExpertAnalysis({ analysis, entityAName, entityBName, updatedAt, slug, heading }: ExpertAnalysisProps) {
  if (!analysis) return null;

  const humanReviewed = isHumanReviewedSlug(slug);
  const paragraphs = analysis.split(/\n\n+/).filter(Boolean);
  const shown = visibleLeadCount(paragraphs);

  return (
    <ScrollReveal delay={60}>
    <section
      id="expert-analysis"
      aria-labelledby="expert-analysis-heading"
      className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 scroll-mt-28"
    >
      <div className="bg-white border border-border rounded-2xl shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 sm:px-7 py-5 border-b border-border bg-gradient-to-r from-slate-50 to-white flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-sm mt-0.5">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h2 id="expert-analysis-heading" className="text-lg sm:text-xl font-display font-bold text-text">
              {heading ?? `Analysis: ${entityAName} vs ${entityBName}`}
            </h2>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              {humanReviewed && (
                <>
                  <Link
                    href="/authors/daniel-rozin"
                    rel="author"
                    className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-primary-700 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1 rounded"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-500 to-accent-600 flex items-center justify-center ring-1 ring-white shadow-sm flex-shrink-0 group-hover:shadow-md transition-all duration-150" aria-hidden="true">
                      <span className="text-white font-bold text-xs tracking-tight select-none leading-none">DR</span>
                    </div>
                    <span>Daniel Rozin, Editor-in-Chief</span>
                  </Link>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5 leading-none">
                    <svg className="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Human reviewed
                  </span>
                  <span className="text-border text-xs" aria-hidden="true">·</span>
                </>
              )}
              <time
                dateTime={updatedAt}
                className="text-xs text-text-secondary"
              >
                Updated {new Date(updatedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" })}
              </time>
            </div>
          </div>
        </div>

        {/* Analysis body — the lead stays visible; the rest is in a <details> fold.
            A specification table stays in the lead with the heading before it.
            Native <details> keeps the full text in SSR HTML (crawlable by AI/SEO)
            while preventing an overwhelming wall of text on first load. */}
        <div className="px-5 sm:px-7 py-5 sm:py-6 space-y-4">
          {paragraphs.slice(0, shown).map((para, i) => (
            <AnalysisBlock key={i} text={para} />
          ))}
          {paragraphs.length > shown && (
            <details className="group">
              <summary className="list-none cursor-pointer select-none">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-primary-700 group-open:hidden transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Read {paragraphs.length - shown} more paragraph{paragraphs.length - shown !== 1 ? "s" : ""}
                </span>
                <span className="hidden group-open:inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text transition-colors">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                  Show less
                </span>
              </summary>
              <div className="space-y-4 mt-4">
                {paragraphs.slice(shown).map((para, i) => (
                  <AnalysisBlock key={i + shown} text={para} />
                ))}
              </div>
            </details>
          )}
        </div>

        {/* Footer: who wrote this, and how. Compatible with the methodology link. */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-border bg-slate-50 flex items-center gap-2 text-xs text-text-secondary">
          <span>
            Drafted with AI from web research.{" "}
            <Link href={`${SITE_URL}/how-we-write-verdicts`} className="underline hover:text-primary-700 transition-colors">
              How we research
            </Link>
          </span>
        </div>
      </div>
    </section>
    </ScrollReveal>
  );
}

/**
 * Plain paragraphs stay paragraphs. A single "## " line becomes an answer
 * heading, a "-" block becomes a list, and a captioned pipe table becomes
 * a real table. Older analyses have none of these markers.
 */
function AnalysisBlock({ text }: { text: string }) {
  const heading = parseHeading(text);
  if (heading) {
    return <h2 className="text-lg font-display font-bold text-text pt-2">{heading}</h2>;
  }

  const items = parseList(text);
  if (items) {
    return (
      <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-text">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    );
  }

  const table = parseTable(text);
  if (table) {
    return (
      <div className="overflow-x-auto" tabIndex={0} role="region" aria-label={table.caption || "Comparison table"}>
        <table className="w-full border-collapse text-sm">
          {table.caption ? (
            <caption className="pb-3 text-left text-sm text-text-secondary">{table.caption}</caption>
          ) : null}
          <thead>
            <tr>
              {table.headers.map((header) => (
                <th key={header} scope="col" className="border-b border-border px-3 py-2 text-left font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => (
              <tr key={row[0]} className="border-b border-border">
                {row.map((cell, index) =>
                  index === 0 ? (
                    <th key={`${row[0]}-label`} scope="row" className="px-3 py-2 text-left font-medium">
                      {cell}
                    </th>
                  ) : (
                    <td key={`${row[0]}-${index}`} className="px-3 py-2 text-left">
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <p className="text-base leading-relaxed text-text">{text}</p>;
}

/** First three blocks stay open. A later specification table stays open with them, including the heading directly before that table. */
function visibleLeadCount(blocks: string[]): number {
  const tableIndex = blocks.findIndex((block) => parseTable(block) !== null);
  if (tableIndex < 0) return Math.min(3, blocks.length);
  return Math.max(3, tableIndex + 1);
}

function parseHeading(text: string): string | null {
  if (text.includes("\n")) return null;
  const match = /^##\s+(\S.*)$/.exec(text.trim());
  return match ? match[1].trim() : null;
}

function parseList(text: string): string[] | null {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length === 0 || !lines.every((line) => line.startsWith("- "))) return null;
  return lines.map((line) => line.slice(2).trim());
}

function parseTable(text: string): { caption: string; headers: string[]; rows: string[][] } | null {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const start = lines.findIndex((line) => line.startsWith("|"));
  if (start < 0) return null;
  const tableLines = lines.slice(start);
  if (!tableLines.every((line) => line.startsWith("|") && line.endsWith("|"))) return null;

  const cells = (line: string) => line.slice(1, -1).split("|").map((cell) => cell.trim());
  const isSeparator = (line: string) => cells(line).every((cell) => /^:?-{3,}:?$/.test(cell));
  if (!tableLines.some(isSeparator)) return null;

  const headers = cells(tableLines[0]);
  const rows = tableLines.slice(1).filter((line) => !isSeparator(line)).map(cells);
  if (headers.length < 2 || rows.length === 0) return null;
  if (rows.some((row) => row.length !== headers.length)) return null;
  return { caption: lines.slice(0, start).join(" "), headers, rows };
}
