import { Request, Response, NextFunction } from "express";
import { z, ZodSchema } from "zod";

export const validateRequest = (schema: ZodSchema, options?: { allowUnknown?: boolean }) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      }
      if (!options?.allowUnknown) {
        req.body = parsed.data;
      }
      next();
    } catch (error) {
      return res.status(400).json({ ok: false, message: "Validation error" });
    }
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.safeParse(req.query);
      if (!parsed.success) {
        return res.status(400).json({ ok: false, message: "Validation error", errors: parsed.error.flatten().fieldErrors });
      }
      req.query = parsed.data as any;
      next();
    } catch (error) {
      return res.status(400).json({ ok: false, message: "Validation error" });
    }
  };
};
