import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
type RequestSchemas = {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
};
export declare const validate: (schemas: RequestSchemas) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateRequest: (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateQuery: (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export {};
//# sourceMappingURL=validation.middleware.d.ts.map