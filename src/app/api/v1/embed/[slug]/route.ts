import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { SITE_URL } from "@/lib/utils/constants";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);

  if (!comparison) {
    return new NextResponse(
      `<html><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>Comparison not found</h2></body></html>`,
      { status: 404, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const entityA = comparison.entities[0];
  const entityB = comparison.entities[1];
  const fullUrl = `${SITE_URL}/compare/${slug}`;

  const diffRows = comparison.keyDifferences
    .map((diff) => {
      const winnerA = diff.winner === "a" ? "font-weight:700;color:#4f46e5;" : "";
      const winnerB = diff.winner === "b" ? "font-weight:700;color:#7c3aed;" : "";
      return `<tr>
        <td style="${winnerA}padding:10px 12px;border-bottom:1px solid #e5e7eb;">${escapeHtml(diff.entityAValue)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;color:#6b7280;font-size:13px;">${escapeHtml(diff.label)}</td>
        <td style="${winnerB}padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${escapeHtml(diff.entityBValue)}</td>
      </tr>`;
    })
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(comparison.title)}</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1f2937;background:#fff;padding:20px;max-width:640px;margin:0 auto}
.card{border:1px solid #e5e7eb;border-radius:12px;overflow:hidden}
.header{background:linear-gradient(135deg,#4f46e5,#7c3aed);color:#fff;padding:20px 24px;text-align:center}
.header h1{font-size:20px;font-weight:700;margin-bottom:6px}
.header p{font-size:13px;opacity:0.9}
.content{padding:20px 24px}
.short-answer{font-size:14px;line-height:1.6;color:#374151;margin-bottom:20px;padding:12px 16px;background:#f9fafb;border-radius:8px;border-left:3px solid #4f46e5}
.diff-table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px}
.diff-table th{padding:10px 12px;border-bottom:2px solid #e5e7eb;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280}
.verdict{padding:16px;background:linear-gradient(135deg,#eef2ff,#f5f3ff);border-radius:8px;margin-bottom:16px}
.verdict h3{font-size:14px;font-weight:600;color:#4f46e5;margin-bottom:6px}
.verdict p{font-size:13px;line-height:1.6;color:#374151}
.footer{text-align:center;padding:16px;border-top:1px solid #e5e7eb}
.footer a{color:#4f46e5;text-decoration:none;font-size:13px;font-weight:500}
.footer a:hover{text-decoration:underline}
.brand{font-size:11px;color:#9ca3af;margin-top:8px}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    <h1>${escapeHtml(comparison.title)}</h1>
    <p>${entityA ? escapeHtml(entityA.name) : "A"} vs ${entityB ? escapeHtml(entityB.name) : "B"}</p>
  </div>
  <div class="content">
    ${comparison.shortAnswer ? `<div class="short-answer">${escapeHtml(comparison.shortAnswer)}</div>` : ""}
    ${comparison.keyDifferences.length > 0 ? `
    <table class="diff-table">
      <thead><tr>
        <th style="text-align:left">${entityA ? escapeHtml(entityA.name) : "A"}</th>
        <th style="text-align:center">Category</th>
        <th style="text-align:right">${entityB ? escapeHtml(entityB.name) : "B"}</th>
      </tr></thead>
      <tbody>${diffRows}</tbody>
    </table>` : ""}
    ${comparison.verdict ? `<div class="verdict"><h3>Verdict</h3><p>${escapeHtml(comparison.verdict)}</p></div>` : ""}
  </div>
  <div class="footer">
    <a href="${fullUrl}" target="_blank" rel="noopener">View full comparison on A Versus B &rarr;</a>
    <div class="brand">Powered by A Versus B</div>
  </div>
</div>
<script>
// Notify parent of height for auto-resize
function notifyHeight(){
  var h=document.documentElement.scrollHeight;
  window.parent.postMessage({type:'avsb-resize',height:h},'*');
}
window.addEventListener('load',notifyHeight);
new MutationObserver(notifyHeight).observe(document.body,{childList:true,subtree:true});
</script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" },
  });
}
