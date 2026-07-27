import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const getJwtSecret = () => (process.env.JWT_SECRET || "change_me_local_secret") as string;

export interface JwtPayloadExtended {
  sub: string;
  email: string;
  role: string;
}

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const token = auth.split(" ")[1] as string;
  try {
    const payload = jwt.verify(token, getJwtSecret()) as unknown as JwtPayloadExtended;
    if (payload.role !== "admin") {
      return res.status(403).json({ ok: false, message: "Forbidden: admin only" });
    }
    // attach user info to request for downstream usage
    (req as any).user = payload;
    next();
  } catch (_err) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }
};

export default adminOnly;
