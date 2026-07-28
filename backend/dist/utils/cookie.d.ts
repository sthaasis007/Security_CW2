import type { Request, Response } from "express";
export declare const ACCESS_COOKIE = "accessToken";
export declare const REFRESH_COOKIE = "refreshToken";
export declare const CSRF_COOKIE = "XSRF-TOKEN";
export declare const readCookie: (req: Request, name: string) => string | null;
export declare const setSessionCookies: (res: Response, values: {
    accessToken: string;
    refreshToken: string;
    csrfToken: string;
}) => void;
export declare const clearSessionCookies: (res: Response) => void;
//# sourceMappingURL=cookie.d.ts.map