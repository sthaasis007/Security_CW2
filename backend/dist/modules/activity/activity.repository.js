"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRepository = void 0;
const activity_model_1 = require("./activity.model");
exports.ActivityRepository = {
    create: (data) => activity_model_1.ActivityModel.create(data),
    countRecent: (action, userId, since) => activity_model_1.ActivityModel.countDocuments({ action, userId, createdAt: { $gte: since } }),
    async list(filters, page, limit) {
        const [activities, total] = await Promise.all([
            activity_model_1.ActivityModel.find(filters).select("+integrityHash").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(),
            activity_model_1.ActivityModel.countDocuments(filters),
        ]);
        return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)), activities };
    },
};
//# sourceMappingURL=activity.repository.js.map