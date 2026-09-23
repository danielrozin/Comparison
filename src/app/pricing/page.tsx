import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";
import { JsonLd } from "@/components/schema/JsonLd";
import { HubShell } from "@/components/layout/HubShell";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { PLANS, stripeConfigured } from "@/lib/monetization/plans";
import {
  offerAvailability,
  pricingBannerDetail,
  pricingFaq,
  pricingPayments,
} from "@/lib/monetization/pricing-messaging";
import { CheckoutButton } from "@/components/monetization/CheckoutButton";
import { PricingViewTracker } from "@/components/monetization/PricingViewTracker";

const PAGE_TITLE = `Pricing — Go Pro on ${SITE_NAME}`;
const PAGE_DESC = `Every comparison stays free. Pro adds custom comparisons on demand, exports and alerts from $49/yr founding. Business adds API access and white-label embeds.`;
const PAGE_URL = `${SITE_URL}/pricing`;

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: PAGE_URL, languages: { en: PAGE_URL, "x-default": PAGE_URL } },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: PAGE_URL, type: "website", locale: "en_US", siteName: SITE_NAME },
  twitter: { card: "summary_large_image", title: PAGE_TITLE, description: PAGE_DESC },
};

function offersSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${PAGE_URL}#webpage`,
    name: PAGE_TITLE,
    description: PAGE_DESC,
    url: PAGE_URL,
    inLanguage: "en-US",
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website` },
    breadcrumb: breadcrumbSchema(
      [
        { name: "Home", url: SITE_URL },
        { name: "Pricing", url: PAGE_URL },
      ],
      `${PAGE_URL}#breadcrumbs`
    ),
    mainEntity: PLANS.map((plan) => ({
      "@type": "Product",
      name: `${SITE_NAME} ${plan.name}`,
      description: plan.tagline,
      brand: { "@id": `${SITE_URL}/#organization` },
      offers: plan.intervals.map((i) => ({
        "@type": "Offer",
        price: i.foundingPrice,
        priceCurrency: "USD",
        // founding price — honest validity window, revisited at launch
        priceValidUntil: "2026-12-31",
        availability: offerAvailability(i),
        url: PAGE_URL,
      })),
    })),
  };
}

function faqSchema(faq: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${PAGE_URL}#faqpage`,
    url: PAGE_URL,
    inLanguage: "en-US",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ src?: string; canceled?: string }>;
}) {
  const { src = "direct", canceled } = await searchParams;
  // Read env on each request. A module-level string would freeze the
  // pre-launch copy from whenever the server first imported this file.
  const payments = pricingPayments();
  const faq = pricingFaq(payments);

  return (
    <>
      <JsonLd data={[offersSchema(), faqSchema(faq)]} />
      <PricingViewTracker src={src} canceled={canceled === "1" || canceled === "true"} />
      <HubShell
        eyebrow="Pricing"
        title={"The comparisons are free. The superpowers aren't."}
        lede="Reading any comparison costs nothing, forever. Pro is for the moment the comparison you need doesn't exist yet — we build it for you within 24 hours."
        breadcrumbLabel="Pricing"
      >
        {/* Founding banner */}
        <div className="mb-10 rounded-2xl border border-accent-500/30 bg-accent-50 px-5 py-4 text-sm text-text">
          <strong className="font-semibold">Founding member pricing.</strong>{" "}
          {pricingBannerDetail(payments)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {PLANS.map((plan) => {
            const primary = plan.intervals[0];
            const alternate = plan.intervals[1];
            return (
              <section
                key={plan.id}
                aria-labelledby={`plan-${plan.id}`}
                className={`flex flex-col rounded-2xl border p-7 ${
                  plan.highlight
                    ? "border-primary-500 bg-white shadow-lg shadow-primary-500/10 relative"
                    : "border-border bg-surface-alt"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary-600 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
                    Most popular
                  </span>
                )}
                <h2 id={`plan-${plan.id}`} className="text-2xl font-display font-black text-text">
                  {plan.name}
                </h2>
                <p className="mt-1 text-sm text-text-secondary">{plan.tagline}</p>

                <p className="mt-5 flex items-baseline gap-2">
                  <span className="text-4xl font-display font-black text-text">${primary.foundingPrice}</span>
                  <span className="text-sm text-text-secondary">/{primary.interval}</span>
                  <span className="text-sm text-text-secondary line-through">${primary.regularPrice}</span>
                  <span className="rounded-full bg-green-50 border border-green-200 px-2 py-0.5 text-[11px] font-semibold text-green-700">
                    founding
                  </span>
                </p>
                {alternate && (
                  <p className="mt-1 text-xs text-text-secondary">
                    or ${alternate.foundingPrice}/{alternate.interval}
                  </p>
                )}

                <ul role="list" className="mt-6 space-y-2.5 text-sm text-text-secondary">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-green-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.79 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                  {plan.launchFeatures.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-primary-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 111.4-1.4l2.8 2.79 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
                      </svg>
                      <span>
                        {f}{" "}
                        <span className="rounded bg-primary-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-600">
                          at launch
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 pt-2 mt-auto space-y-2">
                  <CheckoutButton
                    plan={plan.id}
                    interval={primary.interval}
                    src={src}
                    paymentsLive={stripeConfigured(primary)}
                    label={`Get ${plan.name} — $${primary.foundingPrice}/${primary.interval}`}
                    className={`w-full rounded-xl px-5 py-3 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      plan.highlight
                        ? "bg-primary-600 text-white hover:bg-primary-700 focus-visible:ring-primary-500"
                        : "bg-slate-900 text-white hover:bg-slate-800 focus-visible:ring-slate-500"
                    } disabled:opacity-60`}
                  />
                  {alternate && (
                    <CheckoutButton
                      plan={plan.id}
                      interval={alternate.interval}
                      src={src}
                      paymentsLive={stripeConfigured(alternate)}
                      label={`Or $${alternate.foundingPrice}/${alternate.interval} founding`}
                      className="w-full rounded-xl px-5 py-2.5 text-sm font-semibold border border-border bg-white text-text hover:bg-surface-alt transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-60"
                    />
                  )}
                </div>
              </section>
            );
          })}
        </div>

        {/* The editorial line */}
        <p className="mt-10 max-w-2xl text-sm text-text-secondary leading-relaxed">
          One thing money can&apos;t buy here: a verdict.{" "}
          <Link href="/how-we-write-verdicts" className="text-primary-600 font-medium hover:underline">
            How we write verdicts
          </Link>{" "}
          is public, and no subscription, sponsorship or vendor payment changes an outcome. That&apos;s
          exactly why the verdicts are worth paying around.
        </p>

        {/* FAQ */}
        <section aria-labelledby="pricing-faq" className="mt-14">
          <h2 id="pricing-faq" className="text-xl font-display font-bold text-text mb-5">
            Questions
          </h2>
          <dl className="space-y-5 max-w-2xl">
            {faq.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-text text-sm">{f.q}</dt>
                <dd className="mt-1 text-sm text-text-secondary leading-relaxed">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </HubShell>
    </>
  );
}
