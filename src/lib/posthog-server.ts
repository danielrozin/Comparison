import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHogClient() {
  if (!posthogClient) {
    posthogClient = new PostHog(
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!,
      {
        host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
        flushAt: 1,
        flushInterval: 0,
      }
    );
  }
  return posthogClient;
}

/** Await pending captures before the serverless function freezes (ROO-31). */
export async function flushPostHog() {
  if (!posthogClient) return;
  try {
    await posthogClient.flush();
  } catch (err) {
    console.error("[posthog] flush failed:", err);
  }
}

export async function shutdownPostHog() {
  if (posthogClient) {
    await posthogClient.shutdown();
    posthogClient = null;
  }
}
