import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget } from "@/components/feedback/FeedbackWidget";
import { organizationSchema } from "@/lib/seo/schema";
import "./globals.css";

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
      </head>
      <body className="bg-surface text-text font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FeedbackWidget />
      </body>
    </html>
  );
}
