import type { Metadata } from "next";
import Link from "next/link";
import { HubShell } from "@/components/layout/HubShell";
import { CustomCompareForm } from "@/components/monetization/CustomCompareForm";
import { entitiesFromCompareSlug } from "@/lib/monetization/compare-slug-sides";
import { CUSTOM_COMPARE_UPGRADE_PATH } from "@/lib/monetization/custom-compare";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

const PAGE_TITLE = `Request a custom comparison | ${SITE_NAME}`;
const PAGE_DESC =
  "Pro members request any matchup and we publish the full side-by-side within 24 hours. Free visitors can upgrade on the pricing page.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/custom-compare` },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: `${SITE_URL}/custom-compare` },
};

export default async function CustomComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; slug?: string }>;
}) {
  const params = await searchParams;
  const fromSlug = entitiesFromCompareSlug(params.slug);
  const initialA = (params.a || fromSlug?.a || "").slice(0, 200);
  const initialB = (params.b || fromSlug?.b || "").slice(0, 200);

  return (
    <HubShell
      eyebrow="Pro"
      title="Request a custom comparison"
      lede="Members get 2 matchups a month, researched and published within 24 hours. Use the email you paid with. If that email is not an active membership, we'll send you to pricing instead of dropping the request."
      breadcrumbLabel="Custom comparison"
    >
      <div className="max-w-xl space-y-6">
        <p className="text-sm text-text-secondary">
          Not a member yet?{" "}
          <Link href={CUSTOM_COMPARE_UPGRADE_PATH} className="font-semibold text-primary-600 hover:text-primary-700">
            See Pro pricing
          </Link>
          . Public suggestions and votes stay free on{" "}
          <Link href="/requests" className="font-semibold text-primary-600 hover:text-primary-700">
            the requests page
          </Link>
          .
        </p>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <CustomCompareForm initialA={initialA} initialB={initialB} />
        </div>
      </div>
    </HubShell>
  );
}
