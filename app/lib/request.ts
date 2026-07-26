"use client";
import Cookies from "js-cookie";

async function tryRefreshAccess(): Promise<string | null> {
  try {
    const r = await fetch(`/api/auth/refresh`, { method: "POST", credentials: "include" });
    if (!r.ok) return null;
    const body = await r.json().catch(() => null);
    const access = body?.accessToken || body?.token || null;
    if (access) {
      try { localStorage.setItem("token", access); } catch (e) {}
    }
    return access;
  } catch (e) {
    return null;
  }
}

export async function apiFetch(input: RequestInfo, init: RequestInit = {}, retry = true): Promise<Response> {
  const opts: RequestInit = { ...init };
  const method = (opts.method || "GET").toUpperCase();

  const headers = new Headers(opts.headers || {});

  // Attach Authorization from localStorage if present
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token && !headers.has("Authorization")) headers.set("Authorization", `Bearer ${token}`);
  }

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
    const newAccess = await tryRefreshAccess();
    if (newAccess) {
      // update header and retry once
      headers.set("Authorization", `Bearer ${newAccess}`);
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
        const newAccess = await tryRefreshAccess();
        if (newAccess) {
          headers.set("Authorization", `Bearer ${newAccess}`);
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

export default apiFetch;
