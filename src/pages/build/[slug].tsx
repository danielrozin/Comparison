import Head from "next/head";
import type { GetServerSideProps } from "next";
import { OnDemandComparison } from "@/components/comparison/OnDemandComparison";
import { entityLabelFromSlug } from "@/lib/parse-comparison-query";
import { decideBuildRouteLive } from "@/lib/generation/build-route";
import { SITE_NAME } from "@/lib/utils/constants";

/**
 * ROO-234: 200 entry point to the ROO-193 on-demand builder, linked
 * (rel=nofollow) from blog cards whose X-vs-Y pair has no live page yet.
 *
 * - live pair: 302 to /compare/<slug>
 * - buildable pair: 200 with the builder, noindex
 * - anything else (junk, blocked, held back, generation off): 404
 *
 * Crawlers get the page like everyone else; the builder component itself
 * skips generation for them (it never blocks them).
 */

interface Props {
  slug: string;
  entityA: string;
  entityB: string;
}

export default function BuildComparisonPage({ slug, entityA, entityB }: Props) {
  return (
    <>
      <Head>
        <title>{`${entityA} vs ${entityB} | ${SITE_NAME}`}</title>
        <meta name="robots" content="noindex, follow" />
      </Head>
      <OnDemandComparison slug={slug} entityA={entityA} entityB={entityB} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ params, res }) => {
  const raw = typeof params?.slug === "string" ? params.slug : "";
  const decision = await decideBuildRouteLive(raw).catch(() => ({ kind: "not_found" as const }));
  if (decision.kind === "live") {
    return { redirect: { destination: `/compare/${decision.slug}`, permanent: false } };
  }
  if (decision.kind !== "build") return { notFound: true };
  res.setHeader("X-Robots-Tag", "noindex");
  res.setHeader("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
  const [a, b] = decision.slug.split("-vs-");
  return {
    props: { slug: decision.slug, entityA: entityLabelFromSlug(a), entityB: entityLabelFromSlug(b) },
  };
};
