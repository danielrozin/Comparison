"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { getConsentFromCookie } from "@/lib/utils/consent";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixel() {
  const [hasMarketingConsent, setHasMarketingConsent] = useState(false);

  useEffect(() => {
    const consent = getConsentFromCookie();
    // Load Meta Pixel only if marketing consent is granted,
    // or if no consent cookie exists and user is non-EU (consent_region != eu)
    if (consent) {
      setHasMarketingConsent(consent.marketing);
    } else {
      const isEU = document.cookie.indexOf("consent_region=eu") !== -1;
      setHasMarketingConsent(!isEU);
    }
  }, []);

  if (!META_PIXEL_ID || !hasMarketingConsent) return null;

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
