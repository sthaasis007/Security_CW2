"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivacyController = void 0;
const zod_1 = require("zod");
const privacy_service_1 = require("./privacy.service");
const activity_service_1 = require("../activity/activity.service");
const cookie_1 = require("../../utils/cookie");
const file_1 = require("../../utils/file");
const importSchema = zod_1.z.object({
    exportVersion: zod_1.z.number().int().optional(),
    profile: zod_1.z.object({ name: zod_1.z.string().trim().min(1).max(80) }).strict(),
}).strict();
const csvCell = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
exports.PrivacyController = {
    async exportData(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const data = await privacy_service_1.PrivacyService.exportForUser(userId);
        if (!data)
            return res.status(404).json({ ok: false, message: "Account not found" });
        const csv = req.query.format === "csv";
        res.setHeader("Cache-Control", "no-store");
        res.setHeader("Content-Disposition", `attachment; filename="personal-data.${csv ? "csv" : "json"}"`);
        if (csv) {
            res.type("text/csv");
            return res.send(`section,data\r\n${Object.entries(data).map(([key, value]) => `${csvCell(key)},${csvCell(JSON.stringify(value))}`).join("\r\n")}`);
        }
        return res.json(data);
    },
    async importData(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        if (!req.file)
            return res.status(400).json({ ok: false, message: "A JSON file is required" });
        let input;
        try {
            input = JSON.parse(req.file.buffer.toString("utf8"));
        }
        catch {
            return res.status(400).json({ ok: false, message: "Malformed JSON import" });
        }
        const parsed = importSchema.safeParse(input);
        if (!parsed.success)
            return res.status(400).json({ ok: false, message: "Invalid import schema" });
        const user = await privacy_service_1.PrivacyService.importProfile(userId, parsed.data.profile);
        if (!user)
            return res.status(404).json({ ok: false, message: "Account not found" });
        await activity_service_1.ActivityService.log("profile_imported", "Profile data imported", { importedFields: ["name"] }, req.user, req);
        return res.json({ ok: true, user });
    },
    async deleteAccount(req, res) {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ ok: false, message: "Unauthorized" });
        const deleted = await privacy_service_1.PrivacyService.deleteAccount(userId);
        if (!deleted)
            return res.status(404).json({ ok: false, message: "Account not found" });
        if (deleted.image)
            await (0, file_1.deleteUploadFile)(deleted.image);
        (0, cookie_1.clearSessionCookies)(res);
        await activity_service_1.ActivityService.log("account_deleted", "Account and related personal data deleted");
        return res.json({ ok: true, message: "Account and related data deleted" });
    },
};
//# sourceMappingURL=privacy.controller.js.map