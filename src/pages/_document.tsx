import { Html, Head, Main, NextScript } from "next/document";
import { organizationSchema, webSiteSchema, dataCatalogSchema, siteNavigationSchema, definedTermSetSchema, webApplicationSchema } from "@/lib/seo/schema";
import { SITE_URL } from "@/lib/utils/constants";

// DAN-432 Phase C: Pages Router shell for /compare/[slug].
// Mirrors the <html>/<head>/<body> scaffold from src/app/layout.tsx so the
// crawlable document is byte-equivalent (modulo the framework wrapper), while
// the route itself escapes App Router's double-serialization (SSR DOM + inline
// RSC flight). Only the /compare/[slug] route is served by the Pages Router;
// every other route keeps using the App Router layout untouched.
//
// The Inter font lives in _app (next/font is not allowed in _document); its
// `--font-inter` CSS variable cascades from a display:contents wrapper there.
const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

export default function Document() {
  return (
    <Html lang="en" className="overflow-x-hidden">
      <Head>
        {/* theme-color + color-scheme — parity with layout.tsx */}
        <meta name="theme-color" content="#1a56db" />
        <meta name="color-scheme" content="light" />
        {/* Identity + license link relations — matches layout.tsx for E-E-A-T parity on Pages Router */}
        <link rel="me" href="https://x.com/aversusb" />
        <link rel="me" href="https://www.linkedin.com/company/aversusb" />
        <link rel="me" href="https://www.youtube.com/@aversusb" />
        <link rel="author" href={`${SITE_URL}/about`} />
        <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
        {/* OpenSearch — enables browser address-bar search shortcut; parity with layout.tsx */}
        <link rel="search" type="application/opensearchdescription+xml" title="A Versus B — Compare Anything" href={`${SITE_URL}/opensearch.xml`} />
        {/* WebMention + pingback — inbound link discovery; parity with layout.tsx */}
        <link rel="webmention" href={`${SITE_URL}/api/webmention`} />
        <link rel="pingback" href={`${SITE_URL}/api/pingback`} />
        {/* author/coverage/distribution/rating — Bing, Yandex, and AI content classifiers
            use these to confirm authorship, global availability, and safe-search eligibility */}
        <meta name="author" content="A Versus B" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
        {/* referrer — send origin on cross-origin requests; parity with layout.tsx */}
        <meta name="referrer" content="origin-when-cross-origin" />
        {/* fediverse:creator — Mastodon/ActivityPub attribution; parity with layout.tsx */}
        <meta name="fediverse:creator" content="@aversusb@mastodon.social" />
        {/* format-detection — disable iOS Safari auto-linking; parity with layout.tsx */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        {/* Preconnect to critical origins — reduces TCP handshake latency for LCP resources.
            Google uses Core Web Vitals (LCP) as a ranking signal; preconnect shaves ~200ms
            off the first-byte time for OG images and the AdSense script on slow connections. */}
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
        {/* Clarity — only loads if analytics consent granted or non-EU without prior choice */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var c=document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);if(c){try{var s=JSON.parse(decodeURIComponent(c[1]));if(!s.analytics)return}catch(e){return}}else{if(document.cookie.indexOf('consent_region=eu')!==-1)return}(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","w2svnzrk4f")})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dataCatalogSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(siteNavigationSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(definedTermSetSchema()),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webApplicationSchema()),
          }}
        />
      </Head>
      <body className="bg-surface text-text font-body min-h-screen flex flex-col overflow-x-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
