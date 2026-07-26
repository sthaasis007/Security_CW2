import { Request, Response, NextFunction } from "express";

// Simple in-memory rate limiter suitable for dev/testing. For production, use redis-backed limiter.
const stores = new Map<string, { count: number; firstSeen: number }>();

export default function rateLimit(options: { windowMs: number; max: number; keyPrefix?: string }) {
  const { windowMs, max, keyPrefix = "rl" } = options;
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const key = `${keyPrefix}:${req.ip}:${req.path}`;
      const now = Date.now();
      const entry = stores.get(key);
      if (!entry || now - entry.firstSeen > windowMs) {
        stores.set(key, { count: 1, firstSeen: now });
        return next();
      }
      entry.count += 1;
      if (entry.count > max) {
        res.status(429).json({ ok: false, message: "Too many requests, please try again later." });
        return;
      }
      next();
    } catch (e) {
      next();
    }
  };
}
