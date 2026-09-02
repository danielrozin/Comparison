import posthog from "posthog-js";
import { isThirdPartyException } from "@/lib/utils/third-party-errors";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
  api_host: "/ingest",
  ui_host: "https://us.posthog.com",
  defaults: "2026-01-30",
  capture_exceptions: true,
  debug: process.env.NODE_ENV === "development",
  // Drop exceptions thrown inside third-party scripts we load but do not own,
  // so Google, Clarity, and browser-extension noise stays out of error tracking.
  before_send: (event) =>
    event && isThirdPartyException(event.event, event.properties) ? null : event,
});
