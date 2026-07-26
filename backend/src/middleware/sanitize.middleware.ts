import { Request, Response, NextFunction } from "express";

// Remove any keys starting with $ or containing dots to prevent NoSQL injection
const sanitizeObject = (obj: any): any => {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map((v) => sanitizeObject(v));
  const clean: any = {};
  for (const key of Object.keys(obj)) {
    if (key.startsWith("$") || key.includes(".")) continue;
    const val = obj[key];
    if (val && typeof val === "object") {
      clean[key] = sanitizeObject(val);
    } else {
      clean[key] = val;
    }
  }
  return clean;
};

export default function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  try {
    req.body = sanitizeObject(req.body);
    req.query = sanitizeObject(req.query);
    req.params = sanitizeObject(req.params);
  } catch (e) {
    // ignore sanitization errors
  }
  next();
}
