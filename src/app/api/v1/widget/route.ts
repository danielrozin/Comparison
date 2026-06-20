import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/utils/constants";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  const partner = request.nextUrl.searchParams.get("partner");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing required parameter: slug" },
      { status: 400, headers: corsHeaders }
    );
  }

  const partnerParam = partner ? `&partner=${encodeURIComponent(partner)}` : "";
  const embedUrl = `${SITE_URL}/api/v1/embed/${encodeURIComponent(slug)}?${partnerParam.replace(/^&/, "")}`;

  // Humanise the slug into natural anchor text, e.g. "hubspot-vs-salesforce" -> "HubSpot vs Salesforce".
  // The iframe content is attributed to our own (noindex) embed page and earns ~0 link equity, so the
  // script ALSO injects a followable <a> into the HOST page DOM — that anchor lives on the partner's
  // indexable page and is the only part of the script embed that passes authority back to us.
  const anchorText = slug
    .split("-")
    .map((w) => (w === "vs" ? "vs" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
  const compareUrl = `${SITE_URL}/compare/${encodeURIComponent(slug)}`;

  const js = `(function(){
  var d=document,s=d.currentScript||d.scripts[d.scripts.length-1];
  var container=d.createElement('div');
  container.style.width='100%';
  container.style.maxWidth='640px';
  container.style.margin='0 auto';

  var iframe=d.createElement('iframe');
  iframe.src='${embedUrl}';
  iframe.style.width='100%';
  iframe.style.border='none';
  iframe.style.overflow='hidden';
  iframe.style.minHeight='400px';
  iframe.style.borderRadius='12px';
  iframe.setAttribute('loading','lazy');
  iframe.setAttribute('title','Comparison Widget');

  container.appendChild(iframe);

  var cap=d.createElement('div');
  cap.style.cssText='font:13px/1.4 -apple-system,BlinkMacSystemFont,Roboto,Helvetica,Arial,sans-serif;text-align:center;margin-top:6px';
  var a=d.createElement('a');
  a.href=${JSON.stringify(compareUrl)};
  a.target='_blank';
  a.rel='noopener';
  a.style.cssText='color:#2563eb;text-decoration:none';
  a.textContent=${JSON.stringify(`${anchorText} — full comparison on aversusb.net`)};
  cap.appendChild(a);
  container.appendChild(cap);

  s.parentNode.insertBefore(container,s);

  window.addEventListener('message',function(e){
    if(e.data&&e.data.type==='avsb-resize'&&e.data.height){
      iframe.style.height=e.data.height+'px';
    }
  });
})();`;

  return new NextResponse(js, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
