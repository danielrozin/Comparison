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
