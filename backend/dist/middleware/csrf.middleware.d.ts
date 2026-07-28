import { Request, Response, NextFunction } from "express";
export default function csrfMiddleware(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
//# sourceMappingURL=csrf.middleware.d.ts.map