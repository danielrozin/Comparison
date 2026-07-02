import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getRedis } from "@/lib/services/redis";
import { sendNotificationEmail } from "@/lib/services/email";

export const maxDuration = 60;

/**
 * GET /api/cron/survey-thresholds
 *
 * Daily cron (DAN-829) that watches `intercept_surveys.count` and fires a
 * one-time notification per tier when the row count crosses the analysis
 * thresholds from DAN-99 framework §3:
 *
 *   - Directional: count >= 20 → run open-text coding on C1–C8 (no %)
 *   - Reportable:  count >= 50 → run mechanical synthesis
 *
 * Notification is delivered by creating a child issue under DAN-826 assigned
 * to the UX Researcher agent — the assignment is the wake signal. (Cross-agent
 * comment posting on DAN-826 is blocked by Paperclip ACL, so the child-issue
 * pattern is required here; see DAN-829 for the design note.)
 *
 * "Fired" state is persisted in Redis so the same tier never fires twice.
 *
 * Notification channels (each non-fatal):
 *   1. Paperclip — create child issue if `PAPERCLIP_API_URL` + `PAPERCLIP_API_KEY` are set.
 *   2. Email     — always sent; serves as audit trail and fallback wake path.
 */

const UX_RESEARCHER_AGENT_ID = "5d736d2c-827e-4303-9359-3d90b648cadc";
const DAN_826_ISSUE_ID = "1eea7e47-6239-473e-947e-e315ce15855e";
const DAN_826_GOAL_ID = "d3956f06-a136-4db4-93f6-e3093be2868c";
const COMPANY_ID = "3bac00ef-9dd8-442f-8e07-9176d1e1c247";

const TIERS = [
  {
    id: "directional",
    threshold: 20,
    redisKey: "pipeline:survey-thresholds:directional",
    label: "Directional",
    titleSuffix: "open-text coding on C1–C8",
    action:
      "Code Q4 open-text on C1–C8 and post a directional comment to [DAN-99](/DAN/issues/DAN-99). No percentages yet.",
  },
  {
    id: "reportable",
    threshold: 50,
    redisKey: "pipeline:survey-thresholds:reportable",
    label: "Reportable",
    titleSuffix: "mechanical synthesis",
    action:
      "Run mechanical synthesis: found-it rate, rating distribution, channel mix, abandon rate. Mark H1–H8 Confirm/Revise/Reject and trigger framework §5 thresholds.",
  },
] as const;

type TierFireResult = {
  tier: (typeof TIERS)[number]["id"];
  threshold: number;
  total: number;
  paperclipChildIssueId: string | null;
  paperclipError: string | null;
  emailSent: boolean;
};

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const sp = request.nextUrl.searchParams;
  const directionalOverride = numberOrNull(sp.get("directional"));
  const reportableOverride = numberOrNull(sp.get("reportable"));
  const dryRun = sp.get("dryRun") === "1";

  if (!prisma) {
    return NextResponse.json({ error: "Database not available" }, { status: 503 });
  }

  const total = await prisma.interceptSurvey.count();
  const redis = getRedis();

  const fired: TierFireResult[] = [];
  const skipped: { tier: string; reason: string; total: number }[] = [];

  for (const tier of TIERS) {
    const effectiveThreshold =
      tier.id === "directional" && directionalOverride !== null
        ? directionalOverride
        : tier.id === "reportable" && reportableOverride !== null
          ? reportableOverride
          : tier.threshold;

    if (total < effectiveThreshold) {
      skipped.push({ tier: tier.id, reason: `total ${total} < threshold ${effectiveThreshold}`, total });
      continue;
    }

    if (redis && !dryRun) {
      const already = await redis.get(tier.redisKey);
      if (already) {
        skipped.push({ tier: tier.id, reason: `already fired at ${already}`, total });
        continue;
      }
    }

    const result = await fireTier(tier, total, effectiveThreshold, dryRun);
    fired.push(result);

    if (redis && !dryRun && (result.paperclipChildIssueId || result.emailSent)) {
      await redis.set(tier.redisKey, new Date().toISOString());
    }
  }

  return NextResponse.json({
    ok: true,
    total,
    fired,
    skipped,
    dryRun,
    timestamp: new Date().toISOString(),
  });
}

