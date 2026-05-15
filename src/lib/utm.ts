const STORAGE_KEY = "indigo_utm_v1";
const SESSION_KEY = "indigo_session_v1";

export type UtmContext = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  referrer: string | null;
  landing_path: string | null;
};

function emptyContext(): UtmContext {
  return {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    referrer: null,
    landing_path: null,
  };
}

export function captureUtm(): UtmContext {
  if (typeof window === "undefined") return emptyContext();
  try {
    const existing = sessionStorage.getItem(STORAGE_KEY);
    if (existing) return JSON.parse(existing) as UtmContext;
  } catch {
    /* ignore */
  }
  const params = new URLSearchParams(window.location.search);
  const ctx: UtmContext = {
    utm_source: params.get("utm_source"),
    utm_medium: params.get("utm_medium"),
    utm_campaign: params.get("utm_campaign"),
    utm_term: params.get("utm_term"),
    utm_content: params.get("utm_content"),
    referrer: document.referrer || null,
    landing_path: window.location.pathname + window.location.search,
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {
    /* ignore */
  }
  return ctx;
}

export function getUtm(): UtmContext {
  if (typeof window === "undefined") return emptyContext();
  try {
    const v = sessionStorage.getItem(STORAGE_KEY);
    if (v) return JSON.parse(v) as UtmContext;
  } catch {
    /* ignore */
  }
  return captureUtm();
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id =
        (crypto as Crypto).randomUUID?.() ??
        Math.random().toString(36).slice(2) + Date.now().toString(36);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}