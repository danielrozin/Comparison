import type { Metadata } from "next";
import Link from "next/link";
import { HubShell } from "@/components/layout/HubShell";
import { CustomCompareEscapes } from "@/components/monetization/CustomCompareEscapes";
import { CustomCompareForm } from "@/components/monetization/CustomCompareForm";
import { CustomCompareViewTracker } from "@/components/monetization/CustomCompareViewTracker";
import { selectCustomCompareEscapes } from "@/lib/data/custom-compare-escapes";
import { entitiesFromCompareSlug } from "@/lib/monetization/compare-slug-sides";
import { getTrendingComparisons } from "@/lib/services/comparison-service";
import { filterLiveCompareSlugs } from "@/lib/seo/resolve-internal-links";
import { SITE_NAME, SITE_URL } from "@/lib/utils/constants";

const PAGE_TITLE = `Request a custom comparison | ${SITE_NAME}`;
const PAGE_DESC =
  "Custom comparisons are a Pro feature. Browse popular published comparisons, or see what Pro adds on the pricing page.";

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: `${SITE_URL}/custom-compare` },
  openGraph: { title: PAGE_TITLE, description: PAGE_DESC, url: `${SITE_URL}/custom-compare` },
};

export const revalidate = 300;

export default async function CustomComparePage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; slug?: string }>;
}) {
  const params = await searchParams;
  const fromSlug = entitiesFromCompareSlug(params.slug);
  const initialA = (params.a || fromSlug?.a || "").slice(0, 200);
  const initialB = (params.b || fromSlug?.b || "").slice(0, 200);

  // Highest viewCount among canonical published pages, then drop anything
  // that is not actually live. No hard-coded matchup list.
  const trending = await getTrendingComparisons(12);
  const liveSlugs = await filterLiveCompareSlugs(trending.map((item) => item.slug));
  const escapes = selectCustomCompareEscapes(trending, liveSlugs);

  return (
    <HubShell
      eyebrow="Pro"
      title="Request a custom comparison"
      lede="Requesting a matchup that is not already published is a Pro feature (2 requests a month). This page does not generate the comparison. The links above open live comparisons, and pricing explains what a membership adds."
      breadcrumbLabel="Custom comparison"
      beforeTitle={<CustomCompareEscapes links={escapes} tone="onDark" />}
    >
      <CustomCompareViewTracker />
      <div className="max-w-xl space-y-6">
        <p className="text-sm text-text-secondary">
          Want a matchup without a membership? Suggest it on{" "}
          <Link href="/requests" className="font-semibold text-primary-600 hover:text-primary-700">
            the requests page
          </Link>
          . That path stays free. Use the email you paid with only if you are already a member.
        </p>
        <div className="bg-white border border-border rounded-xl p-6 shadow-sm">
          <CustomCompareForm
            initialA={initialA}
            initialB={initialB}
            requestSlug={params.slug || ""}
            escapes={escapes}
          />
        </div>
      </div>
    </HubShell>
  );
}
