import { Request, Response } from "express";
import { z } from "zod";
import { PrivacyService } from "./privacy.service";
import { ActivityService } from "../activity/activity.service";
import { clearSessionCookies } from "../../utils/cookie";
import { deleteUploadFile } from "../../utils/file";

const importSchema = z.object({
  exportVersion: z.number().int().optional(),
  profile: z.object({ name: z.string().trim().min(1).max(80) }).strict(),
}).strict();
const csvCell = (value: unknown) => `"${String(value ?? "").replace(/"/g, '""')}"`;

export const PrivacyController = {
  async exportData(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const data = await PrivacyService.exportForUser(userId);
    if (!data) return res.status(404).json({ ok: false, message: "Account not found" });
    const csv = req.query.format === "csv";
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Content-Disposition", `attachment; filename="personal-data.${csv ? "csv" : "json"}"`);
    if (csv) {
      res.type("text/csv");
      return res.send(`section,data\r\n${Object.entries(data).map(([key, value]) => `${csvCell(key)},${csvCell(JSON.stringify(value))}`).join("\r\n")}`);
    }
    return res.json(data);
  },

  async importData(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    if (!(req as any).file) return res.status(400).json({ ok: false, message: "A JSON file is required" });
    let input: unknown;
    try {
      input = JSON.parse((req as any).file.buffer.toString("utf8"));
    } catch {
      return res.status(400).json({ ok: false, message: "Malformed JSON import" });
    }
    const parsed = importSchema.safeParse(input);
    if (!parsed.success) return res.status(400).json({ ok: false, message: "Invalid import schema" });
    const user = await PrivacyService.importProfile(userId, parsed.data.profile);
    if (!user) return res.status(404).json({ ok: false, message: "Account not found" });
    await ActivityService.log("profile_imported", "Profile data imported", { importedFields: ["name"] }, (req as any).user, req);
    return res.json({ ok: true, user });
  },

  async deleteAccount(req: Request, res: Response) {
    const userId = (req as any).user?.id;
    if (!userId) return res.status(401).json({ ok: false, message: "Unauthorized" });
    const deleted = await PrivacyService.deleteAccount(userId);
    if (!deleted) return res.status(404).json({ ok: false, message: "Account not found" });
    if (deleted.image) await deleteUploadFile(deleted.image);
    clearSessionCookies(res);
    await ActivityService.log("account_deleted", "Account and related personal data deleted");
    return res.json({ ok: true, message: "Account and related data deleted" });
  },
};
