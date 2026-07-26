"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const activity_service_1 = require("./activity.service");
exports.ActivityController = {
    async list(req, res) {
        try {
            const { action, user, search, from, to } = req.query;
            const filters = {};
            if (action)
                filters.action = action;
            if (user) {
                filters.$or = [
                    { username: { $regex: user, $options: "i" } },
                    { userEmail: { $regex: user, $options: "i" } },
                ];
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
                activities = await activity_service_1.ActivityService.search(search);
            }
            else {
                activities = await activity_service_1.ActivityService.list(filters);
            }
            return res.status(200).json({ ok: true, activities });
        }
        catch (err) {
            return res.status(500).json({ ok: false, message: "Server error", err });
        }
    },
};
//# sourceMappingURL=activity.controller.js.map