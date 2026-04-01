"use client";

import Script from "next/script";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-0BWYZ5V9QK";
const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

/**
 * Inline script that sets Google Consent Mode v2 defaults BEFORE
 * gtag.js / GTM loads. Reads the cookie_consent cookie to restore
 * previous choices, otherwise defaults to denied for EU (via
 * consent_region cookie set by middleware) or granted for non-EU.
 */
const CONSENT_DEFAULTS_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(){var c=document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);if(c){try{var s=JSON.parse(decodeURIComponent(c[1]));gtag('consent','default',{analytics_storage:s.analytics?'granted':'denied',ad_storage:s.marketing?'granted':'denied',ad_user_data:s.marketing?'granted':'denied',ad_personalization:s.marketing?'granted':'denied',functionality_storage:s.functional?'granted':'denied',personalization_storage:s.functional?'granted':'denied',security_storage:'granted'});return}catch(e){}}var isEU=document.cookie.indexOf('consent_region=eu')!==-1;var d=isEU?'denied':'granted';gtag('consent','default',{analytics_storage:d,ad_storage:d,ad_user_data:d,ad_personalization:d,functionality_storage:d,personalization_storage:d,security_storage:'granted',wait_for_update:500})})();`;

export function GoogleTagManager() {
  // If GTM is configured, use GTM (it manages GA4 + Google Ads tags)
  if (GTM_ID) {
    return (
      <>
        {/* Consent Mode v2 defaults — must run before GTM */}
        <Script
          id="consent-defaults"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }}
        />
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
      </>
    );
  }

  // Fallback: direct gtag.js for GA4 + optional Google Ads
  return (
    <>
      {/* Consent Mode v2 defaults — must run before gtag */}
      <Script
        id="consent-defaults"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULTS_SCRIPT }}
      />
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `gtag('js',new Date());gtag('config','${GA_ID}');${GOOGLE_ADS_ID ? `gtag('config','${GOOGLE_ADS_ID}');` : ""}`,
        }}
      />
    </>
  );
}
