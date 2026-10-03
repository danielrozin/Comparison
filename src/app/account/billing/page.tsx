import type { Metadata } from "next";
import { HubShell } from "@/components/layout/HubShell";
import { BillingPortalForm } from "@/components/monetization/BillingPortalForm";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

export const metadata: Metadata = {
  title: `Manage billing | ${SITE_NAME}`,
  description: "Update your card or cancel an A Versus B membership.",
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE_URL}/account/billing` },
};

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ link?: string }>;
}) {
  const { link } = await searchParams;
  return (
    <HubShell
      eyebrow="Account"
      title="Manage billing"
      lede="Enter the email you paid with. If it has an active membership, we'll email a one-time link to Stripe's secure billing page so you can update your card or cancel. Canceling turns custom comparisons off the same day."
      breadcrumbLabel="Billing"
    >
      <BillingPortalForm linkInvalid={link === "invalid" || link === "unavailable"} />
    </HubShell>
  );
}
