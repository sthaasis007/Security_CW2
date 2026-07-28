import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../modules/auth/auth.repository";
import { isValidObjectId } from "../utils/security";
import { getJwtSecret } from "../config/security";
import { ACCESS_COOKIE, readCookie } from "../utils/cookie";
import { ActivityService } from "../modules/activity/activity.service";

const deny = async (req: Request, res: Response, status: 401 | 403, reason: string, user?: any) => {
  await ActivityService.log(
    "authorization_denied",
    "Administrative access denied",
    { reason, method: req.method, path: req.path },
    user ? { id: user._id?.toString(), email: user.email, username: user.name, role: user.role } : undefined,
    req,
  ).catch(() => undefined);
  return res.status(status).json({ ok: false, message: status === 403 ? "Forbidden: admin only" : "Unauthorized" });
};

export interface JwtPayloadExtended {
  sub: string;
  email?: string;
  role?: string;
  sv?: number;
}

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : readCookie(req, ACCESS_COOKIE);
  if (!token) {
    return deny(req, res, 401, "missing_session");
  }
  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as JwtPayloadExtended;
    if (!payload.sub || !isValidObjectId(payload.sub)) {
      return deny(req, res, 401, "invalid_subject");
    }
    const user = await AuthRepository.findById(payload.sub);
    if (!user) {
      return deny(req, res, 401, "unknown_user");
    }
    if ((payload.sv || 0) !== ((user as any).sessionVersion || 0)) {
      return deny(req, res, 401, "invalidated_session", user);
    }
    if (user.role !== "admin") {
      return deny(req, res, 403, "insufficient_role", user);
    }
    (req as any).user = {
      id: payload.sub,
      sub: payload.sub,
      email: user.email,
      username: user.name || null,
      role: user.role,
    };
    next();
  } catch (_err) {
    return deny(req, res, 401, "invalid_session");
  }
};

export default adminOnly;
