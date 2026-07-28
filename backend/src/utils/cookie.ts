import type { Request, Response } from "express";

export const ACCESS_COOKIE = "accessToken";
export const REFRESH_COOKIE = "refreshToken";
export const CSRF_COOKIE = "XSRF-TOKEN";

export const readCookie = (req: Request, name: string): string | null => {
  const header = req.headers.cookie;
  if (!header) return null;
  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    if (key === name) return decodeURIComponent(part.slice(separator + 1).trim());
  }
  return null;
};

const secure = () => process.env.NODE_ENV === "production";

export const setSessionCookies = (
  res: Response,
  values: { accessToken: string; refreshToken: string; csrfToken: string },
) => {
  // Remove cookies created by the previous browser-readable session design.
  res.clearCookie("token", { path: "/" });
  res.clearCookie("user", { path: "/" });
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
  res.cookie(ACCESS_COOKIE, values.accessToken, {
    httpOnly: true,
    secure: secure(),
    sameSite: "strict",
    path: "/",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie(REFRESH_COOKIE, values.refreshToken, {
    httpOnly: true,
    secure: secure(),
    sameSite: "strict",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.cookie(CSRF_COOKIE, values.csrfToken, {
    httpOnly: false,
    secure: secure(),
    sameSite: "strict",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearSessionCookies = (res: Response) => {
  res.clearCookie("token", { path: "/" });
  res.clearCookie("user", { path: "/" });
  res.clearCookie(REFRESH_COOKIE, { path: "/" });
  res.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure: secure(), sameSite: "strict", path: "/" });
  res.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure: secure(), sameSite: "strict", path: "/api/auth" });
  res.clearCookie(CSRF_COOKIE, { httpOnly: false, secure: secure(), sameSite: "strict", path: "/" });
};
