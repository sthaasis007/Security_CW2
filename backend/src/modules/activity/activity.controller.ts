import { Request, Response } from "express";
import { ActivityService } from "./activity.service";
import { sanitizeText } from "../../utils/security";

export const ActivityController = {
  async list(req: Request, res: Response) {
    try {
      const { action, user, search, from, to } = req.query as Record<string, string | undefined>;
      const filters: Record<string, any> = {};

      if (action) {
        const safeAction = sanitizeText(action);
        if (safeAction) filters.action = safeAction;
      }
      if (user) {
        const safeUser = sanitizeText(user);
        if (safeUser) {
          filters.$or = [
            { username: { $regex: safeUser.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
            { userEmail: { $regex: safeUser.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
          ];
        }
      }
      if (from || to) {
        filters.createdAt = {};
        if (from) filters.createdAt.$gte = new Date(from);
        if (to) filters.createdAt.$lte = new Date(to);
      }

      let activities;
      if (search) {
        const safeSearch = sanitizeText(search);
        activities = await ActivityService.search(safeSearch || "");
      } else {
        activities = await ActivityService.list(filters);
      }

      return res.status(200).json({ ok: true, activities });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error" });
    }
  },
};
