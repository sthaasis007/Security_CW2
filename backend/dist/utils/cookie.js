"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSessionCookies = exports.setSessionCookies = exports.readCookie = exports.CSRF_COOKIE = exports.REFRESH_COOKIE = exports.ACCESS_COOKIE = void 0;
exports.ACCESS_COOKIE = "accessToken";
exports.REFRESH_COOKIE = "refreshToken";
exports.CSRF_COOKIE = "XSRF-TOKEN";
const readCookie = (req, name) => {
    const header = req.headers.cookie;
    if (!header)
        return null;
    for (const part of header.split(";")) {
        const separator = part.indexOf("=");
        if (separator < 0)
            continue;
        const key = part.slice(0, separator).trim();
        if (key === name)
            return decodeURIComponent(part.slice(separator + 1).trim());
    }
    return null;
};
exports.readCookie = readCookie;
const secure = () => process.env.NODE_ENV === "production";
const setSessionCookies = (res, values) => {
    // Remove cookies created by the previous browser-readable session design.
    res.clearCookie("token", { path: "/" });
    res.clearCookie("user", { path: "/" });
    res.clearCookie(exports.REFRESH_COOKIE, { path: "/" });
    res.cookie(exports.ACCESS_COOKIE, values.accessToken, {
        httpOnly: true,
        secure: secure(),
        sameSite: "strict",
        path: "/",
        maxAge: 15 * 60 * 1000,
    });
    res.cookie(exports.REFRESH_COOKIE, values.refreshToken, {
        httpOnly: true,
        secure: secure(),
        sameSite: "strict",
        path: "/api/auth",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.cookie(exports.CSRF_COOKIE, values.csrfToken, {
        httpOnly: false,
        secure: secure(),
        sameSite: "strict",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};
exports.setSessionCookies = setSessionCookies;
const clearSessionCookies = (res) => {
    res.clearCookie("token", { path: "/" });
    res.clearCookie("user", { path: "/" });
    res.clearCookie(exports.REFRESH_COOKIE, { path: "/" });
    res.clearCookie(exports.ACCESS_COOKIE, { httpOnly: true, secure: secure(), sameSite: "strict", path: "/" });
    res.clearCookie(exports.REFRESH_COOKIE, { httpOnly: true, secure: secure(), sameSite: "strict", path: "/api/auth" });
    res.clearCookie(exports.CSRF_COOKIE, { httpOnly: false, secure: secure(), sameSite: "strict", path: "/" });
};
exports.clearSessionCookies = clearSessionCookies;
//# sourceMappingURL=cookie.js.map