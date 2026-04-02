"use client";

import React from "react";
import { ComparisonWidget } from "./ComparisonWidget";
import { CTABlock } from "./CTABlock";
import { ProTip } from "./ProTip";

/**
 * Runtime MDX-like renderer.
 * Splits markdown HTML into segments, replacing custom component tags
 * (<ComparisonWidget />, <CTABlock />, <ProTip />) with real React components.
 *
 * Content is stored as markdown in the DB and pre-rendered to HTML on the server.
 * This component handles the interactive/component parts client-side.
 */

interface MDXRendererProps {
  html: string;
  rawMarkdown: string;
}

// Parse props from a tag string like `slug="messi-vs-ronaldo" title="Messi vs Ronaldo"`
function parseProps(propsStr: string): Record<string, string> {
  const props: Record<string, string> = {};
  const regex = /(\w+)="([^"]*)"/g;
  let match;
  while ((match = regex.exec(propsStr)) !== null) {
    props[match[1]] = match[2];
  }
  return props;
}

// Match self-closing component tags: <ComponentName prop="value" />
// and block component tags: <ComponentName prop="value">content</ComponentName>
const COMPONENT_REGEX =
  /<(ComparisonWidget|CTABlock|ProTip)(\s[^>]*)?\s*\/?>(?:([\s\S]*?)<\/\1>)?/g;

function renderComponent(
  name: string,
  props: Record<string, string>,
  children?: string
): React.ReactNode {
  switch (name) {
    case "ComparisonWidget":
      return <ComparisonWidget slug={props.slug || ""} title={props.title} />;
    case "CTABlock":
      return (
        <CTABlock
          title={props.title}
          description={props.description}
          buttonText={props.buttonText}
          href={props.href}
          variant={props.variant as "primary" | "newsletter" | undefined}
        />
      );
    case "ProTip":
      return (
        <ProTip type={props.type as "tip" | "warning" | "info" | undefined}>
          {children || props.children || ""}
        </ProTip>
      );
    default:
      return null;
  }
}

export function MDXRenderer({ html, rawMarkdown }: MDXRendererProps) {
  // Check both raw markdown and rendered HTML for component tags
  const source = COMPONENT_REGEX.test(rawMarkdown) ? rawMarkdown : html;
  COMPONENT_REGEX.lastIndex = 0;

  // If no custom components found, render plain HTML
  if (!COMPONENT_REGEX.test(source)) {
    return (
      <div
        className="prose-custom"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  COMPONENT_REGEX.lastIndex = 0;

  // Split content around component tags
  const segments: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;
  let key = 0;

  // Use the raw markdown as source for splitting since component tags may
  // get mangled by the HTML renderer. We'll need to re-render the markdown
  // segments that sit between components.
  const useRaw = COMPONENT_REGEX.test(rawMarkdown);
  COMPONENT_REGEX.lastIndex = 0;
  const content = useRaw ? rawMarkdown : html;

  while ((match = COMPONENT_REGEX.exec(content)) !== null) {
    // Add preceding content
    if (match.index > lastIndex) {
      const preceding = content.slice(lastIndex, match.index);
      if (useRaw) {
        // For raw markdown segments, use the pre-rendered HTML approach
        segments.push(
          <div
            key={key++}
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: renderMarkdownSegment(preceding) }}
          />
        );
      } else {
        segments.push(
          <div
            key={key++}
            className="prose-custom"
            dangerouslySetInnerHTML={{ __html: preceding }}
          />
        );
      }
    }

    const componentName = match[1];
    const propsStr = match[2] || "";
    const childContent = match[3];
    const props = parseProps(propsStr);

    segments.push(
      <React.Fragment key={key++}>
        {renderComponent(componentName, props, childContent)}
      </React.Fragment>
    );

    lastIndex = match.index + match[0].length;
  }

  // Add remaining content
  if (lastIndex < content.length) {
    const remaining = content.slice(lastIndex);
    if (useRaw) {
      segments.push(
        <div
          key={key++}
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: renderMarkdownSegment(remaining) }}
        />
      );
    } else {
      segments.push(
        <div
          key={key++}
          className="prose-custom"
          dangerouslySetInnerHTML={{ __html: remaining }}
        />
      );
    }
  }

  return <>{segments}</>;
}

/**
 * Minimal markdown-to-HTML for segments between components.
 * Mirrors the logic in the blog [slug] page server renderer.
 */
function renderMarkdownSegment(md: string): string {
  let html = md;

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Tables
  html = html.replace(/((?:\|.+\|\n)+)/g, (tableBlock: string) => {
    const rows = tableBlock.trim().split("\n");
    if (rows.length < 2) return tableBlock;
    let t = '<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-lg overflow-hidden">';
    rows.forEach((row, idx) => {
      if (/^\|[\s-:|]+\|$/.test(row)) return;
      const cells = row.split("|").filter((c) => c.trim() !== "");
      if (idx === 0) {
        t += "<thead><tr>";
        cells.forEach((cell) => {
          t += `<th class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${cell.trim()}</th>`;
        });
        t += "</tr></thead><tbody>";
      } else {
        t += `<tr class="${idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}">`;
        cells.forEach((cell) => {
          t += `<td class="px-4 py-3 text-sm text-text-secondary border-b border-border">${cell.trim()}</td>`;
        });
        t += "</tr>";
      }
    });
    t += "</tbody></table></div>";
    return t;
  });

  // Line-by-line: headings, lists, paragraphs
  const lines = html.split("\n");
  const processed: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      const text = line.slice(4);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      processed.push(`<h3 id="${id}" class="text-xl font-bold text-text mt-8 mb-3">${text}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      const text = line.slice(3);
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      processed.push(`<h2 id="${id}" class="text-2xl font-bold text-text mt-10 mb-4 pb-2 border-b border-border">${text}</h2>`);
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      if (!inList) { processed.push('<ul class="list-disc list-inside space-y-2 my-4 text-text-secondary">'); inList = true; }
      processed.push(`<li>${line.replace(/^[-*]\s/, "")}</li>`);
      continue;
    }
    if (inList && line.trim() === "") {
      processed.push("</ul>");
      inList = false;
    }
    if (line.trim() !== "" && !line.startsWith("<")) {
      if (inList) { processed.push("</ul>"); inList = false; }
      processed.push(`<p class="text-text-secondary leading-relaxed my-4">${line}</p>`);
    } else {
      processed.push(line);
    }
  }
  if (inList) processed.push("</ul>");

  html = processed.join("\n");

  // Inline formatting
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary-600 hover:text-primary-700 underline underline-offset-2">$1</a>'
  );

  return html;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
