"use client";
import Cookies from "js-cookie";

let refreshInFlight: Promise<boolean> | null = null;

async function tryRefreshSession(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    try {
      const r = await fetch(`/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      });
      return r.ok;
    } catch {
      return false;
    } finally {
      refreshInFlight = null;
    }
  })();
  return refreshInFlight;
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  const opts: RequestInit = { ...init };
  opts.cache = "no-store";
  const method = (opts.method || "GET").toUpperCase();

  const headers = new Headers(opts.headers || {});

  // Attach CSRF token for mutating requests (double-submit cookie)
  if (!["GET", "HEAD"].includes(method)) {
    const xsrf = Cookies.get("XSRF-TOKEN");
    if (xsrf && !headers.has("X-CSRF-Token")) headers.set("X-CSRF-Token", xsrf);
  }

  // Default Content-Type for JSON bodies
  if (!opts.body || opts.body instanceof FormData) {
    // leave as-is
  } else if (!headers.has("Content-Type") && !["GET", "HEAD"].includes(method)) {
    headers.set("Content-Type", "application/json");
  }

  opts.headers = headers;
  opts.credentials = "include";

  let res = await fetch(input, opts);

  if (res.status === 401 && retry) {
    const refreshed = await tryRefreshSession();
    if (refreshed) {
      const xsrf = Cookies.get("XSRF-TOKEN");
      if (xsrf && !["GET", "HEAD"].includes(method)) headers.set("X-CSRF-Token", xsrf);
      opts.headers = headers;
      res = await fetch(input, opts);
    }
  }

  // If server responds with CSRF-related 403 (missing/invalid token), try a refresh
  if (res.status === 403 && retry) {
    try {
      const body = await res.clone().json().catch(() => ({}));
      const msg = (body && body.message) || "";
      if (msg && /(csrf|missing csrf|token not set|invalid csrf)/i.test(msg)) {
        const refreshed = await tryRefreshSession();
        if (refreshed) {
          const xsrf = Cookies.get("XSRF-TOKEN");
          if (xsrf) headers.set("X-CSRF-Token", xsrf);
          opts.headers = headers;
          // retry original request once after refresh sets XSRF cookie
          res = await fetch(input, opts);
        }
      }
    } catch (e) {
      // ignore and return original 403
    }
  }

  return res;
}

export async function getSession() {
  const response = await apiFetch("/api/auth/session");
  if (!response.ok) return null;
  const body = await response.json().catch(() => null);
  return body?.user || null;
}

export default apiFetch;
