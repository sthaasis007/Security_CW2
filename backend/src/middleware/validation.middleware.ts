import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";
import fs from "fs";

type RequestSchemas = {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
};
 
export const validate = (schemas: RequestSchemas) =>
  (req: Request, res: Response, next: NextFunction) => {
    for (const [target, schema] of Object.entries(schemas) as [keyof RequestSchemas, ZodType][]) {
      const parsed = schema.safeParse((req as any)[target]);
      if (!parsed.success) {
        const uploadedPath = (req as any).file?.path;
        if (uploadedPath) {
          try { fs.unlinkSync(uploadedPath); } catch { /* best-effort cleanup */ }
        }
        return res.status(400).json({ ok: false, message: `Invalid request ${target}` });
      }
      // Express 5 exposes req.query through a getter, so it cannot be replaced.
      // Query values are validated here and controllers read the original values.
      if (target !== "query") {
        (req as any)[target] = parsed.data;
      }
    }
    next();
  };

export const validateRequest = (schema: ZodType) => validate({ body: schema });
export const validateQuery = (schema: ZodType) => validate({ query: schema });
