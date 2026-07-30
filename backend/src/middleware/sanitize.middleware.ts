import { Request, Response, NextFunction } from "express";

const FORBIDDEN_KEYS = new Set(["$where", "$gt", "$gte", "$lt", "$lte", "$ne", "$in", "$nin", "$regex", "$options", "__proto__", "prototype", "constructor"]);

const sanitizeValue = (value: any): any => {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.trim();
  if (typeof value !== "object") return value;

  if (value instanceof Date || (typeof Buffer !== "undefined" && Buffer.isBuffer(value))) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (typeof value.toJSON === "function") {
    try {
      return sanitizeValue(value.toJSON());
    } catch {
      return value;
    }
  }

  if (typeof value.toObject === "function") {
    try {
      return sanitizeValue(value.toObject());
    } catch {
      return value;
    }
  }

  const clean: Record<string, any> = {};
  for (const [key, child] of Object.entries(value as Record<string, any>)) {
    if (key.startsWith("$") || key.includes(".") || FORBIDDEN_KEYS.has(key)) {
      continue;
    }
    clean[key] = sanitizeValue(child);
  }
  return clean;
};

const safeSanitize = (target: any) => {
  if (target === undefined || target === null) return target;
  try {
    return sanitizeValue(target);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.warn(JSON.stringify({ event: "sanitize_failure", error: error.message }));
    return target;
  }
};

const sanitizeInPlace = (target: any) => {
  if (target === undefined || target === null) return target;
  if (typeof target !== "object") return target;

  const sanitized = safeSanitize(target);
  if (sanitized === target) return target;

  if (Array.isArray(target) && Array.isArray(sanitized)) {
    target.length = 0;
    target.push(...sanitized);
    return target;
  }

  const keys = Object.keys(target);
  for (const key of keys) {
    delete target[key];
  }
  Object.assign(target, sanitized);
  return target;
};

export default function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.body !== undefined && req.body !== null) {
      if (typeof req.body === "object") {
        sanitizeInPlace(req.body);
      } else {
        req.body = safeSanitize(req.body);
      }
    }

    const query = req.query as Record<string, any> | undefined;
    if (query && typeof query === "object") {
      sanitizeInPlace(query);
    }

    const params = req.params as Record<string, any> | undefined;
    if (params && typeof params === "object") {
      sanitizeInPlace(params);
    }

    next();
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    const errorEntry = {
      event: "sanitizeMiddleware error",
      method: req.method,
      path: req.path,
      error: error.message,
    };
    console.warn(JSON.stringify(errorEntry));
    return res.status(400).json({ ok: false, message: "Invalid request parameters" });
  }
}
