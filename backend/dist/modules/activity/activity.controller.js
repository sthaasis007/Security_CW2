"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("./activity.service");
const security_1 = require("../../utils/security");
exports.ActivityController = {
    async list(req, res) {
        try {
            const { action, user, search, from, to } = req.query;
            const filters = {};
            if (action) {
                const safeAction = (0, security_1.sanitizeText)(action);
                if (safeAction)
                    filters.action = safeAction;
            }
            if (user) {
                const safeUser = (0, security_1.sanitizeText)(user);
                if (safeUser) {
                    filters.$or = [
                        { username: { $regex: safeUser.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
                        { userEmail: { $regex: safeUser.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" } },
                    ];
                }
            }
            if (from || to) {
                filters.createdAt = {};
                if (from)
                    filters.createdAt.$gte = new Date(from);
                if (to)
                    filters.createdAt.$lte = new Date(to);
            }
            let activities;
            if (search) {
                const safeSearch = (0, security_1.sanitizeText)(search);
                activities = await activity_service_1.ActivityService.search(safeSearch || "");
            }
            else {
                activities = await activity_service_1.ActivityService.list(filters);
            }
            return res.status(200).json({ ok: true, activities });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error" });
        }
    },
};
//# sourceMappingURL=activity.controller.js.map