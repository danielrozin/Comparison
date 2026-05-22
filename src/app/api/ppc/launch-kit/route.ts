import { NextRequest, NextResponse } from "next/server";
import { buildLaunchKit } from "@/lib/services/ppc-launch-kit";

/**
 * GET /api/ppc/launch-kit
 * Returns the credential-free PPC launch kit: conversion taxonomy, negative
 * keyword seed list, remarketing audience definitions, and a char-count-validated
 * Responsive Search Ad copy deck. Everything needed to launch the moment the
 * four NEXT_PUBLIC_* account IDs land in .env.
 *
 * Auth: Bearer ADMIN_TOKEN (when configured).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.ADMIN_TOKEN && authHeader !== `Bearer ${process.env.ADMIN_TOKEN}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kit = buildLaunchKit();

  return NextResponse.json({
    kit,
    summary: {
      conversionActions: kit.conversionTaxonomy.length,
      conversionsNeedingWiring: kit.conversionTaxonomy.filter((c) => c.status === "needs_wiring").length,
      sharedNegatives: kit.negativeKeywords.shared.length,
      remarketingAudiences: kit.remarketingAudiences.length,
      adGroups: kit.copyDeck.assets.length,
      copyDeckValid: kit.copyDeck.violations.length === 0,
      copyViolations: kit.copyDeck.violations.length,
    },
  });
}
