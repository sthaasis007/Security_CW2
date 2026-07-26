"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const activity_model_1 = require("./activity.model");
const sanitizeFilter = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
exports.ActivityRepository = {
    create: (data) => activity_model_1.ActivityModel.create(data),
    list: (filters = {}) => activity_model_1.ActivityModel.find(filters).sort({ createdAt: -1 }).lean(),
    search: async (query) => {
        const safeQuery = sanitizeFilter(query.trim());
        const regex = new RegExp(safeQuery, "i");
        return activity_model_1.ActivityModel.find({
            $or: [{ action: regex }, { description: regex }, { userEmail: regex }, { username: regex }],
        }).sort({ createdAt: -1 }).lean();
    },
};
//# sourceMappingURL=activity.repository.js.map