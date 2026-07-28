import { Request, Response, NextFunction } from "express";
export declare const authOnly: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireSelfOrAdmin: (req: Request, res: Response, next: NextFunction) => Promise<void | Response<any, Record<string, any>>>;
export default authOnly;
//# sourceMappingURL=auth.middleware.d.ts.map