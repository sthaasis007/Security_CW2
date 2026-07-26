import { Request, Response } from "express";
import { ActivityService } from "./activity.service";

export const ActivityController = {
  async list(req: Request, res: Response) {
    try {
      const { action, user, search, from, to } = req.query as Record<string, string | undefined>;
      const filters: Record<string, any> = {};

      if (action) filters.action = action;
      if (user) {
        filters.$or = [
          { username: { $regex: user, $options: "i" } },
          { userEmail: { $regex: user, $options: "i" } },
        ];
      }
      if (from || to) {
        filters.createdAt = {};
        if (from) filters.createdAt.$gte = new Date(from);
        if (to) filters.createdAt.$lte = new Date(to);
      }

      let activities;
      if (search) {
        activities = await ActivityService.search(search);
      } else {
        activities = await ActivityService.list(filters);
      }

      return res.status(200).json({ ok: true, activities });
    } catch (err) {
      return res.status(500).json({ ok: false, message: "Server error", err });
    }
  },
};
