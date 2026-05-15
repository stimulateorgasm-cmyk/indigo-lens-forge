import { useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { trackVisit } from "@/lib/analytics.functions";
import { captureUtm, getSessionId } from "@/lib/utm";

const TRACKED_KEY = "indigo_visit_tracked_v1";

export function useTrackPageVisit() {
  const send = useServerFn(trackVisit);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let already = false;
    try {
      already = sessionStorage.getItem(TRACKED_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (already) return;
    const ctx = captureUtm();
    const sessionId = getSessionId();
    send({
      data: {
        session_id: sessionId,
        path: ctx.landing_path,
        referrer: ctx.referrer,
        utm_source: ctx.utm_source,
        utm_medium: ctx.utm_medium,
        utm_campaign: ctx.utm_campaign,
        utm_term: ctx.utm_term,
        utm_content: ctx.utm_content,
        user_agent: navigator.userAgent.slice(0, 500),
      },
    })
      .then(() => {
        try {
          sessionStorage.setItem(TRACKED_KEY, "1");
        } catch {
          /* ignore */
        }
      })
      .catch((err) => console.error("trackVisit failed", err));
  }, [send]);
}