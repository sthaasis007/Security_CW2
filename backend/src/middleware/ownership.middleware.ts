import { Request, Response, NextFunction } from "express";
import { isValidObjectId } from "../utils/security";

export const requireOwnershipOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const currentUser = (req as any).user as { sub?: string; id?: string; role?: string } | undefined;
  const targetId = req.params?.id;

  if (!currentUser?.sub && !currentUser?.id) {
    return res.status(401).json({ ok: false, message: "Unauthorized" });
  }

  if (!targetId || !isValidObjectId(targetId)) {
    return res.status(400).json({ ok: false, message: "Invalid resource id" });
  }

  const requesterId = currentUser.sub || currentUser.id;
  if (currentUser.role === "admin" || requesterId === targetId) {
    return next();
  }

  return res.status(403).json({ ok: false, message: "Forbidden" });
};

export default requireOwnershipOrAdmin;
