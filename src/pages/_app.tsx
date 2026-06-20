import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FeedbackWidget, CookieConsentBanner } from "@/components/layout/GlobalClientWidgets";
import { ExperimentProvider } from "@/lib/experiments/ExperimentProvider";
import { GoogleTagManager } from "@/components/tracking/GoogleTagManager";
import { MetaPixel } from "@/components/tracking/MetaPixel";
import { ClarityTags } from "@/components/tracking/ClarityTags";
import "@/app/globals.css";

// Self-host Inter via next/font (matches src/app/layout.tsx). Applied through a
// display:contents wrapper so the `--font-inter` CSS variable cascades to the
// page without disturbing the <body> flex column defined in _document.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

// DAN-432 Phase C: Pages Router app shell for /compare/[slug].
// Mirrors the body chrome from src/app/layout.tsx. ExperimentProvider is seeded
// with an empty cookie and buckets client-side (the static page has no per-request
// cookie at build/ISR time — identical to the App Router SSG behaviour it replaces).
export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={inter.variable} style={{ display: "contents" }}>
      <GoogleTagManager />
      <MetaPixel />
      <ClarityTags />
      <ExperimentProvider initialCookie="">
        <Header />
        <main id="main-content" className="flex-1">
          <Component {...pageProps} />
        </main>
        <Footer />
        <FeedbackWidget />
        <CookieConsentBanner />
      </ExperimentProvider>
    </div>
  );
}
