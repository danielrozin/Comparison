/**
 * Pipeline Alerting Service
 *
 * Monitors generation queue health and sends webhook notifications
 * when completion rates drop below thresholds or failure counts spike.
 *
 * Supports Slack-compatible webhooks and generic JSON webhooks.
 */

import { getRedis } from "./redis";

const ALERT_COOLDOWN_KEY = "pipeline:alert:cooldown";
const ALERT_COOLDOWN_SECONDS = 3600; // 1 alert per hour max
const COMPLETION_RATE_THRESHOLD = 0.9; // Alert if < 90% success
const FAILURE_SPIKE_THRESHOLD = 5; // Alert if >= 5 failures in one batch

export interface AlertPayload {
  type: "low_completion_rate" | "failure_spike" | "queue_stalled";
  message: string;
  details: {
    processed: number;
    succeeded: number;
    failed: number;
    completionRate: number;
    errors: string[];
    timestamp: string;
  };
}

/**
 * Check pipeline health after a queue run and send alerts if needed.
 */
export async function checkAndAlert(runResult: {
  processed: number;
  succeeded: number;
  failed: number;
  errors: string[];
}): Promise<{ alerted: boolean; reason?: string }> {
  const webhookUrl = process.env.PIPELINE_ALERT_WEBHOOK_URL;
  if (!webhookUrl) return { alerted: false, reason: "no_webhook_configured" };
  if (runResult.processed === 0) return { alerted: false, reason: "no_jobs_processed" };

  // Check cooldown
  const redis = getRedis();
  if (redis) {
    const cooldown = await redis.get(ALERT_COOLDOWN_KEY);
    if (cooldown) return { alerted: false, reason: "cooldown_active" };
  }

  const completionRate = runResult.succeeded / runResult.processed;
  let alertType: AlertPayload["type"] | null = null;
  let message = "";

  if (completionRate < COMPLETION_RATE_THRESHOLD) {
    alertType = "low_completion_rate";
    message = `Pipeline completion rate dropped to ${(completionRate * 100).toFixed(1)}% (threshold: ${COMPLETION_RATE_THRESHOLD * 100}%). ${runResult.failed}/${runResult.processed} jobs failed.`;
  } else if (runResult.failed >= FAILURE_SPIKE_THRESHOLD) {
    alertType = "failure_spike";
    message = `${runResult.failed} pipeline failures detected in a single batch (threshold: ${FAILURE_SPIKE_THRESHOLD}).`;
  }

  if (!alertType) return { alerted: false, reason: "healthy" };

  const payload: AlertPayload = {
    type: alertType,
    message,
    details: {
      processed: runResult.processed,
      succeeded: runResult.succeeded,
      failed: runResult.failed,
      completionRate,
      errors: runResult.errors.slice(0, 10), // Limit to 10 errors
      timestamp: new Date().toISOString(),
    },
  };

  const sent = await sendWebhookAlert(webhookUrl, payload);

  // Set cooldown
  if (sent && redis) {
    await redis.set(ALERT_COOLDOWN_KEY, "1", { ex: ALERT_COOLDOWN_SECONDS });
  }

  return { alerted: sent, reason: alertType };
}

/**
 * Send alert via webhook. Supports Slack-format and generic JSON.
 */
async function sendWebhookAlert(
  webhookUrl: string,
  payload: AlertPayload
): Promise<boolean> {
  try {
    const isSlack = webhookUrl.includes("hooks.slack.com");

    const body = isSlack
      ? {
          text: `*Pipeline Alert: ${payload.type}*`,
          blocks: [
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `Pipeline Alert: ${payload.type.replace(/_/g, " ")}`,
              },
            },
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text: payload.message,
              },
            },
            {
              type: "section",
              fields: [
                { type: "mrkdwn", text: `*Processed:* ${payload.details.processed}` },
                { type: "mrkdwn", text: `*Succeeded:* ${payload.details.succeeded}` },
                { type: "mrkdwn", text: `*Failed:* ${payload.details.failed}` },
                { type: "mrkdwn", text: `*Rate:* ${(payload.details.completionRate * 100).toFixed(1)}%` },
              ],
            },
            ...(payload.details.errors.length > 0
              ? [
                  {
                    type: "section",
                    text: {
                      type: "mrkdwn",
                      text: `*Errors:*\n${payload.details.errors.map((e) => `• ${e}`).join("\n")}`,
                    },
                  },
                ]
              : []),
          ],
        }
      : payload;

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });

    return response.ok;
  } catch {
    // Don't let alerting failures break the pipeline
    return false;
  }
}

/**
 * Check if the generation queue appears stalled (no processing for > threshold).
 * Meant to be called from a health-check cron.
 */
export async function checkQueueStalled(
  stalledThresholdMinutes: number = 120
): Promise<{ stalled: boolean; lastProcessedAt: string | null }> {
  const redis = getRedis();
  if (!redis) return { stalled: false, lastProcessedAt: null };

  const stats = await redis.get<{ lastProcessedAt: string }>("genqueue:stats");
  if (!stats?.lastProcessedAt) return { stalled: false, lastProcessedAt: null };

  const lastProcessed = new Date(stats.lastProcessedAt);
  const minutesSince = (Date.now() - lastProcessed.getTime()) / 60000;

  if (minutesSince > stalledThresholdMinutes) {
    const webhookUrl = process.env.PIPELINE_ALERT_WEBHOOK_URL;
    if (webhookUrl) {
      await sendWebhookAlert(webhookUrl, {
        type: "queue_stalled",
        message: `Generation queue has not processed any jobs for ${Math.round(minutesSince)} minutes (threshold: ${stalledThresholdMinutes}min).`,
        details: {
          processed: 0,
          succeeded: 0,
          failed: 0,
          completionRate: 0,
          errors: [],
          timestamp: new Date().toISOString(),
        },
      });
    }
    return { stalled: true, lastProcessedAt: stats.lastProcessedAt };
  }

  return { stalled: false, lastProcessedAt: stats.lastProcessedAt };
}
