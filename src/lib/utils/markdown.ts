/**
 * Long-form markdown → HTML renderer used by /best/[slug] roundup pages.
 *
 * Adds two features the /blog/[slug] renderer doesn't have:
 *   1. Heading anchors via trailing `{#slug}` syntax — `## Title {#id}` becomes
 *      `<h2 id="id">Title</h2>` so cross-references inside the body work.
 *   2. Slug auto-fallback — headings without explicit anchors get a kebab id
 *      derived from the text, so `[...](#section)` links resolve.
 *
 * Intentionally minimal: handles headings, paragraphs, GFM tables, unordered
 * lists, bold/italic, links, and fenced code. Anything richer (footnotes,
 * task lists, MDX) is out of scope for v1 — the roundup drafts don't use it.
 */

const HEADING_ANCHOR_RE = /\s*\{#([a-z0-9-]+)\}\s*$/;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderHeading(level: 2 | 3, raw: string): string {
  const anchorMatch = raw.match(HEADING_ANCHOR_RE);
  const explicitId = anchorMatch?.[1];
  const text = explicitId ? raw.replace(HEADING_ANCHOR_RE, "") : raw;
  const id = explicitId ?? slugify(text);
  if (level === 2) {
    return `<h2 id="${id}" class="text-2xl font-bold text-text mt-10 mb-4 pb-2 border-b border-border scroll-mt-24">${text}</h2>`;
  }
  return `<h3 id="${id}" class="text-xl font-bold text-text mt-8 mb-3 scroll-mt-24">${text}</h3>`;
}

export function renderRoundupMarkdown(md: string): string {
  let html = md;

  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
    return `<pre class="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto my-4 text-sm leading-relaxed"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  html = html.replace(/((?:\|.+\|\n)+)/g, (tableBlock: string) => {
    const rows = tableBlock.trim().split("\n");
    if (rows.length < 2) return tableBlock;

    let tableHtml =
      '<div class="overflow-x-auto my-6"><table class="w-full border-collapse rounded-lg overflow-hidden">';

    let headerEmitted = false;
    rows.forEach((row, idx) => {
      if (/^\|[\s\-:|]+\|$/.test(row)) return;

      const cells = row.split("|").filter((c) => c.trim() !== "");

      if (!headerEmitted) {
        tableHtml += "<thead><tr>";
        cells.forEach((cell) => {
          tableHtml += `<th class="bg-primary-50 px-4 py-3 text-left text-sm font-semibold text-text border-b border-border">${cell.trim()}</th>`;
        });
        tableHtml += "</tr></thead><tbody>";
        headerEmitted = true;
      } else {
        tableHtml += `<tr class="${idx % 2 === 0 ? "bg-surface-alt" : "bg-white"}">`;
        cells.forEach((cell) => {
          tableHtml += `<td class="px-4 py-3 text-sm text-text-secondary border-b border-border">${cell.trim()}</td>`;
        });
        tableHtml += "</tr>";
      }
    });

    tableHtml += "</tbody></table></div>";
    return tableHtml;
  });

  const lines = html.split("\n");
  const out: string[] = [];
  let inList = false;

  for (const line of lines) {
    if (line.startsWith("### ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(renderHeading(3, line.slice(4).trim()));
      continue;
    }
    if (line.startsWith("## ")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(renderHeading(2, line.slice(3).trim()));
      continue;
    }
    if (/^---\s*$/.test(line)) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push('<hr class="my-8 border-border" />');
      continue;
    }
    if (/^[-*]\s/.test(line)) {
      if (!inList) {
        out.push('<ul class="list-disc list-inside space-y-2 my-4 text-text-secondary">');
        inList = true;
      }
      out.push(`<li>${line.replace(/^[-*]\s/, "")}</li>`);
      continue;
    }
    if (inList && line.trim() === "") {
      out.push("</ul>");
      inList = false;
    }
    if (line.trim() !== "" && !line.startsWith("<")) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p class="text-text-secondary leading-relaxed my-4">${line}</p>`);
    } else {
      out.push(line);
    }
  }
  if (inList) out.push("</ul>");

  html = out.join("\n");

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text font-semibold">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-primary-600 hover:text-primary-700 underline underline-offset-2">$1</a>'
  );

  return html;
}

export function countWords(md: string): number {
  return md.split(/\s+/).filter(Boolean).length;
}