async function fireTier(
  tier: (typeof TIERS)[number],
  total: number,
  effectiveThreshold: number,
  dryRun: boolean,
): Promise<TierFireResult> {
  const title = `[Threshold] ${tier.label} tier crossed (n=${total}) — ${tier.titleSuffix}`;
  const description = buildChildIssueDescription(tier, total, effectiveThreshold);

  let paperclipChildIssueId: string | null = null;
  let paperclipError: string | null = null;

  const paperclipUrl = process.env.PAPERCLIP_API_URL;
  const paperclipKey = process.env.PAPERCLIP_API_KEY;

  if (paperclipUrl && paperclipKey && !dryRun) {
    try {
      const res = await fetch(`${paperclipUrl}/api/companies/${COMPANY_ID}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${paperclipKey}`,
        },
        body: JSON.stringify({
          title,
          description,
          parentId: DAN_826_ISSUE_ID,
          goalId: DAN_826_GOAL_ID,
          assigneeAgentId: UX_RESEARCHER_AGENT_ID,
          priority: "high",
          status: "todo",
        }),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) {
        const created = (await res.json()) as { id?: string };
        paperclipChildIssueId = created.id ?? null;
      } else {
        paperclipError = `HTTP ${res.status}: ${await res.text().catch(() => "")}`;
      }
    } catch (err) {
      paperclipError = err instanceof Error ? err.message : String(err);
    }
  } else if (!paperclipUrl || !paperclipKey) {
    paperclipError = "PAPERCLIP_API_URL or PAPERCLIP_API_KEY not configured";
  }

  let emailSent = false;
  if (!dryRun) {
    try {
      await sendNotificationEmail({
        subject: `intercept_surveys ${tier.label} tier crossed (n=${total} >= ${effectiveThreshold})`,
        type: "survey-threshold",
        message: buildEmailBody(tier, total, effectiveThreshold, paperclipChildIssueId, paperclipError),
        pageUrl: `https://www.aversusb.net/api/surveys/intercept?limit=1`,
      });
      emailSent = true;
    } catch (err) {
      console.warn("survey-thresholds email send failed:", err);
    }
  }

  return {
    tier: tier.id,
    threshold: effectiveThreshold,
    total,
    paperclipChildIssueId,
    paperclipError,
    emailSent,
  };
}

function buildChildIssueDescription(
  tier: (typeof TIERS)[number],
  total: number,
  effectiveThreshold: number,
): string {
  return [
    `[@UX Researcher](agent://${UX_RESEARCHER_AGENT_ID}) — \`intercept_surveys\` row count is now **${total}**, which crosses the **${tier.label}** threshold (>=${effectiveThreshold}) from [DAN-99 framework §3](/DAN/issues/DAN-99#document-survey-analysis-framework).`,
    ``,
    `**Action:** ${tier.action}`,
    ``,
    `Source: \`GET /api/surveys/intercept\` on \`www.aversusb.net\`. Fired by [DAN-829](/DAN/issues/DAN-829) survey-threshold cron.`,
  ].join("\n");
}

function buildEmailBody(
  tier: (typeof TIERS)[number],
  total: number,
  effectiveThreshold: number,
  paperclipChildIssueId: string | null,
  paperclipError: string | null,
): string {
  return [
    `intercept_surveys "${tier.label}" tier crossed`,
    ``,
    `Total rows: ${total}`,
    `Threshold:  ${effectiveThreshold}`,
    `Parent issue: DAN-826`,
    `UX Researcher agent: ${UX_RESEARCHER_AGENT_ID}`,
    ``,
    paperclipChildIssueId
      ? `Paperclip child issue created: ${paperclipChildIssueId}`
      : `Paperclip child issue NOT created. ${paperclipError ?? ""}`,
    ``,
    `Next action: ${tier.action}`,
  ]
    .filter(Boolean)
    .join("\n");
}

function numberOrNull(value: string | null): number | null {
  if (value === null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
