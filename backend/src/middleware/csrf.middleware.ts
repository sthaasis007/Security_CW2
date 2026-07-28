import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../modules/auth/auth.repository";
import { getJwtSecret } from "../config/security";

// Validate CSRF token for authenticated state-changing requests.
export default async function csrfMiddleware(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toUpperCase();
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(method)) return next();

  const token = (req.headers["x-csrf-token"] as string) || (req.headers["x-xsrf-token"] as string) || null;

  // determine user id from Authorization header if present
  const auth = req.headers.authorization;
  let userId: string | null = null;
  try {
    if (auth && auth.startsWith("Bearer ")) {
      const raw = auth.split(" ")[1];
      if (raw) {
        const payload: any = jwt.verify(raw, getJwtSecret() as jwt.Secret);
        userId = payload.sub || payload.id || null;
      }
    }
  } catch (e) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }

  // If request is unauthenticated, skip CSRF validation (we protect authenticated state-changing requests)
  if (!userId) return next();

  if (!token) return res.status(403).json({ ok: false, message: "Missing CSRF token" });

  try {
    const user = await AuthRepository.findById(userId);
    if (!user) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const stored = (user as any).csrfTokenHash;
    const expiresAt = (user as any).csrfTokenExpiresAt ? new Date((user as any).csrfTokenExpiresAt) : null;
    if (!stored || (expiresAt && expiresAt < new Date())) {
      return res.status(403).json({ ok: false, message: "CSRF token not set or expired" });
    }
    const hash = require("crypto").createHash("sha256").update(token).digest("hex");
    if (hash !== stored) return res.status(403).json({ ok: false, message: "Invalid CSRF token" });
    next();
  } catch (err) {
    console.error("csrfMiddleware error", err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
}
