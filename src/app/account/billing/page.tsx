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

export default function BillingPage() {
  return (
    <HubShell
      eyebrow="Account"
      title="Manage billing"
      lede="Enter the email you paid with. We'll open Stripe's secure billing page so you can update your card or cancel. Canceling turns custom comparisons off the same day."
      breadcrumbLabel="Billing"
    >
      <BillingPortalForm />
    </HubShell>
  );
}
