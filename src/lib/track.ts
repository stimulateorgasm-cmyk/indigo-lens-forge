import { trackEvent } from "@/lib/analytics.functions";
import { getSessionId } from "@/lib/utm";

export type EventName =
  | "cta_click"
  | "calculator_use"
  | "faq_open"
  | "video_play"
  | "video_platform_click"
  | "download_pdf";

export function track(name: EventName, props?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  try {
    void trackEvent({
      data: {
        event_name: name,
        props: props ?? null,
        session_id: getSessionId(),
        path: window.location.pathname + window.location.search,
        user_agent: navigator.userAgent.slice(0, 500),
      },
    }).catch((err) => console.error("track", name, err));
  } catch (err) {
    console.error("track", name, err);
  }
}