import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { unstable_cache } from "next/cache";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget, CookieConsentBanner, BackToTop, ReadingProgress, SearchOverlay, MobileBottomNav, UxStudyBanner } from "@/components/layout/GlobalClientWidgets";
import { organizationSchema, webSiteSchema, dataCatalogSchema, siteNavigationSchema, definedTermSetSchema, webApplicationSchema } from "@/lib/seo/schema";
import { prisma } from "@/lib/db/prisma";
import { canonicalComparisonWhere, CANONICAL_COMPARISON_COUNT_FALLBACK } from "@/lib/db/canonical-comparisons";

// DAN-2112: this fed `numberOfItems` in the site-wide Organization/DataCatalog
// JSON-LD. Counting `status: "published"` alone included the 22 redirect sources,
// so every page on the site told Google Dataset Search we had 491 comparisons when
// 468 exist. Count canonical pages only — see @/lib/db/canonical-comparisons.
const getPublishedComparisonCount = unstable_cache(
  async () => {
    try {
      return await prisma.comparison.count({ where: canonicalComparisonWhere() });
    } catch {
      return CANONICAL_COMPARISON_COUNT_FALLBACK;
    }
  },
  ["published-comparison-count"],
  { revalidate: 3600 }
);
import { ExperimentProviderServer } from "@/lib/experiments/ExperimentProviderServer";
import { GoogleTagManager } from "@/components/tracking/GoogleTagManager";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { ClarityTags } from "@/components/tracking/ClarityTags";
import { FirstTouchAttribution } from "@/components/tracking/FirstTouchAttribution";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

// Self-host Inter via next/font so the stylesheet inline-links the woff2 directly:
// no third-party round-trip to fonts.googleapis.com, no render-blocking <link>,
// and adjustFontFallback reduces the FOUT layout shift that was hurting mobile CLS.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const ADSENSE_PUB_ID = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Compare Anything`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "The internet's best destination for comparisons. Compare sports players, countries, products, technology, and anything else — fast, visual, and data-driven.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Compare Anything`,
    description:
      "Compare sports players, countries, products, technology, and anything else — fast, visual, and data-driven.",
    images: [{
      url: `${SITE_URL}/api/og?title=Compare+Anything&type=home`,
      width: 1200,
      height: 630,
      alt: "A Versus B — Compare Anything",
    }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@aversusb",
    title: `${SITE_NAME} — Compare Anything`,
    description: "The internet's best destination for comparisons.",
    images: [{ url: `${SITE_URL}/api/og?title=Compare+Anything&type=home`, alt: "A Versus B — Compare Anything" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      // hreflang signals — tell search engines this is an English-only site.
      // x-default: canonical URL for language-unmatched visitors.
      // en: same URL confirms English content without redirects.
      // Both are needed for Google to correctly attribute the content language
      // and avoid "missing x-default" Search Console warnings.
      "en": SITE_URL,
      "x-default": SITE_URL,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
      "application/atom+xml": `${SITE_URL}/feed/atom`,
      "application/feed+json": `${SITE_URL}/feed/json`,
      "application/json+oembed": `${SITE_URL}/api/oembed?url=${encodeURIComponent(SITE_URL)}&format=json`,
    },
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const comparisonCount = await getPublishedComparisonCount();
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* theme-color — browser chrome and Android home-screen splash color */}
        <meta name="theme-color" content="#1a56db" />
        {/* color-scheme — tells browser to apply light-mode native controls (inputs, scrollbars)
            even when the OS is in dark mode. Site is light-only; without this, dark OS users
            see dark form elements on a light background, causing contrast failures. */}
        <meta name="color-scheme" content="light" />
        {/* dns-prefetch / preconnect — resolve third-party origins early to reduce LCP.
            preconnect opens TLS for frequently used origins; dns-prefetch for lower-priority ones.
            Faster LCP is a Core Web Vitals signal that directly affects ranking. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://cdn.aversusb.net" crossOrigin="anonymous" />
        {/* Entity images in multi-entity layouts are served directly from Wikipedia/Clearbit —
            preconnect+dns-prefetch so the TLS handshake completes before the browser
            discovers the <img> src, reducing image load time. */}
        <link rel="preconnect" href="https://upload.wikimedia.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://logo.clearbit.com" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        {/* Identity + license link relations — used by AI crawlers for E-E-A-T and training eligibility */}
        <link rel="me" href="https://x.com/aversusb" />
        <link rel="me" href="https://www.linkedin.com/company/aversusb" />
        <link rel="me" href="https://www.youtube.com/@aversusb" />
        <link rel="author" href={`${SITE_URL}/authors/daniel-rozin`} />
        <link rel="license" href="https://creativecommons.org/licenses/by/4.0/" />
        {/* OpenSearch — enables browser address-bar search shortcut (Firefox, Chrome, Safari, Edge) */}
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="A Versus B — Compare Anything"
          href={`${SITE_URL}/opensearch.xml`}
        />
        {/* WebMention — W3C standard; CMS platforms (WordPress, Ghost, micro.blog) POST
            inbound links here; accelerates backlink discovery before Google crawls the source */}
        <link rel="webmention" href={`${SITE_URL}/api/webmention`} />
        {/* pingback — XML-RPC blog backlink discovery; WordPress/Ghost sites POST here when
            they link to aversusb.net, accelerating inbound link indexing */}
        <link rel="pingback" href={`${SITE_URL}/api/pingback`} />
        {/* fediverse:creator — Mastodon/Threads/ActivityPub attribution tag.
            When aversusb.net pages are shared on the Fediverse, this links the
            content to the @aversusb@mastodon.social identity for E-E-A-T signals */}
        <meta name="fediverse:creator" content="@aversusb@mastodon.social" />
        {/* referrer — send origin (no path) on cross-origin requests; omit on downgrade.
            Gives analytics accurate referrer data without leaking user paths */}
        <meta name="referrer" content="origin-when-cross-origin" />
        {/* format-detection — disable auto-linking of phone numbers/emails on iOS Safari
            which can cause layout shifts and unintended tap targets */}
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
        {/* author/coverage/distribution/rating — Bing, Yandex, and AI content classifiers
            use these to confirm authorship, global availability, and safe-search eligibility */}
        <meta name="author" content="A Versus B" />
        <meta name="coverage" content="Worldwide" />
        <meta name="distribution" content="Global" />
        <meta name="rating" content="General" />
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
            __html: JSON.stringify(organizationSchema(comparisonCount)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webSiteSchema(comparisonCount)),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(dataCatalogSchema(comparisonCount)),
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
      </head>
      <body className="bg-surface text-text font-body min-h-screen flex flex-col overflow-x-hidden">
        <a href="#main-content" className="skip-nav">Skip to main content</a>
        <GoogleTagManager />
        <MetaPixel />
        <ClarityTags />
        <FirstTouchAttribution />
        <ExperimentProviderServer>
          <UxStudyBanner />
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <ReadingProgress />
          <FeedbackWidget />
          <CookieConsentBanner />
          <BackToTop />
          <SearchOverlay />
          <MobileBottomNav />
          {/* Spacer so footer content doesn't hide behind the fixed mobile bottom nav */}
          <div className="md:hidden h-14" style={{ paddingBottom: "env(safe-area-inset-bottom)" }} aria-hidden="true" />
        </ExperimentProviderServer>
        {/* DAN-1645: Vercel Speed Insights (RUM) — site-wide real-user CWV so
            /compare field data is comparable against other routes. */}
        <SpeedInsights />
      </body>
    </html>
  );
}
