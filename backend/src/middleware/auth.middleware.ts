import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayloadExtended } from "./admin.middleware";
import { AuthRepository } from "../modules/auth/auth.repository";

export const authOnly = async (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  const token = auth.split(" ")[1] as string;
  try {
    const secret = (process.env.JWT_SECRET || "change_me_local_secret") as string;
    const payload = jwt.verify(token, secret) as unknown as JwtPayloadExtended;
    
    // Fetch full user data to get username and other fields
    const user = await AuthRepository.findById(payload.sub);
    
    (req as any).user = {
      ...payload,
      id: payload.sub,
      username: user?.name || null,
    };
    next();
  } catch (_err) {
    return res.status(401).json({ ok: false, message: "Invalid token" });
  }
};

export default authOnly;
