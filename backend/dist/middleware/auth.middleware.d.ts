import { Request, Response, NextFunction } from "express";
export declare const authOnly: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export default authOnly;
//# sourceMappingURL=auth.middleware.d.ts.map