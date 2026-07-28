import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
export declare const validateRequest: (schema: ZodSchema, options?: {
    allowUnknown?: boolean;
}) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const validateQuery: (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=validation.middleware.d.ts.map