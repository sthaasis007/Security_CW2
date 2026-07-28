import { Request, Response } from "express";
import { ActivityService } from "./activity.service";
import { sanitizeText } from "../../utils/security";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const ActivityController = {
  async list(req: Request, res: Response) {
    try {
      const { action, user, search, from, to, severity, alert } = req.query as Record<string, string | undefined>;
      const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
      const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || "25"), 10) || 25));
      const filters: Record<string, any> = {};

      const safeAction = action ? sanitizeText(action) : null;
      if (safeAction) filters.action = safeAction;
      if (severity && ["info", "warning", "critical"].includes(severity)) filters.severity = severity;
      if (alert === "true" || alert === "false") filters.alert = alert === "true";

      const terms: any[] = [];
      const safeUser = user ? sanitizeText(user) : null;
      if (safeUser) {
        const regex = new RegExp(escapeRegex(safeUser), "i");
        terms.push({ $or: [{ username: regex }, { userEmail: regex }] });
      }
      const safeSearch = search ? sanitizeText(search) : null;
      if (safeSearch) {
        const regex = new RegExp(escapeRegex(safeSearch), "i");
        terms.push({ $or: [{ action: regex }, { description: regex }, { userEmail: regex }, { username: regex }] });
      }
      if (terms.length) filters.$and = terms;

      if (from || to) {
        filters.createdAt = {};
        if (from && !Number.isNaN(Date.parse(from))) filters.createdAt.$gte = new Date(from);
        if (to && !Number.isNaN(Date.parse(to))) filters.createdAt.$lte = new Date(to);
      }
      const result = await ActivityService.list(filters, page, limit);
      return res.status(200).json({ ok: true, ...result });
    } catch {
      return res.status(500).json({ ok: false, message: "Unable to load audit events." });
    }
  },
};
