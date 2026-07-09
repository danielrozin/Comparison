/**
 * PostHog AI Observability — OpenTelemetry setup.
 *
 * Initialises the NodeSDK with AnthropicInstrumentation so every
 * client.messages.create() call in this server automatically emits a
 * gen_ai span that PostHog converts into a $ai_generation event.
 *
 * Import via src/instrumentation.ts (register() → nodejs runtime only)
 * so the SDK starts once before any request handler runs.
 */
import { NodeSDK } from "@opentelemetry/sdk-node";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PostHogSpanProcessor } from "@posthog/ai/otel";
import { AnthropicInstrumentation } from "@traceloop/instrumentation-anthropic";
import { trace } from "@opentelemetry/api";

let started = false;

export function startPostHogOTel() {
  if (started) return;
  started = true;

  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  if (!projectToken) {
    console.warn("[posthog-otel] NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN not set — LLM tracing disabled");
    return;
  }

  const sdk = new NodeSDK({
    resource: resourceFromAttributes({
      "service.name": "aversusb-api",
    }),
    spanProcessors: [
      new PostHogSpanProcessor({
        projectToken,
        host,
      }),
    ],
    instrumentations: [new AnthropicInstrumentation()],
  });

  sdk.start();
}

/**
 * Stamp the PostHog distinct ID onto the currently-active OTel span so
 * PostHog can link this $ai_generation event to a specific person.
 * No-ops gracefully when no span is active (e.g. during unit tests).
 */
export function setPostHogDistinctId(distinctId: string) {
  const span = trace.getActiveSpan();
  if (span) {
    span.setAttribute("posthog.distinct_id", distinctId);
  }
}
