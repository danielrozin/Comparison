import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { organizationSchema, webSiteSchema } from "@/lib/seo/schema";
import { StickyFooterAd } from "@/components/ads/AdUnit";
import { ExperimentProviderServer } from "@/lib/experiments/ExperimentProviderServer";
import { ExitIntentPopup } from "@/components/engagement/ExitIntentPopup";
import { GoogleTagManager } from "@/components/tracking/GoogleTagManager";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { WebVitalsReporter } from "@/components/tracking/WebVitalsReporter";
import { PerformanceBudget } from "@/components/tracking/PerformanceBudget";
import "./globals.css";

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
    title: `${SITE_NAME} — Compare Anything`,
    description: "The internet's best destination for comparisons.",
    images: [`${SITE_URL}/api/og?title=Compare+Anything&type=home`],
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
    types: {
      "application/rss+xml": `${SITE_URL}/feed`,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {ADSENSE_PUB_ID && (
          <script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-${ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
          />
        )}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "w2svnzrk4f");`,
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
      </head>
      <body className="bg-surface text-text font-body min-h-screen flex flex-col overflow-x-hidden">
        <GoogleTagManager />
        <MetaPixel />
        <WebVitalsReporter />
        <PerformanceBudget />
        <ExperimentProviderServer>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FeedbackWidget />
          <StickyFooterAd />
          <ExitIntentPopup />
        </ExperimentProviderServer>
      </body>
    </html>
  );
}
