"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("./activity.service");
const security_1 = require("../../utils/security");
const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
exports.ActivityController = {
    async list(req, res) {
        try {
            const { action, user, search, from, to, severity, alert } = req.query;
            const page = Math.max(1, Number.parseInt(String(req.query.page || "1"), 10) || 1);
            const limit = Math.min(100, Math.max(1, Number.parseInt(String(req.query.limit || "25"), 10) || 25));
            const filters = {};
            const safeAction = action ? (0, security_1.sanitizeText)(action) : null;
            if (safeAction)
                filters.action = safeAction;
            if (severity && ["info", "warning", "critical"].includes(severity))
                filters.severity = severity;
            if (alert === "true" || alert === "false")
                filters.alert = alert === "true";
            const terms = [];
            const safeUser = user ? (0, security_1.sanitizeText)(user) : null;
            if (safeUser) {
                const regex = new RegExp(escapeRegex(safeUser), "i");
                terms.push({ $or: [{ username: regex }, { userEmail: regex }] });
            }
            const safeSearch = search ? (0, security_1.sanitizeText)(search) : null;
            if (safeSearch) {
                const regex = new RegExp(escapeRegex(safeSearch), "i");
                terms.push({ $or: [{ action: regex }, { description: regex }, { userEmail: regex }, { username: regex }] });
            }
            if (terms.length)
                filters.$and = terms;
            if (from || to) {
                filters.createdAt = {};
                if (from && !Number.isNaN(Date.parse(from)))
                    filters.createdAt.$gte = new Date(from);
                if (to && !Number.isNaN(Date.parse(to)))
                    filters.createdAt.$lte = new Date(to);
            }
            const result = await activity_service_1.ActivityService.list(filters, page, limit);
            return res.status(200).json({ ok: true, ...result });
        }
        catch {
            return res.status(500).json({ ok: false, message: "Unable to load audit events." });
        }
    },
};
//# sourceMappingURL=activity.controller.js.map