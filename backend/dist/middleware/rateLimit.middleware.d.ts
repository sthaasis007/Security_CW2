import { Request, Response, NextFunction } from "express";
export default function rateLimit(options: {
    windowMs: number;
    max: number;
    keyPrefix?: string;
}): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rateLimit.middleware.d.ts.map