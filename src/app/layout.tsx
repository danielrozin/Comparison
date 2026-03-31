import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import { ConsentScripts } from "@/components/consent/ConsentScripts";
import { ExperimentProvider } from "@/lib/experiments";
import { organizationSchema } from "@/lib/seo/schema";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  variable: "--font-inter",
});

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
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Consent Mode v2 — must run BEFORE gtag loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
(function(){var c=document.cookie.match(/(?:^|; )cookie_consent=([^;]*)/);if(c){try{var s=JSON.parse(decodeURIComponent(c[1]));gtag('consent','default',{analytics_storage:s.analytics?'granted':'denied',ad_storage:s.marketing?'granted':'denied',ad_user_data:s.marketing?'granted':'denied',ad_personalization:s.marketing?'granted':'denied',functionality_storage:s.functional?'granted':'denied',personalization_storage:s.functional?'granted':'denied',security_storage:'granted'});return}catch(e){}}var isEU=document.cookie.indexOf('consent_region=eu')!==-1;var d=isEU?'denied':'granted';gtag('consent','default',{analytics_storage:d,ad_storage:d,ad_user_data:d,ad_personalization:d,functionality_storage:d,personalization_storage:d,security_storage:'granted',wait_for_update:500})})();`,
          }}
        />
        {/* gtag.js — loads in consent mode, respects consent state */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `gtag('js', new Date());gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');`,
              }}
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
      </head>
      <body className="bg-surface text-text font-body min-h-screen flex flex-col overflow-x-hidden">
        <ExperimentProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <FeedbackWidget />
          <CookieConsentBanner />
          <ConsentScripts />
        </ExperimentProvider>
      </body>
    </html>
  );
}
