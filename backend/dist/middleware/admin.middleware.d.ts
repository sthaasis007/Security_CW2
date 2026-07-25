import { Request, Response, NextFunction } from "express";
export interface JwtPayloadExtended {
    sub: string;
    email: string;
    role: string;
}
export declare const adminOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default adminOnly;
//# sourceMappingURL=admin.middleware.d.ts.map