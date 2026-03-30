import { NextRequest, NextResponse } from "next/server";
import { getComparisonBySlug } from "@/lib/services/comparison-service";
import { getEmbedPartnerByKey, incrementEmbedViews, type EmbedPartnerConfig } from "@/lib/services/embed-partner-service";
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
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const partnerKey = request.nextUrl.searchParams.get("partner");

  // Resolve partner config if provided
  let partner: EmbedPartnerConfig | null = null;
  if (partnerKey) {
    partner = await getEmbedPartnerByKey(partnerKey);
    if (partner) {
      const allowed = await incrementEmbedViews(partnerKey);
      if (!allowed) {
        return new NextResponse(
          `<html><body style="font-family:sans-serif;text-align:center;padding:40px"><h2>Monthly embed view limit reached</h2><p>Please upgrade your plan.</p></body></html>`,
          { status: 429, headers: { ...corsHeaders, "Content-Type": "text/html; charset=utf-8" } }
        );
      }
    }
  }

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

  // White-label colors
  const primaryColor = partner?.primaryColor || "#4f46e5";
  const accentColor = partner?.accentColor || "#7c3aed";
  const brandName = partner?.brandName || "A Versus B";
  const hideBranding = partner?.hideBranding || false;
  const footerText = partner?.customFooterText || `View full comparison on ${brandName}`;
  const footerUrl = partner?.customFooterUrl || fullUrl;
  const poweredBy = hideBranding ? "" : `<div class="brand">Powered by ${escapeHtml(brandName)}</div>`;

  const logoHtml = partner?.logoUrl
    ? `<img src="${escapeHtml(partner.logoUrl)}" alt="${escapeHtml(brandName)}" style="max-height:28px;margin-bottom:8px;" />`
    : "";

  const diffRows = comparison.keyDifferences
    .map((diff) => {
      const winnerA = diff.winner === "a" ? `font-weight:700;color:${primaryColor};` : "";
      const winnerB = diff.winner === "b" ? `font-weight:700;color:${accentColor};` : "";
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
.header{background:linear-gradient(135deg,${primaryColor},${accentColor});color:#fff;padding:20px 24px;text-align:center}
.header h1{font-size:20px;font-weight:700;margin-bottom:6px}
.header p{font-size:13px;opacity:0.9}
.content{padding:20px 24px}
.short-answer{font-size:14px;line-height:1.6;color:#374151;margin-bottom:20px;padding:12px 16px;background:#f9fafb;border-radius:8px;border-left:3px solid ${primaryColor}}
.diff-table{width:100%;border-collapse:collapse;margin-bottom:20px;font-size:14px}
.diff-table th{padding:10px 12px;border-bottom:2px solid #e5e7eb;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;color:#6b7280}
.verdict{padding:16px;background:linear-gradient(135deg,${primaryColor}10,${accentColor}10);border-radius:8px;margin-bottom:16px}
.verdict h3{font-size:14px;font-weight:600;color:${primaryColor};margin-bottom:6px}
.verdict p{font-size:13px;line-height:1.6;color:#374151}
.footer{text-align:center;padding:16px;border-top:1px solid #e5e7eb}
.footer a{color:${primaryColor};text-decoration:none;font-size:13px;font-weight:500}
.footer a:hover{text-decoration:underline}
.brand{font-size:11px;color:#9ca3af;margin-top:8px}
</style>
</head>
<body>
<div class="card">
  <div class="header">
    ${logoHtml}
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
    <a href="${escapeHtml(footerUrl)}" target="_blank" rel="noopener">${escapeHtml(footerText)} &rarr;</a>
    ${poweredBy}
  </div>
</div>
<script>
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
