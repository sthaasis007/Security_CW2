import { NextFunction, Request, Response } from "express";
type Options = {
    windowMs: number;
    max: number;
    keyPrefix?: string;
    progressiveDelayMs?: number;
    captchaAfter?: number;
    countFailuresOnly?: boolean;
};
export declare function resetRateLimitStore(): void;
export default function rateLimit(options: Options): (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export {};
//# sourceMappingURL=rateLimit.middleware.d.ts.map