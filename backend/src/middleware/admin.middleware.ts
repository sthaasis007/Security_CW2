import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRepository } from "../modules/auth/auth.repository";
import { isValidObjectId } from "../utils/security";
import { getJwtSecret } from "../config/security";

export interface JwtPayloadExtended {
  sub: string;
  email: string;
  role: string;
}

export const adminOnly = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const token = auth.split(" ")[1] as string;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as JwtPayloadExtended;
    if (!payload.sub || !isValidObjectId(payload.sub)) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    const user = await AuthRepository.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Forbidden: admin only" });
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
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
};

export default adminOnly;
